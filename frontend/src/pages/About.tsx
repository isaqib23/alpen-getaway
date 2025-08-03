import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Testimonials from "../components/Testimonials";
import ServicesPartners from "../components/Partners";
import PageHeader from "../components/PageHeader";
import ExperiencedDrivers from "../components/ExperiencedDrivers";
import VisionMission from "../components/VisionMission";
import { strings } from "../lang/common";
import BriefAbout from "../components/BriefAbout";
import { usePageLoading } from "../common/usePageLoading";
import { publicApi } from "../api/client";

interface CMSPage {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
}

const AboutPage = () => {
  const [componentsReady, setComponentsReady] = useState(false);
  const [cmsContent, setCmsContent] = useState<CMSPage | null>(null);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [cmsError, setCmsError] = useState<string | null>(null);

  // Use page loading hook to manage loading state
  usePageLoading({
    taskId: 'about-page',
    dependencies: [componentsReady, !cmsLoading],
  });

  useEffect(() => {
    const loadCMSContent = async () => {
      try {
        setCmsLoading(true);
        setCmsError(null);
        
        // Try to load dynamic about page content from CMS
        const response = await publicApi.get('/cms/pages/slug/about');
        if (response.data) {
          setCmsContent(response.data);
        }
      } catch (error) {
        console.warn('Failed to load CMS content for About page:', error);
        setCmsError('Failed to load dynamic content');
        // Fallback to static content (existing components)
      } finally {
        setCmsLoading(false);
      }
    };

    loadCMSContent();
  }, []);

  useEffect(() => {
    // Mark components as ready once the page has mounted
    if (!cmsLoading) {
      setComponentsReady(true);
    }
  }, [cmsLoading]);

  return (
    <Layout>
      <PageHeader title={strings.ABOUT_US} breadcrumb={[]} />
      
      {/* Dynamic CMS Content Section */}
      {cmsContent && !cmsError && (
        <section className="cms-content" style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div 
                  className="cms-content-body" 
                  dangerouslySetInnerHTML={{ __html: cmsContent.content }}
                  style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: '#333',
                    maxWidth: '800px',
                    margin: '0 auto'
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* CMS Loading State */}
      {cmsLoading && (
        <section className="cms-loading" style={{ padding: '40px 0', textAlign: 'center' }}>
          <div className="container">
            <p style={{ color: '#666', fontSize: '16px' }}>Loading additional content...</p>
          </div>
        </section>
      )}
      
      {/* Static Content (fallback and complementary) */}
      <ServicesPartners />
      <VisionMission />
      <BriefAbout />
      <ExperiencedDrivers />
      <Testimonials />
    </Layout>
  );
};

export default AboutPage;
