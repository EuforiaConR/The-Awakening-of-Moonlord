import { world, system } from "@minecraft/server"

const BOSS_CONFIG = {
    "awaking_moonlord:eye_of_cthulhu": {
        musicId: "eu.awaking_moonlord.music.boss_1",
        spawnMessage: "§cYou feel an evil presence watching you..."
    },
    "awaking_moonlord:skeletron": {
        musicId: "eu.awaking_moonlord.music.boss_1",
        spawnMessage: "§cYou feel an evil presence watching you..."
    },
}
const BOSSES_TYPE_ID = Object.keys(BOSS_CONFIG);

const PLAYER_CONFIG = new Map()

system.runInterval(() => {
    const players = world.getAllPlayers()
    players.forEach(player => {
        let playerData = PLAYER_CONFIG.get(player.id);

        if (!playerData) {
            playerData = {
                isPlayingMusic: false,
                currentBoss: null
            };
            PLAYER_CONFIG.set(player.id, playerData);
        }

        const nearbyBoss = player.dimension.getEntities({
            location: player.location,
            closest: 1,
            maxDistance: 120,
            families: ["terra_boss"]
        })[0];

        if (playerData.isPlayingMusic) {

            if (!nearbyBoss) {
                //reproducimos nada en vez de stopMusic para darle fade
                player.playMusic("", { fade: 5, loop: false });
                playerData.isPlayingMusic = false;
            }

        } else {

            if (nearbyBoss) {
                const bossData = BOSS_CONFIG[nearbyBoss.typeId];
                player.playMusic(bossData.musicId, { fade: 0.5, loop: true });

                playerData.currentBoss = nearbyBoss.typeId
                playerData.isPlayingMusic = true;
            }

        }

    })


}, 20)

world.afterEvents.entitySpawn.subscribe(ev => {
    const { cause, entity } = ev

    const bossData = BOSS_CONFIG[entity.typeId]

    if (bossData) {
        world.sendMessage(bossData.spawnMessage)
    }
})
