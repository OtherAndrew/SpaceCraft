class Dirtcarver {
    /**
     * Initializes Dirtcarver (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {Image} props.sprite   enemy sprite sheet
     * @param {number} props.x       X position of starting frame
     * @param {number} props.y       Y position of the starting frame
     * @param {number} props.sWidth  frame width
     * @param {number} props.sHeight frame height
     * @param {number} props.scale   frame scale
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
        const sprite = new CSprite({
            sprite: props.sprite,
            sWidth: props.sWidth,
            sHeight: props.sHeight,
            scale: props.scale,
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
        const collider = new CBoxCollider({
            x: props.x + props.width / 2,
            y: props.y,
            // width: props.sWidth * props.scale,
            width: BLOCKSIZE, // collision issue with wide entity
            height: props.sHeight * props.scale
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
        // this.components.transform.update(tick);
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

