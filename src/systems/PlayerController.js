class PlayerController {
    constructor(player) {
        this.player = player
        this.pTransform = this.player.components.transform
        this.pState = this.player.components.state
        this.pSprite = this.player.components.sprite
        this.pStats = this.player.components['stats']
        this.acceleration = 1
        this.fastFall = 3;

        this.jetpackTime = 0;
        this.jetpackDuration = 5;
        this.elapsedTime = 0;
        this.jetpackCooldown = 5;
    }

    /**
     * Updates player state, animation, and position
     * @param keys keyboard input
     * @param mouseDown mouse click
     * @param mouse mouse position
     * @param tick time slice
     * @param terrain terrain map
     */
    update(keys, mouseDown, mouse, tick, terrain) {
        this.pSprite.setAnimation(this.#handleKeyboard(keys, tick));
        // if (mouseDown) this.#handleMouse(mouse, terrain);
        if (this.pState.grounded) {
            if (this.elapsedTime >= this.jetpackCooldown) {
                this.elapsedTime = 0;
                this.jetpackTime = 0;
            } else {
                this.elapsedTime += tick;
            }
        }
    }

    #handleKeyboard(key, tick) {
        let state = this.pSprite.currentState;

        if ((key[' '] || key['w']) && this.pState.grounded) { //jump
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
            if (key['s']) {
                this.pTransform.velocityX = -this.pStats.speed / 4;
                state = this.pState.grounded ? 'walkL' : 'crouchL';
            } else {
                this.pTransform.velocityX -= this.acceleration;
                state = this.pState.grounded ? 'walkL' : 'jumpL';
            }
        } else if (key['d']) {
            this.pState.direction = "right"
            if (key['s']) {
                this.pTransform.velocityX = this.pStats.speed / 4;
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

    // #handleMouse(pos, player, terrainMap) {
    //     let coords = this.#getGridCell(pos, player)
    //     let mapY = coords.y || 0;
    //     let mapX = coords.x || 0
    //     let selected = terrainMap[mapY][mapX];
    //     const cursorTarget = {x: pos.x + 25/2, y: pos.y + 25/2};
    //     //console.log(selected.tag)
    //     let active = this.hud.activeContainer.item;
    //     if (active) {
    //         if(/tile|craft/.test(active.tag)) {
    //             if(selected.tag.includes('air')) {
    //                 let tag = this.containerManager.removeFromPlayer(this.hud.activeContainer.slot);
    //                 let newBlock;
    //                 if (active.tag.includes('craft'))
    //                     newBlock = this.entityManager.addEntity(generateCrafter(tag, mapX, mapY));
    //                 else
    //                     newBlock = this.entityManager.addEntity(generateBlock(tag, mapX, mapY, 'worldgen'));
    //                 if (newBlock) {
    //                     selected.tag = newBlock.tag
    //                     selected.id = newBlock.id
    //                     console.log(newBlock)
    //                 }
    //             }
    //         } else if (active.tag === 'pickaxe') {
    //             if(/tile|craft/.test(selected.tag)) {
    //                 let e = this.entityManager.getEntity(selected.id)
    //                 e.components.lifespan.current -= 1
    //                 if(e.components.lifespan.current <= 0) {
    //                     selected.tag = 'air'
    //                     selected.id = null
    //                     delete e.components["boxCollider"]
    //                     this.containerManager.addToInventory('player', this.#resizeBlock(e))}
    //             }
    //         } else if (active.tag === 'gun') {
    //             this.projectileManager.shoot('bullet', cursorTarget, player)
    //         } else if (active.tag === 'grenadeLauncher') {
    //             this.projectileManager.shoot('bomb', cursorTarget, player)
    //         } else if (active.tag === 'handCannon') {
    //             this.projectileManager.shoot('smallBomb', cursorTarget, player)
    //         } else if (active.tag === 'flamethrower') {
    //             this.projectileManager.shoot('fire', cursorTarget, player)
    //         } else if (active.tag === 'minigun') {
    //             this.projectileManager.shoot('minigunbullet', cursorTarget, player)
    //         } else if (active.tag === 'railgun') {
    //             this.projectileManager.shoot('railgunbullet', cursorTarget, player)
    //         }
    //     } else if (selected.tag.includes('craft')) {
    //         this.containerManager.loadInventory(cleanTag(selected.tag));
    //         this.game.activateMenu();
    //     }
    // }
}
