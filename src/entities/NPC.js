/**
 * Blueprint for entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

/**
 * Initializes new NPC
 * @param {Object} props         NPC position and display properties
 * @param {Image} props.sprite   NPC sprite sheet
 * @param {number} props.x       X position on canvas to draw NPC sprite
 * @param {number} props.y       Y position on canvas to draw NPC sprite
 * @param {number} props.sWidth  Width of NPC sprite on sprite sheet
 * @param {number} props.sHeight Height of NPC sprite on sprite sheet
 * @param {number} props.scale   Scale factor to apply to NPC sprite, 1 by default
 * @returns {Object}             The NPC properties.
 * @constructor
 */
const NPC = function(props) {
    return {
        tag: 'npc',
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
            }),
            new CBoxCollider({
                x: props.x,
                y: props.y,
                width: props.sWidth * props.scale,
                height: props.sHeight * props.scale
            }),
            new CRigidBody(1),
            // new CInput(),
            new CState('walkR')
        ]
    };
}
NPC.prototype.name = 'npc';

