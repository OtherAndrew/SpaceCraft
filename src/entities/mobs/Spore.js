/**
 * Spore is a stationary, but aggressive mob.
 * Fires spores at the player if they're within range.
 *
 * @author Jeep Naarkom
 * @author Andrew Nguyen
 */
class Spore {
    /**
     * Initializes Spore
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Spore} Spore blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'spore';
        this.components = this.#buildComponents(props);
        return this;
    };
    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 100
        });
        // const height = 160;
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.SPORE],
            sWidth: 138,
            sHeight: 170,
            scale: 0.5,
            fps: 7.5,
            lastFrameX: 7
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true
        });

        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: Math.floor(sprite.dWidth / BLOCKSIZE) * BLOCKSIZE,
            height: sprite.dHeight,
            // xOffset: sprite.dWidth
        });

        const state = new CState();
        const duration = new CDuration();
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state, duration];
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
