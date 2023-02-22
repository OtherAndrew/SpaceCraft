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
const BLOCK_PLACEMENT_DISTANCE = 3.2
const FALL_DAMAGE_MULTIPLIER = 200;

const MAXCREEPERILA = 2;
const MAXDIRTCARVER = 5;
const MAXLIGHTJELLY = 2;
const MAXSPORE = 10;
const MAXLIGHTBUG = 1;
const MAXGRAPEBOMB = 3;
const MAXBLOODSUCKER = 2;
const MAXWORMTANK = 5;

const GENSTATS = {
    BISMUTH	    :	6,
    COAL	    :	13,
    COBALT	    :	8,
    COPPER	    :	10,
    FERRITE	    :	5,
    GOLD	    :	8,
    IRON	    :	11,
    PARAFFIN	:	4,
    RUBY	    :	3,
    SAND	    :	16,
    SILICA	    :	9,
    TIN	        :	7,
    TITANITE	:	3,
    TUNGSTEN	:	6
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

const SOUND_PATH = {
    BOSS            : './assets/music/themes/boss_battle.mp3'
}

// const BG_SCROLL = {
//     SPEED_0 :	.03,
//     SPEED_1	:	.05,
//     SPEED_2	:	.06,
//     SPEED_3	:	.07,
//     SPEED_4	:	.08,
//     SPEED_5	:	.09
// }

// ALT SOLUTION
const BG_SCROLL = {
    BACKGROUND_0    :   .03,
    BACKGROUND_1	:	.05,
    BACKGROUND_2	:	.06,
    BACKGROUND_3	:	.07,
    BACKGROUND_4	:	.08,
    BACKGROUND_5	:	.09
}

const CHAR_PATH = {
    BLOODSUCKER :	'./assets/sprites/bloodsucker2.png',
    BROODMOTHER :	'./assets/sprites/broodmother.png',
    CREEPERILLA :	'./assets/sprites/creeperilla.png',
    DIRTCARVER  :	'./assets/sprites/dirtcarver2.png',
    ENTITY      :	'./assets/sprites/entity.png',
    GRAPEBOMB   :	'./assets/sprites/grapebomb2.png',
    LIGHTBUG    :	'./assets/sprites/lightbug.png',
    LIGHTJELLY  :	'./assets/sprites/lightjelly.png',
    MOSSAMBER   :	'./assets/sprites/mossamber.png',
    MOSSFLY     :	'./assets/sprites/mossfly.png',
    PLAYER      :	'./assets/sprites/player.png',
    ROCKET      :	'./assets/sprites/rocket.png',
    SPORE       :	'./assets/sprites/spore2.png',
    WORMTANK    :	'./assets/sprites/wormtank2.png',
    WASP        :   './assets/sprites/wasp.png'
}

const CRAFT_COLOR = {
    ANVIL_I     :   'black',
    ANVIL_P     :   'grey',
    BUILTIN_I   :   'pink',
    BUILTIN_P   :   'purple',
    FURNACE_I   :   'orange',
    FURNACE_P   :   'red',
    HUB_I       :   'orange',
    HUB_P       :   'black',
    STATION_I   :   'red',
    STATION_P   :   'yellow',
    TABLE_I     :   'brown',
    TABLE_P     :   'green',
    TRADER_I    :   'yellow',
    TRADER_P    :   'pink'
}

const CRAFT_PATH = {
    ANVIL   :   './assets/interactives/furniture/anvil.png',
    CHEST   :   './assets/interactives/furniture/chest.png',
    FURNACE :   './assets/interactives/furniture/furnace.png',
    HUB     :   './assets/interactives/furniture/hub.png',
    STATION :   './assets/interactives/furniture/station.png',
    TABLE   :   './assets/interactives/furniture/table.png',
    TRADER  :   './assets/interactives/furniture/trader.png'
}

const ITEM_PATH = {
    BROKEN_GRENADE_LAUNCHER : './assets/items/broken_grenade_launcher.png',
    BROKEN_MINIGUN          : './assets/items/broken_minigun.png',
    BROKEN_RAILGUN          : './assets/items/broken_sniper.png',
    BISMUTH	    :	'./assets/interactives/products/bismuth_bar.png',
    COBALT	    :	'./assets/interactives/products/cobalt_bar.png',
    COPPER	    :	'./assets/interactives/products/copper_bar.png',
    FERRITE	    :	'./assets/interactives/products/ferrite_bar.png',
    GOLD	    :	'./assets/interactives/products/gold_bar.png',
    IRON	    :	'./assets/interactives/products/iron_bar.png',
    PARAFFIN	:	'./assets/interactives/products/paraffin_bar.png',
    STEEL       :   './assets/interactives/products/steel_bar.png',
    TIN	        :	'./assets/interactives/products/tin_bar.png',
    TITANITE	:	'./assets/interactives/products/titanite_bar.png',
    TUNGSTEN	:	'./assets/interactives/products/tungsten_bar.png'
}

const MISC_PATH = {
    CURSOR_CROSSHAIR    :   './assets/cursors/Crosshairs_Red.png',
    CURSOR_HAND         :   './assets/cursors/inventoryhand.png',
    CURSOR_PICK	        :	'./assets/cursors/pickCursor.cur',
    BULLET              :   './assets/icons/bullets.png',
    BULLETFRAME         :   './assets/icons/bullets_frame.png',
    DEATH_EFFECT	    :	'./assets/projectiles/death_explosion.png',
    PICK	            :	'./assets/icons/item_3485.png',
    BLOCK_PLACEMENT_GREEN     :   './assets/cursors/blockPlacementGreen.cur',
    BLOCK_PLACEMENT_RED     :   './assets/cursors/blockPlacementRed.cur'
}

const OVERLAY_PATH = {
    INVENTORY   :   './assets/overlays/inventory.png',
    VIGNETTE    :   './assets/overlays/vignette.png',
    FOV         :   './assets/overlays/fov.png'
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
    DIRT    :   2,
    RUBY    :   5,
    STONE   :   3
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

const ENV_PATH = {
    CHOZO_STATUE        :   './assets/environment/chozoStatue.png'
}

const PATHS = {
    BGS         :   BG_PATH,
    CHARS       :   CHAR_PATH,
    CRAFTS      :   CRAFT_PATH,
    ITEMS       :   ITEM_PATH,
    MISCS       :   MISC_PATH,
    OVERLAYS    :   OVERLAY_PATH,
    PROJECTILES :   PROJECTILE_PATH,
    TESTS       :   TEST_PATH,
    TILES       :   TILE_PATH,
    WEAPONS     :   WEAPON_PATH,
    SOUNDS      :   SOUND_PATH,
    ENV_PATH    :   ENV_PATH
}

const CONSTANTS = {
    BGS         :   BG_PATH,
    BGSCROLLS   :   BG_SCROLL,
    CHARS       :   CHAR_PATH,
    CRAFTS      :   CRAFT_PATH,
    CRAFTCOLORS :   CRAFT_COLOR,
    ITEMS       :   ITEM_PATH,
    LIVES       :   TILE_LIFE,
    MISCS       :   MISC_PATH,
    OVERLAYS    :   OVERLAY_PATH,
    PROJECTILES :   PROJECTILE_PATH,
    TESTS       :   TEST_PATH,
    TILES       :   TILE_PATH,
    WEAPONS     :   WEAPON_PATH,
    SOUNDS      :   SOUND_PATH,
    ENV_PATH    :   ENV_PATH
}

for (const constant in CONSTANTS) Object.freeze(CONSTANTS[constant])
