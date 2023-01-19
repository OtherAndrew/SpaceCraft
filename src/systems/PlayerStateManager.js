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
        this.playerState.states["idleR"] = {frameX: 0, frameY: 0, frameCount: 1};
        this.playerState.states["idleL"] = {frameX: 1, frameY: 0, frameCount: 1};
        this.playerState.states["walkR"] = {frameX: 0, frameY: 1, frameCount: 12};
        this.playerState.states["walkL"] = {frameX: 0, frameY: 2, frameCount: 12};
    }

    setState(s) {
        this.playerState.currentState = s;
        this.enter(this.playerState.states[s]);
    }

    enter(state) {
        this.playerSprite.frameX = state.frameX;
        this.playerSprite.frameY = state.frameY;
        this.playerSprite.frameCount = state.frameCount;
    }
    update(input, tick) {
        const animationTime = this.playerSprite.frameDuration * this.playerSprite.frameCount;
        if (this.playerSprite.elapsedTime > animationTime) {
            this.playerSprite.elapsedTime = 0;
            if (this.playerSprite.frameX < this.playerSprite.frameCount) {
                this.playerSprite.frameX++;
            } else {
                this.playerSprite.frameX = 0;
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