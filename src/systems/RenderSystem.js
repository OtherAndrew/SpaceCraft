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
                let ySpeed = camera.y
                let xSpeed = camera.x
                // let index = e.tag.slice(-1)
                // if (!isNaN(index)) xSpeed *= BG_SCROLL['SPEED_' + index]
                
                // ALTERNATELY YOU CAN HAVE BG_SCROLL USING SAME FIELD NAMES
                // REFER TO CONSTANTS.JS 180
                if(e.tag.toUpperCase() in BG_SCROLL) xSpeed *= BG_SCROLL[e.tag.toUpperCase()]

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
            }
        })

    }

    /**
     * Updates sprite if animated.
     * @param {number} tick time length
     */
    update(tick) {
        const drawables = this.entities.filter(e => e.isDrawable && e.components.sprite)
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