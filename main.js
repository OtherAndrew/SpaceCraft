const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./testimages/bg.png");

ASSET_MANAGER.downloadAll(() => {
	const gameEngine = new GameEngine();

	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	new SceneManager(gameEngine);
	new HUD(gameEngine);

	gameEngine.start();
});
