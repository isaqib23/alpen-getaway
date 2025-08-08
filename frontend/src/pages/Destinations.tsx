import DestinationsContent from "../components/DestinationContent";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const Destinations = () => {
  return (
    <Layout>
      <PageHeader title="Destinations" breadcrumb={[]} />
      <DestinationsContent />
    </Layout>
  );
};

export default Destinations;
