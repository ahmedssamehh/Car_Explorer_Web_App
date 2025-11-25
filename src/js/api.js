/**
 * API Module
 * Handles data fetching and API interactions
 */

// ===========================
// CONFIGURATION
// ===========================

const API_CONFIG = {
    baseURL: '../data',
    endpoints: {
        cars: '/cars.json'
    },
    cache: {
        enabled: true,
        ttl: 3600000 // 1 hour in milliseconds
    }
};

// Simple in-memory cache
const cache = new Map();

// ===========================
// CORE FETCH FUNCTIONS
// ===========================

/**
 * Generic fetch function with error handling and caching
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise} Fetch response
 */
async function fetchData(url, options = {}) {
    try {
        // Check cache first
        if (API_CONFIG.cache.enabled && cache.has(url)) {
            const cached = cache.get(url);
            const now = Date.now();
            
            if (now - cached.timestamp < API_CONFIG.cache.ttl) {
                console.log(`📦 Using cached data for ${url}`);
                return cached.data;
            } else {
                // Cache expired
                cache.delete(url);
            }
        }
        
        console.log(`🌐 Fetching data from ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the result
        if (API_CONFIG.cache.enabled) {
            cache.set(url, {
                data,
                timestamp: Date.now()
            });
        }
        
        return data;
        
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error;
    }
}

// ===========================
// CARS API
// ===========================

/**
 * Fetch all cars
 * @returns {Promise<Array>} Array of car objects
 */
export async function getAllCars() {
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.cars}`;
    return await fetchData(url);
}

/**
 * Fetch a single car by ID
 * @param {number} carId - The car ID
 * @returns {Promise<object>} Car object
 */
export async function getCarById(carId) {
    const cars = await getAllCars();
    const car = cars.find(c => c.id === parseInt(carId));
    
    if (!car) {
        throw new Error(`Car with ID ${carId} not found`);
    }
    
    return car;
}

/**
 * Fetch multiple cars by IDs
 * @param {Array<number>} carIds - Array of car IDs
 * @returns {Promise<Array>} Array of car objects
 */
export async function getCarsByIds(carIds) {
    const cars = await getAllCars();
    return cars.filter(car => carIds.includes(car.id));
}

/**
 * Search cars by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching car objects
 */
export async function searchCars(query) {
    const cars = await getAllCars();
    const lowerQuery = query.toLowerCase();
    
    return cars.filter(car => 
        car.brand.toLowerCase().includes(lowerQuery) ||
        car.model.toLowerCase().includes(lowerQuery) ||
        car.type.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Filter cars by type
 * @param {string} type - Car type
 * @returns {Promise<Array>} Array of filtered car objects
 */
export async function getCarsByType(type) {
    const cars = await getAllCars();
    return cars.filter(car => car.type.toLowerCase() === type.toLowerCase());
}

/**
 * Filter cars by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Promise<Array>} Array of filtered car objects
 */
export async function getCarsByPriceRange(minPrice, maxPrice) {
    const cars = await getAllCars();
    return cars.filter(car => car.price >= minPrice && car.price <= maxPrice);
}

/**
 * Filter cars by horsepower range
 * @param {number} minHP - Minimum horsepower
 * @param {number} maxHP - Maximum horsepower
 * @returns {Promise<Array>} Array of filtered car objects
 */
export async function getCarsByHorsepowerRange(minHP, maxHP) {
    const cars = await getAllCars();
    return cars.filter(car => car.horsepower >= minHP && car.horsepower <= maxHP);
}

/**
 * Get available car types
 * @returns {Promise<Array>} Array of unique car types
 */
export async function getCarTypes() {
    const cars = await getAllCars();
    const types = [...new Set(cars.map(car => car.type))];
    return types.sort();
}

/**
 * Get available car brands
 * @returns {Promise<Array>} Array of unique car brands
 */
export async function getCarBrands() {
    const cars = await getAllCars();
    const brands = [...new Set(cars.map(car => car.brand))];
    return brands.sort();
}

// ===========================
// STATISTICS API
// ===========================

/**
 * Get statistics about the car collection
 * @returns {Promise<object>} Statistics object
 */
export async function getCarStatistics() {
    const cars = await getAllCars();
    
    const prices = cars.map(car => car.price);
    const horsepowers = cars.map(car => car.horsepower);
    
    return {
        totalCars: cars.length,
        types: await getCarTypes(),
        brands: await getCarBrands(),
        priceRange: {
            min: Math.min(...prices),
            max: Math.max(...prices),
            avg: prices.reduce((a, b) => a + b, 0) / prices.length
        },
        horsepowerRange: {
            min: Math.min(...horsepowers),
            max: Math.max(...horsepowers),
            avg: horsepowers.reduce((a, b) => a + b, 0) / horsepowers.length
        }
    };
}

// ===========================
// CACHE MANAGEMENT
// ===========================

/**
 * Clear API cache
 */
export function clearCache() {
    cache.clear();
    console.log('✅ API cache cleared');
}

/**
 * Get cache statistics
 * @returns {object} Cache statistics
 */
export function getCacheStats() {
    return {
        size: cache.size,
        entries: Array.from(cache.keys())
    };
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Sort cars by field
 * @param {Array} cars - Array of car objects
 * @param {string} field - Field to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array of car objects
 */
export function sortCars(cars, field, order = 'asc') {
    const sorted = [...cars].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        
        if (typeof aVal === 'string') {
            return order === 'asc' 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        } else {
            return order === 'asc' 
                ? aVal - bVal
                : bVal - aVal;
        }
    });
    
    return sorted;
}

/**
 * Format price for display
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
    return num.toLocaleString('en-US');
}

// Log API module initialization
console.log('🔌 API module initialized');

