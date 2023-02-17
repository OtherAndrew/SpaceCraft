

const getTerrain = (entityManager) => {

    let noiseMap = []
    let terrainMap = []
    let spawnMap = []
    //Sets numerical value ranges to blocks so we can map them to the terrainMap
        // Ranges from 0 to 10 ish
    let blockValues = {
        CHUNK_0: [
            'copper',
            'coal',
            'coal',
            'null',
            'stone',
            'sand',
            'sand',
            'dirt',
            'null',
            'dirt',
            'dirt'
        ],
        CHUNK_1: [
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
        CHUNK_2: [
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
        CHUNK_3: [
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
        CHUNK_4: [
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
        CHUNK_5: [
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
        CHUNK_6: [
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
        CHUNK_7: [
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
        CHUNK_8: [
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
        ],
        CHUNK_9: [
            'bedrock',
            'bedrock',
            'bedrock',
            'bedrock',
            'bedrock',
            'bedrock',
            'bedrock',
            'bedrock',
            'bedrock',
            'bedrock',
            'bedrock'
        ]

    }
    let blocksPerChunk = 23
    let startRow = 226

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

    function generateSpawnLocations() {
        let yOffset = 5
        //generate surface level locations
        for(let i = 0; i < terrainMap.length; i += WIDTH/BLOCKSIZE) {
            spawnMap.push({x: i, y: startRow - yOffset})
        }
    }

    /**
     * Creates a tile entity according to the noise value 
     * @param {*} props 
     * @returns 
     */
    function createBlock(props) {
        let value = clamp(props.value, 0, 10)
        let index = blockValues['CHUNK_'+ Math.floor((props.row - startRow) / blocksPerChunk)][value]
        if(index === 'null') {
            return {tag: 'air', id: null}
        }
        let block = 'tile_' + index
        return entityManager.addEntity(generateBlock(block, props.x, props.y, 'terraingen'));
    }



    function generateBackgrounds() {
        let surfaceBackWidth = 512
        let surfaceBackHeight = 240
        let undergroundWidth = 384
        let undergroundHeight = 216
        let scale = 2
        let scaleUnder = 6
        let caveBGYVal = HEIGHT_PIXELS - (undergroundHeight * scaleUnder) - HEIGHT * .5
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
                        y:  caveBGYVal,
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
                        y:  caveBGYVal,
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
                        y:  caveBGYVal,
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
                        y:  caveBGYVal,
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
                        y:  caveBGYVal,
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
                        y:  caveBGYVal,
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
            tag: 'tile_bedrock',
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
            tag: 'tile_bedrock',
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
            tag: 'tile_bedrock',
            components: [
                new CTransform({
                    x: 0,
                    y: HEIGHT_PIXELS - (HEIGHT * .5) - (5 * BLOCKSIZE)
                }),
                new CBoxCollider({
                    x: 0,
                    y: HEIGHT_PIXELS - (HEIGHT * .5) - (5 * BLOCKSIZE),
                    width: WIDTH_PIXELS,
                    height: HEIGHT * .5
                })
            ]
        })

        //top
        entityManager.addEntity({
            tag: 'tile_bedrock',
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
    generateSpawnLocations()
    return [terrainMap, spawnMap]
}

const spawnMob = (map, player) => {
    let playerX = player.components.transform.x / BLOCKSIZE
    let playerY = player.components.transform.Y / BLOCKSIZE
    let closestNode = Math.floor(getDistance(player.components.transform, {x: map[0].x * BLOCKSIZE, y: map[0].y * BLOCKSIZE}))
    console.log(closestNode)
    let index = 0
    map.forEach((node, i) => {
        let distance = Math.floor(getDistance(player.components.transform, {x: node.x * BLOCKSIZE, y: node.y * BLOCKSIZE}))
        if(distance < closestNode) {
            closestNode = distance
            index = i
        }
    })
    console.log(closestNode)
    return index
}