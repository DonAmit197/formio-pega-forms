import { databases, DATABASE_ID, COLLECTION_ID } from "./appwriteConfig";
import { ID } from "appwrite";

/**
 * Save a Formio submission to Appwrite.
 *
 * @param {Object} submission - form.submission (or an object with .data)
 * @param {Object} options
 * @param {string} options.formId         - required: must match your formId column
 * @param {number} [options.schemaVersion=1] - required: integer 1–1000
 * @param {boolean} [options.isActive=true]  - required: boolean
 */
export async function saveSubmissionToDb(
    submission,
    { formId, schemaVersion = 1, isActive = true, isAutosave = false } = {}
) {
    if (!submission) {
        console.warn("saveSubmissionToDb called with empty submission");
        return;
    }

    if (!formId) {
        console.error("saveSubmissionToDb: formId is required");
        return;
    }

    const now = new Date().toISOString();
    const docId = ID.unique();

    const payload = {
        formId: formId,                       // string
        schemaVersion: schemaVersion,         // integer (1–1000)
        isActive: isActive,                   // boolean
        createdDate: now,                     // datetime
        lastUpdated: now,                     // datetime
        submissionData: JSON.stringify(
            submission.data || submission
        ),// stringified JSON
        is_autosave: isAutosave,// boolean
    };

    try {
        const result = await databases.createDocument({
            databaseId: DATABASE_ID,
            collectionId: COLLECTION_ID,
            documentId: docId,
            data: payload,

        }

        );

        console.log("Saved submission to Appwrite:", result);
        return result;
    } catch (err) {
        console.error("Error saving submission to Appwrite:", err);
        throw err;
    }
}


