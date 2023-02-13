
class WorldScene extends Scene {
    constructor(game) {
        super()
        this.game = game;
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
        this.craftingMenu = new CraftMenu(this.containerManager);
        this.collisionSystem = new CollisionSystem(this.player, this.entityManager.getEntities);
        this.cursorSystem = new CursorSystem(canvas, this.terrainMap, this.hud)
        this.cursorSystem.init()
        this.worldImages = new WorldImages(this.player)
        this.worldImages.init(this.entityManager)

        this.projectileManager = new ProjectileManager(this.entityManager)
        this.damageSystem = new DamageSystem(this.entityManager.getEntities)
        this.durationSystem = new DurationSystem(this.entityManager.getEntities)
        this.#givePlayerPickAxe()
        this.#givePlayerGun()
        this.#givePlayerFlamethrower()
    }

    spawnTestEntities() {
        this.mobFactory.build('spore', this.player.components.transform.x, this.player.components.transform.y - 50);
        this.mobFactory.build('dirtcarver', this.player.components.transform.x - 100, this.player.components.transform.y - 250);
        this.mobFactory.build('lightbug', this.player.components.transform.x + 1200, this.player.components.transform.y - 100);
        this.mobFactory.build('lightjelly', this.player.components.transform.x + 300, this.player.components.transform.y - 300);
        this.mobFactory.build('grapebomb', this.player.components.transform.x + 500, this.player.components.transform.y - 400);
        this.mobFactory.build('wormtank', this.player.components.transform.x + 800, this.player.components.transform.y - 200);
        this.mobFactory.build('mossamber', this.player.components.transform.x - 400, this.player.components.transform.y - 200);
        this.mobFactory.build('rocket', this.player.components.transform.x - 750, this.player.components.transform.y - 200);
    }

    update(uiActive, keys, mouseDown, mouse, deltaTime) {
        if (!uiActive) {
            this.containerManager.unloadInventory();
            // get input
            this.playerMovement.update(keys, deltaTime)
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

            this.worldImages.update()
            
            this.collisionSystem.resolveProjectiles()
            this.damageSystem.update();
            this.durationSystem.update(deltaTime)

            // draw
            this.camera.update()
            this.renderSystem.update(deltaTime);
            // temporary spot for this
            if(mouseDown) {
                this.#handleClick(mouse, this.player, this.terrainMap)
            }
        }
        this.cursorSystem.update(this.#getGridCell(mouse, this.player))
        this.craftingMenu.update(uiActive);
        this.containerManager.update(uiActive, mouseDown, mouse);
        this.hud.update(uiActive, keys);
    }

    draw(uiActive, ctx, mouse) {
        if (uiActive)
            ctx.putImageData(this.game.screenshot, 0, 0);
        else
            this.renderSystem.draw(ctx, this.camera);

        this.#drawColliders(ctx);

        // this.craftingMenu.draw(uiActive);
        this.containerManager.draw(uiActive, ctx, mouse);
        this.hud.draw(uiActive, ctx);
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
               || this.terrainMap[clamp(posY-1,0,posY)][posX].tag === 'air'
               || this.terrainMap[posY][clamp(posX - 1, 0, posX)].tag === 'air'
               || this.terrainMap[posY][clamp(posX + 1, 0, this.terrainMap[0].length - 1)].tag === 'air'
               || this.terrainMap[clamp(posY + 1, 0, this.terrainMap.length - 1)][posX].tag === 'air'
               || this.terrainMap[clamp(posY - 1, 0, this.terrainMap.length - 1)][posX].tag === 'air';
    }

    #handleClick(pos, player, terrainMap) {
        let coords = this.#getGridCell(pos, player)
        let mapY = coords.y || 0;
        let mapX = coords.x || 0
        let selected = terrainMap[mapY][mapX];
        console.log(terrainMap[mapY][mapX].tag)
        let active = this.hud.activeContainer.item;
        if (active) {
            if(active.tag.includes('tile')) {
                if(selected.tag.includes('air')) {
                    let tag = this.containerManager.removeFromPlayer(this.hud.slot);
                    let newBlock;
                    if (active.tag.includes('craft')) {
                        newBlock = this.entityManager.addEntity(generateCrafter(tag, mapX, mapY))
                    } else {
                        newBlock = this.entityManager.addEntity(generateBlock(tag, mapX, mapY, 'worldgen'));
                    }
                    if (newBlock) {
                        selected.tag = newBlock.tag
                        selected.id = newBlock.id
                        console.log(newBlock)
                    }
                }
            } else if (active.tag === 'pickaxe') {
                if(selected.tag.includes('tile')) {
                    let e = this.entityManager.getEntity(terrainMap[mapY][mapX].id)
                    e.components.lifespan.current -= 1
                    if(e.components.lifespan.current <= 0) {
                        selected.tag = 'air'
                        selected.id = null
                        delete e.components["boxCollider"]
                    this.containerManager.addToInventory('player', this.#resizeBlock(e))}
                }
            } else if (active.tag === 'gun') {
                this.projectileManager.shoot('bullet', {x: pos.x + 25/2, y: pos.y + 25/2}, player)
            } else if (active.tag === 'flamethrower') {
                this.projectileManager.shoot('fire', {x: pos.x + 25/2, y: pos.y + 25/2}, player)
            }
        } else if (selected.tag.includes('craft')) {
            let tag = selected.tag.replace('tile_craft_', '');
            this.containerManager.loadInventory(tag);
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
                    sprite: ASSET_MANAGER.cache[MISC_PATH.GUN],
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
                    sprite: ASSET_MANAGER.cache[MISC_PATH.FLAMETHROWER],
                    sWidth: 32,
                    sHeight: 32
                }),
                new CTransform(this.player.components.transform.x, this.player.components.transform.y)
            ]
        })
        this.containerManager.addToInventory('player', e)
    }
}