/**
 * Constants that are used across the game.
 */

//Game Values
const WIDTH = 1024;
const HEIGHT = 768;
const GRIDSIZE = 15; //don't change lol
const BLOCKSIZE = 32;
const WIDTH_PIXELS = GRIDSIZE * GRIDSIZE * BLOCKSIZE;
const HEIGHT_PIXELS = WIDTH_PIXELS * 2;
const GRAVITY = 1;
const BLOCK_PLACEMENT_DISTANCE = 3.2;
const FALL_DAMAGE_MULTIPLIER = 200;
const MOB_TIMEOUT = 300;
const CHEST_SPAWN_COUNT = 30;
const CHEATCODE = "amogus";

const GENSTATS = {
    BISMUTH	    :	12,
    COAL	    :	15,
    COBALT	    :	13,
    COPPER	    :	12,
    FERRITE	    :	8,
    GOLD	    :	12,
    IRON	    :	13,
    PARAFFIN	:	12,
    RUBY	    :	.01,
    SAND	    :	18,
    SILICA	    :	11,
    TIN	        :	10,
    TITANITE	:	11,
    TUNGSTEN	:	9
}

const BG_PATH = {
    SURFACE_0       :   './assets/backgrounds/surface_background_0.png',
    SURFACE_1       :   './assets/backgrounds/surface_background_1.png',
    UNDERGROUND_0	:	'./assets/backgrounds/underground_0.png',
    UNDERGROUND_3	:	'./assets/backgrounds/underground_3.png',
    UNDERGROUND_4	:	'./assets/backgrounds/underground_4.png',
    CAVE_0          :   './assets/backgrounds/cave_0_50.png',
    CAVE_1          :   './assets/backgrounds/cave_1_50.png',
    CAVE_2          :   './assets/backgrounds/cave_2_50.png',
    CAVE_3          :   './assets/backgrounds/cave_3_50.png',
    MAIN_MENU       :   './assets/menu/splashscreen_start.png'
}

const BG_SCROLL = {
    BACKGROUND_0    :   .03,
    BACKGROUND_1	:	.05,
    BACKGROUND_2	:	.06,
    BACKGROUND_3	:	.07,
    BACKGROUND_4	:	.08,
    BACKGROUND_5	:	.09
}

const CHAR_PATH = {
    BLOODSPORE  :   './assets/sprites/bloodspore.png',
    BLOODSUCKER :	'./assets/sprites/bloodsucker2.png',
    BOMBFLY     :   './assets/sprites/bombfly.png',
    BROODMOTHER :	'./assets/sprites/broodmother.png',
    CREEPERILLA :	'./assets/sprites/creeperilla2.png',
    DIRTCARVER  :	'./assets/sprites/dirtcarver2.png',
    ELECTROJELLY:	'./assets/sprites/electrojelly.png',
    ENTITY      :	'./assets/sprites/entity.png',
    GRAPEBOMB   :	'./assets/sprites/grapebomb2.png',
    LIGHTBUG    :	'./assets/sprites/lightbug.png',
    LIGHTJELLY  :	'./assets/sprites/lightjelly.png',
    MOSSFLY     :	'./assets/sprites/mossfly.png',
    NATIVENPC    :	'./assets/sprites/nativenpc.png',
    PLAYER      :	'./assets/sprites/player2.png',
    ROCKET      :	'./assets/sprites/rocket.png',
    SILVERFISH  :   './assets/sprites/silverfish.png',
    SPIKEJUMPER :   './assets/sprites/spikejumper2.png',
    SPORE       :	'./assets/sprites/spore2.png',
    VENGEFLY    :   './assets/sprites/vengefly.png',
    WORMTANK    :	'./assets/sprites/wormtank2.png',
    WORMWOOD   :	'./assets/sprites/wormwood.png'
}

