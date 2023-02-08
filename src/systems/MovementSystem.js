/**
 * Movement updating for non-player entities.
 */
class MovementSystem {
    constructor(entities, player) {
        this.entities = entities
        this.player = player;
    }

    /**
     * Update player X position.
     * Player needs to be updated separately from other mobs otherwise movement is jittery.
     * @param tick
     */
    updatePlayerX(tick) {
        this.#moveEntityX(this.player, tick)
    }

    /**
     * Update player Y position.
     * Player needs to be updated separately from other mobs otherwise movement is jittery.
     * @param tick
     */
    updatePlayerY(tick) {
        this.#moveEntityY(this.player, tick)
    }

    /**
     * Update mob X position.
     * @param tick
     */
    updateMobX(tick) {
        const mobs = this.entities.filter(e => e.isDrawable && e.tag.includes('mob'));
        mobs.forEach(e => this.#moveEntityX(e, tick));
    };

    /**
     * Update mob Y position.
     * @param tick
     */
    updateMobY(tick) {
        const mobs = this.entities.filter(e => e.isDrawable && e.tag.includes('mob'));
        mobs.forEach(e => this.#moveEntityY(e, tick));
    };

    /**
     * Update entity X position.
     * @param entity The entity.
     * @param tick   Time slice.
     */
    #moveEntityX(entity, tick) {
        const t = entity.components.transform;
        t.last.x = t.x;
        t.velocityX = clamp(t.velocityX, -t.maxVelocityX, t.maxVelocityX);
        t.x += t.velocityX * tick * 60;
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
        t.y += t.velocityY * tick * 60;
        if (t.collider) t.collider.setPosition(t.x, t.y);
    }
}