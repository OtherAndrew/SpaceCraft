

class Debug {
    constructor(engine) {
        this.entities = engine.entityManager.entities
    }

    print() {
        console.log('Current Entities: ')
        this.entities.forEach(e => {
            console.log(e)
        })
    }

    drawInfo(ctx) {
        this.entities.forEach(e => {
            for(let c in e.components) {
                let info = ''
                let x = 0
                let y = 0
                if(c === 'transform') {
                    let t = e.components[c]
                    x = t.x
                    y = t.y
                    info = info + `X: ${x}, Y: ${y} `
                }
                if(c === 'boxCollider') {
                    let t = e.components[c]
                    ctx.strokeStyle = 'red'
                    ctx.strokeRect(t.x, t.y, t.width, t.height)
                }
                if(c === 'force') {
                    let t = e.components[c]
                    ctx.beginPath()
                    ctx.arc(t.origin.x, t.origin.y, t.radius, 0, 2*Math.PI)
                    ctx.stroke()
                }

                if(info) {
                    ctx.textAlign = 'left'
                    ctx.font = '15px Helvetica'
                    ctx.fillText(info, x, y - 20)
                }
                
            }
        })
    }
}