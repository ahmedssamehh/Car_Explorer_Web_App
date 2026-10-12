/**
 * Compare Page - Main Functionality
 * Handles car selection, comparison table, and localStorage management
 */

// ===========================
// STATE MANAGEMENT
// ===========================

let allCarsData = [];
let favoriteCars = [];
let compareCars = [];

const MAX_COMPARE = 4;

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Compare page initializing...');
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Load all cars data
    await loadAllCarsData();
    
    // Load favorites
    await loadFavorites();
    
    // Load comparison from localStorage
    loadComparison();
    
    // Display favorites for selection
    displayFavoriteSelection();
    
    // Display comparison table
    displayComparisonTable();
    
    // Initialize event listeners
    initializeEventListeners();
    
    console.log('✅ Compare page ready!');
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
async function loadFavorites() {
    try {
        // Try new format first
        let stored = localStorage.getItem('favoriteCars');
        if (!stored) {
            // Try old format
            stored = localStorage.getItem('favorites');
        }
        
        if (stored) {
            const favoriteIds = JSON.parse(stored);
            
            // Get full car objects from IDs
            favoriteCars = favoriteIds
                .map(id => allCarsData.find(car => car.id === id))
                .filter(car => car !== undefined);
            
            console.log(`📦 Loaded ${favoriteCars.length} favorites`);
        } else {
            favoriteCars = [];
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoriteCars = [];
    }
}

/**
 * Load comparison from localStorage
 */
function loadComparison() {
    try {
        const stored = localStorage.getItem('compareCars');
        
        if (stored) {
            const compareIds = JSON.parse(stored);
            
            // Get full car objects from IDs
            compareCars = compareIds
                .map(id => allCarsData.find(car => car.id === id))
                .filter(car => car !== undefined);
            
            console.log(`📊 Loaded ${compareCars.length} cars for comparison`);
        } else {
            compareCars = [];
        }
    } catch (error) {
        console.error('Error loading comparison:', error);
        compareCars = [];
    }
}

/**
 * Save comparison to localStorage
 */
function saveComparison() {
    try {
        const compareIds = compareCars.map(car => car.id);
        localStorage.setItem('compareCars', JSON.stringify(compareIds));
    } catch (error) {
        console.error('Error saving comparison:', error);
    }
}

// ===========================
// EVENT LISTENERS
// ===========================

function initializeEventListeners() {
    // Clear Compare button
    const clearBtn = document.getElementById('clear-compare-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearComparison);
    }
}

// ===========================
// DISPLAY FAVORITES SELECTION
// ===========================

function displayFavoriteSelection() {
    const loadingState = document.getElementById('loading-favorites-selection');
    const selectionGrid = document.getElementById('favorites-selection-grid');
    const noFavoritesState = document.getElementById('no-favorites-state');
    
    // Hide loading
    setTimeout(() => {
        if (loadingState) loadingState.style.display = 'none';
        
        // Check if no favorites
        if (favoriteCars.length === 0) {
            if (noFavoritesState) noFavoritesState.classList.remove('hidden');
            if (selectionGrid) selectionGrid.classList.add('hidden');
            return;
        }
        
        // Show selection grid
        if (noFavoritesState) noFavoritesState.classList.add('hidden');
        if (selectionGrid) {
            selectionGrid.classList.remove('hidden');
            selectionGrid.innerHTML = '';
            
            // Create selection cards
            favoriteCars.forEach((car, index) => {
                const card = createSelectionCard(car, index);
                selectionGrid.appendChild(card);
            });
        }
    }, 500);
}

function createSelectionCard(car, index) {
    const isSelected = compareCars.some(c => c.id === car.id);
    
    const card = document.createElement('div');
    card.className = `selection-card ${isSelected ? 'selected' : ''}`;
    card.style.animationDelay = `${index * 0.05}s`;
    card.dataset.carId = car.id;
    
    card.innerHTML = `
        <img src="${car.image}" alt="${car.brand} ${car.model}" class="selection-image"
             onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'">
        <div class="selection-check">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <div class="selection-info">
            <div class="selection-brand">${car.brand}</div>
            <div class="selection-model">${car.model}</div>
            <div class="selection-type-badge">${car.type}</div>
            <button class="selection-btn" onclick="toggleCompare(${car.id})">
                ${isSelected ? 'Remove from Compare' : 'Add to Compare'}
            </button>
        </div>
    `;
    
    return card;
}

// ===========================
// COMPARISON MANAGEMENT
// ===========================

/**
 * Toggle car in comparison
 */
window.toggleCompare = function(carId) {
    const car = allCarsData.find(c => c.id === carId);
    if (!car) return;
    
    const index = compareCars.findIndex(c => c.id === carId);
    
    if (index === -1) {
        // Add to comparison
        if (compareCars.length >= MAX_COMPARE) {
            showNotification(`Maximum ${MAX_COMPARE} cars can be compared`, 'warning');
            return;
        }
        
        compareCars.push(car);
        showNotification('Added to comparison', 'success');
    } else {
        // Remove from comparison
        compareCars.splice(index, 1);
        showNotification('Removed from comparison', 'info');
    }
    
    // Save to localStorage
    saveComparison();
    
    // Update UI
    updateSelectionCard(carId);
    displayComparisonTable();
    updateCompareCount();
}

/**
 * Update selection card UI
 */
function updateSelectionCard(carId) {
    const card = document.querySelector(`.selection-card[data-car-id="${carId}"]`);
    if (!card) return;
    
    const isSelected = compareCars.some(c => c.id === carId);
    const btn = card.querySelector('.selection-btn');
    
    if (isSelected) {
        card.classList.add('selected');
        if (btn) btn.textContent = 'Remove from Compare';
    } else {
        card.classList.remove('selected');
        if (btn) btn.textContent = 'Add to Compare';
    }
}

/**
 * Remove car from comparison (from table)
 */
window.removeFromCompare = function(carId) {
    const index = compareCars.findIndex(c => c.id === carId);
    
    if (index !== -1) {
        compareCars.splice(index, 1);
        saveComparison();
        
        // Update UI
        updateSelectionCard(carId);
        displayComparisonTable();
        updateCompareCount();
        
        showNotification('Removed from comparison', 'info');
    }
}

/**
 * Clear all comparison
 */
function clearComparison() {
    if (compareCars.length === 0) return;
    
    // Clear array
    compareCars = [];
    
    // Clear localStorage
    localStorage.removeItem('compareCars');
    
    // Update UI
    displayFavoriteSelection();
    displayComparisonTable();
    updateCompareCount();
    
    showNotification('Comparison cleared', 'success');
}

/**
 * Update compare count
 */
function updateCompareCount() {
    const countElement = document.getElementById('compare-count');
    const clearBtn = document.getElementById('clear-compare-btn');
    
    if (countElement) {
        countElement.textContent = compareCars.length;
    }
    
    if (clearBtn) {
        if (compareCars.length > 0) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }
}

// ===========================
// COMPARISON TABLE
// ===========================

function displayComparisonTable() {
    const emptyState = document.getElementById('empty-compare-state');
    const container = document.getElementById('comparison-container');
    const table = document.getElementById('comparison-table');
    
    updateCompareCount();
    
    // Check if less than 2 cars
    if (compareCars.length < 2) {
        if (emptyState) emptyState.style.display = 'block';
        if (container) container.classList.add('hidden');
        return;
    }
    
    // Hide empty state and show table
    if (emptyState) emptyState.style.display = 'none';
    if (container) container.classList.remove('hidden');
    
    // Build table
    buildComparisonTable();
}

function buildComparisonTable() {
    const headerRow = document.getElementById('table-header-row');
    const tbody = document.getElementById('table-body');
    
    if (!headerRow || !tbody) return;
    
    // Clear existing content (except first cell)
    while (headerRow.children.length > 1) {
        headerRow.removeChild(headerRow.lastChild);
    }
    tbody.innerHTML = '';
    
    // Add car header cells
    compareCars.forEach((car, index) => {
        const th = document.createElement('th');
        th.className = 'car-header-cell';
        th.innerHTML = `
            <div class="car-header-content">
                <img src="${car.image}" alt="${car.brand} ${car.model}" class="car-compare-image"
                     onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'">
                <div class="car-compare-brand">${car.brand}</div>
                <div class="car-compare-name">${car.model}</div>
                <button class="remove-car-btn" onclick="removeFromCompare(${car.id})">
                    Remove
                </button>
            </div>
        `;
        headerRow.appendChild(th);
    });
    
    // Build comparison rows
    const features = [
        { label: 'Year', key: 'year', format: (val) => val || 'N/A', class: 'year' },
        { label: 'Price', key: 'price', format: (val) => `$${formatPrice(val)}`, class: 'price' },
        { label: 'Type', key: 'type', format: (val) => `<span class="type-badge-table">${val}</span>`, class: 'type' },
        { label: 'Engine', key: 'engine', format: (val) => val || 'N/A', class: 'engine' },
        { label: 'Horsepower', key: 'horsepower', format: (val) => `${val} HP`, class: 'horsepower' },
        { label: 'Torque', key: 'torque', format: (val) => val ? `${val} lb-ft` : 'N/A', class: 'torque' },
        { label: 'Top Speed', key: 'topSpeed', format: (val) => val ? `${val} mph` : 'N/A', class: 'top-speed' },
        { label: '0-60 mph', key: 'acceleration', format: (val) => val ? `${val}s` : 'N/A', class: 'acceleration' },
        { label: 'Weight', key: 'weight', format: (val) => val ? `${formatPrice(val)} lbs` : 'N/A', class: 'weight' },
        { label: 'Transmission', key: 'transmission', format: (val) => val || 'N/A', class: 'transmission' },
        { label: 'Drivetrain', key: 'drivetrain', format: (val) => val || 'N/A', class: 'drivetrain' },
        { label: 'Fuel Type', key: 'fuelType', format: (val) => val || 'N/A', class: 'fuel-type' },
        { label: 'Seats', key: 'seats', format: (val) => val ? `${val} seats` : 'N/A', class: 'seats' },
        { label: 'Description', key: 'description', format: (val) => val, class: 'description' },
        { 
            label: 'Features', 
            key: 'features', 
            format: (val) => {
                if (!val || !Array.isArray(val) || val.length === 0) return 'N/A';
                return '<ul class="features-list">' + val.map(f => `<li>✓ ${f}</li>`).join('') + '</ul>';
            }, 
            class: 'features-list-cell' 
        }
    ];
    
    features.forEach(feature => {
        const tr = document.createElement('tr');
        tr.className = 'feature-row';
        
        // Feature label
        const labelCell = document.createElement('td');
        labelCell.className = 'feature-label-cell';
        labelCell.textContent = feature.label;
        tr.appendChild(labelCell);
        
        // Find best value for highlighting (numeric fields only)
        const numericFields = ['price', 'horsepower', 'torque', 'topSpeed', 'acceleration', 'weight', 'year'];
        let bestIndex = -1;
        
        if (numericFields.includes(feature.key)) {
            const values = compareCars.map(car => car[feature.key] || 0);
            if (feature.key === 'price' || feature.key === 'acceleration' || feature.key === 'weight') {
                // Lower is better (cheaper price, faster acceleration, lighter weight)
                bestIndex = values.indexOf(Math.min(...values.filter(v => v > 0)));
            } else {
                // Higher is better (more power, torque, speed, newer year)
                bestIndex = values.indexOf(Math.max(...values));
            }
        }
        
        // Feature values for each car
        compareCars.forEach((car, index) => {
            const td = document.createElement('td');
            td.className = `feature-value ${feature.class}`;
            
            // Add best-value class if this is the best
            if (index === bestIndex) {
                td.classList.add('best-value');
            }
            
            td.innerHTML = feature.format(car[feature.key]);
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
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
    const colors = {
        success: '#22C55E',
        warning: '#F59E0B',
        info: '#3B82F6',
        error: '#EF4444'
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

