
class Mossfly {
    /**
     * Initializes
     * @param {Object} props
     * @param {number} props.x       X spawn position
     * @param {number} props.y       Y spawn position
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'mossfly';
        this.components = this.#buildComponents(props);
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 2.5,
            maxHealth: 200
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.MOSSFLY],
            sWidth: 122,
            sHeight: 137,
            scale: BLOCKSIZE * 2 / 122,
            // idleR
            firstFrameX: 0,
            frameY: 1,
            lastFrameX: 3,
            fps: 20,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y
        });
        const cWidth = BLOCKSIZE * 1.5;
        const cHeight = BLOCKSIZE * 1.5;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: cHeight,
            xOffset: (sprite.dWidth - cWidth) / 2,
            yOffset: (sprite.dHeight - cHeight) * 2/3,
        });
        const drops = new CDrops([
            new LaserPistol()
        ]);
        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;

        return [stats, sprite, transform, collider, state, drops];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleL', new AnimationProps(0, 0,3, 20));
        aMap.set('idleR', new AnimationProps(0, 1,3, 20));
    };

    update(target, projectileManager) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        let animState;
        const interval = 10;

        if (distance > BLOCKSIZE * 10) { //idle
            transform.velocityX = switchInterval(state.elapsedTime, interval) ? speed / 5 : -speed / 5;
            transform.velocityY = normalize(origin, {x: target.center.x, y: target.top - BLOCKSIZE * 4}).y * speed;
            animState = transform.velocityX < 0 ? "idleL" : "idleR"

            if (state.attackTime > 2 && distance <= BLOCKSIZE * 16) {
                projectileManager.entityShoot('spore', target.center, origin)
                state.attackTime = 0;
            }
        } else { //panic
            transform.velocityX = -dVector.x * speed;
            transform.velocityY = -(Math.abs(dVector.y) * speed);
            animState = target.center.x < origin.x ? "idleR" : "idleL";
            state.elapsedTime = (target.center.x < origin.x ? 0 : interval) + randomInt(interval);

            if (state.attackTime > 0.5 && distance <= BLOCKSIZE * 16) {
                projectileManager.entityShoot('spore', target.center, origin)
                state.attackTime = 0;
            }
        }

        state.setState(animState);
    }
}
