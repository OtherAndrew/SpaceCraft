class Spiderboss {
    /**
     * Initializes Spiderboss (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'spiderboss mob';
        this.name = 'spiderboss';
        this.components = this.#buildComponents(props);
        this.rand = Math.floor(Math.random()*(60-10) + 10);
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 1
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.BROODMOTHER],
            sWidth: 150,
            sHeight: 104,
            scale: 5,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 3,
            fps: 1.5,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = 13 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x,
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
        const state = targetX < x ? "idleL" : "idleR";
        this.components.state.setState(state);
        if (this.rand > 0) {
            this.rand -= 1;
        } else {
            let height = Math.floor(Math.random()*(10 - 5) + 5);
            this.components.transform.velocityY -= height;
            this.rand = Math.floor(Math.random()*(60 - 30) + 30);
        }

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

