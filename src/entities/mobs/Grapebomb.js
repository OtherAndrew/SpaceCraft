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
        this.tag = 'grapebomb mob';
        this.name = 'grapebomb';
        this.components = this.#buildComponents(props);
    };

    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 50
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(CHAR_PATH.GRAPEBOMB),
            sWidth: 155,
            sHeight: 171,
            scale: 0.3,
            fps: 4,
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
            height: sprite.dHeight
        });

        this.#addAnimations(sprite);
        this.#addBehaviors(transform);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        state.transform = transform;
        return [stats, sprite, transform, collider, state];
    }

    update(targetX, targetY, projectileManager) {
        if (getDistance2(this.components['transform'].x, this.components['transform'].y, targetX, targetY) <= 100) {
            projectileManager.shoot('explosion', { x: targetX, y: targetY }, this);
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
