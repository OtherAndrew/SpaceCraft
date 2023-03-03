class ContainerManager {
    hotbarLength = 9;
    
    constructor() {
        this.owners = {};               // owners and their inventory

        this.slots = [];                // All containers by universal slot id
        this.slotID = 0;                // universal slot id

        this.activeInventory = [];      // interactive inventories
        this.drawnInventory = [];       // TODO inventories on screen

        this.playerCounts = new Map;    // internal tracking of player items and their counts

        this.activeContainer = null;    // previously selected container
        this.lastClick = null;          // previous mouse click

        this.textBox = null;            // display area for changes in player inventory
        this.hoverText = null           // information displayed on mouseover

        this.splitMode = false;         // mode denoting whether splitting has been initiated
        this.splitCount = 0;            // counter for current split

        this.chestCount = 0;            // counter for new chests
        this.reuseChest = [];           // reusable chest inventories

        this.createInventory("player", 302, 690, 4, this.hotbarLength, undefined, "reverse");
        this.createInventory(null, 678, 502, 1, 1, "red");

        this.loadInventory("player");
        this.loadInventory(null);
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
    createInventory(owner, x, y, row, col, color = 'blue', keyword = null) {
        let newInventory = [];
        let internalCount = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (keyword == null) { // ordinary container
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y + (47 * i), this.slotID++, color);
                } else if (keyword === 'reverse') { // player main inventory
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y - (47 * i), this.slotID++, color);
                } else { // other special container
                    newInventory[internalCount] = new Container(
                        owner, x + (47 * j), y + (47 * i), this.slotID++, color, undefined, keyword);
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
        return this.playerCounts.get(tag) ? this.playerCounts.get(tag) : 0;
    }

    addToInventory(owner, item, count = 1) {
        let firstEmpty;
        let inventory = this.getInventory(owner);
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].item && inventory[i].item.tag === item.tag) {
                inventory[i].count += count;
                if (owner === 'player') {
                    this.addPlayerCount(item, count);
                    this.textBox.append(`Added ${count} ${cleanTag(item.tag)} (${this.getPlayerCounts(item.tag)})`);
                }
                return 0;
            } else if (!firstEmpty && !inventory[i].item) firstEmpty = inventory[i];
        }
        if (firstEmpty) {
            firstEmpty.item = item;
            firstEmpty.count = count;
            if (owner === 'player') {
                this.addPlayerCount(item, count);
                this.textBox.append(`Added ${count} ${cleanTag(item.tag)} (${this.getPlayerCounts(item.tag)})`);
            }
            return 1;
        } else return -1;
    }

    addPlayerCount(item, count) {
        let tag = item.tag;
        this.playerCounts.set(tag, this.getPlayerCounts(tag) + count);
    }

    minusPlayerCount(item, count) {
        let tag = item.tag;
        let current = this.playerCounts.get(tag);
        if (current) {
            let newCount = current - count;
            if (!newCount) this.playerCounts.delete(tag);
            else this.playerCounts.set(tag, newCount);
        }
    }

    removeFromPlayer(index, count = 1) {
        let container = this.slots[index];
        if (container.item) {
            let active = container.item.tag;
            this.minusPlayerCount(container.item, count);
            this.textBox.append(`Removed ${count} ${cleanTag(active)} (${this.getPlayerCounts(active)})`);
            if (!--container.count) this.clearContainer(container);
            return active;
        }
    }

    removeForCrafting(requisite, owner = 'player') {
        let item = requisite.item;
        let cost = requisite.count;
        let inventory = this.getInventory(owner);
        for (let i = 0; cost > 0 && i < inventory.length; i++) {
            if (inventory[i].item && inventory[i].item.tag === item.tag) {
                let owned = inventory[i].count;
                inventory[i].count -= cost;
                cost -= owned;
                if (inventory[i].count <= 0) this.clearContainer(inventory[i]);
            }
        }
        if (owner === 'player') {
            this.minusPlayerCount(item, requisite.count)
            this.textBox.append(`Removed ${requisite.count} ${cleanTag(item.tag)} (${this.getPlayerCounts(item.tag)})`);
        }
    }

    swapViaContainer(swapContainer) {
        let swapItem = swapContainer.item;
        let swapCount = swapContainer.count;
        let activeItem = this.activeContainer.item;
        let activeCount = this.activeContainer.count;
        if (swapContainer !== this.activeContainer && swapItem && activeItem && swapItem.tag === activeItem.tag) { // stack if same
            swapContainer.count += activeCount;
            this.clearContainer();
        } else if (!swapContainer.owner && activeItem) { // trashcan
            swapContainer.item = activeItem;
            swapContainer.count = activeCount;
            this.clearContainer();
        } else { // swap
            this.activeContainer.item = swapItem;
            swapContainer.item = activeItem;
            this.activeContainer.count = swapCount;
            swapContainer.count = activeCount;
        }
    }

    splitViaContainer(splitContainer) {
        splitContainer.item = this.activeContainer.item; // possibly problematic
        splitContainer.count = this.splitCount;
        this.activeContainer.count -= this.splitCount;
        if (this.activeContainer.count === 0) this.clearContainer();
        this.clearSplit();
    }

    inspectInteraction(container, interaction) {
        let playerContainer;
        if (container.owner === 'player' && this.activeContainer.owner !== 'player') playerContainer = container;
        else if (this.activeContainer.owner === 'player' && container.owner !== 'player') playerContainer = this.activeContainer;
        if (playerContainer && playerContainer.item) this.minusPlayerCount(playerContainer.item, playerContainer.count);
        interaction(container);
        this.deselectContainer();
        if (playerContainer && playerContainer.item) this.addPlayerCount(playerContainer.item, playerContainer.count);
    }

    loadInventory(owner) {
        this.activeInventory.push(this.owners[owner]);
        // console.log(this.owners[owner]);
    }

    loadInventories(tag) {
        for (const owner in this.owners) if (owner.includes(tag)) this.activeInventory.push(this.owners[owner]);
    }

    unloadInventory() {
        if (this.activeInventory.length !== 2) this.activeInventory.length = 2;
    }

    reloadInventory() {
        // if (this.activeInventory.length !== 5) {
        this.unloadInventory();
        this.loadInventories('builtin');
        // }
    }

    draw(menuActive, ctx, mouse) {
        if (menuActive) {
            ctx.drawImage(ASSET_MANAGER.getAsset(OVERLAY_PATH.INVENTORY), 0, 0);
            ctx.drawImage(ASSET_MANAGER.getAsset(OVERLAY_PATH.VIGNETTE), 0, 0);
            for (let i = 0; i < this.activeInventory.length; i++)
                for (let c = 0; c < this.activeInventory[i].length; c++) this.activeInventory[i][c].draw(ctx);
            if (this.hoverText) {
                ctx.save();
                ctx.globalAlpha = 0.75;
                drawStrokedText(ctx, 'bold 15', 'black', this.hoverText, mouse.x, mouse.y);
                ctx.restore();
            }
        } else {
            ctx.save();
            ctx.globalAlpha = 0.7;
            for (let c = 0; c < this.hotbarLength; c++) this.activeInventory[0][c].draw(ctx);
            ctx.restore();
        }
    }

    update(menuActive, click, mouse) {
        for (let i = 0; i < this.activeInventory.length; i++) { // update every active container
            for (let j = 0; j < this.activeInventory[i].length; j++) this.activeInventory[i][j].update();
        }
        if (menuActive) { // ui is active
            if (!this.splitMode) {
                let check = this.checkHit(mouse); // item text
                this.hoverText = (check && check.item) ? cleanTag(check.item.tag) : null;
            }
            if (click && this.checkNew(click)) { // there is a click and it is unique
                if (click.w === 1) { // left click
                    let hit = this.checkHit(click); // what was left click: container or nothing
                    if (hit) { // container
                        if (hit.keyword == null) { // normal container
                            if (!this.splitMode) {
                                this.selectContainer(hit);
                            } else if (hit.item == null) { // split into empty container
                                this.inspectInteraction(hit, this.splitViaContainer.bind(this));
                            } else if (hit.item.tag === this.activeContainer.item.tag) { // split on similar container
                                this.inspectInteraction(hit, this.swapViaContainer.bind(this));
                                this.clearSplit();
                            } else { // cancel split mode
                                this.deselectContainer();
                                this.clearSplit();
                            }
                        } else if (hit.keyword !== 'recipe') { // product container
                            this.deselectContainer();
                            this.clearSplit();
                            this.craftContainerItem(hit); // click
                        } else {
                            this.deselectContainer();
                            this.clearSplit();
                        }
                    }
                } else if (click.w === 3 && this.activeContainer && this.activeContainer.item) { // right click
                    this.splitMode = true;
                    if (this.activeContainer.count > this.splitCount) this.splitCount++;
                    this.hoverText = this.splitCount;
                } else if (click.w === 2 && this.activeContainer && this.activeContainer.item) {
                    let trash = this.getInventory(null)[0];
                    this.inspectInteraction(trash, this.swapViaContainer.bind(this));
                }
                this.lastClick = click;
            }
        } else { // ui is not active
            this.deselectContainer();   // if something is selected deselect it
            this.clearSplit();          // clear any active splits
            this.lastClick = null;      // don't bother remembering last click
        }
    }
    
    // TODO investigate broken splitting

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

    checkSufficient(recipe, owner = 'player') {
        let craftable = true;
        for (let i = 1; craftable && i < recipe.length; i++) craftable = this.checkCount(recipe[i], owner);
        return craftable;
    }

    checkCount(requisite, owner = 'player') {
        let item = requisite.item;
        let cost = requisite.count;
        if (owner === 'player') return this.getPlayerCounts(item.tag) >= cost;
        let count = 0;
        let inventory = this.getInventory(owner)
        for (let i = 0; count < cost && i < inventory.length; i++)
            if (inventory[i].item && inventory[i].item.tag === item.tag) count += inventory[i].count;
        return count >= cost;
    }

    clearSplit() {
        this.hoverText = null;
        this.splitMode = false;
        this.splitCount = 0;
    }

    clearContainer(container = this.activeContainer) {
        container.item = null;
        container.count = 0;
    }

    deselectContainer() {
        if (this.activeContainer) {
            this.activeContainer.selected = false;
            this.activeContainer = null;
        }
    }

    selectContainer(hit) {
        if (!this.activeContainer) { // no current container
            hit.selected = true;
            this.activeContainer = hit;
        } else this.inspectInteraction(hit, this.swapViaContainer.bind(this)); // there is already a selected container
    }

    craftContainerItem(product) {
        let recipe = this.getInventory(product.keyword);
        if (this.checkSufficient(recipe)) {
            for (let i = 1; i < recipe.length; i++) this.removeForCrafting(recipe[i]);
            let product = recipe[0];
            this.addToInventory('player', product.item, product.count);
        }
    }

    registerChest(chest) {
        let index = this.reuseChest.shift();  // grab first value in queue
        if (index) chest.tag += index;
        else {
            chest.tag += this.chestCount++;
            this.createInventory(cleanTag(chest.tag), 302, 408, 2, 9, 'purple');
        }
    }

    deregisterChest(chest) {  // interact_chest0, interact_chest1, ... , interact_chestX
        let index = chest.tag.match(/\d+$/);
        this.reuseChest.push(index[0]);
        chest.tag = 'interact_chest'
    }

    checkChest(chest) {
        let empty = true;
        let linked = this.getInventory(cleanTag(chest.tag));
        for (let i = 0; empty && i < linked.length; i++) empty = !(linked[i].item);
        return empty;
    }
}

