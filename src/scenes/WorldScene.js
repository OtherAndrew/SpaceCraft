class WorldScene extends Scene {


    constructor(game) {
        super()
        this.game = game;
        this.mid = HEIGHT_PIXELS * .5 + WIDTH
        this.drawItems = null;
        this.respawnTime = 5;
        this.invulnTime = 5;
        this.helpTime = 60;
        this.spawnPoint = {
            x: WIDTH_PIXELS * .5,
            y: HEIGHT_PIXELS * .5 - BLOCKSIZE * 1.5
        }
        this.win = false;
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
     */
    init(canvas) {
        this.canvas = canvas;
        this.elapsedRespawnTime = 0;
        this.elapsedInvulnTime = this.invulnTime;
        this.elapsedHelpTime = 0;
        this.textBox = new TextBox();
        this.containerManager.textBox = this.textBox;

        this.mobFactory = new MobFactory(this.entityManager);
        let airTileMap
        [this.terrainMap, airTileMap] = getTerrain(this.entityManager, this.containerManager, this.mobFactory)
        this.player = this.mobFactory.build('player', this.spawnPoint.x, this.spawnPoint.y);
        this.rocket =
            this.mobFactory.build('rocket', this.spawnPoint.x - BLOCKSIZE * 23, this.spawnPoint.y - BLOCKSIZE * 11);
        this.nativenpc =
            this.mobFactory.build('nativenpc', this.spawnPoint.x + BLOCKSIZE * 11, this.spawnPoint.y - BLOCKSIZE);
        this.projectileFactory = new ProjectileFactory(this.entityManager)
        this.playerController = new PlayerController(this.player, this.game, this.entityManager, this.containerManager,
                                                     this.projectileFactory, this.terrainMap);
        this.movementSystem = new MovementSystem(this.entityManager.getEntities, this.player);
        this.mobController = new MobController(this.entityManager.getEntities, this.player, this.projectileFactory);
        this.renderSystem = new RenderSystem();
        this.camera = new Camera(this.player);
        this.renderBox = new RenderBox(this.player, GRIDSIZE, BLOCKSIZE);
        this.hud = new HUD(this.containerManager, this.player);
        this.craftingMenu = new CraftingMenu(this.containerManager, this.entityManager);
        this.collisionSystem = new CollisionSystem(this.player, this.entityManager.getEntities, this.projectileFactory);
        this.spawnManager = new SpawnManager(this.mobFactory, this.terrainMap, this.player, this.collisionSystem)
        this.cursorSystem = new CursorSystem(this.canvas, this.terrainMap, this.hud, this.player);
        this.cursorSystem.init();
        // this.worldImages = new WorldImages(this.player)
        // this.worldImages.init(this.entityManager)
        this.particleFactory = new ParticleFactory(this.entityManager)
        this.healthSystem = new HealthSystem(this.entityManager, this.particleFactory, this.containerManager);
        this.durationSystem = new DurationSystem(this.entityManager.getEntities);
        this.weaponSystem = new WeaponSystem(this.entityManager.getEntities)

        // this.spawnTestEntities();
        // ASSET_MANAGER.playAsset(SOUND_PATH.BOSS)
        this.startup();
        this.musicPlayer = new MusicPlayer(this.player)
        ASSET_MANAGER.adjustVolume(.2)

        this.drawItems = this.#updateTileState();
    }

    spawnTestEntities() {
        const px = this.player.components['boxCollider'].center.x;
        const py = this.player.components['boxCollider'].center.y;

    }

    startup() {
        [generatePickaxe('pickaxe_iron'), new LaserPistol()].forEach(item => {
            this.containerManager.addToInventory('player', this.entityManager.addEntity(item))
        });
        this.textBox.append("WASD + SPACE to move.");
        this.textBox.append("TAB to open inventory.");
        this.textBox.append("1-9 + SCROLL to change hotbar item.");
        this.textBox.append("Use placed items by clicking on them");
        this.textBox.append("    with an empty hand.");
        this.textBox.append("Plant monsters can be defeated");
        this.textBox.append("    to obtain wood.");
        this.textBox.append("Dig with your pickaxe to get");
        this.textBox.append("    materials to upgrade your");
        this.textBox.append("    equipment.");
    }

    update(menuActive, keys, mouseDown, mouse, wheel, deltaTime) {
        if (!menuActive) {
            if (this.#checkWinCon() || this.win) {
                // spawn boss (if not spawned already)
                // if (boss is dead)
                    this.#onWin();
            } else if (this.player.components['stats'].isDead) {
                this.#onDeath(deltaTime);
            } else {
                this.containerManager.reloadInventory();
                // **get input**
                this.playerController.update(keys, mouseDown, mouse, deltaTime, this.hud.activeContainer);
                this.#setInvulnerability(deltaTime);
            }
            this.#activateCheats();
            this.#getHelpMessage(deltaTime);
            this.#applyArmor();

            // **update state**
            this.entityManager.update();
            this.renderBox.update();
            this.drawItems = this.#updateTileState();
            // this.entityManager.getEntities.forEach((e) => this.#checkIfExposed(e));
            this.collisionSystem.refresh();
            this.movementSystem.refresh();

            this.spawnManager.update(deltaTime, this.collisionSystem.mobList);

            this.mobController.update(deltaTime);
            // https://gamedev.stackexchange.com/a/71123
            // update Y first for ledges
            this.movementSystem.updateY(deltaTime);
            this.collisionSystem.resolveTileY();
            this.movementSystem.updateX(deltaTime);
            this.collisionSystem.resolveTileX();

            //this.worldImages.update()
            this.collisionSystem.resolveAttack();
            this.healthSystem.update(deltaTime);
            this.durationSystem.update(deltaTime);
            this.weaponSystem.update(deltaTime);

            // **draw**
            this.camera.update();
            this.renderSystem.update(deltaTime, this.drawItems);
            this.musicPlayer.update(deltaTime)
        }
        if (!this.win) this.cursorSystem.update(menuActive, getGridCell(mouse, this.player))
        this.craftingMenu.update(menuActive);
        this.containerManager.update(menuActive, mouseDown, mouse);
        this.textBox.update(deltaTime)
        this.hud.update(menuActive, keys, wheel);
    }

    #applyArmor() {
        const heavyArmor = [0, {item: {tag: 'item_heavyArmor'}, count: 1}];
        const lightArmor = [0, {item: {tag: 'item_lightArmor'}, count: 1}];
        if (this.containerManager.checkSufficient(heavyArmor, 'player')) {
            this.player.components['stats'].defenseMod = 0.33;
        } else if (this.containerManager.checkSufficient(lightArmor, 'player')) {
            this.player.components['stats'].defenseMod = 0.66;
        } else {
            this.player.components['stats'].defenseMod = 1;
        }
    }

    #getHelpMessage(deltaTime) {
        this.elapsedHelpTime += deltaTime;
        if (this.elapsedHelpTime > this.helpTime) {
            this.textBox.append(getRandom(HELP));
            this.elapsedHelpTime = 0;
        }
    }

    #setInvulnerability(deltaTime) {
        if (this.elapsedInvulnTime < this.invulnTime || this.game.gaveInvincibleCheat) {
            this.player.components['stats'].invincible = true;
            this.elapsedInvulnTime += deltaTime;
        } else {
            this.player.components['stats'].invincible = false;
        }
    }

    #activateCheats() {
        if (this.game.winCheat) {
            [generateItem('item_fueltower'), generateItem('item_medical bay')].forEach(item => {
                this.containerManager.addToInventory('player', this.entityManager.addEntity(item))
            });
            this.textBox.append("sus");
            this.game.winCheat = false;
        }
        if (this.game.pickaxeCheat) {
            this.containerManager.addToInventory('player',
                this.entityManager.addEntity(generatePickaxe('pickaxe_super')));
            this.textBox.append("Aw man");
            this.game.pickaxeCheat = false;
        }
        if (this.game.weaponCheat) {
            [new LaserPistol(),
                new LaserGun(),
                new Flamethrower(),
                new LaserRifle(),
                new HandCannon(),
                new GrenadeLauncher(),
                new Minigun(),
                new Railgun(),
                new DeathRay(),
                generateItem('item_lightArmor'),
                generateItem('item_heavyArmor')
            ].forEach(item => this.containerManager.addToInventory('player', this.entityManager.addEntity(item)));
            this.textBox.append("Hey look buddy, I'm an engineer");
            this.game.weaponCheat = false;
        }
        if (this.game.invincibleCheat) {
            this.textBox.append("I AM BULLETPROOF!!!");
            this.game.invincibleCheat = false;
        }
    }

    draw(menuActive, ctx, mouse) {
        if (menuActive) ctx.putImageData(this.game.screenshot, 0, 0);
        else {
            const skyGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
            if (this.player.components.transform.y <= this.mid) {
                // https://astronomy.com/news/2016/06/what-do-the-stars-look-like-from-mars
                skyGradient.addColorStop(0, "#181212");
                // skyGradient.addColorStop(0.25, "#463022");
                skyGradient.addColorStop(0.5, "#bb7e47");
            } else {
                // https://www.space.com/17193-mars-night-sky-observation-tips.html
                skyGradient.addColorStop(0.33, "#000000");
                skyGradient.addColorStop(1, "#09154b");
                // skyGradient.addColorStop(1, "#6a1c58");
            }
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            this.renderSystem.draw(ctx, this.camera, this.drawItems);
        }
        if (this.game.options.debugging) this.#drawColliders(ctx);

        this.textBox.draw(ctx)
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
     * @todo performance optimization
     */
    #updateTileState() {
        let drawables = [];
        let entities = this.entityManager.getEntities;
        let length = entities.length;
        for (let i = 0; i < length; i++) {
            let e = entities[i];
            // check tiles
            if (e.name === 'block') {
                if (e.components.transform.x > (this.renderBox.x - BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 8 &&
                    e.components.transform.x < (this.renderBox.x + BLOCKSIZE) * BLOCKSIZE + BLOCKSIZE * 8 &&
                    e.components.transform.y > (this.renderBox.y - BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 8 &&
                    e.components.transform.y < (this.renderBox.y + BLOCKSIZE) * BLOCKSIZE + BLOCKSIZE * 8) {
                    e.isDrawable = !e.isBroken
                    if (e.isDrawable) this.#checkIfExposed(e)
                } else {
                    e.isDrawable = false;
                }
            } else if (!/player|weapon|item/.test(e.name) && !/background|pickaxe/.test(e.tag)) {
                e.isDrawable = e.components.transform.x > (this.renderBox.x - BLOCKSIZE) * (BLOCKSIZE) &&
                    e.components.transform.x < (this.renderBox.x + BLOCKSIZE) * (BLOCKSIZE) &&
                    e.components.transform.y > (this.renderBox.y - BLOCKSIZE) * (BLOCKSIZE) &&
                    e.components.transform.y < (this.renderBox.y + BLOCKSIZE) * (BLOCKSIZE)
            }
            if (e.isDrawable) drawables.push(e);
        }
        return drawables;
    }

    /**
     * Checks a drawable entities four directions to see if it is exposed(not completely surrounded by other blocks).
     * A player will be able to collide with an exposed block, so they must be given colliders.
     * @param {Entity} e
     */
    #checkIfExposed(e) {
        const posX = e.components.transform.x / BLOCKSIZE
        const posY = e.components.transform.y / BLOCKSIZE
        let visCheck = this.#isExposed(posY, posX);
        if (visCheck.exposed) {
            e.visCode = visCheck.visCode; // placeholder
        } else {
            delete e.visCode; // placeholder
        }
    }

    #isExposed(posY, posX) {
        let visCodeC = this.#checkCardinal(posY, posX);
        let visCodeO = this.#checkOrdinal(posY, posX);
        let exposed = posY === 0 || visCodeC.includes('1') || visCodeO.includes('1');
        return {exposed: exposed, visCode: visCodeC};
        // return {exposed: exposed, visCode: visCodeC === 'c0000' ? visCodeO : visCodeC};
    }

    // TODO: meld check cardinal and ordinal to get correct obfuscation

    #checkCardinal(posY, posX) {
        let visCode = ['c'];
        if (/air|interact/.test(this.terrainMap[clamp(posY - 1, 0, posY)][posX].tag)) { // N
            visCode.push('1');
        } else visCode.push('0');
        if (/air|interact/.test(this.terrainMap[posY][clamp(posX - 1, 0, posX)].tag)) { // W
            visCode.push('1');
        } else visCode.push('0');
        if (/air|interact/.test(this.terrainMap[posY][clamp(posX + 1, 0, this.terrainMap[0].length - 1)].tag)) { // E
            visCode.push('1');
        } else visCode.push('0');
        if (/air|interact/.test(this.terrainMap[clamp(posY + 1, 0, this.terrainMap.length - 1)][posX].tag)) { // S
            visCode.push('1');
        } else visCode.push('0');
        return visCode.join('');
    }

    #checkOrdinal(posY, posX) {
        let visCode = ['o'];
        if (/air|interact/.test(this.terrainMap[clamp(posY - 1, 0, posY)][clamp(posX - 1, 0, posX)].tag)) { // NW
            visCode.push('1');
        } else visCode.push('0');
        if (/air|interact/.test(this.terrainMap[clamp(posY - 1, 0, posY)][clamp(posX + 1, 0, this.terrainMap[0].length - 1)].tag)) { // NE
            visCode.push('1');
        } else visCode.push('0');
        if (/air|interact/.test(this.terrainMap[clamp(posY + 1, 0, this.terrainMap.length - 1)][clamp(posX - 1, 0, posX)].tag)) { // SW
            visCode.push('1');
        } else visCode.push('0');
        if (/air|interact/.test(this.terrainMap[clamp(posY + 1, 0, this.terrainMap.length - 1)][clamp(posX + 1, 0, this.terrainMap[0].length - 1)].tag)) { // SE
            visCode.push('1');
        } else visCode.push('0');
        return visCode.join('');
    }

    #checkWinCon() {
        let requisite = [0, {item: {tag: 'item_fueltower'}, count: 1}, {item: {tag: 'item_medical bay'}, count: 1}]
        // let requisite = [0, {item: {tag: 'item_bismuth bar'}, count: 5}]
        return (this.containerManager.checkSufficient(requisite, 'player')
            && checkCollision(this.player, this.rocket))
    }

    #onWin() {
        this.rocket.components["state"].setState("win");
        this.rocket.components['transform'].hasGravity = false;
        this.camera.setTarget(this.rocket);
        this.renderBox.setTarget(this.rocket);
        this.player.isDrawable = false;
        this.player.components['stats'].invincible = true;
        if (this.elapsedRespawnTime === 0) {
            this.textBox.append("You won!");
            this.elapsedRespawnTime += 1;
        }
        this.win = true;
    }

    #onDeath(deltaTime) {
        if (this.elapsedRespawnTime >= this.respawnTime) {
            this.elapsedRespawnTime = 0;
            this.elapsedInvulnTime = 0;
            this.elapsedHelpTime = 0;
            regenPlayerComponents(this.spawnPoint, this.player);
            this.playerController.refreshPlayerConnection();
            this.camera.setTarget(this.player);
            this.renderBox.setTarget(this.player);
            // this.textBox.append("You live once more!");
            this.textBox.append(getRandom(HELP));
        } else {
            if (this.elapsedRespawnTime === 0) {
                const pTransform = this.player.components["transform"];
                pTransform.hasGravity = false;
                pTransform.velocityX = 0;
                pTransform.velocityY = 0;
                this.player.isDrawable = false;
                this.textBox.append("You died!");
                this.textBox.append(`Respawning in ${this.respawnTime} seconds...`);
            }
            this.elapsedRespawnTime += deltaTime;
        }
    }
}
