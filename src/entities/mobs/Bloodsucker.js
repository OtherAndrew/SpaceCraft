
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
            sWidth: 166,
            sHeight: 162,
            scale: 0.5,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 4,
            fps: 20,
            padding: 2
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y
        });
        const cDim = BLOCKSIZE * 1.75
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cDim,
            height: cDim,
            xOffset: (sprite.dWidth - cDim) / 2,
            yOffset: (sprite.dHeight - cDim),
        });
        this.#addAnimations(sprite);
        this.#addBehaviors(transform, stats);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;

        return [stats, sprite, transform, collider, state];
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 1,3));
        aMap.set('idleL', new AnimationProps(0, 0,1));
        aMap.set('flyR', new AnimationProps(0, 1,4));
        aMap.set('flyL', new AnimationProps(0, 0,4));

        // aMap.set('death', new AnimationProps(0, 0,15));

    };

    #addBehaviors(transform, stats) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, null));
        bMap.set('idleL', new BehaviorProps(0, null));
        bMap.set('flyL', new BehaviorProps(stats.speed, null));
        bMap.set('flyR', new BehaviorProps(-stats.speed, null));
    }

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
            animState = transform.velocityX < 0 ? "flyL" : "flyR"
        } else {
            if (checkCollision(collider, target)) {
                transform.velocityX = 0;
            } else {
                transform.velocityX = dVector.x * speed;
            }
            transform.velocityY = dVector.y * speed;
            animState = target.center.x < origin.x ? "flyL" : "flyR";
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
