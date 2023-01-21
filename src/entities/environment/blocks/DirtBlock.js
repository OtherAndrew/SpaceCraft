/**
 * Blueprint for dirt block entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

/**
 * Initializes new DirtBlock
 * @param {Object} props                Dirt block position and display properties
 * @param {Image} props.sprite          Dirt block sprite sheet
 * @param {number} props.x              X position on canvas to draw dirt block
 * @param {number} props.y              Y position on canvas to draw dirt block
 * @param {number} props.sWidth         Width of dirt block on sprite sheet
 * @param {number} props.sHeight        Height of dirt block on sprite sheet
 * @param {number} props.scale          Scale factor to apply to dirt block, 1 by default
 * @param {number} props.frameX         X position of sprite frame (not pixel position!)
 * @param {number} props.frameY         Y position of sprite frame (not pixel position!)
 * @returns {Object}                    The dirt block properties.
 * @constructor
 */
const DirtBlock = function(props) {
    return {
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
                firstFrameX: props.frameX,
                frameY: props.frameY
            })
        ]
    };
}
DirtBlock.prototype.name = 'dirtBlock';
