import { ReferenceHome } from "@/components/home/ReferenceHome";
import { fetchCms } from "@/lib/cmsApi";

export default async function HomePage() {
  const [homepageRes, ctfRes] = await Promise.all([
    fetchCms("/content/homepage"),
    fetchCms("/ctfs?limit=100")
  ]);

  return <ReferenceHome cms={homepageRes?.settings || null} ctfs={ctfRes?.ctfs || []} />;
}
