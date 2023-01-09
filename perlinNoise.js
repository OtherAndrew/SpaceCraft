
/*
Sieve of Sundaram
function generatePrimeNumber(min, max) {
    let n = Math.random() * (max - min) + min
    let k = Math.floor((n-1)/2)
    let a = []
    for(let i = 0; i <= k; i++) {
        a.push(true)
    }
    for(let i = 1; i <= Math.sqrt(k); i++) {
        let j = i
        while( (i + j+2*i*j) <= k) {
            a[i + j+2*i*j] = false
            j += 1
        }
    }
    let t = []
    a.forEach((e, i) => {
        if(e) {
            t.push(i)
        }
    })
    t.forEach((e, i) => {
        t[i] = e * 2 + 1
    })
}
*/

const MIN = 100000
const MAX = 1000000
const PERSISTANCE = .51
const OCTAVES = 9

function generatePrimeNumber(min, max) {
    let n = Math.floor(Math.random() * (max - min) + min)
    if(isPrime(n)) return n
    for(let i = n; i < max; i ++) {
        if(isPrime(i)) return i
    }
    for(let i = n; i >= min; i--) {
        if(isPrime(i)) return i
    }
}

function isPrime(n) {
    let s = Math.sqrt(n)
    for(let j = 2; j <= s; j++) {
        if(n % j === 0) {
            return false
        }
    }
    return true
}

/*
function Noise1D(x) {
    x = (x<<13)^13
    const primeA = generatePrimeNumber(MIN, MAX)
    const primeB = generatePrimeNumber(MIN, MAX)
    const primeC = generatePrimeNumber(MIN, MAX)

    return (1.0-((x*(x*x*primeA+primeB)+primeC) & 0x7fffffff)/1073741824.0)
}
*/
function Noise1D(x) {
    x = (x << 13)^ x
    return (1.0-((x*(x*x*15731+789221)+1376312589) & 0x7fffffff)/1073741824.0)
}

function smoothedNoise1D(x, noiseMap, index) {
    return Noise1D(x)/2 + Noise1D(noiseMap[index-1])/4 + Noise1D(noiseMap[index+1])/4
}

function interpolatedNoise(x, noiseMap, index) {
    let xR = Math.round(x)
    let f = x - xR
    let v1 = smoothedNoise1D(xR, noiseMap, index)
    let v2 = smoothedNoise1D(noiseMap[index+1], noiseMap, index)
    return cosineInterpolate(v1,v2,f)

}

function cosineInterpolate(a, b, x) {
    let ft = x * Math.PI
    let f = (1 - Math.cos(ft)) * .5
    return a*(1-f) + b * f
}

function perlineNoise1D(x, noiseMap, index) {
    let total = 0
    let p = PERSISTANCE
    let n = OCTAVES - 1
    for(let i = 0; i <= n; i++) {
        let frequency = Math.pow(2, i)
        let amplitute = Math.pow(p, i)
        total = total + interpolatedNoise(x * frequency, noiseMap, index) * amplitute
    }
    return total
}

const canvas = document.getElementById('gameWorld')
const ctx = canvas.getContext('2d')
const WIDTH = 1024

function draw() {
    let n = WIDTH
    let noiseMap = []
    for(let i = 0; i < n; i++) {
        noiseMap.push(Math.random() + 1)
    }
    noiseMap.forEach((e, i) => {
        noiseMap[i] = perlineNoise1D(e, noiseMap, i)
    })
    console.log(noiseMap)
    ctx.beginPath()
    ctx.moveTo(0, 700)
    for(let i = 0; i< noiseMap.length; i += 32) {
        ctx.lineTo(i, noiseMap[i] * WIDTH + WIDTH/2)
    }
    ctx.stroke()
}


/*
function draw() {
    let noiseMap = []
    for(let i = 0; i < 24; i++) {
        let row = []
        for(let j = 0; j < 32; j++) {
            row.push(Math.random())
        }
        noiseMap.push(row)
    }

    for(let i = 0; i < 24; i++) {
        for(let j = 0; j < 32; j++) {
            noiseMap[i][j] = perlinNoise2D()
        }
    }
    
}
*/
draw()

function createTerrain() {
    const blockWidth = 32
    const blockHeight = 24
    const tMap = []
    for(let i = 0; i < blockHeight; i++) {
        let row = []
        for(let j = 0; j < blockWidth; j++) {
            if(i < 15) {
                row.push('blue')
            } else {
                row.push('brown')
            }
            
        }
        tMap.push(row)
    }
}

function noise2D(x, y) {
    let n = x + y * 57
    n = (n << 13) ^ n
    return (1.0 - ((n*(n*n*15731+789221)+1376312589) & 0x7fffffff)/ 1073741824.0)
}

function smoothNoise2D(x, y) {
    let corners = (noise2D(x-1,y-1) + noise2D(x+1, y-1) + noise2D(x-1, y+1) + noise2D(x+1,y+1)) / 16
    let sides = (noise2D(x-1, y) + noise2D(x+1, y) + noise2D(x,y-1) + noise2D(x, y+1)) / 8
    let center = noise2D(x,y)/4
    return corners + sides + center
}

function interpolatedNoise2D(x, y) {
    let intX = Math.round(x)
    let fractX = x - intX

    let intY = Math.round(y)
    let fractY = y - intY

    let v1 = smoothNoise2D(intX, intY)
    let v2 = smoothNoise2D(intX + 1, intY)
    let v3 = smoothNoise2D(intX, intY+1)
    let v4 = smoothNoise2D(intX+1, intY+1)
    let i1 = cosineInterpolate(v1, v2, fractX)
    let i2 = cosineInterpolate(v3, v4, fractX)

    return cosineInterpolate(i1, i2, fractY)
}

function perlinNoise2D(x, y) {
    let total = 0
    for(let i = 0; i < OCTAVES; i++) {
        let frequency = Math.pow(2, i)
        let amplitute = Math.pow(PERSISTANCE, i)
        total = total + interpolatedNoise2D(x*frequency, y*frequency) * amplitute
    }
    return total
}


