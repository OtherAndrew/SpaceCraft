
class Lightjelly {
    /**
     * Initializes lightJelly (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of starting frame
     * @param {number} props.y       Y position of the starting frame
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'lightjelly mob enemy';
        this.name = 'lightjelly';
        this.components = this.#buildComponents(props);
        return this;
    };
    #buildComponents(props) {
        const stats = new CStats({
            speed: 1
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(LIGHTJELLY_PATH),
            sWidth: 168,
            sHeight: 219,
            scale: 0.5,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 5,
            fps: 12,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.dWidth,
            height: sprite.dHeight
        });
        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;

        return [stats, sprite, transform, collider, state];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,7));
        // aMap.set('death', new AnimationProps(0, 0,15));

    };

    update(tick, targetX, targetY) {
        const velocity = this.components["stats"].speed;

        const x = this.components.transform.x;
        const y = this.components.transform.y;
        const transform = this.components.transform;

        const distance = getDistance2(x, y, targetX, targetY);
        const angle = getAngle2(x, y, targetX, targetY);
        if (distance <= 500) {
            // transform.velocityX = Math.cos(angle) * velocity;
            // transform.velocityY = Math.sin(angle) * velocity;
            transform.velocityY = targetY < y ? -velocity : velocity;
            transform.velocityX = targetX < x ? -velocity : velocity;
        } else {
            transform.velocityX = 0;
            transform.velocityY = 0;
        }
        //adding tint
    }

}
