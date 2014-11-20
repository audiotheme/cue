=== Cue ===
Contributors: audiotheme, bradyvercher, brodyvercher, thelukemcdonald
Tags: playlist, audio, music, mp3, tracks, player
Requires at least: 3.8
Tested up to: 4.0
Stable tag: trunk
License: GPL-2.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Create beautiful, fully responsive audio playlists.

== Description ==

Cue gives you the ability to easily create stylish playlists and display them anywhere on your site using a widget, shortcode or template tag. Upload new audio files, reuse existing files in your media library, or even link to remote sources.

* Reorder tracks with a simple drag and drop interface.
* Seamlessly integrates with WordPress' media manager to select audio and images.
* Completely responsive to work on any device that supports your chosen audio format.
* Extends the MediaElement.js script bundled with core.

= AudioTheme Integration =

Cue was originally built for the [AudioTheme Framework](http://audiotheme.com/), but we wanted everyone to have the ability to easily create beautiful playlists, so we're releasing it free for general use. Additional integration is built into our framework to extend Cue and allow tracks in your discography to be used as sources for playlist tracks.

For an example of how Cue can be extended, check out [CueBar, a jukebox audio player](http://demo.audiotheme.com/cuebar/) made for WordPress.

= Support Policy =

We'll do our best to keep this plugin up to date, fix bugs and implement features when possible, but technical support will only be provided for active AudioTheme customers. If you enjoy this plugin and would like to support its development, you can:

* [Check out AudioTheme](http://audiotheme.com/) and tell your friends!
* Help out on the [support forums](http://wordpress.org/support/plugin/cue).
* Consider [contributing on GitHub](https://github.com/audiotheme/cue).
* [Leave a review](http://wordpress.org/support/view/plugin-reviews/cue#postform) and let everyone know how much you love it.
* [Follow @AudioTheme](https://twitter.com/AudioTheme) on Twitter.

= Translation Credits =

* Brazilian Portuguese (pt_BR) - Dionizio Bach [v1.2.0]

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

= 1.2.5 =
* Fixed bug that caused playlists in widgets to disappear.
* Hide the previous and next track buttons when a playlist only has one track.

= 1.2.4 =
* Added a 'show_playlist' shortcode attribute to toggle the playlist visibility.
* Absolutely positioned the SVG filter to remove it from the document flow and prevent it from creating empty space in some browsers.
* Added a message in the Customizer for registered players if a playlist hasn't been published yet.
* Updated jquery.cue.js to 1.1.1

= 1.2.3 =
* Fixed the blur effect in Firefox.
* Created a solution that should provide a blur alternative in IE.
* Removed the blur script dependency in favor of an SVG filter.
* Switched to inline styles to size audio elements instead of invalid attributes.

= 1.2.2 =
* Fixed the feature that allowed the background image to be used as the default track artwork.

= 1.2.1 =
* Fixed the background image based on the post thumbnail feature.

= 1.2.0 =
* Added Brazilian Portuguese translation.
* Abstracted the core MediaElement.js functionality into a new jQuery plugin.
* Improved responsiveness of the administration screen.
* Added the third argument to the [cue] shortcode handler so it can be filtered.
* Fixed the syntax for jQuery event triggers with multiple parameters.
* Namespaced the window resize event.
* Renamed /scripts and /styles assets directories to /js and /css.
* Sanitized tracks in the AJAX save callback.
* Allow an empty option to be selected for a player in the Customizer so it can be disabled.
* Pass player ids and arguments through various hooks for context.
* Prevent the playlist from displaying if it doesn't have any tracks.

= 1.1.2 =
* Fixed a sorting issue that caused the order of tracks to not be saved correctly.

= 1.1.1 =
* Added a customizer section to allow playlists to be selected for players registered by themes.
* Added a new property to tracks returned by get_cue_playlist_tracks() for easier use with jPlayer.
* Added CSS to try to remove padding and margin on track lists in widgets.
* Mimic the track JSON format used by core.

= 1.1.0 =
* Featured images are now used for the player background image if set.
* Featured images will also be used as the default track artwork if it's missing.
* Added a feature to allow themes to register players that can be assigned playlists.
* Added a default container div around playlists.
* Updated the default template to remove the JSON settings script. It's now inserted using a hook.
* Refactored the structure of the codebase.
* Removed extraneous filters for loading translation files.
* Fixed a bug in the template loader to prevent general templates from overriding more specific ones.

= 1.0.1 =
* Fix a bug where multiple playlists on a page would all include the same tracks.

= 1.0 =
* Initial release.
