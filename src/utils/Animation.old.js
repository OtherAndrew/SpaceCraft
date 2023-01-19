/**
 * Manages an animation for an entity
 *
 * @author Andrew Nguyen
 * @version 1/18/23
 */
class AnimationOld {

    /**
     * Initializes AnimationOld
     * @param {ImageBitmap} spriteSheet The sprite sheet to use
     * @param {number} width            The sprite width
     * @param {number} height           The sprite height
     * @param {number} frameCount       The number of frames in the animation
     * @param {number} startFrameX      The X pixel position of the start frame on the sprite sheet, 0 by default
     * @param {number} startFrameY      The Y pixel position of the start frame on the sprite sheet, 0 by default
     * @param {boolean} loop            If the animation should loop, false by default
     * @param {number} fps              Frames per second, 60 by default
     * @return {AnimationOld}              This AnimationOld object.
     */
    constructor({ spriteSheet, width, height, frameCount,
                startFrameX = 0, startFrameY = 0, loop = false, fps = 60}) {
        Object.assign(this, { spriteSheet, width, height, startFrameX, startFrameY, loop });
        this.frameDuration = 1 / fps;
        this.elapsedTime = 0;
        this.totalTime = frameCount * this.frameDuration;
        return this;
    };

    /**
     * Draws animation frame based on tick
     * @param {number} tick                  Time segment
     * @param {CanvasRenderingContext2D} ctx Context to render frame on
     * @param {number} x                     X position to place frame
     * @param {number} y                     Y position to place frame
     * @param {number} scale                 Scale factor to apply to frame, 1 by default
     */
    drawFrame(tick, ctx, x, y, scale = 1) {
        this.elapsedTime += tick;
        if (this.elapsedTime > this.totalTime) this.elapsedTime -= this.totalTime;
        const frame = this.currentFrame();

        ctx.drawImage(this.spriteSheet,
            this.startFrameX + this.width * frame, this.startFrameY,
            this.width, this.height,
            x, y,
            this.width * scale, this.height * scale);
    };

    /**
     * Determines current frame based on elapsed time
     * @returns {number} The current frame number
     */
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    /**
     * Determines if animation has completed.
     * @returns {boolean} if animation has completed
     */
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
}
