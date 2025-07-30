export default defineContentScript({
	matches: ['*://*/*'],
	main() {
		console.log('Hello content.');

		// Inject CSS styles for same-page anchor links
		const style = document.createElement('style');
		style.textContent = `
			.same-page-anchor-link {

			}
			.same-page-anchor-link:after {
				content: "⇅";
				color: #14ad14;
				margin-left: 2px;
				font-size: 0.8em;
			}
		`;
		document.head.appendChild(style);

		// Function to style same-page anchor links
		function styleSamePageAnchorLinks() {
			const currentUrl = window.location.origin + window.location.pathname;
			const anchorLinks = document.querySelectorAll('a[href]');

			anchorLinks.forEach((link) => {
				const linkElement = link as HTMLAnchorElement;

				// Check if the link has a hash (anchor)
				if(linkElement.hash) {
					const linkUrl = linkElement.origin + linkElement.pathname;

					// If the base URL matches the current page URL (same page anchor)
					if(linkUrl === currentUrl) {
						// Extract the fragment (without the #)
						const fragment = linkElement.hash.substring(1);

						// Find the target element
						const targetElement = fragment ? document.getElementById(fragment) : null;

						// Check if the target element is a parent of the link
						const isTargetParentOfLink = targetElement && targetElement.contains(linkElement);

						// Only apply class if the target is not a parent of the link
						if(!isTargetParentOfLink) {
							linkElement.classList.add('same-page-anchor-link');
						}
					}
				}
			});
		}		// Apply styling initially
		styleSamePageAnchorLinks();

		// Re-apply styling when DOM changes (for dynamically added content)
		const observer = new MutationObserver(() => {
			styleSamePageAnchorLinks();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});

		// Clean up observer when content script is invalidated
		// Note: This will be handled by the WXT framework's context management
	},
});
