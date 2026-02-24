import { world, system } from "@minecraft/server"

const PLAYER_CONFIG = new Map()

const BOSS_CONFIG = {
    "awaking_moonlord:eye_of_cthulhu": {
        musicId: "eu.awaking_moonlord.music.boss_1",
        spawnMessage: "§cYou feel an evil presence watching you..."
    }
}

/* 
world.afterEvents.entityLoad.subscribe(ev => {
    const { entity } = ev
    if (entity.typeId !== "awaking_moonlord:eye_of_cthulhu") { return; }

    console.warn("hola ojo cargado")
}) */

world.afterEvents.entitySpawn.subscribe(ev => {
    const { cause, entity } = ev

    const bossData = BOSS_CONFIG[entity.typeId]

    if (bossData) {
        //const bossCounter = world.getDynamicProperty("eu:boss_counter") ?? 0
        //world.setDynamicProperty(bossCounter + 1)

        world.playMusic(bossData.musicId, { loop: true })
        world.sendMessage(bossData.spawnMessage)
        world.setDynamicProperty("eu:current_music_boss", bossData.musicId)
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
        //world.setDynamicProperty("eu:current_music_boss", undefined)
        //world.setDynamicProperty("eu:exist_any_boss", false)
    }

})
