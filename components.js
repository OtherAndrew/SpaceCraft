

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


const CSprite = function CSprite(sprite, width, height, sizeMod) {
    this.sprite = sprite
    this.spriteWidth = width
    this.spriteHeight = height
    this.resizeWidth = this.spriteWidth * sizeMod
    this.resizeHeight = this.spriteHeight * sizeMod
    this.frameX = 0
    this.frameY = 0
    this.maxFrames = 0
    return this
}
CSprite.prototype.name = 'sprite'

const CTransform = function CTransform(props) {
    this.x = props.x || 0
    this.y = props.y || 0
    this.velocityX = props.velocityX || 0
    this.velocityY = props.velocityY || 0
    this.previousVelocityX = 0
    this.previousVelocityY = 0
    this.angle = props.angle || 0
    this.maxVelocity = 8
    return this
}
CTransform.prototype.name = 'transform'

const CLifespan = function CLifespan(total){
    this.remaining = total
    this.total = total
    
    return this
}
CLifespan.prototype.name = 'lifespan'

const CState = function CState() {
    this.states = new Map()
    this.currentState = null
}
CState.prototype.name = 'state'

const CInput = function CInput() {
    this.entity = null
    this.update = function(keys) {
        if(keys.ArrowUp) {
            this.entity.components.transform.y -= 5
        }
        if(keys.ArrowDown) {
            this.entity.components.transform.y += 5
        }
        if(keys.ArrowRight) {
            this.entity.components.transform.x += 5
        }
        if(keys.ArrowLeft) {
            this.entity.components.transform.x -= 5
        }
    }
}
CInput.prototype.name = 'input'

const CBounce = function CBounce(props) {
    this.entity = null
    this.width = props.width // game world bounds
    this.height = props.height
    this.speed = props.speed
    this.update = function() {
        this.entity.components.transform.velocityX = this.speed
        this.entity.components.transform.velocityY = this.speed
    }
}

CBounce.prototype.name = 'bounce'

const CBoxCollider = function CBoxCollider(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
}
CBoxCollider.prototype.name = 'boxCollider'

const CRigidBody = function CRigidBody(props) {
    this.mass = props.mass
    this.isGrounded = false

}
CRigidBody.prototype.name = 'rigidBody'

/*
const CForce = function CForce(props) {
    this.force = props.force
    this.origin = props.origin
    this.radius = props.radius
}
CForce.prototype.name = 'force'

*/

const CGravity = function CGravity(value) {
    this.gravityForce = value
}
CGravity.prototype.name = 'gravity'