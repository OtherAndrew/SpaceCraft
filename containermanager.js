class ContainerManager {
    constructor() {
        this.owners = {};
        this.slots = [];
        this.slotCount = 0;
    }

    createInventory(owner, x, y, row, col) {
        let newInventory = [];
        let internalCount = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                newInventory[internalCount] = new Container(owner, x+(47*j), y-(47*i), this.slotCount++);
                this.slots.push(newInventory[internalCount++]);
            }
        }
        this.owners[owner] = newInventory;
        return newInventory;
    }

    getInventory(owner) {
        return this.owners[owner];
    }

    addToInventory(owner, item) {
        let firstNull = null;
        let inventory = this.getInventory(owner);
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].item && item.tag === inventory[i].item.tag) {
                inventory[i].count++;
                return 0;
            } else if (firstNull == null && inventory[i].item == null) {
                firstNull = inventory[i];
            }
        }
        if (firstNull != null) {
            firstNull.item = item;
            firstNull.count++;
            return 1;
        } else {
            return -1;
        }
    }

    removeFromInventory(owner, index) {
        let inventory = this.getInventory(owner);
        let ent = inventory[index];
        if (ent.item) {
            if (--ent.count) {
                return structuredClone(ent.item);
            } else {
                let item = ent.item;
                ent.item = null;
                return item;
            }
        }
    }

    swapInInventory(owner, from, to) {
        let inventory = this.getInventory(owner);
        let placeholder = inventory[from].item;
        inventory[from].item = inventory[to].item;
        inventory[to].item = placeholder;

        placeholder = inventory[from].count;
        inventory[from].count = inventory[to].count;
        inventory[to].count = placeholder;
    }
}

class Container extends Path2D {
    constructor(owner, x, y, slot) {
        super();
        Object.assign(this, {owner, x, y, slot});
        this.midx = this.x + 21;
        this.midy = this.y + 21;
        this.item = null;
        this.count = 0;
        this.selected = false;
        //this.roundRect(this.x, this.y, 42, 42, 15)

        // canvas.addEventListener("click", e => {
        //     if (ctx.isPointInPath(this, e.offsetX, e.offsetY)) {
        //         ctx.fillStyle = "green";
        //         ctx.fill(this);
        //     } else {
        //         ctx.fillStyle = "blue";
        //         ctx.fill(this);
        //     }
        // });
    }

    draw(ctx) {
        // ctx.fillStyle = "blue";
        // ctx.strokeStyle = "white";
        // ctx.lineWidth="2";
        // ctx.fill(this);
        // ctx.stroke(this);
        this.roundRect(ctx, this.x, this.y, 42, 42, 15);
        if (this.item) {
            let itemImage = ASSET_MANAGER.getAsset(this.item.sprite);
            let shrunkX = itemImage.width * 0.65;
            let shrunkY = itemImage.height * 0.65;
            ctx.drawImage(itemImage, this.midx - shrunkX / 2, this.midy - shrunkY / 2, shrunkX, shrunkY);
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillStyle = "white";
            ctx.fillText(this.count, this.x+8, this.y + 33);
            ctx.restore();
        }
    }

    // credit: https://www.scriptol.com/html5/canvas/rounded-rectangle.php
    roundRect(ctx, x, y, w, h, radius) {
        let r = x + w;
        let b = y + h;
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "white";
        ctx.lineWidth="2";
        ctx.moveTo(x+radius, y);
        ctx.lineTo(r-radius, y);
        ctx.quadraticCurveTo(r, y, r, y+radius);
        ctx.lineTo(r, y+h-radius);
        ctx.quadraticCurveTo(r, b, r-radius, b);
        ctx.lineTo(x+radius, b);
        ctx.quadraticCurveTo(x, b, x, b-radius);
        ctx.lineTo(x, y+radius);
        ctx.quadraticCurveTo(x, y, x+radius, y);
        ctx.fill();
        ctx.stroke();
    };
}