import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Acts from './components/Acts';
import Crew from './components/Crew';
import Scenes from './components/Scenes';
import Demo from './components/Demo';
import Model from './components/Model';
import Closing from './components/Closing';
import Footer from './components/Footer';


export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0c0a] text-[#f4efe3] font-['Tajawal',sans-serif] selection:bg-[#d9a441] selection:text-[#0b0c0a] overflow-x-hidden">
      <Navbar />

      <main className="relative">
        <Hero />
        <Acts />
        <Crew />
        <Scenes />
        <Demo />
        <Model />
        <Closing />
      </main>

      <Footer />
    </div>
  );
}