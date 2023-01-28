/**
 * Blueprint for player entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

class Player {

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
    constructor(props) {
        this.tag = 'player';
        this.name = 'player';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const sprite = new CSprite({
            sprite: props.sprite,
            sWidth: props.sWidth,
            sHeight: props.sHeight,
            scale: props.scale,
            fps: 30
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            maxVelocityX: 15,
            maxVelocityY: 30
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: props.sWidth * props.scale,
            height: props.sHeight * props.scale
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;

        return [sprite, transform, collider, new CRigidBody(), state];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0));
        aMap.set('idleL', new AnimationProps(1, 0));
        aMap.set('walkR', new AnimationProps(0, 1, 11));
        aMap.set('walkL', new AnimationProps(0, 2, 11));
        aMap.set('jumpR', new AnimationProps(0, 1));
        aMap.set('jumpL', new AnimationProps(0, 2));
        aMap.set('crouchR', new AnimationProps(5, 1));
        aMap.set('crouchL', new AnimationProps(5, 2));
    };
}