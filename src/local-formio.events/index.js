import { isChangedComponent, transformAddressValue } from "../utils/constants";
import { saveSubmissionToDb } from "../utils/saveSubmissionToDb";
import { loadLatestSubmission } from "../utils/loadLatestSubmission";

export function checkEligibilityEvent(form) {
    form.on('checkEligibility', () => {
        form.nextPage();
    })

}

export function goToPrevPageEvent(form) {
    form.on('goToPrevious', () => {
        form.prevPage();
        form.submission = form._submission;
        loadLatestSubmission({ formId: form.id }).then((saved) => {
            //console.log("Loaded submission on prev page:", saved);
            if (saved) {
                form.submission = saved;
            }

        })

    })
}



export function goToNextEvent(form) {
    form.on('goToNext', () => {
        form.nextPage();
        form.submission = form._submission;
        saveSubmissionToDb(form.submission, { formId: form.id, schemaVersion: 1, isActive: true, isAutosave: false });
    })
}

export function startApplicationEvent(form) {
    if (form.checkValidity(form.data, true, form.data, true)) {
        form.on('startApplication', () => {
            form.nextPage();
            form.submission = form._submission;
        })
    }
}

export function attachNZBNAPI(form) {
    const nzbnUrl = import.meta.env.VITE_NZBN_URL;
    const nzbnApiKey = import.meta.env.VITE_NZBN_API_KEY;
    const nzbnApiKeyValue = import.meta.env.VITE_NZBN_API_KEY_VALUE;
    if (!nzbnUrl) {
        console.warn("NZBN API URL is missing.");
        return;
    }
    form.on('change', (changed) => {
        if (isChangedComponent('data_entity_nzbn', changed)) {
            console.log('changed inside attachNZBNAPI', changed);
            //data_entity_nzbn
            const nzBNComp = form.getComponent('data_entity_nzbn');
            if (nzBNComp) {
                // Attach NZBN API to the component
                nzBNComp.component.data.url = nzbnUrl;
                nzBNComp.component.data.headers = [
                    {
                        'key': nzbnApiKey,
                        'value': nzbnApiKeyValue
                    }
                ];
            }
        }
    })
}

export function attachNZBNAddressAPI(form) {
    form.everyComponent(function (component) {
        if (component && component.component && component.component.type === 'address') {
            if (!component.provider) return;

            // Nominatim search (NZ only), top 10
            // API returns an array at the root: [{ display_name, lat, lon, address: {...} }, ...]
            component.provider.options = {
                // Nominatim expects q + format + addressdetails + limit + countrycodes
                url: 'https://nominatim.openstreetmap.org/search',
                queryProperty: 'q', // Formio will append ?q=<typed text>
                params: {
                    format: 'jsonv2',
                    addressdetails: '1',
                    limit: 10,
                    countrycodes: 'nz'   // bias results to New Zealand
                },
                // Root-level array response:
                // Some Formio builds accept empty string to mean "use root".
                // If yours doesn’t, use Option B below.
                responseProperty: '',
                displayValueProperty: 'display_name'
            };

            component.on('change', (changed) => {

                if (changed.changed && changed.changed.component && changed.changed.component.type === 'address') {
                    //console.log('Address changed:', changed);
                    if (changed.changed.value) {
                        const newVal = transformAddressValue(changed.changed.value);
                        //console.log('Transformed Address:', newVal);
                        changed.changed.instance.dataValue = newVal;
                        const input = changed.changed.instance && changed.changed.instance.refs ? changed.changed.instance.refs.
                            searchInput[0] : null;
                        if (input) {
                            input.value = newVal && newVal.address ? newVal.address.full_address : '';
                            //console.log('Address input updated:', input.value);
                            input.addEventListener('blur', (event) => {
                                //console.log('Input blur event:', event);
                                event.target.value = newVal && newVal.address ? newVal.address.full_address : '';
                            });
                        }
                    }
                }

            });
        }
    });
}


/**
 * Restore saved submission into the form on first render.
 */
export function restoreSavedSubmissionEvent(form) {
    let restored = false;

    form.on("render", async () => {
        //console.log("Form rendered, checking for saved submission to restore...");
        if (restored) return; // avoid running on every re-render
        restored = true;

        const saved = await loadLatestSubmission({
            formId: form.id,
            // isAutosave: true or false if you want to control which to pick
        });

        if (saved && saved.data) {
            //console.log("Restoring saved submission for form", form.id, saved);

            // This tells Formio to use the saved values
            form.submission = saved;
            // setSubmission is safer for wizards & validation
            if (typeof form.setSubmission === "function") {
                form.setSubmission(saved);
            }
        }
    });
}