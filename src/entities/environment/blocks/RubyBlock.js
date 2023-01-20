/**
 * Blueprint for ruby block entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

/**
 * Initializes new RubyBlock
 * @param {EntityManager} entityManager Game entity manager
 * @param {Object} props                Ruby block position and display properties
 * @param {Image} props.sprite          Ruby block sprite sheet
 * @param {number} props.x              X position on canvas to draw ruby block
 * @param {number} props.y              Y position on canvas to draw ruby block
 * @param {number} props.sWidth         Width of dirt block on sprite sheet
 * @param {number} props.sHeight        Height of dirt block on sprite sheet
 * @param {number} props.scale          Scale factor to apply to ruby block, 1 by default
 * @param {number} props.frameX         X position of sprite frame (not pixel position!)
 * @param {number} props.frameY         Y position of sprite frame (not pixel position!)
 * @returns {Entity}                    The ruby block entity.
 * @constructor
 */
const RubyBlock = function(entityManager, props) {
    return entityManager.addEntity({
        tag: 'ruby',
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
RubyBlock.prototype.name = 'rubyBlock';
