


class SpawnManager {
    constructor(factory, map, player, collisionSystem) {

        this.terrainMap = map
        this.player = player
        this.mobFactory = factory
        this.collisionSystem = collisionSystem;

        this.elapsedTime = 0
        this.spawnCooldown = 0.33

        this.easyMobList = [
            'silverfish',
            'silverfish',
            'silverfish',
            'silverfish',
            'vengefly',
            'vengefly',
            'wormwood'
        ]
        this.mediumMobList = [
            'bloodsucker',
            'bloodsucker',
            'dirtcarver',
            'dirtcarver',
            'grapebomb',
            'silverfish',
            'spore',
            'vengefly',
            'wormwood',
        ]
        this.hardMobList = [
            'bloodsucker',
            'dirtcarver',
            'bombfly',
            'electrojelly',
            'mossfly',
            'mossfly',
            'grapebomb',
            'spikejumper',
            'spore',
        ]
        this.veryHardMobList = [
            'bombfly',
            'electrojelly',
            'spikejumper',
            'wormtank',
            'wormtank',
            'mossfly',
            'bloodspore'
        ]
    }

    update(deltaTime, mobList) {
        this.elapsedTime += deltaTime;
        console.log(mobList.length)
        if (this.elapsedTime > this.spawnCooldown && mobList.length < 16) {
            const playerPosition = {
                x: this.player.components['boxCollider'].center.x,
                y: this.player.components['boxCollider'].bottom
            };
            // intervals: 1940
            // ground: 7500
            // bedrock: 14000
            if (isBetween(playerPosition.y, 6530, 8470)) {
                this.spawnMob(getRandom(this.easyMobList), playerPosition);
            } else if (isBetween(playerPosition.y, 8470, 10410)) {
                this.spawnMob(getRandom(this.mediumMobList), playerPosition);
            } else if (isBetween(playerPosition.y, 10410, 12350)) {
                this.spawnMob(getRandom(this.hardMobList), playerPosition);
            } else if (isBetween(playerPosition.y, 12350, 14290)) {
                this.spawnMob(getRandom(this.veryHardMobList), playerPosition);
            }
            this.elapsedTime = 0;
        }
    }

    spawnMob(mob, playerPosition) {
        // console.log(`attempting to spawn ${mob}`)
        const spawnedMob = this.mobFactory.build(mob,
            playerPosition.x - (randomNumber(WIDTH * 0.66, WIDTH) * plusOrMinus()),
            playerPosition.y - (randomNumber(0, HEIGHT * 1.5) * plusOrMinus()));
        if (spawnedMob && this.collisionSystem.checkTileCollision(spawnedMob)) { // check if in tile
            spawnedMob.destroy();
            // console.log(`failed to spawn ${mob}`);
        } else {
            // console.log(`spawned ${mob} at x: ${Math.floor(spawnedMob.components.transform.x)}, y: ${Math.floor(spawnedMob.components.transform.y)}`);
        }
    }
}