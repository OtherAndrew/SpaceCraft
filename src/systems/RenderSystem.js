// Draws entities that have sprites
class RenderSystem {
    constructor(entities) {
        this.entities = entities
    }

    draw(ctx, camera) {
        this.entities.forEach(e => {
            if(e.isDrawable) {
                if(e.components.transform && e.components.sprite) {
                    let sprite = e.components.sprite
                    let xSpeed = camera.x
                    let ySpeed = camera.y
                    if(e.tag === 'background_layer_0') {
                        xSpeed = camera.x * .05
                    } else if(e.tag === 'background_layer_1') {
                        xSpeed = camera.x * .08
                    }

                    try {
                        ctx.drawImage(
                            sprite.sprite,
                            sprite.currentFrame * sprite.sWidth + 1 * sprite.padding,
                            sprite.frameY * sprite.sHeight + 1 * sprite.padding,
                            sprite.sWidth,
                            sprite.sHeight,
                            e.components.transform.x - xSpeed,
                            e.components.transform.y - ySpeed,
                            sprite.dWidth,
                            sprite.dHeight
                        )
                    } catch (error) {
                        console.log(e, 'Failed to draw: ' + error)
                    }
                }
            }
        })

    }

    update(tick) {
        this.entities.forEach(e => {
            let sprite = e.components.sprite;
            if (sprite.lastFrameX !== sprite.firstFrameX) { // has animations
                if (sprite.elapsedTime >= sprite.frameDuration) {

                    sprite.elapsedTime = 0;
                    if (sprite.currentFrame === sprite.lastFrameX) { // reset frame
                        sprite.currentFrame = sprite.firstFrameX;
                    } else {
                        sprite.currentFrame++;
                    }
                } else {
                    sprite.elapsedTime += tick;
                }
            }
        });
    };
}