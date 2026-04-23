// src/component/index.js

import AccessibleSelectPlugin from "./select/select";
// In future:
// import AccessibleCheckboxPlugin from "./checkbox/checkbox";
// import AccessibleDatePlugin from "./date/date";

function mergePlugins() {
    const components = {};

    function merge(plugin) {
        if (!plugin || !plugin.components) {
            return;
        }

        const src = plugin.components;
        for (const key in src) {
            if (Object.prototype.hasOwnProperty.call(src, key)) {
                components[key] = src[key];
            }
        }
    }

    // Add each plugin you create here
    merge(AccessibleSelectPlugin);
    // merge(AccessibleCheckboxPlugin);
    // merge(AccessibleDatePlugin);

    return { components };
}

// This is the **single** master plugin object
const FormioPegaExtensions = mergePlugins();

export default FormioPegaExtensions;
