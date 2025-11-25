/**
 * UI Utilities Module
 * Provides reusable UI components and utilities
 */

// ===========================
// NOTIFICATION SYSTEM
// ===========================

/**
 * Show a notification toast
 * @param {string} message - Message to display
 * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in milliseconds
 */
export function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Get theme for color adjustments
    const theme = document.body.getAttribute('data-theme');
    
    // Color mapping
    const colors = {
        success: theme === 'sport' ? '#22C55E' : '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        info: theme === 'sport' ? '#FF0000' : '#22C55E'
    };
    
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${colors[type]};
        color: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease ${duration - 300}ms;
        min-width: 250px;
        max-width: 400px;
    `;
    
    // Add icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <span style="font-size: 1.25rem;">${icons[type]}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.remove();
    }, duration);
}

// ===========================
// MODAL SYSTEM
// ===========================

/**
 * Create and show a modal
 * @param {string} title - Modal title
 * @param {string} content - Modal content (HTML)
 * @param {Array} buttons - Array of button objects {text, onClick, class}
 * @returns {HTMLElement} Modal element
 */
export function showModal(title, content, buttons = []) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: scaleIn 0.3s ease;
    `;
    
    // Check theme
    const theme = document.body.getAttribute('data-theme');
    if (theme === 'sport') {
        modal.style.background = '#1a1a1a';
        modal.style.color = 'white';
    }
    
    // Modal header
    const header = document.createElement('div');
    header.style.cssText = `
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        font-family: 'Poppins', sans-serif;
    `;
    header.textContent = title;
    
    // Modal content
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
        margin-bottom: 1.5rem;
        line-height: 1.6;
    `;
    contentDiv.innerHTML = content;
    
    // Modal buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.cssText = `
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    `;
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.className = btn.class || 'btn-primary btn-sport';
        button.style.cssText = `
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        button.onclick = () => {
            if (btn.onClick) btn.onClick();
            closeModal(overlay);
        };
        
        buttonsDiv.appendChild(button);
    });
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(contentDiv);
    modal.appendChild(buttonsDiv);
    overlay.appendChild(modal);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
    
    document.body.appendChild(overlay);
    
    return overlay;
}

/**
 * Close a modal
 * @param {HTMLElement} modal - Modal overlay element
 */
export function closeModal(modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// ===========================
// LOADING INDICATORS
// ===========================

/**
 * Show a loading spinner
 * @param {string} message - Loading message
 * @returns {HTMLElement} Loader element
 */
export function showLoader(message = 'Loading...') {
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 10001;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        animation: fadeIn 0.3s ease;
    `;
    
    loader.innerHTML = `
        <div class="spinner" style="
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top-color: #22C55E;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        "></div>
        <div style="color: white; font-weight: 600; font-size: 1.1rem;">
            ${message}
        </div>
    `;
    
    document.body.appendChild(loader);
    return loader;
}

/**
 * Hide a loading spinner
 * @param {HTMLElement} loader - Loader element
 */
export function hideLoader(loader) {
    if (loader) {
        loader.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
}

// ===========================
// SKELETON LOADERS
// ===========================

/**
 * Create a skeleton loader element
 * @param {string} type - Skeleton type ('card', 'text', 'circle')
 * @returns {HTMLElement} Skeleton element
 */
export function createSkeleton(type = 'card') {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    
    const theme = document.body.getAttribute('data-theme');
    const baseColor = theme === 'sport' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.05)';
    
    skeleton.style.cssText = `
        background: ${baseColor};
        border-radius: 0.5rem;
        animation: pulse 1.5s ease-in-out infinite;
    `;
    
    if (type === 'card') {
        skeleton.style.height = '300px';
    } else if (type === 'text') {
        skeleton.style.height = '1rem';
        skeleton.style.width = '100%';
    } else if (type === 'circle') {
        skeleton.style.width = '50px';
        skeleton.style.height = '50px';
        skeleton.style.borderRadius = '50%';
    }
    
    return skeleton;
}

// ===========================
// CONFIRMATION DIALOGS
// ===========================

/**
 * Show a confirmation dialog
 * @param {string} message - Confirmation message
 * @param {function} onConfirm - Callback on confirm
 * @param {function} onCancel - Callback on cancel
 */
export function showConfirm(message, onConfirm, onCancel = null) {
    showModal(
        'Confirm',
        `<p>${message}</p>`,
        [
            {
                text: 'Cancel',
                class: 'btn-secondary',
                onClick: onCancel
            },
            {
                text: 'Confirm',
                class: 'btn-primary btn-sport',
                onClick: onConfirm
            }
        ]
    );
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
    return num.toLocaleString('en-US');
}

/**
 * Scroll to element smoothly
 * @param {string} selector - CSS selector
 * @param {number} offset - Offset from top
 */
export function scrollToElement(selector, offset = 80) {
    const element = document.querySelector(selector);
    if (element) {
        const top = element.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy to clipboard', 'error');
        return false;
    }
}

// ===========================
// ANIMATIONS
// ===========================

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes scaleIn {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// Log UI module initialization
console.log('🎨 UI utilities module initialized');

