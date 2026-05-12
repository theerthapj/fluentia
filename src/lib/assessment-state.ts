import type { AppState } from "@/types";

export const GUEST_STORAGE_KEY = "fluentia_app_state_guest";
export const USER_STORAGE_KEY_PREFIX = "fluentia_app_state_user_";

export function getAppStateStorageKey(userId?: string | null) {
  if (!userId) return GUEST_STORAGE_KEY;
  return `${USER_STORAGE_KEY_PREFIX}${encodeURIComponent(userId)}`;
}

export function hasCompletedAssessment(state: Pick<AppState, "assessmentCompleted" | "level">) {
  return Boolean(state.assessmentCompleted && state.level);
}
