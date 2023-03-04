class PlayerController {
    constructor(player, game, entityManager, containerManager, projectileFactory, terrainMap) {
        // this.player = player
        Object.assign(this, { player, game, entityManager, containerManager, projectileFactory, terrainMap })
        this.pTransform = this.player.components.transform
        this.pState = this.player.components.state
        this.pSprite = this.player.components.sprite
        this.pStats = this.player.components['stats']
        this.acceleration = 1
        this.fastFall = 3;
        this.restrictMovement = false;
        this.timer = 0
        this.timesUp = .25
        this.ready = true
    }
    
    refreshPlayerConnection() {
        this.pTransform = this.player.components.transform
        this.pState = this.player.components.state
        this.pSprite = this.player.components.sprite
        this.pStats = this.player.components['stats']
    }

    /**
     * Updates player state, animation, and position
     * @param keys keyboard input
     * @param mouseDown mouse click
     * @param mouse mouse position
     * @param tick time slice
     * @param activeContainer
     */
    update(keys, mouseDown, mouse, tick, activeContainer) {
        if(!this.ready) {
            this.timer += tick
            if(this.timer > this.timesUp) {
                this.timer = 0
                this.ready = true
            }
        }
        if (activeContainer.item) {
            this.restrictMovement = activeContainer.item.tag === 'minigun' || activeContainer.item.tag === 'railgun';
        } else {
            this.restrictMovement = false;
        }
        this.pSprite.setAnimation(this.handleKeyboard(keys, tick));
        if (mouseDown) this.handleMouse(mouse, activeContainer, tick);

        if (activeContainer.item && activeContainer.item.name === 'weapon') {
            const wProps = activeContainer.item.components["weaponProps"]
            if (wProps.sound) {
                if (mouseDown && wProps.readyToFire()) {
                    if (!ASSET_MANAGER.isPlaying(wProps.sound)) ASSET_MANAGER.playAsset(wProps.sound);
                } else {
                    ASSET_MANAGER.stop(wProps.sound);
                }
            }
        }

    }

    handleKeyboard(key, tick) {
        let animState = this.pSprite.currentState;

        if ((key[' '] || key['w']) && this.pState.grounded && !this.restrictMovement) { //jump
            this.pState.grounded = false;
            this.pTransform.velocityY = -(GRAVITY + BLOCKSIZE / 2);
        }

        // if (key['w']) { // jetpack?
        //     if (this.jetpackTime < this.jetpackDuration) {
        //         this.pTransform.velocityY = -(GRAVITY + 10);
        //         this.jetpackTime += tick;
        //         state = this.pState.direction === 'right' ? 'flyR' : 'flyL';
        //     } else {
        //         state = this.pState.direction === 'right' ? 'idleR' : 'idleL';
        //     }
        // }

        if (key['a']) {
            this.pState.direction = 'left'
            if (key['s'] || this.restrictMovement) {
                this.pTransform.velocityX = -this.pStats.speed / 3;
                animState = this.pState.grounded ? 'walkL' : 'crouchL';
            } else {
                this.pTransform.velocityX -= this.acceleration;
                animState = this.pState.grounded ? 'walkL' : 'jumpL';
            }
        } else if (key['d']) {
            this.pState.direction = "right"
            if (key['s'] || this.restrictMovement) {
                this.pTransform.velocityX = this.pStats.speed / 3;
                animState = this.pState.grounded ? 'walkR' : 'crouchR';
            } else {
                this.pTransform.velocityX += this.acceleration;
                animState = this.pState.grounded ? 'walkR' : 'jumpR';
            }
        } else {
            if (key['s']) {
                // fast fall/crouch
                this.pTransform.velocityY += this.fastFall
                this.pTransform.velocityX = 0;
                animState = this.pState.direction === 'right' ? 'crouchR' : 'crouchL';
            } else { // no input
                this.pTransform.velocityX = 0;
                if (this.pState.grounded) {
                    animState = this.pState.direction === 'right' ? 'idleR' : 'idleL';
                } else {
                    animState = this.pState.direction === 'right' ? 'jumpR' : 'jumpL';
                }
            }
        }
        this.pState.grounded = false; // collision system will check after
        return animState;
    }

    handleMouse(pos, activeContainer, tick) {
        let coords = getGridCell(pos, this.player)
        let mapY = coords.y || 0;
        let mapX = coords.x || 0;
        let selected = this.terrainMap[mapY][mapX];
        const cursorTarget = {
            x: pos.x + 25 / 2,
            y: pos.y + 25 / 2
        };
        // console.log(selected.tag) // DEBUGGING
        if (selected.tag.includes('chest')) {
            console.log(selected);
            console.log(this.containerManager.getInventory(cleanTag(selected.tag)));
        }
        let active = activeContainer.item;
        if (active) {
            if (/tile|interact/.test(active.tag) && isPlaceable(this.player, coords, this.terrainMap)) {
                if (selected.tag.includes('air')) {
                    let tag = this.containerManager.removeFromPlayer(activeContainer.slot);
                    let newBlock;
                    if (active.tag.includes('interact')) {
                        newBlock = this.entityManager.addEntity(generateInteractive(tag, mapX, mapY));
                        ASSET_MANAGER.playAsset(SOUND_PATH.BLOCK_PLACE)
                        if (active.tag.includes('chest')) this.containerManager.registerChest(newBlock);
                    } else newBlock = this.entityManager.addEntity(generateBlock(tag, mapX, mapY, 'worldgen'));
                    ASSET_MANAGER.playAsset(SOUND_PATH.BLOCK_PLACE)
                    if (newBlock) {
                        selected.tag = newBlock.tag
                        selected.id = newBlock.id
                        // console.log(newBlock)
                    }
                }
            } else if (active.tag === 'pickaxe') {
                if(/tile|interact/.test(selected.tag) && checkPlayerDistance(coords, this.player) < BLOCK_PLACEMENT_DISTANCE) {
                    let destroyable = true;
                    if (selected.tag.includes('chest')) destroyable = this.containerManager.checkChest(selected);
                    if (destroyable) {
                        let e = this.entityManager.getEntity(selected.id)
                        e.components.stats.applyDamage(1);
                        if(this.ready) {
                            ASSET_MANAGER.playAsset(SOUND_PATH.BLOCK_DAMAGE)
                            this.ready = false
                        }
                        if(e.components.stats.isDead) {
                            if (selected.tag.includes('chest')) this.containerManager.deregisterChest(e);
                            selected.tag = 'air'
                            selected.id = null
                            delete e.components["boxCollider"]
                            e.isBroken = true;
                            e.isDrawable = false;
                            e.destroy(); // deregister item from entity list
                            ASSET_MANAGER.playAsset(SOUND_PATH.BLOCK_BREAK)
                            this.containerManager.addToInventory('player', e /*resizeBlock(e)*/)
                        }
                    }
                }
            } else if (active.name === 'weapon') {
                this.#fireWeapon(active, cursorTarget, tick);
            }
        } else if (selected.tag.includes('interact')) {
            this.containerManager.unloadInventory();
            if (selected.tag.includes('chest')) this.containerManager.loadInventory(cleanTag(selected.tag));
            else this.containerManager.loadInventories(cleanTag(selected.tag));
            this.game.activateMenu();
            ASSET_MANAGER.playAsset(SOUND_PATH.CHEST_OPEN)
        }
    }

    #fireWeapon(activeWeapon, target, tick) {
        const wProps = activeWeapon.components["weaponProps"];
        if (wProps.readyToFire()) {
            this.projectileFactory.playerShoot(wProps.projectileType, target, this.player)
            wProps.fireTime += tick;
        }
    }
}
