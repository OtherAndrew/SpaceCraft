
class Spore {
    /**
     * Initializes Spore (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'spore';
        this.components = this.#buildComponents(props);
    };
    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 100
        });
        // const height = 160;
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.SPORE],
            sWidth: 138,
            sHeight: 196,
            scale: 0.5,
            fps: 7.5,
            lastFrameX: 7
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true
        });
        const cWidth = BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: sprite.dHeight - BLOCKSIZE / 2,
            xOffset: (sprite.dWidth - cWidth) / 2
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state];
    }

    update(target, projectileManager) {
        const origin = this.components['boxCollider'].center;
        const state = this.components['state'];
        if (state.attackTime > 2 && getDistance(origin, target.center) <= BLOCKSIZE * 16) {
            projectileManager.entityShoot('spore', target.center, origin)
            state.attackTime = 0;
        }
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,7));
    };
}