const CRAFT_COLOR = {
    ANVIL_I: 'black',
    ANVIL_P: 'grey',
    BUILTIN_I: 'pink',
    BUILTIN_P: 'purple',
    FURNACE_I: 'orange',
    FURNACE_P: 'red',
    HUB_I: 'orange',
    HUB_P: 'black',
    STATION_I: 'brown',
    STATION_P: 'grey',
    TABLE_I: 'brown',
    TABLE_P: 'green',
    TRADER_I: 'yellow',
    TRADER_P: 'pink'
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
    GRENADELAUNCHER: './assets/items/broken_grenade_launcher.png',
    HANDCANNON: './assets/items/broken_tech_pistol.png',
    MINIGUN: './assets/items/broken_minigun.png',
    RAILGUN: './assets/items/broken_sniper.png',

    BISMUTH: './assets/items/bismuth_bar.png',
    COBALT: './assets/items/cobalt_bar.png',
    COPPER: './assets/items/copper_bar.png',
    FERRITE: './assets/items/ferrite_bar.png',
    GOLD: './assets/items/gold_bar.png',
    IRON: './assets/items/iron_bar.png',
    PARAFFIN: './assets/items/paraffin_bar.png',
    STEEL: './assets/items/steel_bar.png',
    TIN: './assets/items/tin_bar.png',
    TITANITE: './assets/items/titanite_bar.png',
    TUNGSTEN: './assets/items/tungsten_bar.png',

    AMBER: './assets/items/amber.png',
    KERATIN: './assets/items/mob_dirtCarver.png',
    SHELL: './assets/items/mob_wormTank2.png',
    SLIME: './assets/items/slime.png',
    SILK: './assets/items/spiderSilk2.png',

    CIRCUIT: './assets/items/circuit.png',
    SMART: './assets/items/smartCircuit.png',
    CHARCOAL: './assets/items/coal.png',
    GLASS: './assets/items/glass.png',
    PLEXIGLASS: './assets/items/plexiglass.png',
    REFINED: './assets/items/silica_refined.png',
    WOOD: './assets/items/wood.png',

    HUB: './assets/items/plan_hub.png',
    STATION: './assets/items/plan_station.png',
    PARAFFINTANK: './assets/items/paraffintank.png',
    PARAFFINTANKPLAN: './assets/items/plan_paraffintank.png',
    MEDICAL: './assets/items/medicalBay.png',
    FUEL: './assets/items/fueltank.png',
    FUELTOWER: './assets/items/fueltower.png',
}

const MISC_PATH = {
    CURSOR_CROSSHAIR: './assets/cursors/Crosshairs_Red.png',
    CURSOR_HAND: './assets/cursors/inventoryhand.png',
    CURSOR_PICK: './assets/cursors/pickCursor.cur',
    BULLET: './assets/icons/bullets.png',
    BULLETFRAME: './assets/icons/bullets_frame.png',
    DEATH_EFFECT: './assets/projectiles/death_explosion.png',
    BLOCK_PLACEMENT_GREEN: './assets/cursors/blockPlacementGreen.cur',
    BLOCK_PLACEMENT_RED: './assets/cursors/blockPlacementRed.cur'
}

const OVERLAY_PATH = {
    FOV: './assets/overlays/fov.png',
    INVENTORY: './assets/overlays/inventory.png',
    OBSCURED: './assets/overlays/obscured.png',
    c0000: './assets/overlays/obscured.png',
    c1100: './assets/overlays/obscuredc_nw.png',
    c1000: './assets/overlays/obscuredc_n.png',
    c1010: './assets/overlays/obscuredc_ne.png',
    c0100: './assets/overlays/obscuredc_w.png',
    c0010: './assets/overlays/obscuredc_e.png',
    c0101: './assets/overlays/obscuredc_sw.png',
    c0001: './assets/overlays/obscuredc_s.png',
    c0011: './assets/overlays/obscuredc_se.png',
    o1000: './assets/overlays/obscuredo_nw.png',
    o0100: './assets/overlays/obscuredo_ne.png',
    o0010: './assets/overlays/obscuredo_sw.png',
    o0001: './assets/overlays/obscuredo_se.png',
    VIGNETTE: './assets/overlays/vignette.png'
}

const PROJECTILE_PATH = {
    BOMB        :   './assets/projectiles/bomb.png',
    DARK_ORB    :   './assets/projectiles/orb_invert.png',
    ELECTRICITY :   './assets/projectiles/electricity.png',
    EXPLOSION   :   './assets/projectiles/explosion.png',
    FIRE        :   './assets/projectiles/fire.png',
    IMPACT      :   './assets/projectiles/impact2.png',
    LASER       :   './assets/projectiles/laser.png',
    MINI_BOMB   :   './assets/projectiles/red_bomb.png',
    ORB         :   './assets/projectiles/orb.png'
}

