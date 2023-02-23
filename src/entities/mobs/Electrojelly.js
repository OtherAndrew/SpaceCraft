
class Electrojelly {
    /**
     * Initializes bloodsucker (enemy)
     * @param {Object} props
     * @param {number} props.x       X spawn position
     * @param {number} props.y       Y spawn position
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy ghost';
        this.name = 'electrojelly';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            damage: 0.25,
            speed: 0.5,
            maxHealth: 75
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.ELECTROJELLY],
            sWidth: 87,
            sHeight: 74,
            scale: BLOCKSIZE * 2 / 87,
            // idleR
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 17,
            fps: 30,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y
        });
        const cWidth = BLOCKSIZE * 0.8;
        const cHeight = BLOCKSIZE * 0.85;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: cHeight,
            xOffset: BLOCKSIZE * 0.5,
            yOffset: BLOCKSIZE * 0.33,
        });
        const state = new CState();
        const duration = new CDuration();
        transform.collider = collider

        return [stats, sprite, transform, collider, state, duration];
    }

    update(target, projectileFactory) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        const interval = 40;

        if (distance > BLOCKSIZE * 16) {
            if (switchInterval(state.elapsedTime, interval/2)) {
                transform.velocityX = switchInterval(state.elapsedTime, interval) ? speed : -speed;
            } else {
                transform.velocityX = 0;
            }
            transform.velocityY = 0;
        } else {
            transform.velocityX = dVector.x * speed;
            transform.velocityY = dVector.y * speed;
        }

        if ((distance <= BLOCKSIZE * 8 || collider.attackCollision)
                && state.attackTime > 4 && !checkCollision(collider, target)) {
            projectileFactory.entityShoot('electroball', target.center, origin)
            state.attackTime = 0;
        }
    }
}
