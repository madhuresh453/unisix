import LearningExperience from "@/components/learning/LearningExperience";
import { fetchLearningList } from "@/lib/learningApi";

export const metadata = { title: "Labs | UNI6CTF" };

export default async function Page() {
  const data = await fetchLearningList("labs");
  return <LearningExperience title="Labs" items={data?.items || []} type="labs" />;
}
