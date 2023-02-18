class ContainerManager {
    constructor() {
        this.owners = {};               // owners and their inventory
        
        this.slots = [];                // every container by their universal slot number
        this.slotCount = 0;             // universal slot number count

        this.activeInventory = [];      // interactive inventories
        this.drawnInventory = [];       // inventories on screen TODO

        this.playerCounts = new Map;    // keep track of player items and their counts
        
        this.selectedContainer = null;  // player selected container
        this.lastClick = null;          // tracks last mouse click
        
        this.hoverText = null           // provides information
        
        this.splitMode = false;         // stack splitting
        this.splitCount = 0;            // new stack count

        this.chestCount = 0;
    }

    /**
     * Creates an inventory based off given arguments and registers it using owners catalogue and uni-slot
     * 
     * @param owner     String representation of whom the inventory will belong to
     * @param x         The starting x-coordinate for the first container when the inventory is drawn
     * @param y         The starting y-coordinate for the first container when the inventory is drawn
     * @param row       Integer number of container rows in the inventory organization
     * @param col       Integer number of container columns in the inventory organization
     * @param color     Fill color for containers in the inventory
     * @param keyword   String to denote a container is special in some manner
     * @returns {*[]}   Returns the newly created inventory
     */
    createInventory(owner, x, y, row, col, color='blue', keyword=null) {
        let newInventory = [];
        let internalCount = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (keyword == null) { // ordinary container
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y + (47 * i), this.slotCount++, color);
                } else if (keyword === 'reverse') { // player main inventory
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y - (47 * i), this.slotCount++, color);
                } else { // other special container
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y + (47 * i), this.slotCount++, color, undefined, keyword);
                }                    
                this.slots.push(newInventory[internalCount++]); // register with uni-slot
            }
        }
        this.owners[owner] = newInventory; // register with owners catalogue
        return newInventory;
    }

    getInventory(owner) {
        return this.owners[owner];
    }

    getPlayerCounts(tag) {
        return this.playerCounts.get(tag);
    }

    addToInventory(owner, item, count=1) {
        let firstNull;
        let inventory = this.getInventory(owner);
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].item && inventory[i].item.tag === item.tag) {
                inventory[i].count += count;
                if(owner === 'player') this.addPlayerCount(item, count);
                return 0;
            } else if (firstNull === undefined && inventory[i].item == null) firstNull = inventory[i];
        }
        if (firstNull) {
            firstNull.item = item;
            firstNull.count = count;
            if(owner === 'player') this.addPlayerCount(item, count);
            return 1;
        } else return -1;
    }
    
    addPlayerCount(item, count) {
        let current = this.playerCounts.get(item.tag);
        if (current) this.playerCounts.set(item.tag, current + count); 
        else this.playerCounts.set(item.tag, count);
    }

    minusPlayerCount(item, count) {
        let current = this.playerCounts.get(item.tag);
        if (current) {
            let newCount = current - count;
            this.playerCounts.set(item.tag, newCount);
            if (!newCount) this.playerCounts.delete(item.tag);
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

    removeFromPlayer(index) {
        let ent = this.slots[index];
        if (ent.item) {
            let active = ent.item.tag;
            this.minusPlayerCount(ent.item, 1)
            if (!--ent.count) this.clearContainer(ent);
            return active;
        }
    }
    
    removeForCrafting(requisite, owner="player") {
        let item = requisite.item;
        let cost = requisite.count;
        let inventory = this.getInventory(owner);
        for (let i = 0; i < inventory.length && cost; i++) {
            if (inventory[i].item && inventory[i].item.tag === item.tag) {
                let owned = inventory[i].count;
                if (cost >= owned) {
                    cost -= owned;
                    this.clearContainer(inventory[i])
                } else {
                    inventory[i].count -= cost;
                    cost = 0;
                }
            }
        }
        if (owner === "player") this.minusPlayerCount(item, requisite.count)
    }

    swapViaContainer(swapContainer) {
        // TODO: ACCOUNT FOR TRASH CAN AND OUT OF PLAYER INVENTORY
        if (swapContainer !== this.selectedContainer && swapContainer.item && this.selectedContainer.item
            && swapContainer.item.tag === this.selectedContainer.item.tag) { // stack if same
            swapContainer.count = swapContainer.count + this.selectedContainer.count;
            this.clearContainer(this.selectedContainer)
        } else if (!swapContainer.owner && this.selectedContainer.item) { // trashcan (need check for selling?)
            // TODO address count of previous item in trashcan
            swapContainer.item = this.selectedContainer.item; 
            swapContainer.count = this.selectedContainer.count;
            this.clearContainer(this.selectedContainer)
        } else { // swap
            let placeholder = this.selectedContainer.item;
            this.selectedContainer.item = swapContainer.item;
            swapContainer.item = placeholder;
            placeholder = this.selectedContainer.count;
            this.selectedContainer.count = swapContainer.count;
            swapContainer.count = placeholder;
        }
        this.deselectContainer();
    }

    splitViaContainer(splitContainer, click) {
        splitContainer.item = this.selectedContainer.item; // possibly problematic
        splitContainer.count = this.splitCount;
        this.selectedContainer.count -= this.splitCount;
        if (this.selectedContainer.count === 0) this.clearContainer(this.selectedContainer);
        this.deselectContainer();
        this.clearSplit();
        this.lastClick = click;
    }

    // this ent's inventory is being drawn to the screen
    activateInventory(owner) {
        this.activeInventory.push(this.owners[owner]);
        console.log(this.owners[owner]);
    }

    loadInventory(tag) {
        for (const owner in this.owners) {
            if (owner.includes(tag)) this.activeInventory.push(this.owners[owner]);
        }
    }
    
    // no inventory is being drawn to the screen
    unloadInventory() {
        if (this.activeInventory.length !== 2) this.activeInventory.length = 2;
    }
    
    reloadInventory() {
        if (this.activeInventory.length !== 5) {
            this.unloadInventory();
            this.loadInventory('builtin');
        }
    }

    draw(menuActive, ctx, mouse) {
        if (menuActive) {
            ctx.drawImage(ASSET_MANAGER.getAsset(OVERLAY_PATH.INVENTORY), 0, 0);
            ctx.drawImage(ASSET_MANAGER.getAsset(OVERLAY_PATH.VIGNETTE), 0, 0);
            for (let i = 0; i < this.activeInventory.length; i++) {
                for (let c = 0; c < this.activeInventory[i].length; c++) this.activeInventory[i][c].draw(ctx);
            }
            if (this.hoverText) {
                ctx.save();
                ctx.globalAlpha = 0.75;
                ctx.fillStyle = 'black';
                ctx.font = "bold 15px Helvetica";
                ctx.strokeStyle = 'white';
                ctx.fillStyle = 'black';
                ctx.lineWidth = 3;
                ctx.lineJoin="round";
                ctx.miterLimit=2;
                ctx.strokeText(this.hoverText, mouse.x, mouse.y);
                ctx.lineWidth = 1;
                ctx.fillText(this.hoverText, mouse.x, mouse.y);
                ctx.restore();
            }
        } else {
            ctx.save();
            ctx.globalAlpha = 0.7;
            for (let c = 0; c < 4; c++) this.activeInventory[0][c].draw(ctx);
            ctx.restore();
        }
    }
    
    update(menuActive, click, mouse) {
        for (let i = 0; i < this.activeInventory.length; i++) { // update every active container
            for (let j = 0; j < this.activeInventory[i].length; j++) {
                this.activeInventory[i][j].update();
            }
        }

        if (menuActive) { // ui is active
            if (!this.splitMode) {
                let check = this.checkHit(mouse); // item text
                if (check && check.item) this.hoverText = check.item.tag; // cleanTag(check.item.tag);
                else this.hoverText = null;
            }
            if (click && this.checkNew(click)) { // there is a click and it is unique
                if (click.w === 1) { // left click
                    let hit = this.checkHit(click); // what was left click: container or nothing
                    if (hit) { // container
                        if (hit.keyword == null) { // normal container
                            if (!this.splitMode) {
                                this.selectContainer(hit, click);
                            } else if (hit.item == null) { // split into empty container
                                this.splitViaContainer(hit, click);
                            } else if (hit.item.tag === this.selectedContainer.item.tag) { // split on similar container
                                this.swapViaContainer(hit);
                                this.clearSplit();
                                this.lastClick = click;
                            } else { // cancel split mode
                                this.deselectContainer();
                                this.clearSplit();
                                this.lastClick = click;
                            }
                        } else if (hit.keyword !== 'recipe') { // product container
                            this.deselectContainer();
                            this.clearSplit();
                            this.craftContainerItem(hit, click);
                        } else {
                            this.deselectContainer();
                            this.clearSplit();
                        }
                    }
                } else if (click.w === 3 && this.selectedContainer && this.selectedContainer.item) { // right click
                    this.splitMode = true;
                    if (this.selectedContainer.count > this.splitCount) this.splitCount++;
                    this.hoverText = this.splitCount;
                    this.lastClick = click;
                }
            }
            // Old code if we decide to go for button hold feature
            /*let hit = this.checkHit(click); // what was click: container or nothing
            if (hit && click.w === 1) { // left click on container
                if (hit.keyword == null) { // container isn't special
                    if (this.lastClick == null || click.t !== this.lastClick.t) this.selectContainer(hit, click);
                } else if (hit.keyword !== 'recipe') { // product container
                    this.deselectContainer();
                    if (this.lastClick == null || click.t !== this.lastClick.t) this.craftContainerItem(hit, click);
                }
            } else if (this.selectedContainer && click && click.w === 3) { // something selected, right click stack split
                this.splitMode = true;
                console.log('splitting');
                //     if (click.w === 3) this.splitCount++;
                //     console.log(this.splitCount);
                //     // need to add way to decrease split
                //     // separate off left click functionality
                //     // check: can only split non-null
                //     // check: can only split up to max count
            }*/
        } else { // ui is not active
            this.deselectContainer(); // if something is selected deselect it
            this.clearSplit();
            this.lastClick = null; // don't bother remembering last click
        }
    }

    checkNew(click) {
        return this.lastClick == null || click.t !== this.lastClick.t;
    }

    // return container clicked on
    checkHit(click) {
        if (click) {
            for (let i = 0; i < this.activeInventory.length; i++) {
                for (let c = 0; c < this.activeInventory[i].length; c++) {
                    let container = this.activeInventory[i][c];
                    let width = container.width;
                    if (click.x >= container.x && click.x <= container.x + width &&
                        click.y >= container.y && click.y <= container.y + width) {
                            return this.activeInventory[i][c];
                    }
                }
            }
        }
    }

    checkSufficient(recipe, owner='player') {
        let craftable = true;
        for (let i = 1; i < recipe.length && craftable; i++) craftable = this.checkCount(recipe[i], owner);
        return craftable;
    }

    checkCount(requisite, owner='player') {
        let item = requisite.item;
        let cost = requisite.count;
        if (owner === 'player') return (this.playerCounts.get(item.tag) ? this.playerCounts.get(item.tag) >= cost : false);
        let count = 0;
        let inventory = this.getInventory(owner)
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].item && inventory[i].item.tag === item.tag) count += inventory[i].count;
        }
        return count >= cost;
    }

    clearSplit() {
        this.hoverText = null;
        this.splitMode = false;
        this.splitCount = 0;
    }

    clearContainer(container) {
        container.item = null;
        container.count = 0;
    }
    
    deselectContainer() {
        if (this.selectedContainer) {
            this.selectedContainer.selected = false;
            this.selectedContainer = null;
        }
    }

    selectContainer(hit, click) {
        if (!this.selectedContainer) { // no current container
            hit.selected = true;
            this.selectedContainer = hit;
        } else this.swapViaContainer(hit); // there is already a selected container
        this.lastClick = click;
    }
    
    craftContainerItem(product, click) {
        let recipe = this.getInventory(product.keyword);
        if (this.checkSufficient(recipe)) {
            for (let i = 1; i < recipe.length; i++) this.removeForCrafting(recipe[i]);
            let product = recipe[0];
            this.addToInventory('player', product.item, product.count);
            if (product.item.tag.includes('chest')) {
                let id = 'interact_chest' + this.chestCount++;
                product.item.tag = id;
                this.createChest(id);
            }
        }
        this.lastClick = click;
    }

    createChest(tag) {
        this.createInventory(tag, 1000, 300, 4, 4, 'red');
    }
    
    deleteChest() {}
}

