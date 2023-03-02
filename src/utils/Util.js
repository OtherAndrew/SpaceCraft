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

const getDistance2 = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

const delayFunction = (f, time) => {
    setTimeout(f, time);
}

/**
 * Returns the angle of p2 from a horizontal line on p1.
 * 
 * @param {CTransform} p1 
 * @param {CTransform} p2 
 * @returns result in degrees
 */
const getAngle = (p1, p2) => {
    return Math.atan2((p2.y - p1.y), (p2.x - p1.x)) * 180 / Math.PI
}

const getAngle2 = (x1, y1, x2, y2) => {
    return Math.atan2((y2 - y1), (x2 - x1)) * 180 / Math.PI;
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

const randomSpread = (spread) => {
    return randomNumber(-spread/2, spread/2);
}

const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

const cleanTag = (tag) => {
    let index = tag.lastIndexOf('_');
    if (index !== -1) return tag.slice(index + 1);
    return tag;
}

/**
 * Converts mouse click coordinates to world coordinates according to player's position.
 * 
 * @param {*} pos 
 * @param {*} player 
 * @returns new mouse coords
 */
const getGridCell = (pos, player) => {
    if(pos === null) return null
    const pCollider = player.components["boxCollider"]
    let offsetX = pCollider.center.x >= WIDTH/2 ?
        pCollider.center.x >= WIDTH_PIXELS - WIDTH/2 ?
            WIDTH_PIXELS - (WIDTH_PIXELS - pCollider.center.x) - WIDTH * .75 :
            (pCollider.center.x - WIDTH/2) : 0
    let mapX = Math.floor((pos.x + offsetX)/BLOCKSIZE)
    let mapY = Math.floor((pos.y + (pCollider.center.y - HEIGHT/2))/BLOCKSIZE)
    //if(mapY < 0) return mapY
    return {
        x: mapX,
        y: mapY
    }
}

/**
 * Used when placing a block to world. 
 * @param {*} entityA  the player
 * @param {*} entityB the block that is to be placed
 * @returns boolean whether block is placed on player
 */
const checkBlockOverlap = (entityA, entityB) => {
    const a = entityA.components["boxCollider"];
    const b = {
        top: entityB.y,
        bottom: entityB.y + BLOCKSIZE,
        left: entityB.x,
        right: entityB.x + BLOCKSIZE
    }
    return a.right > b.left
        && a.left < b.right
        && a.top < b.bottom
        && a.bottom > b.top;
}

/**
 * Checks the distance between block placement cell and player
 * @param {*} coords 
 * @param {*} player 
 * @returns the distance in block count
 */
const checkPlayerDistance = (coords, player) => {
    let playerCoords = {
        x: Math.ceil(player.components.transform.x / BLOCKSIZE),
        y: Math.floor(player.components.transform.y / BLOCKSIZE)
    }
    return getDistance(playerCoords, coords)
}

/**
 * Checks to see if block placement cell has a block in one of its cardinal directions.
 * @param {*} coords 
 * @param {*} terrainMap 
 * @returns 
 */
const checkCellConnectedToBlock = (coords, terrainMap) => {
    if(terrainMap[coords.y][clamp(coords.x-1, 0, terrainMap[0].length-1)].tag.includes('tile')) return true
    if(terrainMap[coords.y][clamp(coords.x+1, 0, terrainMap[0].length-1)].tag.includes('tile')) return true
    if(terrainMap[clamp(coords.y-1, 0, terrainMap.length-1)][coords.x].tag.includes('tile')) return true
    if(terrainMap[clamp(coords.y+1, 0, terrainMap.length-1)][coords.x].tag.includes('tile')) return true
}

/**
 * Handles the call to 3 functions to determine if block placement is allowed in clicked cell.
 * 
 * @param {*} player 
 * @param {*} coords 
 * @param {*} terrainMap 
 * @returns 
 */
const isPlaceable = (player, coords, terrainMap) => {
    if(checkPlayerDistance(coords, player) < BLOCK_PLACEMENT_DISTANCE) {
        let c = {x: coords.x * BLOCKSIZE, y: coords.y * BLOCKSIZE}
        return !checkBlockOverlap(player, c) && checkCellConnectedToBlock(coords, terrainMap)
    }
}

const plusOrMinus = () => {
    return Math.random() < 0.5 ? -1 : 1;
}

/**
 * Swap between true and false every interval.
 *
 * @param {number} time     Elapsed time.
 * @param {number} interval Swap time interval.
 * @return {boolean} true if time is between even and odd intervals,
 *                   false if time is between odd and even intervals.
 */
const switchInterval = (time, interval) => {
    return Math.floor(time / interval) % 2 === 0;
}

/**
 * Get random element from array
 *
 * @return {*} Random element from array
 */
const getRandom = (list) => {
    return list[Math.floor((Math.random() * list.length))];
}