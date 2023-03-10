// Draws entities that have sprites
class RenderSystem {

    draw(ctx, camera, drawables) {
        let length = drawables.length;
        for (let i = 0; i < length; i++) {
            let e = drawables[i];
            if (e.components.transform && e.components.sprite) {
                let sprite = e.components.sprite
                let ySpeed = camera.y
                let xSpeed = camera.x
                if (e.tag.toUpperCase() in BG_SCROLL) xSpeed *= BG_SCROLL[e.tag.toUpperCase()]

                let destX = e.components.transform.x - xSpeed;
                let destY = e.components.transform.y - ySpeed;
                if (e.tag.includes('tile')) {
                    if (!e.visCode) {
                        ctx.drawImage(ASSET_MANAGER.cache[OVERLAY_PATH.OBSCURED], destX, destY)
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
                        if (OVERLAY_PATH[e.visCode])
                            ctx.drawImage(ASSET_MANAGER.cache[OVERLAY_PATH[e.visCode]], destX, destY)
                    }
                } else {
                    try {
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
                    } catch (error) {
                        console.log(e, 'Failed to draw: ' + error)
                    }
                    if (e.components['stats'] && e.components['stats'].isDamaged)
                        drawHealthbar(ctx, e, destX += sprite.dWidth / 2 - 25, destY, 50, 5);
                }
            }
        }
    }

    /**
     * Updates sprite if animated.
     * @param tick time length
     * @param drawables list of drawable entities
     */
    update(tick, drawables) {
        let length = drawables.length;
        for (let i = 0; i < length; i++) {
            const s = drawables[i].components.sprite;
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
        }
    };
}