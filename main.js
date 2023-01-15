
const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();


const tilesDirtPath = './assets/sprites/tilesDirt.png'
const tilesStonePath = './assets/sprites/tilesStone.png'
const tilesRubyPath = './assets/sprites/tilesRuby.png'
const backgroundCavePath = './assets/sprites/backgrounds/cave_background.png'
ASSET_MANAGER.queueDownload(tilesDirtPath)
ASSET_MANAGER.queueDownload(tilesStonePath)
ASSET_MANAGER.queueDownload(tilesRubyPath)
ASSET_MANAGER.queueDownload(backgroundCavePath)


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx, ASSET_MANAGER.cache, tilesDirtPath, tilesStonePath, tilesRubyPath, backgroundCavePath);
	gameEngine.start();
});
