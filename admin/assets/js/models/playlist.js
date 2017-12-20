import Backbone from 'backbone';

export const Playlist = Backbone.Model.extend({
	defaults: {
		thumbnail: '',
		title: ''
	}
});
