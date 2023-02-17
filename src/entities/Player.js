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
     * @param {number} props.x       X position on canvas to draw player sprite
     * @param {number} props.y       Y position on canvas to draw player sprite
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
        const stats = new CStats({
            maxHealth: 200,
            speed: 6
        });
        const spriteWidth = 200;
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(CHAR_PATH.PLAYER),
            sWidth: spriteWidth,
            sHeight: 250,
            scale: BLOCKSIZE * 1.5 / spriteWidth,
            fps: 30
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
            maxVelocityX: stats.speed,
            maxVelocityY: BLOCKSIZE * .9
        });
        const cWidth = BLOCKSIZE * .75;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: BLOCKSIZE * 1.35,
            xOffset: (sprite.dWidth - cWidth) / 2,
            yOffset: BLOCKSIZE * .4
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;

        return [stats, sprite, transform, collider, state];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0));
        aMap.set('idleL', new AnimationProps(1, 0));
        aMap.set('walkR', new AnimationProps(0, 1, 11));
        aMap.set('walkL', new AnimationProps(0, 2, 11));
        aMap.set('jumpR', new AnimationProps(0, 1));
        aMap.set('jumpL', new AnimationProps(0, 2));
        aMap.set('flyR', new AnimationProps(0, 1));
        aMap.set('flyL', new AnimationProps(0, 2));
        aMap.set('crouchR', new AnimationProps(5, 1));
        aMap.set('crouchL', new AnimationProps(5, 2));
    };

}