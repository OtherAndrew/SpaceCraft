/** Global Parameters Object */
const params = {};

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
        x: (p2.x - p1.x) / d,
        y: (p2.y - p1.y) / d
    }
}

const randomSpread = (spread) => {
    return randomNumber(-spread / 2, spread / 2);
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
    if (pos === null) return null
    const pCollider = player.components["boxCollider"]
    let offsetX = pCollider.center.x >= WIDTH / 2 ?
        pCollider.center.x >= WIDTH_PIXELS - WIDTH / 2 ?
            WIDTH_PIXELS - (WIDTH_PIXELS - pCollider.center.x) - WIDTH * .75 :
            (pCollider.center.x - WIDTH / 2) : 0
    let mapX = Math.floor((pos.x + offsetX) / BLOCKSIZE)
    let mapY = Math.floor((pos.y + (pCollider.center.y - HEIGHT / 2)) / BLOCKSIZE)
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
    if (terrainMap[coords.y][clamp(coords.x - 1, 0, terrainMap[0].length - 1)].tag.includes('tile')) return true
    if (terrainMap[coords.y][clamp(coords.x + 1, 0, terrainMap[0].length - 1)].tag.includes('tile')) return true
    if (terrainMap[clamp(coords.y - 1, 0, terrainMap.length - 1)][coords.x].tag.includes('tile')) return true
    if (terrainMap[clamp(coords.y + 1, 0, terrainMap.length - 1)][coords.x].tag.includes('tile')) return true
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
    if (checkPlayerDistance(coords, player) < BLOCK_PLACEMENT_DISTANCE) {
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

const randomVector = () => {
    const angle = 2 * Math.PI * Math.random();
    return {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
}

const toHHMMSS = (secs) => {
    const sec_num = parseInt(secs, 10)
    const hours   = Math.floor(sec_num / 3600)
    const minutes = Math.floor(sec_num / 60) % 60
    const seconds = sec_num % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}

// credit: https://stackoverflow.com/questions/13627111/drawing-text-with-an-outer-stroke-with-html5s-canvas
const drawStrokedText = (ctx, font, color, text, x, y) => {
    ctx.save();
    ctx.font = font + "px Helvetica";
    ctx.strokeStyle = 'white';
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;
    ctx.strokeText(text, x, y);
    ctx.lineWidth = 1;
    ctx.fillText(text, x, y);
    ctx.restore();
}

// credit: https://gist.github.com/tieleman/6028023
const blur = (imageData, radius, quality) => {
    let pixels = imageData.data;
    let width = imageData.width;
    let height = imageData.height;

    let rsum, gsum, bsum, asum, x, y, i, p, p1, p2, yp, yi, yw;
    let wm = width - 1;
    let hm = height - 1;
    let rad1x = radius + 1;
    let divx = radius + rad1x;
    let rad1y = radius + 1;
    let divy = radius + rad1y;
    let div2 = 1 / (divx * divy);

    let r = [];
    let g = [];
    let b = [];
    let a = [];

    let vmin = [];
    let vmax = [];

    while (quality-- > 0) {
        yw = yi = 0;

        for (y = 0; y < height; y++) {
            rsum = pixels[yw] * rad1x;
            gsum = pixels[yw + 1] * rad1x;
            bsum = pixels[yw + 2] * rad1x;
            asum = pixels[yw + 3] * rad1x;


            for (i = 1; i <= radius; i++) {
                p = yw + (((i > wm ? wm : i)) << 2);
                rsum += pixels[p++];
                gsum += pixels[p++];
                bsum += pixels[p++];
                asum += pixels[p]
            }

            for (x = 0; x < width; x++) {
                r[yi] = rsum;
                g[yi] = gsum;
                b[yi] = bsum;
                a[yi] = asum;

                if (y === 0) {
                    vmin[x] = Math.min(x + rad1x, wm) << 2;
                    vmax[x] = Math.max(x - radius, 0) << 2;
                }

                p1 = yw + vmin[x];
                p2 = yw + vmax[x];

                rsum += pixels[p1++] - pixels[p2++];
                gsum += pixels[p1++] - pixels[p2++];
                bsum += pixels[p1++] - pixels[p2++];
                asum += pixels[p1] - pixels[p2];

                yi++;
            }
            yw += (width << 2);
        }

        for (x = 0; x < width; x++) {
            yp = x;
            rsum = r[yp] * rad1y;
            gsum = g[yp] * rad1y;
            bsum = b[yp] * rad1y;
            asum = a[yp] * rad1y;

            for (i = 1; i <= radius; i++) {
                yp += (i > hm ? 0 : width);
                rsum += r[yp];
                gsum += g[yp];
                bsum += b[yp];
                asum += a[yp];
            }

            yi = x << 2;
            for (y = 0; y < height; y++) {
                pixels[yi] = (rsum * div2 + 0.5) | 0;
                pixels[yi + 1] = (gsum * div2 + 0.5) | 0;
                pixels[yi + 2] = (bsum * div2 + 0.5) | 0;
                pixels[yi + 3] = (asum * div2 + 0.5) | 0;

                if (x === 0) {
                    vmin[y] = Math.min(y + rad1y, hm) * width;
                    vmax[y] = Math.max(y - radius, 0) * width;
                }

                p1 = x + vmin[y];
                p2 = x + vmax[y];

                rsum += r[p1] - r[p2];
                gsum += g[p1] - g[p2];
                bsum += b[p1] - b[p2];
                asum += a[p1] - a[p2];

                yi += width << 2;
            }
        }
    }
    postMessage(imageData);
}
