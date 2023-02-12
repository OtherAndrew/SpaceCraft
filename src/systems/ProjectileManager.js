class ProjectileManager {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    shoot(targetPos, originEntity) {
        const midPoint = {
            x: WIDTH * .5,
            y: HEIGHT * .5
        }
        const oStats = originEntity.components['stats'];
        const oTransform = originEntity.components["transform"];
        const oCollider = originEntity.components["boxCollider"]

        const directionVector = normalize(midPoint, targetPos)
        const speed = BLOCKSIZE / 2
        const projectileVelocity = {
            x: directionVector.x * speed + oTransform.velocityX,
            y: directionVector.y * speed + oTransform.velocityY
        }
        // const vX = directionVector.x * speed + oTransform.velocityX;
        // const vY = directionVector.y * speed + oTransform.velocityY;
        const projectileOrigin = {
            x: oCollider.x + oCollider.width / 2,
            y: oCollider.y + oCollider.height / 2
        }

        //switch bullet, fire, spore, arcing, etc.

        const p = new Projectile({
            damage: oStats.damage,
            x: projectileOrigin.x, // center
            y: projectileOrigin.y, //center
            velocityX: projectileVelocity.x,
            velocityY: projectileVelocity.y,
            hasGravity: false,
            duration: 5
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
            invincible: true
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(MISC_PATH.PROJECTILE_ORB),
            sWidth: 16,
            sHeight: 16,
            scale: 1,
            firstFrameX: 8
        });
        const transform = new CTransform({
            x: props.x - sprite.dWidth / 2,
            y: props.y - sprite.dHeight / 2,
            hasGravity: props.hasGravity,
            // rotation: props.angle,
            velocityX: props.velocityX,
            velocityY: props.velocityY,
            maxVelocityX: 300,
            maxVelocityY: 300,
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
        const duration = new CDuration(props.duration);
        transform.collider = collider
        return [stats, sprite, transform, collider, duration];
    }
}

//damage, angle, speed, hasGravity