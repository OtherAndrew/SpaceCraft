class Creeperilla {
    constructor(game) {
        //this.game = game;
        this.speed = 135; //base travel speed 25
        this.x = 600;
        this.y = 0;
        this.face = 0;  //0 face right, 1 face left

        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/creeperilla25f.png");
        this.animations = []
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations.push(new Animator(this.spritesheet, 1,38,38, 25, 4, .05, 2));
        this.animations.push(new Animator(this.spritesheet, 1,6,38, 25, 4, .05, 2));

        //this.animations.push(new Animator(this.spritesheet, 0,33,64, 20, 4, .06, 2));
    }

    update() {
        if (this.face == 0) {
            this.x += this.speed * this.game.clockTick;
        } else {
            this.x -= this.speed * this.game.clockTick;
        }
    }
    draw(ctx) {
        //use this.face to switch side.

        if (this.face == 0) {
            this.animations[0].drawFrame(this.game.clockTick, ctx, this.x ,this.y, 2.5);
        } else {
            this.animations[1].drawFrame(this.game.clockTick, ctx, this.x,this.y, 2.5);
        }
    }
}