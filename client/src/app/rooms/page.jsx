import LearningListingPage from "@/components/learning/LearningListingPage";
import { fetchLearningList } from "@/lib/learningApi";

export const metadata = { title: "rooms | UNI6CTF" };

export default async function Page() {
  const data = await fetchLearningList("rooms");
  return <LearningListingPage title="Rooms" items={data?.items || []} type="rooms" />;
}
