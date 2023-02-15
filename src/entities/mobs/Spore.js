
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
        this.tag = 'spore mob';
        this.name = 'spore';
        this.components = this.#buildComponents(props);
    };
    #buildComponents(props) {
        const stats = new CStats({

        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.SPORE],
            sWidth: 138,
            sHeight: 196,
            scale: 0.5,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 7,
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

    update(tick, targetX, targetY) {
        this.components.state.setState('idleR');
        // this.components.transform.update(tick);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,7));
    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, 0));
    }

}
