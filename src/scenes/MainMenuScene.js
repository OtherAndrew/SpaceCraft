


class MainMenu extends Scene {
    constructor() {
        super()

    }

    init() {
        this.title = "SpaceCraft ver 0.1Alpha"
        this.prompt = 'click to start game'
        this.midPoint = {
            x: WIDTH * .5,
            y: HEIGHT * .5
        }
    }

    update(menuActive, keys, mouseDown, mouse, wheel, deltaTime) {
        if(mouseDown) {
            return true
        }
    }

    draw(menuActive, ctx, mouse) {
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.font = 'bold 50px Helvetica'
        ctx.fillText(this.title, this.midPoint.x - 50, this.midPoint.y - 50)
        ctx.fillText(this.prompt, this.midPoint.x - 50, this.midPoint.y + 50)
    }
}