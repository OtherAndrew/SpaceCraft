

const getTerrain = (entityManager) => {

    let noiseMap = []
    let terrainMap = []
    //Sets numerical value ranges to blocks so we can map them to the terrainMap
        // Ranges from 0 to 10 ish
    let blockValues = {
        FIRST: [
            'copper',
            'coal',
            'coal',
            'stone',
            'stone',
            'sand',
            'sand',
            'dirt',
            'dirt',
            'dirt',
            'dirt'
        ],
        SECOND: [
            'cobalt',
            'copper',
            'copper',
            'coal',
            'stone',
            'stone',
            'dirt',
            'dirt',
            'null',
            'null',
            'null'
        ],
        THIRD: [
            'iron',
            'silica',
            'cobalt',
            'copper',
            'stone',
            'stone',
            'dirt',
            'null',
            'null',
            'null',
            'null'
        ],
        FOURTH: [
            'bismuth',
            'tin',
            'iron',
            'silica',
            'stone',
            'stone',
            'null',
            'null',
            'null',
            'null',
            'null'
        ],
        FIFTH: [
            'tungsten',
            'bismuth',
            'tin',
            'iron',
            'stone',
            'stone',
            'null',
            'null',
            'null',
            'null',
            'null'
        ],
        SIXTH: [
            'titanite',
            'tungsten',
            'tin',
            'coal',
            'stone',
            'stone',
            'null',
            'null',
            'null',
            'null',
            'null'
        ],
        SEVENTH: [
            'gold',
            'titanite',
            'iron',
            'ferrite',
            'stone',
            'stone',
            'null',
            'null',
            'null',
            'null',
            'null'
        ],
        EIGHT: [
            'titanite',
            'ruby',
            'tungsten',
            'coal',
            'stone',
            'stone',
            'null',
            'null',
            'null',
            'null',
            'null'
        ],
        NINTH: [
            'gold',
            'paraffin',
            'silica',
            'titanite',
            'stone',
            'stone',
            'null',
            'null',
            'null',
            'null',
            'null'
        ]

    }
    let firstChunk = 251
    let secondChunk = 226
    let thirdChunk = 301
    let fourthChunk = 326
    let fifthChunk = 351
    let sixthChunk = 376
    let seventhChunk = 401
    let eighthChunk = 426
    let ninthChunk = 451

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
                    row: y,
                    value: val
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
        let value = clamp(props.value, 0, 10)
        let block = 'tile_'
        if (props.row < firstChunk) {
            block += blockValues.FIRST[value]
        } else if (props.row < secondChunk) {
            let val = blockValues.SECOND[value]
            if(val === 'null') return {tag: 'air', id: null}
            block += val
        } else if (props.row < thirdChunk) {
            let val = blockValues.THIRD[value]
            if(val === 'null') return {tag: 'air', id: null}
            block += val
        } else if (props.row < fourthChunk) {
            let val = blockValues.FOURTH[value]
            if(val === 'null') return {tag: 'air', id: null}
            block += val
        } else if (props.row < fifthChunk) {
            let val = blockValues.FIFTH[value]
            if(val === 'null') return {tag: 'air', id: null}
            block += val
        } else if (props.row < sixthChunk) {
            let val = blockValues.SIXTH[value]
            if(val === 'null') return {tag: 'air', id: null}
            block += val
        } else if (props.row < seventhChunk) {
            let val = blockValues.SEVENTH[value]
            if(val === 'null') return {tag: 'air', id: null}
            block += val
        } else if (props.row < eighthChunk) {
            let val = blockValues.EIGHT[value]
            if(val === 'null') return {tag: 'air', id: null}
            block += val
        } else if (props.row < ninthChunk) {
            let val = blockValues.NINTH[value]
            if(val === 'null') return {tag: 'air', id: null}
            block += val
        }
        return entityManager.addEntity(generateBlock(block, props.x, props.y));
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.SURFACE_0],
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.DIRT],
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.UNDERGROUND_0],
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.SURFACE_1],
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.UNDERGROUND_1],
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.UNDERGROUND_2],
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.UNDERGROUND_3],
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.UNDERGROUND_4],
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
                        sprite: ASSET_MANAGER.cache[BG_PATH.UNDERGROUND_5],
                        sWidth: undergroundWidth,
                        sHeight: undergroundHeight,
                        scale: scaleUnder,
                    })
                ]
            })
        }
    }
    function generateBorders() {
        // left border collider
        entityManager.addEntity({
            tag: 'tile',
            components: [
                new CTransform({
                    x: 0,
                    y: 0
                }),
                new CBoxCollider({
                    x: 0,
                    y: 0,
                    width: WIDTH * .5,
                    height: HEIGHT_PIXELS
                })
            ]
        })

        // right border collider
        entityManager.addEntity({
            tag: 'tile',
            components: [
                new CTransform({
                    x: WIDTH_PIXELS - (WIDTH * .5),
                    y: 0
                }),
                new CBoxCollider({
                    x: WIDTH_PIXELS - (WIDTH * .5),
                    y: 0,
                    width: WIDTH * .5,
                    height: HEIGHT_PIXELS
                })
            ]
        })

        // bottom border
        entityManager.addEntity({
            tag: 'tile',
            components: [
                new CTransform({
                    x: 0,
                    y: HEIGHT_PIXELS - (HEIGHT * .5)
                }),
                new CBoxCollider({
                    x: 0,
                    y: HEIGHT_PIXELS - (HEIGHT * .5),
                    width: WIDTH_PIXELS,
                    height: HEIGHT * .5
                })
            ]
        })

        //top
        entityManager.addEntity({
            tag: 'tile',
            components: [
                new CTransform({
                    x: 0,
                    y: 0
                }),
                new CBoxCollider({
                    x: 0,
                    y: 0,
                    width: WIDTH_PIXELS,
                    height: HEIGHT * .5
                })
            ]
        })
    }

    generateBackgrounds()
    generateNoiseMap()
    generateTerrain()
    generateBorders()
    return terrainMap
}