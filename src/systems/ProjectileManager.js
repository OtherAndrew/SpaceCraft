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
        this.tag = 'projectile';
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
            scale: BLOCKSIZE * 0.5 / 16
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: props.hasGravity || false,
            rotation: props.angle,
            velocityX: Math.cos(props.angle) * props.speed + props.originVX || 0,
            velocityY: Math.sin(props.angle) * props.speed + props.originVY || 0
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
        transform.collider = collider
        return [stats, sprite, transform, collider];
    }
}

//damage, angle, speed, hasGravity