import LearningDetailPage from "@/components/learning/LearningDetailPage";
import { fetchLearningDetail } from "@/lib/learningApi";

export default async function Page({ params }) {
  const data = await fetchLearningDetail("workshops", params.slug);
  return <LearningDetailPage item={data?.item || null} type="workshops" />;
}
