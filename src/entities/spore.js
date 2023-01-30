
class Spore {
    /**
     * Initializes Spore (enemy)
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
        this.tag = 'spore';
        this.name = 'spore';
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
            lastFrameX: 7,
            fps: 4,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            velocityX: 0,
            velocityY: 0,
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
        // aMap.set('idleL', new AnimationProps(1, 0));
        // aMap.set('walkR', new AnimationProps(0, 1, 11));
        // aMap.set('walkL', new AnimationProps(0, 2, 11));
        // aMap.set('jumpR', new AnimationProps(0, 1));
        // aMap.set('jumpL', new AnimationProps(0, 2));
        // aMap.set('flyR', new AnimationProps(0, 1));
        // aMap.set('flyL', new AnimationProps(0, 2));
        // aMap.set('crouchR', new AnimationProps(5, 1));
        // aMap.set('crouchL', new AnimationProps(5, 2));
    };

}

// class Spore {
//     constructor(game) {
//         //this.game = game;
//         this.speed = 0; //base travel speed 25
//         this.x = 0;
//         this.y = 0;
//         this.face = 0;  //0 face right, 1 face left
//
//         Object.assign(this, {game});
//         this.spritesheet = ASSET_MANAGER.getAsset("./sprites/spore25f.png");
//         this.animations = []
//         //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
//         this.animations.push(new Animator(this.spritesheet, 1,4,34, 46, 1, .06, 2));
//
//     }
//
//     update() {
//         this.x += this.speed * this.game.clockTick;
//
//     }
//     draw(ctx) {
//         //use this.face to switch side.
//         this.animations[0].drawFrame(this.game.clockTick, ctx, this.x ,this.y, 1);
//
//
//     }
// }