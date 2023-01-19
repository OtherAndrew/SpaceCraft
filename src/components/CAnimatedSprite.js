/**
 * Holds animations for an entity.
 *
 * @author Andrew Nguyen
 * @version 1/18/23
 */

/**
 * Initializes Animation Set
 * @param {ImageBitmap} spriteSheet The sprite sheet to use
 * @param {number} width            Default sprite width
 * @param {number} height           Default sprite height
 * @param {number} fps              Frames per second
 * @returns {CAnimationSet}         This animation set
 * @constructor
 */
const CAnimatedSprite = function CAnimatedSprite(spriteSheet, width, height, fps = 60) {
    Object.assign(this, { spriteSheet, width, height, fps });
    this.animations = [];
    return this;
};
CAnimatedSprite.prototype.name = 'animatedSprite';

    /**
     * Adds animation to animated sprite component
     * @param state                Corresponding state for animation
     * @param direction            Direction the sprite is facing
     * @param {number} startFrameX X pixel position of animation start frame
     * @param {number} startFrameY Y pixel position of animation start frame
     * @param {number} frameCount  Number of frames of animation
     * @param {number} width       Width of sprite (if different from default width)
     * @param {number} height      Height of sprite (if different from default height)
     * @returns {Animation}        Animation object from parameters
     */
    addAnimation(state, direction, startFrameX, startFrameY, frameCount,
                 width = this.width, height = this.height) {
        const animation = new Animation({
            spriteSheet: this.spriteSheet,
            width: width,
            height: height,
            frameCount: frameCount,
            startFrameX: startFrameX,
            startFrameY: startFrameY,
            fps: this.fps
        });
        this.animations[state][direction] = animation;
        return animation;
    };
