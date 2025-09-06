// Script pour ajouter des checkboxes et fonction de quick sell multiple
(function() {
    // Ajouter les checkboxes à chaque carte d'item
    function addCheckboxesToItems() {
        const marketCards = document.querySelectorAll('.marketCard');
        
        marketCards.forEach(card => {
            // Vérifier si la checkbox n'existe pas déjà
            if (!card.querySelector('.item-checkbox')) {
                const cardActions = card.querySelector('.cardActions');
                
                if (cardActions) {
                    // Créer un conteneur pour la checkbox - PLUS GRAND
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
                    
                    // Effets hover pour le conteneur
                    checkboxContainer.onmouseover = () => {
                        checkboxContainer.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.25), rgba(25, 118, 210, 0.25))';
                        checkboxContainer.style.borderColor = '#2196F3';
                        checkboxContainer.style.transform = 'translateY(-1px)';
                        checkboxContainer.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.3)';
                    };
                    
                    checkboxContainer.onmouseout = () => {
                        const checkbox = checkboxContainer.querySelector('.item-checkbox');
                        if (checkbox && checkbox.checked) {
                            // État sélectionné
                            checkboxContainer.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.25), rgba(56, 142, 60, 0.25))';
                            checkboxContainer.style.borderColor = '#4CAF50';
                        } else {
                            // État normal
                            checkboxContainer.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(25, 118, 210, 0.15))';
                            checkboxContainer.style.borderColor = 'rgba(33, 150, 243, 0.4)';
                        }
                        checkboxContainer.style.transform = 'translateY(0)';
                        checkboxContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                    };
                    
                    // Créer la checkbox - CACHÉE mais fonctionnelle
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
                    
                    // Créer le label - PLUS VISIBLE
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
                    
                    // Fonction pour mettre à jour l'apparence selon l'état
                    const updateAppearance = () => {
                        if (checkbox.checked) {
                            // État sélectionné - VERT
                            checkboxContainer.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.25), rgba(56, 142, 60, 0.25))';
                            checkboxContainer.style.borderColor = '#4CAF50';
                            label.textContent = 'SELECTED';
                            label.style.color = '#4CAF50';
                            checkbox.style.accentColor = '#4CAF50';
                        } else {
                            // État normal - BLEU
                            checkboxContainer.style.background = 'linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(25, 118, 210, 0.15))';
                            checkboxContainer.style.borderColor = 'rgba(33, 150, 243, 0.4)';
                            label.textContent = 'SELECT';
                            label.style.color = '#2196F3';
                            checkbox.style.accentColor = '#2196F3';
                        }
                    };
                    
                    // Event pour tout le conteneur - ZONE DE CLIC ÉLARGIE
                    checkboxContainer.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        checkbox.checked = !checkbox.checked;
                        updateAppearance();
                        updateSelectedCount();
                        
                        // Effet visuel de clic immédiat
                        checkboxContainer.style.transform = 'scale(0.95)';
                        requestAnimationFrame(() => {
                            checkboxContainer.style.transform = 'scale(1)';
                        });
                    };
                    
                    // Events pour la checkbox
                    checkbox.onclick = (e) => {
                        e.stopPropagation();
                    };
                    
                    checkbox.onchange = () => {
                        updateAppearance();
                        updateSelectedCount();
                    };
                    
                    // Event pour le label
                    label.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    };
                    
                    // Assemblage initial
                    checkboxContainer.appendChild(checkbox);
                    checkboxContainer.appendChild(label);
                    
                    // Apparence initiale
                    updateAppearance();
                    
                    // S'assurer que cardActions ne bloque pas les clics
                    cardActions.style.position = 'relative';
                    cardActions.style.zIndex = '999';
                    
                    // Insérer le conteneur avant cardActions
                    cardActions.parentNode.insertBefore(checkboxContainer, cardActions);
                }
            }
        });
    }

    // Fonction pour sélectionner "All" dans le dropdown
    function selectAllOption() {
        return new Promise((resolve) => {
            waitForElement('#quickSellSelect', 2000)
                .then(selectElement => {
                    console.log('QuickSell select found, setting to "All" (value 2)');
                    selectElement.value = '2'; // Sélectionner "All"
                    
                    // Déclencher l'event change au cas où
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

    // Fonction pour quick sell multiple MODIFIÉE sans délais
    function quickSellSelected() {
        const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked');
        const selectedItems = [];
        
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

        const itemsList = selectedItems.map(item => 
            `${item.name}${item.actualQuantity > 1 ? ` (x${item.actualQuantity} - ALL will be sold)` : ''}`
        ).join('\n');
        
        if (confirm(`Sell ${selectedItems.length} item(s) with auto "All" selection?\n\nThe script will automatically select "All" for each item.\n\nThis action cannot be undone!`)) {
            console.log(`Starting quick sell of ${selectedItems.length} items with auto-select "All"...`);
            
            let currentIndex = 0;
            
            function processNextItem() {
                if (currentIndex >= selectedItems.length) {
                    // Tous les items ont été traités - nettoyage immédiat
                    document.querySelectorAll('.item-checkbox:checked').forEach(cb => {
                        cb.checked = false;
                        // Mettre à jour l'apparence des boutons
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
                
                // Déclencher quickSell immédiatement
                if (typeof quickSell === 'function') {
                    quickSell(parseInt(item.itemId), parseInt(item.quantity), parseInt(item.index));
                    console.log(`quickSell called: quickSell(${item.itemId}, ${item.quantity}, ${item.index})`);
                    
                    // Traitement immédiat du popup
                    selectAllOption().then(success => {
                        if (success) {
                            console.log(`Auto-selected "All" for item: ${item.name}`);
                            
                            // Cliquer immédiatement sur le bouton de confirmation
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
                        
                        // Passer immédiatement au prochain item
                        currentIndex++;
                        processNextItem();
                    });
                } else {
                    console.error('quickSell function not found');
                    currentIndex++;
                    processNextItem();
                }
            }
            
            // Commencer le traitement immédiatement
            processNextItem();
        }
    }

    // Créer les boutons de contrôle
    function createControlButtons() {
        // Vérifier si les boutons existent déjà
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

        // Header du panneau
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

        // Rendre le panneau draggable - Version temps réel
        let isDragging = false;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - controlPanel.getBoundingClientRect().left;
            initialY = e.clientY - controlPanel.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                const x = e.clientX - initialX;
                const y = e.clientY - initialY;
                
                controlPanel.style.left = x + 'px';
                controlPanel.style.top = y + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
                header.style.cursor = 'move';
            }
        });

        // Bouton fermer dans le header
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

        // Body du panneau
        const body = document.createElement('div');
        body.style.cssText = `
            padding: 16px;
        `;

        // Info section
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

        // Stats section
        const statsSection = document.createElement('div');
        statsSection.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        `;

        const selectedCount = document.createElement('div');
        selectedCount.style.cssText = `
            text-align: center;
            flex: 1;
        `;
        selectedCount.innerHTML = `
            <div style="color: #2196F3; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">SELECTED</div>
            <div id="selectedCountNumber" style="color: #4CAF50; font-size: 18px; font-weight: 700;">0</div>
        `;

        const totalItems = document.createElement('div');
        totalItems.style.cssText = `
            text-align: center;
            flex: 1;
        `;
        totalItems.innerHTML = `
            <div style="color: #2196F3; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">TOTAL</div>
            <div style="color: #757575; font-size: 18px; font-weight: 700;">${document.querySelectorAll('.marketCard').length}</div>
        `;

        statsSection.appendChild(selectedCount);
        statsSection.appendChild(totalItems);

        // Buttons section
        const buttonsSection = document.createElement('div');
        buttonsSection.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // Select All Button
        const selectAllBtn = document.createElement('button');
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
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
                // Mettre à jour l'apparence immédiatement
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
            
            selectAllBtn.textContent = allChecked ? 'SELECT ALL ITEMS' : 'DESELECT ALL ITEMS';
            updateSelectedCount();
        };

        // Quick Sell Button
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

        // Assembler le panneau
        buttonsSection.appendChild(selectAllBtn);
        buttonsSection.appendChild(quickSellBtn);

        body.appendChild(infoSection);
        body.appendChild(statsSection);
        body.appendChild(buttonsSection);

        controlPanel.appendChild(header);
        controlPanel.appendChild(body);
        
        document.body.appendChild(controlPanel);
    }

    // Fonction pour compter les items sélectionnés
    function updateSelectedCount() {
        const selectedCount = document.querySelectorAll('.item-checkbox:checked').length;
        const selectedCountNumber = document.getElementById('selectedCountNumber');
        const quickSellBtn = document.getElementById('quickSellMultipleBtn');
        
        if (selectedCountNumber) {
            selectedCountNumber.textContent = selectedCount;
        }
        
        if (quickSellBtn) {
            quickSellBtn.textContent = selectedCount > 0 ? 
                `EXECUTE QUICK SELL (${selectedCount})` : 
                'EXECUTE QUICK SELL';
            
            // Changer la couleur du bouton selon l'état
            if (selectedCount > 0) {
                quickSellBtn.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
                quickSellBtn.onmouseover = () => {
                    quickSellBtn.style.background = 'linear-gradient(135deg, #388E3C, #2E7D32)';
                };
                quickSellBtn.onmouseout = () => {
                    quickSellBtn.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
                };
            } else {
                quickSellBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                quickSellBtn.onmouseover = () => {
                    quickSellBtn.style.background = 'linear-gradient(135deg, #d32f2f, #c62828)';
                };
                quickSellBtn.onmouseout = () => {
                    quickSellBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                };
            }
        }
    }

    // Fonction helper pour waitForElement
    function waitForElement(selector, timeout) {
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

    // Fonction pour observer les popups de quick sell
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

    // Fonction pour extraire les données de quick sell
    function getQuickSellData(card) {
        try {
            const quickSellButton = card.querySelector('[onclick*="quickSell"]');
            if (!quickSellButton) return null;

            const onclick = quickSellButton.getAttribute('onclick');
            const matches = onclick.match(/quickSell\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
            
            if (matches) {
                const itemName = card.querySelector('.itemName')?.textContent?.trim() || 'Unknown Item';
                const quantity = card.querySelector('.itemOwn')?.textContent?.match(/\d+/)?.[0] || '1';
                
                return {
                    itemId: matches[1],
                    quantity: matches[2],
                    index: matches[3],
                    name: itemName,
                    actualQuantity: parseInt(quantity)
                };
            }
        } catch (error) {
            console.error('Error extracting quick sell data:', error);
        }
        return null;
    }

    // Initialiser le script
    function init() {
        addCheckboxesToItems();
        createControlButtons();
        observeQuickSellPopup();
        
        // Observer pour ajouter des checkboxes aux nouveaux éléments
        const observer = new MutationObserver(() => {
            addCheckboxesToItems();
        });
        
        const marketList = document.getElementById('marketList');
        if (marketList) {
            observer.observe(marketList, { childList: true, subtree: true });
        }
        
        console.log('Krunker Quick Sell Multiple activated!');
        console.log('Auto-select "All" option enabled for multiple items');
        console.log('Popup observer active');
    }

    // Lancer le script
    init();
})();
