

/**
 * Camera class used to move the canvas with player at the center.
 */

class Camera {
    constructor(target) {
        this.sceneWIDTH = WIDTH * .5
        this.sceneHEIGHT = HEIGHT * .5
        this.worldWidth = WIDTH_PIXELS
        this.worldHeight = HEIGHT_PIXELS
        this.targetPos = target.components["boxCollider"]
        this.x = this.targetPos.center.x - this.sceneWIDTH
        this.y = this.targetPos.center.y + this.targetPos.height / 2 - this.sceneHEIGHT
    }

    update() {
        if (this.targetPos.left - this.sceneWIDTH <= 0) {
            this.x = 0
        } else if (this.targetPos.right + this.sceneWIDTH >= this.worldWidth) {
            this.x = this.worldWidth - WIDTH
        } else {
            this.x = this.targetPos.center.x - this.sceneWIDTH
        }

        if (this.targetPos.top + this.sceneHEIGHT >= this.worldHeight + BLOCKSIZE) {
            this.y = this.worldHeight - HEIGHT + BLOCKSIZE
        } else {
            this.y = this.targetPos.center.y - this.sceneHEIGHT;
        }

    }
}