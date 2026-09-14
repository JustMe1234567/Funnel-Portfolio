import { Databases } from "appwrite";
import { client } from "./appwrite.js";

export const appwriteConfig = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  collectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  source: "funnel port",
};

export const databases = new Databases(client);

export default databases;