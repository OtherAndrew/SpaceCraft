
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
        this.tag = 'bloodsucker mob';
        this.name = 'bloodsucker';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            speed: 3,
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
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.dWidth,
            height: sprite.dHeight
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

    update(tick, targetX, targetY) {

        //TODO use A* to to find path
        let x = this.components.transform.x;
        const velocity = this.components["stats"].speed;

        let state = targetX < x ? "flyL" : "flyR";

            const y = this.components.transform.y;
        const transform = this.components.transform;

        const distance = getDistance2(x, y, targetX, targetY);
        // const angle = getAngle2(x, y, targetX, targetY);
        if (distance <= 870) {

            // transform.velocityX = Math.cos(angle) * velocity;
            // transform.velocityY = Math.sin(angle) * velocity;
            transform.velocityY = targetY < y ? -velocity : velocity;
            transform.velocityX = targetX < x ? -velocity : velocity;
        } else {
            transform.velocityX = 0;
            transform.velocityY = 0;
        }

        this.components.state.setState(state);
    }

}
