let isEnabled = false;
let activeTabId = null;
let isProcessing = false;

// Update extension icon
function updateIcon() {
    const iconPath = isEnabled ? 'icons/active.png' : 'icons/inactive.png';
    chrome.action.setIcon({ path: iconPath });
}

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
    activeTabId = activeInfo.tabId;
    if (isEnabled) {
        // Send message to the newly activated tab
        chrome.tabs.sendMessage(activeTabId, {
            action: 'toggleOutlines',
            enabled: isEnabled
        });
    }
});

// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
    if (isProcessing) return; // Prevent multiple clicks

    isProcessing = true;
    isEnabled = !isEnabled;
    activeTabId = tab.id;

    // Update icon immediately for visual feedback
    updateIcon();

    // Send message only to the active tab
    chrome.tabs.sendMessage(activeTabId, {
        action: 'toggleOutlines',
        enabled: isEnabled
    }, () => {
        // Reset processing flag after message is sent
        isProcessing = false;
    });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTabState') {
        sendResponse({
            active: sender.tab.id === activeTabId,
            enabled: isEnabled
        });
    }
    return true; // Keep the message channel open for async response
});

// Initialize icon state
updateIcon(); 