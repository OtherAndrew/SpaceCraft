class PlayerController {
    constructor(player) {
        this.player = player
        this.pTransform = this.player.components.transform
        this.pState = this.player.components.state
        this.pSprite = this.player.components.sprite
        this.acceleration = 1
        this.fastFall = 3;

        this.jetpackTime = 0;
        this.jetpackDuration = 2;
        this.elapsedTime = 0;
        this.jetpackCooldown = 5;
    }

    /**
     * Updates player state, animation, and position
     * @param input keyboard input
     */
    update(input, tick) {
        let state = this.pSprite.currentState;

        if ((input[' ']) && this.pState.grounded) { //jump
            this.pState.grounded = false
            this.pTransform.velocityY = -(GRAVITY + 15);
            state = this.pState.direction === 'right' ? 'jumpR' : 'jumpL';
        }

        if (input['w']) { // jetpack?
            if (this.jetpackTime < this.jetpackDuration) {
                this.pState.grounded = false
                this.pTransform.velocityY = -(GRAVITY + 10);
                this.jetpackTime += tick;
                state = this.pState.direction === 'right' ? 'flyR' : 'flyL';
            } else {
                state = this.pState.direction === 'right' ? 'idleR' : 'idleL';
            }
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

        if (this.pState.grounded) {
            if (this.elapsedTime >= this.jetpackCooldown) {
                this.elapsedTime = 0;
                this.jetpackTime = 0;
            } else {
                this.elapsedTime += tick;
            }
        }

        this.pSprite.setAnimation(state);
    }
}
