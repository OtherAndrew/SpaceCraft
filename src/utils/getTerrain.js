const getTerrain = (entityManager, containerManager, mobFactory) => {

    let noiseMap = []
    let terrainMap = []
    let spawnMap = []
    let airPockets = []
    let spawnSpots = []
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
            'null',
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
            'iron',
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
            'silica',
            'tin',
            'iron',
            'stone',
            'stone',
            'null',
            'null',
            'null',
            'null',
            'null',
            'gold'
        ],
        CHUNK_5: [
            'ferrite',
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
            'bismuth',
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
            'bismuth',
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
    let oreCount = {}

    /**
     * Private class function. Generates a (2*gridSize) * (2*gridSize) matrix of perlin noise values
     * The values are from -1 to 1 so it is modified by multiplying by valueOffset and adding valueAddition
     * so it can be easy to work with.
     * Range from 0 to 120 ish.
     */
    function generateNoiseMap() {
        let valueOffset = 10
        let valueAdditional = 5
        for (let y = 0; y < GRIDSIZE; y += 1 / GRIDSIZE) {
            let row = []
            for (let x = 0; x < GRIDSIZE; x += 1 / GRIDSIZE) {
                let v = parseInt(perlin.get(x, y) * valueOffset + valueAdditional)
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
        for (let i = 0; i < noiseMap.length; i++) {
            let r = []
            for (let j = 0; j < noiseMap.length; j++) {
                r.push({
                    tag: 'air',
                    id: null
                })
            }
            terrainMap.push(r)
        }
        let sizeSoFar = terrainMap[0].length
        noiseMap.forEach((row, y) => {
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
        console.log(oreCount)
    }

    /**
     * Creates a tile entity according to the noise value
     * @param {*} props
     * @returns
     */
    function createBlock(props) {
        let value = clamp(props.value, 0, 10)
        let index = blockValues['CHUNK_' + Math.floor((props.row - startRow) / blocksPerChunk)][value]
        if (index === 'null') {
            return {tag: 'air', id: null}
        }
        index = randomize(index)
        let block = 'tile_' + index
        oreCount[index] ? oreCount[index]++ : oreCount[index] = 1
        return entityManager.addEntity(generateBlock(block, props.x, props.y, 'terraingen'));
    }

    function randomize(str) {
        let result = str
        let replacement = randomInt(30) > 15 ? 'stone' : 'dirt'
        let chance = GENSTATS[result.toUpperCase()]
        if (chance) {
            result = randomInt(30) > chance ? replacement : str
        }
        return result
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


        entityManager.addEntity({
            tag: 'background_0',
            components: [
                new CTransform({
                    x: surfaceBackWidth * 0.35 * scale,
                    y: (-surfaceBackHeight * scale) + HEIGHT_PIXELS * .5 + BLOCKSIZE * 3.5,
                    maxVelocity: 0
                }),
                new CSprite({
                    sprite: ASSET_MANAGER.cache[ENV_PATH.RED_PLANET],
                    sWidth: 1070,
                    sHeight: 1070,
                    scale: .125,
                })
            ]
        })

        for (let i = 0; i < 2; i++) {
            entityManager.addEntity({
                tag: 'background_1',
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
                tag: 'background_2',
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
                tag: 'background_3',
                components: [
                    new CTransform({
                        x: (undergroundWidth * i * scaleUnder),
                        y: caveBGYVal,
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
                        y: caveBGYVal,
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
        }
    }

    function generateBorders() {
        // left border collider
        entityManager.addEntity({
            tag: 'border',
            name: 'border',
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
            tag: 'border',
            name: 'border',
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

        //top
        entityManager.addEntity({
            tag: 'border',
            name: 'border',
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

    function generateStatues() {
        const gunParts = ['item_minigun part', 'item_railgun part', 'item_grenadeLauncher part']
        for (let r = 0; r < gunParts.length; r++) {
            let pos = chooseRandomLocation(6, 7)
            let pos2 = {}
            pos2.x = pos.x * BLOCKSIZE
            pos2.y = pos.y * BLOCKSIZE
            entityManager.addEntity({
                tag: 'chozo',
                components: [
                    new CTransform({
                        x: pos2.x,
                        y: pos2.y,
                        hasGravity: true
                    }),
                    new CSprite({
                        sprite: ASSET_MANAGER.cache[ENV_PATH.CHOZO_STATUE],
                        sWidth: 64,
                        sHeight: 64,
                        scale: 3,
                    })
                ]
            })
            for (let i = 0, j = 0; i < 6 * BLOCKSIZE; i += BLOCKSIZE) {
                let e = entityManager.addEntity(generateBlock('tile_bedrock', pos2.x + i, pos2.y + (BLOCKSIZE * 6), 'terraingen'))
                terrainMap[pos.y + 6][pos.x + j++] = {
                    tag: e.tag,
                    id: e.id
                }
            }
            containerManager.addToInventory(generateChest(pos.x + 1, pos.y + 3), new Entity(generateItem(gunParts[r])));
        }
    }

    function chooseRandomLocation(width, height) {
        let x = clamp(randomInt(terrainMap[0].length), 16, terrainMap[0].length - width - 16)
        let y = clamp(randomInt(terrainMap.length) + startRow, 333, terrainMap.length - height - 20)
        let pos = {x: x, y: y}
        punchHole(pos, width, height)
        return pos
    }

    function punchHole(pos, width, height) {
        entityManager.update()
        for (let i = pos.y; i < pos.y + height; i++) {
            for (let j = pos.x; j < pos.x + width; j++) {
                let cell = terrainMap[i][j]
                if (cell.tag !== 'air') {
                    let e = entityManager.getEntity(cell.id)
                    e.destroy()
                    terrainMap[i][j] = {tag: 'air', id: null}
                }
            }
        }
        entityManager.update()
    }

    function spawnStationaryMobs() {
        let y = terrainMap.length * .5 - 5
        for (let x = 20; x < terrainMap[0].length - 20; x++) {
            x += randomInt(15) + 15
            mobFactory.build('wormwood', x * BLOCKSIZE, y * BLOCKSIZE)
        }
    }

    function generateChest(x, y) {
        let e = entityManager.addEntity(generateInteractive('interact_chest', x, y));
        containerManager.registerChest(e);
        terrainMap[y][x] = {tag: e.tag, id: e.id};
        return cleanTag(e.tag);
        // containerManager.addToInventory(owner, new Entity(generateItem('item_copper bar'))); // Example
        // Could randomize number of random rolls on loot table (random count for each result as well if desired)
    }

    function spawnChests() {
        const rareBars = ['item_bismuth bar', 'item_ferrite bar', 'item_gold bar', 'item_titanite bar', 'item_tungsten bar'];
        const otherBars = ['item_copper bar', 'item_tin bar', 'item_cobalt bar'];
        for (let i = 0; i < CHEST_SPAWN_COUNT; i++) {
            let x, y
            do {
                x = Math.floor(randomNumber(20, terrainMap[0].length - 20))
                y = Math.floor(randomNumber(startRow + blocksPerChunk, terrainMap.length - blocksPerChunk))
            } while (!terrainMap[y + 1][x].tag.includes('tile'))
            punchHole({x: x, y: y}, 1, 1)
            const chest = generateChest(x, y);
            if (Math.random() <= 0.1)
                containerManager.addToInventory(chest, new Entity(generateBlock('tile_paraffin', 'craftgen')), randomInt(3) + 1);
            if (Math.random() <= 0.2)
                containerManager.addToInventory(chest, new Entity(getRandomMobDrop()), randomInt(2) + 1);
            if (Math.random() <= 0.2)
                containerManager.addToInventory(chest, new Entity(generateItem(getRandom(rareBars))));
            else if (Math.random() <= 0.7) {
                const roll = randomInt(4)
                for (let j = 0; j < roll; j++) {
                    containerManager.addToInventory(chest, new Entity(generateItem(getRandom(otherBars))), randomInt(3) + 1);
                }
            }
        }
    }

    function generateCaveBackgrounds() {
        let width = 160
        let height = 96
        let scale = 2
        const xRepeat = 23;
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < xRepeat; i++) {
                entityManager.addEntity({
                    tag: 'cave_background',
                    components: [
                        new CTransform({
                            x: width * scale * i,
                            y: (HEIGHT_PIXELS * .5 + BLOCKSIZE) + (j * height * scale),
                            velocity: 0
                        }),
                        new CSprite({
                            sprite: ASSET_MANAGER.cache[BG_PATH.CAVE_0],
                            sWidth: 160,
                            sHeight: 96,
                            scale: scale,
                        })
                    ]
                })
            }
        }

        for (let j = 8; j < 16; j++) {
            for (let i = 0; i < xRepeat; i++) {
                entityManager.addEntity({
                    tag: 'cave_background',
                    components: [
                        new CTransform({
                            x: width * scale * i,
                            y: (HEIGHT_PIXELS * .5 + BLOCKSIZE) + (j * height * scale),
                            velocity: 0
                        }),
                        new CSprite({
                            sprite: ASSET_MANAGER.cache[BG_PATH.CAVE_1],
                            sWidth: 160,
                            sHeight: 96,
                            scale: scale,
                        })
                    ]
                })
            }
        }

        for (let j = 16; j < 24; j++) {
            for (let i = 0; i < xRepeat; i++) {
                entityManager.addEntity({
                    tag: 'cave_background',
                    components: [
                        new CTransform({
                            x: width * scale * i,
                            y: (HEIGHT_PIXELS * .5 + BLOCKSIZE) + (j * height * scale),
                            velocity: 0
                        }),
                        new CSprite({
                            sprite: ASSET_MANAGER.cache[BG_PATH.CAVE_2],
                            sWidth: 160,
                            sHeight: 96,
                            scale: scale,
                        })
                    ]
                })
            }
        }

        for (let j = 24; j < 29; j++) {
            for (let i = 0; i < xRepeat; i++) {
                entityManager.addEntity({
                    tag: 'cave_background',
                    components: [
                        new CTransform({
                            x: width * scale * i,
                            y: (HEIGHT_PIXELS * .5 + BLOCKSIZE) + (j * height * scale),
                            velocity: 0
                        }),
                        new CSprite({
                            sprite: ASSET_MANAGER.cache[BG_PATH.CAVE_3],
                            sWidth: 160,
                            sHeight: 96,
                            scale: scale,
                        })
                    ]
                })
            }
        }


    }

    generateBackgrounds()
    generateCaveBackgrounds()
    generateNoiseMap()
    generateTerrain()
    generateBorders()
    generateStatues()
    spawnStationaryMobs()
    spawnChests()
    return [terrainMap, spawnMap]

}