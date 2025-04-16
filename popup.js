document.addEventListener('DOMContentLoaded', function () {
    const colorPicker = document.getElementById('outlineColor');
    const widthSlider = document.getElementById('outlineWidth');
    const widthValue = document.getElementById('widthValue');
    const styleSelect = document.getElementById('outlineStyle');
    const showInfoCheckbox = document.getElementById('showElementInfo');
    const targetSelector = document.getElementById('targetSelector');
    const toggleButton = document.getElementById('toggleButton');

    // Load saved settings
    chrome.storage.sync.get({
        color: '#ff0000',
        width: 2,
        style: 'solid',
        showInfo: false,
        targetSelector: '',
        enabled: false
    }, function (items) {
        colorPicker.value = items.color;
        widthSlider.value = items.width;
        widthValue.textContent = items.width + 'px';
        styleSelect.value = items.style;
        showInfoCheckbox.checked = items.showInfo;
        targetSelector.value = items.targetSelector;
        updateToggleButton(items.enabled);
    });

    // Update width display
    widthSlider.addEventListener('input', function () {
        widthValue.textContent = this.value + 'px';
    });

    // Save settings and update outlines
    function updateSettings() {
        const settings = {
            color: colorPicker.value,
            width: widthSlider.value,
            style: styleSelect.value,
            showInfo: showInfoCheckbox.checked,
            targetSelector: targetSelector.value.trim()
        };

        chrome.storage.sync.set(settings, function () {
            // Get the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs[0]) {
                    // Send message to content script
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: settings
                    });
                }
            });
        });
    }

    // Update toggle button text
    function updateToggleButton(enabled) {
        toggleButton.textContent = enabled ? 'Disable Outlines' : 'Enable Outlines';
        toggleButton.style.backgroundColor = enabled ? '#dc3545' : '#28a745';
    }

    // Add event listeners for all controls
    [colorPicker, widthSlider, styleSelect, showInfoCheckbox].forEach(
        control => control.addEventListener('change', updateSettings)
    );

    // Add input event listener for target selector
    targetSelector.addEventListener('input', function () {
        updateSettings();
    });

    // Toggle button click handler
    toggleButton.addEventListener('click', function () {
        chrome.storage.sync.get(['enabled'], function (items) {
            const newState = !items.enabled;
            chrome.storage.sync.set({ enabled: newState }, function () {
                updateToggleButton(newState);

                // Get the active tab
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs[0]) {
                        // Send message to content script
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'toggleOutlines',
                            enabled: newState
                        });
                    }
                });
            });
        });
    });
}); 