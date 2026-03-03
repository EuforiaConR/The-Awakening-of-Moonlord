import { system, world, ItemStack } from '@minecraft/server';
import { UtilsFunction } from "../utils/function";

function consumeMainhandItem(player, amount = 1) {
    const inv = player.getComponent("inventory")?.container;
    if (!inv) return false;

    const slot = player.selectedSlotIndex;
    const item = inv.getItem(slot);
    if (!item) return false;

    const itemAmount = item.amount - 1
    if (itemAmount <= 0) inv.setItem(slot, undefined);
    else {
        item.amount -= amount
        inv.setItem(slot, item)
    };
    return true;
}

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {

    itemComponentRegistry.registerCustomComponent('on_use:convert_item', {

        onUse(ev, arg) {
            const { source, itemStack } = ev;
            const {
                convert,
                consume
            } = arg?.params;

            const inv = source.getComponent("inventory")

            if (convert) {
                inv.container.addItem(new ItemStack(convert.item, convert.amount ?? 1))
            }

            consumeMainhandItem(source, consume.amount ?? 1)

            //console.warn("a: " + convert.item)
        }
    });
});