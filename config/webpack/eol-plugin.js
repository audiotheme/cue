const ConcatSource = require( 'webpack-sources' ).ConcatSource;

class EOLPlugin {
	constructor ({ eol = '\n' } = {}) {
		this.eol = eol;
	}

	apply ( compiler, compilation ) {
		compiler.plugin( 'emit', ( compilation, callback ) => {
			Object.keys( compilation.assets ).forEach( file => {
				const source = compilation.assets[ file ].source();

				compilation.assets[ file ].source = () => {
					return source.replace( /\r?\n/g, this.eol );
				};

				compilation.assets[ file ] = new ConcatSource( compilation.assets[ file ], this.eol );
			});

			callback();
		});
	}
}

module.exports = EOLPlugin;
