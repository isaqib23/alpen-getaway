import DestinationsContent from "../components/DestinationContent";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const Destinations = () => {
  return (
    <Layout>
      <PageHeader 
        title="Destinations" 
        subtitle="Alpen Getaway is a Getaway to the Europe's most beautiful Tourist Destinations"
        breadcrumb={[]} 
      />
      <DestinationsContent />
    </Layout>
  );
};

export default Destinations;
