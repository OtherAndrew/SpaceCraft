

/**
 * Camera class used to move the canvas with player at the center.
 */

class Camera {
    constructor(target, scene) {
        this.scene = scene
        this.sceneWIDTH = scene.WIDTH * .5
        this.sceneHEIGHT = scene.HEIGHT * .5
        this.targetPos = target.components.transform
        this.x = this.targetPos.x - this.sceneWIDTH
        this.y = this.targetPos.y - this.sceneHEIGHT    
    }

    update() {
        this.x = this.targetPos.x - this.sceneWIDTH
        this.y = this.targetPos.y - this.sceneHEIGHT
    }
}