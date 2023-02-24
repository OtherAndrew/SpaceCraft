
class Vengefly {
    /**
     * Initializes bloodsucker (enemy)
     * @param {Object} props
     * @param {number} props.x       X spawn position
     * @param {number} props.y       Y spawn position
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'vengefly';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            damage: 0.2,
            speed: 2,
            maxHealth: 30
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.VENGEFLY],
            sWidth: 143,
            sHeight: 137,
            scale: BLOCKSIZE * 1.5 / 143,
            // idleR
            firstFrameX: 0,
            frameY: 1,
            lastFrameX: 4,
            fps: 30,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y
        });
        const cWidth = BLOCKSIZE * 0.8;
        const cHeight = BLOCKSIZE * 0.5;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: cHeight,
            xOffset: (sprite.dWidth - cWidth) / 2,
            yOffset: (sprite.dHeight - cHeight) * 2/3,
        });
        const state = new CState();
        const duration = new CDuration();
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;

        return [stats, sprite, transform, collider, state, duration];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleL', new AnimationProps(0, 0,4));
        aMap.set('idleR', new AnimationProps(0, 1,4));
        aMap.set('attackL', new AnimationProps(0, 2,3));
        aMap.set('attackR', new AnimationProps(0, 3,3));
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

        if (distance > BLOCKSIZE * 6) {
            if (switchInterval(state.elapsedTime, interval / 2)) {
                transform.velocityX = switchInterval(state.elapsedTime, interval) ? speed / 5 : -speed / 5;
                animState = transform.velocityX < 0 ? "idleL" : "idleR"
                state.direction = transform.velocityX < 0 ? "left" : "right"
            } else {
                transform.velocityX = 0;
                animState = state.direction === 'left' ? "idleL" : "idleR";
            }
            transform.velocityY = normalize(origin, {x: target.center.x, y: target.top - BLOCKSIZE * 2}).y * speed;
        } else {
            if (checkCollision(collider, target)) {
                transform.velocityX = 0;
            } else {
                transform.velocityX = dVector.x * speed;
            }
            transform.velocityY = dVector.y * speed;
            animState = target.center.x < origin.x ? "attackL" : "attackR";
            state.direction = transform.velocityX < 0 ? "left" : "right"
        }
        state.setState(animState);
    }
}
