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
            const t = e.components.transform;
            t.lastX = t.x;
            t.lastY = t.y;
            t.velocityY = clamp(t.velocityY + t.gravity, -t.maxVelocityY, t.maxVelocityY);
            t.velocityX = clamp(t.velocityX, -t.maxVelocityX, t.maxVelocityX);
            t.x += t.velocityX * tick * 60;
            t.y += t.velocityY * tick * 60;
            if (t.collider) t.collider.update(t.x, t.y);
        });
    };
}