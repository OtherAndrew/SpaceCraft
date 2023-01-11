
const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();


const tilesPath = './assets/sprites/tiles.png'
ASSET_MANAGER.queueDownload(tilesPath)


ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx, ASSET_MANAGER.cache, tilesPath);
	gameEngine.start();
});
