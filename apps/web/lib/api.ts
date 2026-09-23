/**
 * Backend API client for PyPath.
 */

import {
  CourseDetail,
  CourseSummary,
  DashboardData,
  Exercise,
  ExerciseAttemptSubmission,
  ExerciseSubmissionResponse,
  LessonDetail,
  ProjectDetail,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}/api/v1${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[PyPath API Warning]: Failed to fetch ${url}`, err);
    throw err;
  }
}

export const api = {
  async getCourses(): Promise<CourseSummary[]> {
    return fetchJson<CourseSummary[]>("/courses");
  },

  async getCourse(slug: string): Promise<CourseDetail> {
    return fetchJson<CourseDetail>(`/courses/${slug}`);
  },

  async getLesson(courseSlug: string, lessonSlug: string): Promise<LessonDetail> {
    return fetchJson<LessonDetail>(`/courses/${courseSlug}/lessons/${lessonSlug}`);
  },

  async getExercise(exerciseId: string): Promise<Exercise> {
    return fetchJson<Exercise>(`/exercises/${exerciseId}`);
  },

  async submitExercise(
    exerciseId: string,
    data: ExerciseAttemptSubmission
  ): Promise<ExerciseSubmissionResponse> {
    return fetchJson<ExerciseSubmissionResponse>(`/exercises/${exerciseId}/submit`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getDashboard(): Promise<DashboardData> {
    return fetchJson<DashboardData>("/dashboard");
  },

  async getPractice(params: { topic?: string; difficulty?: string; needs_review?: boolean } = {}): Promise<Exercise[]> {
    const q = new URLSearchParams();
    if (params.topic) q.set("topic", params.topic);
    if (params.difficulty) q.set("difficulty", params.difficulty);
    if (params.needs_review) q.set("needs_review", "true");
    return fetchJson<Exercise[]>(`/practice?${q.toString()}`);
  },

  async getProjects(): Promise<ProjectDetail[]> {
    return fetchJson<ProjectDetail[]>("/projects");
  },

  async getProject(slug: string): Promise<ProjectDetail> {
    return fetchJson<ProjectDetail>(`/projects/${slug}`);
  },
};
