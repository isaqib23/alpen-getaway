import B2BBody from "../components/B2BBody";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { strings } from "../lang/common";

const B2B = () => {
  return (
    <Layout>
      <PageHeader title={strings.B2B} breadcrumb={[]} />
      <B2BBody />
    </Layout>
  );
};

export default B2B;
