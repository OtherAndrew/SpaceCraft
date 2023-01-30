


class RayCastDemo extends Scene {
    constructor() {
        super()
    }

    init() {
        this.#test()
    }

    update() {

    }

    draw() {

    }

    #digitalDifferentialAnalysis(player, mouse) {
        const rayDir = normalize(player, mouse)
        const stepSizeVect = {
            x: Math.sqrt(1 + (dirVect.y/dirVect.x) * (dirVect.y/dirVect.x)),
            y: Math.sqrt(1 + (dirVect.x/dirVect.y) * (dirVect.x/dirVect.y))
        }
        const mapCheckVect = {
            x: Math.trunc(player.components.transform.x),
            y: Math.trunc(player.components.transform.y)
        }
        const rayLength1D = {
            x: 0,
            y: 0
        }
        const stepVect = {
            x: 0,
            y: 0
        }

        if(rayDir.x < 0) {
            stepVect.x = -1
            rayLength1D.x = (player.x - mapCheckVect.x) * stepSizeVect.x
        } else {
            stepVect.x = 1
            rayLength1D.x = ((mapCheckVect.x + 1) - player.x) * stepSizeVect.x
        }
        if(rayDir.y < 0) {
            stepVect.y = -1
            rayLength1D.x = (player.y - mapCheckVect.y) * stepSizeVect.y
        } else {
            stepVect.y = 1
            rayLength1D.x = ((mapCheckVect.y + 1) - player.y) * stepSizeVect.y
        }

        let blockFound = false
        let maxDistance = 100
        let distance = 0

        while(!blockFound && distance < maxDistance) {
            if(rayLength1D.x < rayLength1D.y) {
                mapCheckVect.x += stepVect.x
                distance = rayLength1D.x
                rayLength1D.x += stepSizeVect.x
            } else {
                mapCheckVect.y += stepVect.y
                distance = rayLength1D.y
                rayLength1D.y += stepSizeVect.y
            }
            // check if ray hit a block
        }
    }

    #test() {
        let vect1 = {
            x: 44,
            y: 31
        }

        let vect2 = {
            x: 6,
            y: 16
        }
        console.log(normalize(vect1, vect2))
    }
}