class Wormtank {
    /**
     * Initializes Wormtank (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'wormtank';
        this.components = this.#buildComponents(props);
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 0.5,
            maxHealth: 300
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.WORMTANK],
            sWidth: 159,
            sHeight: 106,
            scale: 0.5,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 5,
            fps: 10,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = 1.25 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: sprite.dHeight
        });

        this.#addAnimations(sprite);
        // this.#addBehaviors(transform, stats);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        // state.transform = transform;
        return [stats, sprite, transform, collider, state];
    }

    // update(target, projectileManager) {
    //     const targetX = target.center.x;
    //     const x = this.components['boxCollider'].center.x;
    //     const state = targetX < x ? "walkL" : "walkR";
    //     this.components.state.setState(state);
    //     //walk back and forth if no block or hit a collision
    //     // if (this.components.collider)
    // }

    update(target, projectileManager) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        //TODO use A* to to find path

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        let animState;

        if (distance > 300) {
            transform.velocityX = Math.floor(state.elapsedTime / 5) % 2 === 0 ? speed/4 : -speed/4;
            animState = transform.velocityX < 0 ? "walkL" : "walkR"
        } else {
            if (checkCollision(collider, target)) {
                transform.velocityX = 0;
            } else {
                transform.velocityX = dVector.x * speed;
            }
            animState = target.center.x < origin.x ? "walkL" : "walkR";
        }
        state.setState(animState);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 1, 0));
        aMap.set('idleL', new AnimationProps(0, 0,0));
        aMap.set('walkR', new AnimationProps(0, 1, 5));
        aMap.set('walkL', new AnimationProps(0, 0, 5));
    };
    #addBehaviors(transform, stats) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, null));
        bMap.set('idleL', new BehaviorProps(0, null));
        bMap.set('walkR', new BehaviorProps(stats.speed, null));
        bMap.set('walkL', new BehaviorProps(-stats.speed, null));
    }

}

