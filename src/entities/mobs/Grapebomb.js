
class Grapebomb {
    /**
     * Initializes Spore (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of starting frame
     * @param {number} props.y       Y position of the starting frame
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'grapebomb mob';
        this.name = 'grapebomb';
        this.scale = 0.3;
        this.components = this.#buildComponents(props);
        return this;
    };
    #buildComponents(props) {
        const stats = new CStats({});
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(CHAR_PATH.GRAPEBOMB),
            sWidth: 236,
            sHeight: 193,
            scale: this.scale,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 3,
            fps: 4,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.sWidth * this.scale,
            height: sprite.sHeight * this.scale
        });

        this.#addAnimations(sprite);
        this.#addBehaviors(transform);

        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        state.transform = transform;
        return [stats, sprite, transform, collider, state];
    }

    update(tick, targetX, targetY) {
        //despawn after x range from player position

        //default state
        this.components.state.setState('idleR');
        let distance = Math.sqrt(Math.pow(this.components.transform.x - targetX, 2)
                                + Math.pow(this.components.transform.y - targetY, 2));
        if (distance <= 220) {
            this.components.state.setState('death');
        }

    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,3));
        aMap.set('death', new AnimationProps(0, 1,3));

    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, 0));
        bMap.set('death', new BehaviorProps(0, 0));

    }
}