let isEnabled = false;
let activeTabId = null;
let isProcessing = false;

// Update extension icon
function updateIcon() {
    const iconPath = isEnabled ? 'icons/icon48.png' : 'icons/icon48.png';
    chrome.action.setIcon({ path: iconPath });
}

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
    activeTabId = activeInfo.tabId;
    if (isEnabled) {
        // Send message to the newly activated tab
        chrome.tabs.sendMessage(activeTabId, {
            action: 'tabActive',
            active: true
        }).catch(() => {
            // If content script is not loaded, inject it
            chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                files: ['content.js']
            }).then(() => {
                // Send message after injection
                setTimeout(() => {
                    chrome.tabs.sendMessage(activeTabId, {
                        action: 'tabActive',
                        active: true
                    });
                }, 100);
            });
        });
    }
});

// Listen for tab updates (for local files)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url &&
        (tab.url.startsWith('file://') || tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
        activeTabId = tabId;

        // Inject content script if needed
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).catch(() => {
            // Content script might already be injected
        });

        if (isEnabled) {
            setTimeout(() => {
                chrome.tabs.sendMessage(tabId, {
                    action: 'tabActive',
                    active: true
                });
            }, 100);
        }
    }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTabState') {
        sendResponse({
            active: sender.tab.id === activeTabId,
            enabled: isEnabled
        });
    } else if (request.action === 'toggleOutlines') {
        isEnabled = request.enabled;
        activeTabId = sender.tab.id;
        updateIcon();
    }
    return true; // Keep the message channel open for async response
});

// Initialize icon state
updateIcon(); 