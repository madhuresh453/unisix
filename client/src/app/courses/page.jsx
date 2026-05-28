import LearningExperience from "@/components/learning/LearningExperience";
import { fetchLearningList } from "@/lib/learningApi";

export const metadata = { title: "Courses | UNI6CTF" };

export default async function Page() {
  const data = await fetchLearningList("courses");
  return <LearningExperience title="Courses" items={data?.items || []} type="courses" />;
}
