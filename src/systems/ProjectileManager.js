class ProjectileManager {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    shoot(type, targetPos, originEntity) {
        const midPoint = {
            x: WIDTH * .5,
            y: HEIGHT * .5
        }
        const directionVector = normalize(midPoint, targetPos);
        const projectileOrigin = {
            x: originEntity.components["boxCollider"].center.x,
            y: originEntity.components["boxCollider"].center.y
        }
        const projectileQueue = [];
        switch (type) {
            case 'weak_bullet':
                projectileOrigin.x += directionVector.x * 15
                projectileOrigin.y += directionVector.y * 15
                projectileQueue.push(new Projectile({
                    tag: 'bullet',
                    sprite: this.bulletSprite(8),
                    damage: 10,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    // 0.4 = (100% center to edge horizontal
                    // 0.3 = (75% center to edge horizontal
                    // 0.2 = (50% center to edge horizontal
                    duration: 0.2,
                    hasGravity: false,
                    spread: 1
                }));
                break;
            case 'mid_bullet':
                projectileOrigin.x += directionVector.x * 15
                projectileOrigin.y += directionVector.y * 15
                projectileQueue.push(new Projectile({
                    tag: 'bullet',
                    sprite: this.bulletSprite(11),
                    damage: 10,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    // 0.4 = (100% center to edge horizontal
                    // 0.3 = (75% center to edge horizontal
                    // 0.2 = (50% center to edge horizontal
                    duration: 0.3,
                    hasGravity: false,
                    spread: 1
                }));
                break;
            case 'strong_bullet':
                projectileOrigin.x += directionVector.x * 10
                projectileOrigin.y += directionVector.y * 10
                projectileQueue.push(new Projectile({
                    tag: 'bullet',
                    sprite: this.bulletSprite(2),
                    damage: 10,
                    speed: BLOCKSIZE * 0.75,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    // 0.4 = (100% center to edge horizontal
                    // 0.3 = (75% center to edge horizontal
                    // 0.2 = (50% center to edge horizontal
                    duration: 0.3,
                    hasGravity: false,
                    spread: 1
                }));
                break;
            case 'minigun_bullet':
                projectileOrigin.x += directionVector.x * 10
                projectileOrigin.y += directionVector.y * 10
                for (let i = 0; i < 2; i++) {
                    projectileQueue.push(new Projectile({
                        tag: 'bullet_minigun',
                        sprite: this.bulletSprite(14, 0, 0.8),
                        damage: 1.5,
                        speed: BLOCKSIZE * 0.75,
                        dVector: directionVector,
                        origin: projectileOrigin,
                        duration: 0.45,
                        hasGravity: false,
                        spread: 1.25
                    }));
                }
                break;
            case 'railgun_bullet':
                projectileOrigin.x += directionVector.x * 10
                projectileOrigin.y += directionVector.y * 10
                projectileQueue.push(new Projectile({
                    tag: 'bullet_railgun',
                    sprite: this.bulletSprite(4),
                    damage: 100,
                    speed: BLOCKSIZE * 0.9,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 0.5,
                    hasGravity: false,
                    spread: 0
                }));
                break;
            case 'fire':
                projectileOrigin.x += directionVector.x * 30
                projectileOrigin.y += directionVector.y * 30
                projectileQueue.push(new Projectile({
                    tag: 'bullet_fire',
                    sprite: this.fireSprite(),
                    damage: 0.05,
                    speed: BLOCKSIZE * 0.1,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 1.25,
                    hasGravity: false,
                    spread: 0.33
                }));
                break;
            case 'bomb':
                projectileOrigin.x += directionVector.x * 20;
                projectileOrigin.y += directionVector.y * 20;
                directionVector.y -= 0.25;
                projectileQueue.push(new Projectile({
                    tag: 'bomb',
                    sprite: this.bombSprite(BLOCKSIZE * 0.6),
                    damage: 0,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 2,
                    hasGravity: true,
                    spread: 0.5
                }));
                break;
            case 'explosion':
                projectileQueue.push(new Projectile({
                    tag: 'bullet_explosion',
                    sprite: this.explosionSprite(BLOCKSIZE * 5),
                    damage: 8,
                    speed: 0,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 7/30,
                    hasGravity: false,
                    spread: 0
                }));
                break;
            case 'mini_bomb':
                projectileOrigin.x += directionVector.x * 10;
                projectileOrigin.y += directionVector.y * 10;
                projectileQueue.push(new Projectile({
                    tag: 'mini_bomb',
                    sprite: this.miniBombSprite(BLOCKSIZE * 0.45),
                    damage: 0,
                    speed: BLOCKSIZE * 0.75,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 0.5,
                    hasGravity: false,
                    spread: 0
                }));
                for (let i = 0; i < 2; i++) {
                    projectileQueue.push(new Projectile({
                        tag: 'mini_bomb',
                        sprite: this.miniBombSprite(BLOCKSIZE * 0.45),
                        damage: 0,
                        speed: BLOCKSIZE * 0.75,
                        dVector: directionVector,
                        origin: projectileOrigin,
                        duration: 0.5,
                        hasGravity: false,
                        spread: 3.5
                    }));
                }
                break;
            case 'mini_explosion':
                projectileQueue.push(new Projectile({
                    tag: 'bullet_mini_explosion',
                    sprite: this.explosionSprite(BLOCKSIZE * 1.5),
                    damage: 2.5,
                    speed: 0,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 7/30,
                    hasGravity: false,
                    spread: 0
                }));
                break;
            default: console.log(`Invalid projectile type: ${type}.`);
        }
        projectileQueue.forEach(p => this.entityManager.addEntity(p));
    }

    bulletSprite(frameX = 0, frameY = 0, scale = 1) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.ORB),
            sWidth: 16,
            sHeight: 16,
            scale: scale,
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

    bombSprite(size) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.BOMB),
            sWidth: 10,
            sHeight: 10,
            scale: size / 10,
        });
    }

    miniBombSprite(size) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.MINI_BOMB),
            sWidth: 10,
            sHeight: 10,
            scale: size / 10,
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
            velocityX: props.dVector.x * stats.speed + randomSpread(props.spread),
            velocityY: props.dVector.y * stats.speed + randomSpread(props.spread),
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
