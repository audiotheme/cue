var Workflows,
	_ = require( 'underscore' ),
	cue = require( 'cue' ),
	l10n = require( 'cue' ).l10n,
	MediaFrame = require( '../views/media-frame' ),
	wp = require( 'wp' ),
	Attachment = wp.media.model.Attachment;

Workflows = {
	frames: [],
	model: {},

	/**
	 * Set a model for the current workflow.
	 *
	 * @param {Object} frame
	 */
	setModel: function( model ) {
		this.model = model;
		return this;
	},

	/**
	 * Retrieve or create a frame instance for a particular workflow.
	 *
	 * @param {string} id Frame identifer.
	 */
	get: function( id )  {
		var method = '_' + id,
			frame = this.frames[ method ] || null;

		// Always call the frame method to perform any routine set up. The
		// frame method should short-circuit before being initialized again.
		frame = this[ method ].call( this, frame );

		// Store the frame for future use.
		this.frames[ method ] = frame;

		return frame;
	},

	/**
	 * Workflow for adding tracks to the playlist.
	 *
	 * @param {Object} frame
	 */
	_addTracks: function( frame ) {
		// Return the existing frame for this workflow.
		if ( frame ) {
			return frame;
		}

		// Initialize the audio frame.
		frame = new MediaFrame({
			title: l10n.workflows.addTracks.frameTitle,
			library: {
				type: 'audio'
			},
			button: {
				text: l10n.workflows.addTracks.frameButtonText
			},
			multiple: 'add'
		});

		// Set the extensions that can be uploaded.
		frame.uploader.options.uploader.plupload = {
			filters: {
				mime_types: [{
					title: l10n.workflows.addTracks.fileTypes,
					extensions: 'm4a,mp3,ogg,wma'
				}]
			}
		};

		// Prevent the Embed controller scanner from changing the state.
		frame.state( 'embed' ).props.off( 'change:url', frame.state( 'embed' ).debouncedScan );

		// Insert each selected attachment as a new track model.
		frame.state( 'insert' ).on( 'insert', function( selection ) {
			_.each( selection.models, function( attachment ) {
				cue.tracks.push( attachment.toJSON().cue );
			});
		});

		// Insert the embed data as a new model.
		frame.state( 'embed' ).on( 'select', function() {

			var embed = this.props.toJSON(),
				track = {
					audioId: '',
					audioUrl: embed.url
				};

			if ( ( 'title' in embed ) && '' !== embed.title ) {
				track.title = embed.title;
			}

			cue.tracks.push( track );
		});

		return frame;
	},

	/**
	 * Workflow for selecting track artwork image.
	 *
	 * @param {Object} frame
	 */
	_selectArtwork: function( frame ) {
		var workflow = this;

		// Return existing frame for this workflow.
		if ( frame ) {
			return frame;
		}

		// Initialize the artwork frame.
		frame = wp.media({
			title: l10n.workflows.selectArtwork.frameTitle,
			library: {
				type: 'image'
			},
			button: {
				text: l10n.workflows.selectArtwork.frameButtonText
			},
			multiple: false
		});

		// Set the extensions that can be uploaded.
		frame.uploader.options.uploader.plupload = {
			filters: {
				mime_types: [{
					files: l10n.workflows.selectArtwork.fileTypes,
					extensions: 'jpg,jpeg,gif,png'
				}]
			}
		};

		// Automatically select the existing artwork if possible.
		frame.on( 'open', function() {
			var selection = this.get( 'library' ).get( 'selection' ),
				artworkId = workflow.model.get( 'artworkId' ),
				attachments = [];

			if ( artworkId ) {
				attachments.push( Attachment.get( artworkId ) );
				attachments[0].fetch();
			}

			selection.reset( attachments );
		});

		// Set the model's artwork ID and url properties.
		frame.state( 'library' ).on( 'select', function() {
			var attachment = this.get( 'selection' ).first().toJSON();

			workflow.model.set({
				artworkId: attachment.id,
				artworkUrl: attachment.sizes.cue.url
			});
		});

		return frame;
	},

	/**
	 * Workflow for selecting track audio.
	 *
	 * @param {Object} frame
	 */
	_selectAudio: function( frame ) {
		var workflow = this;

		// Return the existing frame for this workflow.
		if ( frame ) {
			return frame;
		}

		// Initialize the audio frame.
		frame = new MediaFrame({
			title: l10n.workflows.selectAudio.frameTitle,
			library: {
				type: 'audio'
			},
			button: {
				text: l10n.workflows.selectAudio.frameButtonText
			},
			multiple: false
		});

		// Set the extensions that can be uploaded.
		frame.uploader.options.uploader.plupload = {
			filters: {
				mime_types: [{
					title: l10n.workflows.selectAudio.fileTypes,
					extensions: 'm4a,mp3,ogg,wma'
				}]
			}
		};

		// Prevent the Embed controller scanner from changing the state.
		frame.state( 'embed' ).props.off( 'change:url', frame.state( 'embed' ).debouncedScan );

		// Set the frame state when opening it.
		frame.on( 'open', function() {
			var selection = this.get( 'insert' ).get( 'selection' ),
				audioId = workflow.model.get( 'audioId' ),
				audioUrl = workflow.model.get( 'audioUrl' ),
				isEmbed = audioUrl && ! audioId,
				attachments = [];

			// Automatically select the existing audio file if possible.
			if ( audioId ) {
				attachments.push( Attachment.get( audioId ) );
				attachments[0].fetch();
			}

			selection.reset( attachments );

			// Set the embed state properties.
			if ( isEmbed ) {
				this.get( 'embed' ).props.set({
					url: audioUrl,
					title: workflow.model.get( 'title' )
				});
			} else {
				this.get( 'embed' ).props.set({
					url: '',
					title: ''
				});
			}

			// Set the state to 'embed' if the model has an audio URL but
			// not a corresponding attachment ID.
			frame.setState( isEmbed ? 'embed' : 'insert' );
		});

		// Copy data from the selected attachment to the current model.
		frame.state( 'insert' ).on( 'insert', function( selection ) {
			var attachment = selection.first().toJSON().cue,
				data = {},
				keys = _.keys( workflow.model.attributes );

			// Attributes that shouldn't be updated when inserting an
			// audio attachment.
			_.without( keys, [ 'id', 'order' ] );

			// Update these attributes if they're empty.
			// They shouldn't overwrite any data entered by the user.
			_.each( keys, function( key ) {
				var value = workflow.model.get( key );

				if ( ! value && ( key in attachment ) && value !== attachment[ key ] ) {
					data[ key ] = attachment[ key ];
				}
			});

			// Attributes that should always be replaced.
			data.audioId  = attachment.audioId;
			data.audioUrl = attachment.audioUrl;

			workflow.model.set( data );
		});

		// Copy the embed data to the current model.
		frame.state( 'embed' ).on( 'select', function() {
			var embed = this.props.toJSON(),
				data = {};

			data.audioId  = '';
			data.audioUrl = embed.url;

			if ( ( 'title' in embed ) && '' !== embed.title ) {
				data.title = embed.title;
			}

			workflow.model.set( data );
		});

		// Remove an empty model if the frame is escaped.
		frame.on( 'escape', function() {
			var model = workflow.model.toJSON();

			if ( ! model.artworkUrl && ! model.audioUrl ) {
				workflow.model.destroy();
			}
		});

		return frame;
	}
};

module.exports = Workflows;
