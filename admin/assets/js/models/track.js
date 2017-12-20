import Backbone from 'backbone';

export const Track = Backbone.Model.extend({
	defaults: {
		artist: '',
		artworkId: '',
		artworkUrl: '',
		audioId: '',
		audioUrl: '',
		format: '',
		length: '',
		title: '',
		order: 0
	}
});
