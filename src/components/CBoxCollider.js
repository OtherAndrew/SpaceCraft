const CBoxCollider = function CBoxCollider(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.collisions = {}
}
CBoxCollider.prototype.name = 'boxCollider'