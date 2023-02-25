


class SpawnerManager {
    constructor(factory, map, player) {

        this.spawnMap = map
        this.player = player
        this.mobFactory = factory

        this.currentLightjelly = 0;
        this.currentBloodsucker = 0;
        this.currentLightbug = 0;
        this.currentWormtank = 0;
        this.currentSpore = 0;
        this.currentMossamber = 0;
        this.currentGrapebomb = 0;

        this.waspTimer = 0
        this.bloodSuckerTimer = 0
        this.spawnTime = 5
    }

    update(deltaTime) {
        
        this.waspTimer += deltaTime * .1
        this.bloodSuckerTimer += deltaTime * .2
        if(this.waspTimer > this.spawnTime) {
            this.waspTimer = 0
            console.log('spawning wasp')
            this.spawnMob('wasp', 3)
        }
        if(this.bloodSuckerTimer > this.spawnTime) {
            this.bloodSuckerTimer = 0
            console.log('spawning bloodsucker')
            this.spawnMob('mossfly', 2)
        }
    }

    spawnMob(mob, max) {
        let playerPos = {
            x: this.player.components.transform.x,
            y: this.player.components.transform.y
        }
        if(playerPos.y < HEIGHT_PIXELS * .5) {
            let amount = randomNumber(1, max)
            for(let i = 0; i < amount; i++) {
                this.mobFactory.build(mob, playerPos.x - ( WIDTH * plusOrMinus()), playerPos.y - BLOCKSIZE * 3)
            }
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
        this.mobFactory.build('mossamber', pos.x - 400, pos.y - 200);
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