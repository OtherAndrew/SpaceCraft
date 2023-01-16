

/**
 * Camera class used to move the canvas with player at the center.
 */

class Camera {
    constructor(target, worldWidth) {
        this.sceneWIDTH = WIDTH * .5
        this.sceneHEIGHT = HEIGHT * .5
        this.worldWidth = worldWidth
        this.targetPos = target.components.transform
        this.x = this.targetPos.x - this.sceneWIDTH
        this.y = this.targetPos.y - this.sceneHEIGHT    
    }

    update() {
        if(this.targetPos.x - this.sceneWIDTH <= 0) {
            this.x = 0
        } else if(this.targetPos.x + this.sceneWIDTH >= this.worldWidth) {
            this.x = this.worldWidth - WIDTH
        }
        else {
            this.x = this.targetPos.x - this.sceneWIDTH
        }

        if(this.targetPos.y + this.sceneHEIGHT >= this.worldWidth + BLOCKSIZE) {
            this.y = this.worldWidth - HEIGHT + BLOCKSIZE
        }
        else {
            this.y = this.targetPos.y - this.sceneHEIGHT
        }
    }
}