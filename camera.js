

/**
 * Camera class used to move the canvas with player at the center.
 */

class Camera {
    constructor(target, scene, worldWidth) {
        this.actualWidth = scene.WIDTH
        this.actualHeight = scene.HEIGHT
        this.sceneWIDTH = scene.WIDTH * .5
        this.sceneHEIGHT = scene.HEIGHT * .5
        this.worldWidth = worldWidth
        this.targetPos = target.components.transform
        this.x = this.targetPos.x - this.sceneWIDTH
        this.y = this.targetPos.y - this.sceneHEIGHT    
    }

    update() {
        if(this.targetPos.x - this.sceneWIDTH <= 0) {
            this.x = 0
        } else if(this.targetPos.x + this.sceneWIDTH >= this.worldWidth) {
            this.x = this.worldWidth - this.actualWidth
        }
        else {
            this.x = this.targetPos.x - this.sceneWIDTH
        }

        if(this.targetPos.y + this.sceneHEIGHT >= this.worldWidth + 32) {
            this.y = this.worldWidth - this.actualHeight + 32
        }
        else {
            this.y = this.targetPos.y - this.sceneHEIGHT
        }
    }
}