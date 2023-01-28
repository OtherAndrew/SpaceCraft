/**
 * Stores behavior data for some entity
 * @author Andrew Nguyen
 * @version 1/28/23
 */

class BehaviorProps {
    /**
     * Initializes BehaviorProps object.
     * @param {number} velocityX
     */
    constructor(velocityX = 0) {
        this.name = 'behaviorProps';
        Object.assign(this, { velocityX });
    }
}