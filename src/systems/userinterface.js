class HUD {
    constructor(containermanager, player) {
        this.cm = containermanager;
        this.player = player;

        this.containers = this.cm.getInventory("player");
        this.activeContainer = this.containers[0];
        this.refreshActiveInfo();

        // TESTING
        // this.add(new Entity(generateInteractive('interact_anvil')));
        // this.add(new Entity(generateInteractive('interact_hub')));
        // this.add(new Entity(generateInteractive('interact_trader')));
        // this.add(new Entity(generateInteractive('interact_furnace')));
        // this.add(new Entity(generateInteractive('interact_table')));
        // this.add(new Entity(generateInteractive('interact_station')));
        //
        // this.add(new Entity(generateItem('item_fueltower')));
        // this.add(new Entity(generateItem('item_medical bay')));
        this.add(new Entity((generatePickaxe('pickaxe_ferrite'))))
    }

    // TESTING
    add(entity) {
        this.cm.addToPlayer(entity);
    }

    refreshActiveInfo() {
        this.x = this.activeContainer.x;
        this.y = this.activeContainer.y;
    }

    draw(menuActive, ctx) {
        if (!menuActive) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'yellow';
            ctx.rect(this.x, this.y, 42, 42);
            ctx.stroke();
            ctx.restore();

            let active = this.activeContainer.item;
            if (active && active.name && active.name.includes('weapon')) {
                let weaponStats = active.components.weaponProps;
                if (weaponStats.cooldownDuration >= 1) {
                    ctx.drawImage(ASSET_MANAGER.cache[MISC_PATH.BULLETFRAME], 462, 650, 100, 30)
                    let cooldownPercentage;
                    if (weaponStats.cooldownTime === 0 && weaponStats.fireDuration === 0) {
                        cooldownPercentage = 1;
                    } else if (weaponStats.fireTime >= weaponStats.fireDuration) {
                        cooldownPercentage = weaponStats.cooldownTime / weaponStats.cooldownDuration;
                    } else {
                        cooldownPercentage = 1 - weaponStats.fireTime / weaponStats.fireDuration;
                    }
                    ctx.drawImage(ASSET_MANAGER.cache[MISC_PATH.BULLET], 0, 0, 495 * cooldownPercentage, 207, 462, 650,
                        100 * cooldownPercentage, 30)
                }
            }
        }
    }

    update(menuActive, keys, wheel) {
        if (!menuActive) {
            try {
                if (keys['Digit1']) this.activeContainer = this.containers[0];
                if (keys['Digit2']) this.activeContainer = this.containers[1];
                if (keys['Digit3']) this.activeContainer = this.containers[2];
                if (keys['Digit4']) this.activeContainer = this.containers[3];
                if (keys['Digit5']) this.activeContainer = this.containers[4];
                if (keys['Digit6']) this.activeContainer = this.containers[5];
                if (keys['Digit7']) this.activeContainer = this.containers[6];
                if (keys['Digit8']) this.activeContainer = this.containers[7];
                if (keys['Digit9']) this.activeContainer = this.containers[8];
                if (wheel) {
                    let scroll = (wheel.deltaY < 0) ? -1 : 1;
                    this.activeContainer = this.containers[(this.activeContainer.slot === 0 && scroll < 0) ?
                        8 : (this.activeContainer.slot + scroll) % 9];
                }
            } catch (e) {  // edge case where player scrolls far too fast for system to track
                this.activeContainer = this.containers[0];
            } finally {
                this.refreshActiveInfo();
                //this.game.refreshInput();
            }
        }
    }
}
