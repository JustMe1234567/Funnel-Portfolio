import { Client } from "appwrite";

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

client
  .ping()
  .then(() => console.log("[appwrite] connected to", appwriteConfig.endpoint))
  .catch((error) => console.error("[appwrite] ping failed", error));

export default client;