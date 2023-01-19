
/*
    State of an entity which may change entity properties, animation, etc.
*/

class State {
    constructor(props) {
        this.frameX = props.frameX
        this.frameY = props.frameY
        this.maxFrames = props.frameCount
    }
}