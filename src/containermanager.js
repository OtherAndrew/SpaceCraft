class ContainerManager {
    constructor() {
        this.owners = {}; // owner and the inventory pairs
        this.slots = []; // every container by their universal slot number
        this.slotCount = 0; // universal slot number count
        this.playerCounts = new Map;
        this.activeInventory = []; // inventories on screen
        this.selectedContainer = null; // player selected container
        this.lastClick = null; // tracks last mouse click to check if new
    }

    createInventory(owner, x, y, row, col, color="blue", keyword=null) {
        let newInventory = [];
        let internalCount = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (keyword == null) {
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y + (47 * i), this.slotCount++, color);
                } else if (keyword === "reverse") {
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y - (47 * i), this.slotCount++, color);
                } else {
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y + (47 * i), this.slotCount++, color, undefined, keyword);
                }                    
                this.slots.push(newInventory[internalCount++]);
            }
        }
        this.owners[owner] = newInventory;
        return newInventory;
    }

    getInventory(owner) {
        return this.owners[owner];
    }

    addToInventory(owner, item, count=1) {
        let firstNull = null;
        let inventory = this.getInventory(owner);
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].item && item.tag === inventory[i].item.tag) {
                inventory[i].count += count;
                this.addPlayerCount(owner, item, count);
                return 0;
            } else if (firstNull == null && inventory[i].item == null) {
                firstNull = inventory[i];
            }
        }
        if (firstNull != null) {
            firstNull.item = item;
            firstNull.count = count;
            this.addPlayerCount(owner, item, count);
            return 1;
        } else {
            return -1;
        }
    }

    addPlayerCount(owner, item, count) {
        if (owner === "player") {
            let current = this.playerCounts.get(item.tag);
            if (current) {
                this.playerCounts.set(item.tag, current + count);
            } else {
                this.playerCounts.set(item.tag, count);
            }
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

    // metronome bug
    removeForCrafting(requisite, owner="player") {
        let item = requisite.item;
        let count = requisite.count;
        let inventory = this.getInventory(owner);
        for (let i = 0; i < inventory.length && count; i++) {
            if (inventory[i].item && inventory[i].item.tag === item.tag) {
                let owned = inventory[i].count;
                if (count >= owned) {
                    count -= owned;
                    inventory[i].item = null;
                    inventory[i].count = 0;
                } else {
                    inventory[i].count -= count;
                    count = 0;
                }
            }
        }
        if (owner === "player") {
            this.playerCounts.set(item.tag, this.playerCounts.get(item.tag) - requisite.count);
        }
    }

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
        this.deselectContainer(); // affected by metronome effect
    }

    // this ent's inventory is being drawn to the screen
    activateInventory(owner) {
        this.activeInventory.push(this.owners[owner]);
        console.log(this.activeInventory);
    }

    // no inventory is being drawn to the screen
    deactivateInventory() {
        this.activeInventory.length = 2;
    }

    draw(uiActive, ctx) {
        if (uiActive) {
            for (let i = 0; i < this.activeInventory.length; i++) {
                for (let c = 0; c < this.activeInventory[i].length; c++) {
                    this.activeInventory[i][c].draw(ctx);
                }
            }
        } else {
            ctx.save();
            ctx.globalAlpha = 0.7;
            for (let c = 0; c < 4; c++) {
                this.activeInventory[0][c].draw(ctx);
            }
            ctx.restore();
        }
    }
    
    update(uiActive, click) {
        if (uiActive) { // ui is active
            let hit = this.checkHit(click); // what was click: container or nothing
            if (hit) {
                if (hit.keyword == null) { // click on container and it wasn't special
                    if (this.lastClick == null) { // there was no prev click
                        this.selectContainer(hit, click); // activate or swap as necessary
                    } else { // lastClick was something
                        if (click.T !== this.lastClick.T) { // new click!
                            this.selectContainer(hit, click); // activate or swap as necessary
                        }
                    } // add clicking on non-container deactivation of selected
                } else if (hit.keyword !== "recipe") { // click on container and it is special
                    this.deselectContainer();
                    if (this.lastClick == null) {
                        this.craftContainerItem(hit, click);
                    } else {
                        if (click.T !== this.lastClick.T) { // new click!
                            this.craftContainerItem(hit, click);
                        }
                    }
                }
            }
        } else { // ui is not active
            this.deselectContainer(); // if something is selected deselect it
            this.lastClick = null; // don't bother remembering last click
        }
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

    checkSufficient(requisite, owner="player") {
        let item = requisite.item;
        if (owner === "player") {
            if (this.playerCounts.get(item.tag))
                return this.playerCounts.get(item.tag) >= requisite.count;
            else
                return false;
        }
        let count = 0;
        let inventory = this.getInventory(owner)
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].item && item.tag === inventory[i].item.tag) {
                count += inventory[i].count;
            }
        }
        return count >= requisite.count;
    }

    checkCount(requisite, owner="player") {
        let item = requisite.item;
        if (owner === "player") {
            if (this.playerCounts.get(item.tag))
                return this.playerCounts.get(item.tag) >= requisite.count;
            else
                return false;
        }
        let count = 0;
        let inventory = this.getInventory(owner)
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].item && item.tag === inventory[i].item.tag) {
                count += inventory[i].count;
            }
        }
        return count >= requisite.count;
    }

    selectContainer(hit, click) {
        if (!this.selectedContainer) { // no current container
            hit.selected = true;
            this.selectedContainer = hit;
        } else {
            this.swapViaContainer(hit);
        }
        this.lastClick = click;
    }
    
    deselectContainer() {
        if (this.selectedContainer) {
            this.selectedContainer.selected = false;
            this.selectedContainer = null;
        }
    }

    craftContainerItem(product, click) {
        let recipe = this.getInventory(product.keyword);
        let craftable = true;
        for (let i = 1; i < recipe.length && craftable; i++) {
            craftable = this.checkSufficient(recipe[i]);
        }
        if (craftable) {
            for (let i = 1; i < recipe.length; i++) {
                this.removeForCrafting(recipe[i]);
            }
            this.addToInventory("player", recipe[0].item, recipe[0].count);
        }
        this.lastClick = click;
    }
}

