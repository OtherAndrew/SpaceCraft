/**
 * Blueprint for player entity.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

class Player {

    /**
     * Initializes new Player
     * @param {Object} props   Player position properties
     * @param {number} props.x X position on canvas to draw player sprite
     * @param {number} props.y Y position on canvas to draw player sprite
     * @returns {Player} Player blueprint.
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
            maxHealth: 100,
            speed: 5,
            // regenCooldown: 10,
            regenAmount: 0.1,
            // invincible: true
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
            maxVelocityX: stats.speed
        });
        const cWidth = BLOCKSIZE * .8;
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

const regenPlayerComponents = (props, currentPlayer) => {
    let newPlayer = new Player(props);
    currentPlayer.isDrawable = true;
    currentPlayer.isAlive = true;
    currentPlayer.components = {};
    newPlayer.components.forEach(c => currentPlayer.components[c.name] = c)
}
