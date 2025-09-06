// Enhanced Krunker marketplace multi-select quick sell automation script
(function() {
    // Core function to inject selection checkboxes into marketplace item cards
    function addCheckboxesToItems() {
        const marketCards = document.querySelectorAll('.marketCard');
        
        marketCards.forEach(card => {
            // Skip if checkbox already exists to prevent duplicates
            if (!card.querySelector('.item-checkbox')) {
                const cardActions = card.querySelector('.cardActions');
                
                if (cardActions) {
                    // Create visually appealing checkbox container with modern styling
                    const checkboxContainer = document.createElement('div');
                    checkboxContainer.className = 'checkbox-container';
                    checkboxContainer.style.cssText = `
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 8px 12px;
                        margin: 5px;
                        position: relative;
                        z-index: 1000;
                        background: linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(25, 118, 210, 0.15));
                        border: 2px solid rgba(33, 150, 243, 0.4);
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        min-height: 32px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    `;
                    
                    // Interactive hover feedback for better UX
                    checkboxContainer.onmouseover = () => {
                        checkboxContainer.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.25), rgba(25, 118, 210, 0.25))';
                        checkboxContainer.style.borderColor = '#2196F3';
                        checkboxContainer.style.transform = 'translateY(-1px)';
                        checkboxContainer.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.3)';
                    };
                    
                    checkboxContainer.onmouseout = () => {
                        const checkbox = checkboxContainer.querySelector('.item-checkbox');
                        if (checkbox && checkbox.checked) {
                            // Maintain selected appearance when not hovering
                            checkboxContainer.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.25), rgba(56, 142, 60, 0.25))';
                            checkboxContainer.style.borderColor = '#4CAF50';
                        } else {
                            // Return to default state
                            checkboxContainer.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(25, 118, 210, 0.15))';
                            checkboxContainer.style.borderColor = 'rgba(33, 150, 243, 0.4)';
                        }
                        checkboxContainer.style.transform = 'translateY(0)';
                        checkboxContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                    };
                    
                    // Hidden but functional checkbox element
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'item-checkbox';
                    checkbox.style.cssText = `
                        width: 18px;
                        height: 18px;
                        cursor: pointer;
                        accent-color: #4CAF50;
                        margin-right: 8px;
                        position: relative;
                        z-index: 1001;
                        pointer-events: auto;
                    `;
                    
                    // Clear visual label for selection state
                    const label = document.createElement('span');
                    label.className = 'select-label';
                    label.textContent = 'SELECT';
                    label.style.cssText = `
                        color: #2196F3;
                        font-size: 12px;
                        cursor: pointer;
                        user-select: none;
                        position: relative;
                        z-index: 1001;
                        pointer-events: auto;
                        font-family: 'Roboto', sans-serif;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        transition: color 0.2s ease;
                    `;
                    
                    // Dynamic appearance updater based on selection state
                    const updateAppearance = () => {
                        if (checkbox.checked) {
                            // Selected state - green theme
                            checkboxContainer.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.25), rgba(56, 142, 60, 0.25))';
                            checkboxContainer.style.borderColor = '#4CAF50';
                            label.textContent = 'SELECTED';
                            label.style.color = '#4CAF50';
                            checkbox.style.accentColor = '#4CAF50';
                        } else {
                            // Default state - blue theme
                            checkboxContainer.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(25, 118, 210, 0.15))';
                            checkboxContainer.style.borderColor = 'rgba(33, 150, 243, 0.4)';
                            label.textContent = 'SELECT';
                            label.style.color = '#2196F3';
                            checkbox.style.accentColor = '#2196F3';
                        }
                    };
                    
                    // Enlarged click area for better accessibility
                    checkboxContainer.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        checkbox.checked = !checkbox.checked;
                        updateAppearance();
                        updateSelectedCount();
                        
                        // Subtle click animation feedback
                        checkboxContainer.style.transform = 'scale(0.95)';
                        requestAnimationFrame(() => {
                            checkboxContainer.style.transform = 'scale(1)';
                        });
                    };
                    
                    // Prevent event bubbling conflicts
                    checkbox.onclick = (e) => {
                        e.stopPropagation();
                    };
                    
                    checkbox.onchange = () => {
                        updateAppearance();
                        updateSelectedCount();
                    };
                    
                    // Prevent label from interfering with container clicks
                    label.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    };
                    
                    // Assemble the complete checkbox component
                    checkboxContainer.appendChild(checkbox);
                    checkboxContainer.appendChild(label);
                    
                    // Apply initial styling
                    updateAppearance();
                    
                    // Ensure proper layering with existing elements
                    cardActions.style.position = 'relative';
                    cardActions.style.zIndex = '999';
                    
                    // Insert checkbox before card actions
                    cardActions.parentNode.insertBefore(checkboxContainer, cardActions);
                }
            }
        });
    }

    // Wait for DOM element with timeout fallback
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Automatically select "All" option in quick sell dropdown
    function selectAllOption() {
        return new Promise((resolve) => {
            waitForElement('#quickSellSelect', 2000)
                .then(selectElement => {
                    console.log('QuickSell select found, setting to "All" (value 2)');
                    selectElement.value = '2'; // Set to "All" option
                    
                    // Trigger change event for any listeners
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    console.log('QuickSell select set to:', selectElement.value);
                    resolve(true);
                })
                .catch(error => {
                    console.error('Could not find quickSellSelect:', error);
                    resolve(false);
                });
        });
    }

    // Main bulk quick sell function with optimized processing
    function quickSellSelected() {
        const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked');
        const selectedItems = [];
        
        // Gather all selected items' data
        selectedCheckboxes.forEach(checkbox => {
            const card = checkbox.closest('.marketCard');
            const quickSellData = getQuickSellData(card);
            if (quickSellData) {
                selectedItems.push(quickSellData);
            }
        });

        if (selectedItems.length === 0) {
            alert('No items selected!');
            return;
        }

        // Create confirmation dialog with item details
        const itemsList = selectedItems.map(item => 
            `${item.name}${item.actualQuantity > 1 ? ` (x${item.actualQuantity} - ALL will be sold)` : ''}`
        ).join('\n');
        
        if (confirm(`Sell ${selectedItems.length} item(s) with auto "All" selection?\n\nThe script will automatically select "All" for each item.\n\nThis action cannot be undone!`)) {
            console.log(`Starting quick sell of ${selectedItems.length} items with auto-select "All"...`);
            
            let currentIndex = 0;
            
            // Sequential item processing for reliability
            function processNextItem() {
                if (currentIndex >= selectedItems.length) {
                    // Clean up UI state after completion
                    document.querySelectorAll('.item-checkbox:checked').forEach(cb => {
                        cb.checked = false;
                        // Reset button appearance
                        const container = cb.closest('.checkbox-container');
                        const label = container.querySelector('.select-label');
                        if (container && label) {
                            container.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(25, 118, 210, 0.15))';
                            container.style.borderColor = 'rgba(33, 150, 243, 0.4)';
                            label.textContent = 'SELECT';
                            label.style.color = '#2196F3';
                        }
                    });
                    updateSelectedCount();
                    console.log('Quick sell completed, checkboxes unchecked');
                    return;
                }
                
                const item = selectedItems[currentIndex];
                console.log(`Processing item ${currentIndex + 1}/${selectedItems.length}: ${item.name} (ID: ${item.itemId})`);
                
                // Execute quick sell with game's native function
                if (typeof quickSell === 'function') {
                    quickSell(parseInt(item.itemId), parseInt(item.quantity), parseInt(item.index));
                    console.log(`quickSell called: quickSell(${item.itemId}, ${item.quantity}, ${item.index})`);
                    
                    // Handle popup automation
                    selectAllOption().then(success => {
                        if (success) {
                            console.log(`Auto-selected "All" for item: ${item.name}`);
                            
                            // Auto-click confirmation button
                            const confirmButton = document.querySelector('#genericPop button, #genericPop .button, #genericPop [onclick*="sellConfirmed"], #genericPop [onclick*="confirm"]');
                            if (confirmButton) {
                                confirmButton.click();
                                console.log(`Confirm button clicked for: ${item.name}`);
                            } else {
                                console.log('No confirm button found, popup might auto-close');
                            }
                        } else {
                            console.log(`Failed to auto-select "All" for item: ${item.name}, continuing anyway...`);
                        }
                        
                        // Move to next item immediately
                        currentIndex++;
                        processNextItem();
                    });
                } else {
                    console.error('quickSell function not found');
                    currentIndex++;
                    processNextItem();
                }
            }
            
            // Begin processing chain
            processNextItem();
        }
    }

    // Update selection counter in control panel
    function updateSelectedCount() {
        const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
        const totalCount = document.querySelectorAll('.item-checkbox').length;
        
        const selectedCounter = document.querySelector('#selectedCounter');
        const totalCounter = document.querySelector('#totalCounter');
        
        if (selectedCounter) {
            selectedCounter.textContent = selectedCount;
            selectedCounter.style.color = selectedCount > 0 ? '#4CAF50' : '#666';
        }
        
        if (totalCounter) {
            totalCounter.textContent = totalCount;
        }
        
        // Update select all button text
        const selectAllBtn = document.querySelector('#selectAllBtn');
        if (selectAllBtn) {
            const allSelected = selectedCount === totalCount && totalCount > 0;
            selectAllBtn.textContent = allSelected ? 'DESELECT ALL ITEMS' : 'SELECT ALL ITEMS';
        }
    }

    // Create floating control panel UI
    function createControlButtons() {
        // Prevent duplicate control panels
        if (document.querySelector('#quickSellMultipleBtn')) return;

        const controlPanel = document.createElement('div');
        controlPanel.id = 'multiSellControls';
        controlPanel.style.cssText = `
            position: fixed;
            top: 50px;
            left: 60px;
            background: linear-gradient(135deg, rgba(30, 34, 42, 0.98), rgba(25, 29, 35, 0.98));
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(33, 150, 243, 0.5);
            z-index: 10000;
            width: 280px;
            backdrop-filter: blur(15px);
            font-family: 'Roboto', sans-serif;
            overflow: hidden;
            transition: none;
            max-height: 400px;
        `;

        // Draggable header section
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #2196F3, #1976D2);
            padding: 12px 16px;
            color: white;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            cursor: move;
        `;
        header.textContent = 'QUICK SELL MULTIPLE';

        // Close button for panel dismissal
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 50%;
            right: 12px;
            transform: translateY(-50%);
            width: 24px;
            height: 24px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        closeBtn.onmouseover = () => {
            closeBtn.style.background = 'rgba(244, 67, 54, 0.8)';
            closeBtn.style.transform = 'translateY(-50%) scale(1.1)';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            closeBtn.style.transform = 'translateY(-50%) scale(1)';
        };
        closeBtn.onclick = () => {
            controlPanel.remove();
            console.log('Control panel closed');
        };

        header.appendChild(closeBtn);

        // Main content container
        const body = document.createElement('div');
        body.style.cssText = `
            padding: 16px;
        `;

        // Feature description section
        const infoSection = document.createElement('div');
        infoSection.style.cssText = `
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 16px;
        `;

        const infoTitle = document.createElement('div');
        infoTitle.textContent = 'AUTO-SELECT ALL MODE';
        infoTitle.style.cssText = `
            color: #4CAF50;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        `;

        const infoText = document.createElement('div');
        infoText.textContent = 'Automatically selects "All" option in quick sell popup for each item';
        infoText.style.cssText = `
            color: rgba(76, 175, 80, 0.9);
            font-size: 10px;
            line-height: 1.4;
        `;

        infoSection.appendChild(infoTitle);
        infoSection.appendChild(infoText);

        // Live selection statistics
        const statsSection = document.createElement('div');
        statsSection.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        `;

        const selectedStat = document.createElement('div');
        selectedStat.style.cssText = `
            text-align: center;
            flex: 1;
        `;
        selectedStat.innerHTML = `
            <div style="color: #4CAF50; font-size: 18px; font-weight: 600; line-height: 1;" id="selectedCounter">0</div>
            <div style="color: #888; font-size: 10px; text-transform: uppercase;">Selected</div>
        `;

        const totalStat = document.createElement('div');
        totalStat.style.cssText = `
            text-align: center;
            flex: 1;
        `;
        totalStat.innerHTML = `
            <div style="color: #2196F3; font-size: 18px; font-weight: 600; line-height: 1;" id="totalCounter">0</div>
            <div style="color: #888; font-size: 10px; text-transform: uppercase;">Total Items</div>
        `;

        statsSection.appendChild(selectedStat);
        statsSection.appendChild(totalStat);

        // Action buttons section
        const buttonsSection = document.createElement('div');
        buttonsSection.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        // Mass selection toggle button
        const selectAllBtn = document.createElement('button');
        selectAllBtn.id = 'selectAllBtn';
        selectAllBtn.textContent = 'SELECT ALL ITEMS';
        selectAllBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
        `;
        selectAllBtn.onclick = () => {
            const checkboxes = document.querySelectorAll('.item-checkbox');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            
            // Toggle all checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
                // Update visual state immediately
                const container = checkbox.closest('.checkbox-container');
                const label = container.querySelector('.select-label');
                if (container && label) {
                    if (checkbox.checked) {
                        container.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.25), rgba(56, 142, 60, 0.25))';
                        container.style.borderColor = '#4CAF50';
                        label.textContent = 'SELECTED';
                        label.style.color = '#4CAF50';
                    } else {
                        container.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(25, 118, 210, 0.15))';
                        container.style.borderColor = 'rgba(33, 150, 243, 0.4)';
                        label.textContent = 'SELECT';
                        label.style.color = '#2196F3';
                    }
                }
            });
            
            updateSelectedCount();
        };

        // Hover effects for better interactivity
        selectAllBtn.onmouseover = () => {
            selectAllBtn.style.background = 'linear-gradient(135deg, #1976D2, #1565C0)';
            selectAllBtn.style.transform = 'translateY(-1px)';
        };
        selectAllBtn.onmouseout = () => {
            selectAllBtn.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
            selectAllBtn.style.transform = 'translateY(0)';
        };

        // Primary action button for bulk selling
        const quickSellBtn = document.createElement('button');
        quickSellBtn.id = 'quickSellMultipleBtn';
        quickSellBtn.textContent = 'EXECUTE QUICK SELL';
        quickSellBtn.style.cssText = `
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
        `;
        quickSellBtn.onclick = quickSellSelected;

        // Destructive action styling
        quickSellBtn.onmouseover = () => {
            quickSellBtn.style.background = 'linear-gradient(135deg, #d32f2f, #c62828)';
            quickSellBtn.style.transform = 'translateY(-1px)';
        };
        quickSellBtn.onmouseout = () => {
            quickSellBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
            quickSellBtn.style.transform = 'translateY(0)';
        };

        // Assemble complete control panel
        buttonsSection.appendChild(selectAllBtn);
        buttonsSection.appendChild(quickSellBtn);

        body.appendChild(infoSection);
        body.appendChild(statsSection);
        body.appendChild(buttonsSection);

        controlPanel.appendChild(header);
        controlPanel.appendChild(body);
        
        document.body.appendChild(controlPanel);

        // Initialize counters
        updateSelectedCount();
    }

    // Monitor for quick sell popup appearances
    function observeQuickSellPopup() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const popup = node.querySelector('#genericPop') || (node.id === 'genericPop' ? node : null);
                        if (popup) {
                            console.log('Quick sell popup detected');
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('Quick sell popup observer started');
    }

    // Extract quick sell parameters from item card
    function getQuickSellData(card) {
        try {
            const quickSellButton = card.querySelector('[onclick*="quickSell"]');
            if (!quickSellButton) return null;

            // Parse onclick attribute to extract item parameters
            const onclickValue = quickSellButton.getAttribute('onclick');
            const match = onclickValue.match(/quickSell\((\d+),\s*(\d+),\s*(\d+)\)/);
            
            if (match) {
                const [, itemId, quantity, index] = match;
                
                // Extract item name for logging purposes
                const itemName = card.querySelector('.itemName, .item-name, h3, .title')?.textContent?.trim() || 'Unknown Item';
                
                return {
                    itemId: itemId,
                    quantity: quantity,
                    index: index,
                    name: itemName,
                    actualQuantity: parseInt(quantity)
                };
            }
            
            console.error('Could not parse quickSell parameters from:', onclickValue);
            return null;
        } catch (error) {
            console.error('Error extracting quick sell data:', error);
            return null;
        }
    }

    // Main initialization function
    function init() {
        addCheckboxesToItems();
        createControlButtons();
        observeQuickSellPopup();
        
        // Auto-refresh checkboxes when new items load
        const observer = new MutationObserver(() => {
            addCheckboxesToItems();
            updateSelectedCount();
        });
        
        const marketList = document.getElementById('marketList');
        if (marketList) {
            observer.observe(marketList, { childList: true, subtree: true });
        }
        
        console.log('Krunker Quick Sell Multiple activated!');
        console.log('Auto-select "All" option enabled for multiple items');
        console.log('Popup observer active');
    }

    // Bootstrap the entire script
    init();
})();
