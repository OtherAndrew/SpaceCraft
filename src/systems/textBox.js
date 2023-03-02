

class TextBox {
    constructor() {
        //in pixels
        this.pos = {
            x: 15,
            y: HEIGHT - (HEIGHT * .25)
        }
        this.width = 250
        this.height = 180
        this.offset = 5
        this.text = ''
    }

    draw(ctx) {
        ctx.fillStyle = rgba(40,35,35, .5)
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
        ctx.fillStyle = rgba(255,255,255,.7)
        ctx.textAlign = 'left'
        ctx.font = 'bold 15px Helvetica'
        ctx.fillText(this.text, this.pos.x + this.offset, this.pos.y + this.height - this.offset)
    }

    append(text) {
        console.log(text)
        this.text = (text)
    }

}