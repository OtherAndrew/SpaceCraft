class Grapebomb {
    /**
     * Initializes
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'grapebomb';
        this.components = this.#buildComponents(props);
    };

    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 30
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(CHAR_PATH.GRAPEBOMB),
            sWidth: 155,
            sHeight: 171,
            scale: 0.35,
            fps: 4,
            lastFrameX: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true
        });
        const cWidth = 2 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.dWidth + 9.75,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: BLOCKSIZE * 1.4
        });

        this.#addAnimations(sprite);
        this.#addBehaviors(transform);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        state.transform = transform;
        return [stats, sprite, transform, collider, state];
    }

    update(target, projectileFactory) {
        const origin = this.components['boxCollider'].center;
        // if (checkCollision(this, target)) {
        if (getDistance(origin, target) <= BLOCKSIZE * 3.5) {
            this.components['stats'].currentHealth = 0;
            projectileFactory.detonate('enemy_explosion', origin);
        }
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,3));
    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, 0));
    }

}
