
const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();


TERRAIN_ASSETS_ARRAY.forEach(asset => {
	ASSET_MANAGER.queueDownload(asset)
})

ASSET_MANAGER.queueDownload(PLAYER_PATH);
ASSET_MANAGER.queueDownload(ENTITY_PATH);

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx, ASSET_MANAGER.cache);
	gameEngine.start();
});
