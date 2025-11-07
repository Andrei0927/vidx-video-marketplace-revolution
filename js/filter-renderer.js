/**
 * Dynamic Filter Renderer
 * Generates filter UI from schema definitions
 * For vidx-video-marketplace-revolution
 */

class FilterRenderer {
    constructor(schema, containerId, options = {}) {
        this.schema = schema;
        this.container = document.getElementById(containerId);
        this.filters = {};
        this.callbacks = {
            onChange: options.onChange || null,
            onApply: options.onApply || null,
            onClear: options.onClear || null
        };
        // Support for make-model data
        this.carModels = options.carModels || {};
    }

    /**
     * Render all filters from schema
     */
    render() {
        if (!this.container) {
            console.error('Filter container not found');
            return;
        }

        this.container.innerHTML = '';
        
        // Separate filters into always-visible and advanced
        const alwaysVisible = [];
        const advanced = [];
        
        Object.entries(this.schema).forEach(([key, config]) => {
            if (config.alwaysVisible) {
                alwaysVisible.push([key, config]);
            } else {
                advanced.push([key, config]);
            }
        });
        
        // Render always-visible filters
        alwaysVisible.forEach(([key, config]) => {
            const filterElement = this.renderFilter(key, config);
            if (filterElement) {
                this.container.appendChild(filterElement);
            }
        });
        
        // Render advanced filters in collapsible section
        if (advanced.length > 0) {
            const advancedSection = this.renderAdvancedFiltersSection(advanced);
            this.container.appendChild(advancedSection);
        }

        // Add action buttons
        this.renderActionButtons();
    }

    /**
     * Render individual filter based on type
     */
    renderFilter(key, config) {
        const wrapper = document.createElement('div');
        
        // Add width class for grid layout
        const widthClass = config.width === 'full' ? 'filter-full' : 
                          config.width === 'half' ? 'filter-half' : '';
        
        // Add collapsible class if needed
        if (config.collapsible) {
            wrapper.className = `border border-gray-200 dark:border-dark-300 rounded-lg ${widthClass}`.trim();
            return this.renderCollapsibleFilter(key, config, wrapper);
        }

        // Render based on type with compact classes
        switch (config.type) {
            case 'range':
                wrapper.className = `filter-card-compact ${widthClass}`.trim();
                wrapper.appendChild(this.renderRangeFilter(key, config));
                break;
            case 'dropdown':
                wrapper.className = `filter-card-compact ${widthClass}`.trim();
                wrapper.appendChild(this.renderDropdownFilter(key, config));
                break;
            case 'multi-select':
                wrapper.className = `border border-gray-200 dark:border-dark-300 rounded-lg ${widthClass}`.trim();
                return this.renderMultiSelectFilter(key, config, wrapper);
            case 'radio':
                wrapper.className = `filter-card-compact ${widthClass}`.trim();
                wrapper.appendChild(this.renderRadioFilter(key, config));
                break;
            case 'text':
                wrapper.className = `filter-card-compact ${widthClass}`.trim();
                wrapper.appendChild(this.renderTextFilter(key, config));
                break;
            case 'single-select':
                wrapper.className = `border border-gray-200 dark:border-dark-300 rounded-lg ${widthClass}`.trim();
                return this.renderSingleSelectFilter(key, config, wrapper);
            default:
                return null;
        }

        return wrapper;
    }

