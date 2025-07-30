export default defineContentScript({
	matches: ['*://*/*'],
	main() {
		console.log('Hello content.');

		// Function to style same-page anchor links
		function styleSamePageAnchorLinks() {
			const currentUrl = window.location.href.split('#')[0]; // Get URL without fragment
			const anchorLinks = document.querySelectorAll('a[href]');

			anchorLinks.forEach((link) => {
				const href = (link as HTMLAnchorElement).href;

				// Check if the link is an anchor link to the same page
				if(href.includes('#')) {
					const linkUrl = href.split('#')[0];

					// If the base URL matches the current page URL (same page anchor)
					if(linkUrl === currentUrl || linkUrl === '') {
						(link as HTMLAnchorElement).style.color = 'darkred';
					}
				}
			});
		}

		// Apply styling initially
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
