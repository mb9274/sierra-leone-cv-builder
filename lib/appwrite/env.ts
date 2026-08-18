import { appwriteConfig } from "./config"

export function getEndpoint() {
  return appwriteConfig.endpoint
}

export function getProjectId() {
  return appwriteConfig.projectId
}

export function getApiKey() {
  return appwriteConfig.apiKey
}

export function hasAppwriteConfig() {
  return Boolean(appwriteConfig.endpoint && appwriteConfig.projectId)
}