class Container {
    constructor(owner, x, y, slot, fillColor, strokeColor="white", keyword) {
        Object.assign(this, {owner, x, y, slot, fillColor, strokeColor, keyword});
        this.width = 42;
        this.calculateMiddle();
        this.textColor = "black";
        this.font = "bold 15";
        
        this.item = null;
        this.count = 0;
        this.selected = false;
    }

    calculateMiddle() {
        let halfway = this.width / 2;
        this.midx = this.x + halfway;
        this.midy = this.y + halfway;
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
            let shrunkX = itemImage.width * (0.015 * this.width);
            let shrunkY = itemImage.height * (0.015 * this.width);
            ctx.save();
            if (this.uncraftable) {
                ctx.globalAlpha = 0.5;
            }
            ctx.drawImage(itemImage, this.midx - shrunkX / 2, this.midy - shrunkY / 2, shrunkX, shrunkY);
            ctx.restore();
            this.drawStrokedText(ctx, this.x + Math.round(0.2 * this.width), this.y + Math.round(0.8 * this.width));
        }
    }

    // credit: https://stackoverflow.com/questions/13627111/drawing-text-with-an-outer-stroke-with-html5s-canvas
    drawStrokedText(ctx, x, y) {
        ctx.save();
        // ctx.globalAlpha = 1;
        ctx.font = this.font + "px Helvetica";
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 3;
        ctx.lineJoin="round";
        ctx.miterLimit=2;
        ctx.strokeText(this.count, x, y);
        ctx.fillStyle = this.textColor;
        ctx.lineWidth = 1;
        ctx.fillText(this.count, x, y);
        ctx.restore();
    }

    // credit: https://www.scriptol.com/html5/canvas/rounded-rectangle.php
    roundRect(ctx, x, y, color, radius=15) {
        let r = x + this.width;
        let b = y + this.width;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth="2";
        ctx.moveTo(x+radius, y);
        ctx.lineTo(r-radius, y);
        ctx.quadraticCurveTo(r, y, r, y+radius);
        ctx.lineTo(r, y+this.width-radius);
        ctx.quadraticCurveTo(r, b, r-radius, b);
        ctx.lineTo(x+radius, b);
        ctx.quadraticCurveTo(x, b, x, b-radius);
        ctx.lineTo(x, y+radius);
        ctx.quadraticCurveTo(x, y, x+radius, y);
        ctx.fill();
        ctx.stroke();
    }
}