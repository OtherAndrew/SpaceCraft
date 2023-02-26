// Draws entities that have sprites
class RenderSystem {
    constructor(entities) {
        this.entities = entities
    }

    draw(ctx, camera) {
        const drawables = this.entities.filter(e => e.isDrawable)
        drawables.forEach(e => {
            if (e.components.transform && e.components.sprite) {
                let sprite = e.components.sprite
                let ySpeed = camera.y
                let xSpeed = camera.x
                if (e.tag.toUpperCase() in BG_SCROLL) xSpeed *= BG_SCROLL[e.tag.toUpperCase()]

                let destX = e.components.transform.x - xSpeed;
                let destY = e.components.transform.y - ySpeed;
                if (e.tag.includes('tile') && !e.components['boxCollider']) {
                    ctx.drawImage(
                        sprite.sprite,
                        sprite.currentFrame * (sprite.sWidth + sprite.padding),
                        sprite.frameY * (sprite.sHeight + sprite.padding),
                        sprite.sWidth,
                        sprite.sHeight,
                        destX,
                        destY,
                        sprite.dWidth,
                        sprite.dHeight
                    )
                    ctx.save();
                    ctx.globalAlpha = 0.90;
                    ctx.drawImage(ASSET_MANAGER.cache[OVERLAY_PATH.OBSCURED], destX, destY)
                    ctx.restore();
                } else {
                    ctx.drawImage(
                        sprite.sprite,
                        sprite.currentFrame * (sprite.sWidth + sprite.padding),
                        sprite.frameY * (sprite.sHeight + sprite.padding),
                        sprite.sWidth,
                        sprite.sHeight,
                        destX,
                        destY,
                        sprite.dWidth,
                        sprite.dHeight
                    )
                }

                destX += sprite.dWidth / 2 - 25;

                if (!e.tag.includes('tile') && e.components.stats && e.components.stats.isDamaged)
                    drawHealthbar(ctx, e, destX, destY, 50, 5);
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
                    if (s.currentFrame === s.lastFrameX && s.loop) { // reset frame
                        s.currentFrame = s.firstFrameX;
                    } else {
                        s.currentFrame = clamp(s.currentFrame + 1, s.firstFrameX, s.lastFrameX);
                    }
                    s.elapsedTime = 0;
                } else {
                    s.elapsedTime += tick;
                }
            }
        });
    };
}