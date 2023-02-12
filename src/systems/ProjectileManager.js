class ProjectileManager {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    shoot(type, targetPos, originEntity) {
        const midPoint = {
            x: WIDTH * .5,
            y: HEIGHT * .5
        }
        const oStats = originEntity.components['stats'];
        // const oTransform = originEntity.components["transform"];
        const oCollider = originEntity.components["boxCollider"];
        const directionVector = normalize(midPoint, targetPos)
        const projectileOrigin = {
            x: oCollider.x + oCollider.width / 2,
            y: oCollider.y + oCollider.height / 3
        }

        //switch bullet, fire, spore, arcing, etc.
        let p;
        switch (type) {
            case 'bullet':
                p = new Projectile({
                    tag: 'bullet',
                    damage: oStats.damage,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 5,
                    hasGravity: false
                });
                break;
            case 'super':
                p = new Projectile({
                    tag: 'superbullet',
                    damage: 9001,
                    speed: BLOCKSIZE * 0.1,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 5,
                    hasGravity: false
                });
                break;
            case 'fire':
                p = new Projectile({
                    tag: 'firebullet',
                    damage: 0.15,
                    speed: BLOCKSIZE * 0.1,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 1.5,
                    hasGravity: false,
                    sWidth: 8,
                    sHeight: 12
                });
                break;
            default: console.log(`Invalid projectile type: ${type}.`);
        }


        return this.entityManager.addEntity(p);
    }
}

class Projectile {

    /**
     *
     * @param {Object} props
     * @param {string} props.tag
     * @param {number} props.damage
     * @param {number} props.speed
     * @param {{number, number}} props.dVector
     * @param {{number, number}} props.origin
     * @param {number} props.duration
     * @param {boolean} props.hasGravity
     * @return {Projectile}
     */
    constructor(props) {
        this.tag = props.tag;
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
        const sprite = props.tag.includes('fire') ? this.fireSprite() : this.bulletSprite(props);
        const transform = new CTransform({
            x: props.origin.x - sprite.dWidth / 2,
            y: props.origin.y - sprite.dHeight / 2,
            hasGravity: props.hasGravity,
            // rotation: props.angle,
            // velocityX: props.velocityX,
            // velocityY: props.velocityY,
            velocityX: props.dVector.x * stats.speed,
            velocityY: props.dVector.y * stats.speed,
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

    bulletSprite(props) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(MISC_PATH.PROJECTILE_ORB),
            sWidth: 16,
            sHeight: 16,
            scale: props.tag.includes('superbullet') ? 2.5 : 1,
            firstFrameX: props.tag.includes('superbullet') ? 1 : 8
        });
    }

    fireSprite() {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(MISC_PATH.PROJECTILE_FIRE),
            sWidth: 8,
            sHeight: 12,
            scale: 2,
            firstFrameX: 0,
            lastFrameX: 4,
            fps: 30
        })
    }
}

//damage, angle, speed, hasGravity