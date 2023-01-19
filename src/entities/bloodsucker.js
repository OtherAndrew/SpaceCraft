class BloodSucker {
    constructor(game) {
        //this.game = game;
        this.speed = 70; //base travel speed 25
        this.x = 0;
        this.y = 0;
        this.face = 1;  //0 face right, 1 face left

        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bloodsucker25f.png");
        this.animations = []
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations.push(new Animator(this.spritesheet, 1,5,81, 84, 5, .06, 2));
        //this.animations.push(new Animator(this.spritesheet, 0,33,64, 20, 4, .06, 2));
    }

    update() {
        if (this.face == 1) {
            this.x += this.speed * this.game.clockTick;
        } else {
            this.x -= this.speed * this.game.clockTick;
        }
    }
    draw(ctx) {
        let offset = 81;
        if (this.face == 0) {
            this.animations[0].drawFrame(this.game.clockTick, ctx, this.x,this.y, 1);
        } else {
            this.speed;
            ctx.scale(-1,1);
            this.animations[0].drawFrame(this.game.clockTick, ctx, -this.x -offset,this.y, 1);
        }
        //use this.face to switch side.
        //this.animations[0].drawFrame(this.game.clockTick, ctx, this.x ,this.y, 1);

        //this.animations[1].drawFrame(this.game.clockTick, ctx, this.x ,this.y+50, 1);

    }
}