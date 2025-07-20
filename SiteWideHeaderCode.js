// GoHighLevel FAQ Element Enhancer
// Configuration Variables
const HL_FAQ_CHILD_HEADING_THUMB_WIDTH = 30;
const HL_FAQ_CHILD_HEADING_THUMB_HEIGHT = 30;
const HL_FAQ_CHILD_PANEL_IMAGE_MAX_WIDTH = 1000;
const HL_FAQ_CHILD_PANEL_YOUTUBE_WIDTH = 560;
const HL_FAQ_CHILD_PANEL_YOUTUBE_HEIGHT = 315;

function enhanceGoHighLevelFAQs() {
    // Find all FAQ elements
    const faqElements = document.querySelectorAll('.hl-faq');

    faqElements.forEach(faq => {
        enhanceFAQElement(faq);
    });
}

function enhanceFAQElement(faqElement) {
    // Find all FAQ child elements within this FAQ
    const faqChildren = faqElement.querySelectorAll('.hl-faq-child');

    faqChildren.forEach(child => {
        enhanceFAQChild(child);
    });
}

function enhanceFAQChild(faqChild) {
    const heading = faqChild.querySelector('.hl-faq-child-heading');
    const panel = faqChild.querySelector('.hl-faq-child-panel');

    if (!heading || !panel) return;

    // 1. Duplicate Panel Image as Thumbnail in Heading
    addThumbnailToHeading(heading, panel);

    // 2. Embed All Other Panel Images
    embedPanelImages(panel);

    // 3. Embed All YouTube Videos
    embedYouTubeVideos(panel);

        if (faqChild.textContent.toLowerCase().includes('!hid')) {
            faqChild.style.display = 'none';
        }
}

function addThumbnailToHeading(heading, panel) {
	console.log('heading: ' + heading)
    // Find the item-img in the panel
    const itemImg = panel.querySelector('.item-img');

	console.log('itemImg: ' + itemImg)
    if (!itemImg) return;

    // Check if thumbnail already exists to avoid duplicates
    const existingThumbnail = heading.querySelector('.faq-heading-thumbnail');
	console.log('existingThumbnail: ' + existingThumbnail)
    if (existingThumbnail) return;

    // Find the span with ID containing "hl-faq-child-head"
    const headSpan = heading.querySelector('[class*="hl-faq-child-head"]');
    if (!headSpan) return;

    // Check if heading contains a link and extract URL
    let popupUrl = null;
    const headingLink = headSpan.querySelector('a');
	console.log('headingLink: ' + headingLink)
    if (headingLink) {
        popupUrl = headingLink.getAttribute('href');
        // Replace link with just the text content
        const textContent = headingLink.textContent;
        headingLink.parentNode.replaceChild(document.createTextNode(textContent), headingLink);
    }

    // Create thumbnail image
    const thumbnail = document.createElement('img');
    thumbnail.src = itemImg.src;
    thumbnail.alt = itemImg.alt || 'FAQ thumbnail';
    thumbnail.className = 'faq-heading-thumbnail';
    thumbnail.style.width = `${HL_FAQ_CHILD_HEADING_THUMB_WIDTH}px`;
    thumbnail.style.height = `${HL_FAQ_CHILD_HEADING_THUMB_HEIGHT}px`;
    thumbnail.style.objectFit = 'cover';
    thumbnail.style.marginRight = '10px';
    thumbnail.style.borderRadius = '4px';
    thumbnail.style.cursor = 'pointer';
    thumbnail.style.flexShrink = '0';
    thumbnail.loading = 'lazy';
    if (popupUrl) {
        thumbnail.onclick = (event) => {
            event.stopPropagation();
            window.open(popupUrl, '_blank');
        };
        thumbnail.title = 'Visit » ' + popupUrl;
        itemImg.onclick = (event) => {
            event.stopPropagation();
            window.open(popupUrl, '_blank');
        };
        itemImg.title = 'Visit » ' + popupUrl;
    }

    // Add click handler for popup if URL exists
    //if (popupUrl) {
	//	console.log('popupUrl: ' + popupUrl)
    //    thumbnail.addEventListener('click', () => openImagePopup(popupUrl));
    //    // Also add click handler to the main item-img
    //    itemImg.style.cursor = 'pointer';
    //    itemImg.addEventListener('click', () => openImagePopup(popupUrl));
    //}

    // Ensure the heading container uses flexbox for proper alignment
    const headContainer = headSpan.parentNode;
    headContainer.style.display = 'flex';
    headContainer.style.alignItems = 'center';
    headContainer.style.justifyContent = 'flex-start';
    headContainer.style.textAlign = 'left';

    // Insert thumbnail before the span
    headSpan.parentNode.insertBefore(thumbnail, headSpan);
}

