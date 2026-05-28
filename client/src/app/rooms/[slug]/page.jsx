import LearningDetailPage from "@/components/learning/LearningDetailPage";
import { fetchLearningDetail } from "@/lib/learningApi";

export default async function Page({ params }) {
  const data = await fetchLearningDetail("rooms", params.slug);
  return <LearningDetailPage item={data?.item || null} type="rooms" />;
}
