class ProjectileManager {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    shoot(type, targetPos, originEntity) {
        const midPoint = {
            x: WIDTH * .5,
            y: HEIGHT * .5
        }
        // const oStats = originEntity.components['stats'];
        // const oTransform = originEntity.components["transform"];
        const oCollider = originEntity.components["boxCollider"];
        const directionVector = normalize(midPoint, targetPos)
        const projectileOrigin = {
            x: oCollider.center.x ,//+ directionVector.x * 30,
            // y: oCollider.y + oCollider.height / 3 //+ directionVector.y * 30
            y: oCollider.center.y
        }
        // if (originEntity.tag.includes('player')) {
        //     projectileOrigin.x += directionVector.x * 25
        //     projectileOrigin.y += directionVector.y * 25
        // }

        //switch bullet, fire, spore, arcing, etc.
        let p;
        switch (type) {
            case 'bullet':
                projectileOrigin.x += directionVector.x * 10
                projectileOrigin.y += directionVector.y * 10
                p = new Projectile({
                    tag: 'bullet',
                    sprite: this.bulletSprite(8),
                    damage: 1,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    // 0.5 = (100% center to edge horizontal
                    // 0.375 = (75% center to edge horizontal
                    // 0.25 = (50% center to edge horizontal
                    duration: 0.375,
                    hasGravity: false,
                    spread: 0
                });
                break;
            case 'minigunbullet':
                projectileOrigin.x += directionVector.x * 10
                projectileOrigin.y += directionVector.y * 10
                p = new Projectile({
                    tag: 'bullet',
                    sprite: this.bulletSprite(14),
                    damage: 1,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    // 0.5 = (100% center to edge horizontal
                    // 0.375 = (75% center to edge horizontal
                    // 0.25 = (50% center to edge horizontal
                    duration: 0.5,
                    hasGravity: false,
                    spread: 0.75
                });
                break;
            case 'fire':
                projectileOrigin.x += directionVector.x * 30
                projectileOrigin.y += directionVector.y * 30
                p = new Projectile({
                    tag: 'firebullet',
                    sprite: this.fireSprite(),
                    damage: 0.1,
                    speed: BLOCKSIZE * 0.1,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 1,
                    hasGravity: false,
                    spread: 0.33
                });
                break;
            case 'bomb':
                projectileOrigin.x += directionVector.x * 20;
                projectileOrigin.y += directionVector.y * 20;
                directionVector.y -= 0.5;
                p = new Projectile({
                    tag: 'bomb',
                    sprite: this.bombSprite(),
                    damage: 0,
                    speed: BLOCKSIZE * 0.33,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 2,
                    hasGravity: true,
                    spread: 0
                });
                break;
            case 'explosion':
                p = new Projectile({
                    tag: 'explosionbullet',
                    sprite: this.explosionSprite(BLOCKSIZE * 4),
                    damage: 5,
                    speed: 0,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 7/30,
                    hasGravity: false,
                    spread: 0
                });
                break;
            case 'smallBomb':
                projectileOrigin.x += directionVector.x * 10;
                projectileOrigin.y += directionVector.y * 10;
                p = new Projectile({
                    tag: 'smallbomb',
                    sprite: this.smallBombSprite(),
                    damage: 0,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 1,
                    hasGravity: false,
                    spread: 0
                });
                break;
            case 'smallexplosion':
                p = new Projectile({
                    tag: 'explosionbullet',
                    sprite: this.explosionSprite(BLOCKSIZE * 1.75),
                    damage: 5,
                    speed: 0,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 7/30,
                    hasGravity: false,
                    spread: 0
                });
                break;

            default: console.log(`Invalid projectile type: ${type}.`);
        }
        return this.entityManager.addEntity(p);
    }


    bulletSprite(frameX = 0, frameY = 0) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.ORB),
            sWidth: 16,
            sHeight: 16,
            scale: 1,
            firstFrameX: frameX,
            frameY: frameY
        });
    }

    fireSprite() {
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.FIRE),
            sWidth: 8,
            sHeight: 12,
            scale: 2,
            firstFrameX: 0,
            lastFrameX: 4,
            fps: 30
        });
        sprite.currentFrame = randomInt(sprite.lastFrameX);
        return sprite;
    }

    bombSprite() {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.BOMB),
            sWidth: 10,
            sHeight: 10,
            scale: BLOCKSIZE * 0.66 / 10,
        });
    }

    smallBombSprite() {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.BOMB),
            sWidth: 10,
            sHeight: 10,
            scale: BLOCKSIZE * 0.4 / 10,
        });
    }

    explosionSprite(size) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.EXPLOSION),
            sWidth: 64,
            sHeight: 64,
            scale: size / 64,
            firstFrameX: 0,
            lastFrameX: 5,
            fps: 30
        });
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
        const sprite = props.sprite;
        const transform = new CTransform({
            x: props.origin.x - sprite.dWidth / 2,
            y: props.origin.y - sprite.dHeight / 2,
            hasGravity: props.hasGravity,
            // rotation: props.angle,
            velocityX: props.dVector.x * stats.speed + randomSpread(props.spread),
            velocityY: props.dVector.y * stats.speed + randomSpread(props.spread),
            // maxVelocityX: 300,
            // maxVelocityY: 300,
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.dWidth,
            height: sprite.dHeight,
        });
        const duration = new CDuration(props.duration);
        transform.collider = collider
        return [stats, sprite, transform, collider, duration];
    }

}

//damage, angle, speed, hasGravity
