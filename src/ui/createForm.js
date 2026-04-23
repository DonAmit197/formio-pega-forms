import gds from '@bc/mbie_gds';
import { Formio } from "formiojs";
import axios from 'axios';
import '../styles/bc-formio-styles.css';

import { attachNZBNAPI, attachNZBNAddressAPI } from '../local-formio.events';
import AccessibleSelectPlugin from '../components/select/select';

function changeUploadURLAPI(form) {
    form.everyComponent((comp) => {
        if (comp.type === "file") {
            if (!comp.component.url) { return; }
            comp.component.url = "http://localhost:3000/api/uploads";
        }
    })

}

function sendSubmissiontoDb(form) {
    form.on('reviewSubmission', () => {
        const submissionData = form.submission;
        const dataToSubmit = {
            formId: form.id,
            data: submissionData.data,
            serviceJson: form._form
        }
        axios.post('http://localhost:3000/api/submissions', dataToSubmit)
            .then(response => {
                console.log('Submission saved successfully:', response.data);
            })
            .catch(error => {
                console.error('Error saving submission:', error);
            });

    })
    
}
export function createForm(container, formDefinition, callback) {
    Formio.use(gds);
    Formio.use(AccessibleSelectPlugin);
    Formio.createForm(container, formDefinition).then(function (form) {
        attachNZBNAPI(form);

        attachNZBNAddressAPI(form);
        changeUploadURLAPI(form);
        sendSubmissiontoDb(form);
        if (callback) {
            callback(form);
        }
    });
}
