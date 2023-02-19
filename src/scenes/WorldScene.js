
class WorldScene extends Scene {


    constructor(game) {
        super()
        this.game = game;
        //keep track of current enemies in scene
        this.currentLightjelly = 0;
        this.currentBloodsucker = 0;
        this.currentLightbug = 0;
        this.currentWormtank = 0;

        this.currentSpore = 0;
        this.currentMossamber = 0;
        this.currentGrapebomb = 0;

        //other game stats --- display during win condition (rocket scene)
        //add total each mob kills
        //total blocks mined
        //total jetpack used
        //total jumps
        //total deaths
    }

    /**
     * Initializes this class' terrain entities
     * Player and player movement are for testing purposes
     * @param assets
     */
    init(assets, canvas) {
        // entities
        //this.genericDeathSprite = assets[GENERICDEATH_PATH];
        this.terrainMap = getTerrain(this.entityManager)
        this.mobFactory = new MobFactory(this.entityManager);

        // this.#createEntity()
        this.player = this.mobFactory.build('player', WIDTH_PIXELS * .5, HEIGHT_PIXELS * .5 - 100);
        this.rocket =
            this.mobFactory.build('rocket', this.player.components.transform.x - 750, this.player.components.transform.y - 200);

        this.spawnTestEntities();

        //this.#genericDeath()
        this.playerMovement = new PlayerController(this.player)
        //this.genericDeathManager = new GenericDeathController(this.lightjelly, this.player)

        this.movementSystem = new MovementSystem(this.entityManager.getEntities, this.player)
        this.mobController = new EntityController(this.entityManager.getEntities, this.player);
        this.renderSystem = new RenderSystem(this.entityManager.getEntities)
        this.camera = new Camera(this.player)
        this.renderBox = new RenderBox(this.player, GRIDSIZE, BLOCKSIZE)
        this.hud = new HUD(this.containerManager, this.player);
        this.craftingMenu = new InteractiveMenu(this.containerManager);
        this.collisionSystem = new CollisionSystem(this.player, this.entityManager.getEntities);
        this.cursorSystem = new CursorSystem(canvas, this.terrainMap, this.hud)
        this.cursorSystem.init()
        // this.worldImages = new WorldImages(this.player)
        // this.worldImages.init(this.entityManager)

        this.projectileManager = new ProjectileManager(this.entityManager)
        this.damageSystem = new DamageSystem(this.entityManager.getEntities)
        this.durationSystem = new DurationSystem(this.entityManager.getEntities)
        this.#givePlayerPickAxe()
        //this.#givePlayerGun()
        //this.#givePlayerFlamethrower()
    }

    spawnTestEntities() {
        this.mobFactory.build('spore', this.player.components.transform.x, this.player.components.transform.y - 50);
        this.mobFactory.build('dirtcarver', this.player.components.transform.x - 100, this.player.components.transform.y - 250);
        //spawn on the surface, will not die, main light source
        this.mobFactory.build('lightbug', this.player.components.transform.x + 1200, this.player.components.transform.y - 100);

        //explode with range, dont take out blocks  4k and below
        this.mobFactory.build('grapebomb', this.player.components.transform.x + 500, this.player.components.transform.y - 400);
        //spawn 10k y-position and below (height)
        this.mobFactory.build('wormtank', this.player.components.transform.x + 800, this.player.components.transform.y - 200);
        //spawn first 20 block height
        this.mobFactory.build('mossamber', this.player.components.transform.x - 400, this.player.components.transform.y - 200);
        //this.mobFactory.build('bloodsucker', this.player.components.transform.x + +500,
        //    this.player.components.transform.y -500);
        //creeperilla can jump and shoot projectile, spawn 10k and below
    }

    #spawnTimer() {
        let playerY = this.player.components.transform.y;
        //spawn condition 13000 y-position every 20 sec until max 3
        if (playerY >= 7500 && (this.currentLightjelly < MAXLIGHTJELLY)) {
            delayFunction(this.#LightjellySpawn(), 15000);
            // this.currentLightjelly++;
        }
        //check player height before spawn
        // if (playerY >= 8000 && (this.currentBloodsucker < MAXBLOODSUCKER)) {
        //     delayFunction(this.#BloodsuckerSpawn(), 20000);
        // }

    }

