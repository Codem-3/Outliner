document.addEventListener('DOMContentLoaded', function () {
    const colorPicker = document.getElementById('outlineColor');
    const colorInput = document.getElementById('colorValue');
    const widthSlider = document.getElementById('outlineWidth');
    const widthValue = document.getElementById('widthValue');
    const styleSelect = document.getElementById('outlineStyle');
    const showInfoCheckbox = document.getElementById('showElementInfo');
    const targetSelector = document.getElementById('targetSelector');
    const toggleButton = document.getElementById('toggleButton');
    const highlightParent = document.getElementById('highlightParent');

    // Load saved settings
    chrome.storage.sync.get({
        color: '#00ff9d',
        width: 1,
        style: 'solid',
        showInfo: false,
        highlightParent: false,
        targetSelector: '',
        enabled: false
    }, function (items) {
        colorPicker.value = items.color;
        colorInput.value = items.color.slice(1);
        widthSlider.value = items.width;
        widthValue.textContent = items.width + 'px';
        styleSelect.value = items.style;
        showInfoCheckbox.checked = items.showInfo;
        highlightParent.checked = items.highlightParent;
        targetSelector.value = items.targetSelector;
        updateToggleButton(items.enabled);
    });

    // Sync color picker and input with immediate color change
    colorPicker.addEventListener('input', function () {
        colorInput.value = this.value.slice(1);
        updateSettings();
    });

    colorInput.addEventListener('input', function () {
        // Validate hex color format
        const hexColor = this.value.startsWith('#') ? this.value : '#' + this.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
            colorPicker.value = hexColor;
            updateSettings();
        }
    });

    // Update width display
    widthSlider.addEventListener('input', function () {
        widthValue.textContent = this.value + 'px';
        updateSettings();
    });

    // Save settings and update outlines
    function updateSettings() {
        const settings = {
            color: colorPicker.value,
            width: widthSlider.value,
            style: styleSelect.value,
            showInfo: showInfoCheckbox.checked,
            highlightParent: highlightParent.checked,
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
        toggleButton.textContent = enabled ? 'DISABLE OUTLINES' : 'ENABLE OUTLINES';
        toggleButton.style.backgroundColor = enabled ? '#dc3545' : '#00ff9d';
    }

    // Add event listeners for all controls
    [colorPicker, widthSlider, styleSelect, showInfoCheckbox, highlightParent].forEach(
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