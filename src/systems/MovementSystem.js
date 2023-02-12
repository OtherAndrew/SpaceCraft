/**
 * Updates movement for all movable entities.
 *
 * @author Andrew Nguyen
 * @version 2/8/23
 */
class MovementSystem {
    constructor(entities, player) {
        this.entities = entities
        this.player = player;
    }

    /**
     * Update X position.
     * @param tick
     */
    updateX(tick) {
        // Player needs to be updated separately from other mobs otherwise movement is jittery.
        this.#moveEntityX(this.player, tick);
        const mobs = this.entities.filter(e => e.isDrawable
            && (e.tag.includes('mob') || e.tag.includes('bullet')));
        mobs.forEach(e => this.#moveEntityX(e, tick));
    }

    /**
     * Update Y position.
     * @param tick
     */
    updateY(tick) {
        // Player needs to be updated separately from other mobs otherwise movement is jittery.
        this.#moveEntityY(this.player, tick);
        const mobs = this.entities.filter(e => e.isDrawable
            && (e.tag.includes('mob') || e.tag.includes('bullet')));
        mobs.forEach(e => this.#moveEntityY(e, tick));
    }

    /**
     * Update entity X position.
     * @param entity The entity.
     * @param tick   Time slice.
     */
    #moveEntityX(entity, tick) {
        const t = entity.components.transform;
        t.last.x = t.x;
        t.velocityX = clamp(t.velocityX, -t.maxVelocityX, t.maxVelocityX);
        t.x += t.velocityX * tick / tick;
        if (t.collider) t.collider.setPosition(t.x, t.y);
    }

    /**
     * Update entity Y position.
     * @param entity The entity.
     * @param tick   Time slice.
     */
    #moveEntityY(entity, tick) {
        const t = entity.components.transform;
        t.last.y = t.y;
        t.velocityY = clamp(t.velocityY + t.gravity, -t.maxVelocityY, t.maxVelocityY);
        t.y += t.velocityY * tick / tick;
        if (t.collider) t.collider.setPosition(t.x, t.y);
    }
}