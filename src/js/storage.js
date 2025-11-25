/**
 * Storage Management Module
 * Handles localStorage operations for favorites, compare list, and preferences
 */

// ===========================
// FAVORITES MANAGEMENT
// ===========================

/**
 * Get all favorite car IDs
 * @returns {Array} Array of car IDs
 */
export function getFavorites() {
    // Try new format first
    let stored = localStorage.getItem('favoriteCars');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Fallback to old format
    stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of car IDs or car objects
 */
export function saveFavorites(favorites) {
    // Extract IDs if array contains objects
    const favoriteIds = favorites.map(item => 
        typeof item === 'object' ? item.id : item
    );
    
    // Save to both formats for compatibility
    localStorage.setItem('favoriteCars', JSON.stringify(favoriteIds));
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
}

/**
 * Save a single favorite car (with full object)
 * @param {object} car - Full car object
 * @returns {boolean} Success status
 */
export function saveFavorite(car) {
    const favorites = getFavorites();
    
    if (favorites.includes(car.id)) {
        return false; // Already in favorites
    }
    
    favorites.push(car.id);
    saveFavorites(favorites);
    return true;
}

/**
 * Add a car to favorites
 * @param {number} carId - The car ID to add
 * @returns {boolean} Success status
 */
export function addToFavorites(carId) {
    const favorites = getFavorites();
    
    if (favorites.includes(carId)) {
        return false; // Already in favorites
    }
    
    favorites.push(carId);
    saveFavorites(favorites);
    return true;
}

/**
 * Remove a car from favorites
 * @param {number} carId - The car ID to remove
 * @returns {boolean} Success status
 */
export function removeFavorite(carId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(carId);
    
    if (index === -1) {
        return false; // Not in favorites
    }
    
    favorites.splice(index, 1);
    saveFavorites(favorites);
    return true;
}

/**
 * Remove a car from favorites (alias)
 * @param {number} carId - The car ID to remove
 * @returns {boolean} Success status
 */
export function removeFromFavorites(carId) {
    return removeFavorite(carId);
}

/**
 * Check if a car is in favorites
 * @param {number} carId - The car ID to check
 * @returns {boolean} True if in favorites
 */
export function isFavorite(carId) {
    const favorites = getFavorites();
    return favorites.includes(carId);
}

/**
 * Toggle favorite status of a car
 * @param {number} carId - The car ID to toggle
 * @returns {boolean} New favorite status
 */
export function toggleFavorite(carId) {
    if (isFavorite(carId)) {
        removeFavorite(carId);
        return false;
    } else {
        addToFavorites(carId);
        return true;
    }
}

/**
 * Clear all favorites
 */
export function clearFavorites() {
    localStorage.removeItem('favoriteCars');
    localStorage.removeItem('favorites');
}

// ===========================
// COMPARE LIST MANAGEMENT
// ===========================

/**
 * Get compare cars list
 * @returns {Array} Array of car IDs
 */
export function getCompareCars() {
    const stored = localStorage.getItem('compareCars');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Get compare list (alias for compatibility)
 * @returns {Array} Array of car IDs
 */
export function getCompareList() {
    return getCompareCars();
}

/**
 * Save compare list to localStorage
 * @param {Array} compareList - Array of car IDs or car objects
 */
export function saveCompareList(compareList) {
    // Extract IDs if array contains objects
    const compareIds = compareList.map(item => 
        typeof item === 'object' ? item.id : item
    );
    
    localStorage.setItem('compareCars', JSON.stringify(compareIds));
}

/**
 * Add a car to compare list
 * @param {number|object} car - The car ID or car object to add
 * @returns {object} Result object with success status and message
 */
export function addToCompare(car) {
    const carId = typeof car === 'object' ? car.id : car;
    const compareList = getCompareCars();
    
    if (compareList.includes(carId)) {
        return { success: false, message: 'Car already in compare list' };
    }
    
    if (compareList.length >= 4) {
        return { success: false, message: 'Compare list is full (max 4 cars)' };
    }
    
    compareList.push(carId);
    saveCompareList(compareList);
    return { success: true, message: 'Added to compare list' };
}

/**
 * Remove a car from compare list
 * @param {number} carId - The car ID to remove
 * @returns {boolean} Success status
 */
export function removeFromCompare(carId) {
    const compareList = getCompareCars();
    const index = compareList.indexOf(carId);
    
    if (index === -1) {
        return false;
    }
    
    compareList.splice(index, 1);
    saveCompareList(compareList);
    return true;
}

/**
 * Check if a car is in compare list
 * @param {number} carId - The car ID to check
 * @returns {boolean} True if in compare list
 */
export function isInCompare(carId) {
    const compareList = getCompareCars();
    return compareList.includes(carId);
}

/**
 * Clear compare list
 */
export function clearCompare() {
    localStorage.removeItem('compareCars');
}

/**
 * Clear compare list (alias for compatibility)
 */
export function clearCompareList() {
    clearCompare();
}

// ===========================
// USER PREFERENCES
// ===========================

/**
 * Get user theme preference
 * @returns {string} Theme name ('eco' or 'sport')
 */
export function getTheme() {
    return localStorage.getItem('theme') || 'eco';
}

/**
 * Save user theme preference
 * @param {string} theme - Theme name ('eco' or 'sport')
 */
export function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

/**
 * Get user filter preferences
 * @returns {object} Filter preferences object
 */
export function getFilterPreferences() {
    const stored = localStorage.getItem('filterPreferences');
    return stored ? JSON.parse(stored) : {
        type: 'all',
        horsepower: 'all',
        priceMin: 0,
        priceMax: 3000000,
        sort: 'default'
    };
}

/**
 * Save user filter preferences
 * @param {object} preferences - Filter preferences object
 */
export function saveFilterPreferences(preferences) {
    localStorage.setItem('filterPreferences', JSON.stringify(preferences));
}

// ===========================
// RECENT VIEWS
// ===========================

/**
 * Get recently viewed cars
 * @returns {Array} Array of car IDs (most recent first)
 */
export function getRecentViews() {
    const stored = localStorage.getItem('recentViews');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Add a car to recent views
 * @param {number} carId - The car ID to add
 */
export function addToRecentViews(carId) {
    let recentViews = getRecentViews();
    
    // Remove if already exists
    recentViews = recentViews.filter(id => id !== carId);
    
    // Add to front
    recentViews.unshift(carId);
    
    // Keep only last 10
    if (recentViews.length > 10) {
        recentViews = recentViews.slice(0, 10);
    }
    
    localStorage.setItem('recentViews', JSON.stringify(recentViews));
}

/**
 * Clear recent views
 */
export function clearRecentViews() {
    localStorage.removeItem('recentViews');
}

// ===========================
// DATA EXPORT/IMPORT
// ===========================

/**
 * Export all user data
 * @returns {object} Object containing all user data
 */
export function exportUserData() {
    return {
        favorites: getFavorites(),
        compareList: getCompareList(),
        theme: getTheme(),
        filterPreferences: getFilterPreferences(),
        recentViews: getRecentViews(),
        exportDate: new Date().toISOString()
    };
}

/**
 * Import user data
 * @param {object} data - User data object to import
 * @returns {boolean} Success status
 */
export function importUserData(data) {
    try {
        if (data.favorites) saveFavorites(data.favorites);
        if (data.compareList) saveCompareList(data.compareList);
        if (data.theme) saveTheme(data.theme);
        if (data.filterPreferences) saveFilterPreferences(data.filterPreferences);
        if (data.recentViews) localStorage.setItem('recentViews', JSON.stringify(data.recentViews));
        
        return true;
    } catch (error) {
        console.error('Error importing user data:', error);
        return false;
    }
}

/**
 * Clear all user data
 */
export function clearAllData() {
    clearFavorites();
    clearCompareList();
    clearRecentViews();
    localStorage.removeItem('filterPreferences');
    console.log('✅ All user data cleared');
}

// ===========================
// STORAGE UTILITIES
// ===========================

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Get storage usage information
 * @returns {object} Storage usage stats
 */
export function getStorageInfo() {
    const favorites = getFavorites();
    const compareList = getCompareList();
    const recentViews = getRecentViews();
    
    return {
        favoritesCount: favorites.length,
        compareListCount: compareList.length,
        recentViewsCount: recentViews.length,
        theme: getTheme(),
        isAvailable: isStorageAvailable()
    };
}

// Log storage module initialization
console.log('💾 Storage module initialized');

