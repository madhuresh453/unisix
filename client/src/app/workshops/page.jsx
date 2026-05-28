import LearningExperience from "@/components/learning/LearningExperience";
import { fetchLearningList } from "@/lib/learningApi";

export const metadata = { title: "Workshops | UNI6CTF" };

export default async function Page() {
  const data = await fetchLearningList("workshops");
  return <LearningExperience title="Workshops" items={data?.items || []} type="workshops" />;
}
