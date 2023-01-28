class PlayerController {
    constructor(player) {
        this.player = player
        this.pTransform = this.player.components.transform
        this.pSprite = this.player.components.sprite
        this.pCollider = this.player.components.boxCollider;
        this.acceleration = 1
        this.gravity = 1.5


        this.direction = 'right';
    }

    /**
     * Updates player state, animation, and position
     * @param input keyboard input
     * @param tick time slice
     */
    update(input, tick) {
        if(input['a']) {
            this.pTransform.velocityX = clamp(this.pTransform.velocityX - this.acceleration, -this.pTransform.maxVelocityX, 0)
            if (this.player.components.rigidBody.isGrounded) this.pSprite.setAnimation('walkL');
            this.direction = 'left'
        } else if(input['d']) {
            this.pTransform.velocityX = clamp(this.pTransform.velocityX + this.acceleration, 0, this.pTransform.maxVelocityX)
            if (this.player.components.rigidBody.isGrounded) this.pSprite.setAnimation('walkR');
            this.direction = "right"
        } else if(input['s']) { // fast fall
            this.pTransform.velocityY = clamp(this.pTransform.velocityY + this.acceleration, 0, this.pTransform.maxVelocityY)
            this.pTransform.velocityX = 0;
            if (this.direction === 'right') this.pSprite.setAnimation('crouchR');
            else if (this.direction === "left") this.pSprite.setAnimation('crouchL');
        } else {
            // this.pTransform.velocityX === 0 ? this.pTransform.velocityX = 0 :
            //     (this.pTransform.velocityX > 0 ? this.pTransform.velocityX -= this.acceleration : this.pTransform.velocityX += this.acceleration)
            this.pTransform.velocityX = 0;
            if (this.direction === 'right' && this.player.components.rigidBody.isGrounded) this.pSprite.setAnimation('idleR');
            else if (this.direction === "left" && this.player.components.rigidBody.isGrounded) this.pSprite.setAnimation('idleL');
        }
        if((input[' ']) && this.player.components.rigidBody.isGrounded) { //jump
            this.pTransform.velocityY = -25
            this.player.components.rigidBody.isGrounded = false
            if (this.direction === 'right') this.pSprite.setAnimation('jumpR');
            else if (this.direction === "left") this.pSprite.setAnimation('jumpL');
        }

        if(input['w']) { // jetpack?
            // this.playerPos.velocityY = clamp(this.playerPos.velocityY - this.speed, -this.playerPos.maxVelocityY, 0)
            this.player.components.rigidBody.isGrounded = false
            this.pTransform.velocityY = -20;
            if (this.direction === 'right') this.pSprite.setAnimation('jumpR');
            else if (this.direction === "left") this.pSprite.setAnimation('jumpL');
        }

        if(!this.player.components.rigidBody.isGrounded) {
            this.pTransform.velocityY += this.gravity
        } else if(this.player.components.rigidBody.isGrounded) {
            this.pTransform.velocityY = 0
        }

        // set animation
        // move hitbox with player
        // CTransform.update()?
        this.pTransform.update(tick);
        // this.pCollider.x = this.pTransform.x
        // this.pCollider.y = this.pTransform.y
    }
}