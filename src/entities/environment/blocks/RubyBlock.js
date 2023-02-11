/**
 * Blueprint for ruby block entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

/**
 * Initializes new RubyBlock
 * @param {Object} props                Ruby block position and display properties
 * @param {Image} props.sprite          Ruby block sprite sheet
 * @param {number} props.x              X position on canvas to draw ruby block
 * @param {number} props.y              Y position on canvas to draw ruby block
 * @param {number} props.sWidth         Width of dirt block on sprite sheet
 * @param {number} props.sHeight        Height of dirt block on sprite sheet
 * @param {number} props.scale          Scale factor to apply to ruby block, 1 by default
 * @param {number} props.frameX         X position of sprite frame (not pixel position!)
 * @param {number} props.frameY         Y position of sprite frame (not pixel position!)
 * @returns {Object}                    The ruby block properties.
 * @constructor
 */
const RubyBlock = function(props) {
    return {
        tag: 'tile_ruby',
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
            }),
            new CLifespan(TILE_LIFE_RUBY)
        ]
    };
}
RubyBlock.prototype.name = 'rubyBlock';
