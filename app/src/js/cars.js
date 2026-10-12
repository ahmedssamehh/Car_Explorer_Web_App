/**
 * Cars Page - Main Functionality
 * Handles car display, search, filtering, sorting, and favorites
 * Uses localStorage to persist cars data - allowing dynamic additions
 */

// ===========================
// STATE MANAGEMENT
// ===========================

let allCars = [];
let filteredCars = [];
let favorites = [];

const filters = {
    search: '',
    type: 'all',
    horsepower: 'all',
    priceMin: 0,
    priceMax: 3000000,
    sort: 'default'
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚗 Cars page initializing...');
    
    // Load favorites from localStorage
    loadFavorites();
    
    // Show loading skeletons
    showLoadingSkeletons();
    
    // Load cars data (from localStorage or JSON)
    await loadCars();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    console.log('✅ Cars page ready!');
});

// ===========================
// DATA LOADING WITH LOCALSTORAGE
// ===========================

async function loadCars() {
    try {
        // Try to load cars from localStorage first
        const storedCars = localStorage.getItem('carsData');
        
        if (storedCars) {
            // Use stored cars
            console.log('📦 Loading cars from localStorage');
            allCars = JSON.parse(storedCars);
        } else {
            // Load from JSON file (initial load)
            console.log('🌐 Loading cars from JSON file');
            const response = await fetch('../data/cars.json');
            
            if (!response.ok) {
                throw new Error('Failed to load cars data');
            }
            
            allCars = await response.json();
            
            // Save to localStorage for future use
            saveCarsToLocalStorage();
        }
        
        filteredCars = [...allCars];
        
        // Simulate loading delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Hide skeletons and display cars
        hideLoadingSkeletons();
        displayCars();
        
    } catch (error) {
        console.error('Error loading cars:', error);
        hideLoadingSkeletons();
        showError('Failed to load cars. Please refresh the page.');
    }
}

/**
 * Save cars array to localStorage
 */
function saveCarsToLocalStorage() {
    try {
        localStorage.setItem('carsData', JSON.stringify(allCars));
        console.log('✅ Cars saved to localStorage');
    } catch (error) {
        console.error('Error saving cars to localStorage:', error);
    }
}

/**
 * Add a new car to the collection
 * @param {object} carData - Car object with all properties
 */
window.addNewCar = function(carData) {
    // Generate new ID
    const maxId = Math.max(...allCars.map(car => car.id), 0);
    carData.id = maxId + 1;
    
    // Add to array
    allCars.push(carData);
    
    // Save to localStorage
    saveCarsToLocalStorage();
    
    // Reapply filters and display
    applyFilters();
    
    showNotification(`${carData.brand} ${carData.model} added successfully!`, 'success');
    
    return carData.id;
}

/**
 * Update an existing car
 * @param {number} carId - Car ID to update
 * @param {object} updates - Properties to update
 */
window.updateCar = function(carId, updates) {
    const carIndex = allCars.findIndex(car => car.id === carId);
    
    if (carIndex === -1) {
        showNotification('Car not found', 'error');
        return false;
    }
    
    // Update car
    allCars[carIndex] = { ...allCars[carIndex], ...updates };
    
    // Save to localStorage
    saveCarsToLocalStorage();
    
    // Reapply filters and display
    applyFilters();
    
    showNotification('Car updated successfully!', 'success');
    return true;
}

/**
 * Delete a car from the collection
 * @param {number} carId - Car ID to delete
 */
window.deleteCar = function(carId) {
    const carIndex = allCars.findIndex(car => car.id === carId);
    
    if (carIndex === -1) {
        showNotification('Car not found', 'error');
        return false;
    }
    
    const car = allCars[carIndex];
    
    // Remove from array
    allCars.splice(carIndex, 1);
    
    // Save to localStorage
    saveCarsToLocalStorage();
    
    // Reapply filters and display
    applyFilters();
    
    showNotification(`${car.brand} ${car.model} deleted`, 'info');
    return true;
}

/**
 * Reset cars to original JSON data
 */
window.resetCarsData = function() {
    localStorage.removeItem('carsData');
    showNotification('Cars data reset. Refresh the page.', 'info');
}

/**
 * Export cars data
 */
window.exportCarsData = function() {
    const dataStr = JSON.stringify(allCars, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cars_export.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Cars data exported!', 'success');
}

// ===========================
// EVENT LISTENERS
// ===========================

function initializeEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', debounce((e) => {
        filters.search = e.target.value.toLowerCase();
        applyFilters();
    }, 300));
    
    // Type filter
    document.getElementById('type-filter').addEventListener('change', (e) => {
        filters.type = e.target.value;
        applyFilters();
    });
    
    // Horsepower filter
    document.getElementById('hp-filter').addEventListener('change', (e) => {
        filters.horsepower = e.target.value;
        applyFilters();
    });
    
    // Sort select
    document.getElementById('sort-select').addEventListener('change', (e) => {
        filters.sort = e.target.value;
        applyFilters();
    });
    
    // Price range sliders
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    
    priceMin.addEventListener('input', (e) => {
        filters.priceMin = parseInt(e.target.value);
        updatePriceDisplay();
        applyFilters();
    });
    
    priceMax.addEventListener('input', (e) => {
        filters.priceMax = parseInt(e.target.value);
        updatePriceDisplay();
        applyFilters();
    });
    
    // Reset filters button
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

