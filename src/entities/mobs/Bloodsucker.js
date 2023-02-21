
class Bloodsucker {
    /**
     * Initializes bloodsucker (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of starting frame
     * @param {number} props.y       Y position of the starting frame
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'bloodsucker';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            damage: 0.5,
            speed: 4,
            maxHealth: 70
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.BLOODSUCKER],
            sWidth: 332,
            sHeight: 326,
            scale: BLOCKSIZE * 2.5 / 332,
            // idleR
            firstFrameX: 0,
            frameY: 1,
            lastFrameX: 4,
            fps: 20,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y
        });
        const cWidth = BLOCKSIZE * 1.75;
        const cHeight = BLOCKSIZE
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            height: cHeight,
            xOffset: (sprite.dWidth - cWidth) / 2,
            yOffset: (sprite.dHeight - cHeight) * 3/4,
        });
        const drops = new CDrops([
            new LaserPistol()
        ]);
        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;

        return [stats, sprite, transform, collider, state, drops];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleL', new AnimationProps(0, 0,4));
        aMap.set('idleR', new AnimationProps(0, 1,4));
        aMap.set('attackL', new AnimationProps(0, 2,3));
        aMap.set('attackR', new AnimationProps(0, 3,3));
    };

    update(target, projectileManager) {
        const collider = this.components['boxCollider']
        const origin = collider.center;
        const speed = this.components["stats"].speed;
        const transform = this.components["transform"];
        const state = this.components['state'];

        //TODO use A* to to find path

        const distance = getDistance(origin, target.center);
        const dVector = normalize(origin, target.center)
        let animState;

        if (distance > 300) {
            transform.velocityX = switchInterval(state.elapsedTime, 5) ? speed/5 : -speed/5;
            transform.velocityY = normalize(origin, { x: target.center.x, y: target.top - 50 }).y * speed;
            console.log(transform.velocityX)
            animState = transform.velocityX < 0 ? "idleL" : "idleR"
        } else {
            if (checkCollision(collider, target)) {
                transform.velocityX = 0;
            } else {
                transform.velocityX = dVector.x * speed;
            }
            transform.velocityY = dVector.y * speed;
            animState = target.center.x < origin.x ? "attackL" : "attackR";
        }
        state.setState(animState);
    }

    #direction(x1,y1,x2,y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = getDistance2(x1, y1, x2, y2);
        return [dx/length, dy/length];
    }

    #moveCloser(mover, target, blocksize) {
        const [x,y] = mover;
        const [dx,dy] = target;
        return [x + dx * blocksize, y + dy * blocksize];
    }
}
