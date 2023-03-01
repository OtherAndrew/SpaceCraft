/**
 * Wormtank is a slow, but extremely tough crawling mob.
 * Chases after the player at slow speed, but charges at them at high speed
 * when they get too close, dealing high damage.
 *
 * @author Jeep Naarkom
 * @author Andrew Nguyen
 */

class Wormtank {
    /**
     * Initializes Wormtank
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Wormtank} Wormtank blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'wormtank';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            damage: 0.25,
            speed: 0.5,
            maxHealth: 500
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
            hasGravity: true
        });
        const cWidth = BLOCKSIZE * 1.6;
        const cHeight = BLOCKSIZE * 1.25;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: cHeight,
            xOffset: (sprite.dWidth - cWidth) / 2,
            yOffset: (sprite.dHeight - cHeight) * 3/4
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

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        let animState;
        const interval = 30
        const attackInterval = 5;
        const attackDistance = BLOCKSIZE * 12;

        if (state.attackTime > attackInterval + 1) {
            state.attackTime = 0;
        }
        if (distance <= attackDistance) {
            if (checkCollision(collider, target)) { // attack
                transform.velocityX = 0;
                animState = target.center.x < origin.x ? "walkL" : "walkR";
                if (state.attackTime > attackInterval) {
                    projectileManager.entityShoot("strongimpact", target.center, origin);
                }
                state.attackTime = 0;
            } else if ((state.currentState.includes("charge")
                        || isBetween(distance, attackDistance * 0.33, attackDistance * 0.55))
                    && state.attackTime > attackInterval) { // charge
                transform.velocityX = dVector.x * speed * 13;
                animState = target.center.x < origin.x ? "chargeL" : "chargeR";
            } else { // chase
                transform.velocityX = dVector.x * speed;
                animState = target.center.x < origin.x ? "walkL" : "walkR";
            }
            state.direction = transform.velocityX < 0 ? "left" : "right"
        } else { // idle
            if (switchInterval(state.elapsedTime, interval/2)) {
                transform.velocityX = switchInterval(state.elapsedTime, interval) ? speed/3 : -speed/3;
                animState = transform.velocityX < 0 ? "idleL" : "idleR"
                state.direction = transform.velocityX < 0 ? "left" : "right"
            } else {
                transform.velocityX = 0;
                animState = state.direction === 'left' ? "idleL" : "idleR";
            }
        }

        // climb
        if (collider.sideCollision) {
            transform.velocityY = -(GRAVITY + speed/2.5);
            state.attackTime = 0;
        }

        state.setState(animState);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 1, 5, 5));
        aMap.set('idleL', new AnimationProps(0, 0,5, 5));
        aMap.set('walkR', new AnimationProps(0, 1, 5, 10));
        aMap.set('walkL', new AnimationProps(0, 0, 5, 10));
        aMap.set('chargeR', new AnimationProps(0, 1, 5, 30));
        aMap.set('chargeL', new AnimationProps(0, 0, 5, 30));
    };
}