function embedPanelImages(panel) {
    // Find all links that point to images
    const links = panel.querySelectorAll('a[href]');

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Check if it's an image URL (common image extensions)
        if (isImageUrl(href) && !link.classList.contains('converted-image-embed-processed')) {
            // Mark as processed to avoid duplicate processing
            link.classList.add('converted-image-embed-processed');

            // Create new img element
            const img = document.createElement('img');
            img.src = href;
            img.className = 'converted-image-embed';
            img.style.maxWidth = `${HL_FAQ_CHILD_PANEL_IMAGE_MAX_WIDTH}px`;
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '10px 0';
            img.loading = 'lazy';

            // Replace the link with the image
            link.parentNode.replaceChild(img, link);
        }
    });
}

function embedYouTubeVideos(panel) {
    // Find all links that point to YouTube videos
    const links = panel.querySelectorAll('a[href]');

    links.forEach(link => {
        const href = link.getAttribute('href');

        if (isYouTubeUrl(href) && !link.classList.contains('youtube-embed-processed')) {
            // Mark as processed to avoid duplicate processing
            link.classList.add('youtube-embed-processed');

            const embedCode = createYouTubeEmbed(href);
            if (embedCode) {
                // Create a container div
                const container = document.createElement('div');
                container.innerHTML = embedCode;

                // Replace the link with the embed
                link.parentNode.replaceChild(container, link);
            }
        }
    });
}

function isYouTubeUrl(url) {
    if (!url) return false;

    // Ignore root domain URLs
    if (url === 'https://www.youtube.com' || url === 'https://youtu.be' ||
        url === 'https://www.youtube.com/' || url === 'https://youtu.be/') {
        return false;
    }

    // Check for various YouTube URL patterns
    const youtubePatterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
    ];

    return youtubePatterns.some(pattern => pattern.test(url));
}

function createYouTubeEmbed(url) {
    let embedUrl = '';

    // Extract video ID and additional parameters
    const standardMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    const shortMatch = url.match(/(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/);
    const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    const timeMatch = url.match(/[?&]t=(\d+)/);

    if (playlistMatch) {
        // Handle playlist URLs
        embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}&rel=0`;
    } else if (standardMatch) {
        // Handle standard YouTube URLs
        embedUrl = `https://www.youtube.com/embed/${standardMatch[1]}?rel=0`;

        // Add time parameter if present
        if (timeMatch) {
            embedUrl += `&start=${timeMatch[1]}`;
        }
    } else if (shortMatch) {
        // Handle shortened YouTube URLs
        embedUrl = `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`;

        // Add time parameter if present
        if (timeMatch) {
            embedUrl += `&start=${timeMatch[1]}`;
        }
    }

    if (!embedUrl) return null;

    // Create the embed HTML
    return `<center>
        <iframe
            width="${HL_FAQ_CHILD_PANEL_YOUTUBE_WIDTH}"
            height="${HL_FAQ_CHILD_PANEL_YOUTUBE_HEIGHT}"
            src="${embedUrl}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    </center>`;
}

function isImageUrl(url) {
    if (!url) return false;

    // Check for common image extensions or Google Storage image URLs
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    const googleStorageImage = /storage\.googleapis\.com.*\.(jpg|jpeg|png|gif|bmp|webp)/i;

    return imageExtensions.test(url) || googleStorageImage.test(url);
}

// Function to open image popup
function openImagePopup(url) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'pointer';

    // Create image
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';

    // Close popup when clicking overlay
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    // Prevent closing when clicking the image itself
    img.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Add escape key handler
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    overlay.appendChild(img);
    document.body.appendChild(overlay);
}



// Export functions for manual use if needed
window.GoHighLevelFAQEnhancer = {
    enhance: enhanceGoHighLevelFAQs,
    enhanceElement: enhanceFAQElement
};



