


class MainMenu extends Scene {
    constructor() {
        super()

    }

    init() {
        this.img = ASSET_MANAGER.cache[BG_PATH.MAIN_MENU]
        this.title = "SpaceCraft ver 0.5Alpha"
        // this.prompt = null
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

    /*
    draw(menuActive, ctx, mouse) {
        
        ctx.textAlign = 'center'
        
        ctx.fillText(this.prompt, this.midPoint.x - 50, this.midPoint.y + 50)
    }
    */
   draw(menuActive, ctx, mouse) {  
        ctx.drawImage(this.img, 0, 0)
        ctx.font = 'bold 50px Helvetica'
        ctx.fillStyle = 'red'
        // ctx.fillText(this.prompt, this.midPoint.x - 350, this.midPoint.y + 250)
   }
}