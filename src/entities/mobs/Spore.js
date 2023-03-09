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
        this.tag = 'mob enemy';
        this.name = 'spore';
        this.components = this.#buildComponents(props);
        return this;
    };
    #buildComponents(props) {
        const stats = new CStats({
            damage: 0.25,
            maxHealth: 100,
            hasFallDamage: false
        });
        // const height = 160;
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.SPORE],
            sWidth: 138,
            sHeight: 170,
            scale: BLOCKSIZE * 2 / 138,
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
            width: sprite.dWidth,
            height: sprite.dHeight,
        });

        const state = new CState();
        const duration = new CDuration();
        const drops = new CDrops(this.#addDrops())
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state, duration, drops];
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

    #addDrops() {
        const dropList = [];
        const num = randomInt(3) + 1;
        for (let i = 0; i < num; i++) {
            dropList.push(generateItem('item_wood'));
        }
        return dropList;
    }

}
