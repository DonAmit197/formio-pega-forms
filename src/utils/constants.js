export function isChangedComponent() {
    return function (key, changed) {
        if (changed && changed.changed) {
            if (changed.changed.hasOwnProperty('component') && changed.changed.component === key) {
                return true;
            }
        }
        return false;
    };
}

export function transformAddressValue(originalValue) {
    if (!originalValue || !originalValue.address) return null;

    const addr = originalValue.address;

    return {
        address: {
            full_address: addr.display_name || "",   // Use display_name as full address
            address_id: addr.osm_id ? String(addr.osm_id) : "", // use osm_id as id
            dpid: addr.place_id ? String(addr.place_id) : ""    // map place_id as dpid
        },
        mode: originalValue.mode || "autocomplete"
    };
}
