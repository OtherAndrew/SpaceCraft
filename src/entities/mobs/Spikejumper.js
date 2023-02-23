class Spikejumper {
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
        this.name = 'spikejumper';
        this.components = this.#buildComponents(props);
    };

    #buildComponents(props) {
        const stats = new CStats({
            damage: 1.25,
            maxHealth: 400,
            hasFallDamage: false
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.SPIKEJUMPER],
            sWidth: 188,
            sHeight: 228,
            scale: BLOCKSIZE * 2 / 188,
            lastFrameX: 1,
            fps: 9,
            loop: false
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
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: cHeight,
            yOffset: BLOCKSIZE * 3/8
        });
        const state = new CState();
        const duration = new CDuration();
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state, duration];
    }

    update(target, projectileManager) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const distance = getDistance(origin, target.center);
        let animState = state.currentState;
        const interval = 5;
        const vX = (target.center.x - origin.x) / (BLOCKSIZE * 2/3);

        if (state.grounded) {
            if ((distance < BLOCKSIZE * 12 || collider.attackCollision) && state.elapsedTime > interval) { // jump
                state.grounded = false;
                transform.velocityX = vX;
                transform.velocityY = -(GRAVITY + 1.8 * Math.abs(vX));
                animState = 'jumpR'
                state.elapsedTime = 0;
            } else { // land/wait
                transform.velocityX = 0;
                animState = 'idleR'
            }
        } else { // airborne
            transform.velocityX = vX;
        }
        state.setState(animState);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 1, null, false));
        aMap.set('jumpR', new AnimationProps(0, 1, 3, null, false));
    };
}

