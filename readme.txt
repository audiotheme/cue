# Cue by AudioTheme.com

Contributors: audiotheme, bradyvercher, brodyvercher, thelukemcdonald
Tags: playlist, audio, music, mp3, tracks, player
Requires at least: 4.7
Tested up to: 4.9
Stable tag: 2.3.3
License: GPL-2.0+
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Delightful and reliable audio playlists.

## Description

*Cue* makes it easy to create and manage beautiful, fully responsive audio playlists. Primarily built with music in mind, *Cue* can also be used for podcasts, sermons or to showcase voice over samples.

There's no need to fiddle with XML, JSON, or FTP. Just upload audio files with the familiar WordPress Media Manager, then insert them into a playlist with the click of a button. *Cue* fetches metadata from uploaded files to automatically complete the title, artist, and length for each track.

It works on desktop, tablets, and other mobile devices.

View a working demo at [https://audiotheme.com/view/cue/](https://audiotheme.com/view/cue/?utm_source=wordpress.org&utm_medium=link&utm_content=cue-readme-demo&utm_campaign=plugins).


### Features

* Create unlimited playlists.
* Embed a player in any post, page, or sidebar using a shortcode or widget.
* Reorder tracks with a simple drag and drop interface.
* Seamlessly integrates with WordPress’ media manager to select audio and images.
* Automatically fetches title, artist, and length from the metadata if it's available.
* Completely responsive to work on any device that supports your audio format.
* Link to external sources like Amazon S3 or other CDNs.
* Customize the player background image.
* Use custom artwork for each track.


> **Level up with Cue Pro**
>
> [*Cue Pro*](https://audiotheme.com/view/cuepro/?utm_source=wordpress.org&utm_medium=link&utm_content=cue-readme&utm_campaign=plugins) is a premium add-on with a number of useful features. It includes:

> * Insights into how visitors interact with your audio.
> * Purchase and download links for each track.
> * New themes to change the appearance of the player.
> * Playlist sharing to allow fans to embed your players on their own sites.
> * Popup functionality so visitors can continue listening while browsing your site.

> *Cue Pro* purchases include email-based priority support and help support development of the free version of *Cue*.


### About AudioTheme

*Cue* is built by the team at [AudioTheme](https://audiotheme.com/?utm_source=wordpress.org&utm_medium=link&utm_content=cue-readme&utm_campaign=plugins). We're a small, independent team of designers, developers and musicians focused on creating and supporting professional, world-class WordPress themes and plugins for bands and musicians.

*Cue* was originally integrated in our commercial platform, but we wanted everyone to have the ability to easily create beautiful playlists, so we released it free for general use. It powers the unique players in all of our premium music themes, as well as [*CueBar*](https://audiotheme.com/view/cuebar/?utm_source=wordpress.org&utm_medium=link&utm_content=cue-readme&utm_campaign=plugins), a site-wide, continuous audio player made for WordPress.

We care about our work and stand by it. We’d love to have your support and the opportunity to earn your loyalty.


### Support Policy

We'll do our best to keep this plugin up to date, fix bugs and implement features when possible, but technical support can only be provided for active AudioTheme customers. If you enjoy this plugin and would like to support its development, you can:

* [Visit AudioTheme](https://audiotheme.com/?utm_source=wordpress.org&utm_medium=link&utm_content=cue-readme&utm_campaign=plugins) and tell your friends!
* [Leave a review](https://wordpress.org/support/view/plugin-reviews/cue#postform) and let everyone know how much you love it.
* [Follow @AudioTheme](https://twitter.com/AudioTheme) on Twitter.
* Help out on the [support forums](https://wordpress.org/support/plugin/cue).
* [Contribute on GitHub](https://github.com/audiotheme/cue).

## Installation

Install *Cue* like any other plugin. [Check out the codex](https://codex.wordpress.org/Managing_Plugins#Installing_Plugins) if you have any questions.

### Usage

After installing and activating *Cue*, a new menu item labelled *Playlists* will be available in your admin panel. Create a new playlist and add tracks by uploading or selecting existing audio files to add (remote sources can be used as well). Track details are populated automatically using tags in the audio file, but the details may also be managed manually.

#### Shortcode

To display a playlist in a post, page or CPT, insert the `[cue]` shortcode into the editor and specify the playlist id as an attribute.

When editing a playlist, the shortcode is available for copying in a meta box just under the **Publish** button.

Integration for inserting shortcodes in an editor is also included in the Media Manager modal. Click the **Add Media** button when editing a post or page, then choose the **Insert from Cue** option to select your playlist and insert it into the editor.

#### Widget

Visit *Appearance &rarr; Widgets* and add the Playlist widget to a sidebar. Enter a widget title if desired and select the playlist you want to display. That's it!

#### Template Tag

For more fine-grained control over where the playlist appears, a template tag is available.

`<?php cue_playlist( $id ); ?>`


## Frequently Asked Questions

#### How do I disable the track list?

Add a `show_playlist` attribute to your `[cue]` shortcode and set the value to `0`. Something like this should do it:

`[cue id="1" show_playlist="0"]`

#### Why do my playlists get truncated when they're saved?

We've heard reports that this may happen around 70 tracks on some hosts, but it could occur with fewer tracks. First off, 70 tracks seems a bit excessive and may introduce other performance issues, so we recommend limiting the tracks to a more reasonable number.

The root cause of this is a PHP configuration setting called `max_input_vars`, which is typically set to 1000 by default. You will most likely need to contact your host to increase that limit if you need to save more tracks.

#### Why can't I see the "Add Tracks" button in the admin panel?

Unfortunately, it's fairly common for plugins to introduce issues that may prevent other plugins from functioning correctly. If you're not seeing the **Add Tracks** button on the Edit Playlist screen, [determine if there's a conflict with another plugin](https://audiotheme.com/support/kb/troubleshooting-plugin-conflicts/) first.

Cue also requires JavaScript to be enabled in your browser, so be sure it's not disabled.

#### How can I protect my audio files?

Anything that's publicly visible online can be downloaded or recorded, so it's not really possible to protect your audio files.

Your best bet is to upload a lower quality file for online streaming. This also has the benefit of reducing bandwidth on mobile devices and making the audio load more quickly on slower networks.

#### Which audio format works best?

Browsers, devices, and platforms have varying levels of support for different audio formats, but at this time, MP3 provides the best compatibility across platforms.

*Cue* uses the MediaElement.js library bundled with WordPress, which attempts to smooth out inconsistencies across browsers, so you may have some success with other formats like AAC or Ogg.

Mozilla Developer Network maintains a [browser compatibility chart here](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats#Browser_compatibility).

#### Can I make the player start automatically?

No.

It's for your own good.

And the good of humanity.

Aside from that, mobile platforms like iOS and Android make it impossible to start playing audio automatically.

#### Does Cue work with SoundCloud?

Not at this time. SoundCloud URLs don't point directly at audio files, so support would require integrating with their API and complying with their [attribution and branding requirements](https://developers.soundcloud.com/docs/api/terms-of-use#branding). If there is enough demand, we might consider adding support in a future release.


## Screenshots

1. The interface to add, edit and rearrange a playlist's tracks.
2. A playlist in a content area, embedded with a shortcode.
3. Playlist display on small screens and sidebar widgets.


## Changelog

### 2.3.3 - May 11, 2018
* Updated the Gamajo Template Loader dependency to version 1.3.0.
* Removed some unused CSS rules.

### 2.3.2 - May 7, 2018
* Removed AudioTheme branding from the player.

### 2.3.1 - March 23, 2018
* Fixed an issue preventing the volume slider from reflecting the current volume.
* Fixed an issue causing the play/pause button to disappear after a playlist had ended.
* Improved compatibility with styles in some themes.
* Introduced `cue_display_track_fields_before` and `cue_display_track_fields_after` actions.

### 2.3.0 - October 23, 2017
* Improved support for the new version of MediaElement.js in WordPress 4.9+.
* Removed the bundled version of Genericons in favor of Dashicons for displaying icons in the admin panel.
* Updated jquery.cue.js to 1.2.3.
* Switched from Browserify to webpack to bundle JavaScript modules. Prevents a global `require()` method from being defined, which caused conflicts with some external modules.

### 2.2.1 - October 2, 2016
* Fixed a bug causing player assignments to be reset when saving a playlist.

### 2.2.0 - September 29, 2016
* Added a view to the Media Manager modal for inserting `[cue]` shortcodes into any editor.
* Update jquery.cue.js to 1.1.9.
* Prevented a debug notice when adding a new Playlist widget in the Customizer.
* Renamed the AJAX action for retrieving a playlist's tracks from `wp_ajax_get_cue_playlist` to `wp_ajax_cue_get_playlist_tracks`.

We're in the planning stages for 3.0 which will include major internal changes and potentially a few style updates to take advantage of new features in WordPress and modern browsers. If you have customized Cue in any way or would like to request new features, please [follow along on GitHub](https://github.com/audiotheme/cue).

### 2.1.1 - August 12, 2016
* Left align text in track lists.

### 2.1.0 - August 10, 2016
* Added a feature for plugins to register custom themes for playlists.
* Added a Customizer control to let plugins register custom themes for native audio players.
* Introduced `cue_playlist_top` and `cue_playlist_bottom` actions.
* Introduced the `cue_parse_shortcode_head` filter for embedding styles in the TinyMCE view.
* Introduced the `cue_playlist_thumbnail_size` filter for changing the size of a playlist's featured image (used for the background image).
* Moved the MediaElement.js features array to `$.fn.cuePlaylist.features` to allow public access.
* Added a `no-touch` or `touch` class to the playlist container to indicate touch support.
* Added `cuePermalink` to the JavaScript player options.
* Added `cueEmbedLink` to the JavaScript player options.
* Fixed the blur effect on the background image in Webkit browsers.
* Made minor CSS tweaks for better theme compatibility.
* Set the playlist CPT `public` argument to `true`.
* Added RTL language support.
* Added missing text domains.

### 2.0.1 - June 20, 2016
* Fixed a bug where every other track would be skipped in Safari.
* Updated jquery.cue.js to version 1.1.7. Disables playlist looping.
* Updated the Gamajo Template Loader library to 1.2.0.

### 2.0.0 - May 23, 2016
* Refactored the code to make it easier to maintain.
* Introduced a public initialize() JavaScript method.
* Disabled automatic looping when a playlist is finished playing.
* Removed bundled language files in favor of WordPress.org language packs. Translate here.
* Updated jquery.cue.js to version 1.1.6.

### 1.3.1 - February 17, 2016
* Added a `container` argument to the `cue_playlist()` template tag to disable the container.
* Added a `pring_data` argument to the `cue_playlist()` template tag to disable the JSON data.

### 1.3.0 - December 30, 2015
* Added a volume bar to the default player.
* Display a "(no title)" placeholder in the admin panel if a track doesn't have a title.
* Added some missing text domains to translation functions.
* Added actions in the playlist template to make it easier to output additional details.
* Updated jquery.cue.js to 1.1.4.
* Updated the AudioTheme icon.

### 1.2.9 - April 8, 2015
* Update the TinyMCE preview for WordPress 4.2.

### 1.2.8 - March 27, 2015
* Added French translation.

### 1.2.7 - March 2, 2015
* Fixed a broken link in the Customizer when there aren't any published playlists.

### 1.2.6 - December 17, 2014
* Added previews for the shortcode in the visual editor.
* Fixed an error in the Customizer when there weren't any published playlists.
* Fixed the allowed file types when uploading.
* Fixed the SVG blur filter when previewing in the Customizer.
* Updated jquery.cue.js to 1.1.3

### 1.2.5 - November 19, 2014
* Fixed bug that caused playlists in widgets to disappear.
* Hide the previous and next track buttons when a playlist only has one track.

### 1.2.4 - November 14, 2014
* Added a 'show_playlist' shortcode attribute to toggle the playlist visibility.
* Absolutely positioned the SVG filter to remove it from the document flow and prevent it from creating empty space in some browsers.
* Added a message in the Customizer for registered players if a playlist hasn't been published yet.
* Updated jquery.cue.js to 1.1.1

### 1.2.3 - September 19, 2014
* Fixed the blur effect in Firefox.
* Created a solution that should provide a blur alternative in IE.
* Removed the blur script dependency in favor of an SVG filter.
* Switched to inline styles to size audio elements instead of invalid attributes.

### 1.2.2 - August 18, 2014
* Fixed the feature that allowed the background image to be used as the default track artwork.

### 1.2.1 - August 16, 2014
* Fixed the background image based on the post thumbnail feature.

### 1.2.0 - August 14, 2014
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

### 1.1.2 - July 30, 2014
* Fixed a sorting issue that caused the order of tracks to not be saved correctly.

### 1.1.1 - May 8, 2014
* Added a customizer section to allow playlists to be selected for players registered by themes.
* Added a new property to tracks returned by get_cue_playlist_tracks() for easier use with jPlayer.
* Added CSS to try to remove padding and margin on track lists in widgets.
* Mimic the track JSON format used by core.

### 1.1.0 - February 20, 2014
* Featured images are now used for the player background image if set.
* Featured images will also be used as the default track artwork if it's missing.
* Added a feature to allow themes to register players that can be assigned playlists.
* Added a default container div around playlists.
* Updated the default template to remove the JSON settings script. It's now inserted using a hook.
* Refactored the structure of the codebase.
* Removed extraneous filters for loading translation files.
* Fixed a bug in the template loader to prevent general templates from overriding more specific ones.

### 1.0.1 - February 11, 2014
* Fix a bug where multiple playlists on a page would all include the same tracks.

### 1.0.0 - February 4, 2014
* Initial release.
