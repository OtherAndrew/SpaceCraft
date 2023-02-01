
class Lightjelly {
    /**
     * Initializes lightJelly (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {Image} props.sprite   enemy sprite sheet
     * @param {number} props.x       X position of starting frame
     * @param {number} props.y       Y position of the starting frame
     * @param {number} props.sWidth  frame width
     * @param {number} props.sHeight frame height
     * @param {number} props.scale   frame scale
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'lightjelly';
        this.name = 'lightjelly';
        this.components = this.#buildComponents(props);
        return this;
    };
    #buildComponents(props) {
        const sprite = new CSprite({
            sprite: props.sprite,
            sWidth: props.sWidth,
            sHeight: props.sHeight,
            scale: props.scale,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 5,
            fps: 12,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            velocityX: 1,
            velocityY: 1,
            maxVelocityX: 0,
            maxVelocityY: 0
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: props.sWidth * props.scale,
            height: props.sHeight * props.scale
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;

        return [sprite, transform, collider, new CRigidBody(), state];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,7));

    };

}
