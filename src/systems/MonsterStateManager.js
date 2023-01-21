// Changes state of an entity. Usually used to change an animation
class MonsterStateManager {

    constructor(entity) {
        this.entityTransform = entity.components.transform;
        this.entitySprite = entity.components.sprite;
        this.entityState = entity.components.state;
        this.time = 0;
        this.addAnimations();
    }

    // addAnimations(states) {
    //     props.forEach( o => {
    //         this.playerState.states.set(o['tag'], o['state'])
    //     })
    // }

    addAnimations() {
        this.entityState.states["walkR"] = new AnimationProps(0, 1, 11);
        this.entityState.states["walkL"] = new AnimationProps(0, 2, 11);
    }

    setState(s) {
        this.entityState.currentState = s;
        this.enter(this.entityState.states[s]);
    }

    enter(state) {
        this.entitySprite.firstFrameX = state.firstFrameX;
        this.entitySprite.currentFrame = this.entitySprite.firstFrameX;
        this.entitySprite.frameY = state.frameY;
        this.entitySprite.lastFrameX = state.lastFrameX;
    }
    update(tick) {
        const currentState = this.entityState.currentState;
        this.time += tick;
        if (this.time > 5) {
            this.time = 0;
            if (currentState === 'walkR') this.setState('walkL');
            else if (currentState === 'walkL') this.setState('walkR');
            this.entityTransform.velocityX *= -1;
        }
    }
}