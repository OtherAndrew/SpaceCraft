class CraftingMenu {

    builtin_recipes = [
        [{tag: 'laserPistol', name: 'weapon'}],
        [{tag: 'pickaxe_iron'}],
        [{tag: 'interact_table'},
            {tag: 'item_wood', count: 5}],
        [{tag: 'interact_furnace'},
            {tag: 'tile_dirt', count: 10},
            {tag: 'tile_stone', count: 10}],
        [{tag: 'interact_anvil'},
            {tag: 'item_copper bar', count: 5},
            {tag: 'tile_stone', count: 20}],
        [{tag: 'interact_trader'},
            {tag: 'item_tin bar', count: 5},
            {tag: 'tile_stone', count: 20}],
        [{tag: 'interact_station'},
            {tag: 'item_station plan'},
            {tag: 'interact_anvil'},
            {tag: 'interact_furnace'}],
        [{tag: 'interact_hub'},
            {tag: 'item_hub plan'},
            {tag: 'interact_trader'},
            {tag: 'interact_furnace'}]
    ];

    table_recipes = [
        [{tag: 'interact_chest'},
            {tag: 'item_iron bar'},
            {tag: 'item_wood', count: 5}],
        [{tag: 'laserGun', name: 'weapon'},
            {tag: 'laserPistol', name: 'weapon'},
            {tag: 'item_copper bar', count: 5},
            {tag: 'item_charcoal', count: 5}],
        [{tag: 'laserRifle', name: 'weapon'},
            {tag: 'laserGun', name: 'weapon'},
            {tag: 'item_steel bar', count: 10},
            {tag: 'item_charcoal', count: 5}],
        [{tag: 'flamethrower', name: 'weapon'},
            {tag: 'item_iron bar', count: 5},
            {tag: 'item_cobalt bar', count: 10},
            {tag: 'item_charcoal', count: 10}],
        [{tag: 'item_refined silica'},
            {tag: 'tile_silica', count: 5}],
        [{tag: 'item_circuit'},
            {tag: 'item_gold bar'},
            {tag: 'item_amber', count: 5}]
    ];

    furnace_recipes = [
        [{tag: 'item_charcoal'},
            {tag: 'tile_coal'}],
        [{tag: 'item_charcoal'},
            {tag: 'item_wood', count: 2}],
        [{tag: 'item_glass'},
            {tag: 'tile_sand', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_copper bar'},
            {tag: 'tile_copper', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_cobalt bar'},
            {tag: 'tile_cobalt', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_iron bar'},
            {tag: 'tile_iron', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_steel bar'},
            {tag: 'item_iron bar', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_tin bar'},
            {tag: 'tile_tin', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_gold bar'},
            {tag: 'tile_gold', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_titanite bar'},
            {tag: 'tile_titanite', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_ferrite bar'},
            {tag: 'tile_ferrite', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_bismuth bar'},
            {tag: 'tile_bismuth', count: 2},
            {tag: 'item_charcoal'}],
        [{tag: 'item_tungsten bar'},
            {tag: 'tile_tungsten', count: 2},
            {tag: 'item_charcoal'}],
    ];

    anvil_recipes = [
        [{tag: 'pickaxe_copper'},
            {tag: 'pickaxe_iron'},
            {tag: 'item_copper bar', count: 5},
            {tag: 'item_wood', count: 10}],
        [{tag: 'pickaxe_steel'},
            {tag: 'pickaxe_copper'},
            {tag: 'item_steel bar', count: 5},
            {tag: 'item_wood', count: 10}],
        [{tag: 'pickaxe_titanite'},
            {tag: 'pickaxe_steel'},
            {tag: 'item_titanite bar', count: 5},
            {tag: 'item_wood', count: 10}],
        [{tag: 'pickaxe_ferrite'},
            {tag: 'pickaxe_titanite'},
            {tag: 'item_ferrite bar', count: 5},
            {tag: 'item_wood', count: 10}]
    ];

    station_recipes = [
        [{tag: 'handCannon', name: 'weapon'},
            {tag: 'item_handCannon part'},
            {tag: 'item_titanite bar', count: 5},
            {tag: 'item_charcoal', count: 5}],
        [{tag: 'grenadeLauncher', name: 'weapon'},
            {tag: 'item_grenadeLauncher part'},
            {tag: 'item_ferrite bar', count: 5},
            {tag: 'tile_paraffin', count: 5}],
        [{tag: 'minigun', name: 'weapon'},
            {tag: 'item_minigun part'},
            {tag: 'item_bismuth bar', count: 5},
            {tag: 'tile_paraffin', count: 5}],
        [{tag: 'railgun', name: 'weapon'},
            {tag: 'item_railgun part'},
            {tag: 'item_tungsten bar', count: 5},
            {tag: 'tile_paraffin', count: 5}],
        [{tag: 'item_lightArmor'},
            {tag: 'item_keratin', count: 15},
            {tag: 'item_slime', count: 10}],
        [{tag: 'item_heavyArmor'},
            {tag: 'item_lightArmor'},
            {tag: 'item_shell', count: 15},
            {tag: 'item_silk', count: 10}]
    ];

    trader_recipes = [
        [{tag: 'item_station plan'},
            {tag: 'item_cobalt bar', count: 5},
            {tag: 'item_keratin', count: 5}],
        [{tag: 'item_hub plan'},
            {tag: 'item_steel bar', count: 5},
            {tag: 'item_shell', count: 5}],
        [{tag: 'item_amber'},
            {tag: 'item_slime', count: 5}],
        [{tag: 'item_handCannon part'},
            {tag: 'item_silk', count: 5}],
        [{tag: 'tile_paraffin'},
            {tag: 'item_keratin', count: 5}],
        [{tag: 'item_gold bar'},
            {tag: 'item_shell', count: 10}],
        [{tag: 'grenadeLauncher', name: 'weapon'},
            {tag: 'tile_ruby'},
            {tag: 'item_shell'}],
        [{tag: 'minigun', name: 'weapon'},
            {tag: 'tile_ruby'},
            {tag: 'item_silk'}],
        [{tag: 'railgun', name: 'weapon'},
            {tag: 'tile_ruby'},
            {tag: 'item_amber'}],
        [{tag: 'pickaxe_ferrite'},
            {tag: 'tile_ruby'},
            {tag: 'item_wood'}]
    ];

    hub_recipes = [
        [{tag: 'tile_paraffin'},
            {tag: 'item_charcoal', count: 10}],
        [{tag: 'item_paraffintank'},
            {tag: 'item_shell', count: 5},
            {tag: 'item_glass', count: 5}],
        [{tag: 'item_fuel tank'},
            {tag: 'item_paraffintank'},
            {tag: 'item_slime', count: 5},
            {tag: 'item_silk', count: 5}],
        [{tag: 'item_fueltower'}, // requirement for rocket
            {tag: 'item_fuel tank', count: 2},
            {tag: 'item_copper bar', count: 5},
            {tag: 'tile_paraffin', count: 10}],
        [{tag: 'item_smart circuit'},
            {tag: 'item_circuit'},
            {tag: 'item_tungsten bar'},
            {tag: 'item_refined silica'}],
        [{tag: 'item_medical bay'}, // requirement for rocket
            {tag: 'item_bismuth bar', count: 5},
            {tag: 'item_smart circuit', count: 5}],
    ];

    constructor(containManager, entityManager) {
        this.cm = containManager;
        this.entityManager = entityManager;
        this.recipes = [];
        
        this.x = 30;
        this.y = 30;
        this.spacer = 54;

        this.buildRecipe('builtin', this.builtin_recipes);
        this.buildRecipe('table', this.table_recipes);
        this.buildRecipe('furnace', this.furnace_recipes);
        this.buildRecipe('anvil', this.anvil_recipes);
        this.buildRecipe('station', this.station_recipes);
        this.buildRecipe('trader', this.trader_recipes);
        this.buildRecipe('hub', this.hub_recipes);

        this.recipes.forEach(recipe => this.denoteRecipe(recipe));
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
                    generate = this.entityManager.addEntity(generateWeapon(tag));
                } else if (tag.includes('item')) {
                    generate = new Entity(generateItem(tag));
                } else if (tag.includes('interact')) { // interactive
                    generate = new Entity(generateInteractive(tag));
                } else if (tag.includes('pickaxe')) {
                    generate = new Entity(generatePickaxe(tag));
                } else { // tile
                    generate = new Entity(generateBlock(tag,'craftgen'));
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
            ingredient.playerCount = this.cm.getPlayerCounts(ingredient.item.tag);
            ingredient.update = function () {
                this.displayText = this.playerCount + '/' + this.count;
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
                        ingredient.playerCount = playerCount;
                        ingredient.insufficient = playerCount < ingredient.count;
                    }
                }
            }
        }
    }
}
