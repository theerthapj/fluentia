import type { AppState } from "@/types";

export const GUEST_STORAGE_KEY = "fluentia_app_state_guest";
export const USER_STORAGE_KEY_PREFIX = "fluentia_app_state_user_";
export const GUEST_ASSESSMENT_PROGRESS_KEY = "fluentia_assessment_progress_guest";
export const USER_ASSESSMENT_PROGRESS_KEY_PREFIX = "fluentia_assessment_progress_user_";

export function getAppStateStorageKey(userId?: string | null) {
  if (!userId) return GUEST_STORAGE_KEY;
  return `${USER_STORAGE_KEY_PREFIX}${encodeURIComponent(userId)}`;
}

export function getAssessmentProgressStorageKey(userId?: string | null) {
  if (!userId) return GUEST_ASSESSMENT_PROGRESS_KEY;
  return `${USER_ASSESSMENT_PROGRESS_KEY_PREFIX}${encodeURIComponent(userId)}`;
}

export function hasCompletedAssessment(state: Pick<AppState, "assessmentCompleted" | "level">) {
  return Boolean(state.assessmentCompleted && state.level);
}
