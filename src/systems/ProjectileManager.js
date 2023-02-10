class ProjectileManager {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    shoot(damage, angle, speed, hasGravity, originEntity) {
        const oTransform = originEntity.components["transform"];
        const p = new Projectile({
            damage: damage,
            angle: angle,
            speed: speed,
            x: oTransform.x,
            y: oTransform.y,
            originVX: oTransform.velocityX,
            originVY: oTransform.velocityY,
            hasGravity: hasGravity
        });
        return this.entityManager.addEntity(p);
    }
}