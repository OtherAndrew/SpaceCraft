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
        this.playerState.states["idleR"] = {startFrameX: 0, frameY: 0, lastFrameX: 1};
        this.playerState.states["idleL"] = {startFrameX: 1, frameY: 0, lastFrameX: 1};
        this.playerState.states["walkR"] = {startFrameX: 0, frameY: 1, lastFrameX: 12};
        this.playerState.states["walkL"] = {startFrameX: 0, frameY: 2, lastFrameX: 12};
    }

    setState(s) {
        this.playerState.currentState = s;
        this.enter(this.playerState.states[s]);
    }

    enter(state) {
        this.playerSprite.startFrameX = state.startFrameX;
        this.playerSprite.frameY = state.frameY;
        this.playerSprite.lastFrameX = state.lastFrameX;
    }
    update(input, tick) {
        const animationTime = this.playerSprite.frameDuration * this.playerSprite.lastFrameX;
        if (this.playerSprite.elapsedTime > animationTime) {
            this.playerSprite.elapsedTime = 0;
            if (this.playerSprite.startFrameX < this.playerSprite.lastFrameX) {
                this.playerSprite.startFrameX++;
            } else {
                this.playerSprite.startFrameX = 0;
            }
        } else {
            this.playerSprite.elapsedTime += tick;
        }
        console.log(this.playerSprite.elapsedTime);
        if (input['d']) {
            if (this.playerState.currentState !== 'walkR') this.setState('walkR');
        } else if (input['a']) {
            if (this.playerState.currentState !== 'walkL') this.setState('walkL');
        } else {
            // if (this.playerState.currentState === 'walkR') this.setState('idleR');
            // if (this.playerState.currentState === 'walkL') this.setState('idleL');
            this.setState('idleR')
        }
    }
}