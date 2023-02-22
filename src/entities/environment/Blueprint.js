/**
 * Blueprint for entities.
 *
 * @author Andrew Nguyen
 * @author Anthony Nguyen
 * @version 2/16/23
 */

class Blueprint {
    /**
     * Initializes new Blueprint
     * @param {Object} props         Position and display properties
     * @param {string} props.tag     Type tag
     * @param {Image} props.sprite   Sprite sheet
     * @param {number} props.x       X position on canvas to draw sprite
     * @param {number} props.y       Y position on canvas to draw sprite
     * @param {number} props.sWidth  Width of sprite on sprite sheet
     * @param {number} props.sHeight Height of sprite on sprite sheet
     * @param {number} props.scale   Sprite scale factor, 1 by default
     * @param {number} props.frameX  X position of sprite frame (not pixel position!), 0 by default
     * @param {number} props.frameY  Y position of sprite frame (not pixel position!), 0 by default
     * @returns {Object}             This Blueprint's properties.
     * @constructor
     */
    constructor(props) {
        this.tag = props.tag;
        this.name = 'block';
        this.components = [
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CSprite({
                sprite: props.sprite,
                sWidth: props.sWidth,
                sHeight: props.sHeight,
                scale: props.scale,
                firstFrameX: props.frameX,
                frameY: props.frameY
            }),
            new CStats({
                maxHealth: props.maxHealth,
                regenCooldown: props.regenCooldown,
                regenAmount: props.regenAmount,
                invincible: props.invincible
            })
        ]
    };
}

/**
 * Creates a block blueprint with corresponding sprite path and lifespan.
 * @param tag   tag of block
 * @param x     x-coord
 * @param y     y-coord
 * @param mode  the mode the function should behave as
 * @returns {{components: (CTransform|CSprite|CLifespan)[], tag: string}}   Block blueprint
 */
const generateBlock = (tag, x, y, mode) => {
    let id = cleanTag(tag).toUpperCase();
    let tempX = x;
    let tempY = y;
    let tempScale = BLOCKSIZE / 16;
    switch (mode) {
        case 'terraingen':
            break;
        case 'craftgen':
            tempScale /= tempScale;
        case 'worldgen':
            tempX *= BLOCKSIZE;
            tempY *= BLOCKSIZE;
            break;
    }
    return new Blueprint({
        tag: tag,
        sprite: ASSET_MANAGER.cache[TILE_PATH[id]],
        maxHealth: TILE_LIFE[id] || 30, // Placeholder 30
        x: tempX,
        y: tempY,
        sWidth: 16,
        sHeight: 16,
        scale: tempScale,
        frameX: randomInt(6),
        frameY: randomInt(2)
    });
}

const resizeBlock = (e, mapX, mapY) => {
    if (e.isBroken) {
        // e.components.sprite.dWidth *= 2
        // e.components.sprite.dHeight *= 2
        // e.components.transform.x = BLOCKSIZE * mapX
        // e.components.transform.y = BLOCKSIZE * mapY
        e.components.stats.currentHealth = e.components.stats.maxHealth
        e.isBroken = false
        e.isDrawable = true
    } else {
        e.components.sprite.dWidth *= .5
        e.components.sprite.dHeight = e.components.sprite.dHeight * .5
        e.components.transform.velocityY = 10
        e.isBroken = true
        e.isDrawable = false
    }
    return e
}

const generateInteractive = (tag, x=0, y=0) => {
    let id = cleanTag(tag).toUpperCase();
    if (id.includes('CHEST')) id = 'CHEST';
    let image = ASSET_MANAGER.cache[CRAFT_PATH[id]];
    return new Blueprint({
        tag: tag,
        sprite: image,
        x: x * BLOCKSIZE,
        y: y * BLOCKSIZE,
        sWidth: image.width,
        sHeight: image.height,
        maxHealth: 50,
        regenCooldown: 1,
        regenAmount: 1
    });
}

const generateItem = (tag) => {
    let id = cleanTag(tag).toUpperCase();
    let index = id.lastIndexOf(' ');
    id = id.slice(0, index);
    let image = ASSET_MANAGER.cache[ITEM_PATH[id]];
    return new Blueprint({
        tag: tag,
        sprite: image,
        sWidth: image.width,
        sHeight: image.height,
        invincible: true
    });
}

const generateWeapon = (tag) => {
    let gun;
    switch (tag) {
        case "laserPistol":
            gun = new LaserPistol();
            break;
        case "laserGun":
            gun = new LaserGun();
            break;
        case "laserRifle":
            gun = new LaserRifle();
            break;
        case "flamethrower":
            gun = new Flamethrower();
            break;
        case "grenadeLauncher":
            gun = new GrenadeLauncher();
            break;
        case "handCannon":
            gun = new HandCannon();
            break;
        case "minigun":
            gun = new Minigun();
            break;
        case "railgun":
            gun = new Railgun();
            break;
    }
    return gun;
}