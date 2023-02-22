class Dirtcarver {
    /**
     * Initializes Dirtcarver (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'dirtcarver';
        this.components = this.#buildComponents(props);
        this.rand = Math.floor(Math.random()*(60 - 10) + 10);
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 1.5,
            maxHealth: 50
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.DIRTCARVER],
            sWidth: 262,
            sHeight: 84,
            scale: BLOCKSIZE * 2 / 262,
            lastFrameX: 3,
            fps: 9,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = BLOCKSIZE * 0.8;
        const cHeight = sprite.dHeight - 2;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: cHeight,
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
    //
    //     if (this.rand > 0) {
    //         this.rand--;
    //
    //     } else {
    //         let height = Math.floor(Math.random()*(15 - 3) + 3);
    //         this.components.transform.velocityY -= height;
    //         this.components.transform.velocityX = state === "walkL" ? -2: 2;
    //     }
    //     // console.log('dc num', this.rand);
    // }

    update(target, projectileManager) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        let animState;

        if (distance > BLOCKSIZE * 12) {
            transform.velocityX = switchInterval(state.elapsedTime, 10) ? speed/3 : -speed/3;
            animState = transform.velocityX < 0 ? "idleL" : "idleR"
        } else {
            if (checkCollision(collider, target)) {
                transform.velocityX = 0;
            } else {
                transform.velocityX = dVector.x * speed;
            }
            animState = target.center.x < origin.x ? "walkL" : "walkR";
        }

        // climb
        if (collider.sideCollision) {
            transform.velocityY = -(GRAVITY + speed);
        }

        state.setState(animState);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 3, 9));
        aMap.set('idleL', new AnimationProps(0, 1,3, 9));
        aMap.set('walkR', new AnimationProps(0, 0, 3, 18));
        aMap.set('walkL', new AnimationProps(0, 1, 3, 18));
    };
    // #addBehaviors(transform, stats) {
    //     const bMap = transform.behaviorMap;
    //     bMap.set('idleR', new BehaviorProps(0, null));
    //     bMap.set('idleL', new BehaviorProps(0, null));
    //     bMap.set('walkR', new BehaviorProps(stats.speed, null));
    //     bMap.set('walkL', new BehaviorProps(-stats.speed, null));
    // }

}

