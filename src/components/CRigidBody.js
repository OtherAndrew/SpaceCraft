const CRigidBody = function CRigidBody(props) {
    this.mass = props.mass
    this.isGrounded = false

}
CRigidBody.prototype.name = 'rigidBody'