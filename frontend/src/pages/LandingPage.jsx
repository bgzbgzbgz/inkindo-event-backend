import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import KatalogEvent from '../components/KatalogEvent';
import Kalender from '../components/Kalender';
import Kontak from '../components/Kontak';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <KatalogEvent />
      <Kalender />
      <Kontak />
      <Footer />
    </>
  );
};

export default LandingPage;