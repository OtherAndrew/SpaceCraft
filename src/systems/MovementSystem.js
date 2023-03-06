/**
 * Updates movement for all movable entities.
 *
 * @author Andrew Nguyen
 * @version 2/8/23
 */
class MovementSystem {
    constructor(entities, player) {
        this.entities = entities;
        this.player = player;
        this.movables = [];
        this.refresh();
    }

    /**
     * Refreshes internal list of movable entities.
     * Call this before updating.
     */
    refresh() {
        this.movables = [];
        for (let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i];
            if (e.isDrawable && this.#canMove(e)) this.movables.push(e);
        }
    }

    /**
     * Determines if entity can move.
     * @param {Entity} e The entity
     * @return {boolean} If the entity can move.
     */
    #canMove(e) {
        return (e.tag.includes('mob') || e.tag.includes("npc") || e.name === 'projectile')
               && e.name !== 'player';
    }

    /**
     * Update X position.
     * @param tick Time slice.
     */
    updateX(tick) {
        // Player needs to be updated separately from other mobs otherwise movement is jittery.
        this.#moveEntityX(this.player, tick);
        this.movables.forEach(e => this.#moveEntityX(e, tick));
    }

    /**
     * Update Y position.
     * @param tick Time slice
     */
    updateY(tick) {
        // Player needs to be updated separately from other mobs otherwise movement is jittery.
        this.#moveEntityY(this.player, tick);
        this.movables.forEach(e => this.#moveEntityY(e, tick));
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
        t.x += t.velocityX * BLOCKSIZE * 2 * tick;
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
        if (t.hasGravity) t.velocityY += GRAVITY;
        t.velocityY = clamp(t.velocityY, -t.maxVelocityY, t.maxVelocityY);
        t.y += t.velocityY * BLOCKSIZE * 2 * tick;
        if (t.collider) t.collider.setPosition(t.x, t.y);
        if (t.velocityY >= t.maxVelocityY) t.fallDamageTime += tick;
    }
}