    /**
     * Render Advanced Filters Section (collapsible mega-section)
     */
    renderAdvancedFiltersSection(advancedFilters) {
        const wrapper = document.createElement('div');
        wrapper.className = 'filter-full border border-indigo-200 dark:border-indigo-900 rounded-lg mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950';
        
        const toggle = document.createElement('div');
        toggle.className = 'filter-toggle flex justify-between items-center p-4 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-t-lg';
        toggle.innerHTML = `
            <div class="flex items-center gap-3">
                <i data-feather="sliders" class="h-5 w-5 text-indigo-600 dark:text-indigo-400"></i>
                <span class="font-semibold text-indigo-900 dark:text-indigo-100">Advanced Filters</span>
                <span class="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-2 py-0.5 rounded-full">${advancedFilters.length} filters</span>
            </div>
            <i data-feather="chevron-down" class="h-5 w-5 text-indigo-600 dark:text-indigo-400 transition-transform"></i>
        `;
        
        const content = document.createElement('div');
        content.className = 'filter-section';
        content.id = 'advanced-filters-section';
        
        // Create a grid for advanced filters
        const grid = document.createElement('div');
        grid.className = 'filter-compact-grid p-4 pt-2';
        
        advancedFilters.forEach(([key, config]) => {
            const filterElement = this.renderFilter(key, config);
            if (filterElement) {
                grid.appendChild(filterElement);
            }
        });
        
        content.appendChild(grid);
        
        // Add toggle functionality
        toggle.addEventListener('click', () => {
            content.classList.toggle('active');
            const icon = toggle.querySelector('i[data-feather="chevron-down"]');
            if (content.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
            // Re-render feather icons for the newly revealed content
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
        
        wrapper.appendChild(toggle);
        wrapper.appendChild(content);
        
        // Re-render feather icons
        setTimeout(() => {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }, 0);
        
        return wrapper;
    }

    /**
     * Render collapsible filter wrapper
     */
    renderCollapsibleFilter(key, config, wrapper) {
        const toggle = document.createElement('div');
        toggle.className = 'filter-toggle flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-200';
        toggle.innerHTML = `
            <span class="font-medium text-gray-900 dark:text-dark-600">${config.label}</span>
            <i data-feather="chevron-down" class="h-5 w-5 text-gray-500 transition-transform"></i>
        `;

        const content = document.createElement('div');
        content.className = 'filter-section p-4 pt-0';
        content.id = `${key}-section`;

        // Render content based on type
        if (config.type === 'multi-select') {
            content.appendChild(this.renderMultiSelectContent(key, config));
        } else if (config.type === 'radio') {
            content.appendChild(this.renderRadioFilter(key, config));
        } else if (config.type === 'range') {
            content.appendChild(this.renderRangeFilter(key, config));
        } else if (config.type === 'text') {
            content.appendChild(this.renderTextFilter(key, config));
        }

        // Add toggle functionality
        toggle.addEventListener('click', () => {
            content.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (content.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });

        wrapper.appendChild(toggle);
        wrapper.appendChild(content);
        return wrapper;
    }

    /**
     * Render range filter (from/to inputs)
     */
    renderRangeFilter(key, config) {
        const container = document.createElement('div');
        
        const label = document.createElement('label');
        label.className = 'filter-label-sm';
        label.textContent = config.label;
        container.appendChild(label);

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'filter-range-row';

        const fromInput = document.createElement('input');
        fromInput.type = 'number';
        fromInput.id = config.inputs.from.id;
        fromInput.name = `${key}-from`;
        fromInput.placeholder = config.inputs.from.placeholder;
        fromInput.className = 'filter-input-sm';
        if (config.range) {
            fromInput.min = config.range.min;
            fromInput.max = config.range.max;
            fromInput.step = config.range.step;
        }

        const separator = document.createElement('span');
        separator.className = 'filter-range-separator';
        separator.textContent = '—';

        const toInput = document.createElement('input');
        toInput.type = 'number';
        toInput.id = config.inputs.to.id;
        toInput.name = `${key}-to`;
        toInput.placeholder = config.inputs.to.placeholder;
        toInput.className = 'filter-input-sm';
        if (config.range) {
            toInput.min = config.range.min;
            toInput.max = config.range.max;
            toInput.step = config.range.step;
        }

        inputWrapper.appendChild(fromInput);
        inputWrapper.appendChild(separator);
        inputWrapper.appendChild(toInput);
        container.appendChild(inputWrapper);

        // Add event listeners
        fromInput.addEventListener('change', () => this.triggerChange());
        toInput.addEventListener('change', () => this.triggerChange());

        return container;
    }

    /**
     * Render dropdown filter
     */
    renderDropdownFilter(key, config) {
        const container = document.createElement('div');
        
        const label = document.createElement('label');
        label.className = 'filter-label-sm';
        label.textContent = config.label;
        container.appendChild(label);

        const select = document.createElement('select');
        select.id = `${key}-select`;
        select.name = key;
        select.className = 'filter-input-sm';
        if (config.required) {
            select.required = true;
        }
        
        // Check if this is a dependent dropdown (e.g., model depends on make)
        if (config.dependsOn) {
            select.disabled = true;
            select.innerHTML = '<option value="">Select ' + config.dependsOn + ' first</option>';
        } else {
            config.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                select.appendChild(option);
            });
        }

        // Special handling for make dropdown
        if (key === 'make' && this.carModels) {
            select.addEventListener('change', () => {
                this.handleMakeChange(select.value);
                this.triggerChange();
            });
        } else {
            select.addEventListener('change', () => this.triggerChange());
        }
        
        container.appendChild(select);

        return container;
    }

    /**
     * Handle make selection to populate model dropdown
     */
    handleMakeChange(selectedMake) {
        const modelSelect = document.getElementById('model-select');
        if (!modelSelect) return;

        modelSelect.innerHTML = '<option value="">Any</option>';
        
        if (selectedMake && this.carModels[selectedMake]) {
            modelSelect.disabled = false;
            const models = this.carModels[selectedMake];
            
            if (models.length === 0) {
                // For "Other" or makes without models
                modelSelect.innerHTML = '<option value="">Not applicable</option>';
                modelSelect.disabled = true;
            } else {
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelSelect.appendChild(option);
                });
            }
        } else if (selectedMake) {
            // Make selected but no models defined
            modelSelect.innerHTML = '<option value="">Any</option><option value="Other">Other</option>';
            modelSelect.disabled = false;
        } else {
            // No make selected
            modelSelect.innerHTML = '<option value="">Select make first</option>';
            modelSelect.disabled = true;
        }
    }

