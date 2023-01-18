

// components that are attached to entities to give them functionality

/*
    List of Components so far:
        CSprite - sprite
        CTransform - transform
        CLifespan - lifespan
        CState - state
        Cinput - input  should it be a component?
        CBoxCollider - boxCollider
        CRigidBody - rigidBody
        CGravity - gravity       not sure yet.
*/



/**
 * Component that holds a sprite.
 * 
 * @param {Image} sprite 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} sizeMod 
 * @returns this object
 */
const CSprite = function CSprite(sprite, width, height, sizeMod, fps) {
    this.sprite = sprite
    this.spriteWidth = width
    this.spriteHeight = height
    this.resizeWidth = this.spriteWidth * sizeMod
    this.resizeHeight = this.spriteHeight * sizeMod
    this.frameX = 0
    this.frameY = 0
    this.maxFrames = 0
    this.frameInterval = fps
    this.frameTimer = 0
    return this
}
CSprite.prototype.name = 'sprite'


/**
 * Component that holds entity position, velocity, angle
 * 
 * @param {
 * x: Number,
 * y: Number,
 * velocityX: Number,
 * velocityY: Number,
 * angle: Number,
 * maxVelocity: Number
 * } props 
 * @returns 
 */
const CTransform = function CTransform(props) {
    this.x = props.x || 0
    this.y = props.y || 0
    this.velocityX = props.velocityX || 0
    this.velocityY = props.velocityY || 0
    this.angle = props.angle || 0
    this.maxVelocity = props.maxVelocity
    return this
}
CTransform.prototype.name = 'transform'


/**
 * Could be used for an item with a timer maybe
 * 
 * @param {Number} total 
 * @returns 
 */
const CLifespan = function CLifespan(total){
    this.remaining = total
    this.total = total
    
    return this
}
CLifespan.prototype.name = 'lifespan'


/**
 * Component that holds the states and current state of an entity
 * 
 */
const CState = function CState() {
    this.states = new Map()
    this.currentState = null
}
CState.prototype.name = 'state'


/**
 * Component that implements input
 */
const CInput = function CInput() {
    this.ArrowLeft = 2
    this.ArrowRight = 2
    
}
CInput.prototype.name = 'input'


/**
 * Component that represents a box collider.
 * The collider should have the same dimensions as a sprite.
 * 
 * @param {
 * x: Number,
 * y: Number,
 * width: Number,
 * height: Number
 * } props 
 */
const CBoxCollider = function CBoxCollider(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.collisions = {}
}
CBoxCollider.prototype.name = 'boxCollider'


/**
 * Component used to implement gravity with perhaps.
 * 
 * @param {
 * mass: Number,
 * isGrounded: bool
 * } props 
 */
const CRigidBody = function CRigidBody(props) {
    this.mass = props.mass
    this.isGrounded = false

}
CRigidBody.prototype.name = 'rigidBody'


//for testing only
const CColor = function CColor(color) {
    this.color = color
}
CColor.prototype.name = 'color'