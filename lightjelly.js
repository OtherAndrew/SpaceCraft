class LightJelly {
    constructor(game) {
        //this.game = game;
        this.speed = 25; //base travel speed 25
        this.x = 0;
        this.y = 0;
        this.face = 0;  //0 face right, 1 face left

        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/lightjelly25f.png");
        this.animations = []
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations.push(new Animator(this.spritesheet, 0,3,52, 67, 6, .08, 1.5));
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
        this.animations[0].drawFrame(this.game.clockTick, ctx, this.x ,this.y, 1);

        //tinting effect
        /*
        var imgData = ctx.getImageData(this.x, this.y, this.spritesheet.width, this.spritesheet.height);

        // Loop through all the pixels
        for (var i = 0; i < imgData.data.length; i += 4) {
            // Get the red, green, and blue values
            var red = imgData.data[i];
            var green = imgData.data[i + 1];
            var blue = imgData.data[i + 2];

            // Apply the tint color
            imgData.data[i] = red * 0.5; // e.g. 50% red
            imgData.data[i + 1] = green * 1; // e.g. 50% green
            imgData.data[i + 2] = blue * 1; // e.g. 50% blue
        }

        // Put the image data back on the canvas
        ctx.putImageData(imgData, this.x, this.y);

         */
    }
}