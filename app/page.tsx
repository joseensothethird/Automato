import AutoPostDashboard from './Pages/AutoPostDashboard';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Navbar/Footer';

export default function AutoPostPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AutoPostDashboard />
      </main>
      <Footer />
    </div>
  );
}