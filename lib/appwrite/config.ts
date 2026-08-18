export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
  apiKey: process.env.APPWRITE_API_KEY || "",
  databaseId: process.env.APPWRITE_DATABASE_ID || "cvs-db",
  collectionId: process.env.APPWRITE_COLLECTION_ID || "cvs",
  bucketId: process.env.APPWRITE_BUCKET_ID || "cv-uploads",
}

export function sessionCookieName() {
  return `a_session_${appwriteConfig.projectId}`
}
