
class Rocket {
    /**
     * Initializes rocket (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'rocket ignore npc';
        this.name = 'rocket';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.ROCKET],
            sWidth: 221,
            sHeight: 295,
            padding: 1
        });
        const transform = new CTransform({
            x: props.x + 20,
            y: props.y,
            hasGravity: true
        });
        const cWidth = 3 * BLOCKSIZE;
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
        return [sprite, transform, collider, state];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,0));
        aMap.set('win', new AnimationProps(0, 0,0));
    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, 0));
        bMap.set('win', new BehaviorProps(0, -5));
    }

    update(tick, projectileManager) {
        
    }
}
