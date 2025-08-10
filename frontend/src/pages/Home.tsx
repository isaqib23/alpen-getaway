import React from "react";
import HomeServices from "../components/home/HomeServices";
import HomeFleets from "../components/home/HomeFleets";
import HomeHowItWorks from "../components/home/HomeHowItWorks";
import HomeIntroVideo from "../components/home/HomeIntroVideo";
import HomeWhyChooseUs from "../components/WhyChooseUs";
import HomeFAQs from "../components/home/HomeFaqs";
import HomeTestimonials from "../components/Testimonials";
import HomeHero from "../components/home/HomeHero";
import TrustedPartner from "../components/home/TrustedPartner";
import AirportTransfer from "../components/home/AirportTransfer";
import HomeCTA from "../components/home/HomeCTA";
import Layout from "../components/Layout";

import * as UserService from "../services/UserService";


const Home = () => {
  const language = UserService.getLanguage();

  return (
    <Layout>
      <HomeHero language={language} />
      <HomeServices />
      <TrustedPartner />
      <HomeFleets />
      <AirportTransfer />
      <HomeCTA />
      <HomeHowItWorks />
      <HomeIntroVideo />
      <HomeWhyChooseUs />
      <HomeFAQs />
      <HomeTestimonials />
    </Layout>
  );
};

export default Home;
