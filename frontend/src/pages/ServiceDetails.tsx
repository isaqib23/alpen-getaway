import React, { useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

import "../assets/css/service-details.css";
import ServiceDetailsSidebar from "../components/ServiceDetailsSidebar";
import ServiceDetailsContent from "../components/ServiceDetailsContent";

import { strings } from "../lang/service-details";

// services-data.ts
const servicesData: Record<ServiceId, ServiceData> = {
  "airport-transfer": {
    title: strings.AIRPORT_TITLE,
    paragraphs: strings.AIRPORT_PARAGRAPHS,
  },
  "economy-services": {
    title: strings.ECONOMY_TITLE,
    paragraphs: strings.ECONOMY_PARAGRAPHS,
  },
  "business-transfers": {
    title: strings.BUSINESS_TITLE,
    paragraphs: strings.BUSINESS_PARAGRAPHS,
  },
  "vip-transfer": {
    title: strings.VIP_TITLE,
    paragraphs: strings.VIP_PARAGRAPHS,
  },
  "private-transfer": {
    title: strings.PRIVATE_TITLE,
    paragraphs: strings.PRIVATE_PARAGRAPHS,
  },
  "flexible-payment-options": {
    title: strings.FLEXIBLE_TITLE,
    paragraphs: strings.FLEXIBLE_PARAGRAPHS,
  },
  "live-rides": {
    title: strings.LIVE_TITLE,
    paragraphs: strings.LIVE_PARAGRAPHS,
  },
  "roadside-assistance": {
    title: strings.ROADSIE_TITLE,
    paragraphs: strings.ROADSIE_PARAGRAPHS,
  },
  "chauffeur-services": {
    title: strings.CHAUFFEUR_TITLE,
    paragraphs: strings.CHAUFFEUR_PARAGRAPHS,
  },
};

const serviceLinks: ServiceLink[] = [
  {
    id: "airport-transfer",
    name: "Airport Transfer",
    icon: "icon-service-3.svg",
  },
  {
    id: "economy-services",
    name: "Economy Services",
    icon: "icon-about-trusted-2.svg",
  },
  {
    id: "business-transfers",
    name: "Business Transfers",
    icon: "icon-service-2.svg",
  },
  {
    id: "vip-transfer",
    name: "VIP Transfer",
    icon: "icon-service-1.svg",
  },
  {
    id: "private-transfer",
    name: "Private Transfer",
    icon: "icon-service-5.svg",
  },
  {
    id: "flexible-payment-options",
    name: "Flexible Payment Options",
    icon: "icon-service-6.svg",
  },
  {
    id: "live-rides",
    name: "Live Rides (GPS) Tracking",
    icon: "icon-location.svg",
    iconStyle: {
      filter:
        "invert(95%) sepia(96%) saturate(2441%) hue-rotate(163deg) brightness(97%) contrast(101%)",
    },
  },
  {
    id: "roadside-assistance",
    name: "Roadside Assistance",
    icon: "icon-service-7.svg",
  },
  {
    id: "chauffeur-services",
    name: "Chauffeur Services",
    icon: "icon-service-4.svg",
  },
];

type ServiceId =
  | "airport-transfer"
  | "economy-services"
  | "business-transfers"
  | "vip-transfer"
  | "private-transfer"
  | "flexible-payment-options"
  | "live-rides"
  | "roadside-assistance"
  | "chauffeur-services";

interface ServiceLink {
  id: ServiceId;
  name: string;
  icon: string;
  iconStyle?: React.CSSProperties;
}

interface ServiceData {
  title: string;
  paragraphs: string[];
}

const ServiceDetails = () => {
  const [selectedService, setSelectedService] = useState<ServiceId>(
    serviceLinks[0].id
  );

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
