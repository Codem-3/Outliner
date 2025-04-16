let isEnabled = false;

// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
    isEnabled = !isEnabled;

    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
        action: 'toggleOutlines',
        enabled: isEnabled
    });
}); 