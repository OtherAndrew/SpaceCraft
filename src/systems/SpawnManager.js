class SpawnManager {
    constructor(factory, map, player, collisionSystem) {

        this.terrainMap = map
        this.player = player
        this.mobFactory = factory
        this.collisionSystem = collisionSystem;

        this.elapsedTime = 0;
        this.spawnCooldown = 1;
        this.spawnLimit = 10;

        this.mobList1 = [
            // 'silverfish',
            // 'vengefly',
            // 'vengefly',
            // 'wormwood',
            // 'wormwood',
            // null,
            // null,
            // null,
            // null,
            // null,
            'spikejumper',
            'wormtank',
            'grapebomb'
        ]
        this.mobList2 = [
            'silverfish',
            'silverfish',
            'silverfish',
            'silverfish',
            'silverfish',
            'vengefly',
            'vengefly',
            'vengefly',
            'vengefly',
            'wormwood',
        ]
        this.mobList3 = [
            'dirtcarver',
            'dirtcarver',
            'silverfish',
            'silverfish',
            'silverfish',
            'silverfish',
            'silverfish',
            'spore',
            'vengefly',
            'vengefly',
        ]
        this.mobList4 = [
            'silverfish',
            'silverfish',
            'silverfish',
            'bloodsucker',
            'dirtcarver',
            'dirtcarver',
            'dirtcarver',
            'grapebomb',
            'spore',
            'spore',
        ]
        this.mobList5 = [
            'bloodsucker',
            'bloodsucker',
            'bloodsucker',
            'bombfly',
            'dirtcarver',
            'dirtcarver',
            'dirtcarver',
            'grapebomb',
            'mossfly',
            'spore',
            'spore'
        ]
        this.mobList6 = [
            'bloodspore',
            'bloodsucker',
            'bloodsucker',
            'bombfly',
            'dirtcarver',
            'dirtcarver',
            'mossfly',
            'mossfly',
            'grapebomb',
            'spikejumper',
        ]
        this.mobList7 = [
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
        if (mobList.length < this.spawnLimit && this.elapsedTime > this.spawnCooldown) {
            const playerPosition = {
                x: this.player.components['boxCollider'].center.x,
                y: this.player.components['boxCollider'].bottom
            };
            // surface: 7200 (7231)
            // underground: 7700 (7647)
            // intervals: 1033
            // bedrock: 13900 (13855)
            if (playerPosition.y < 7702) {
                this.flatSpawn(getRandom(this.mobList1), playerPosition);
                console.log("level 1")
            } else if (isBetween(playerPosition.y, 7702, 8735)) {
                this.vectorSpawn(getRandom(this.mobList2), playerPosition);
                console.log("level 2")
            } else if (isBetween(playerPosition.y, 8735, 9768)) {
                this.vectorSpawn(getRandom(this.mobList3), playerPosition);
                console.log("level 3")
            } else if (isBetween(playerPosition.y, 9768, 10801)) {
                this.vectorSpawn(getRandom(this.mobList4), playerPosition);
                console.log("level 4")
            } else if (isBetween(playerPosition.y, 10801, 11834)) {
                this.vectorSpawn(getRandom(this.mobList5), playerPosition);
                console.log("level 5")
            } else if (isBetween(playerPosition.y, 11834, 12867)) {
                this.vectorSpawn(getRandom(this.mobList6), playerPosition);
                console.log("level 6")
            } else if (isBetween(playerPosition.y, 12867, 13900)) {
                this.vectorSpawn(getRandom(this.mobList7), playerPosition);
                console.log("level 7")
            }
            this.elapsedTime = 0;
        }
    }

    /**
     * Spawns a mob slightly off-screen.
     * @param {String} mob Mob to spawn.
     * @param {{x: number, y: number}} playerPosition The player's position
     */
    flatSpawn(mob, playerPosition) {
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

    /**
     * Spawns a mob based on a randomly generated vector originating from the player's position.
     * @param {String} mob Mob to spawn.
     * @param {{x: number, y: number}} playerPosition The player's position
     */
    vectorSpawn(mob, playerPosition) {
        if (!mob) return;
        const spawnVector = randomVector();
        const spawnDistance = randomNumber(WIDTH * 0.66, WIDTH * 0.75);
        const spawnedMob = this.mobFactory.build(mob,
            playerPosition.x - spawnVector.x * spawnDistance,
            playerPosition.y - spawnVector.y * spawnDistance);
        if (spawnedMob && this.collisionSystem.checkTileCollision(spawnedMob)) { // check if in tile
            spawnedMob.destroy();
            // console.log(`failed to spawn ${mob}`);
        } else {
            // console.log(`spawned ${mob} using vectorspawn at x: ${Math.floor(spawnedMob.components.transform.x)}, y: ${Math.floor(spawnedMob.components.transform.y)}`);
            // console.log(`spawned ${mob}`);
        }

    }
}