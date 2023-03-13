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
        this.tag = 'mob npc';
        this.name = 'spiderboss';
        this.components = this.#buildComponents(props);
    };

    #buildComponents(props) {
        const stats = new CStats({
            maxHealth: 5000,
            speed: 1,
            hasFallDamage: false,
            regenAmount: 0
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.BROODMOTHER],
            sWidth: 155,
            sHeight: 110,
            scale: 3,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 3,
            fps: 3,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = BLOCKSIZE * 6;
        const yOffset = BLOCKSIZE * 2;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: sprite.dHeight - yOffset - BLOCKSIZE * 0.5,
            yOffset: yOffset
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        const duration = new CDuration();
        const drops = new CDrops([generateBlock('tile_ruby', 'craftgen')])
        state.sprite = sprite;
        state.direction = Math.random() < 0.5 ? 'left' : 'right';
        return [stats, sprite, transform, collider, state, duration, drops];
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
        const attackDistance = WIDTH;

        // if (distance <= attackDistance) { // attack
            if (checkCollision(collider, target)) {
                transform.velocityX = 0;
            } else {
                transform.velocityX = dVector.x * speed;
                state.direction = transform.velocityX < 0 ? "left" : "right"
            }
            animState = target.center.x < origin.x ? "walkL" : "walkR";
        // } else { // idle
        //     transform.velocityX = 0;
        //     animState = state.direction === 'left' ? "idleL" : "idleR";
        // }

        // shoot
        if ((collider.attackCollision || distance <= attackDistance) && state.attackTime > 1.25) {
            projectileManager.entityShoot('strongweb', target.center, origin)
            state.attackTime = 0;
        }

        // jump
        if (state.grounded && collider.sideCollision) {
            transform.velocityY = -(GRAVITY + BLOCKSIZE * 0.66);
            state.grounded = false;
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

