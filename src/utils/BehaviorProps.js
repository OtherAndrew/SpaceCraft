/**
 * Stores behavior data for some entity
 * @author Andrew Nguyen
 * @version 1/28/23
 */

class BehaviorProps {
    /**
     * Initializes BehaviorProps object.
     * @param {number} velocityX
     * @param {number} velocityY
     */
    constructor({velocityX, velocityY}) {
        this.name = 'behaviorProps';
        Object.assign(this, { velocityX, velocityY });
        return this;
    }
}