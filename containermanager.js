class ContainerManager {
    constructor() {
        this.owners = {}; // owner and the inventory pairs
        this.slots = []; // every container by their universal slot number
        this.slotCount = 0; // universal slot number count
        this.activeInventory = []; // inventories on screen
        this.selectedContainer = null; // player selected container
        this.lastClick = null; // tracks last mouse click to check if new
    }

    createInventory(owner, x, y, row, col, color="blue", reverse=false) {
        let newInventory = [];
        let internalCount = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (reverse)
                    newInventory[internalCount] = new Container(
                        owner, x+(47*j), y-(47*i), this.slotCount++, color);
                else
                    newInventory[internalCount] = new Container(
                        owner, x+(47*j), y+(47*i), this.slotCount++, color);
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

    // called to delete ent entirely from inven
    // delete(index) {
    //     this.containers[index] = null;
    //     this.entitiesCount.delete(index);
    //     // disable it completely
    //     // ent = null;
    // };

    swapViaContainer(swapContainer) {
        if (swapContainer !== this.selectedContainer && swapContainer.item && this.selectedContainer.item
            && swapContainer.item.tag === this.selectedContainer.item.tag) { // stack if same
            swapContainer.count = swapContainer.count + this.selectedContainer.count;
            this.selectedContainer.item = null;
            this.selectedContainer.count = 0;
        } else if (!swapContainer.owner && this.selectedContainer.item) { // trashcan (need check for selling?)
            swapContainer.item = this.selectedContainer.item;
            swapContainer.count = this.selectedContainer.count;
            this.selectedContainer.item = null;
            this.selectedContainer.count = 0;
        } else { // swap
            let placeholder = this.selectedContainer.item;
            this.selectedContainer.item = swapContainer.item;
            swapContainer.item = placeholder;

            placeholder = this.selectedContainer.count;
            this.selectedContainer.count = swapContainer.count;
            swapContainer.count = placeholder;
        }
        this.deactivateContainer(); // affected by metronome effect
    }

    // this ent's inventory is being drawn to the screen
    activateInventory(owner) {
        this.activeInventory.push(this.owners[owner]);
    }

    // no inventory is being drawn to the screen
    deactivateInventory() {
        this.activeInventory.length = 2;
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

    draw(uiActive, ctx) {
        if (uiActive) {
            for (let c = 0; c < this.activeInventory[0].length; c++) {
                this.activeInventory[0][c].draw(ctx);
            }
            this.activeInventory[1][0].draw(ctx);
        } else {
            ctx.save();
            ctx.globalAlpha = 0.7;
            for (let c = 0; c < 4; c++) {
                this.activeInventory[0][c].draw(ctx);
            }
            ctx.restore();
        }
        for (let i = 2; i < this.activeInventory.length; i++) {
            for (let c = 0; c < this.activeInventory[i].length; c++) {
                this.activeInventory[i][c].draw(ctx);
            }
        }
    }
    
    update(uiActive, click) {
        if (uiActive) { // ui is active
            let hit = this.checkHit(click); // what was click: container or nothing
            if (hit) { // click on container
                if (this.lastClick == null) { // there was no prev click
                    this.activateContainer(hit, click); // activate or swap as necessary
                } else { // lastClick was something
                    if (click.T !== this.lastClick.T) { // new click!
                        this.activateContainer(hit, click); // activate or swap as necessary
                    }
                } // add clicking on non-container deactivation of selected
            }
        } else { // ui is not active
            this.deactivateContainer(); // if something is selected deselect it
            this.lastClick = null; // don't bother remembering last click
        }
    }

    activateContainer(hit, click) {
        if (!this.selectedContainer) { // no current container
            hit.selected = true;
            this.selectedContainer = hit;
        } else {
            this.swapViaContainer(hit);
        }
        this.lastClick = click;
    }
    
    deactivateContainer() {
        if (this.selectedContainer) {
            this.selectedContainer.selected = false;
            this.selectedContainer = null;
        }
    }
}

class Container {
    constructor(owner, x, y, slot, fillColor, strokeColor="white") {
        Object.assign(this, {owner, x, y, slot, fillColor, strokeColor});
        this.midx = this.x + 21;
        this.midy = this.y + 21;
        this.item = null;
        this.count = 0;
    }

    draw(ctx) {
        if (this.selected) {
            this.roundRect(ctx, this.x, this.y, "orange");
        } else {
            this.roundRect(ctx, this.x, this.y, this.fillColor);
        }
        if (this.item) {
            // center item image
            let itemImage = ASSET_MANAGER.getAsset(this.item.sprite);
            let shrunkX = itemImage.width * 0.65;
            let shrunkY = itemImage.height * 0.65;
            ctx.drawImage(itemImage, this.midx - shrunkX / 2, this.midy - shrunkY / 2, shrunkX, shrunkY);
            
            // stack counter
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillStyle = "white";
            ctx.fillText(this.count, this.x+8, this.y + 33);
            ctx.restore();
        }
    }

    // credit: https://www.scriptol.com/html5/canvas/rounded-rectangle.php
    roundRect(ctx, x, y, color, d=42, radius=15) {
        let r = x + d;
        let b = y + d;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = this.strokeColor;
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
    }
}