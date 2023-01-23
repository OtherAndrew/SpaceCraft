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
        this.playerState.states["idleR"] = new AnimationProps(0, 0);
        this.playerState.states["idleL"] = new AnimationProps(1, 0);
        this.playerState.states["walkR"] = new AnimationProps(0, 1, 11);
        this.playerState.states["walkL"] = new AnimationProps(0, 2, 11);
        this.playerState.states["jumpR"] = new AnimationProps(0, 1);
        this.playerState.states["jumpL"] = new AnimationProps(0, 2);
    }

    setState(s) {
        this.playerState.currentState = s;
        this.enter(this.playerState.states[s]);
    }

    enter(state) {
        this.playerSprite.firstFrameX = state.firstFrameX;
        this.playerSprite.currentFrame = this.playerSprite.firstFrameX;
        this.playerSprite.frameY = state.frameY;
        this.playerSprite.lastFrameX = state.lastFrameX;
    }
    update(input) {
        const currentState = this.playerState.currentState;
        if (input['d']) {
            if (currentState !== 'walkR') this.setState('walkR');
        } else if (input['a']) {
            if (currentState !== 'walkL') this.setState('walkL');
        } else if (input['w'] || input['s'] || input[' ']) {
            if (currentState === 'idleR' || currentState === 'walkR') this.setState('jumpR');
            else if (currentState === 'idleL' || currentState === 'walkL') this.setState('jumpL');
        } else {
            if (currentState === 'walkR' || currentState === 'jumpR') this.setState('idleR');
            else if (currentState === 'walkL' || currentState === 'jumpL') this.setState('idleL');
        }
    }
}