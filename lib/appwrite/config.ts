export const appwriteConfig = {
  endpoint: (process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").trim(),
  projectId: (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "").trim(),
  apiKey: (process.env.APPWRITE_API_KEY || "").trim(),
  databaseId: (process.env.APPWRITE_DATABASE_ID || "cvs-db").trim(),
  collectionId: (process.env.APPWRITE_COLLECTION_ID || "cvs").trim(),
  bucketId: (process.env.APPWRITE_BUCKET_ID || "cv-uploads").trim(),
}

export function sessionCookieName() {
  return `a_session_${appwriteConfig.projectId}`
}
