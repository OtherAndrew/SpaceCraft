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