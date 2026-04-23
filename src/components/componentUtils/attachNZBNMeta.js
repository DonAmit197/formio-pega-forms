// import axios from 'axios';
// import _ from 'lodash';

export function attachNZBNMeta(comp, options) {
    const { compKey, DEBOUNCE = 300, silent = true } = options || {};

    if (!comp || !comp.component || comp.component.key !== compKey) return;
    if (!comp.on) return;
    const axios = (typeof window !== 'undefined' && window.axios) ? window.axios : null;
    const _ = (typeof window !== 'undefined' && (window._ || window.lodash)) ? (window._ || window.lodash) : null;
    if (!axios || !_) {
        if (!silent) console.warn('attachNZBNMeta: missing axios or lodash');
        return;
    }

    function buildHeadersFromComponent() {
        const hdrs = comp.component && comp.component.data && comp.component.data.headers;
        if (!hdrs || !Array.isArray(hdrs)) return {};

        return hdrs.reduce((acc, h) => {
            if (!h || !h.key) return acc;
            acc[h.key] = h.value;
            return acc;
        }, {});
    }

    const doAttachNZBN = _.debounce(async (value, url) => {
        const root = comp.root;
        if (!root?.submission) return;

        /**
         * ToDo:
         * handle headers from component data and server side so that prevents XSS attacks.
         */

        await axios.get(`${url}/${value}`, {
            headers: buildHeadersFromComponent()


        })
            .then((response) => {
                const data = response && response.data;
                console.log('attachNZBNMeta: received data', data);


                if (data && root.submission && root.submission.data) {
                    root.submission.data.nzbnResp2 = data;
                }
                console.log('Root', root);
                if (!silent && root && typeof root.triggerChange === 'function') {
                    root.triggerChange();
                }


            })
            .catch((error) => {
                if (!silent) console.warn('attachNZBNMeta: request failed', error);
            });
    }, DEBOUNCE);

    comp.on('change', (event) => {
        const changedKey = event?.changed?.component?.key;
        if (changedKey !== comp.component.key) return;

        const value = event?.changed?.value ?? null;
        const url = event?.changed?.component?.data?.url;
        console.log('attachNZBNMeta: change detected', { value, url });
        if (!value || !url) {
            if (!silent) console.warn('attachNZBNMeta: missing value or URL', { value, url });
            return;
        }

        doAttachNZBN(value, url);
    });
}
