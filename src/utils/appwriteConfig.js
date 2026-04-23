import { Client, Databases } from "appwrite";

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
export const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;

export const client = new Client()
    .setEndpoint(API_ENDPOINT) // Your API Endpoint
    .setProject(PROJECT_ID); // Your project ID

export const databases = new Databases(client);
export default client;