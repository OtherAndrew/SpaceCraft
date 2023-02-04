

const getTerrain = (entityManager) => {

    let noiseMap = []
    let terrainMap = []
    //Sets numerical value ranges to blocks so we can map them to the terrainMap
        // Ranges from 0 to 10 ish
    let blockValues = [
            'ruby',
            'stone',
            'stone',
            'stone',
            'dirt',
            'dirt',
            'null',
            'null',
            'null',
            'null',
        ]

        /**
     * Private class function. Generates a (2*gridSize) * (2*gridSize) matrix of perlin noise values
     * The values are from -1 to 1 so it is modified by multiplying by valueOffset and adding valueAddition
     * so it can be easy to work with.
     * Range from 0 to 120 ish.
     */
        function generateNoiseMap() {
            let valueOffset = 10
            let valueAdditional = 5
            for(let y = 0; y < GRIDSIZE; y += 1/GRIDSIZE) {
                let row = []
                for(let x = 0; x < GRIDSIZE; x += 1/GRIDSIZE) {
                    let v = parseInt(perlin.get(x,y) * valueOffset + valueAdditional)
                    row.push(v)
                }
                noiseMap.push(row)
                row = []
            }
        }


         /**
     * Private class function. Uses a noiseMap to place blocks according to the blockValues.
     * 
     */
    function generateTerrain() {
        //fill first half of terrainmap matrix with empty air cells
        for(let i = 0; i < noiseMap.length; i++) {
            let r = []
            for(let j = 0; j < noiseMap.length; j++) {
                r.push({
                    tag: 'air',
                    id: null
                })
            }
            terrainMap.push(r)
        }
        let sizeSoFar = terrainMap[0].length
        noiseMap.forEach( (row, y) => {
            y += sizeSoFar
            let r = []
            row.forEach((val, x) => {
                let e = createBlock({
                    x: x * BLOCKSIZE,
                    y: y * BLOCKSIZE,
                    value: val,
                    recurse: true
                })
                r.push({
                    tag: e.tag,
                    id: e.id
                })
            })
            terrainMap.push(r)
        })
    }


    /**
     * Creates a tile entity according to the noise value 
     * @param {*} props 
     * @returns 
     */
    function createBlock(props) {
        switch(blockValues[props.value]) {
            case 'dirt':
                if(props.y < (50 * BLOCKSIZE) && props.recurse) {
                    props.value = Math.round(Math.random() + 3.7)
                    props.recurse = false
                    return createBlock(props)
                } else if (props.y > (120 * BLOCKSIZE) && props.recurse) {
                    props.value = Math.round(Math.random() + 2.7)
                    props.recurse = false
                    return createBlock(props)
                }
                return entityManager.addEntity(new DirtBlock({
                    sprite: ASSET_MANAGER.cache[TILES_DIRT_PATH],
                    x: props.x,
                    y: props.y,
                    sWidth: 16,
                    sHeight: 16,
                    scale: BLOCKSIZE / 16,
                    frameX: getRandomInt(6),
                    frameY: getRandomInt(2)
                }));
            case 'stone':
                if(props.y > (6 * BLOCKSIZE) && props.y < (120 * BLOCKSIZE) && props.recurse) {
                    props.value = Math.round(Math.random() + 3)
                    props.recurse = false
                    return createBlock(props)
                } else if(props.y > (120 * BLOCKSIZE) && props.recurse) {
                    props.value = Math.round(Math.random() + .4)
                    props.recurse = false
                    return createBlock(props)
                }
                return entityManager.addEntity(new StoneBlock({
                    sprite: ASSET_MANAGER.cache[TILES_STONE_PATH],
                    x: props.x,
                    y: props.y,
                    sWidth: 16,
                    sHeight: 16,
                    scale: BLOCKSIZE / 16,
                    frameX: getRandomInt(6),
                    frameY: getRandomInt(2)
                }));
            case 'ruby':
                if(props.y < (120 * BLOCKSIZE)) {
                    props.value = Math.round(Math.random() + .4)
                    props.recurse = false
                    return createBlock(props)
                }
                return entityManager.addEntity(new RubyBlock({
                    sprite: ASSET_MANAGER.cache[TILES_RUBY_PATH],
                    x: props.x,
                    y: props.y,
                    sWidth: 16,
                    sHeight: 16,
                    scale: BLOCKSIZE / 16,
                    frameX: getRandomInt(3)
                }));
            default: 
                return {tag: 'air', id: null}
        }
    }



    function generateBackgrounds() {
        let surfaceBackWidth = 512
        let surfaceBackHeight = 240
        let undergroundWidth = 384
        let undergroundHeight = 216
        let scale = 2
        let scaleUnder = 6
        let offset = BLOCKSIZE * 2

        for(let i = 0; i < 2; i++) {

            entityManager.addEntity({
                tag: 'background_0',
                components: [
                    new CTransform({
                        x: (surfaceBackWidth * i * scale),
                        y: (-surfaceBackHeight * scale) + HEIGHT_PIXELS * .5 + offset,
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[BACKGROUND_SURFACE_0],
                        sWidth: surfaceBackWidth,
                        sHeight: surfaceBackHeight,
                        scale: scale,
                    })
                ]
            })
            entityManager.addEntity({
                tag: 'background_0',
                components: [
                    new CTransform({
                        x: (1920 * i * 1),
                        y:  HEIGHT_PIXELS * .5 + (1080 * 1),
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[BACKGROUND_DIRT],
                        sWidth: 960,
                        sHeight: 540,
                        scale: 2,
                    })
                ]
            })
            entityManager.addEntity({
                tag: 'background_0',
                components: [
                    new CTransform({
                        x: (undergroundWidth * i * scaleUnder),
                        y:  HEIGHT_PIXELS - (undergroundHeight * scaleUnder),
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[UNDERGROUND_BACKGROUND_0],
                        sWidth: undergroundWidth,
                        sHeight: undergroundHeight,
                        scale: scaleUnder,
                    })
                ]
            })
            entityManager.addEntity({
                tag: 'background_1',
                components: [
                    new CTransform({
                        x: (surfaceBackWidth * i * scale),
                        y: (-surfaceBackHeight * scale) + HEIGHT_PIXELS * .5 + offset,
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[BACKGROUND_SURFACE_1],
                        sWidth: surfaceBackWidth,
                        sHeight: surfaceBackHeight,
                        scale: scale,
                    })
                ]
            })
            entityManager.addEntity({
                tag: 'background_1',
                components: [
                    new CTransform({
                        x: (undergroundWidth * i * scaleUnder),
                        y:  HEIGHT_PIXELS - (undergroundHeight * scaleUnder),
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[UNDERGROUND_BACKGROUND_1],
                        sWidth: undergroundWidth,
                        sHeight: undergroundHeight,
                        scale: scaleUnder,
                    })
                ]
            })
            entityManager.addEntity({
                tag: 'background_2',
                components: [
                    new CTransform({
                        x: (undergroundWidth * i * scaleUnder),
                        y:  HEIGHT_PIXELS - (undergroundHeight * scaleUnder),
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[UNDERGROUND_BACKGROUND_2],
                        sWidth: undergroundWidth,
                        sHeight: undergroundHeight,
                        scale: scaleUnder,
                    })
                ]
            })
            entityManager.addEntity({
                tag: 'background_3',
                components: [
                    new CTransform({
                        x: (undergroundWidth * i * scaleUnder),
                        y:  HEIGHT_PIXELS - (undergroundHeight * scaleUnder),
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[UNDERGROUND_BACKGROUND_3],
                        sWidth: undergroundWidth,
                        sHeight: undergroundHeight,
                        scale: scaleUnder,
                    })
                ]
            })
            entityManager.addEntity({
                tag: 'background_4',
                components: [
                    new CTransform({
                        x: (undergroundWidth * i * scaleUnder),
                        y:  HEIGHT_PIXELS - (undergroundHeight * scaleUnder),
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[UNDERGROUND_BACKGROUND_4],
                        sWidth: undergroundWidth,
                        sHeight: undergroundHeight,
                        scale: scaleUnder,
                    })
                ]
            })
            entityManager.addEntity({
                tag: 'background_5',
                components: [
                    new CTransform({
                        x: (undergroundWidth * i * scaleUnder),
                        y:  HEIGHT_PIXELS - (undergroundHeight * scaleUnder),
                        maxVelocity: 0
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[UNDERGROUND_BACKGROUND_5],
                        sWidth: undergroundWidth,
                        sHeight: undergroundHeight,
                        scale: scaleUnder,
                    })
                ]
            })
        }
    }

    generateBackgrounds()
    generateNoiseMap()
    generateTerrain()
    return terrainMap
}