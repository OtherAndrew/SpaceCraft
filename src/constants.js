/**
 * Constants that are used across the game.
 */

//Game Values
const WIDTH = 1024
const HEIGHT = 768
const GRIDSIZE = 15
const BLOCKSIZE = 32
const WIDTH_PIXELS = GRIDSIZE * GRIDSIZE * BLOCKSIZE
const HEIGHT_PIXELS = WIDTH_PIXELS * 2
const GRAVITY = 1

const MAXCREEPERILA = 2;
const MAXDIRTCARVER = 5;
const MAXLIGHTJELLY = 2;
const MAXSPORE = 10;
const MAXLIGHTBUG = 1;
const MAXGRAPEBOMB = 3;
const MAXBLOODSUCKER = 2;
const MAXWORMTANK = 5;

// const BISMUTH_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 3.0
// }
// const COAL_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 7.0
// }
// const COBALT_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 3.0
// }
// const COPPER_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 7.0
// }
// const FERRITE_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 3.0
// }
// const GOLD_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 6.0
// }
// const IRON_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 7.0
// }
// const PARAFFIN_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 3.0
// }
// const SAND_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 15.0
// }
// const SILICA_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 5.0
// }
// const TIN_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 2.5
// }
// const TITANITE_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 1.5
// }
// const TUNGSTEN_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 3.0
// }
// const RUBY_GEN_STATS = {
//     yMin: 0,
//     yMax: 0,
//     rate: 0.0
// }

const GENSTATS = {
    BISMUTH	    :	3.0,
    COAL	    :	7.0,
    COBALT	    :	3.0,
    COPPER	    :	7.0,
    FERRITE	    :	3.0,
    GOLD	    :	6.0,
    IRON	    :	7.0,
    PARAFFIN	:	3.0,
    RUBY	    :	2.0,
    SAND	    :	15.0,
    SILICA	    :	5.0,
    TIN	        :	2.5,
    TITANITE	:	1.5,
    TUNGSTEN	:	3.0
}

const BG_PATH = {
    DIRT	        :	'./assets/backgrounds/background_dirt.png',
    SURFACE_0       :   './assets/backgrounds/surface_background_0.png',
    SURFACE_1       :   './assets/backgrounds/surface_background_1.png',
    UNDERGROUND_0	:	'./assets/backgrounds/underground_0.png',
    UNDERGROUND_1	:	'./assets/backgrounds/underground_1.png',
    UNDERGROUND_2	:	'./assets/backgrounds/underground_2.png',
    UNDERGROUND_3	:	'./assets/backgrounds/underground_3.png',
    UNDERGROUND_4	:	'./assets/backgrounds/underground_4.png',
    UNDERGROUND_5	:	'./assets/backgrounds/underground_5.png',
    UNDERGROUND_6	:	'./assets/backgrounds/underground_6.png'
}

const BG_SCROLL = {
    SPEED_0 :	.03,
    SPEED_1	:	.05,
    SPEED_2	:	.06,
    SPEED_3	:	.07,
    SPEED_4	:	.08,
    SPEED_5	:	.09
}

// ALT SOLUTION
// const BG_SCROLL = {
//     BACKGROUND_0    :   .03,
//     BACKGROUND_1	:	.05,
//     BACKGROUND_2	:	.06,
//     BACKGROUND_3	:	.07,
//     BACKGROUND_4	:	.08,
//     BACKGROUND_5	:	.09
// }

const CHAR_PATH = {
    DIRTCARVER  :	'./assets/sprites/dirtcarver.png',
    ENTITY      :	'./assets/sprites/entity.png',
    GRAPEBOMB   :	'./assets/sprites/grapebomb2.png',
    LIGHTBUG    :	'./assets/sprites/lightbug.png',
    LIGHTJELLY  :	'./assets/sprites/lightjelly.png',
    PLAYER      :	'./assets/sprites/player.png',
    SPORE       :	'./assets/sprites/spore2.png',
    WORMTANK    :	'./assets/sprites/wormtank.png',
    ROCKET      :	'./assets/sprites/rocket.png',
    MOSSAMBER   :	'./assets/sprites/mossamber.png',
    BLOODSUCKER :	'./assets/sprites/bloodsucker.png',
    CREEPERILLA :	'./assets/sprites/creeperilla.png'
}

const CRAFT_COLOR = {
    ANVIL   :   'black',
    FURNACE :   'orange',
    TABLE   :   'brown'
}

const CRAFT_PATH = {
    ANVIL   :   './assets/crafting/stations/anvil.png',
    FURNACE :   './assets/crafting/stations/furnace.png',
    TABLE   :   './assets/crafting/stations/table.png'
}

