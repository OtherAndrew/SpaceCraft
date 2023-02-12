

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
        this.x = this.targetPos.x - this.sceneWIDTH + this.targetPos.width / 2
        this.y = this.targetPos.y - this.sceneHEIGHT + this.targetPos.height / 2
    }

    update() {
        if(this.targetPos.x - this.sceneWIDTH <= 0) {
            this.x = 0
        } else if(this.targetPos.x + this.sceneWIDTH >= this.worldWidth) {
            this.x = this.worldWidth - WIDTH + this.targetPos.width / 2
        } else {
            this.x = this.targetPos.x - this.sceneWIDTH + this.targetPos.width / 2
        }

        if(this.targetPos.y + this.sceneHEIGHT >= this.worldHeight + BLOCKSIZE) {
            this.y = this.worldHeight - HEIGHT + BLOCKSIZE
        }
        this.y = this.targetPos.y - this.sceneHEIGHT + this.targetPos.height / 2;
    }
}