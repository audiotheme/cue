<?php
/**
 * Template to render the player and playlist.
 *
 * @package   Cue
 * @since     1.0.0
 * @copyright Copyright (c) 2016 AudioTheme, LLC
 * @license   GPL-2.0+
 */

?>

<div class="<?php echo esc_attr( $classes ); ?>" itemscope itemtype="http://schema.org/MusicPlaylist">
	<?php do_action( 'cue_playlist_top', $post, $tracks, $args ); ?>

	<meta itemprop="numTracks" content="<?php echo count( $tracks ); ?>" />

	<audio src="<?php echo esc_url( $tracks[0]['audioUrl'] ); ?>" controls preload="none" class="cue-audio" style="width: 100%; height: auto"></audio>

	<ol class="cue-tracks">
		<?php foreach ( $tracks as $track ) : ?>
			<li class="cue-track" itemprop="track" itemscope itemtype="http://schema.org/MusicRecording">
				<?php do_action( 'cue_playlist_track_top', $track, $post, $args ); ?>

				<span class="cue-track-details cue-track-cell">
					<span class="cue-track-title" itemprop="name"><?php echo $track['title']; ?></span>
					<span class="cue-track-artist" itemprop="byArtist"><?php echo esc_html( $track['artist'] ); ?></span>
				</span>

				<?php do_action( 'cue_playlist_track_details_after', $track, $post, $args ); ?>

				<span class="cue-track-length cue-track-cell"><?php echo esc_html( $track['length'] ); ?></span>

				<?php do_action( 'cue_playlist_track_bottom', $track, $post, $args ); ?>
			</li>
		<?php endforeach; ?>
	</ol>

	<?php do_action( 'cue_playlist_bottom', $post, $tracks, $args ); ?>
</div>
