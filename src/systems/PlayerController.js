class PlayerController {
    constructor(player) {
        this.player = player
        this.playerPos = this.player.components.transform
        this.playerSprite = this.player.components.sprite
        this.hitBox = this.player.components.boxCollider;
        this.speed = 1
        this.gravity = 1.5
        this.direction = 'right';
    }
    /**
     * Controlls
     * a - move left
     * d - move right
     * " " - jump
     * @param {input params} input
     */
    update(input) {
        const currentState = this.playerSprite.currentState;
        if(input['a']) {
            this.playerPos.velocityX = clamp(this.playerPos.velocityX - this.speed, -this.playerPos.maxVelocityX, 0)
            this.playerSprite.setAnimation('walkL');
            this.direction = 'left'
        } else if(input['d']) {
            this.playerPos.velocityX = clamp(this.playerPos.velocityX + this.speed, 0, this.playerPos.maxVelocityX)
            this.playerSprite.setAnimation('walkR');
            this.direction = "right"
        } else if(input['w']) { // jetpack?
            // this.playerPos.velocityY = clamp(this.playerPos.velocityY - this.speed, -this.playerPos.maxVelocityY, 0)

            this.player.components.rigidBody.isGrounded = false
            this.playerPos.velocityY = -20;

        }else if(input['s']) { // fast fall
            this.playerPos.velocityY = clamp(this.playerPos.velocityY + this.speed, 0, this.playerPos.maxVelocityY)
            this.playerPos.velocityX = 0;
            if (this.direction === 'right') this.playerSprite.setAnimation('crouchR');
            else if (this.direction === "left") this.playerSprite.setAnimation('crouchL');
        } else {
            this.playerPos.velocityX === 0 ? this.playerPos.velocityX = 0 :
                (this.playerPos.velocityX > 0 ? this.playerPos.velocityX -= this.speed : this.playerPos.velocityX += this.speed)
            this.playerPos.velocityY === 0 ? this.playerPos.velocityY = 0 :
                (this.playerPos.velocityY > 0 ? this.playerPos.velocityY -= this.speed : this.playerPos.velocityY += this.speed)
            if (this.direction === 'right' && this.player.components.rigidBody.isGrounded) this.playerSprite.setAnimation('idleR');
            else if (this.direction === "left" && this.player.components.rigidBody.isGrounded) this.playerSprite.setAnimation('idleL');
        }
        if((input[' ']) && this.player.components.rigidBody.isGrounded) { //jump
            this.playerPos.velocityY = -25
            this.player.components.rigidBody.isGrounded = false
            if (currentState === 'idleR' || currentState === 'walkR') this.playerSprite.setAnimation('jumpR');
            else if (currentState === 'idleL' || currentState === 'walkL') this.playerSprite.setAnimation('jumpL');
        }

        if(!this.player.components.rigidBody.isGrounded) {
            this.playerPos.velocityY += this.gravity
        } else if(this.player.components.rigidBody.isGrounded) {
            this.playerPos.velocityY = 0
        }

        // move hitbox with player
        this.playerPos.x += this.playerPos.velocityX
        this.playerPos.y += this.playerPos.velocityY
        this.hitBox.x = this.playerPos.x
        this.hitBox.y = this.playerPos.y
    }
}