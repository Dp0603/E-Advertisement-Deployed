import React from "react";
import { Box, Button, Typography, Container, Grid, Card, CardContent, CardActions,  Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Navbar";
import homeimg from "../assets/images/WelcomeHome1.jpg";

// Icons (Replace with actual images if needed)
import CampaignIcon from "@mui/icons-material/Campaign";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";

// Service Data
const services = [
  { id: 1, title: "Create & Manage Ads", desc: "Design, publish, and edit advertisements easily.", icon: <CampaignIcon fontSize="large" />, cta: "Start Advertising Now" },
  { id: 2, title: "Targeted Ad Campaigns", desc: "Choose specific locations, categories, and audience demographics.", icon: <TrackChangesIcon fontSize="large" />, cta: "Run Targeted Ads" },
  { id: 3, title: "Ad Performance Analytics", desc: "Track views, clicks, and conversions in real-time.", icon: <ShowChartIcon fontSize="large" />, cta: "Analyze & Optimize" },
  { id: 4, title: "Budget-Friendly Ad Plans", desc: "Flexible pricing plans for different ad durations and reach.", icon: <MonetizationOnIcon fontSize="large" />, cta: "Get Started" },
  { id: 5, title: "Featured Ad Promotions", desc: "Boost your ad visibility with premium placements.", icon: <StarIcon fontSize="large" />, cta: "Get Featured" },
];

// FAQ Data List
const faqData = [
  {
    question: "How do I post an ad?",
    answer: "To post an ad, sign in as an advertiser, navigate to the dashboard, and click 'Create Ad.' Fill in the details, upload an image, and submit for review."
  },
  {
    question: "What types of ads can I post?",
    answer: "You can post banner ads, video ads, text-based promotions, and location-based ads for maximum visibility."
  },
  {
    question: "How do I manage my active ads?",
    answer: "You can manage active ads from the 'My Ads' section in the advertiser dashboard. Edit, pause, or delete ads anytime."
  },
  {
    question: "How do I track ad performance?",
    answer: "Our real-time analytics dashboard provides insights on ad views, clicks, conversions, and audience engagement."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI, credit/debit cards, PayPal, and net banking for ad payments."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach out via email at yogeshkarthik1524@gmail.com or call us at +91 8511605724 for assistance."
  },
];

// Features Data
const features = [
  { title: "📈 High Visibility", desc: "Your ads reach a wide audience with our smart algorithms." },
  { title: "🎯 Targeted Ads", desc: "Filter your audience by location, interest, and preferences." },
  { title: "💰 Cost-Effective", desc: "Affordable pricing plans for every business size." },
  { title: "⚡ Real-Time Analytics", desc: "Track the performance of your ads with detailed insights." },
];

// Contact Details Data
const contactDetails = [
  {
    title: "Email Us",
    icon: "📧",
    info: [
      { label: "For general inquiries:", value: "zeelp3868@gmail.com" },
      { label: "For business partnerships:", value: "samirvithlani@gmail.com" },
    ],
  },
  {
    title: "Call Us",
    icon: "📱",
    info: [
      { label: "Customer Support:", value: "+91 8799554591" },
      { label: "Business Inquiries:", value: "+91 8799554591" },
    ],
  },
];

// Terms Data
const termsData = [
  { title: "📌 Account Registration", description: "Users must provide accurate information during registration. Any fraudulent activity will result in account suspension." },
  { title: "📢 Ad Content Policy", description: "Advertisements must comply with ethical and legal standards. We reserve the right to remove inappropriate content." },
  { title: "💳 Payment and Refunds", description: "Payments are processed securely. Refunds are subject to our refund policy and eligibility criteria." },
  { title: "⚖️ User Responsibilities", description: "Users must not engage in fraudulent activities, misleading advertisements, or abuse of our platform." },
  { title: "🔄 Platform Modifications", description: "We may update our terms periodically. Continued use of our platform implies acceptance of these changes." },
  { title: "📞 Contact & Support", description: "If you have any questions regarding our terms, feel free to contact our support team." },
];

export const WelcomeHome = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/specificregister");
  };

  return (
    <>
      <Navbar />
      {/* Full Page Centered Box */}
      <Box
        id="home"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundImage: `url(${homeimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          color: "black",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to AdVerse
        </Typography>
        <Typography variant="h3" color="textSecondary" sx={{ maxWidth: 600 }}>
          Discover and advertise your products effectively with our platform.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3, px: 4, py: 1.5, fontSize: "1.2rem", backgroundColor: "#1976d2", borderRadius: "30px" }}
          onClick={handleStart}
        >
          Get Started
        </Button>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: 8, textAlign: "center", backgroundColor: "#f5f5f5", overflow: "hidden" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Explore our powerful advertisement services designed to boost your business.
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {services.map((service) => (
            <Grid item key={service.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: 250,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                  boxShadow: 3,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.05)",
                    backgroundColor: "#f0f0f0",
                  },
                  overflow: "hidden"
                }}>
                {service.icon}
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">{service.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{service.desc}</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" size="small" onClick={() => navigate("/specificregister")}>
                    {service.cta}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQs Section */}
      <Box
        id="faqs"
        sx={{
          py: 8,
          px: 2,
          backgroundColor: "#f5f5f5",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Here are some common questions and answers to help you understand our platform better.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: "800px", textAlign: "left" }}>
            {faqData.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  my: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": { boxShadow: 5 },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight="bold">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Box>

      {/* About Us Section */}
      <Box
      id="about"
      sx={{
        py: 6,
        px: 3,
        textAlign: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      {/* Section Title */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        About AdVerse
      </Typography>

      {/* Introduction */}
      <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 800, margin: "auto" }}>
        Welcome to <strong>AdVerse</strong>, your go-to platform for online advertisements! 🚀 We connect businesses with
        potential customers by offering a seamless and effective way to promote products, services, and special offers.
      </Typography>

      {/* Mission Statement */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 750, margin: "auto" }}>
          At AdVerse, our mission is to empower businesses by providing a <strong>smart, targeted, and cost-effective</strong> advertising
          platform. Whether you're a startup or an established brand, we help you <strong>reach the right audience at the right time</strong>.
        </Typography>
      </Box>

      {/* Why Choose Us? */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={3} sx={{ justifyContent: "center", mt: 2 }}>
          {features.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": { boxShadow: 5 },
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>

      {/* Contact Us Section */}
      <Box
      id="contact"
      sx={{
        py: 6,
        px: 3,
        textAlign: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      {/* Section Title */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Contact Us 📞
      </Typography>

      {/* Description */}
      <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 800, margin: "auto" }}>
        Need help? Have a question? We're here to assist you. Feel free to reach out to us via email or phone, and our team
        will respond as soon as possible.
      </Typography>

      {/* Contact Cards (Email & Phone) */}
      <Grid container spacing={3} sx={{ justifyContent: "center", mt: 4, maxWidth: "1000px", mx: "auto" }}>
        {contactDetails.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: 2,
                boxShadow: 2,
                transition: "all 0.3s ease-in-out",
                "&:hover": { boxShadow: 5 },
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {item.icon} {item.title}
              </Typography>
              {item.info.map((detail, idx) => (
                <Box key={idx} sx={{ mt: idx === 0 ? 2 : 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {detail.label}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0073e6" }}>
                    {detail.value}
                  </Typography>
                </Box>
              ))}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Business Hours */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🕒 Business Hours
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Monday - Friday: 9:00 AM - 6:00 PM (IST) <br />
          Saturday - Sunday: Closed
        </Typography>
      </Box>

      {/* Contact Button */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0073e6",
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            "&:hover": { backgroundColor: "#005bb5" },
          }}
          href="mailto:zeelp3868@gmail.com"
        >
          Send an Email
        </Button>
      </Box>
    </Box>

      {/* Terms & Conditions Section */}
      <Box
      id="terms"
      sx={{
        py: 6,
        px: 3,
        textAlign: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      {/* Section Title */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Terms and Conditions 📜
      </Typography>

      {/* Description */}
      <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 800, margin: "auto", mb: 3 }}>
        Welcome to <strong>AdFirm</strong>! By using our platform, you agree to comply with the following terms and conditions.
      </Typography>

      {/* Terms Grid */}
      <Grid container spacing={3} sx={{ justifyContent: "center", maxWidth: "1000px", mx: "auto" }}>
        {termsData.map((term, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              sx={{
                p: 3,
                textAlign: "left",
                backgroundColor: "#ffffff",
                borderRadius: 2,
                boxShadow: 2,
                transition: "all 0.3s ease-in-out",
                "&:hover": { boxShadow: 5 },
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {term.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {term.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
  );
};