// ===========================
// FILTERING & SORTING
// ===========================

function applyFilters() {
    // Start with all cars
    filteredCars = [...allCars];
    
    // Apply search filter
    if (filters.search) {
        filteredCars = filteredCars.filter(car => 
            car.brand.toLowerCase().includes(filters.search) ||
            car.model.toLowerCase().includes(filters.search)
        );
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
        filteredCars = filteredCars.filter(car => car.type === filters.type);
    }
    
    // Apply horsepower filter
    if (filters.horsepower !== 'all') {
        const [min, max] = filters.horsepower.split('-').map(Number);
        filteredCars = filteredCars.filter(car => 
            car.horsepower >= min && car.horsepower <= max
        );
    }
    
    // Apply price range filter
    filteredCars = filteredCars.filter(car => 
        car.price >= filters.priceMin && car.price <= filters.priceMax
    );
    
    // Apply sorting
    applySorting();
    
    // Update UI
    updateActiveFilters();
    displayCars();
}

function applySorting() {
    switch (filters.sort) {
        case 'price-low':
            filteredCars.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCars.sort((a, b) => b.price - a.price);
            break;
        case 'hp-low':
            filteredCars.sort((a, b) => a.horsepower - b.horsepower);
            break;
        case 'hp-high':
            filteredCars.sort((a, b) => b.horsepower - a.horsepower);
            break;
        default:
            // Default order (by id)
            filteredCars.sort((a, b) => a.id - b.id);
    }
}

function resetFilters() {
    // Reset filter values
    filters.search = '';
    filters.type = 'all';
    filters.horsepower = 'all';
    filters.priceMin = 0;
    filters.priceMax = 3000000;
    filters.sort = 'default';
    
    // Reset UI elements
    document.getElementById('search-input').value = '';
    document.getElementById('type-filter').value = 'all';
    document.getElementById('hp-filter').value = 'all';
    document.getElementById('sort-select').value = 'default';
    document.getElementById('price-min').value = 0;
    document.getElementById('price-max').value = 3000000;
    
    updatePriceDisplay();
    applyFilters();
}

// ===========================
// DISPLAY FUNCTIONS
// ===========================

