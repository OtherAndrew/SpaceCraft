
const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();

for (const category in PATHS) {
	for (const asset in PATHS[category]) {
		ASSET_MANAGER.queueDownload(PATHS[category][asset])
	}
}

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx, ASSET_MANAGER.cache, canvas);
	gameEngine.start();
});
