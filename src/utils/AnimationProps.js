/**
 * Stores animation data for some sprite animation
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/19/23
 */

class AnimationProps {
    /**
     * Initializes AnimationProps object.
     * @param {number} firstFrameX X position of first frame (not pixel position!)
     * @param {number} frameY      Y position of start frame (not pixel position!)
     * @param {number} lastFrameX  X position of last frame (not pixel position!), firstFrameX by default
     */
    constructor(firstFrameX, frameY , lastFrameX = firstFrameX) {
        this.name = 'animationProps';
        Object.assign(this, { firstFrameX, frameY, lastFrameX });
    }
}