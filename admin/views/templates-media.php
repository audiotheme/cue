<script type="text/html" id="tmpl-cue-playlist-browser-list-item">
	<div class="cue-media-thumbnail">
		<?php include( $this->plugin->get_path( 'admin/assets/images/playlist.svg' ) ); ?>
		<div class="cue-media-thumbnail-image">
			<# if ( data.thumbnail ) { #>
				<img src="{{ data.thumbnail }}">
			<# } #>
		</div>
		<span class="cue-media-thumbnail-title">{{ data.title }}</span>
	</div>
</script>

<script type="text/html" id="tmpl-cue-playlist-browser-sidebar">
	<div class="cue-playlist-browser-settings collection-settings">
		<h2><?php esc_html_e( 'Playlist Settings', 'cue' ); ?></h2>

		<?php $themes = get_cue_themes(); ?>
		<label class="setting">
			<span><?php esc_html_e( 'Theme', 'cue' ); ?></span>
			<select data-setting="theme">
				<option value=""></option>
				<?php
				foreach ( $themes as $id => $name ) {
					printf(
						'<option value="%s">%s</option>',
						esc_attr( $id ),
						esc_html( $name )
					);
				}
				?>
			</select>
		</label>

		<!--<label class="setting">
			<span><?php esc_html_e( 'Width', 'cue' ); ?></span>
			<input type="text" data-setting="width">
		</label>-->

		<label class="setting">
			<input type="checkbox" data-setting="show_playlist" checked>
			<span><?php esc_html_e( 'Show Tracklist', 'cue' ); ?></span>
		</label>
	</div>
</script>

<script type="text/html" id="tmpl-cue-playlist-browser-empty">
	<h2><?php esc_html_e( 'No items found.', 'cue' ); ?></h2>
	<p>
		<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=cue_playlist' ) ); ?>"><?php esc_html_e( 'Create a playlist.', 'cue' ); ?></a>
	</p>
</script>
