import React, { useState } from "react";
import Layout from "../components/Layout";

import "../assets/css/contact.css";
import ContactInfo from "../components/ContactInfo";
import PageHeader from "../components/PageHeader";
import ContactMap from "../components/ContactMap";

import { strings } from "../lang/common";

const Contact = () => {
  return (
    <Layout>
      <PageHeader
        title={strings.CONTACT_US}
        breadcrumb={[strings.HOME, strings.CONTACT_US]}
      />
      <ContactInfo />
      <ContactMap />
    </Layout>
  );
};

export default Contact;
