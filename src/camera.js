

/**
 * Camera class used to move the canvas with player at the center.
 */

class Camera {
    constructor(target) {
        this.sceneWIDTH = WIDTH * .5
        this.sceneHEIGHT = HEIGHT * .5
        this.worldWidth = WIDTH_PIXELS
        this.worldHeight = HEIGHT_PIXELS
        this.margin = 7.5;
        this.targetPos = target.components.transform
        this.x = this.targetPos.x - this.sceneWIDTH
        this.y = this.targetPos.y - this.sceneHEIGHT    
    }

    update() {
        if(this.targetPos.x - this.sceneWIDTH <= 0) {
            this.x = 0
        } else if(this.targetPos.x + this.sceneWIDTH >= this.worldWidth) {
            this.x = this.worldWidth - WIDTH
        } else {
            this.x = this.targetPos.x - this.sceneWIDTH
        }

        if(this.targetPos.y + this.sceneHEIGHT >= this.worldHeight + BLOCKSIZE) {
            this.y = this.worldHeight - HEIGHT + BLOCKSIZE
        } else {
            if (Math.abs(this.y - this.targetPos.y) > this.margin) {
                this.y = this.targetPos.y - this.sceneHEIGHT
            }

        }
    }
}