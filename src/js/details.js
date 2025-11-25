/**
 * Car Details Page - Main Functionality
 * Handles dynamic loading, favorites, compare, and animations
 */

// ===========================
// STATE MANAGEMENT
// ===========================

let currentCar = null;
let allCarsData = [];

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', async() => {
    console.log('🚗 Details page initializing...');

    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize navbar scroll effect
    initializeNavbarScroll();

    // Get car ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const carId = parseInt(urlParams.get('id'));

    if (!carId || isNaN(carId)) {
        console.error('❌ Invalid or missing car ID');
        showError();
        return;
    }

    // Load car data
    await loadCarDetails(carId);

    // Initialize parallax effect
    initializeParallax();

    console.log('✅ Details page ready!');
});

// ===========================
// DATA LOADING
// ===========================

/**
 * Load car details - uses embedded data (no fetch needed!)
 */
async function loadCarDetails(carId) {
    try {
        console.log('🔍 Looking for car ID:', carId);

        // PRIORITY 1: Use embedded data (works instantly, no CORS!)
        if (window.EMBEDDED_CARS_DATA && window.EMBEDDED_CARS_DATA.length > 0) {
            console.log('⚡ Using embedded car data');
            allCarsData = window.EMBEDDED_CARS_DATA;
            console.log('✅ Loaded', allCarsData.length, 'cars from embedded data');
        }
        // PRIORITY 2: Try localStorage
        else if (localStorage.getItem('carsData')) {
            console.log('📦 Loading cars from localStorage');
            try {
                allCarsData = JSON.parse(localStorage.getItem('carsData'));
                console.log('✅ Loaded', allCarsData.length, 'cars from localStorage');
            } catch (parseError) {
                console.error('❌ Failed to parse localStorage:', parseError);
                localStorage.removeItem('carsData');
                allCarsData = [];
            }
        }
        // PRIORITY 3: Fallback to fetch (may fail with CORS)
        else {
            console.log('🌐 Attempting to load from JSON file...');
            try {
                const response = await fetch('../data/cars.json');

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                allCarsData = await response.json();
                console.log('✅ Loaded', allCarsData.length, 'cars from JSON');

                // Save to localStorage
                localStorage.setItem('carsData', JSON.stringify(allCarsData));
            } catch (fetchError) {
                console.error('❌ All loading methods failed');
                showFetchError();
                return;
            }
        }

        // Find the specific car
        if (!allCarsData || allCarsData.length === 0) {
            console.error('❌ No car data available');
            showFetchError();
            return;
        }

        console.log('🔍 Searching for car with ID:', carId);
        currentCar = allCarsData.find(car => car.id === carId);

        if (!currentCar) {
            console.error('❌ Car not found with ID:', carId);
            console.log('Available IDs:', allCarsData.map(c => c.id).join(', '));
            showError();
            return;
        }

        console.log('✅ Found car:', currentCar.brand, currentCar.model);

        // Display car details
        displayCarDetails();

    } catch (error) {
        console.error('❌ Fatal error loading car details:', error);
        showError();
    }
}

/**
 * Display all car details
 */
function displayCarDetails() {
    // Hide loading, show content
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('details-content').classList.remove('hidden');

    // Update page title
    document.title = `${currentCar.brand} ${currentCar.model} - Car Explorer`;

    // Hero section
    const heroImage = document.getElementById('car-hero-image');
    heroImage.src = currentCar.image;
    heroImage.alt = `${currentCar.brand} ${currentCar.model}`;
    heroImage.onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';
    };

    document.getElementById('hero-badge').textContent = currentCar.type;
    document.getElementById('hero-title').textContent = `${currentCar.brand} ${currentCar.model}`;
    document.getElementById('hero-year').textContent = `${currentCar.year} Model Year`;

    // Description
    document.getElementById('car-description').textContent = currentCar.description || 'No description available.';

    // Specifications
    displaySpecifications();

    // Features
    displayFeatures();

    // Update button states
    updateFavoriteButton();
    updateCompareButton();

    // Initialize button listeners
    initializeButtons();
}

/**
 * Display specifications grid
 */
function displaySpecifications() {
    const specsGrid = document.getElementById('specs-grid');
    specsGrid.innerHTML = '';

    const specs = [
        { label: 'Price', value: currentCar.price, format: (val) => `$${formatPrice(val)}` },
        { label: 'Horsepower', value: currentCar.horsepower, format: (val) => `${val} HP` },
        { label: 'Torque', value: currentCar.torque, format: (val) => `${val} lb-ft` },
        { label: 'Top Speed', value: currentCar.topSpeed, format: (val) => `${val} mph` },
        { label: '0-60 mph', value: currentCar.acceleration, format: (val) => `${val}s` },
        { label: 'Weight', value: currentCar.weight, format: (val) => `${formatPrice(val)} lbs` },
        { label: 'Engine', value: currentCar.engine, format: (val) => val },
        { label: 'Transmission', value: currentCar.transmission, format: (val) => val },
        { label: 'Drivetrain', value: currentCar.drivetrain, format: (val) => val },
        { label: 'Fuel Type', value: currentCar.fuelType, format: (val) => val },
        { label: 'Seats', value: currentCar.seats, format: (val) => `${val}` },
        { label: 'Year', value: currentCar.year, format: (val) => val }
    ];

    specs.forEach(spec => {
        if (spec.value) {
            const card = document.createElement('div');
            card.className = 'spec-card';
            card.innerHTML = `
                <div class="spec-label">${spec.label}</div>
                <div class="spec-value">${spec.format(spec.value)}</div>
            `;
            specsGrid.appendChild(card);
        }
    });
}

