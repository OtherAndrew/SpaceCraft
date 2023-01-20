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
                            sprite.startFrameX * sprite.width,
                            sprite.frameY * sprite.height,
                            sprite.width,
                            sprite.height,
                            e.components.transform.x - xSpeed,
                            e.components.transform.y - ySpeed,
                            sprite.drawWidth,
                            sprite.drawHeight
                        )
                    } catch (error) {
                        console.log(e, 'failed to draw.')
                    }
                }
            }
        })

    }

    update() {
        this.entities.forEach(e => {
            let sprite = e.components.sprite;
            if (sprite.lastFrameX > 1) {
                console.log("frame: " + sprite.startFrameX);
                if (sprite.startFrameX >= sprite.lastFrameX - 1) {
                    sprite.frameX = 0;
                } else {
                    sprite.startFrameX++;
                }
            }
        });
    };
}