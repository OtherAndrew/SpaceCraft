// Changes state of an entity. Usually used to change an animation
class PlayerStateManager {

    constructor(input, player) {
        this.input = input;
        this.playerSprite = player.components.sprite;
        this.playerState = player.components.state;
        this.playerState.states["idleR"] = new Animation(0, 0, 1);
        this.playerState.states["idleL"] = new Animation(1, 0, 1);
        this.playerState.states["walkR"] = new Animation(0, 1, 12);
        this.playerState.states["walkL"] = new Animation(1, 2, 12);
    }

    // addAnimations(states) {
    //     props.forEach( o => {
    //         this.playerState.states.set(o['tag'], o['state'])
    //     })
    // }

    // addAnimations() {
    //     this.playerState.states["idleR"] = new Animation(0, 0, 1);
    //     this.playerState.states["idleL"] = new Animation(1, 0, 1);
    //     this.playerState.states["walkR"] = new Animation(0, 1, 12);
    //     this.playerState.states["walkL"] = new Animation(1, 2, 12);
    // }

    setState(s) {
        this.playerState.currentState = s;
        this.enter(this.playerState.states[s]);
    }

    enter(animation) {
        this.playerSprite.frameX = animation.frameX;
        this.playerSprite.frameY = animation.frameY;
        this.playerSprite.frameCount = animation.frameCount;
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
            if (this.playerState.currentState === 'walkR') this.setState('idleR');
            if (this.playerState.currentState === 'walkL') this.setState('idleL');
        }
    }
}