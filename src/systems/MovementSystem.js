/**
 * Movement updating for non-player entities.
 */
class MovementSystem {
    constructor(entities) {
        this.entities = entities
    }

    update(tick) {
        const mobs = this.entities.filter(e => e.isDrawable && e.tag.includes('mob'));
        mobs.forEach(e => {
            e.components.transform.update(tick);
        });
    };
}