function displayCars() {
    const carsGrid = document.getElementById('cars-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    
    // Update results count
    resultsCount.textContent = filteredCars.length;
    
    // Clear existing content
    carsGrid.innerHTML = '';
    
    // Show/hide no results message
    if (filteredCars.length === 0) {
        noResults.classList.remove('hidden');
        return;
    } else {
        noResults.classList.add('hidden');
    }
    
    // Display car cards
    filteredCars.forEach((car, index) => {
        const carCard = createCarCard(car, index);
        carsGrid.appendChild(carCard);
    });
}

function createCarCard(car, index) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.style.animationDelay = `${(index % 6) * 0.1}s`;
    
    const isFavorite = favorites.includes(car.id);
    
    // Check if car is in compare list
    const compareList = JSON.parse(localStorage.getItem('compareCars') || '[]');
    const isInCompare = compareList.includes(car.id);
    
    card.innerHTML = `
        <div class="car-image-wrapper">
            <img src="${car.image}" alt="${car.brand} ${car.model}" class="car-image" 
                 onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'">
            <div class="car-type-badge">${car.type}</div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                    onclick="toggleFavorite(${car.id})" 
                    aria-label="Add to favorites">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>
        <div class="car-info">
            <div class="car-brand">${car.brand}</div>
            <h3 class="car-model">${car.model}</h3>
            <div class="car-specs">
                <div class="car-spec">
                    <span class="spec-label">Price</span>
                    <span class="spec-value">$${formatPrice(car.price)}</span>
                </div>
                <div class="car-spec">
                    <span class="spec-label">Power</span>
                    <span class="spec-value">${car.horsepower} HP</span>
                </div>
            </div>
            <div class="car-actions">
                <button class="view-details-btn" onclick="viewCarDetails(${car.id})">
                    View Details
                </button>
                <button class="add-to-compare-btn ${isInCompare ? 'active' : ''}" onclick="addToCompare(${car.id})" 
                        aria-label="Add to compare" title="${isInCompare ? 'Already in compare' : 'Add to compare'}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function showLoadingSkeletons() {
    const container = document.getElementById('loading-skeletons');
    container.innerHTML = '';
    
    // Create 6 skeleton cards
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-card';
        skeleton.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line long"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }
    
    container.style.display = 'grid';
}

function hideLoadingSkeletons() {
    const container = document.getElementById('loading-skeletons');
    container.style.display = 'none';
}

function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filters');
    activeFiltersContainer.innerHTML = '';
    
    const activeFilters = [];
    
    // Check for active filters
    if (filters.search) {
        activeFilters.push({ label: `Search: "${filters.search}"`, type: 'search' });
    }
    
    if (filters.type !== 'all') {
        activeFilters.push({ label: `Type: ${filters.type}`, type: 'type' });
    }
    
    if (filters.horsepower !== 'all') {
        const [min, max] = filters.horsepower.split('-');
        activeFilters.push({ label: `HP: ${min}-${max}`, type: 'horsepower' });
    }
    
    if (filters.priceMin > 0 || filters.priceMax < 3000000) {
        activeFilters.push({ 
            label: `Price: $${formatPrice(filters.priceMin)} - $${formatPrice(filters.priceMax)}`, 
            type: 'price' 
        });
    }
    
    if (filters.sort !== 'default') {
        const sortLabels = {
            'price-low': 'Price: Low to High',
            'price-high': 'Price: High to Low',
            'hp-low': 'HP: Low to High',
            'hp-high': 'HP: High to Low'
        };
        activeFilters.push({ label: `Sort: ${sortLabels[filters.sort]}`, type: 'sort' });
    }
    
    // Display active filters
    activeFilters.forEach(filter => {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.innerHTML = `
            ${filter.label}
            <button onclick="removeFilter('${filter.type}')" aria-label="Remove filter">×</button>
        `;
        activeFiltersContainer.appendChild(chip);
    });
}

function updatePriceDisplay() {
    document.getElementById('price-min-display').textContent = 
        `$${formatPrice(filters.priceMin)}`;
    document.getElementById('price-max-display').textContent = 
        `$${formatPrice(filters.priceMax)}`;
}

// ===========================
// FAVORITES MANAGEMENT
// ===========================

function loadFavorites() {
    // Try new format first
    let stored = localStorage.getItem('favoriteCars');
    if (stored) {
        favorites = JSON.parse(stored);
        return;
    }
    
    // Fallback to old format
    stored = localStorage.getItem('favorites');
    favorites = stored ? JSON.parse(stored) : [];
}

function saveFavorites() {
    // Save to both formats for compatibility
    localStorage.setItem('favoriteCars', JSON.stringify(favorites));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

window.toggleFavorite = function(carId) {
    const index = favorites.indexOf(carId);
    
    if (index === -1) {
        // Add to favorites
        favorites.push(carId);
        showNotification('Added to favorites!', 'success');
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    }
    
    saveFavorites();
    
    // Update the button UI
    const btn = event.target.closest('.favorite-btn');
    if (btn) {
        btn.classList.toggle('active');
    }
}

// ===========================
// ACTIONS
// ===========================

window.viewCarDetails = function(carId) {
    window.location.href = `details.html?id=${carId}`;
}

window.addToCompare = function(carId) {
    let compareList = JSON.parse(localStorage.getItem('compareCars') || '[]');
    
    if (compareList.includes(carId)) {
        showNotification('Car already in compare list', 'info');
        return;
    }
    
    if (compareList.length >= 4) {
        showNotification('Compare list is full (max 4 cars)', 'warning');
        return;
    }
    
    compareList.push(carId);
    localStorage.setItem('compareCars', JSON.stringify(compareList));
    showNotification('Added to compare list!', 'success');
    
    // Update button visual state
    const buttons = document.querySelectorAll('.add-to-compare-btn');
    buttons.forEach(btn => {
        const card = btn.closest('.car-card');
        if (card) {
            // Find the car ID from the button's onclick attribute
            const onclickAttr = btn.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes(carId.toString())) {
                btn.classList.add('active');
                btn.setAttribute('title', 'Already in compare');
            }
        }
    });
}

window.removeFilter = function(filterType) {
    switch (filterType) {
        case 'search':
            filters.search = '';
            document.getElementById('search-input').value = '';
            break;
        case 'type':
            filters.type = 'all';
            document.getElementById('type-filter').value = 'all';
            break;
        case 'horsepower':
            filters.horsepower = 'all';
            document.getElementById('hp-filter').value = 'all';
            break;
        case 'price':
            filters.priceMin = 0;
            filters.priceMax = 3000000;
            document.getElementById('price-min').value = 0;
            document.getElementById('price-max').value = 3000000;
            updatePriceDisplay();
            break;
        case 'sort':
            filters.sort = 'default';
            document.getElementById('sort-select').value = 'default';
            break;
    }
    
    applyFilters();
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function formatPrice(price) {
    return price.toLocaleString('en-US');
}

function debounce(func, wait) {
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

function showError(message) {
    const carsGrid = document.getElementById('cars-grid');
    carsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
                Error Loading Cars
            </h3>
            <p style="opacity: 0.7;">${message}</p>
        </div>
    `;
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

// ===========================
// EXPOSE API FOR CONSOLE USAGE
// ===========================

console.log(`
🚗 Cars Management API Available:
- addNewCar(carData) - Add a new car
- updateCar(carId, updates) - Update a car
- deleteCar(carId) - Delete a car
- resetCarsData() - Reset to original data
- exportCarsData() - Export current cars to JSON

Example:
addNewCar({
  brand: "Porsche",
  model: "911 GT3 RS",
  price: 225000,
  horsepower: 518,
  type: "sports",
  image: "https://images.unsplash.com/photo-...",
  description: "Track-focused naturally aspirated masterpiece"
})
`);

