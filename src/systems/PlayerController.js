class PlayerController {
    constructor(player, game, entityManager, containerManager, projectileManager, terrainMap) {
        // this.player = player
        Object.assign(this, { player, game, entityManager, containerManager, projectileManager, terrainMap })
        this.pTransform = this.player.components.transform
        this.pState = this.player.components.state
        this.pSprite = this.player.components.sprite
        this.pStats = this.player.components['stats']
        this.acceleration = 1
        this.fastFall = 3;
        this.holdingMinigun = false;
        this.weaponMap = this.#buildWeaponMap();
    }

    #buildWeaponMap() {
        const weaponMap = new Map();
        weaponMap.set('laserPistol', new WeaponProps('weak_bullet', 0.5));
        weaponMap.set('laserGun', new WeaponProps('mid_bullet', 0.33));
        weaponMap.set('laserRifle', new WeaponProps('strong_bullet', 0.25));
        weaponMap.set("grenadeLauncher", new WeaponProps('bomb', 1.25));
        weaponMap.set("handCannon", new WeaponProps("mini_bomb", 1.5));
        weaponMap.set("flamethrower", new WeaponProps('fire', 6, 3));
        weaponMap.set('minigun', new WeaponProps('minigun_bullet', 7.5, 5));
        weaponMap.set('railgun', new WeaponProps('railgun_bullet', 5));
        // weaponMap.set('jetpack', new WeaponProps('smoke', 5, 5));
        return weaponMap;
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
            this.holdingMinigun = activeContainer.item.tag === 'minigun';
        } else {
            this.holdingMinigun = false;
        }
        this.pSprite.setAnimation(this.handleKeyboard(keys, tick));
        if (mouseDown) this.handleMouse(mouse, activeContainer, tick);
        // if (this.pState.grounded) {
            // if (this.elapsedTime >= this.jetpackCooldown) {
            //     this.elapsedTime = 0;
            //     this.jetpackTime = 0;
            // } else {
            //     this.elapsedTime += tick;
            // }
            this.weaponMap.forEach(w => {
                if (w.fireTime > w.duration) {
                    if (w.elapsedTime >= w.cooldown) {
                        w.elapsedTime = 0;
                        w.fireTime = 0;
                    } else {
                        w.elapsedTime += tick;
                    }
                }
                // else if (!mouseDown) { // regen when not using
                //     w.fireTime = clamp(w.fireTime - tick/3, 0, w.fireTime);
                // }
            });
        // }
    }

    handleKeyboard(key, tick) {
        let state = this.pSprite.currentState;

        if ((key[' '] || key['w']) && this.pState.grounded && !this.holdingMinigun) { //jump
            this.pState.grounded = false
            this.pTransform.velocityY = -(GRAVITY + 15);
            state = this.pState.direction === 'right' ? 'jumpR' : 'jumpL';
        }

        // if (input['w']) { // jetpack?
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
            if (key['s'] || this.holdingMinigun) {
                this.pTransform.velocityX = -this.pStats.speed / 3;
                state = this.pState.grounded ? 'walkL' : 'crouchL';
            } else {
                this.pTransform.velocityX -= this.acceleration;
                state = this.pState.grounded ? 'walkL' : 'jumpL';
            }
        } else if (key['d']) {
            this.pState.direction = "right"
            if (key['s'] || this.holdingMinigun) {
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
        let coords = this.getGridCell(pos)
        let mapY = coords.y
        let mapX = coords.x
        let selected = this.terrainMap[mapY][mapX];
        const cursorTarget = {
            x: pos.x + 25/2,
            y: pos.y + 25/2
        };
        console.log(selected.tag)
        let active = activeContainer.item;
        if (active) {
            if(/tile|craft/.test(active.tag)) {
                if(selected.tag.includes('air')) {
                    let tag = this.containerManager.removeFromPlayer(activeContainer.slot);
                    let newBlock;
                    if (active.tag.includes('craft'))
                        newBlock = this.entityManager.addEntity(generateCrafter(tag, mapX, mapY));
                    else
                        newBlock = this.entityManager.addEntity(generateBlock(tag, mapX, mapY, 'worldgen'));
                    if (newBlock) {
                        selected.tag = newBlock.tag
                        selected.id = newBlock.id
                        // console.log(newBlock)
                    }
                }
            } else if (active.tag === 'pickaxe') {
                if(/tile|craft/.test(selected.tag)) {
                    let e = this.entityManager.getEntity(selected.id)
                    e.components.lifespan.current -= 1
                    if(e.components.lifespan.current <= 0) {
                        selected.tag = 'air'
                        selected.id = null
                        delete e.components["boxCollider"]
                        this.containerManager.addToInventory('player', resizeBlock(e))}
                }
            } else {
                this.#fireWeapon(active.tag, cursorTarget, tick);
            }
        } else if (selected.tag.includes('craft')) {
            console.log('open crafting menu')
            this.containerManager.loadInventory(cleanTag(selected.tag));
            this.game.activateMenu();
        }
    }

    #fireWeapon(activeWeapon, target, tick) {
        const wProps = this.weaponMap.get(activeWeapon);
        if (wProps.fireTime <= wProps.duration) {
            this.projectileManager.playerShoot(wProps.projectileType, target, this.player)
            wProps.fireTime += tick;
        }
    }

    getGridCell(pos) {
        if(pos === null) return null
        const pCollider = this.player.components["boxCollider"]
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
}

class WeaponProps {
    constructor(projectileType, cooldown, duration = 0) {
        Object.assign(this, { projectileType, cooldown, duration })
        this.elapsedTime = 0;
        this.fireTime = 0;
        return this;
    }
}
