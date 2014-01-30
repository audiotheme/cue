=== Cue ===
Contributors: audiotheme, bradyvercher, brodyvercher
Tags: playlist, audio, music, mp3, tracks, player
Requires at least: 3.8
Tested up to: 3.8.1
Stable tag: trunk
License: GPL-2.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Create beautiful, fully responsive audio playlists.

== Description ==

Cue gives you the ability to easily create stylish playlists and display them anywhere on your site using a widget, shortcode or template tag. Upload new audio files, reuse existing files in your media library, or even link to remote sources.

* Reorder tracks with a simple drag and drop interface.
* Seamlessly integrates with WordPress' media manager to select audio and images.
* Completely responsive to work on any device that supports your chosen audio format.

= AudioTheme Integration =

Cue was originally built for the [AudioTheme Framework](http://audiotheme.com/), but we wanted everyone to have the ability to easily create beautiful playlists, so we're releasing it free for general use. Additional integration is built into our framework to extend Cue and allow tracks in your discography to be used as sources for playlist tracks.

= Support Policy =

We'll do our best to keep this plugin up to date, fix bugs and implement features when possible, but technical support will only be provided for active AudioTheme customers. If you enjoy this plugin and would like to support its development, you can:

* [Check out AudioTheme](http://audiotheme.com/) and tell your friends!
* Help out on the [support forums](http://wordpress.org/support/plugin/cue).
* Consider [contributing on GitHub](https://github.com/audiotheme/cue).
* [Leave a review](http://wordpress.org/support/view/plugin-reviews/cue#postform) and let everyone know how much you love it.
* [Follow @AudioTheme](https://twitter.com/AudioTheme) on Twitter.

== Installation ==

Install Cue like any other plugin. [Check out the codex](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins) if you have any questions.

= Usage =

After installing and activating Cue, a new menu item labelled **Playlists** will be available. Create a new playlist and add tracks by uploading or selecting existing audio files to add (remote sources can be used as well). Track details are populated automatically using tags in the audio file, but the details may also be managed manually.

**Shortcode**

To display a playlist in a post, page or CPT, insert the `[cue]` shortcode into the editor and specify the playlist id as an attribute. When editing a playlist, the shortcode is available for copying in a meta box just under the publish button.

**Widget**

Visit **Appearance &rarr; Widgets** and add the Playlist widget to a sidebar. Enter a widget title if desired and select the playlist you want to display. That's it!

**Template Tag**

For more fine-grained control over where the playlist appears, a template tag is available.

`<?php cue_playlist( $id ); ?>`

== Screenshots ==

1. The interface to add, edit and rearrange a playlist's tracks.
2. A playlist in a content area, embedded with a shortcode.
3. Playlist display on small screens and sidebar widgets.

== Changelog ==

= 1.0 =
* Initial release.
