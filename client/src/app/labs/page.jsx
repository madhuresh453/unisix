import LearningListingPage from "@/components/learning/LearningListingPage";
import { fetchLearningList } from "@/lib/learningApi";

export const metadata = { title: "labs | UNI6CTF" };

export default async function Page() {
  const data = await fetchLearningList("labs");
  return <LearningListingPage title="Labs" items={data?.items || []} type="labs" />;
}