class Container {
    baselineWidth = 42;

    constructor(owner, x, y, slot, fillColor, strokeColor = 'white', keyword) {
        Object.assign(this, {owner, x, y, slot, fillColor, strokeColor, keyword});
        
        this.width = this.baselineWidth;
        this.calculateMiddle();
        
        this.textColor = 'black';
        this.font = 'bold 15';

        this.item = null;
        this.count = 0;
        
        this.selected = false;
        this.uncraftable = false;
        this.insufficient = false;
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
        this.roundRect(ctx, this.x, this.y, (this.selected) ? 'orange' : this.fillColor);
        if (this.item) {
            ctx.save();
            if (this.uncraftable) ctx.globalAlpha = 0.40;
            let sprite = this.item.components.sprite;
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
            drawStrokedText(
                ctx,
                this.font,
                (this.insufficient) ? 'red' : this.textColor,
                this.displayText,
                this.x + Math.round(0.2 * this.width), 
                this.y + Math.round(0.8 * this.width)
            );
            ctx.restore();
        }
    }

    // credit: https://www.scriptol.com/html5/canvas/rounded-rectangle.php
    roundRect(ctx, x, y, color, radius = 15) {
        let r = x + this.width;
        let b = y + this.width;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = '2';
        ctx.moveTo(x + radius, y);
        ctx.lineTo(r - radius, y);
        ctx.quadraticCurveTo(r, y, r, y + radius);
        ctx.lineTo(r, y + this.width - radius);
        ctx.quadraticCurveTo(r, b, r - radius, b);
        ctx.lineTo(x + radius, b);
        ctx.quadraticCurveTo(x, b, x, b - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
        ctx.stroke();
    }
}
