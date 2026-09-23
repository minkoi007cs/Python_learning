/**
 * TypeScript type definitions for PyPath frontend.
 */

export interface ExerciseTest {
  name: string;
  assertion: string;
  is_hidden?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  instructions: string;
  starter_code: string;
  solution_code?: string;
  hints: string[];
  explanation?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  xp_reward: number;
  concept_ids: string[];
  visible_tests: ExerciseTest[];
  hidden_tests: ExerciseTest[];
}

export interface LessonSection {
  type: "markdown" | "code_example" | "exercise" | "quiz";
  content?: string;
  language?: string;
  code?: string;
  explanation?: string;
  exercise?: Exercise;
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  estimated_minutes: number;
  position: number;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  module_slug: string;
  course_slug: string;
  estimated_minutes: number;
  concept_ids: string[];
  sections: LessonSection[];
  next_lesson_slug?: string;
  prev_lesson_slug?: string;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  lessons: LessonSummary[];
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_hours: number;
  total_modules: number;
  total_lessons: number;
  progress_percent: number;
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_hours: number;
  modules: Module[];
  progress_percent: number;
}

export interface ExerciseAttemptSubmission {
  course_slug: string;
  lesson_slug: string;
  submitted_code: string;
  passed: boolean;
  tests_passed: number;
  tests_total: number;
  hints_used: number;
  solution_viewed: boolean;
  execution_time_ms: number;
}

export interface ExerciseSubmissionResponse {
  passed: boolean;
  message: string;
  xp_awarded: number;
  lesson_completed: boolean;
  current_streak: number;
  next_lesson_slug?: string;
}

export interface ConceptMasteryItem {
  concept_id: string;
  concept_name: string;
  category: string;
  mastery_score: number;
  attempts: number;
  needs_review: boolean;
}

export interface RecommendedReviewItem {
  concept_id: string;
  concept_name: string;
  reason: string;
  suggested_lesson_slug: string;
}

export interface DashboardData {
  display_name: string;
  current_streak: number;
  total_xp: number;
  active_course_slug: string;
  active_course_title: string;
  course_progress_percent: number;
  next_lesson_slug: string;
  next_lesson_title: string;
  recommended_reviews: RecommendedReviewItem[];
  top_mastery: ConceptMasteryItem[];
}

export interface Milestone {
  step: number;
  title: string;
  description: string;
  test_assertion?: string;
}

export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  starter_code: string;
  milestones: Milestone[];
  completed: boolean;
  milestones_completed: number;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  error?: string;
}

export interface TestResultItem {
  name: string;
  passed: boolean;
  errorMessage?: string;
}

export interface TestSuiteResult {
  passed: boolean;
  results: TestResultItem[];
  executionTimeMs: number;
  stdout: string;
  stderr: string;
}
