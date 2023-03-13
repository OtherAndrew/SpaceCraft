class Spiderboss {
    /**
     * Initializes Spiderboss (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy npc';
        this.name = 'spiderboss';
        this.components = this.#buildComponents(props);
    };

    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 5000,
            damage: 0.5,
            speed: 1,
            hasFallDamage: false
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.BROODMOTHER],
            sWidth: 150,
            sHeight: 104,
            scale: 3,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 3,
            fps: 1.5,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = 13 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: sprite.dHeight
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        const duration = new CDuration();
        state.sprite = sprite;
        state.direction = Math.random() < 0.5 ? 'left' : 'right';
        return [stats, sprite, transform, collider, state, duration];
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
        const attackDistance = BLOCKSIZE * 25;

        if (distance <= attackDistance) { // attack
            if (checkCollision(collider, target)) {
                transform.velocityX = 0;
            } else {
                transform.velocityX = dVector.x * speed;
                state.direction = transform.velocityX < 0 ? "left" : "right"
            }
            animState = target.center.x < origin.x ? "walkL" : "walkR";
        } else { // idle
            transform.velocityX = 0;
            animState = state.direction === 'left' ? "idleL" : "idleR";
        }

        // shoot
        if ((collider.attackCollision || distance <= attackDistance) && state.attackTime > 1) {
            projectileManager.entityShoot('strongweb', target.center, origin)
            state.attackTime = 0;
        }

        // jump
        if (state.grounded) {
            if (collider.sideCollision) {
                transform.velocityY = -(GRAVITY + BLOCKSIZE * 0.66);
                state.grounded = false;
            } else if (collider.attackCollision) {
                transform.velocityY = -(GRAVITY + BLOCKSIZE * 0.44);
                state.grounded = false;
            }
        }

        state.setState(animState);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 1, 0));
        aMap.set('idleL', new AnimationProps(0, 0,0));
        aMap.set('walkR', new AnimationProps(0, 1, 3));
        aMap.set('walkL', new AnimationProps(0, 0, 3));
    };

}

