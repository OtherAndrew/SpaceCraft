
class Spore {
    /**
     * Initializes Spore (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'spore mob';
        this.name = 'spore';
        this.components = this.#buildComponents(props);
        return this;
    };
    #buildComponents(props) {
        const stats = new CStats({

        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(CHAR_PATH.SPORE),
            sWidth: 138,
            sHeight: 196,
            scale: 0.5,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 7,
            fps: 4,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.dWidth,
            height: sprite.dHeight
        });

        this.#addAnimations(sprite);
        this.#addBehaviors(transform);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        state.transform = transform;
        return [stats, sprite, transform, collider, state];
    }

    update(tick, targetX, targetY) {
        this.components.state.setState('idleR');
        // this.components.transform.update(tick);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,7));
    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, 0));
    }

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