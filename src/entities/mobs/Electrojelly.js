/**
 * Electrojelly is a flying mob that can go through blocks.
 * Slowly chases after the player, firing electricity that stuns.
 *
 * @author Andrew Nguyen
 */

class Electrojelly {
    /**
     * Initializes Electrojelly mob.
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Electrojelly} Electrojelly blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy ghost';
        this.name = 'electrojelly';
        this.components = this.#buildComponents(props);
        return this;
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            damage: 1,
            speed: 0.5,
            maxHealth: 60
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
        const drops = new CDrops(this.#addDrops());
        transform.collider = collider

        return [stats, sprite, transform, collider, state, duration, drops];
    }

    #addDrops() {
        const dropList = [generateItem('item_amber')];
        if (Math.random() < 0.25) dropList.push(generateItem('item_amber'));
        if (Math.random() < 0.25) dropList.push(generateItem('item_amber'));
        return dropList;
    }


    update (target, projectileFactory) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        const interval = 40;

        if (distance > BLOCKSIZE * 20) {
            // if (switchInterval(state.elapsedTime, interval/2)) {
            //     transform.velocityX = switchInterval(state.elapsedTime, interval) ? speed : -speed;
            // } else {
            //    transform.velocityX = 0;
            // }
            transform.velocityX = 0;
            transform.velocityY = 0;
        } else {
            transform.velocityX = dVector.x * speed;
            transform.velocityY = dVector.y * speed;
        }

        if ((distance <= BLOCKSIZE * 10 || collider.attackCollision)
                && state.attackTime > 2.5 && !checkCollision(collider, target)) {
            projectileFactory.entityShoot('electroball', target.center, origin)
            state.attackTime = 0;
        }
    }
}
