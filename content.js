let isEnabled = false;
let isTabActive = false;
let isProcessing = false;
let currentSettings = {
    color: '#00ff9d',
    width: 1,
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
    color: '#00ff9d',
    width: 1,
    style: 'solid',
    showInfo: false,
    targetSelector: '',
    enabled: false
}, function (items) {
    currentSettings = items;
    // Don't enable outlines here, wait for tab state check
});

function createInfoBox(element) {
    const infoBox = document.createElement('div');
    infoBox.className = 'outliner-info-box';

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const position = {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
    };

    // Get element information
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = Array.from(element.classList).map(c => `.${c}`).join(' ');
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const x = Math.round(position.left);
    const y = Math.round(position.top);

    // Create info content with better styling
    infoBox.innerHTML = `
        <div class="outliner-info-header">
            <div class="outliner-info-tag-row">
                <span class="outliner-info-tag">${tagName}</span>
                ${id ? `<span class="outliner-info-id">${id}</span>` : ''}
            </div>
            ${classes ? `<div class="outliner-info-classes">${classes}</div>` : ''}
        </div>
        <div class="outliner-info-body">
            <div class="outliner-info-grid">
                <div class="outliner-info-cell">
                    <span class="outliner-info-label">Width</span>
                    <span class="outliner-info-value">${width}px</span>
                </div>
                <div class="outliner-info-cell">
                    <span class="outliner-info-label">Height</span>
                    <span class="outliner-info-value">${height}px</span>
                </div>
                <div class="outliner-info-cell">
                    <span class="outliner-info-label">X</span>
                    <span class="outliner-info-value">${x}px</span>
                </div>
                <div class="outliner-info-cell">
                    <span class="outliner-info-label">Y</span>
                    <span class="outliner-info-value">${y}px</span>
                </div>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .outliner-info-box {
            position: absolute;
            background: rgba(18, 18, 18, 0.95);
            border: 1px solid rgba(0, 255, 157, 0.3);
            border-radius: 8px;
            padding: 12px;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(8px);
            z-index: 10000;
            min-width: 200px;
            max-width: 300px;
            pointer-events: none;
        }

        .outliner-info-header {
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(0, 255, 157, 0.2);
        }

        .outliner-info-tag-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }

        .outliner-info-tag {
            color: #00ff9d;
            font-weight: 500;
            font-size: 13px;
        }

        .outliner-info-id {
            color: #ff3b4a;
            font-size: 12px;
        }

        .outliner-info-classes {
            color: #4285f4;
            font-size: 12px;
            word-break: break-all;
            line-height: 1.3;
        }

        .outliner-info-body {
            display: flex;
            flex-direction: column;
        }

        .outliner-info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        .outliner-info-cell {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .outliner-info-label {
            color: #888;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .outliner-info-value {
            color: #fff;
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);

    // Position the info box
    const infoBoxWidth = infoBox.offsetWidth;
    const infoBoxHeight = infoBox.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let top = position.top + rect.height + 10;
    let left = position.left;

    // Adjust position if it would go off screen
    if (top + infoBoxHeight > windowHeight + scrollTop) {
        top = position.top - infoBoxHeight - 10;
    }
    if (left + infoBoxWidth > windowWidth + scrollLeft) {
        left = windowWidth + scrollLeft - infoBoxWidth - 10;
    }

    infoBox.style.top = `${top}px`;
    infoBox.style.left = `${left}px`;

    return infoBox;
} 