class Container {
    constructor(owner, x, y, slot, fillColor, strokeColor='white', keyword) {
        Object.assign(this, {owner, x, y, slot, fillColor, strokeColor, keyword});
        this.width = 42;
        this.calculateMiddle();
        this.textColor = 'black';
        this.font = 'bold 15';
        
        this.item = null;
        this.count = 0;
        this.selected = false;
    }

    calculateMiddle() {
        let halfway = this.width / 2;
        this.midx = this.x + halfway;
        this.midy = this.y + halfway;
    }

    update() {
        this.displayText = this.count;
    }

    draw(ctx) {
        if (this.selected) this.roundRect(ctx, this.x, this.y, 'orange'); 
        else this.roundRect(ctx, this.x, this.y, this.fillColor);
        if (this.item) {
            let sprite = this.item.components.sprite;
            ctx.save();
            if (this.uncraftable)
                ctx.globalAlpha = 0.40;
            ctx.drawImage(
                sprite.sprite,
                0,
                0,
                sprite.sWidth,
                sprite.sHeight,
                this.midx - sprite.sWidth / 2,
                this.midy - sprite.sHeight / 2,
                sprite.sWidth,
                sprite.sHeight
            );
            
            // testing
            // let itemImage = ASSET_MANAGER.getAsset(this.item.sprite);
            // let shrunkX = itemImage.width * (0.015 * this.width);
            // let shrunkY = itemImage.height * (0.015 * this.width);
            // ctx.drawImage(itemImage, this.midx - shrunkX / 2, this.midy - shrunkY / 2, shrunkX, shrunkY);
            this.drawStrokedText(ctx, this.x + Math.round(0.2 * this.width), this.y + Math.round(0.8 * this.width));
            ctx.restore();
        }
    }

