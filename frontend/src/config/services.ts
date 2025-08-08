// services configuration
export type ServiceId =
    | "airport-transfer"
    | "economy-services"
    | "business-transfers"
    | "vip-transfer"
    | "private-transfer"
    | "flexible-payment-options"
    | "live-rides"
    | "roadside-assistance"
    | "chauffeur-services";

export interface ServiceLink {
    id: ServiceId;
    name: string;
    imageFolder: string;
}

export interface ServiceData {
    title: string;
    paragraphs: string[];
    imageFolder: string;
}

// Service links without icons - used for sidebar navigation
export const serviceLinks: ServiceLink[] = [
    {
        id: "airport-transfer",
        name: "Airport Transfer",
        imageFolder: "airport_transfer",
    },
    {
        id: "economy-services",
        name: "Economy Services",
        imageFolder: "economy_services",
    },
    {
        id: "business-transfers",
        name: "Business Transfers",
        imageFolder: "business_transfers",
    },
    {
        id: "vip-transfer",
        name: "VIP Transfer",
        imageFolder: "vip_transfer",
    },
    {
        id: "private-transfer",
        name: "Private Transfer",
        imageFolder: "private_transfer",
    },
    {
        id: "flexible-payment-options",
        name: "Flexible Payment Options",
        imageFolder: "flexible_payment_options",
    },
    {
        id: "live-rides",
        name: "Live Rides (GPS) Tracking",
        imageFolder: "live_rides",
    },
    {
        id: "roadside-assistance",
        name: "Roadside Assistance",
        imageFolder: "roadside_assistance",
    },
    {
        id: "chauffeur-services",
        name: "Chauffeur Services",
        imageFolder: "chauffeur_services",
    },
];
