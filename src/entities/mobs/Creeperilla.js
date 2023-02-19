class Creeperilla {
    /**
     * Initializes Creeperilla (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'creeperilla mob';
        this.name = 'creeperilla';
        this.components = this.#buildComponents(props);
        this.rand = Math.floor(Math.random()*(60-10) + 10);
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 3
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.CREEPERILLA],
            sWidth: 150,
            sHeight: 104,
            scale: .75,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 3,
            fps: 12,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = 1.8 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x + props.width / 2,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: sprite.dHeight
        });

        this.#addAnimations(sprite);
        this.#addBehaviors(transform, stats);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        state.transform = transform;
        return [stats, sprite, transform, collider, state];
    }

    update(target, projectileManager) {
        const targetX = target.center.x;
        const x = this.components['boxCollider'].center.x;
        const state = targetX < x ? "walkL" : "walkR";
        this.components.state.setState(state);
        if (this.rand > 0) {
            this.rand -= 1;

        } else {

            let height = Math.floor(Math.random()*(25 - 5) + 5);
            this.components.transform.velocityY -= height;
            let leap = Math.floor(Math.random()*(10 - 3) + 3);
            this.components.transform.velocityX = state === "walkL" ? -leap: leap;
            this.rand = Math.floor(Math.random()*(60 - 30) + 30);
        }
    }

    #jump(){
        this.components.transform.y -= 10;
    }
    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 1, 0));
        aMap.set('idleL', new AnimationProps(0, 0,0));
        aMap.set('walkR', new AnimationProps(0, 1, 3));
        aMap.set('walkL', new AnimationProps(0, 0, 3));
    };
    #addBehaviors(transform, stats) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, null));
        bMap.set('idleL', new BehaviorProps(0, null));
        bMap.set('walkR', new BehaviorProps(stats.speed, null));
        bMap.set('walkL', new BehaviorProps(-stats.speed, null));
    }

}

