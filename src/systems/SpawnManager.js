class SpawnManager {
    constructor(factory, map, player, collisionSystem) {

        this.terrainMap = map
        this.player = player
        this.mobFactory = factory
        this.collisionSystem = collisionSystem;

        this.elapsedTime = 0;
        this.spawnCooldown = 1;

        this.mobList1 = [
            'silverfish',
            'silverfish',
            'vengefly',
            'vengefly',
            'wormwood',
            'wormwood',
            null,
            null,
            null,
            null,
        ]
        this.mobList2 = [
            'dirtcarver',
            'silverfish',
            'silverfish',
            'silverfish',
            'silverfish',
            'silverfish',
            'silverfish',
            'vengefly',
            'vengefly',
            'wormwood'
        ]
        this.mobList3 = [
            'silverfish',
            'silverfish',
            'silverfish',
            'bloodsucker',
            'dirtcarver',
            'dirtcarver',
            'spore',
            'spore',
            'vengefly',
            'vengefly',
        ]
        this.mobList4 = [
            'bloodsucker',
            'bloodsucker',
            'bombfly',
            'dirtcarver',
            'dirtcarver',
            'grapebomb',
            'mossfly',
            'silverfish',
            'spore',
            'vengefly',
        ]
        this.mobList5 = [
            'bloodspore',
            'bloodsucker',
            'bloodsucker',
            'bombfly',
            'dirtcarver',
            'dirtcarver',
            'mossfly',
            'grapebomb',
            'spikejumper',
            'wormtank',
        ]
        this.mobList6 = [
            'bloodspore',
            'bombfly',
            'dirtcarver',
            'electrojelly',
            'mossfly',
            'spikejumper',
            'spikejumper',
            'wormtank',
            'wormtank',
            'wormtank',
        ]
    }

    update(deltaTime, mobList) {
        this.elapsedTime += deltaTime;
        // console.log(Math.floor(this.player.components['boxCollider'].bottom))
        // console.log(`spawned: ${mobList.length}`)
        if (this.elapsedTime > this.spawnCooldown && mobList.length < 10) {
            // console.log(`spawned: ${mobList.length}`)
            const playerPosition = {
                x: this.player.components['boxCollider'].center.x,
                y: this.player.components['boxCollider'].bottom
            };
            // surface: 7200 (7231)
            // underground: 7700 (7647)
            // intervals: 1240
            // bedrock: 13900 (13855)
            if (playerPosition.y < 7700) {
                this.flatSpawn(getRandom(this.mobList1), playerPosition);
                console.log("level 1")
            } else if (isBetween(playerPosition.y, 7700, 8940)) {
                this.vectSpawn(getRandom(this.mobList2), playerPosition);
                console.log("level 2")
            } else if (isBetween(playerPosition.y, 8940, 10180)) {
                this.vectSpawn(getRandom(this.mobList3), playerPosition);
                console.log("level 3")
            } else if (isBetween(playerPosition.y, 10180, 11420)) {
                this.vectSpawn(getRandom(this.mobList4), playerPosition);
                console.log("level 4")
            } else if (isBetween(playerPosition.y, 11420, 12660)) {
                this.vectSpawn(getRandom(this.mobList5), playerPosition);
                console.log("level 5")
            } else if (isBetween(playerPosition.y, 12660, 13900)) {
                this.vectSpawn(getRandom(this.mobList6), playerPosition);
                console.log("level 6")
            }
            this.elapsedTime = 0;
        }
    }

    flatSpawn(mob, playerPosition) {
        // console.log(`attempting to spawn ${mob}`)
        if (!mob) return;
        const spawnedMob = this.mobFactory.build(mob,
            playerPosition.x - (WIDTH * 0.66 * plusOrMinus()),
            playerPosition.y - (randomNumber(0, HEIGHT * 0.5) * plusOrMinus()));
        if (spawnedMob && this.collisionSystem.checkTileCollision(spawnedMob)) { // check if in tile
            spawnedMob.destroy();
            // console.log(`failed to spawn ${mob}`);
        } else {
            // console.log(`spawned ${mob} using flatspawn at x: ${Math.floor(spawnedMob.components.transform.x)}, y: ${Math.floor(spawnedMob.components.transform.y)}`);
            // console.log(`spawned ${mob}`);
        }
    }

    vectSpawn(mob, playerPosition) {
        const spawnVector = randomVector();
        const spawnDistance = randomNumber(WIDTH * 0.66, WIDTH * 0.75)
        const spawnedMob = this.mobFactory.build(mob,
            playerPosition.x - spawnVector.x * spawnDistance,
            playerPosition.y - spawnVector.y * spawnDistance);
        if (spawnedMob && this.collisionSystem.checkTileCollision(spawnedMob)) { // check if in tile
            spawnedMob.destroy();
            // console.log(`failed to spawn ${mob}`);
        } else {
            // console.log(`spawned ${mob} using vectspawn at x: ${Math.floor(spawnedMob.components.transform.x)}, y: ${Math.floor(spawnedMob.components.transform.y)}`);
            // console.log(`spawned ${mob}`);
        }

    }
}