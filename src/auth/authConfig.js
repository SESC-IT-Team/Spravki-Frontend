import { AUTH_SCOPES } from "auth-lib"

const runtimeEnv = globalThis.__ENV__ ?? {}
const API_BASE_URL = runtimeEnv.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? ""
const AUTH_END_SESSION_URL_RAW = runtimeEnv.VITE_AUTH_END_SESSION_URL ?? import.meta.env.VITE_AUTH_END_SESSION_URL ?? ""

export const authConfig = {
  baseUrl: API_BASE_URL.replace(/\/+$/, ""),
  authPath: "/auth",
  scope: [
    AUTH_SCOPES.openid,
    AUTH_SCOPES.profile,
    AUTH_SCOPES.offline_access,
    AUTH_SCOPES.spravki_orders_create,
    AUTH_SCOPES.spravki_orders_get,
    AUTH_SCOPES.spravki_orders_get_my,
    AUTH_SCOPES.auth_children_read,
  ],
}

export const API_BASE = authConfig.baseUrl
export const AUTH_END_SESSION_URL = AUTH_END_SESSION_URL_RAW.trim().replace(/\/+$/, "")
