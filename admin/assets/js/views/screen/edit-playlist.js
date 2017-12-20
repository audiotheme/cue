import $ from 'jquery';
import wp from 'wp';

import { AddTracksButton } from './button/add-tracks';
import { TrackList } from '../edit-playlist/track-list';

export const EditPlaylistScreen = wp.Backbone.View.extend({
	saved: false,

	events: {
		'click #publish': 'buttonClick',
		'click #save-post': 'buttonClick'
	},

	initialize: function( options ) {
		this.l10n = options.l10n;
	},

	render: function() {
		this.views.add( '#cue-playlist-editor .cue-panel-body', [
			new AddTracksButton({
				collection: this.collection,
				l10n: this.l10n
			}),
			new TrackList({
				collection: this.collection
			})
		]);

		return this;
	},

	buttonClick: function( e ) {
		const $button = $( e.target );

		if ( ! this.saved ) {
			this.collection.save().done( data => {
				this.saved = true;
				$button.click();
			});
		}

		return this.saved;
	}
});
