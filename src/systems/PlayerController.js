class PlayerController {
    constructor(player) {
        this.player = player
        this.pTransform = this.player.components.transform
        this.pState = this.player.components.state
        this.pSprite = this.player.components.sprite
        this.acceleration = 1
        this.fastFall = 3;
    }

    /**
     * Updates player state, animation, and position
     * @param input keyboard input
     */
    update(input) {
        let state = this.pSprite.currentState;

        if ((input[' ']) && this.pState.grounded) { //jump
            this.pState.grounded = false
            this.pTransform.velocityY = -(GRAVITY + 20);
            state = this.pState.direction === 'right' ? 'jumpR' : 'jumpL';
        }

        if (input['w']) { // jetpack?
            this.pState.grounded = false
            this.pTransform.velocityY = -(GRAVITY + 10);
            state = this.pState.direction === 'right' ? 'flyR' : 'flyL';
        }

        if (input['a']) {
            this.pTransform.velocityX -= this.acceleration;
            this.pState.direction = 'left'
            state = this.pState.grounded ? 'walkL' : 'flyL';
        } else if (input['d']) {
            this.pTransform.velocityX += this.acceleration;
            this.pState.direction = "right"
            state = this.pState.grounded ? 'walkR' : 'flyR';
        } else if (input['s']) { // fast fall
            this.pTransform.velocityY += this.fastFall
            this.pTransform.velocityX = 0;
            state = this.pState.direction === 'right' ? 'crouchR' : 'crouchL';
        } else { // no input
            this.pTransform.velocityX = 0;
            if (this.pState.grounded) {
                state = this.pState.direction === 'right' ? 'idleR' : 'idleL';
            }
        }
        this.pSprite.setAnimation(state);
    }
}
