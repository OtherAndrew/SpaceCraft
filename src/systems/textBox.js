

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
        this.list = new LinkedList()
        this.timer = 0
        this.timesUp = 5
    }
    update(deltaTime) {
        this.timer += deltaTime
        if(this.timer > this.timesUp) {
            this.list.head.next = null
            this.list.count = 1
            this.timer = 0
        }
    }

    draw(ctx) {
        ctx.fillStyle = rgba(40,35,35, .4)
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
        ctx.fillStyle = rgba(255,255,255,.7)
        ctx.textAlign = 'left'
        ctx.font = 'bold 15px Helvetica'
        let ptr = this.list.head
        let i = 0
        while(ptr != null) {
            let yLevel = i * 16
            i++
            ctx.fillText(ptr.data, this.pos.x + this.offset, this.pos.y + this.height - this.offset - yLevel)
            ptr = ptr.next
        }
        
    }

    append(text) {
        let node = new Node(text)
        this.list.insert(node)
        this.timer = 0
    }

}

class LinkedList {
    constructor() {
        this.head = new Node()
        this.count = 1
        this.sizeLimit = 11
    }
    insert(node) {
        node.next = this.head
        this.head = node
        this.count++
        if(this.count > this.sizeLimit) {
            this.#remove()
        }
    }
    
    #remove() {
        let ptr = this.head
        while(ptr.next.next != null) {
            ptr = ptr.next
        }
        ptr.next = null
        this.count--
    }

}

class Node {
    constructor(data = 'Mario was here :)', next = null) {
        this.data = data
        this.next = next
    }
}
