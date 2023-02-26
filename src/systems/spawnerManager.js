


class SpawnerManager {
    constructor(factory, map, player) {

        this.terrainMap = map
        this.player = player
        this.mobFactory = factory

        this.currentLightjelly = 0;
        this.currentBloodsucker = 0;
        this.currentLightbug = 0;
        this.currentWormtank = 0;
        this.currentSpore = 0;
        this.currentWormwood = 0;
        this.currentGrapebomb = 0;

        this.waspTimer = 0
        this.bloodSuckerTimer = 0
        this.caveTimer = 0
        this.playerLocationTimer = 0

        this.caveSpawnTimer = 5
        this.setPlayerLocationTime = 10
        this.playerPos = null

        this.spawnTime = 10
        this.mobList = [
            'creeperilla',
            'dirtcarver',
            'electrojelly',
            'lightjelly',
            'mossfly',
            'silverfish',
            'spikejumper',
            'wormtank',
        ]
    }

    update(deltaTime) {
        
        this.waspTimer += deltaTime * .5
        this.bloodSuckerTimer += deltaTime * .5
        this.caveTimer += deltaTime
        this.playerLocationTimer += deltaTime

        if(this.waspTimer > this.spawnTime) {
            this.waspTimer = 0
            console.log('spawning vengefly')
            this.spawnMob('vengefly', 3)
        }
        if(this.bloodSuckerTimer > this.spawnTime) {
            this.bloodSuckerTimer = 0
            console.log('spawning bloodsucker')
            this.spawnMob('bloodsucker', 2)
        }
        if (this.playerLocationTimer > this.setPlayerLocationTime) {
            this.playerLocationTimer = 0
            if(!this.playerPos || 
                getDistance({x:this.player.components.transform.x,
                             y:this.player.components.transform.y},
                              this.playerPos) > HEIGHT * 1.5) {
                console.log("setting new pos")
                this.playerPos = {
                    x: this.player.components.transform.x,
                    y: this.player.components.transform.y
                }
            }
            this.spawnMob(this.mobList[randomInt(this.mobList.length)])
        }

    }

    spawnMob(mob, max) {
        let playerCurrentPos = {
            x: this.player.components.transform.x,
            y: this.player.components.transform.y
        }
        let dist = getDistance(playerCurrentPos, this.playerPos)
        console.log(dist)
        console.log(playerCurrentPos.y, HEIGHT_PIXELS * .5)
        if(playerCurrentPos.y < HEIGHT_PIXELS * .5) {
            let amount = randomNumber(1, max)
            for(let i = 0; i < amount; i++) {
                console.log('spawned')
                this.mobFactory.build(mob, playerCurrentPos.x - ( WIDTH * plusOrMinus()), playerCurrentPos.y - BLOCKSIZE * 3)
            }
        } else if(this.playerPos && dist > HEIGHT) {
            console.log("spawning on player pos...")
            this.mobFactory.build(mob, this.playerPos.x, this.playerPos.y)
        }
    }

    
    spawnTestEntities(pos) {
        this.mobFactory.build('spore', pos.x, pos.y - 50);
        this.mobFactory.build('dirtcarver', pos.x - 100, pos.y - 250);
        //spawn on the surface, will not die, main light source
        this.mobFactory.build('lightbug', pos.x + 1200, pos.y - 100);

        //explode with range, dont take out blocks  4k and below
        this.mobFactory.build('grapebomb', pos.x + 500, pos.y - 400);
        //spawn 10k y-position and below (height)
        this.mobFactory.build('wormtank', pos.x + 800, pos.y - 200);
        //spawn first 20 block height
        this.mobFactory.build('wormwood', pos.x - 400, pos.y - 200);
        this.mobFactory.build('bloodsucker', pos.x + +500,
            pos.y -500);
        //creeperilla can jump and shoot projectile, spawn 10k and below
    }

    #LightjellySpawn(){
        let randAngle = Math.random() * 2 * Math.PI;
        let distance = 500
        this.mobFactory.build('lightjelly', pos.x + Math.cos(randAngle) * distance,
            pos.y + Math.sin(randAngle) * distance);
        this.currentLightjelly++;
        // this.currentLightjelly.components.currentCount++;
    }
    #BloodsuckerSpawn(){
        //spawn at 8k and below
        //add random direction with fixed distance from the player
        let randAngle = Math.random() * Math.PI;
        let distance = 1000
        this.mobFactory.build('bloodsucker', pos.x + Math.cos(randAngle) * distance,
            pos.y + Math.sin(randAngle) * distance);
        // this.entityManager.getEntities['bloodsucker'].components['stats'].total++;
        this.currentBloodsucker++;
    }
    #WormtankSpawn(){
        this.mobFactory.build('lightjelly', pos.x, pos.y - 200);
        this.currentWormtank++;
    }
}