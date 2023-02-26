
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
        this.tag = 'mob';
        this.name = 'mossamber';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 100
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.WORMWOOD],
            sWidth: 141,
            sHeight: 159,
            scale: .66,
            lastFrameX: 4,
            padding: 5,
            fps: 12
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
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
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

    update(target, projectileManager) {
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,3));
    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, 3));
    }

}
