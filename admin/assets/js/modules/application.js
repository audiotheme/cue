var _ = require( 'underscore' );

function Application() {
	var settings = {};

	_.extend( this, {
		controller: {},
		l10n: {},
		model: {},
		view: {}
	});

	this.settings = function( options ) {
		if ( options ) {
			_.extend( settings, options );
		}

		if ( settings.l10n ) {
			this.l10n = _.extend( this.l10n, settings.l10n );
			delete settings.l10n;
		}

		return settings || {};
	};
}

global.cue = global.cue || new Application();
module.exports = global.cue;
