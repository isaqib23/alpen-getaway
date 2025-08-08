import AffiliateBody from "../components/AffiliateBody";
import AffiliateHero from "../components/AffiliateHero";
import B2BBody from "../components/B2BBody";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { strings } from "../lang/common";
import * as UserService from "../services/UserService";

const Affiliate = () => {
  return (
    <Layout>
      <AffiliateHero type={"image"} language={UserService.getLanguage()} />
      <AffiliateBody />
    </Layout>
  );
};

export default Affiliate;
