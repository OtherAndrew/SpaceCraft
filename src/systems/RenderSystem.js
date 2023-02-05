// Draws entities that have sprites
class RenderSystem {
    constructor(entities) {
        this.entities = entities
    }

    draw(ctx, camera) {
        const drawables = this.entities.filter(e => e.isDrawable)
        drawables.forEach(e => {
            if(e.components.transform && e.components.sprite) {
                let sprite = e.components.sprite
                let xSpeed = camera.x
                let ySpeed = camera.y
                if(e.tag === 'background_0') {
                    xSpeed = camera.x * BACKGROUND_SCROLLING_SPEED_0
                } else if(e.tag === 'background_1') {
                    xSpeed = camera.x * BACKGROUND_SCROLLING_SPEED_1
                }else if(e.tag === 'background_2') {
                    xSpeed = camera.x * BACKGROUND_SCROLLING_SPEED_2
                }else if(e.tag === 'background_3') {
                    xSpeed = camera.x * BACKGROUND_SCROLLING_SPEED_3
                }else if(e.tag === 'background_4') {
                    xSpeed = camera.x * BACKGROUND_SCROLLING_SPEED_4
                }else if(e.tag === 'background_5') {
                    xSpeed = camera.x * BACKGROUND_SCROLLING_SPEED_5
                }

                try {
                    ctx.drawImage(
                        sprite.sprite,
                        sprite.currentFrame * (sprite.sWidth + sprite.padding),
                        sprite.frameY * (sprite.sHeight + sprite.padding),
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
        })

    }

    /**
     * Updates sprite if animated.
     * @param {number} tick time length
     */
    update(tick) {
        const drawables = this.entities.filter(e => e.isDrawable)
        drawables.forEach(e => {
            const s = e.components.sprite;
            if (s.lastFrameX !== s.firstFrameX) { // has animations
                if (s.elapsedTime >= s.frameDuration) {
                    if (s.currentFrame === s.lastFrameX) { // reset frame
                        s.currentFrame = s.firstFrameX;
                    } else {
                        s.currentFrame++;
                    }
                    s.elapsedTime = 0;
                } else {
                    s.elapsedTime += tick;
                }
            }
        });
    };
}