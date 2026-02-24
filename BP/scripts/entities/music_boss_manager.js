import { world, system } from "@minecraft/server"

const PLAYER_CONFIG = new Map()

const BOSS_CONFIG = {
    "awaking_moonlord:eye_of_cthulhu": "eu.awaking_moonlord.music.boss_1"
}

/* 
world.afterEvents.entityLoad.subscribe(ev => {
    const { entity } = ev
    if (entity.typeId !== "awaking_moonlord:eye_of_cthulhu") { return; }

    console.warn("hola ojo cargado")
}) */

world.afterEvents.entitySpawn.subscribe(ev => {
    const { cause, entity } = ev

    const bossMusic = BOSS_CONFIG[entity.typeId]

    if (bossMusic) {
        //const bossCounter = world.getDynamicProperty("eu:boss_counter") ?? 0
        //world.setDynamicProperty(bossCounter + 1)

        world.playMusic(bossMusic, { loop: true })
        world.setDynamicProperty("eu:current_music_boss", bossMusic)
    }
})

world.afterEvents.entityRemove.subscribe(ev => {
    const { typeId } = ev

    const isBoss = BOSS_CONFIG[typeId]

    if (isBoss) {
        world.stopMusic()
        world.setDynamicProperty("eu:current_music_boss", undefined)
        world.setDynamicProperty("eu:exist_any_boss", false)
    }
})

world.afterEvents.entityDie.subscribe(ev => {
    const { damageSource, deadEntity } = ev

    if (!deadEntity.isValid) { return; }

    const isBoss = BOSS_CONFIG[deadEntity.typeId]


    if (isBoss) {
        world.stopMusic()
        world.setDynamicProperty("eu:current_music_boss", undefined)
        world.setDynamicProperty("eu:exist_any_boss", false)
    }

})


world.afterEvents.playerJoin.subscribe(ev => {
    const { playerName } = ev

    const interval = system.runInterval(() => {
        const player = world.getPlayers({ name: playerName })[0]
        if (player?.isValid) {
            const currentMusicBoss = world.getDynamicProperty("eu:current_music_boss")

            if (currentMusicBoss !== undefined) {
                player.playMusic(currentMusicBoss, { loop: true })
                console.warn("musica de jefe")
            }
            system.clearRun(interval)
        }


    })

})
/*
world.afterEvents.entityDie.subscribe(ev => {
    const { damageSource, deadEntity } = ev

    if (deadEntity.typeId !== "minecraft:player") { return; }

    const damagingEntity = damageSource.damagingEntity
    const isBoss = BOSS_CONFIG[damagingEntity.typeId]

    if (isBoss) {

        const nearbyPlayer = damagingEntity.dimension.getPlayers({
            location: damagingEntity.location,
            maxDistance: 30,
            excludeNames: [deadEntity.name]
        })[0]

        if (!nearbyPlayer) {
            damagingEntity.remove()

            world.stopMusic()
            world.setDynamicProperty("eu:current_music_boss", undefined)
            world.setDynamicProperty("eu:exist_any_boss", false)
        }

    }

}) */