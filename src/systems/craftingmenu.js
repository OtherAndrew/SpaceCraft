class CraftingMenu {

    builtin_recipes = [
        [{tag: 'interact_furnace'},
            {tag: 'tile_dirt', count: 10},
            {tag: 'tile_stone', count: 20}],
        [{tag: 'interact_anvil'},
            {tag: 'item_copper bar', count: 10},
            {tag: 'tile_dirt', count: 20},
            {tag: 'tile_stone', count: 5}],
        [{tag: 'interact_table'},
            {tag: 'item_iron bar', count: 10},
            {tag: 'item_copper bar', count: 5}],
        [{tag: 'interact_station'},
            {tag: 'interact_table'},
            {tag: 'tile_stone', count: 200},
            {tag: 'tile_copper'}], // trader plan
        [{tag: 'interact_hub'},
            {tag: 'interact_table'},
            {tag: 'tile_stone', count: 200},
            {tag: 'tile_copper'}] // trader plan
    ];

    table_recipes = [
        [{tag: 'interact_trader'},
            {tag: 'tile_stone', count: 80},
            {tag: 'item_copper bar', count: 20}],
        [{tag: 'laserGun', name: 'weapon'},
            {tag: 'laserPistol', name: 'weapon'},
            {tag: 'item_ferrite bar', count: 10},
            {tag: 'tile_coal', count: 20}],
        [{tag: 'laserRifle', name: 'weapon'},
            {tag: 'laserGun', name: 'weapon'},
            {tag: 'item_iron bar', count: 10},
            {tag: 'tile_coal', count: 20}],
        [{tag: 'flamethrower', name: 'weapon'},
            {tag: 'laserGun', name: 'weapon'},
            {tag: 'item_bismuth bar', count: 10},
            {tag: 'tile_coal', count: 20}]
        // [{tag: 'item_refined silica'},
        //     {tag: 'tile_silica', count: 1}],
        // [{tag: 'item_circuit'},
        //     {tag: 'item_gold bar', count: 1},
        //     {tag: 'item_amber', count: 5}],    // amber drop from mossamber (rare 10% chance) and lightjelly
        // [{tag: 'item_furnace'},
        //     {tag: 'tile_dirt', count: 10},
        //     {tag: 'tile_stone', count: 20}],
        // [{tag: 'item_anvil'},
        //     {tag: 'item_copper bar', count: 10},
        //     {tag: 'tile_dirt', count: 30},
        //     {tag: 'tile_stone', count: 5}],
        // [{tag: 'interact_station'},
        //     {tag: 'interact_table', count: 1},
        //     {tag: 'tile_stone', count: 200},
        //     {tag: 'item_station plan', count: 5}]   //buy from trader for 20 wood + 20 amber
    ];

    furnace_recipes = [
        [{tag: 'interact_chest'},       // TESTING
            {tag: 'tile_sand'}],
        [{tag: 'item_bismuth bar'},
            {tag: 'tile_bismuth', count: 5}],
        [{tag: 'item_cobalt bar'},
            {tag: 'tile_cobalt', count: 5}],
        [{tag: 'item_copper bar'},
            {tag: 'tile_copper', count: 5}],
        [{tag: 'item_ferrite bar'},
            {tag: 'tile_ferrite', count: 5}],
        [{tag: 'item_gold bar'},
            {tag: 'tile_gold', count: 5}],
        [{tag: 'item_iron bar'},
            {tag: 'tile_iron', count: 5}],
        [{tag: 'item_paraffin bar'},
            {tag: 'tile_paraffin', count: 5}], // new
        [{tag: 'item_tin bar'},
            {tag: 'tile_tin', count: 5}],
        [{tag: 'item_titanite bar'},
            {tag: 'tile_titanite', count: 5}],
        [{tag: 'item_tungsten bar'},
            {tag: 'tile_tungsten', count: 5}],
        [{tag: 'item_steel bar'},
            {tag: 'item_iron bar', count: 1},
            {tag: 'tile_coal', count: 1},
            {tag: 'tile_silica', count: 1}],
        [{tag: 'item_glass'},
            {tag: 'tile_sand', count: 10}],
        [{tag: 'item_plexiglass'},
            {tag: 'item_glass', count: 10}]
    ];

    anvil_recipes = [
        [{tag: 'item_copper_pickaxe'},
            {tag: 'item_cobalt bar', count: 10},
            {tag: 'item_wood', count: 10}],
        [{tag: 'item_ferrite_pickaxe'},
            {tag: 'item_ferrite_compound bar', count: 10},
            {tag: 'item_wood', count: 10}],
        [{tag: 'item_ferriteCompound_pickaxe'},
            {tag: 'item_fe bar', count: 10},
            {tag: 'item_wood', count: 10}],
        [{tag: 'item_steel_pickaxe'},
            {tag: 'item_steel bar', count: 10},
            {tag: 'item_wood', count: 10}],
        [{tag: 'item_titanium_pickaxe'},
            {tag: 'item_titanite bar', count: 10},
            {tag: 'item_wood', count: 10}]
    ];

    station_recipes = [
        // [{tag: 'item_mossGun'},
        //     {tag: 'item_ferrite bar', count: 10},
        //     {tag: 'item_charcoal', count: 20},
        //     {tag: 'item_wood', count: 10}],
        // [{tag: 'item_carverGun'},
        //     {tag: 'item_iron bar', count: 10},
        //     {tag: 'item_charcoal', count: 20},
        //     {tag: 'item_dirtCarverHide', count: 10}],  //dirtcarverhide from dirtcarver
        // [{tag: 'item_jelloGun'},
        //     {tag: 'item_bismuth bar', count: 10},
        //     {tag: 'item_charcoal', count: 20},
        //     {tag: 'item_stickySlime', count: 20}],  //stickySlime from silverfish
        // [{tag: 'item_hideGun'},
        //     {tag: 'item_tungsten bar', count: 10},
        //     {tag: 'item_charcoal', count: 20},
        //     {tag: 'item_wormTankHide', count: 10}],  //stickySlime from wormTank
        // [{tag: 'item_hunterGun'},
        //     {tag: 'item_titanite bar', count: 10},
        //     {tag: 'item_charcoal', count: 20},
        //     {tag: 'item_hideGun', count: 1}],        //reuse old item
        // [{tag: 'item_smartSuit'},
        //     {tag: 'item_oxygenSuit', count: 1},
        //     {tag: 'item_smartCircuit', count: 1},
        //     {tag: 'item_plexiglass', count: 10}],
        // [{tag: 'item_oxygenSuit'},
        //     {tag: 'item_spiderSilk', count: 1},
        //     {tag: 'item_circuit', count: 1},
        //     {tag: 'item_glassPanel', count: 30}]
    ];

    trader_recipes = [
        [{tag: 'item_craftingTree'},                //a list of all recipes in game
            {tag: 'tile_stone', count: 100}],
        [{tag: 'item_bomb'},
            {tag: 'item_gold bar', count: 1}],
        [{tag: 'item_spiderSilk', count: 10},
            {tag: 'item_bismuth bar', count: 1}],
        [{tag: 'item_station plan'},
            {tag: 'item_wood', count: 20},
            {tag: 'item_amber', count: 20}],
        [{tag: 'item_hub plan'},
            {tag: 'item_steel bar', count: 5}],
        [{tag: 'item_paraffinTank plan'},
            {tag: 'item_spiderSilk', count: 10},
            {tag: 'item_wormTank hide', count: 10},
            {tag: 'item_plexiglass', count: 10}]
    ];

    hub_recipes = [
        [{tag: 'item_graphite'},
            {tag: 'item_charcoal', count: 3},
            {tag: 'item_paraffinTank plan', count: 1}],
        [{tag: 'item_ferrite_compound bar'},
            {tag: 'item_ferrite bar', count: 3},
            {tag: 'item_iron bar', count: 1}],
        [{tag: 'item_smartCircuit'},
            {tag: 'item_circuit', count: 1},
            {tag: 'item_tungsten bar', count: 1},
            {tag: 'item_refinedSilica', count: 1}],
        [{tag: 'item_graphite'},
            {tag: 'item_charcoal', count: 3},
            {tag: 'item_paraffinTank plan', count: 1}],
        [{tag: 'item_coal'},
            {tag: 'item_charcoal', count: 3},
            {tag: 'item_keratin', count: 1}],      //keratin can drop from bloodsucker
        [{tag: 'item_paraffinTank'},
            {tag: 'tile_paraffin', count: 5},
            {tag: 'item_paraffinTank plan', count: 1}],
        [{tag: 'item_medicalBay'},               // requirement for rocket
            {tag: 'item_bismuth bar', count: 10},
            {tag: 'item_smartCircuit', count: 10}],
        [{tag: 'item_fuelTank'},               // requirement for rocket
            {tag: 'item_paraffinTank', count: 2}],
        [{tag: 'item_fuelTower'},               // requirement for rocket
            {tag: 'item_fuelTank', count: 2},
            {tag: 'item_spiderGland', count: 1}]    //drop from spider boss
    ];

    constructor(containManager) {
        this.cm = containManager;
        this.recipes = [];

        // TESTING
        this.x = 30;
        this.y = 30;
        this.spacer = 54;

        this.buildRecipe('builtin', this.builtin_recipes);
        // this.buildRecipe('table', this.table_recipes);
        // this.buildRecipe('furnace', this.furnace_recipes);
        // this.buildRecipe('anvil', this.anvil_recipes);
        // this.buildRecipe('station', this.station_recipes);
        // this.buildRecipe('trader', this.trader_recipes);
        // this.buildRecipe('hub', this.hub_recipes);

        this.recipes.forEach(recipe => this.denoteRecipe(recipe));

        // this.cm.loadInventory('builtin');
    }

    buildRecipe(owner, recipes) {
        for (let i = 0; i < recipes.length; i++) {
            let id = i + '_' + owner;
            this.cm.createInventory(
                id,
                this.x,
                this.y + this.spacer * i,
                1,
                recipes[i].length,
                CRAFT_COLOR[owner.toUpperCase() + '_I'],
                'recipe'
            );
            for (let j = 0; j < recipes[i].length; j++) {
                let item = recipes[i][j];
                let tag = item.tag;
                let generate;
                if (item.name && item.name.includes('weapon')) {
                    generate = new Entity(generateWeapon(tag));
                } else if (tag.includes('item')) {
                    generate = new Entity(generateItem(tag));
                } else if (tag.includes('interact')) { // interactive
                    generate = new Entity(generateInteractive(tag));
                } else { // tile
                    generate = new Entity(generateBlock(tag, 0, 0, 'craftgen'));
                }
                this.cm.addToInventory(
                    id,
                    generate,
                    item.count
                );
            }
            this.recipes.push(id);
        }
    }

    denoteRecipe(owner) {
        let recipe = this.cm.getInventory(owner)
        let product = recipe[0];
        product.keyword = owner;
        product.font = 'bold 20';
        product.fillColor = CRAFT_COLOR[cleanTag(owner.toUpperCase()) + '_P'];
        product.x -= 7;
        product.y -= 4;
        product.width += 7;
        product.calculateMiddle();

        for (let i = 1; i < recipe.length; i++) {
            let ingredient = recipe[i];
            ingredient.font = '12'
            ingredient.playerCount = this.cm.playerCounts.get(ingredient.item.tag);
            ingredient.update = function () {
                this.displayText = ingredient.playerCount + '/' + this.count;
            }
        }
    }

    update(menuActive) {
        if (menuActive) {
            let actives = this.cm.activeInventory;
            for (let i = 2; i < actives.length; i++) {
                if (this.recipes.includes(actives[i][0].owner)) { // if this is recognized as a recipe
                    actives[i][0].uncraftable = !this.cm.checkSufficient(actives[i]);  // check if player can make it
                    for (let j = 1; j < actives[i].length; j++) { // update each ingredient
                        let ingredient = actives[i][j];
                        let playerCount = this.cm.getPlayerCounts(ingredient.item.tag);
                        if (playerCount) {
                            ingredient.playerCount = playerCount;
                            ingredient.insufficient = playerCount < ingredient.count;
                        } else {
                            ingredient.playerCount = 0;
                            ingredient.insufficient = true;
                        }
                    }
                }
            }
        }
    }
}
