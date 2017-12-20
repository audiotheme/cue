/* global _cueMediaSettings */

import wp from 'wp';

import cue from 'cue';
import PostFrame from './views/frame/insert-playlist';

cue.config( _cueMediaSettings );

wp.media.view.MediaFrame.Post = PostFrame;
