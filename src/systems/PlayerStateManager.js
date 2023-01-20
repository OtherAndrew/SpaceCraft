// Changes state of an entity. Usually used to change an animation
class PlayerStateManager {

    constructor(input, player) {
        this.input = input;
        this.playerSprite = player.components.sprite;
        this.playerState = player.components.state;
        this.addAnimations();
    }

    // addAnimations(states) {
    //     props.forEach( o => {
    //         this.playerState.states.set(o['tag'], o['state'])
    //     })
    // }

    addAnimations() {
        this.playerState.states["idleR"] = { startFrameX: 0, frameY: 0 };
        this.playerState.states["idleL"] = { startFrameX: 1, frameY: 0 };
        this.playerState.states["walkR"] = { startFrameX: 0, lastFrameX: 11, frameY: 1 };
        this.playerState.states["walkL"] = { startFrameX: 0, lastFrameX: 11, frameY: 2 };
        this.playerState.states["jumpR"] = { startFrameX: 0, frameY: 1 };
        this.playerState.states["jumpL"] = { startFrameX: 0, frameY: 2 };
    }

    setState(s) {
        this.playerState.currentState = s;
        this.enter(this.playerState.states[s]);
    }

    enter(state) {
        this.playerSprite.startFrameX = state.startFrameX;
        this.playerSprite.currentFrame = this.playerSprite.startFrameX;
        this.playerSprite.frameY = state.frameY;
        this.playerSprite.lastFrameX = state.lastFrameX;
    }
    update(input, tick) {
        // const animationTime = this.playerSprite.frameDuration * (this.playerSprite.lastFrameX + 1);
        // if (this.playerSprite.elapsedTime > animationTime) {
        //     this.playerSprite.elapsedTime = 0;
        //     if (this.playerSprite.currentFrame < this.playerSprite.lastFrameX) {
        //         this.playerSprite.currentFrame++;
        //     } else {
        //         this.playerSprite.currentFrame = this.playerSprite.startFrameX;
        //     }
        // } else {
        //     this.playerSprite.elapsedTime += tick;
        // }
        // console.log(this.playerSprite.elapsedTime);
        const currentState = this.playerState.currentState;
        if (input['d']) {
            if (currentState !== 'walkR') this.setState('walkR');
        } else if (input['a']) {
            if (currentState !== 'walkL') this.setState('walkL');
        } else if (input['w'] || input['s']) {
            if (currentState === 'idleR' || currentState === 'walkR') this.setState('jumpR');
            else if (currentState === 'idleL' || currentState === 'walkL') this.setState('jumpL');
        } else {
            if (currentState === 'walkR' || currentState === 'jumpR') this.setState('idleR');
            else if (currentState === 'walkL' || currentState === 'jumpL') this.setState('idleL');
        }
    }
}