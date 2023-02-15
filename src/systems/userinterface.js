class HUD {
    constructor(containermanager, player) {
        this.cm = containermanager;
        this.player = player;

        // create player inventory and trashcan
        this.cm.createInventory("player", 420, 690, 4, 4, undefined, "reverse");
        this.cm.createInventory(null, 561, 502, 1, 1, "red");
        this.cm.activateInventory("player");
        this.cm.activateInventory(null);

        this.containers = this.cm.getInventory("player");
        this.activeContainer = this.containers[0];
        this.refreshActiveInfo();

        // TESTING
        this.add(new Entity(generateCrafter('craft_table', 0, 0), 0));
        // this.add(new Entity(generateCrafter('craft_furnace', 0, 0), 0));
        // this.add(new Entity(generateCrafter('craft_anvil', 0, 0), 0));
    };

    // TESTING
    add(entity) {
        this.cm.addToInventory("player", entity);
    };

    refreshActiveInfo() {
        this.x = this.activeContainer.x;
        this.y = this.activeContainer.y;
    }

    draw(uiActive, ctx) {
        if (!uiActive) {
            ctx.save();
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.rect(420,670, 183, 10);
            ctx.fill();
            ctx.beginPath();
            let healthPercentage = this.player.components['stats'].currentHealth / this.player.components['stats'].maxHealth;
            if (healthPercentage > 0.75) ctx.fillStyle = "green";
            else if (healthPercentage > 0.50) ctx.fillStyle = "yellow";
            else if (healthPercentage > 0.25) ctx.fillStyle = "orange";
            else ctx.fillStyle = "red";
            ctx.rect(420,670, 183 * healthPercentage, 10); // depends on player health rep
            ctx.fill();
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.rect(420,670, 183, 10);
            ctx.stroke();
            ctx.restore();
            
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "yellow";
            this.refreshActiveInfo();
            ctx.rect(this.x, this.y, 42, 42);
            ctx.stroke();
            ctx.restore();
        }
    }

    update(uiActive, keys) {
        if (!uiActive) {
            if (keys['1']) this.activeContainer = this.containers[0];
            if (keys['2']) this.activeContainer = this.containers[1];
            if (keys['3']) this.activeContainer = this.containers[2];
            if (keys['4']) this.activeContainer = this.containers[3];
        }
    }
}
