let isEnabled = false;
let isTabActive = false;
let isProcessing = false;
let currentSettings = {
    color: '#ff0000',
    width: 2,
    style: 'solid',
    showInfo: false,
    targetSelector: ''
};

// Create tooltip element
const tooltip = document.createElement('div');
tooltip.style.cssText = `
    position: fixed;
    background: rgba(20, 20, 20, 0.95);
    color: #00ff9d;
    padding: 12px 16px;
    border-radius: 6px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 12px;
    z-index: 10000;
    pointer-events: none;
    display: none;
    max-width: 300px;
    line-height: 1.6;
    box-shadow: 0 4px 12px rgba(0,255,157,0.2);
    border: 1px solid rgba(0,255,157,0.3);
    backdrop-filter: blur(4px);
    text-shadow: 0 0 10px rgba(0,255,157,0.3);
`;

document.body.appendChild(tooltip);

// Function to get element info
function getElementInfo(element) {
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    return `
        Tag: ${element.tagName}
        ID: ${element.id || 'none'}
        Class: ${element.className || 'none'}
        Size: ${Math.round(rect.width)}x${Math.round(rect.height)}px
        Position: ${Math.round(rect.left)},${Math.round(rect.top)}
        Display: ${styles.display}
        Margin: ${styles.margin}
        Padding: ${styles.padding}
    `;
}

// Function to get target elements based on selector
function getTargetElements() {
    if (currentSettings.targetSelector) {
        try {
            return document.querySelectorAll(currentSettings.targetSelector);
        } catch (e) {
            console.error('Invalid selector:', currentSettings.targetSelector);
            return document.querySelectorAll('*');
        }
    }
    return document.querySelectorAll('*');
}

// Function to add event listeners to element
function addElementEventListeners(element) {
    if (currentSettings.showInfo) {
        element.addEventListener('mouseover', handleMouseOver);
        element.addEventListener('mouseout', handleMouseOut);
    }
}

// Function to remove event listeners from element
function removeElementEventListeners(element) {
    element.removeEventListener('mouseover', handleMouseOver);
    element.removeEventListener('mouseout', handleMouseOut);
}

// Function to add outlines to elements
function addOutlines() {
    if (!isTabActive) return;

    const elements = getTargetElements();
    elements.forEach(element => {
        if (!element.hasAttribute('data-outlined')) {
            const originalOutline = element.style.outline;
            element.style.outline = `${currentSettings.width}px ${currentSettings.style} ${currentSettings.color}`;
            element.setAttribute('data-outlined', 'true');
            element.setAttribute('data-original-outline', originalOutline);
            addElementEventListeners(element);
        }
    });
}

// Function to remove outlines from elements
function removeOutlines() {
    const elements = document.querySelectorAll('[data-outlined]');
    elements.forEach(element => {
        const originalOutline = element.getAttribute('data-original-outline');
        element.style.outline = originalOutline || '';
        element.removeAttribute('data-outlined');
        element.removeAttribute('data-original-outline');
        removeElementEventListeners(element);
    });

    tooltip.style.display = 'none';
}

// Mouse event handlers
function handleMouseOver(e) {
    if (!currentSettings.showInfo) return;
    const element = e.target;
    const info = getElementInfo(element);
    tooltip.textContent = info;
    tooltip.style.display = 'block';
    updateTooltipPosition(e);
}

function handleMouseOut() {
    tooltip.style.display = 'none';
}

function updateTooltipPosition(e) {
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = e.pageX + 10;
    let top = e.pageY + 10;

    // Adjust position if tooltip would go off screen
    if (left + tooltipWidth > windowWidth) {
        left = e.pageX - tooltipWidth - 10;
    }
    if (top + tooltipHeight > windowHeight) {
        top = e.pageY - tooltipHeight - 10;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// Listen for mouse movement
document.addEventListener('mousemove', (e) => {
    if (tooltip.style.display === 'block') {
        updateTooltipPosition(e);
    }
});

// Function to update tab state
function updateTabState(enabled, active) {
    if (isProcessing) return;

    isProcessing = true;
    isEnabled = enabled;
    isTabActive = active;

    if (isEnabled && isTabActive) {
        addOutlines();
    } else {
        removeOutlines();
    }

    isProcessing = false;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleOutlines') {
        updateTabState(request.enabled, isTabActive);
    } else if (request.action === 'updateSettings') {
        if (!isProcessing) {
            currentSettings = request.settings;
            if (isEnabled && isTabActive) {
                removeOutlines();
                addOutlines();
            }
        }
    } else if (request.action === 'tabActive') {
        updateTabState(isEnabled, request.active);
    }
});

// Check if tab is active when content script loads
chrome.runtime.sendMessage({ action: 'getTabState' }, (response) => {
    if (response) {
        updateTabState(response.enabled, response.active);
    }
});

// Load initial settings
chrome.storage.sync.get({
    color: '#ff0000',
    width: 2,
    style: 'solid',
    showInfo: false,
    targetSelector: '',
    enabled: false
}, function (items) {
    currentSettings = items;
    // Don't enable outlines here, wait for tab state check
}); 