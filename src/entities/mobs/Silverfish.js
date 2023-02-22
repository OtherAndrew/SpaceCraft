class Silverfish {
    /**
     * Initializes
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'silverfish';
        this.components = this.#buildComponents(props);
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 2,
            damage: 0.1,
            maxHealth: 30
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.SILVERFISH],
            sWidth: 93,
            sHeight: 80,
            scale: BLOCKSIZE / 93,
            lastFrameX: 3,
            fps: 9,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = BLOCKSIZE * 0.8;
        const cHeight = BLOCKSIZE * 0.8;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: cHeight,
        });
        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state];
    }

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

        // jump
        if (collider.sideCollision && state.grounded) {
            transform.velocityY = -(GRAVITY + BLOCKSIZE / 2);
            state.grounded = false;
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
}

