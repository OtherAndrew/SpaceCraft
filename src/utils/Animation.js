/**
 * Stores animation data for some sprite animation
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 * @version 1/19/23
 */

/**
 * Initializes Animation object.
 * @param {number} firstFrameX X position of first frame (not pixel position!)
 * @param {number} lastFrameX  X position of last frame (not pixel position!), firstFrameX by default
 * @param {number} frameY      Y position of start frame (not pixel position!)
 */
const Animation = function({firstFrameX, lastFrameX = firstFrameX, frameY }) {
    Object.assign(this, { firstFrameX, lastFrameX, frameY });
};
Animation.prototype.name = 'animation';