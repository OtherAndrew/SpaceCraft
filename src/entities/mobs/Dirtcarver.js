class Dirtcarver {
    /**
     * Initializes Dirtcarver (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of starting frame
     * @param {number} props.y       Y position of the starting frame
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'dirtcarver mob';
        this.name = 'dirtcarver';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const spriteWidth = 262;
        const spriteHeight = 84;
        const scale = 0.5;
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(DIRTCARVER_PATH),
            sWidth: spriteWidth,
            sHeight: spriteHeight,
            scale: scale,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 3,
            fps: 12,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
            maxVelocityY: 50
        });
        const cWidth = 3 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x + props.width / 2,
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

    update(tick, targetX, targetY) {
        const x = this.components.transform.x;
        const state = targetX < x ? "walkL" : "walkR";
        this.components.state.setState(state);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 0));
        aMap.set('idleL', new AnimationProps(0, 1,0));
        aMap.set('walkR', new AnimationProps(0, 0, 3));
        aMap.set('walkL', new AnimationProps(0, 1, 3));
    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, null));
        bMap.set('idleL', new BehaviorProps(0, null));
        bMap.set('walkR', new BehaviorProps(0.8, null));
        bMap.set('walkL', new BehaviorProps(-0.8, null));
    }

}

