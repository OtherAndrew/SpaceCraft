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
        if (activeContainer.item) {
            this.restrictMovement = activeContainer.item.tag === 'minigun' || activeContainer.item.tag === 'railgun';
        } else {
            this.restrictMovement = false;
        }
        this.pSprite.setAnimation(this.handleKeyboard(keys, tick));
        if (mouseDown) this.handleMouse(mouse, activeContainer, tick);
    }

    handleKeyboard(key, tick) {
        let state = this.pSprite.currentState;

        if ((key[' '] || key['w']) && this.pState.grounded && !this.restrictMovement) { //jump
            this.pState.grounded = false
            this.pTransform.velocityY = -(GRAVITY + BLOCKSIZE / 2);
            state = this.pState.direction === 'right' ? 'jumpR' : 'jumpL';
        }

        // if (key['w']) { // jetpack?
        //     if (this.jetpackTime < this.jetpackDuration) {
        //         this.pState.grounded = false
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
                state = this.pState.grounded ? 'walkL' : 'crouchL';
            } else {
                this.pTransform.velocityX -= this.acceleration;
                state = this.pState.grounded ? 'walkL' : 'jumpL';
            }
        } else if (key['d']) {
            this.pState.direction = "right"
            if (key['s'] || this.restrictMovement) {
                this.pTransform.velocityX = this.pStats.speed / 3;
                state = this.pState.grounded ? 'walkR' : 'crouchR';
            } else {
                this.pTransform.velocityX += this.acceleration;
                state = this.pState.grounded ? 'walkR' : 'jumpR';
            }
        } else {
            if (key['s']) {
                // fast fall/crouch
                this.pTransform.velocityY += this.fastFall
                this.pTransform.velocityX = 0;
                state = this.pState.direction === 'right' ? 'crouchR' : 'crouchL';
            } else { // no input
                this.pTransform.velocityX = 0;
                if (this.pState.grounded) {
                    state = this.pState.direction === 'right' ? 'idleR' : 'idleL';
                }
            }
        }
        return state;
    }

    handleMouse(pos, activeContainer, tick) {
        let coords = getGridCell(pos, this.player)
        let mapY = coords.y || 0;
        let mapX = coords.x || 0;
        let selected = this.terrainMap[mapY][mapX];
        const cursorTarget = {
            x: pos.x + 25/2,
            y: pos.y + 25/2
        };
        console.log(selected.tag)
        let active = activeContainer.item;
        if (active) {
            if(/tile|interact/.test(active.tag) && isPlaceable(this.player, coords, this.terrainMap)) {
                if(selected.tag.includes('air')) {
                    let tag = this.containerManager.removeFromPlayer(activeContainer.slot);
                    let newBlock;
                    if (active.tag.includes('interact')) {
                        newBlock = this.entityManager.addEntity(generateInteractive(tag, mapX, mapY));
                        if (active.tag.includes('chest')) this.containerManager.registerChest(newBlock);
                    } else newBlock = this.entityManager.addEntity(generateBlock(tag, mapX, mapY, 'worldgen'));
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
                        if(e.components.stats.isDead) {
                            if (selected.tag.includes('chest')) this.containerManager.deregisterChest(e);
                            selected.tag = 'air'
                            selected.id = null
                            delete e.components["boxCollider"]
                            this.containerManager.addToInventory('player', resizeBlock(e))
                        }
                    }
                }
            } else if (active.name === 'weapon') {
                this.#fireWeapon(active, cursorTarget, tick);
            }
        } else if (selected.tag.includes('interact')) {
            this.containerManager.unloadInventory();
            this.containerManager.loadInventory(cleanTag(selected.tag));
            this.game.activateMenu();
        }
    }

    #fireWeapon(activeWeapon, target, tick) {
        // const wProps = this.weaponMap.get(activeWeapon);
        const wProps = activeWeapon.components["weaponProps"];
        if (wProps.readyToFire()) {
            this.projectileFactory.playerShoot(wProps.projectileType, target, this.player)
            wProps.fireTime += tick;
        }
    }
}
