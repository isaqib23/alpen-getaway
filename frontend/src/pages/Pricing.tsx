import React from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import Testimonials from "../components/Testimonials";
import PricingDetails from "../components/PricingDetails";

const Pricing = () => {
  return (
    <Layout>
      <PageHeader title="Pricing Plan" breadcrumb={["Home", "Pricing"]} />
      <PricingDetails />
      <Testimonials />
    </Layout>
  );
};

export default Pricing;
