import { databases, DATABASE_ID, COLLECTION_ID } from "./appwriteConfig";
import { ID, Query } from "appwrite";

/**
 * Load the latest submission for a given formId.
 * Returns a Formio submission object or null.
 */
export async function loadLatestSubmission({ formId, isAutosave = null } = {}) {
    if (!formId) {
        console.error("loadLatestSubmission: formId is required");
        return null;
    }
    const docId = ID.unique();
    const queries = [
        //Query.equal("$id", docId),
        Query.equal("formId", formId),
        Query.equal("isActive", true),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
    ];

    // Optional filter if you later want only autosaves or only finals
    if (isAutosave !== null) {
        queries.push(Query.equal("is_autosave", isAutosave));
    }

    try {
        const res = await databases.listDocuments(
            {
                databaseId: DATABASE_ID,
                collectionId: COLLECTION_ID,
                documentId: docId,
                queries,
                total: true
            }
        );
        console.log("Loaded submission from Appwrite:", res);
        if (!res.total) {
            console.log("No saved submissions for formId:", formId);
            return null;
        }

        const doc = res.documents[0];

        try {
            const parsed = JSON.parse(doc.submissionData);
            // Should be { data: {...} } or full submission object
            return parsed;
        } catch (e) {
            console.error("Failed to parse submissionData JSON:", e);
            return null;
        }
    } catch (err) {
        console.error("Error loading submission from Appwrite:", err);
        return null;
    }
}