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
            sWidth: 160,
            sHeight: 108,
            scale: BLOCKSIZE * 2.5 / 160,
            firstFrameX: 0,
            frameY: 1,
            lastFrameX: 5,
            fps: 5,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = BLOCKSIZE * 1.5;
        const cHeight = BLOCKSIZE * 1.25;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: cHeight,
            xOffset: (sprite.dWidth - cWidth) / 2,
            yOffset: (sprite.dHeight - cHeight) * 3/4
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

        //TODO use A* to to find path

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        let animState;

        if (distance > BLOCKSIZE * 12) {
            transform.velocityX = switchInterval(state.elapsedTime, 20) ? speed/5 : -speed/5;
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
            transform.velocityY = -(GRAVITY + speed/2.5);
        }

        state.setState(animState);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 1, 5, 5));
        aMap.set('idleL', new AnimationProps(0, 0,5, 5));
        aMap.set('walkR', new AnimationProps(0, 1, 5, 10));
        aMap.set('walkL', new AnimationProps(0, 0, 5, 10));
    };
}

