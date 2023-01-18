// Changes state of an entity. Usually used to change an animation
class PlayerStateManager {

    constructor(input, player) {
        this.input = input
        this.playerSprite = player.components.sprite
        this.playerState = player.components.state
    }

    addStates(props) {
        props.forEach( o => {
            this.playerState.states.set(o['tag'], o['state'])
        })
    }

    setState(s) {
        this.playerState.currentState = s
        this.enter(this.playerState.states.get(s))
    }

    enter(state) {
        this.playerSprite.frameX = state.frameX
        this.playerSprite.frameY = state.frameY
        this.playerSprite.maxFrames = state.maxFrames
    }
    update(input, deltaTime) {
        if(this.playerSprite.frameTimer > this.playerSprite.frameInterval) {
            this.playerSprite.frameTimer = 0
            if(this.playerSprite.frameX < this.playerSprite.maxFrames) {
                this.playerSprite.frameX++

            } else {
                this.playerSprite.frameX = 0
            }
        } else {
            this.playerSprite.frameTimer += deltaTime
        }
        console.log(this.playerSprite.frameTimer)
        if(input['d']) {
            if(this.playerState.currentState !== 'Running') {
                this.setState('Running')
            }
        } else if(input['a']) {
            if(this.playerState.currentState !== 'Rolling') {
                this.setState('Rolling')
            }
        } else {
            if(this.playerState.currentState !== 'Idle') {
                this.setState('Idle')
            }
        }
    }
}