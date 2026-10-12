// Car Details Page - Complete Implementation
// Loads car data from localStorage, handles favorites, compare, theme, and animations

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        loadingState: document.getElementById('loadingState'),
        errorState: document.getElementById('errorState'),
        mainContent: document.getElementById('mainContent'),
        carImage: document.getElementById('carImage'),
        carTitle: document.getElementById('carTitle'),
        carSubtitle: document.getElementById('carSubtitle'),
        typeBadge: document.getElementById('typeBadge'),
        yearBadge: document.getElementById('yearBadge'),
        specsGrid: document.getElementById('specsGrid'),
        featuresList: document.getElementById('featuresList'),
        featuresSection: document.getElementById('featuresSection'),
        favoriteBtn: document.getElementById('favoriteBtn'),
        favoriteBtnText: document.getElementById('favoriteBtnText'),
        compareBtn: document.getElementById('compareBtn'),
        compareBtnText: document.getElementById('compareBtnText')
    };

    // Current car data
    let currentCar = null;
    let currentCarId = null;

    // Storage keys
    const STORAGE_KEYS = {
        CARS: 'carsData',
        FAVORITES: 'favoriteCars',
        COMPARE: 'compareCars',
        THEME: 'theme'
    };

    // Maximum compare items
    const MAX_COMPARE = 4;

    /**
     * Get car ID from URL parameters
     */
    function getCarIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id ? parseInt(id) : null;
    }

    /**
     * Load cars data from localStorage
     */
    function loadCarsFromStorage() {
        try {
            const carsData = localStorage.getItem(STORAGE_KEYS.CARS);
            if (!carsData) {
                console.error('No cars data found in localStorage');
                return [];
            }
            return JSON.parse(carsData);
        } catch (error) {
            console.error('Error loading cars from localStorage:', error);
            return [];
        }
    }

    /**
     * Find car by ID
     */
    function findCarById(cars, id) {
        return cars.find(car => car.id === id);
    }

    /**
     * Load and apply theme
     * Theme.js module handles the theme toggle, this just ensures initial state
     */
    function loadTheme() {
        const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'eco';
        // Theme.js already sets data-theme attribute, just ensure it's set
        if (!document.body.hasAttribute('data-theme')) {
            document.body.setAttribute('data-theme', theme);
        }
        return theme;
    }

    /**
     * Get favorites from localStorage
     */
    function getFavorites() {
        try {
            const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    /**
     * Save favorites to localStorage
     */
    function saveFavorites(favorites) {
        try {
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
            return true;
        } catch (error) {
            console.error('Error saving favorites:', error);
            return false;
        }
    }

    /**
     * Get compare list from localStorage
     */
    function getCompareList() {
        try {
            const compareList = localStorage.getItem(STORAGE_KEYS.COMPARE);
            return compareList ? JSON.parse(compareList) : [];
        } catch (error) {
            console.error('Error loading compare list:', error);
            return [];
        }
    }

    /**
     * Save compare list to localStorage
     */
    function saveCompareList(compareList) {
        try {
            localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(compareList));
            return true;
        } catch (error) {
            console.error('Error saving compare list:', error);
            return false;
        }
    }

    /**
     * Check if car is in favorites
     */
    function isInFavorites(carId) {
        const favorites = getFavorites();
        return favorites.includes(carId);
    }

    /**
     * Check if car is in compare list
     */
    function isInCompare(carId) {
        const compareList = getCompareList();
        return compareList.includes(carId);
    }

    /**
     * Toggle favorite status
     */
    function toggleFavorite() {
        if (!currentCarId) return;

        let favorites = getFavorites();
        const index = favorites.indexOf(currentCarId);

        if (index > -1) {
            // Remove from favorites
            favorites.splice(index, 1);
            saveFavorites(favorites);
            updateFavoriteButton(false);
            showNotification('Removed from favorites', 'info');
        } else {
            // Add to favorites
            favorites.push(currentCarId);
            saveFavorites(favorites);
            updateFavoriteButton(true);
            showNotification('Added to favorites', 'success');
        }
    }

    /**
     * Toggle compare status
     */
    function toggleCompare() {
        if (!currentCarId) return;

        let compareList = getCompareList();
        const index = compareList.indexOf(currentCarId);

        if (index > -1) {
            // Remove from compare
            compareList.splice(index, 1);
            saveCompareList(compareList);
            updateCompareButton(false);
            showNotification('Removed from compare list', 'info');
        } else {
            // Check if max limit reached
            if (compareList.length >= MAX_COMPARE) {
                showNotification(`Maximum ${MAX_COMPARE} cars allowed in compare list`, 'warning');
                return;
            }
            // Add to compare
            compareList.push(currentCarId);
            saveCompareList(compareList);
            updateCompareButton(true);
            showNotification('Added to compare list', 'success');
        }
    }

    /**
     * Update favorite button state
     */
    function updateFavoriteButton(isFavorite) {
        if (isFavorite) {
            elements.favoriteBtnText.textContent = 'Remove from Favorites';
            elements.favoriteBtn.classList.add('active');
        } else {
            elements.favoriteBtnText.textContent = 'Add to Favorites';
            elements.favoriteBtn.classList.remove('active');
        }
    }

    /**
     * Update compare button state
     */
    function updateCompareButton(isInCompareList) {
        if (isInCompareList) {
            elements.compareBtnText.textContent = 'Remove from Compare';
            elements.compareBtn.classList.add('active');
        } else {
            elements.compareBtnText.textContent = 'Add to Compare';
            elements.compareBtn.classList.remove('active');
        }
    }

    /**
     * Show notification (simple implementation)
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg text-white font-semibold shadow-lg transform transition-all duration-300 translate-x-full`;

        // Set color based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(135deg, #ea580c, #f97316)';
        } else if (type === 'info') {
            notification.style.background = 'linear-gradient(135deg, #0284c7, #0ea5e9)';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Render car details
     */
    function renderCarDetails(car) {
        // Set hero image with proper fallback
        const imageUrl = car.image || car.imageUrl || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';
        elements.carImage.src = imageUrl;
        elements.carImage.alt = `${car.brand} ${car.model}`;

        // Handle image loading error
        elements.carImage.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';
            this.onerror = null; // Prevent infinite loop
        };

        // Set title and subtitle
        elements.carTitle.textContent = `${car.brand} ${car.model}`;
        elements.carSubtitle.textContent = car.description || car.model || car.brand;

        // Set type badge
        elements.typeBadge.textContent = (car.type || 'Unknown').toUpperCase();

        // Set year badge
        elements.yearBadge.textContent = car.year || 'N/A';

        // Render specifications
        renderSpecs(car);

        // Render features
        renderFeatures(car);

        // Update button states
        updateFavoriteButton(isInFavorites(car.id));
        updateCompareButton(isInCompare(car.id));
    }

    /**
     * Render specifications grid
     */
    function renderSpecs(car) {
        const specs = [
            { label: 'Price', value: car.price ? `$${car.price.toLocaleString()}` : null, icon: '💰' },
            { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} HP` : null, icon: '⚡' },
            { label: 'Torque', value: car.torque ? `${car.torque} lb-ft` : null, icon: '🔧' },
            { label: 'Top Speed', value: car.topSpeed ? `${car.topSpeed} mph` : null, icon: '🏁' },
            { label: '0-60 mph', value: car.acceleration ? `${car.acceleration}s` : (car['0-60mph'] ? `${car['0-60mph']}s` : null), icon: '🚀' },
            { label: '0-100 km/h', value: car['0-100kmh'] ? `${car['0-100kmh']}s` : null, icon: '⏱️' },
            { label: 'Weight', value: car.weight ? `${car.weight} lbs` : null, icon: '⚖️' },
            { label: 'Engine', value: car.engine, icon: '🔩' },
            { label: 'Transmission', value: car.transmission, icon: '⚙️' },
            { label: 'Drivetrain', value: car.drivetrain, icon: '🔄' },
            { label: 'Fuel Type', value: car.fuelType, icon: '⛽' },
            { label: 'Seats', value: car.seats, icon: '💺' },
            { label: 'Year', value: car.year, icon: '📅' }
        ];

        let html = '';
        let delay = 0;

        specs.forEach(spec => {
            if (spec.value) {
                html += `
                    <div class="spec-card p-6 rounded-lg slide-up stagger-${Math.min(delay + 1, 6)}">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-3xl">${spec.icon}</span>
                            <span class="text-sm opacity-60 uppercase tracking-wider">${spec.label}</span>
                        </div>
                        <div class="text-2xl font-bold mt-2">${spec.value}</div>
                    </div>
                `;
                delay++;
            }
        });

        elements.specsGrid.innerHTML = html || '<p class="text-center col-span-full opacity-60">No specifications available</p>';
    }

    /**
     * Render features list
     */
    function renderFeatures(car) {
        const features = car.features || [];

        if (features.length === 0) {
            elements.featuresSection.style.display = 'none';
            return;
        }

        elements.featuresSection.style.display = 'block';

        let html = '';
        features.forEach((feature, index) => {
            html += `
                <span class="feature-badge px-4 py-2 rounded-full font-semibold text-sm slide-up stagger-${Math.min(index + 1, 6)}">
                    ${feature}
                </span>
            `;
        });

        elements.featuresList.innerHTML = html;
    }

    /**
     * Setup parallax effect
     */
    function setupParallax() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxElement = document.querySelector('.hero-parallax');

                    if (parallaxElement) {
                        parallaxElement.style.transform = `translateY(${scrolled * 0.5}px)`;
                    }

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    /**
     * Show error state
     */
    function showError() {
        elements.loadingState.classList.add('hidden');
        elements.mainContent.classList.add('hidden');
        elements.errorState.classList.remove('hidden');
    }

    /**
     * Show main content
     */
    function showMainContent() {
        elements.loadingState.classList.add('hidden');
        elements.errorState.classList.add('hidden');
        elements.mainContent.classList.remove('hidden');
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Favorite button
        elements.favoriteBtn.addEventListener('click', toggleFavorite);

        // Compare button
        elements.compareBtn.addEventListener('click', toggleCompare);

        // Initialize mobile menu
        initializeMobileMenu();
    }

    /**
     * Initialize mobile menu
     */
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

    /**
     * Setup navbar scroll effect
     */
    function setupNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    /**
     * Initialize the page
     */
    function init() {
        // Load theme
        loadTheme();

        // Get car ID from URL
        currentCarId = getCarIdFromURL();

        if (!currentCarId) {
            console.error('No car ID provided in URL');
            showError();
            return;
        }

        // Load cars from localStorage
        const cars = loadCarsFromStorage();

        if (cars.length === 0) {
            console.error('No cars found in localStorage');
            showError();
            return;
        }

        // Find the car
        currentCar = findCarById(cars, currentCarId);

        if (!currentCar) {
            console.error(`Car with ID ${currentCarId} not found`);
            showError();
            return;
        }

        // Render car details
        renderCarDetails(currentCar);

        // Setup event listeners
        setupEventListeners();

        // Setup parallax
        setupParallax();

        // Setup navbar scroll effect
        setupNavbarScroll();

        // Show main content
        showMainContent();

        // Log success
        console.log('Car details loaded successfully:', currentCar);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();