class Application {
	constructor() {
		this.l10n = {};
		this.settings = {};
	}

	config( settings ) {
		if ( settings.l10n ) {
			this.l10n = Object.assign( this.l10n, settings.l10n );
			delete settings.l10n;
		}

		this.settings = Object.assign( this.settings, settings );
	}
}

global.cue = global.cue || new Application();

export default global.cue;
export const l10n = global.cue.l10n;
export const settings = global.cue.settings;
