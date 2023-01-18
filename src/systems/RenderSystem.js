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
                    try {
                        ctx.drawImage(
                            sprite.sprite,
                            sprite.frameX * sprite.spriteWidth,
                            sprite.frameY * sprite.spriteHeight,
                            sprite.spriteWidth,
                            sprite.spriteHeight,
                            e.components.transform.x - camera.x,
                            e.components.transform.y - camera.y,
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
            let sprite = e.components.sprite
            if(sprite.frameX >= sprite.maxFrames) {
                sprite.frameX = 0
            } else {
                sprite.frameX++
            }
        })

    }
}