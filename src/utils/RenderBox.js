class RenderBox {
    constructor(target, gridSize, blockSize) {
        this.target = target
        this.gridSize = gridSize
        this.blockSize = blockSize
        this.x = 0
        this.y = 0
    }
    update() {
        this.x = Math.ceil(this.target.components['boxCollider'].center.x / this.blockSize)
        this.y = Math.ceil(this.target.components['boxCollider'].center.y / this.blockSize)
    }
    setTarget(target) {
        this.target = target
    }
}