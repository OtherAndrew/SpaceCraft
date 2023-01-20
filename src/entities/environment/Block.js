/**
 * Blueprint for Block entities.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

/**
 * Initializes new Block
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
 * @returns {Object}             This Block's properties.
 * @constructor
 */
const Block = function(props) {
    return {
        tag: props.tag,
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
                startFrameX: props.frameX || 0,
                frameY: props.frameY || 0
            })
        ]
    };
}
Block.prototype.name = 'block';
