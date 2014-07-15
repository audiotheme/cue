/*global _:false, cue:false, mejs:false, wp:false */

window.cue = window.cue || {};

(function( window, $, _, mejs, wp, undefined ) {
	'use strict';

	var l10n = cue.data.l10n,
		workflows;

	workflows = cue.workflows = cue.workflows || {};


	/**
	 * ========================================================================
	 * VIEWS
	 * ========================================================================
	 */

	/**
	 * cue.view.MediaFrame
	 */
	cue.view.MediaFrame = wp.media.view.MediaFrame.Post.extend({
		createStates: function() {
			var options = this.options;

			// Add the default states.
			this.states.add([
				// Main states.
				new wp.media.controller.Library({
					id: 'insert',
					title: this.options.title,
					priority: 20,
					toolbar: 'main-insert',
					filterable: 'uploaded',
					library: wp.media.query( options.library ),
					multiple: options.multiple ? 'reset' : false,
					editable: false,

					// If the user isn't allowed to edit fields,
					// can they still edit it locally?
					allowLocalEdits: true,

					// Show the attachment display settings.
					displaySettings: false,
					// Update user settings when users adjust the
					// attachment display settings.
					displayUserSettings: false
				}),

				// Embed states.
				new wp.media.controller.Embed({
					title: l10n.addFromUrl,
					menuItem: { text: l10n.addFromUrl, priority: 120 },
					type: 'link'
				})
			]);
		},

		bindHandlers: function() {
			wp.media.view.MediaFrame.Select.prototype.bindHandlers.apply( this, arguments );
			this.on( 'toolbar:create:main-insert', this.createToolbar, this );
			this.on( 'toolbar:create:main-embed', this.mainEmbedToolbar, this );

			var handlers = {
					menu: {
						'default': 'mainMenu'
					},

					content: {
						'embed': 'embedContent',
						'edit-selection': 'editSelectionContent'
					},

					toolbar: {
						'main-insert': 'mainInsertToolbar'
					}
				};

			_.each( handlers, function( regionHandlers, region ) {
				_.each( regionHandlers, function( callback, handler ) {
					this.on( region + ':render:' + handler, this[ callback ], this );
				}, this );
			}, this );
		},

		// Toolbars.
		mainInsertToolbar: function( view ) {
			var controller = this;

			this.selectionStatusToolbar( view );

			view.set( 'insert', {
				style: 'primary',
				priority: 80,
				text: controller.options.button.text,
				requires: { selection: true },

				click: function() {
					var state = controller.state(),
						selection = state.get( 'selection' );

					controller.close();
					state.trigger( 'insert', selection ).reset();
				}
			});
		},

		mainEmbedToolbar: function( toolbar ) {
			toolbar.view = new wp.media.view.Toolbar.Embed({
				controller: this,
				text: this.options.button.text
			});
		}
	});

	/**
	 * cue.view.PostForm
	 */
	cue.view.PostForm = wp.Backbone.View.extend({
		el: '#post',
		saved: false,

		events: {
			'click #publish': 'buttonClick',
			'click #save-post': 'buttonClick'
			//'submit': 'submit'
		},

		initialize: function() {
			this.render();
		},

		render: function() {
			this.views.add( '#cue-section', [
				new cue.view.AddTracksButton({
					collection: this.collection
				}),

				new cue.view.TrackList({
					collection: this.collection
				})
			]);

			return this;
		},

		buttonClick: function( e ) {
			var self = this,
				$button = $( e.target ),
				$spinner = $button.siblings( '.spinner' );

			if ( ! self.saved ) {
				this.collection.save().done(function( data ) {
					self.saved = true;
					$button.click();
				}).fail(function() {
					//$button.prop( 'disabled', false );
					//$spinner.hide();
				});
			}

			return self.saved;
		}
	});

	/**
	 * cue.view.AddTracksButton
	 */
	cue.view.AddTracksButton = wp.Backbone.View.extend({
		id: 'add-tracks',
		tagName: 'p',

		events: {
			'click .button': 'click'
		},

		render: function() {
			var $button = $( '<a />', {
				text: l10n.addTracks
			}).addClass( 'button button-secondary' );

			this.$el.html( $button );

			return this;
		},

		click: function( e ) {
			e.preventDefault();
			workflows.get( 'addTracks' ).open();
		}
	});

	/**
	 * cue.view.TrackList
	 */
	cue.view.TrackList = wp.Backbone.View.extend({
		className: 'cue-tracklist',
		tagName: 'ol',

		initialize: function() {
			this.listenTo( this.collection, 'add', this.addTrack );
			this.listenTo( this.collection, 'add remove', this.updateOrder );
			this.listenTo( this.collection, 'reset', this.render );

			this.render().$el.sortable( {
				axis: 'y',
				delay: 150,
				forceHelperSize: true,
				forcePlaceholderSize: true,
				opacity: 0.6,
				start: function( e, ui ) {
					ui.placeholder.css( 'visibility', 'visible' );
				},
				update: _.bind(function( e, ui ) {
					this.updateOrder();
				}, this )
			} );
		},

		render: function() {
			this.$el.empty();
			this.collection.each( this.addTrack, this );
			this.updateOrder();
			return this;
		},

		addTrack: function( track ) {
			var trackView = new cue.view.Track({ model: track });
			this.$el.append( trackView.render().el );
		},

		updateOrder: function() {
			_.each( this.$el.find( '.cue-track' ), function( item, i ) {
				var cid = $( item ).data( 'cid' );
				this.collection.get( cid ).set( 'order', i );
			}, this );
		}
	});

	/**
	 * cue.view.Track
	 */
	cue.view.Track = wp.Backbone.View.extend({
		tagName: 'li',
		className: 'cue-track',
		template: wp.template( 'cue-playlist-track' ),

		events: {
			'change [data-setting]': 'updateAttribute',
			'click .js-toggle': 'toggleOpenStatus',
			'dblclick .cue-track-title': 'toggleOpenStatus',
			'click .js-close': 'minimize',
			'click .js-remove': 'destroy'
		},

		initialize: function() {
			this.listenTo( this.model, 'change:title', this.updateTitle );
			this.listenTo( this.model, 'change', this.updateFields );
			this.listenTo( this.model, 'destroy', this.remove );
		},

		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) ).data( 'cid', this.model.cid );

			this.views.add( '.cue-track-column-artwork', new cue.view.TrackArtwork({
				model: this.model,
				parent: this
			}));

			this.views.add( '.cue-track-audio-group', new cue.view.TrackAudio({
				model: this.model,
				parent: this
			}));

			return this;
		},

		minimize: function( e ) {
			e.preventDefault();
			this.$el.removeClass( 'is-open' ).find( 'input:focus' ).blur();
		},

		toggleOpenStatus: function( e ) {
			e.preventDefault();
			this.$el.toggleClass( 'is-open' ).find( 'input:focus' ).blur();

			// Trigger a resize so the media element will fill the container.
			if ( this.$el.hasClass( 'is-open' ) ) {
				$( window ).trigger( 'resize' );
			}
		},

		/**
		 * Update a model attribute when a field is changed.
		 *
		 * Fields with a 'data-setting="{{key}}"' attribute whose value
		 * corresponds to a model attribute will be automatically synced.
		 *
		 * @param {Object} e Event object.
		 */
		updateAttribute: function( e ) {
			var attribute = $( e.target ).data( 'setting' ),
				value = e.target.value;

			if ( this.model.get( attribute ) !== value ) {
				this.model.set( attribute, value );
			}
		},

		/**
		 * Update a setting field when a model's attribute is changed.
		 */
		updateFields: function() {
			var track = this.model.toJSON(),
				$settings = this.$el.find( '[data-setting]' ),
				attribute, value;

			// A change event shouldn't be triggered here, so it won't cause
			// the model attribute to be updated and get stuck in an
			// infinite loop.
			for ( attribute in track ) {
				// Decode HTML entities.
				value = $( '<div/>' ).html( track[ attribute ] ).text();
				$settings.filter( '[data-setting="' + attribute + '"]' ).val( value );
			}
		},

		updateTitle: function() {
			var title = this.model.get( 'title' );
			this.$el.find( '.cue-track-title .text' ).text( title ? title : 'Title' );
		},

		/**
		 * Destroy the view's model.
		 *
		 * Avoid syncing to the server by triggering an event instead of
		 * calling destroy() directly on the model.
		 */
		destroy: function() {
			this.model.trigger( 'destroy', this.model );
		},

		remove: function() {
			this.$el.remove();
		}
	});

	/**
	 * cue.view.TrackArtwork
	 */
	cue.view.TrackArtwork = wp.Backbone.View.extend({
		tagName: 'span',
		className: 'cue-track-artwork',
		template: wp.template( 'cue-playlist-track-artwork' ),

		events: {
			'click': 'select'
		},

		initialize: function( options ) {
			this.parent = options.parent;
			this.listenTo( this.model, 'change:artworkUrl', this.render );
		},

		render: function() {
			this.$el.html( this.template( this.model.toJSON() ) );
			this.parent.$el.toggleClass( 'has-artwork', ! _.isEmpty( this.model.get( 'artworkUrl' ) ) );
			return this;
		},

		select: function() {
			workflows.setModel( this.model ).get( 'selectArtwork' ).open();
		}
	});

	/**
	 * cue.view.TrackAudio
	 */
	cue.view.TrackAudio = wp.Backbone.View.extend({
		tagName: 'span',
		className: 'cue-track-audio',
		template: wp.template( 'cue-playlist-track-audio' ),

		events: {
			'click .cue-track-audio-selector': 'select'
		},

		initialize: function( options ) {
			this.parent = options.parent;
			this.listenTo( this.model, 'change:audioUrl', this.refresh );
			this.listenTo( this.model, 'destroy', this.cleanup );
		},

		render: function() {
			var track = this.model.toJSON(),
				playerId = this.$el.find( '.mejs-audio' ).attr( 'id' ),
				$mediaEl, playerSettings;

			// Remove the MediaElement player object if the
			// audio file URL is empty.
			if ( '' === track.audioUrl && playerId ) {
				mejs.players[ playerId ].remove();
			}

			// Render the media element.
			this.$el.html( this.template( this.model.toJSON() ) );

			// Set up MediaElement.js.
			$mediaEl = this.$el.find( '.cue-audio' );
			if ( $mediaEl.length ) {
				// MediaElement traverses the DOM and throws an error if it
				// can't find a parent node before reaching <body>. It makes
				// sure the flash fallback won't exist within a <p> tag.

				// The view isn't attached to the DOM at this point, so an
				// error is thrown when reaching the top of the tree.

				// This hack makes it stop searching. The fake <body> tag is
				// removed in the success callback.
				// @see mediaelement-and-player.js:~1222
				$mediaEl.wrap( '<body></body>' );

				playerSettings = {
					//enablePluginDebug: true,
					features: ['playpause', 'current', 'progress', 'duration'],
					pluginPath: cue.data.settings.pluginPath,
					success: _.bind( function( mediaElement, domObject, t ) {
						var $fakeBody = $( t.container ).parent();

						// Allow current time bar to be skinned
						// based on the admin color scheme.
						t.current.removeClass( 'mejs-time-current' ).addClass( 'cuemejs-time-current wp-ui-highlight' );

						// Remove the fake <body> tag.
						if ( $.nodeName( $fakeBody.get( 0 ), 'body' ) ) {
							$fakeBody.replaceWith( $fakeBody.get( 0 ).childNodes );
						}
					}, this ),
					error: function( el ) {
						var $el = $( el ),
							$parent = $el.closest( '.cue-track' ),
							playerId = $el.closest( '.mejs-audio' ).attr( 'id' );

						// Remove the audio element if there is an error.
						mejs.players[ playerId ].remove();
						$parent.find( 'audio' ).remove();
					}
				};

				// Hack to allow .m4a files.
				// @link https://github.com/johndyer/mediaelement/issues/291
				if ( 'm4a' === $mediaEl.attr( 'src' ).split( '.' ).pop() ) {
					playerSettings.pluginVars = 'isvideo=true';
				}

				$mediaEl.mediaelementplayer( playerSettings );
			}

			return this;
		},

		refresh: function( e ) {
			var track = this.model.toJSON(),
				playerId = this.$el.find( '.mejs-audio' ).attr(' id' ),
				player = playerId ? mejs.players[ playerId ] : null;

			if ( player && '' !== track.audioUrl ) {
				player.pause();
				player.setSrc( track.audioUrl );
			} else {
				this.render();
			}
		},

		cleanup: function() {
			var track = this.model.toJSON(),
				playerId = this.$el.find( '.mejs-audio' ).attr( 'id' ),
				player = playerId ? mejs.players[ playerId ] : null;

			if ( player ) {
				player.remove();
			}
		},

		select: function() {
			workflows.setModel( this.model ).get( 'selectAudio' ).open();
		}
	});

})( this, jQuery, _, mejs, wp );
