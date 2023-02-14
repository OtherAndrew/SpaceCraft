
class Rocket {
    /**
     * Initializes rocket (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'rocket mob ignore';
        this.name = 'rocket';
        this.components = this.#buildComponents(props);
        this.takeOff = false;
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            speed: 2,
            invincible: true
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.ROCKET],
            sWidth: 221,
            sHeight: 295,
            scale: 1,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 0,
            fps: 1,
            padding: 1
        });
        const transform = new CTransform({
            x: props.x + 20,
            y: props.y,
            hasGravity: true
        });
        const cWidth = 3 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x + props.width / 2,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: sprite.dHeight
        });

        this.#addAnimations(sprite);
        this.#addBehaviors(transform);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        state.transform = transform;
        return [stats, sprite, transform, collider, state];
    }

    update(tick, targetX, targetY) {
        let velocity = this.components["stats"].speed;
        this.components.state.setState('idleR');
        let x = this.components.transform.x;
        let y = this.components.transform.y;
        const transform = this.components.transform;
        const distance = getDistance2(x, y, targetX, targetY);
        const angle = getAngle2(x, y, targetX, targetY);
        console.log("rocketX", x, "rocketY", y);
        console.log("playerX", targetX, "playerY", targetY);
        console.log("distance", distance);
        console.log("takeoff", this.takeOff);
        if (distance <= 300 && !this.takeOff) {  //add inventory check here for the win condition

            //remove the player from the game
            //display win condition message and end credit
            
            transform.y -= 30;
            this.components.transform.hasGravity = false;
            this.takeOff = true;

        } else if (this.takeOff == true) {

            transform.y -= 50;

        } else {
            transform.velocityX = 0;
            transform.velocityY = 0;
        }
        console.log("hasgravity", this.components.transform.hasGravity);

    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0,0));
    };
    #addBehaviors(transform) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, 0));
    }

}
