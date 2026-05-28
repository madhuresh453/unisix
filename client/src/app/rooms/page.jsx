import LearningExperience from "@/components/learning/LearningExperience";
import { fetchLearningList } from "@/lib/learningApi";

export const metadata = { title: "Rooms | UNI6CTF" };

export default async function Page() {
  const data = await fetchLearningList("rooms");
  return <LearningExperience title="Rooms" items={data?.items || []} type="rooms" />;
}
