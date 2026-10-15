import Hero from '@/components/Hero';
import AcousticPhysics from '@/components/AcousticPhysics';
import ViewerLoader from '@/components/ViewerLoader';
import SpectrogramChart from '@/components/SpectrogramChart';
import Specs from '@/components/Specs';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <main>
      <Hero />
      <AcousticPhysics />
      <ViewerLoader />
      <SpectrogramChart />
      <Specs />
      <Footer />
    </main>
  );
}
