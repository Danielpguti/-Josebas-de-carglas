
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Coverage from './components/Coverage';
import Testimonials from './components/Testimonials';
import BookingForm from './components/BookingForm';
import Faq from './components/Faq';
import Cta from './components/Cta';
import Footer from './components/Footer';
import StickyMobileActions from './components/StickyMobileActions';
import ChatWidget from './components/ChatWidget';
import { PHONE_NUMBER, WHATS_TEXT } from './constants';

const App: React.FC = () => {
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER.replace(/\D/g,'')}?text=${WHATS_TEXT}`;
  const phoneUrl = `tel:${PHONE_NUMBER}`;

  return (
    <>
      <StickyMobileActions whatsappUrl={whatsappUrl} phoneUrl={phoneUrl} />
      <Header whatsappUrl={whatsappUrl} phoneUrl={phoneUrl} />
      <main>
        <Hero whatsappUrl={whatsappUrl} />
        <Services />
        <Coverage />
        <Testimonials />
        <BookingForm whatsappUrl={whatsappUrl}/>
        <Faq />
        <Cta />
      </main>
      <Footer whatsappUrl={whatsappUrl} phoneUrl={phoneUrl} />
      <ChatWidget />
    </>
  );
};

export default App;