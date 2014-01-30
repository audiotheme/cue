<div class="cue-playlist" itemscope itemtype="http://schema.org/MusicPlaylist">
	<meta itemprop="numTracks" content="<?php echo count( $tracks ); ?>" />

	<audio src="<?php echo esc_url( $tracks[0]['audioUrl'] ); ?>" width="100%" height="" class="cue-audio" controls preload="none"></audio>

	<ol class="cue-tracks">
		<?php foreach ( $tracks as $track ) : ?>
			<li class="cue-track" itemprop="track" itemscope itemtype="http://schema.org/MusicRecording">
				<span class="cue-track-details cue-track-cell">
					<span class="cue-track-title" itemprop="name"><?php echo $track['title']; ?></span>
					<span class="cue-track-artist" itemprop="byArtist"><?php echo esc_html( $track['artist'] ); ?></span>
				</span>
				<span class="cue-track-length cue-track-cell"><?php echo esc_html( $track['length'] ); ?></span>
			</li>
		<?php endforeach; ?>
	</ol>

	<script type="application/json" class="cue-playlist-data"><?php echo json_encode( array( 'tracks' => $tracks ) ); ?></script>
</div>