    /**
     * Render multi-select filter (checkboxes)
     */
    renderMultiSelectFilter(key, config, wrapper) {
        if (config.collapsible) {
            return this.renderCollapsibleFilter(key, config, wrapper);
        }

        const toggle = document.createElement('div');
        toggle.className = 'filter-toggle flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-200';
        toggle.innerHTML = `
            <span class="font-medium text-gray-900 dark:text-dark-600">${config.label}</span>
            <i data-feather="chevron-down" class="h-5 w-5 text-gray-500 transition-transform"></i>
        `;

        const content = document.createElement('div');
        content.className = 'filter-section p-4 pt-0';
        content.id = `${key}-section`;
        content.appendChild(this.renderMultiSelectContent(key, config));

        toggle.addEventListener('click', () => {
            content.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (content.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });

        wrapper.appendChild(toggle);
        wrapper.appendChild(content);
        return wrapper;
    }

    /**
     * Render multi-select content (checkbox grid)
     */
    renderMultiSelectContent(key, config) {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 md:grid-cols-3 gap-3';

        config.options.forEach(opt => {
            const label = document.createElement('label');
            label.className = 'flex items-center space-x-2 cursor-pointer';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = key;
            checkbox.value = opt.value;
            checkbox.className = 'rounded text-indigo-600';
            checkbox.addEventListener('change', () => this.triggerChange());

            const span = document.createElement('span');
            span.className = 'text-sm text-gray-700 dark:text-dark-500';
            span.textContent = opt.label;

            label.appendChild(checkbox);
            label.appendChild(span);
            grid.appendChild(label);
        });

        return grid;
    }

    /**
     * Render radio filter
     */
    renderRadioFilter(key, config) {
        const container = document.createElement('div');
        
        const label = document.createElement('label');
        label.className = 'filter-label-sm';
        label.textContent = config.label;
        container.appendChild(label);

        const radioGroup = document.createElement('div');
        radioGroup.className = 'flex flex-col space-y-1.5';

        config.options.forEach(opt => {
            const radioLabel = document.createElement('label');
            radioLabel.className = 'filter-checkbox-item';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = key;
            radio.value = opt.value;
            radio.className = 'text-indigo-600';
            if (opt.value === '') {
                radio.checked = true;
            }
            radio.addEventListener('change', () => this.triggerChange());

            const span = document.createElement('span');
            span.className = 'text-sm text-gray-700 dark:text-dark-500';
            span.textContent = opt.label;

            radioLabel.appendChild(radio);
            radioLabel.appendChild(span);
            radioGroup.appendChild(radioLabel);
        });

        container.appendChild(radioGroup);
        return container;
    }

    /**
     * Render text filter
     */
    renderTextFilter(key, config) {
        const container = document.createElement('div');
        
        const label = document.createElement('label');
        label.className = 'filter-label-sm';
        label.textContent = config.label;
        container.appendChild(label);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `${key}-input`;
        input.name = key;
        input.placeholder = config.placeholder || '';
        input.className = 'filter-input-sm';
        
        if (config.helpText) {
            const helpText = document.createElement('p');
            helpText.className = 'mt-1.5 text-xs text-gray-500 dark:text-dark-400';
            helpText.textContent = config.helpText;
            container.appendChild(input);
            container.appendChild(helpText);
        } else {
            container.appendChild(input);
        }

        input.addEventListener('input', () => this.triggerChange());

        return container;
    }

    /**
     * Render single-select filter (like categories with counts)
     */
    renderSingleSelectFilter(key, config, wrapper) {
        const list = document.createElement('div');
        list.className = 'divide-y divide-gray-200 dark:divide-dark-300';

        config.options.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'p-3 hover:bg-gray-50 dark:hover:bg-dark-200 cursor-pointer transition';
            item.dataset.value = opt.value;
            
            item.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-700 dark:text-dark-500">${opt.label}</span>
                    ${opt.count !== null ? `<span class="text-xs text-gray-500 dark:text-dark-400">${opt.count || ''}</span>` : ''}
                </div>
            `;

            item.addEventListener('click', () => {
                // Handle selection
                this.triggerChange();
            });

            list.appendChild(item);
        });

        wrapper.appendChild(list);
        return wrapper;
    }

    /**
     * Render action buttons
     */
    renderActionButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'filter-action-buttons';
        buttonContainer.className = 'flex space-x-4 mt-6 md:mt-6 md:order-last';

        const applyBtn = document.createElement('button');
        applyBtn.id = 'apply-filters';
        applyBtn.className = 'flex-1 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-medium';
        applyBtn.innerHTML = '<i data-feather="search" class="inline h-4 w-4 mr-2"></i>Apply Filters';
        applyBtn.addEventListener('click', () => this.applyFilters());

        const clearBtn = document.createElement('button');
        clearBtn.id = 'clear-filters';
        clearBtn.className = 'px-6 py-3 border border-gray-300 dark:border-dark-300 text-gray-700 dark:text-dark-500 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-200 transition font-medium';
        clearBtn.innerHTML = '<i data-feather="x" class="inline h-4 w-4 mr-2"></i>Clear All';
        clearBtn.addEventListener('click', () => this.clearFilters());

        buttonContainer.appendChild(applyBtn);
        buttonContainer.appendChild(clearBtn);
        
        // Insert at the beginning on mobile, at the end on desktop
        if (this.container.firstChild) {
            this.container.insertBefore(buttonContainer, this.container.firstChild);
        } else {
            this.container.appendChild(buttonContainer);
        }

        // Replace feather icons
        if (window.feather) {
            feather.replace();
        }
    }

    /**
     * Get all current filter values
     */
    getFilters() {
        const filters = {};

        Object.keys(this.schema).forEach(key => {
            const config = this.schema[key];
            
            switch (config.type) {
                case 'range':
                    const fromInput = document.getElementById(config.inputs.from.id);
                    const toInput = document.getElementById(config.inputs.to.id);
                    if (fromInput && fromInput.value) filters[`${key}From`] = fromInput.value;
                    if (toInput && toInput.value) filters[`${key}To`] = toInput.value;
                    break;
                    
                case 'dropdown':
                    const select = document.getElementById(`${key}-select`);
                    if (select && select.value) filters[key] = select.value;
                    break;
                    
                case 'multi-select':
                    const checkboxes = document.querySelectorAll(`input[name="${key}"]:checked`);
                    if (checkboxes.length > 0) {
                        filters[key] = Array.from(checkboxes).map(cb => cb.value);
                    }
                    break;
                    
                case 'radio':
                    const radio = document.querySelector(`input[name="${key}"]:checked`);
                    if (radio && radio.value) filters[key] = radio.value;
                    break;
                    
                case 'text':
                    const textInput = document.getElementById(`${key}-input`);
                    if (textInput && textInput.value.trim()) filters[key] = textInput.value.trim();
                    break;
            }
        });

        return filters;
    }

    /**
     * Apply filters
     */
    applyFilters() {
        const filters = this.getFilters();
        if (this.callbacks.onApply) {
            this.callbacks.onApply(filters);
        }
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        // Clear all inputs
        this.container.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
            input.value = '';
        });

        // Uncheck all checkboxes
        this.container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Reset radios to default (first option)
        this.container.querySelectorAll('input[type="radio"][value=""]').forEach(radio => {
            radio.checked = true;
        });

        // Reset dropdowns
        this.container.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });

        // Reset model dropdown to disabled state when make is cleared
        const modelSelect = document.getElementById('model-select');
        if (modelSelect) {
            modelSelect.innerHTML = '<option value="">Select make first</option>';
            modelSelect.disabled = true;
        }

        if (this.callbacks.onClear) {
            this.callbacks.onClear();
        }

        this.triggerChange();
    }

    /**
     * Trigger change callback
     */
    triggerChange() {
        if (this.callbacks.onChange) {
            this.callbacks.onChange(this.getFilters());
        }
    }

    /**
     * Set callback functions
     */
    on(event, callback) {
        if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterRenderer;
}

if (typeof window !== 'undefined') {
    window.FilterRenderer = FilterRenderer;
}
