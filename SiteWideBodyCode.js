// Initialize the enhancer when DOM is ready
function initializeFAQEnhancer() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceGoHighLevelFAQs);
    } else {
        enhanceGoHighLevelFAQs();
    // Convert YouTube anchor links into YouTube embed code for watch and playlist urls:
    document.querySelectorAll(".description > p").forEach((pElement) => {
        //embedYouTubeVideos(pElement);
    });
    }
}

// Also set up a MutationObserver to handle dynamically added FAQ elements
function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node is a FAQ element or contains FAQ elements
                        if (node.classList && node.classList.contains('hl-faq')) {
                            enhanceFAQElement(node);
                        } else if (node.querySelectorAll) {
                            const faqElements = node.querySelectorAll('.hl-faq');
                            faqElements.forEach(enhanceFAQElement);
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Run the enhancer
initializeFAQEnhancer();
setupMutationObserver();