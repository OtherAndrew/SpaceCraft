/** Global Parameters Object */
const params = { };

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => Math.floor(Math.random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Returns the angle of p2 from a horizontal line on p1.
 * 
 * @param {CTransform} p1 
 * @param {CTransform} p2 
 * @returns result in degrees
 */
const getDirection = (p1, p2) => {
    return Math.atan2((p2.y - p1.y),(p2.x-p1.x)) * 180 / Math.PI
}

/**
 * Checks if number is in between given range.
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @return {boolean}
 */
const isBetween = (num, min, max) => {
    return num >= min && num <= max
}

/**
 * Restricts the num in between the min and max values.
 * @param {Number} num 
 * @param {Number} min 
 * @param {Number} max 
 * @returns either the number, min or max.
 */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

/**
 * Returns a random integer between 0 (inclusive) and `max` (exclusive).
 * @param {Number} max
 * @returns {Number} A random integer between 0 (inclusive) and `max` (exclusive).
 */
const getRandomInt = (max) =>  Math.floor(Math.random() * max);

/**
 * Normalizes a vector between two points.
 * @param {x: Number, y: Number} vect1 starting point
 * @param {x: Number, y: Number} vect2 end point
 * @returns normalized x and y 
 */
const normalize = (p1, p2) => {
    let d = getDistance(p1, p2)
    return {
        x: (p2.x - p1.x)/d,
        y: (p2.y - p1.y)/d
    }
}
