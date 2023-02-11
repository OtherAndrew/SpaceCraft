class ProjectileManager {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    shoot(targetPos, originEntity) {
        const oStats = originEntity.components['stats'];
        const oTransform = originEntity.components["transform"];
        const oCollider = originEntity.components["boxCollider"]
        const angle = getAngle2(oTransform.x, oTransform.y, targetPos.x, targetPos.y)
        console.log(angle)
        const p = new Projectile({
            damage: oStats.damage,
            angle: angle,
            speed: BLOCKSIZE / 6,
            x: oCollider.x + oCollider.width / 2 - 8,
            y: oCollider.y + oCollider.height / 2 - 8,
            originVX: oTransform.velocityX,
            originVY: oTransform.velocityY,
            hasGravity: false
        });
        return this.entityManager.addEntity(p);
    }
}

class Projectile {

    /**
     *
     * @param {Object} props
     * @param {number} props.damage
     * @param {number} props.angle
     * @param {number} props.speed
     * @param {number} props.originVX
     * @param {number} props.originVY
     * @param {boolean} props.hasGravity
     * @return {Projectile}
     */
    constructor(props) {
        this.tag = 'bullet';
        this.name = 'projectile';
        this.components = this.#buildComponents(props);
        return this;
    }

    #buildComponents(props) {
        const stats = new CStats({
            damage: props.damage,
            speed: props.speed,
            invincible: true
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_ORB_PATH),
            sWidth: 16,
            sHeight: 16,
            scale: 1,
            firstFrameX: 8
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: props.hasGravity || false,
            // rotation: props.angle,
            velocityX: Math.cos(props.angle) * props.speed + props.originVX,
            velocityY: Math.sin(props.angle) * props.speed + props.originVY
        });
        // const cWidth = BLOCKSIZE * .25;
        // const cHeight = BLOCKSIZE * .25
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.dWidth,
            height: sprite.dHeight,
            // xOffset: (sprite.dWidth - cWidth) / 2,
            // yOffset: (sprite.dHeight - cHeight) / 2,
        });
        const duration = new CDuration(5);
        transform.collider = collider
        return [stats, sprite, transform, collider, duration];
    }
}

//damage, angle, speed, hasGravity