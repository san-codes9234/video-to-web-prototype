import GokuScroll from './components/GokuScroll';
import NavBar from './components/NavBar';
import PowerSection from './components/PowerSection';
import Footer from './components/Footer';
import CursorAura from './components/CursorAura';

export default function App() {
  return (
    <main style={{ background: '#050505' }}>
      <CursorAura />
      <NavBar />
      <GokuScroll />
      <PowerSection />
      <Footer />
    </main>
  );
}
