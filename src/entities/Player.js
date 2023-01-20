/**
 * Blueprint for player entity.
 *
 * @author Andrew Nguyen
 * @version 1/19/23
 */

/**
 * Initializes new Player
 * @param entityManager    Game entity manager
 * @param {Image} sprite   Player sprite sheet
 * @param {number} x       X position on canvas to draw player sprite
 * @param {number} y       Y position on canvas to draw player sprite
 * @param {number} sWidth  Width of player sprite on sprite sheet
 * @param {number} sHeight Height of player sprite on sprite sheet
 * @param {number} scale   Scale factor to apply to player sprite, 1 by default
 * @returns {Entity}       The player entity.
 * @constructor
 */
const Player = function(entityManager, { sprite, x, y, sWidth, sHeight, scale = 1 }) {
    return entityManager.addEntity({
        tag: 'player',
        components: [
            new CSprite({
                sprite: sprite,
                sWidth: sWidth,
                sHeight: sHeight,
                scale: scale,
                fps: 30
            }),
            new CTransform({
                x: x,
                y: y,
                maxVelocity: 15
            }),
            new CBoxCollider({
                x: x,
                y: y,
                width: sWidth * scale,
                height: sHeight * scale
            }),
            new CRigidBody(1),
            // new CInput(),
            new CState()
        ]
    });
}
Player.prototype.name = 'player';

