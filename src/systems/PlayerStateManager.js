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
        this.playerState.states["idleR"] = new Animation({ firstFrameX: 0, frameY: 0 });
        this.playerState.states["idleL"] = new Animation({ firstFrameX: 1, frameY: 0 });
        this.playerState.states["walkR"] = new Animation({ firstFrameX: 0, lastFrameX: 11, frameY: 1 });
        this.playerState.states["walkL"] = new Animation({ firstFrameX: 0, lastFrameX: 11, frameY: 2 });
        this.playerState.states["jumpR"] = new Animation({ firstFrameX: 0, frameY: 1 });
        this.playerState.states["jumpL"] = new Animation({ firstFrameX: 0, frameY: 2 });
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
        } else if (input['w'] || input['s']) {
            if (currentState === 'idleR' || currentState === 'walkR') this.setState('jumpR');
            else if (currentState === 'idleL' || currentState === 'walkL') this.setState('jumpL');
        } else {
            if (currentState === 'walkR' || currentState === 'jumpR') this.setState('idleR');
            else if (currentState === 'walkL' || currentState === 'jumpL') this.setState('idleL');
        }
    }
}