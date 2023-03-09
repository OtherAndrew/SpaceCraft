/**
 * Grapebomb is a stationary mob that explodes
 * when the player gets too close or when damaged, dealing massive damage.
 *
 * @author Jeep Naarkom
 * @author Andrew Nguyen
 */

class Grapebomb {
    /**
     * Initializes Grapebomb
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Grapebomb} Grapebomb blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'grapebomb';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 25,
            hasFallDamage: false
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(CHAR_PATH.GRAPEBOMB),
            sWidth: 155,
            sHeight: 171,
            scale: BLOCKSIZE * 1.5 / 155,
            fps: 5,
            lastFrameX: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true
        });
        const cWidth = BLOCKSIZE * 1.25;
        const cHeight = BLOCKSIZE * 1.2;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: cHeight,
            yOffset: BLOCKSIZE * 0.33,
        });
        const state = new CState();
        const duration = new CDuration();
        const drops = new CDrops([generateItem('item_slime')])
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state, duration, drops];
    }

    update(target, projectileFactory) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        if (getDistance(origin, target) <= BLOCKSIZE * 3.5 || collider.attackCollision) {
            this.components['stats'].currentHealth = 0;
            projectileFactory.detonate('enemy_explosion', origin);
        }
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,3));
    };

}
