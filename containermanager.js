class ContainerManager {
    constructor() {
        this.owners = {}; // owner and the inventory pairs
        this.slots = []; // every container by their universal slot number
        this.slotCount = 0; // universal slot number count
        this.activeInventory = [];
        this.activeContainer = null;
        this.lastClick = null;
    }

    createInventory(owner, x, y, row, col, reverse=false) {
        let newInventory = [];
        let internalCount = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (reverse)
                    newInventory[internalCount] = new Container(owner, x+(47*j), y-(47*i), this.slotCount++);
                else
                    newInventory[internalCount] = new Container(owner, x+(47*j), y+(47*i), this.slotCount++);
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

    swapViaContainer(swapContainer) {
        let placeholder = this.activeContainer.item;
        this.activeContainer.item = swapContainer.item;
        swapContainer.item = placeholder;

        placeholder = this.activeContainer.count;
        this.activeContainer.count = swapContainer.count;
        swapContainer.count = placeholder;

        this.deactivateContainer();
    }

    swapViaContainers(active, hit) {
        let placeholder = active.item;
        active.item = hit.item;
        hit.item = placeholder;

        placeholder = active.count;
        active.count = hit.count;
        hit.count = placeholder;
    }

    // this ent's inventory is being drawn to the screen
    activateInventory(owner) {
        this.activeInventory.push(this.owners[owner]);
    }

    // no inventory is being drawn to the screen
    deactivateInventory() {
        this.activeInventory.length = 0;
    }

    // return container clicked on
    checkHit(click) {
        if (click) {
            for (let i = 0; i < this.activeInventory.length; i++) {
                for (let c = 0; c < this.activeInventory[i].length; c++) {
                    if (this.activeInventory[i][c].x <= click.x &&
                        click.x <= this.activeInventory[i][c].x + 42 &&
                        this.activeInventory[i][c].y <= click.y &&
                        click.y <= this.activeInventory[i][c].y + 42) {
                        return this.activeInventory[i][c];
                    }
                }
            }
        }
    }

    // draw(ctx) {
    //     for (let i = 0; i < this.activeInventory.length; i++) {
    //         for (let c = 0; c < this.activeInventory[i].length; c++) {
    //             this.activeInventory[i][c].draw(ctx);
    //         }
    //     }
    // }

    update(uiActive, click) {
        if (uiActive) { // ui is active
            let hit = this.checkHit(click); // container if valid click, else null
            if (hit) { // container was selected
                if (!this.activeContainer) { // if there isn't already a selected container
                    hit.selected = true; // make hit container light up
                    this.activeContainer = hit; // save hit container
                } else { // there already is a selected container
                    // let active = this.activeContainer;
                    // this.deactivateContainer();
                    // this.swapViaContainers(active, hit);
                    this.swapViaContainer(hit);
                }
            }
        } else { // ui is not active
            if (this.activeContainer) { // if something is selected deselect it
                this.activeContainer.selected = false;
                this.activeContainer = null;
            }
        }
    }

    deactivateContainer() {
        if (this.activeContainer) {
            this.activeContainer.selected = false;
            this.activeContainer = null;
        }
    }
}

class Container /*extends Path2D*/ {
    constructor(owner, x, y, slot) {
        // super();
        Object.assign(this, {owner, x, y, slot});
        this.midx = this.x + 21;
        this.midy = this.y + 21;
        this.item = null;
        this.count = 0;
    }

    draw(ctx) {
        // ctx.fillStyle = "blue";
        // ctx.strokeStyle = "white";
        // ctx.lineWidth="2";
        // ctx.fill(this);
        // ctx.stroke(this);
        if (this.selected) {
            this.roundRect(ctx, this.x, this.y, "orange");
        } else {
            this.roundRect(ctx, this.x, this.y);
        }
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
    roundRect(ctx, x, y, color="blue", d=42, radius=15) {
        let r = x + d;
        let b = y + d;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = "white";
        ctx.lineWidth="2";
        ctx.moveTo(x+radius, y);
        ctx.lineTo(r-radius, y);
        ctx.quadraticCurveTo(r, y, r, y+radius);
        ctx.lineTo(r, y+d-radius);
        ctx.quadraticCurveTo(r, b, r-radius, b);
        ctx.lineTo(x+radius, b);
        ctx.quadraticCurveTo(x, b, x, b-radius);
        ctx.lineTo(x, y+radius);
        ctx.quadraticCurveTo(x, y, x+radius, y);
        ctx.fill();
        ctx.stroke();
    };
}