    // credit: https://stackoverflow.com/questions/13627111/drawing-text-with-an-outer-stroke-with-html5s-canvas
    drawStrokedText(ctx, x, y) {
        ctx.save();
        // ctx.globalAlpha = 1;
        ctx.font = this.font + 'px Helvetica';
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 3;
        ctx.lineJoin='round';
        ctx.miterLimit=2;
        ctx.strokeText(this.displayText, x, y);
        ctx.fillStyle = this.textColor;
        if (this.insufficient)
            ctx.fillStyle = 'red';
        ctx.lineWidth = 1;
        ctx.fillText(this.displayText, x, y);
        ctx.restore();
    }

    // credit: https://www.scriptol.com/html5/canvas/rounded-rectangle.php
    roundRect(ctx, x, y, color, radius=15) {
        let r = x + this.width;
        let b = y + this.width;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth='2';
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

// credit: https://stackoverflow.com/questions/13627111/drawing-text-with-an-outer-stroke-with-html5s-canvas
/*function drawStrokedText(ctx, x, y) {
    ctx.save();
    // ctx.globalAlpha = 1;
    ctx.font = this.font + 'px Helvetica';
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 3;
    ctx.lineJoin='round';
    ctx.miterLimit=2;
    ctx.strokeText(this.displayText, x, y);
    ctx.fillStyle = this.textColor;
    if (this.insufficient)
        ctx.fillStyle = 'red';
    ctx.lineWidth = 1;
    ctx.fillText(this.displayText, x, y);
    ctx.restore();
}*/
