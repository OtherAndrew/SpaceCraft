
class Mossamber {
    /**
     * Initializes mossamber (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mossamber mob';
        this.name = 'mossamber';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 100
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.MOSSAMBER],
            sWidth: 141,
            sHeight: 159,
            scale: .7,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 0,
            fps: 1,
            padding: 1
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
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,0));
    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, 0));
    }

}
