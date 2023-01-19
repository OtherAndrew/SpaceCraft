/**
 * Stores animation data for some sprite animation
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/19/23
 */
class Animation {
    /**
     * Initializes Animation object.
     * @param {number} frameX     X position of start frame (not pixel position!)
     * @param {number} frameY     Y position of start frame (not pixel position!)
     * @param {number} frameCount Number of frames of animation.
     */
    constructor(frameX, frameY, frameCount) {
        Object.assign(this, { frameX, frameY, frameCount });
    };
}