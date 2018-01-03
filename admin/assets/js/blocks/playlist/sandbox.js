import { element } from 'wp';

const { Component, renderToString } = element;

export default class Sandbox extends Component {
	static get defaultProps() {
		return {
			body: '',
			head: '',
			title: ''
		};
	}

	constructor() {
		super( ...arguments );

		this.state = {
			height: 0,
			width: 0
		};

		this.isFrameAccessible = this.isFrameAccessible.bind( this );
		this.isFrameEmpty = this.isFrameEmpty.bind( this );
		this.setContent = this.setContent.bind( this );
		this.receiveMessage = this.receiveMessage.bind( this );
	}

	componentDidMount() {
		window.addEventListener( 'message', this.receiveMessage, false );
		this.setContent();
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.body !== prevProps.body || this.isFrameEmpty() ) {
			this.setContent();
		}
	}

	componentWillUnmount() {
		window.removeEventListener( 'message', this.receiveMessage );
	}

	isFrameAccessible() {
		try {
			return !! this.iframe.contentDocument.body;
		} catch ( e ) {
			return false;
		}
	}

	isFrameEmpty() {
		return this.isFrameAccessible() && '' === this.iframe.contentDocument.body.innerHTML;
	}

	receiveMessage( event ) {
		const iframe = this.iframe;
		const data = event.data || {};

		// Verify that the mounted element is the source of the message.
		if ( ! iframe || iframe.contentWindow !== event.source ) {
			return;
		}

		// Update the state only if the message is formatted as we expect, i.e.
		// as an object with a 'resize' action, width, and height.
		const { action, width, height } = data;
		const { width: oldWidth, height: oldHeight } = this.state;

		if ( 'resize' === action && ( oldWidth !== width || oldHeight !== height ) ) {
			this.setState({ width, height });
		}
	}

	setContent() {
		const observeAndResizeJS = `
			(function() {
				if ( ! window.MutationObserver || ! document.body || ! window.parent ) {
					return;
				}

				function sendResize() {
					const clientBoundingRect = document.body.getBoundingClientRect();
					window.parent.postMessage({
						action: 'resize',
						width: clientBoundingRect.width,
						height: clientBoundingRect.height
					}, '*' );
				}

				const observer = new MutationObserver( sendResize );
				observer.observe( document.body, {
					attributes: true,
					attributeOldValue: false,
					characterData: true,
					characterDataOldValue: false,
					childList: true,
					subtree: true
				});

				window.addEventListener( 'load', sendResize, true );
				sendResize();
		})();`;

		const head = `
			<title>${ this.props.title }</title>
			${ this.props.head }
			<style>
			body {
				margin: 0 !important;
				padding: 0 !important;
			}

			body > div > * {
				margin-top: 0 !important;
				margin-bottom: 0 !important;
			}
			</style>
		`;

		const html = (
			<html lang={ document.documentElement.lang }>
				<head dangerouslySetInnerHTML={ { __html: head } } />
				<body className={ this.props.type }>
					<div dangerouslySetInnerHTML={ { __html: this.props.body } } />
					<script type="text/javascript" dangerouslySetInnerHTML={ { __html: observeAndResizeJS } } />
				</body>
			</html>
		);

		this.iframe.contentWindow.document.open();
		this.iframe.contentWindow.document.write( '<!DOCTYPE html>' + renderToString( html ) );
		this.iframe.contentWindow.document.close();
	}

	render() {
		return (
			<iframe
				ref={ node => this.iframe = node }
				title={ this.props.title }
				scrolling="no"
				sandbox="allow-scripts allow-same-origin allow-presentation"
				width={ Math.ceil( this.state.width ) }
				height={ Math.ceil( this.state.height ) }
			/>
		);
	}
}