const ITEM_PATH = {
    BROKEN_GRENADE_LAUNCHER : './assets/items/broken_grenade_launcher.png',
    BROKEN_MINIGUN          : './assets/items/broken_minigun.png',
    BROKEN_RAILGUN          : './assets/items/broken_sniper.png'
}

const MISC_PATH = {
    CURSOR_CROSSHAIR    :   './assets/cursors/Crosshairs_Red.png',
    CURSOR_HAND         :   './assets/cursors/inventoryhand.png',
    CURSOR_PICK	        :	'./assets/cursors/pickCursor.cur',
    DEATH_EFFECT	    :	'./assets/projectiles/death_explosion.png',
    PICK	            :	'./assets/icons/item_3485.png'
}

const OVERLAY_PATH = {
    INVENTORY   :   './assets/overlay/inventory.png',
    VIGNETTE    :   './assets/overlay/vignette.png',
    FOV         :   './assets/overlay/fov.png'
}

const PROD_PATH = {
    
}

const PROJECTILE_PATH = {
    BOMB     :   './assets/projectiles/bomb.png',
    DARK_ORB :   './assets/projectiles/orb_invert.png',
    EXPLOSION:   './assets/projectiles/explosion.png',
    FIRE     :   './assets/projectiles/fire.png',
    LASER    :   './assets/projectiles/laser.png',
    MINI_BOMB:   './assets/projectiles/red_bomb.png',
    ORB      :   './assets/projectiles/orb.png'
}

const TEST_PATH = {
    // FOR TEST ASSETS
}

const TILE_LIFE = {
    DIRT    :   20,
    RUBY    :   50,
    STONE   :   30
}

const TILE_PATH = {
    BISMUTH	    :	'./assets/tiles/tilesBismuth.png',
    COAL	    :	'./assets/tiles/tilesCoal.png',
    COBALT	    :	'./assets/tiles/tilesCobalt.png',
    COPPER	    :	'./assets/tiles/tilesCopper.png',
    DIRT	    :	'./assets/tiles/tilesDirt.png',
    FERRITE	    :	'./assets/tiles/tilesFerrite.png',
    GOLD	    :	'./assets/tiles/tilesGold.png',
    IRON	    :	'./assets/tiles/tilesIron.png',
    PARAFFIN	:	'./assets/tiles/tilesParaffin.png',
    RUBY	    :	'./assets/tiles/tilesRuby.png',
    SAND	    :	'./assets/tiles/tilesSand.png',
    SILICA	    :	'./assets/tiles/tilesSilica.png',
    STONE	    :	'./assets/tiles/tilesStone.png',
    TIN	        :	'./assets/tiles/tilesTin.png',
    TITANITE	:	'./assets/tiles/tilesTitanite.png',
    TUNGSTEN	:	'./assets/tiles/tilesTungsten.png',
    BEDROCK     :   './assets/tiles/tilesBedrock.png'
}

const WEAPON_PATH = {
    FLAMETHROWER        :   './assets/weapons/flamethrower.png',
    GRENADE_LAUNCHER    :   './assets/weapons/grenade_launcher.png',
    HAND_CANNON         :   './assets/weapons/tech_pistol.png',
    LASER_GUN           :   './assets/weapons/laser_gun.png',
    LASER_PISTOL        :   './assets/weapons/laser_pistol.png',
    LASER_RIFLE         :   './assets/weapons/laser_rifle.png',
    MINIGUN             :   './assets/weapons/minigun.png',
    MINIGUN_ANIM        :   './assets/weapons/minigun_anim.png',
    RAILGUN             :   './assets/weapons/sniper.png',
    RAYGUN              :   './assets/weapons/raygun.png',
}

const PATHS = {
    BGS         :   BG_PATH,
    CHARS       :   CHAR_PATH,
    CRAFTS      :   CRAFT_PATH,
    MISCS       :   MISC_PATH,
    OVERLAYS    :   OVERLAY_PATH,
    PRODS       :   PROD_PATH,
    PROJECTILES :   PROJECTILE_PATH,
    TESTS       :   TEST_PATH,
    TILES       :   TILE_PATH,
    WEAPONS     :   WEAPON_PATH
}

const CONSTANTS = {
    BGS         :   BG_PATH,
    BGSCROLLS   :   BG_SCROLL,
    CHARS       :   CHAR_PATH,
    CRAFTS      :   CRAFT_PATH,
    CRAFTCOLORS :   CRAFT_COLOR,
    LIVES       :   TILE_LIFE,
    MISCS       :   MISC_PATH,
    OVERLAYS    :   OVERLAY_PATH,
    PRODS       :   PROD_PATH,
    PROJECTILES :   PROJECTILE_PATH,
    TESTS       :   TEST_PATH,
    TILES       :   TILE_PATH,
    WEAPONS     :   WEAPON_PATH
}

for (const constant in CONSTANTS) Object.freeze(CONSTANTS[constant])
