
const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

/*
const playerPath = './assets/sprites/player.png'
const groundPath = './assets/sprites/layer-5.png'
ASSET_MANAGER.queueDownload(playerPath)
ASSET_MANAGER.queueDownload(groundPath)
*/

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx, ASSET_MANAGER.cache);
	gameEngine.start();
});
