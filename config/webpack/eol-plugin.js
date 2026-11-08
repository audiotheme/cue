const { Compilation, sources } = require( 'webpack' );

/**
 * Normalize line endings in emitted assets and end each with a newline.
 */
class EOLPlugin {
	constructor ({ eol = '\n' } = {}) {
		this.eol = eol;
	}

	apply ( compiler ) {
		compiler.hooks.thisCompilation.tap( 'EOLPlugin', compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: 'EOLPlugin',
					// Run after source maps are generated.
					stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER
				},
				assets => {
					Object.keys( assets ).forEach( file => {
						compilation.updateAsset( file, source => {
							const content = source.source().toString().replace( /\r?\n/g, this.eol );
							return new sources.RawSource( content + this.eol );
						});
					});
				}
			);
		});
	}
}

module.exports = EOLPlugin;
