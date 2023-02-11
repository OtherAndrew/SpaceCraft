/**
 * Healthbar component
 * @author Jeep Naarkom
 */
class CHealthbar {
    constructor({x, y, maxWidth, offsetY, currentHp, maxHp}) {
        Object.assign(this, { x,y, maxWidth, offsetY, currentHp, maxHp });
        this.name = 'healthbar';
        this.hpPercent = (currentHp/maxHp)*100
        return this;
    }
    hpUpdate(){
        this.hpPercent = this.currentHp/this.maxHp;
    }

    draw(ctx, x, y){

        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.rect(this.x,this.y + 20, this.maxWidth * this.hpPercent, 10)
        ctx.fill();
        ctx.stroke();
    }
}