class RenderBox {
    constructor(player, gridSize, blockSize) {
        this.player = player
        this.gridSize = gridSize
        this.blockSize = blockSize
        this.x = 0
        this.y = 0
    }
    update() {
        this.x = Math.ceil(this.player.components.transform.x / this.blockSize)
        this.y = Math.ceil(this.player.components.transform.y / this.blockSize)
    }
}