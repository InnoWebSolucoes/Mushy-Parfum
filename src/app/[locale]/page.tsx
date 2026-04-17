import HeroSection from "@/components/home/HeroSection";
import InfiniteMarquee from "@/components/home/InfiniteMarquee";
import BrandStatement from "@/components/home/BrandStatement";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <InfiniteMarquee />
      <BrandStatement />
      <FeaturedProducts />
    </>
  );
}
