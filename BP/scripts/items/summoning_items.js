import { world, system } from "@minecraft/server"
import { Vec3 } from "../utils/vec3"
import { UtilsFunction } from "../utils/function"

console.warn("hola")

const SUMMONING_CONFIG = {
    "awaking_moonlord:suspicious_looking_eye": {
        bossId: "awaking_moonlord:eye_of_cthulhu",
        offsetLoc: {
            x: 0, y: 10, z: 0
        }
    }
}
const DEFAULT_OFFSET_LOC = { x: 0, y: 0, z: 0 }


world.afterEvents.itemUse.subscribe(ev => {
    const { itemStack, source } = ev

    const bossData = SUMMONING_CONFIG[itemStack.typeId]

    if (bossData === undefined) { return; }
    const existAnyBoss = world.getDynamicProperty("eu:exist_any_boss")

    if (existAnyBoss) { return; }

    const spawnLoc = Vec3.add(source.location, bossData.offsetLoc ?? DEFAULT_OFFSET_LOC)

    source.dimension.spawnEntity(bossData.bossId, spawnLoc)

    world.setDynamicProperty("eu:exist_any_boss", true)
    UtilsFunction.consumeMainhandItem(source)

})
