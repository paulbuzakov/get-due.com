import { Masthead } from './components/Masthead';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { Features } from './components/Features';
import { Statement } from './components/Statement';
import { Quote } from './components/Quote';
import { Pricing } from './components/Pricing';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

export function App() {
  return (
    <>
      <Masthead />
      <main>
        <Hero />
        <Ticker />
        <Features />
        <Statement />
        <Quote />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
