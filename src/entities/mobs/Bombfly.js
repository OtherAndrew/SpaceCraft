/**
 * Bombfly is a flying mob that chases after the player
 * and explodes on contact, dealing massive damage.
 * Speedy, but easy to take down.
 *
 * @author Andrew Nguyen
 */

class Bombfly {
    /**
     * Initializes Bombfly
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Bombfly} Bombfly blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'bombfly';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 4,
            maxHealth: 30
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.BOMBFLY],
            sWidth: 83,
            sHeight: 90,
            scale: 0.5,
            fps: 20,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y
        });
        const cDim = BLOCKSIZE * 0.5
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cDim,
            height: cDim,
            xOffset: (sprite.dWidth - cDim) / 2,
            yOffset: (sprite.dHeight - cDim),
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
        aMap.set('idleR', new AnimationProps(0, 1,3, 20));
        aMap.set('idleL', new AnimationProps(0, 0,3, 20));
        aMap.set('flyR', new AnimationProps(0, 1,3, 40));
        aMap.set('flyL', new AnimationProps(0, 0,3, 40));
    };

    update(target, projectileFactory) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        let animState;

        if (distance > BLOCKSIZE * 10) {
            transform.velocityX = switchInterval(state.elapsedTime, 5) ? speed/5 : -speed/5;
            transform.velocityY = normalize(origin, { x: target.center.x, y: target.top - 50 }).y * speed;
            animState = transform.velocityX < 0 ? "flyL" : "flyR"
        } else {
            if (checkCollision(collider, target)) {
                this.components['stats'].currentHealth = 0;
                projectileFactory.detonate('enemy_explosion', origin);
            } else {
                transform.velocityX = dVector.x * speed;
                transform.velocityY = dVector.y * speed;
            }
            animState = target.center.x < origin.x ? "flyL" : "flyR";
        }
        state.setState(animState);
    }
}
