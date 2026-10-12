/**
 * Favorites Page - Main Functionality
 * Handles displaying, removing, and managing favorite cars
 */

// ===========================
// STATE MANAGEMENT
// ===========================

let favoriteCars = [];
let allCarsData = [];

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('❤️ Favorites page initializing...');
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Load all cars data first (for full car details)
    await loadAllCarsData();
    
    // Load favorites from localStorage
    loadFavorites();
    
    // Display favorites
    displayFavorites();
    
    // Initialize event listeners
    initializeEventListeners();
    
    console.log('✅ Favorites page ready!');
});

// ===========================
// DATA LOADING
// ===========================

/**
 * Load all cars data from localStorage or JSON
 */
async function loadAllCarsData() {
    try {
        // Try localStorage first
        const storedCars = localStorage.getItem('carsData');
        
        if (storedCars) {
            allCarsData = JSON.parse(storedCars);
        } else {
            // Fallback to JSON file
            const response = await fetch('../data/cars.json');
            if (response.ok) {
                allCarsData = await response.json();
            }
        }
    } catch (error) {
        console.error('Error loading cars data:', error);
    }
}

/**
 * Load favorites from localStorage
 */
function loadFavorites() {
    try {
        const stored = localStorage.getItem('favoriteCars');
        if (stored) {
            const favoriteIds = JSON.parse(stored);
            
            // Get full car objects from IDs
            favoriteCars = favoriteIds
                .map(id => allCarsData.find(car => car.id === id))
                .filter(car => car !== undefined);
            
            console.log(`📦 Loaded ${favoriteCars.length} favorites`);
        } else {
            // Check old format (array of IDs with key "favorites")
            const oldFormat = localStorage.getItem('favorites');
            if (oldFormat) {
                const favoriteIds = JSON.parse(oldFormat);
                favoriteCars = favoriteIds
                    .map(id => allCarsData.find(car => car.id === id))
                    .filter(car => car !== undefined);
                
                // Migrate to new format
                saveFavoritesToStorage();
            } else {
                favoriteCars = [];
            }
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoriteCars = [];
    }
}

/**
 * Save favorites to localStorage
 */
function saveFavoritesToStorage() {
    try {
        const favoriteIds = favoriteCars.map(car => car.id);
        localStorage.setItem('favoriteCars', JSON.stringify(favoriteIds));
        
        // Also update old format for compatibility
        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

// ===========================
// EVENT LISTENERS
// ===========================

function initializeEventListeners() {
    // Clear All button
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', showClearAllConfirmation);
    }
    
    // Modal buttons
    const confirmCancel = document.getElementById('confirm-cancel');
    const confirmClear = document.getElementById('confirm-clear');
    
    if (confirmCancel) {
        confirmCancel.addEventListener('click', hideClearAllConfirmation);
    }
    
    if (confirmClear) {
        confirmClear.addEventListener('click', clearAllFavorites);
    }
    
    // Close modal on overlay click
    const modal = document.getElementById('confirm-modal');
    const overlay = modal?.querySelector('.confirm-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', hideClearAllConfirmation);
    }
}

// ===========================
// DISPLAY FUNCTIONS
// ===========================

function displayFavorites() {
    const loadingState = document.getElementById('loading-favorites');
    const favoritesGrid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('empty-state');
    const favoritesCount = document.getElementById('favorites-count');
    const clearAllBtn = document.getElementById('clear-all-btn');
    
    // Hide loading
    if (loadingState) {
        setTimeout(() => {
            loadingState.style.display = 'none';
        }, 500);
    }
    
    // Update count
    if (favoritesCount) {
        favoritesCount.textContent = favoriteCars.length;
    }
    
    // Show/hide clear all button
    if (clearAllBtn) {
        if (favoriteCars.length > 0) {
            clearAllBtn.classList.remove('hidden');
        } else {
            clearAllBtn.classList.add('hidden');
        }
    }
    
    // Check if empty
    if (favoriteCars.length === 0) {
        if (favoritesGrid) favoritesGrid.classList.add('hidden');
        if (emptyState) {
            emptyState.classList.remove('hidden');
            emptyState.style.animation = 'fadeInUp 0.8s ease';
        }
        return;
    }
    
    // Hide empty state and show grid
    if (emptyState) emptyState.classList.add('hidden');
    if (favoritesGrid) {
        favoritesGrid.classList.remove('hidden');
        favoritesGrid.innerHTML = '';
        
        // Create cards
        favoriteCars.forEach((car, index) => {
            const card = createFavoriteCard(car, index);
            favoritesGrid.appendChild(card);
        });
    }
}

function createFavoriteCard(car, index) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.style.animationDelay = `${(index % 6) * 0.1}s`;
    card.dataset.carId = car.id;
    
    card.innerHTML = `
        <div class="favorite-image-wrapper">
            <img src="${car.image}" alt="${car.brand} ${car.model}" class="favorite-image" 
                 onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'">
            <div class="favorite-type-badge">${car.type}</div>
            <div class="favorite-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
        </div>
        <div class="favorite-info">
            <div class="favorite-brand">${car.brand}</div>
            <h3 class="favorite-model">${car.model}</h3>
            <div class="favorite-specs">
                <div class="favorite-spec">
                    <span class="spec-label">Price</span>
                    <span class="spec-value">$${formatPrice(car.price)}</span>
                </div>
                <div class="favorite-spec">
                    <span class="spec-label">Power</span>
                    <span class="spec-value">${car.horsepower} HP</span>
                </div>
            </div>
            <div class="favorite-actions">
                <button class="remove-btn" onclick="removeFavorite(${car.id})">
                    Remove
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ===========================
// FAVORITES MANAGEMENT
// ===========================

/**
 * Remove a single favorite
 */
window.removeFavorite = function(carId) {
    const card = document.querySelector(`[data-car-id="${carId}"]`);
    
    if (card) {
        // Add removal animation
        card.classList.add('removing');
        
        // Wait for animation to finish
        setTimeout(() => {
            // Remove from array
            favoriteCars = favoriteCars.filter(car => car.id !== carId);
            
            // Save to localStorage
            saveFavoritesToStorage();
            
            // Remove card from DOM
            card.remove();
            
            // Update display
            displayFavorites();
            
            // Show notification
            showNotification('Removed from favorites', 'info');
        }, 500);
    }
}

/**
 * Show clear all confirmation modal
 */
function showClearAllConfirmation() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

/**
 * Hide clear all confirmation modal
 */
function hideClearAllConfirmation() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Clear all favorites
 */
function clearAllFavorites() {
    // Clear array
    favoriteCars = [];
    
    // Clear localStorage
    localStorage.removeItem('favoriteCars');
    localStorage.removeItem('favorites');
    
    // Hide modal
    hideClearAllConfirmation();
    
    // Update display
    displayFavorites();
    
    // Show notification
    showNotification('All favorites cleared', 'success');
}

// ===========================
// MOBILE MENU
// ===========================

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function formatPrice(price) {
    return price.toLocaleString('en-US');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#22C55E' : type === 'warning' ? '#F59E0B' : '#3B82F6'};
        color: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);

