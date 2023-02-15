class RenderBox {
    constructor(target, gridSize, blockSize) {
        this.target = target
        this.blockSize = blockSize
        this.x = 0
        this.y = 0
    }
    update() {
        this.x = Math.ceil(this.target.components['boxCollider'].center.x / BLOCKSIZE)
        this.y = Math.ceil(this.target.components['boxCollider'].center.y / BLOCKSIZE)
    }
    setTarget(target) {
        this.target = target
    }
}