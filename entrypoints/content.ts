export default defineContentScript({
	matches: ['*://*/*'],
	main() {
		console.log('Hello content.');

		// Inject CSS styles for anchor markers
		const style = document.createElement('style');
		style.textContent = `
			.tj-anchor-marker {
				color: #14ad14 !important;
				font-size: 0.8em !important;
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
			.tj-anchor-marker:hover {
				text-decoration: underline !important;
			}
		`;
		document.head.appendChild(style);

		// Function to style same-page anchor links
		function styleSamePageAnchorLinks() {
			const pageUrl = window.location.origin + window.location.pathname;
			const anchorLinks = document.querySelectorAll('a[href]');

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
				if(!linkElement.firstElementChild?.hasAttribute('tj-anchor-marker')) {
					// Create a simple anchor helper element with strong style protection
					const anchorMarker = document.createElement('a');
					anchorMarker.href = linkElement.hash;
					anchorMarker.textContent = '#';
					anchorMarker.className = 'tj-anchor-marker';
					anchorMarker.setAttribute('tj-anchor-marker', '');
					anchorMarker.title = `Anchor link, it link to another place on this page.`;

					//consider popover here

					linkElement.insertBefore(anchorMarker, linkElement.firstChild);
				}


			}
		}
		// Apply styling initially
		styleSamePageAnchorLinks();

	},
});
