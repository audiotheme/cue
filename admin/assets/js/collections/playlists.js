import Backbone from 'backbone';

import { Playlist } from '../models/playlist';

export const Playlists = Backbone.Collection.extend({
	model: Playlist
});