    #LightjellySpawn(){
        let randAngle = Math.random() * 2 * Math.PI;
        let distance = 500
        this.mobFactory.build('lightjelly', this.player.components.transform.x + Math.cos(randAngle) * distance,
            this.player.components.transform.y + Math.sin(randAngle) * distance);
        this.currentLightjelly++;
        // this.currentLightjelly.components.currentCount++;
    }
    #BloodsuckerSpawn(){
        //spawn at 8k and below
        //add random direction with fixed distance from the player
        let randAngle = Math.random() * Math.PI;
        let distance = 1000
        this.mobFactory.build('bloodsucker', this.player.components.transform.x + Math.cos(randAngle) * distance,
            this.player.components.transform.y + Math.sin(randAngle) * distance);
        // this.entityManager.getEntities['bloodsucker'].components['stats'].total++;
        this.currentBloodsucker++;
    }
    #WormtankSpawn(){
        this.mobFactory.build('lightjelly', this.player.components.transform.x, this.player.components.transform.y - 200);
        this.currentWormtank++;
    }

    update(menuActive, keys, mouseDown, mouse, deltaTime) {
        if (!menuActive) {
            if (this.#checkWinCon()) {
                this.rocket.components["state"].setState("win");
                this.rocket.components['transform'].gravity = 0;
                this.camera.setTarget(this.rocket)
                this.renderBox.setTarget(this.rocket)
                this.player.isDrawable = false
                this.player.components['stats'].invincible = true;
                console.log("win")
            } else if (this.player.components['stats'].currentHealth <= 0) {
                this.player.components["transform"].velocityX = 0;
                this.player.isDrawable = false
                this.player.components['stats'].invincible = true;
                console.log("game over")
            } else {
                // get input
                this.playerMovement.update(keys, deltaTime)
            }
            this.containerManager.reloadInventory();
            // get input
            // this.playerMovement.update(keys, deltaTime)
            // update state
            this.entityManager.update()
            //this.genericDeathManager.update(deltaTime)
            this.renderBox.update()
            this.#updateTileState()
            this.entityManager.getEntities.forEach((e) => this.#checkIfExposed(e));
            this.collisionSystem.refresh()

            this.mobController.update(deltaTime)
            //https://gamedev.stackexchange.com/a/71123
            // update Y first for ledges
            this.movementSystem.updateY(deltaTime)
            this.collisionSystem.resolveTileY()
            this.movementSystem.updateX(deltaTime)
            this.collisionSystem.resolveTileX()

            //this.worldImages.update()
            this.collisionSystem.resolveMobAttack()
            this.collisionSystem.resolveProjectiles()
            this.damageSystem.update();
            this.durationSystem.update(deltaTime)

            // draw
            this.camera.update()
            this.renderSystem.update(deltaTime);
            // temporary spot for this

            this.#spawnTimer();
            if(mouseDown) {
                this.#handleClick(mouse, this.player, this.terrainMap)
            }
        }
        this.cursorSystem.update(menuActive, this.#getGridCell(mouse, this.player))
        this.craftingMenu.update(menuActive);
        this.containerManager.update(menuActive, mouseDown, mouse);
        this.hud.update(menuActive, keys);

        // console.log("currentLightJelly", this.currentLightjelly.components.currentCount)
        // console.log("currentBloodSucker-total", this.entityManager.getEntities['bloodsucker'].components['stats'].total);
        // console.log("playerY", Math.floor(this.player.components["boxCollider"].bottom))
    }

    draw(menuActive, ctx, mouse) {
        if (menuActive) ctx.putImageData(this.game.screenshot, 0, 0);
        else this.renderSystem.draw(ctx, this.camera);

        // this.#drawColliders(ctx);

        this.containerManager.draw(menuActive, ctx, mouse);
        this.hud.draw(menuActive, ctx);
    }

    #drawColliders(ctx) {
        this.entityManager.getEntities.forEach(e => {
            if (e.components.boxCollider) {
                let box = e.components.boxCollider
                ctx.fillStyle = 'rgba(200,200,100,.3)'
                ctx.fillRect(box.x - this.camera.x, box.y - this.camera.y, box.width, box.height)
            }
        });
    }

    /**
     * This method checks to see what is in the bounds of the view screen. 
     * Entities that are within the view screen are marked as drawable so they can be drawn to the ctx.
     * Also, calls check if exposed method to save a loop routine.
     */
    #updateTileState() {
        this.entityManager.getEntities.forEach(e => {
            if(e.tag !== 'player' && !e.tag.includes('background')) {
                if(e.components.transform.x > (this.renderBox.x - BLOCKSIZE) * BLOCKSIZE &&
                e.components.transform.x < (this.renderBox.x + BLOCKSIZE) * BLOCKSIZE &&
                e.components.transform.y > (this.renderBox.y - BLOCKSIZE) * BLOCKSIZE &&
                e.components.transform.y < (this.renderBox.y + BLOCKSIZE) * BLOCKSIZE) {
                    if(!e.isBroken) {
                        e.isDrawable = true
                    }
                    this.#checkIfExposed(e)
                } else {
                    e.isDrawable = false
                }
            }
        })
    }

    /**
     * Checks a drawable entities four directions to see if it is exposed(not completely surrounded by other blocks).
     * A player will be able to collide with an exposed block, so they must be given colliders.
     * @param {Entity} e
     */
    #checkIfExposed(e) {
        const posX = e.components.transform.x / BLOCKSIZE
        const posY = e.components.transform.y / BLOCKSIZE

        if(e.isDrawable && e.tag.includes('tile')) {
            const collider = new CBoxCollider({
                x: e.components.transform.x,
                y: e.components.transform.y,
                width: BLOCKSIZE,
                height: BLOCKSIZE
            });
            if (this.#isExposed(posY, posX)) {
                if (!e.components["boxCollider"]) e.addComponent([collider]);
            } else {
                delete e.components["boxCollider"];
            }
        }
    }

    #isExposed(posY, posX) {
        return posY === 0
               || /air|interact/.test(this.terrainMap[clamp(posY-1,0,posY)][posX].tag)
               || /air|interact/.test(this.terrainMap[posY][clamp(posX - 1, 0, posX)].tag)
               || /air|interact/.test(this.terrainMap[posY][clamp(posX + 1, 0, this.terrainMap[0].length - 1)].tag)
               || /air|interact/.test(this.terrainMap[clamp(posY + 1, 0, this.terrainMap.length - 1)][posX].tag)
               || /air|interact/.test(this.terrainMap[clamp(posY - 1, 0, this.terrainMap.length - 1)][posX].tag);
    }

    #handleClick(pos, player, terrainMap) {
        let coords = this.#getGridCell(pos, player)
        let mapY = coords.y || 0;
        let mapX = coords.x || 0;
        let selected = terrainMap[mapY][mapX];
        console.log(selected.tag)
        let active = this.hud.activeContainer.item;
        if (active) {
            if(/tile|interact/.test(active.tag)) {
                if(selected.tag.includes('air')) {
                    let tag = this.containerManager.removeFromPlayer(this.hud.activeContainer.slot);
                    let newBlock;
                    if (active.tag.includes('interact')) {
                        newBlock = this.entityManager.addEntity(generateInteractive(tag, mapX, mapY));
                        if (active.tag.includes('chest')) this.containerManager.registerChest(newBlock);
                    } else newBlock = this.entityManager.addEntity(generateBlock(tag, mapX, mapY, 'worldgen'));
                    if (newBlock) {
                        selected.tag = newBlock.tag
                        selected.id = newBlock.id
                        console.log(newBlock)
                    }
                }
            } else if (active.tag === 'pickaxe') {
                if(/tile|interact/.test(selected.tag)) {
                    let destroyable = true;
                    if (selected.tag.includes('chest')) destroyable = this.containerManager.checkChest(selected);
                    if (destroyable) {
                        let e = this.entityManager.getEntity(selected.id)
                        e.components.lifespan.current -= 1
                        if(e.components.lifespan.current <= 0) {
                            if (selected.tag.includes('chest')) this.containerManager.deregisterChest(e);
                            selected.tag = 'air'
                            selected.id = null
                            delete e.components["boxCollider"]
                            this.containerManager.addToInventory('player', this.#resizeBlock(e))
                        }
                    }
                }
            } else if (active.tag === 'gun') {
                this.projectileManager.shoot('bullet', {x: pos.x + 25/2, y: pos.y + 25/2}, player)
            } else if (active.tag === 'flamethrower') {
                this.projectileManager.shoot('fire', {x: pos.x + 25/2, y: pos.y + 25/2}, player)
            }
        } else if (selected.tag.includes('interact')) {
            this.containerManager.unloadInventory();
            console.log('attempting load:'+cleanTag(selected.tag))
            this.containerManager.loadInventory(cleanTag(selected.tag));
            this.game.activateMenu();
        }
    }
    
    #getGridCell(pos, player) {
        if(pos === null) return null
        const pCollider = player.components["boxCollider"]
        let offsetX = pCollider.center.x >= WIDTH/2 ?
                      pCollider.center.x >= WIDTH_PIXELS - WIDTH/2 ?
                      WIDTH_PIXELS - (WIDTH_PIXELS - pCollider.center.x) - WIDTH * .75 :
                      (pCollider.center.x - WIDTH/2) : 0
        let mapX = Math.floor((pos.x + offsetX)/BLOCKSIZE)
        let mapY = Math.floor((pos.y + (pCollider.center.y - HEIGHT/2))/BLOCKSIZE)
        //if(mapY < 0) return mapY
        return {
            x: mapX,
            y: mapY
        }
    }

    #resizeBlock(e, mapX, mapY) {
        if(e.isBroken) {
            // e.components.sprite.dWidth *= 2
            // e.components.sprite.dHeight *= 2
            // e.components.transform.x = BLOCKSIZE * mapX
            // e.components.transform.y = BLOCKSIZE * mapY
            e.components.lifespan.current = e.components.lifespan.total
            e.isBroken = false
            e.isDrawable = true
        } else {
            e.components.sprite.dWidth *=  .5
            e.components.sprite.dHeight = e.components.sprite.dHeight * .5
            e.components.transform.velocityY = 10
            e.isBroken = true
            e.isDrawable = false
        }

        return e
    }

    #givePlayerPickAxe() {
        let e = this.entityManager.addEntity({
            tag: 'pickaxe',
            components: [
                new CSprite({
                    sprite: ASSET_MANAGER.cache[MISC_PATH.PICK],
                    sWidth: BLOCKSIZE,
                    sHeight: BLOCKSIZE
                }),
                new CTransform(this.player.components.transform.x, this.player.components.transform.y)
            ]
        })
        this.containerManager.addToInventory('player', e)
    }

    #givePlayerGun() {
        let e = this.entityManager.addEntity({
            tag: 'gun',
            components: [
                new CSprite({
                    sprite: ASSET_MANAGER.cache[WEAPON_PATH.LASER_PISTOL],
                    sWidth: 32,
                    sHeight: 32
                }),
                new CTransform(this.player.components.transform.x, this.player.components.transform.y)
            ]
        })
        this.containerManager.addToInventory('player', e)
    }

    #givePlayerFlamethrower() {
        let e = this.entityManager.addEntity({
            tag: 'flamethrower',
            components: [
                new CSprite({
                    sprite: ASSET_MANAGER.cache[WEAPON_PATH.FLAMETHROWER],
                    sWidth: 32,
                    sHeight: 32
                }),
                new CTransform(this.player.components.transform.x, this.player.components.transform.y)
            ]
        })
        this.containerManager.addToInventory('player', e)
    }
    
    #checkWinCon() {
        let requisite = { item : { tag : 'tile_iron' }, count : 10 }
        return (this.containerManager.checkCount(requisite) && this.collisionSystem.checkCollision(this.player, this.rocket))
    }
}