/**
 * Display features list
 */
function displayFeatures() {
    const featuresGrid = document.getElementById('features-grid');
    featuresGrid.innerHTML = '';

    if (!currentCar.features || currentCar.features.length === 0) {
        featuresGrid.innerHTML = '<p class="text-center opacity-50 col-span-full">No features listed</p>';
        return;
    }

    currentCar.features.forEach((feature) => {
        const item = document.createElement('div');
        item.className = 'feature-item';
        item.innerHTML = `
            <div class="feature-icon">✓</div>
            <div class="feature-text">${feature}</div>
        `;
        featuresGrid.appendChild(item);
    });
}

// ===========================
// FAVORITES MANAGEMENT
// ===========================

/**
 * Check if car is in favorites
 */
function isFavorite(carId) {
    const stored = localStorage.getItem('favoriteCars');
    if (!stored) return false;

    try {
        const favorites = JSON.parse(stored);
        return favorites.includes(carId);
    } catch {
        return false;
    }
}

/**
 * Update favorite button state
 */
function updateFavoriteButton() {
    const btn = document.getElementById('favorite-btn');
    const text = document.getElementById('favorite-text');

    if (isFavorite(currentCar.id)) {
        btn.classList.add('active');
        text.textContent = 'Remove from Favorites';
    } else {
        btn.classList.remove('active');
        text.textContent = 'Add to Favorites';
    }
}

/**
 * Toggle favorite status
 */
function toggleFavorite() {
    let favorites = [];
    const stored = localStorage.getItem('favoriteCars');

    if (stored) {
        try {
            favorites = JSON.parse(stored);
        } catch {
            favorites = [];
        }
    }

    const index = favorites.indexOf(currentCar.id);

    if (index === -1) {
        // Add to favorites
        favorites.push(currentCar.id);
        localStorage.setItem('favoriteCars', JSON.stringify(favorites));
        showNotification('Added to favorites!', 'success');
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
        localStorage.setItem('favoriteCars', JSON.stringify(favorites));
        showNotification('Removed from favorites', 'info');
    }

    updateFavoriteButton();
}

// ===========================
// COMPARE MANAGEMENT
// ===========================

/**
 * Check if car is in compare list
 */
function isInCompare(carId) {
    const stored = localStorage.getItem('compareCars');
    if (!stored) return false;

    try {
        const compareList = JSON.parse(stored);
        return compareList.includes(carId);
    } catch {
        return false;
    }
}

/**
 * Update compare button state
 */
function updateCompareButton() {
    const btn = document.getElementById('compare-btn');
    const text = document.getElementById('compare-text');

    if (isInCompare(currentCar.id)) {
        btn.classList.add('active');
        text.textContent = 'In Compare List';
    } else {
        btn.classList.remove('active');
        text.textContent = 'Add to Compare';
    }
}

/**
 * Toggle compare status
 */
function toggleCompare() {
    let compareList = [];
    const stored = localStorage.getItem('compareCars');

    if (stored) {
        try {
            compareList = JSON.parse(stored);
        } catch {
            compareList = [];
        }
    }

    const index = compareList.indexOf(currentCar.id);

    if (index === -1) {
        // Add to compare
        if (compareList.length >= 4) {
            showNotification('Compare list is full (max 4 cars)', 'warning');
            return;
        }

        compareList.push(currentCar.id);
        localStorage.setItem('compareCars', JSON.stringify(compareList));
        showNotification('Added to compare list!', 'success');
    } else {
        // Remove from compare
        compareList.splice(index, 1);
        localStorage.setItem('compareCars', JSON.stringify(compareList));
        showNotification('Removed from compare list', 'info');
    }

    updateCompareButton();
}

// ===========================
// BUTTON INITIALIZATION
// ===========================

function initializeButtons() {
    document.getElementById('favorite-btn').addEventListener('click', toggleFavorite);
    document.getElementById('compare-btn').addEventListener('click', toggleCompare);
}

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================

function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===========================
// PARALLAX EFFECT
// ===========================

function initializeParallax() {
    const heroImage = document.getElementById('car-hero-image');

    if (!heroImage) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroSection = document.querySelector('.details-hero');

                if (heroSection) {
                    const heroHeight = heroSection.offsetHeight;

                    // Only apply parallax while hero is visible
                    if (scrolled < heroHeight) {
                        const parallaxSpeed = 0.5;
                        heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(1.1)`;
                    }
                }

                ticking = false;
            });

            ticking = true;
        }
    });
}

// ===========================
// ERROR HANDLING
// ===========================

function showError() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').classList.remove('hidden');
}

function showFetchError() {
    document.getElementById('loading-state').style.display = 'none';
    const errorDiv = document.getElementById('error-state');
    errorDiv.innerHTML = `
        <svg class="w-24 h-24 mx-auto mb-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-3xl font-bold mb-4">Please Visit Cars Page First</h2>
        <p class="text-lg opacity-70 mb-8">The details page needs car data from the cars page.</p>
        <a href="cars.html" class="btn-action btn-back">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Go to Cars Page</span>
        </a>
    `;
    errorDiv.classList.remove('hidden');
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