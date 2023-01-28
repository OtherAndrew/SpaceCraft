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


class Player {

    constructor(props) {
        this.tag = 'player';
        this.name = 'player';
        this.components = [
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
                maxVelocityX: 15,
                maxVelocityY: 50
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
        ];
        this.#addAnimations();
    };

    #addAnimations() {
        const spriteComp = this.components.find(component => component.name === 'sprite');
        spriteComp.animationMap.set('idleR', new AnimationProps(0, 0));
        spriteComp.animationMap.set('idleL', new AnimationProps(1, 0));
        spriteComp.animationMap.set('walkR', new AnimationProps(0, 1, 11));
        spriteComp.animationMap.set('walkL', new AnimationProps(0, 2, 11));
        spriteComp.animationMap.set('jumpR', new AnimationProps(0, 1));
        spriteComp.animationMap.set('jumpL', new AnimationProps(0, 2));
        spriteComp.animationMap.set('crouchR', new AnimationProps(5, 1));
        spriteComp.animationMap.set('crouchL', new AnimationProps(5, 2));
    };
}