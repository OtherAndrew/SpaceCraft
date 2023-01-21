/**
 * Blueprint for player entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

/**
 * Initializes new Player
 * @param {Object} props         Player position and display properties
 * @param {Image} props.sprite   Player sprite sheet
 * @param {number} props.x       X position on canvas to draw player sprite
 * @param {number} props.y       Y position on canvas to draw player sprite
 * @param {number} props.sWidth  Width of player sprite on sprite sheet
 * @param {number} props.sHeight Height of player sprite on sprite sheet
 * @param {number} props.scale   Scale factor to apply to player sprite, 1 by default
 * @returns {Object}             The player properties.
 * @constructor
 */
const Player = function(props) {
    return {
        tag: 'player',
        components: [
            new CSprite({
                sprite: props.sprite,
                sWidth: props.sWidth,
                sHeight: props.sHeight,
                scale: props.scale,
                fps: 30
            }),
            new CTransform({
                x: props.x,
                y: props.y,
                maxVelocity: 15
            }),
            new CBoxCollider({
                x: props.x,
                y: props.y,
                width: props.sWidth * props.scale,
                height: props.sHeight * props.scale
            }),
            new CRigidBody(1),
            // new CInput(),
            new CState()
        ]
    };
}
Player.prototype.name = 'player';

