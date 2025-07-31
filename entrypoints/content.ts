
//customElements is not accesible to content scripts unless polyfilled.
//import '@webcomponents/custom-elements';

export default defineContentScript({
	matches: ['*://*/*'],
	world: 'MAIN',
	main() {
		console.log('Hello content.');

		class FragmentLinkMarker extends HTMLAnchorElement {
			constructor() {
				super();
			}
		}

		// Inject CSS styles for anchor markers
		const style = document.createElement('style');
		style.textContent = `
			.tj-fragment-anchor-marker {
				color: #14ad14 !important;
				font-size: 0.8em !important;
				margin: 0px !important;
				margin-right: 2px !important;
				font-family: monospace !important;
				cursor: pointer !important;
				display: inline !important;
				background: none !important;
				border: none !important;
				padding: 0 !important;
				line-height: inherit !important;
				vertical-align: baseline !important;
				box-sizing: content-box !important;
				position: static !important;
				float: none !important;
				clear: none !important;
				width: auto !important;
				height: auto !important;
				outline: none !important;
				text-shadow: none !important;
				font-weight: normal !important;
				font-style: normal !important;
				text-transform: none !important;
				letter-spacing: normal !important;
				word-spacing: normal !important;
				text-decoration: none !important;
			}
		`;
		document.head.appendChild(style);

		function styleSamePageAnchorLinks() {
			const pageUrl = window.location.origin + window.location.pathname;
			const anchorLinks = document.querySelectorAll('a[href*="#"]');

			for(let i = 0;i < anchorLinks.length;i++) {
				const linkElement = anchorLinks[i] as HTMLAnchorElement;

				//could be '', cut '#' anyway. most links do not had #, so do that first.
				const anchor = linkElement.hash.substring(1);

				if(!anchor) {
					continue;
				}

				// Skip this link if parent is <li> element, because it is likely some sort of TOC
				if(linkElement.parentElement?.tagName == 'LI') {
					continue;
				}
				const linkUrl = linkElement.origin + linkElement.pathname;

				//link to another page with #
				if(linkUrl !== pageUrl) {
					continue;
				}


				const targetElement = document.getElementById(anchor);
				if(!targetElement) {
					//broken #anchor
					continue;
				}
				if(targetElement.contains(linkElement)) {
					//likely a header with and anchor to itself
					continue;
				}
				// Check if link element is inline
				const linkComputedStyle = window.getComputedStyle(linkElement);
				const isLinkInline = linkComputedStyle.display === 'inline' || linkComputedStyle.display === 'inline-block';
				if(!isLinkInline) {
					//again likely some TOC
					continue;
				}

				// Only add helper if all conditions are met and helper doesn't already exist
				if(!linkElement.firstElementChild?.hasAttribute('tj-fragment-anchor-marker')) {
					// Create a simple anchor helper element with strong style protection
					const anchorMarker = document.createElement('tj-fragment-anchor');
					//anchorMarker.href = linkElement.hash;
					anchorMarker.textContent = '#';
					anchorMarker.className = 'tj-fragment-anchor-marker';
					anchorMarker.setAttribute('tj-fragment-anchor-marker', '');
					anchorMarker.title = `Anchor link, it link to another place on this page.`;

					linkElement.insertBefore(anchorMarker, linkElement.firstChild);

				}
			}
		}

		//review this
		function initializeWhenReady() {
			if(!window.customElements.get('tj-fragment-anchor')) {
				customElements.define('tj-fragment-anchor', FragmentLinkMarker, { extends: 'a' });
			} else {
				console.log("can not register custom element");
			}
			styleSamePageAnchorLinks();
		}

		//review this
		document.onreadystatechange = () => {
			if(document.readyState === "complete") {
				initializeWhenReady();
			}
		};
	},
});
