/**
 * Blueprint for stone block entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

/**
 * Initializes new StoneBlock
 * @param {EntityManager} entityManager Game entity manager
 * @param {Object} props                Stone block position and display properties
 * @param {Image} props.sprite          Stone block sprite sheet
 * @param {number} props.x              X position on canvas to draw stone block
 * @param {number} props.y              Y position on canvas to draw stone block
 * @param {number} props.sWidth         Width of stone block on sprite sheet
 * @param {number} props.sHeight        Height of stone block on sprite sheet
 * @param {number} props.scale          Scale factor to apply to stone block, 1 by default
 * @param {number} props.frameX         X position of sprite frame (not pixel position!)
 * @param {number} props.frameY         Y position of sprite frame (not pixel position!)
 * @returns {Entity}                    The stone block entity.
 * @constructor
 */
const StoneBlock = function(entityManager, props) {
    return entityManager.addEntity({
        tag: 'stone',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
            }),
            new CSprite({
                sprite: props.sprite,
                sWidth: props.sWidth,
                sHeight: props.sHeight,
                scale: props.scale,
                startFrameX: props.frameX,
                frameY: props.frameY
            })
        ]
    });
}
StoneBlock.prototype.name = 'stoneBlock';
