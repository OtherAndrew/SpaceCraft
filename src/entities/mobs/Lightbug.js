/**
 * Lightbug is a beneficial flying mob that heals the player on contact.
 * Cannot be damaged, but will disappear after touching the player for a few seconds.
 *
 * @author Jeep Naarkom
 * @author Andrew Nguyen
 */

class Lightbug {

    /**
     * Initializes Lightbug green (hp boost)
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Lightbug} Lightbug blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy ignoreAttack';
        this.name = 'lightbug';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            damage: -0.5,
            speed: BLOCKSIZE * 0.05,
            invincible: true
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.LIGHTBUG],
            sWidth: 51,
            sHeight: 51,
            lastFrameX: 7,
            fps: 30,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
        });
        const cDim = BLOCKSIZE * 0.66;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cDim,
            height: cDim,
            xOffset: (sprite.dWidth - cDim) / 2,
            yOffset: (sprite.dHeight - cDim) / 2
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
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const targetPos = {
            x: target.center.x,
            y: target.top - BLOCKSIZE * 0.1
        }
        const distance = getDistance(origin, targetPos);
        const dVector = normalize(origin, targetPos)
        const interval = 20;

        if (distance > BLOCKSIZE * 8) {
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

        if (checkCollision(target, collider)) {
            this.components['duration'].time -= 1.5;
        }
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 7));
    };
}