const SOUND_PATH = {
    BOSS                    :   './assets/music/themes/boss_battle.mp3',
    EXPLOSION               :   './assets/music/sfx/pipe_bomb1.wav',
    FALL_DAMAGE             :   './assets/music/sfx/fleshbreak.wav',
    FIRE                    :   './assets/music/sfx/flame_thrower_long.wav',
    GRENADE_LAUNCHER        :   './assets/music/sfx/grenade_launcher_shoot.wav',
    HAND_CANNON             :   './assets/music/sfx/air_burster_shoot.wav',
    HIT1                    :   './assets/music/sfx/hit1.ogg',
    HIT2                    :   './assets/music/sfx/hit2.ogg',
    HIT3                    :   './assets/music/sfx/hit3.ogg',
    LASER                   :   './assets/music/sfx/capper_shoot.wav',
    MINIGUN                 :   './assets/music/sfx/minigun_shoot_long.wav',
    RAILGUN                 :   './assets/music/sfx/sniper_railgun_single_01.wav',
    SMALL_EXPLOSION1        :   './assets/music/sfx/air_burster_explode1.wav',
    SMALL_EXPLOSION2        :   './assets/music/sfx/air_burster_explode2.wav',
    SMALL_EXPLOSION3        :   './assets/music/sfx/air_burster_explode3.wav',
    STRONG_LASER            :   './assets/music/sfx/shooting_star_shoot.wav',
    BLOCK_BREAK             :   './assets/music/sfx/blockBreak.ogg',
    BLOCK_PLACE             :   './assets/music/sfx/blockPlace.ogg',
    BLOCK_DAMAGE            :   './assets/music/sfx/blockDamage.ogg',
    THUNDER_0               :   './assets/music/sfx/thunder1.ogg',
    THUNDER_1               :   './assets/music/sfx/thunder2.ogg',
    THUNDER_2               :   './assets/music/sfx/thunder3.ogg',
    CAVE_0                  :   './assets/music/sfx/cave1.ogg',
    CAVE_1                  :   './assets/music/sfx/cave2.ogg',
    CAVE_2                  :   './assets/music/sfx/cave3.ogg',
    CAVE_3                  :   './assets/music/sfx/cave4.ogg',
    CAVE_4                  :   './assets/music/sfx/cave5.ogg',
    CAVE_5                  :   './assets/music/sfx/cave6.ogg',
    CAVE_6                  :   './assets/music/sfx/cave7.ogg',
    CAVE_7                  :   './assets/music/sfx/cave8.ogg',
    CAVE_8                  :   './assets/music/sfx/cave9.ogg',
    CAVE_9                  :   './assets/music/sfx/cave10.ogg',
    CHEST_OPEN              :   './assets/music/sfx/chestOpen.ogg',
    CHEST_CLOSE             :   './assets/music/sfx/chestClose.ogg',
}

const TILE_LIFE = {
    DIRT    :   35,
    SAND    :   10,
    STONE   :   45
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

const TOOL_DAMAGE = {
    IRON                :   2,
    COPPER              :   4,
    STEEL               :   8,
    TITANITE            :   16,
    FERRITE             :   32,
    SUPER               :   100
}

const TOOL_PATH = {
    IRON                :   './assets/icons/iron_pick.png',
    COPPER              :   './assets/icons/copper_pick.png',
    STEEL               :   './assets/icons/steel_pick.png',
    TITANITE            :   './assets/icons/titanite_pick.png',
    FERRITE             :   './assets/icons/ferrite_pick.png',
    SUPER               :   './assets/icons/super_pickaxe.png',
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
    CHOZO_STATUE        :   './assets/environment/chozoStatue.png',
    RED_PLANET          :   './assets/environment/planet.png'
}

const PATHS = {
    BGS         :   BG_PATH,
    CHARS       :   CHAR_PATH,
    CRAFTS      :   CRAFT_PATH,
    ITEMS       :   ITEM_PATH,
    MISCS       :   MISC_PATH,
    OVERLAYS    :   OVERLAY_PATH,
    PROJECTILES :   PROJECTILE_PATH,
    TILES       :   TILE_PATH,
    TOOLS       :   TOOL_PATH,
    WEAPONS     :   WEAPON_PATH,
    SOUNDS      :   SOUND_PATH,
    ENVS        :   ENV_PATH
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
    TILES       :   TILE_PATH,
    TOOLS       :   TOOL_PATH,
    TOOL_DMGS   :   TOOL_DAMAGE,
    WEAPONS     :   WEAPON_PATH,
    SOUNDS      :   SOUND_PATH,
    ENVS        :   ENV_PATH
}

for (const constant in CONSTANTS) Object.freeze(CONSTANTS[constant])
