import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";


const NotFound = () => {
  const { ref: imgRef, inView: imgInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true });
  const { ref: btnRef, inView: btnInView } = useInView({ triggerOnce: true });
  return (
    <Layout>
      <PageHeader title="Page Not Found" breadcrumb={["Home", "404 Error"]} />
      <div className="error-page">
        <div className="container">
          <div className="row">
            <motion.div
              ref={imgRef}
              initial={{ opacity: 0, y: 20 }}
              animate={imgInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="error-page-image"
            >
                            <img src="/assets/images/404-error-img.png" alt="Error" />
            </motion.div>
            <div className="error-page-content">
              <div className="error-page-content-heading">
                <motion.h2
                  ref={textRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={textInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-anime-style-3"
                >
                  <span>Oops!</span> Page Not Found
                </motion.h2>
              </div>
              <div className="error-page-content-body">
                <motion.p
                  ref={textRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={textInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  The page you are looking for does not exist
                </motion.p>
                <motion.div
                  ref={btnRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={btnInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Link className="btn-default" to="/">
                    Back To Home
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
