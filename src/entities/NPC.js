/**
 * Blueprint for entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

class NPC {

    /**
     * Initializes new NPC
     * @param {Object} props         NPC position and display properties
     * @param {Image} props.sprite   NPC sprite sheet
     * @param {number} props.x       X position on canvas to draw NPC sprite
     * @param {number} props.y       Y position on canvas to draw NPC sprite
     * @param {number} props.sWidth  Width of NPC sprite on sprite sheet
     * @param {number} props.sHeight Height of NPC sprite on sprite sheet
     * @param {number} props.scale   Scale factor to apply to NPC sprite, 1 by default
     * @param {number} props.padding Pixel padding to apply to NPC sprite, 0 by default
     * @param {number} props.fps     Frames per second of NPC sprite animation, 30 by default
     * @returns {Object}             The NPC properties.
     * @constructor
     */
    constructor(props) {
        this.tag = 'npc';
        this.name = 'npc';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const sprite = new CSprite({
            sprite: props.sprite,
            sWidth: props.sWidth,
            sHeight: props.sHeight,
            scale: props.scale,
            padding: props.padding,
            fps: props.fps || 30
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: props.sWidth * props.scale,
            height: props.sHeight * props.scale
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
        });
        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        return [sprite, transform, collider, state];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0));
        aMap.set('idleL', new AnimationProps(1, 0));
        aMap.set('walkR', new AnimationProps(0, 1, 11));
        aMap.set('walkL', new AnimationProps(0, 2, 11));
    };
}