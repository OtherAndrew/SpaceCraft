/**
 * Stores behavior data for some entity
 * @author Andrew Nguyen
 * @version 1/28/23
 * @deprecated
 */

class BehaviorProps {
    /**
     * Initializes BehaviorProps object.
     * @param {number | null} velocityX
     * @param {number | null} velocityY
     */
    constructor(velocityX, velocityY) {
        this.name = 'behaviorProps';
        Object.assign(this, { velocityX, velocityY });
        return this;
    }
}