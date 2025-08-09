import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { strings } from "../lang/checkout";
import Layout from "../components/Layout";
import * as StripeService from "../services/StripeService";
import NotFound from "./NotFound";
import { motion } from "framer-motion";
import TextAnime from "../components/animations/TextAnime";


const CheckoutSession = () => {
  const navigate = useNavigate();

  const { sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [noMatch, setNoMatch] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!sessionId) {
    setNoMatch(true);
  }

  if (noMatch) {
    navigate("/not-found");
  }

  useEffect(() => {
    if (sessionId) {
      const checkSession = async () => {
        try {
          setLoading(true);
          const response = await StripeService.checkCheckoutSession(sessionId);
          
          // Handle both old (number) and new (object) response formats
          if (typeof response === 'number') {
            // Legacy format
            setNoMatch(response === 204);
            setSuccess(response === 200);
          } else {
            // New format with payment_status
            setNoMatch(response.status === 204 || response.status === 404);
            setSuccess(response.status === 200 && response.payment_status === 'paid');
          }
        } catch (error) {
          console.error('Session check failed:', error);
          setSuccess(false);
        } finally {
          setLoading(false);
        }
      };

      checkSession();
    }
  }, [sessionId]);

  return (
    <Layout>
      <div className="checkout-session-page">
        {loading ? (
          <div className="section-title">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {strings.CHECK}
            </motion.h3>
            <h2>
              <TextAnime className="text-anime-style-3" tag="h2">
                {strings.CHECKING}
              </TextAnime>
            </h2>
          </div>
        ) : success ? (
          <div className="section-title">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {strings.SUCC}
            </motion.h3>
            <h2>
              <TextAnime className="text-anime-style-3" tag="h2">
                {strings.SUCCESS}
              </TextAnime>
            </h2>
            <Link to="/" className="btn-default btn-resend mt-2">
              {strings.BACK}
            </Link>
          </div>
        ) : (
          <div className="section-title">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {strings.FAIL}
            </motion.h3>
            <h2>
              <TextAnime className="text-anime-style-3" tag="h2">
                {strings.PAYMENT_FAILED}
              </TextAnime>
            </h2>
            <Link to="/" className="btn-default btn-resend mt-2">
              {strings.BACK}
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CheckoutSession;
