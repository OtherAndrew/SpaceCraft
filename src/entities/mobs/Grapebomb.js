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
            scale: 0.33,
            fps: 4,
            lastFrameX: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true
        });
        const cWidth = 1.5 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: BLOCKSIZE * 1.4
        });
        const state = new CState();
        const duration = new CDuration();
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state, duration];
    }

    update(target, projectileFactory) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        // if (checkCollision(collider, target)) {
        if (getDistance(origin, target) <= BLOCKSIZE * 3.5) {
            this.components['stats'].currentHealth = 0;
            projectileFactory.detonate('enemy_explosion', origin);
        }
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,3));
    };

}
