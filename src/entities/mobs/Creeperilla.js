class Creeperilla {
    /**
     * Initializes Creeperilla
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Creeperilla} Creeperilla blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'creeperilla';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 100,
            damage: 0.25,
            speed: 4.5
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.CREEPERILLA],
            sWidth: 160,
            sHeight: 106,
            scale: BLOCKSIZE * 2 / 152,
            firstFrameX: 1,
            frameY: 1,
            fps: 15,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = BLOCKSIZE * 0.8;
        const yOffset = BLOCKSIZE / 3;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: sprite.dHeight - yOffset - 3,
            xOffset: (sprite.dWidth - cWidth) / 2,
            yOffset: yOffset
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        state.direction = Math.random() < 0.5 ? 'left' : 'right';
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

        if (distance <= BLOCKSIZE * 12) { // attack
            if (checkCollision(collider, target)) {
                transform.velocityX = 0;
            } else {
                if (state.attackTime > 1) {
                    projectileManager.entityShoot('web', target.center, origin)
                    state.attackTime = 0;
                }
                transform.velocityX = dVector.x * speed;
                state.direction = transform.velocityX < 0 ? "left" : "right"
            }
            animState = target.center.x < origin.x ? "walkL" : "walkR";
        } else { // idle
            transform.velocityX = 0;
            animState = state.direction === 'left' ? "idleL" : "idleR";
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
        aMap.set('idleR', new AnimationProps(1, 1));
        aMap.set('idleL', new AnimationProps(1, 0));
        aMap.set('walkR', new AnimationProps(0, 1, 3));
        aMap.set('walkL', new AnimationProps(0, 0, 3));
    };

}

