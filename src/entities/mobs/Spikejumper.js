/**
 * Spikejumper is a jumping ambush mob.
 * Has high damage and survivability, but is vulnerable between jumps.
 *
 * @author Andrew Nguyen
 */

class Spikejumper {
    /**
     * Initializes Spikejumper mob.
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Spikejumper} Spikejumper blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'spikejumper';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            damage: 1,
            maxHealth: 250,
            hasFallDamage: false
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.SPIKEJUMPER],
            sWidth: 188,
            sHeight: 228,
            scale: BLOCKSIZE * 2 / 188,
            lastFrameX: 1,
            fps: 15,
            loop: false
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
            maxVelocityX: BLOCKSIZE / 4
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
        const drops = new CDrops(this.#getDrops())
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state, duration, drops];
    }

    update(target, projectileManager) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const distance = getDistance(origin, target.center);
        let animState = state.currentState;
        const interval = 5;
        const vX = (target.center.x - origin.x) / (BLOCKSIZE * 0.5);

        if (state.grounded) {
            if ((distance < BLOCKSIZE * 16 || collider.attackCollision) && state.elapsedTime > interval) { // jump
                state.grounded = false;
                transform.velocityX = vX;
                transform.velocityY =
                        -(GRAVITY + clamp(2 * Math.abs(vX), BLOCKSIZE * 0.3, BLOCKSIZE * 0.9));
                animState = 'jumpR'
                state.elapsedTime = 0;
            } else { // land/wait
                transform.velocityX = 0;
                animState = 'idleR'
            }
        } else { // airborne
            if (checkCollision(collider, target) && state.attackTime > interval) {
                projectileManager.entityShoot("strongimpact", target.center, origin);
                state.attackTime = 0;
            }
            transform.velocityX = vX;
        }
        state.setState(animState);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 1, null, false));
        aMap.set('jumpR', new AnimationProps(0, 1, 3, null, false));
    };

    #getDrops() {
        const dropList = [generateItem('silk')];
        if (Math.random() <= 0.05) dropList.push(new LaserRifle());
        if (Math.random() <= 0.1) dropList.push(new LaserGun());
        return dropList;
    }
}

