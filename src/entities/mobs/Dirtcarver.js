/**
 * Dirtcarver is an aggressive crawling mob.
 * Chases after the player at moderate speed and pounces at them to do damage.
 *
 * @author Jeep Naarkom
 * @author Andrew Nguyen
 */

class Dirtcarver {
    /**
     * Initializes Dirtcarver
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Dirtcarver} Dirtcarver blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'dirtcarver';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            damage: 0.33,
            speed: 2,
            maxHealth: 100
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.DIRTCARVER],
            sWidth: 262,
            sHeight: 84,
            scale: BLOCKSIZE * 3 / 262,
            lastFrameX: 3,
            fps: 9,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
            maxVelocityX: BLOCKSIZE / 4
        });
        const cWidth = BLOCKSIZE * 1.8;
        const cHeight = BLOCKSIZE * 0.85;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: cHeight,
            yOffset: BLOCKSIZE * 0.05
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
        const interval = 10;
        const vX = (target.center.x - origin.x) / (BLOCKSIZE/2);

        if (state.grounded) {
            if (distance <= BLOCKSIZE * 12) {
                if (checkCollision(collider, target)) { // attack
                    transform.velocityX = 0;
                } else if (distance <= BLOCKSIZE * 6 && state.elapsedTime > interval/2) { // pounce
                    state.grounded = false;
                    transform.velocityX = vX;
                    transform.velocityY = -(GRAVITY + BLOCKSIZE/2);
                    state.elapsedTime = 0;
                } else { // chase
                    transform.velocityX = dVector.x * speed;
                }
                animState = target.center.x < origin.x ? "walkL" : "walkR";
            } else { // idle
                transform.velocityX = switchInterval(state.elapsedTime, interval) ? speed / 3 : -speed / 3;
                animState = transform.velocityX < 0 ? "idleL" : "idleR"
            }
        } else { // airborne
            if (checkCollision(collider, target) && state.attackTime > interval) {
                projectileManager.entityShoot("weakimpact", target.center, origin);
                state.attackTime = 0;
            }
            transform.velocityX = vX;
            animState = transform.velocityX < 0 ? "idleL" : "idleR"
        }

        if (collider.sideCollision) { // climb
            transform.velocityY = -(GRAVITY + speed);
        }

        state.setState(animState);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 3, 9));
        aMap.set('idleL', new AnimationProps(0, 1,3, 9));
        aMap.set('walkR', new AnimationProps(0, 0, 3, 18));
        aMap.set('walkL', new AnimationProps(0, 1, 3, 18));
    };
}

