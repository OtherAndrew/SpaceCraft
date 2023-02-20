
class Wasp {
    /**
     * Initializes
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of starting frame
     * @param {number} props.y       Y position of the starting frame
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob';
        this.name = 'wasp';
        this.components = this.#buildComponents(props);
    };
    #buildComponents(props) {
        const stats = new CStats({
            speed: 3,
            maxHealth: 50
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.WASP],
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
        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;

        return [stats, sprite, transform, collider, state];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 1,3));
        aMap.set('idleL', new AnimationProps(0, 0,3));
        aMap.set('flyR', new AnimationProps(0, 1,3));
        aMap.set('flyL', new AnimationProps(0, 0,3));

        // aMap.set('death', new AnimationProps(0, 0,15));

    };

    update(target, projectileFactory) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const velocity = this.components["stats"].speed;
        const transform = this.components.transform;
        const distance = getDistance(origin, target);
        if (distance <= 870) {
            transform.velocityY = target.center.y < origin.y ? -velocity : velocity;
            transform.velocityX = target.center.x < origin.x ? -velocity : velocity;
        } else {
            transform.velocityX = 0;
            transform.velocityY = 0;
        }
        this.components.state.setState(target.center.x < origin.x ? "flyL" : "flyR");
        if (checkCollision(collider, target)) {
            this.components['stats'].currentHealth = 0;
            projectileFactory.detonate('enemy_explosion', origin);
        }
    }
}
