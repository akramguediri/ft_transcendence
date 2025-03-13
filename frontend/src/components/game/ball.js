export default class Ball {
    constructor(x, y, vx, vy, r, offset, sideWallRatio, canvas) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.canvas = canvas
        this.offset = offset
        this.sideWallRatio = sideWallRatio
        this.r = r
        if (this.canvas.getContext('2d') != null) {
            this.ctx = this.canvas.getContext('2d')
        } else {
            throw new Error("Failed to get 2d context from canvas")
        }
    }

    getX() {
        return this.x
    }
    getY() {
        return this.y
    }
    getVx() {
        return this.vx
    }
    getVy() {
        return this.vy
    }
    getR() {
        return this.r
    }
    getKicker() {
        return this.kicker
    }

    setX(x) {
        this.x = x
    }
    setY(y) {
        this.y = y
    }
    setVx(vx) {
        this.vx = vx
    }10
    setVy(vy) {
        this.vy = vy
    }
    setR(r) {
        this.r = r
    }
    setKicker(kicker) {
        this.kicker = kicker
    }

    reset() {
        this.x = this.canvas.width / 2
        this.y = this.canvas.height / 2
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#333333';
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.vy > this.canvas.height - this.r - this.offset || this.y + this.vy < this.r + this.offset) {
            this.vy = -this.vy;
        }
        if (this.x + this.vx > this.canvas.width - this.r - this.offset || this.x + this.vx < this.r + this.offset) {
            if (this.y + this.vy < this.canvas.height * this.sideWallRatio * 0.5 + this.r && this.y + this.vy > this.canvas * (1 - this.sideWallRatio / 2) - this.r) {
                this.vx = -this.vx
            }
        }
    }
}