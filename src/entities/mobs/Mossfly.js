/**
 * Mossfly is a flying mob that fires spores at the player.
 * Slow, but can take a few hits, and flies away from the player when they approach.
 *
 * @author Andrew Nguyen
 */

class Mossfly {
    /**
     * Initializes Mossfly mob.
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Mossfly} Mossfly blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'mossfly';
        this.components = this.#buildComponents(props);
        return this;
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
        const drops = new CDrops(this.#addDrops());
        const state = new CState();
        const duration = new CDuration();
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;

        return [stats, sprite, transform, collider, state, drops, duration];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleL', new AnimationProps(0, 0,3, 20));
        aMap.set('idleR', new AnimationProps(0, 1,3, 20));
    };

    #addDrops() {
        const dropList = [];
        const num = randomInt(3) + 1;
        for (let i = 0; i < num; i++) {
            dropList.push(generateItem('wood'));
        }
        return dropList;
    }

    update(target, projectileManager) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const distance = getDistance(origin, target.center);
        let animState;
        const interval = 20;

        const attackDistance = BLOCKSIZE * 16;
        if (distance <= BLOCKSIZE * 10 || collider.attackCollision) { //panic
            transform.velocityX = target.center.x < origin.x ? speed : -speed
            transform.velocityY = -speed/3
            state.direction = transform.velocityX < 0 ? "left" : "right"
            animState = state.direction === 'left' ? "idleL" : "idleR";
            state.elapsedTime = (target.center.x < origin.x ? 0 : interval) + randomInt(interval/2);

            if (state.attackTime > 0.33 && distance <= attackDistance) {
                projectileManager.entityShoot('spore', target.center, origin)
                state.attackTime = 0;
            }
        } else { //idle
            if (switchInterval(state.elapsedTime, interval/2)) {
                transform.velocityX = switchInterval(state.elapsedTime, interval) ? speed/5 : -speed/5;
                animState = transform.velocityX < 0 ? "idleL" : "idleR"
                state.direction = transform.velocityX < 0 ? "left" : "right"
            } else {
                transform.velocityX = 0;
                animState = state.direction === 'left' ? "idleL" : "idleR";
            }
            transform.velocityY = normalize(origin, { x: target.center.x, y: target.top - BLOCKSIZE * 4 }).y * speed;

            if (state.attackTime > 2 && distance <= attackDistance) {
                projectileManager.entityShoot('spore', target.center, origin)
                state.attackTime = 0;
            }
        }

        state.setState(animState);
    }
}
