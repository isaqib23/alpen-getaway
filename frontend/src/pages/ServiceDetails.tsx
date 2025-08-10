import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

import ServiceDetailsSidebar from "../components/ServiceDetailsSidebar";
import ServiceDetailsContent from "../components/ServiceDetailsContent";

import { strings } from "../lang/service-details";
import { serviceLinks, ServiceId, ServiceData } from "../config/services";

// services-data.ts
const servicesData: Record<ServiceId, ServiceData> = {
  "airport-transfer": {
    title: strings.AIRPORT_TITLE,
    paragraphs: strings.AIRPORT_PARAGRAPHS,
    imageFolder: "airport_transfer",
  },
  "economy-services": {
    title: strings.ECONOMY_TITLE,
    paragraphs: strings.ECONOMY_PARAGRAPHS,
    imageFolder: "economy_services",
  },
  "business-transfers": {
    title: strings.BUSINESS_TITLE,
    paragraphs: strings.BUSINESS_PARAGRAPHS,
    imageFolder: "business_transfers",
  },
  "vip-transfer": {
    title: strings.VIP_TITLE,
    paragraphs: strings.VIP_PARAGRAPHS,
    imageFolder: "vip_transfer",
  },
  "private-transfer": {
    title: strings.PRIVATE_TITLE,
    paragraphs: strings.PRIVATE_PARAGRAPHS,
    imageFolder: "private_transfer",
  },
  "flexible-payment-options": {
    title: strings.FLEXIBLE_TITLE,
    paragraphs: strings.FLEXIBLE_PARAGRAPHS,
    imageFolder: "flexible_payment_options",
  },
  "live-rides": {
    title: strings.LIVE_TITLE,
    paragraphs: strings.LIVE_PARAGRAPHS,
    imageFolder: "live_rides",
  },
  "roadside-assistance": {
    title: strings.ROADSIE_TITLE,
    paragraphs: strings.ROADSIE_PARAGRAPHS,
    imageFolder: "roadside_assistance",
  },
  "chauffeur-services": {
    title: strings.CHAUFFEUR_TITLE,
    paragraphs: strings.CHAUFFEUR_PARAGRAPHS,
    imageFolder: "chauffeur_services",
  },
};

const ServiceDetails = () => {
  const [searchParams] = useSearchParams();
  const serviceFromUrl = searchParams.get('service') as ServiceId;
  
  const [selectedService, setSelectedService] = useState<ServiceId>(
    serviceFromUrl && serviceLinks.find(s => s.id === serviceFromUrl) 
      ? serviceFromUrl 
      : serviceLinks[0].id
  );

  useEffect(() => {
    if (serviceFromUrl && serviceLinks.find(s => s.id === serviceFromUrl)) {
      setSelectedService(serviceFromUrl);
    }
  }, [serviceFromUrl]);

  return (
    <Layout>
      <PageHeader title="Our Services" breadcrumb={[]} />
      <div className="page-service-single">
        <div className="container">
          <div className="row">
            <ServiceDetailsSidebar
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
            <ServiceDetailsContent
              serviceData={servicesData[selectedService]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetails;
