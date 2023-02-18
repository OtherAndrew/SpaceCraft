
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
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 50
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(CHAR_PATH.GRAPEBOMB),
            sWidth: 236,
            sHeight: 195,
            scale: 0.3,
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

    update(targetX, targetY, projectileManager) {
        //despawn after x range from player position
        console.log("grapebomb")
        if (getDistance2(this.components['transform'].x, this.components['transform'].y, targetX, targetY) <= 10) {
            projectileManager.shoot('explosion', { x: targetX, y: targetY }, this);
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