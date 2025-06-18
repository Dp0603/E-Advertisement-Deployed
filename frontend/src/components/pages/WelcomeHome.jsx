import React from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
} from "@mui/material";
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
  {
    id: 1,
    title: "Create & Manage Ads",
    desc: "Design, publish, and edit advertisements easily.",
    icon: <CampaignIcon fontSize="large" />,
    cta: "Start Advertising Now",
  },
  {
    id: 2,
    title: "Targeted Ad Campaigns",
    desc: "Choose specific locations, categories, and audience demographics.",
    icon: <TrackChangesIcon fontSize="large" />,
    cta: "Run Targeted Ads",
  },
  {
    id: 3,
    title: "Ad Performance Analytics",
    desc: "Track views, clicks, and conversions in real-time.",
    icon: <ShowChartIcon fontSize="large" />,
    cta: "Analyze & Optimize",
  },
  {
    id: 4,
    title: "Budget-Friendly Ad Plans",
    desc: "Flexible pricing plans for different ad durations and reach.",
    icon: <MonetizationOnIcon fontSize="large" />,
    cta: "Get Started",
  },
  {
    id: 5,
    title: "Featured Ad Promotions",
    desc: "Boost your ad visibility with premium placements.",
    icon: <StarIcon fontSize="large" />,
    cta: "Get Featured",
  },
];

// FAQ Data List
const faqData = [
  {
    question: "How do I post an ad?",
    answer:
      "To post an ad, sign in as an advertiser, navigate to the dashboard, and click 'Create Ad.' Fill in the details, upload an image, and submit for review.",
  },
  {
    question: "What types of ads can I post?",
    answer:
      "You can post banner ads, video ads, text-based promotions, and location-based ads for maximum visibility.",
  },
  {
    question: "How do I manage my active ads?",
    answer:
      "You can manage active ads from the 'My Ads' section in the advertiser dashboard. Edit, pause, or delete ads anytime.",
  },
  {
    question: "How do I track ad performance?",
    answer:
      "Our real-time analytics dashboard provides insights on ad views, clicks, conversions, and audience engagement.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, credit/debit cards, PayPal, and net banking for ad payments.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach out via email at pateldevam107@gmail.com or call us at +91 7041815288 for assistance.",
  },
];

// Features Data
const features = [
  {
    title: "📈 High Visibility",
    desc: "Your ads reach a wide audience with our smart algorithms.",
  },
  {
    title: "🎯 Targeted Ads",
    desc: "Filter your audience by location, interest, and preferences.",
  },
  {
    title: "💰 Cost-Effective",
    desc: "Affordable pricing plans for every business size.",
  },
  {
    title: "⚡ Real-Time Analytics",
    desc: "Track the performance of your ads with detailed insights.",
  },
];

// Contact Details Data
const contactDetails = [
  {
    title: "Email Us",
    icon: "📧",
    info: [
      { label: "For general inquiries:", value: "pateldevam@yopmail.com" },
      { label: "For business partnerships:", value: "e-advertisement@yopmail.com" },
    ],
  },
  {
    title: "Call Us",
    icon: "📱",
    info: [
      { label: "Customer Support:", value: "+91 0123456789" },
      { label: "Business Inquiries:", value: "+91 9876543210" },
    ],
  },
];

// Terms Data
const termsData = [
  {
    title: "📌 Account Registration",
    description:
      "Users must provide accurate information during registration. Any fraudulent activity will result in account suspension.",
  },
  {
    title: "📢 Ad Content Policy",
    description:
      "Advertisements must comply with ethical and legal standards. We reserve the right to remove inappropriate content.",
  },
  {
    title: "💳 Payment and Refunds",
    description:
      "Payments are processed securely. Refunds are subject to our refund policy and eligibility criteria.",
  },
  {
    title: "⚖️ User Responsibilities",
    description:
      "Users must not engage in fraudulent activities, misleading advertisements, or abuse of our platform.",
  },
  {
    title: "🔄 Platform Modifications",
    description:
      "We may update our terms periodically. Continued use of our platform implies acceptance of these changes.",
  },
  {
    title: "📞 Contact & Support",
    description:
      "If you have any questions regarding our terms, feel free to contact our support team.",
  },
];

export const WelcomeHome = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleStart = () => {
    navigate("/specificregister");
  };

  // Smooth scroll for anchor links (optional)
  React.useEffect(() => {
    const handleAnchorClick = (e) => {
      if (e.target.tagName === "A" && e.target.hash) {
        const target = document.querySelector(e.target.hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.6), rgba(0,0,0,0.5)), url(${homeimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          color: "#fff",
        }}
      >
        <Container maxWidth="md" sx={{ zIndex: 2, py: 10 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{
              letterSpacing: 1,
              textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            Welcome to AdVerse
          </Typography>
          <Typography
            variant="h5"
            color="inherit"
            sx={{
              maxWidth: 700,
              mx: "auto",
              mb: 4,
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
          >
            Discover and advertise your products effectively with our platform.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              px: 5,
              py: 2,
              fontSize: "1.2rem",
              background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
              borderRadius: "30px",
              boxShadow: "0 4px 20px rgba(25,118,210,0.2)",
              fontWeight: "bold",
              letterSpacing: 1,
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)",
                transform: "translateY(-2px) scale(1.04)",
              },
            }}
            onClick={handleStart}
          >
            Get Started
          </Button>
        </Container>
        {/* Overlay for readability */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(25,118,210,0.4) 0%, rgba(0,0,0,0.6) 100%)",
            zIndex: 1,
          }}
        />
      </Box>

      {/* Section Divider */}
      <Divider sx={{ my: 0, borderColor: "#e3e3e3" }} />

      {/* Services Section */}
      <Box
        id="services"
        sx={{
          py: 8,
          textAlign: "center",
          background: "linear-gradient(120deg, #e3f2fd 60%, #f8fafc 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1976d2" }}>
            Our Services
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
            Explore our powerful advertisement services designed to boost your business.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {services.map((service) => (
              <Grid item key={service.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: 270,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                    boxShadow: 4,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)",
                    border: "2px solid #1976d2",
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: 8,
                      transform: "scale(1.04)",
                      background: "linear-gradient(135deg, #bbdefb 60%, #e3f2fd 100%)",
                      borderColor: "#21cbf3",
                    },
                  }}
                >
                  <Box sx={{ mb: 2, color: "#1976d2" }}>{service.icon}</Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: "#1976d2" }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {service.desc}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: "20px",
                        fontWeight: "bold",
                        borderColor: "#1976d2",
                        color: "#1976d2",
                        "&:hover": {
                          background: "#1976d2",
                          color: "#fff",
                        },
                      }}
                      onClick={() => navigate("/specificregister")}
                    >
                      {service.cta}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Section Divider */}
      <Divider sx={{ my: 0, borderColor: "#e3e3e3" }} />

      {/* FAQs Section */}
      <Box
        id="faqs"
        sx={{
          py: 8,
          px: 2,
          background: "linear-gradient(120deg, #e3f2fd 60%, #f8fafc 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1976d2" }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Here are some common questions and answers to help you understand our platform better.
          </Typography>
          <Grid
            container
            spacing={4}
            sx={{
              width: "100%",
              maxWidth: "1200px",
              mx: "auto",
              textAlign: "left",
            }}
          >
            {faqData.map((faq, index) => (
              <FAQCard key={index} faq={faq} />
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Section Divider */}
      <Divider sx={{ my: 0, borderColor: "#e3e3e3" }} />

      {/* About Us Section */}
      <Box
        id="about"
        sx={{
          py: 7,
          px: 3,
          textAlign: "center",
          background: "linear-gradient(120deg, #e3f2fd 60%, #f8fafc 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1976d2" }}>
            About AdVerse
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ maxWidth: 800, margin: "auto" }}
          >
            Welcome to <strong>AdVerse</strong>, your go-to platform for online advertisements! 🚀 We connect businesses with potential customers by offering a seamless and effective way to promote products, services, and special offers.
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#1976d2" }}>
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ maxWidth: 750, margin: "auto" }}
            >
              At AdVerse, our mission is to empower businesses by providing a <strong>smart, targeted, and cost-effective</strong> advertising platform. Whether you're a startup or an established brand, we help you <strong>reach the right audience at the right time</strong>.
            </Typography>
          </Box>
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#1976d2" }}>
              Why Choose Us?
            </Typography>
            <Grid container spacing={4} sx={{ justifyContent: "center", mt: 2 }}>
              {features.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      p: 3,
                      height: "100%",
                      textAlign: "center",
                      background: "linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)",
                      borderRadius: 2,
                      boxShadow: 2,
                      border: "2px solid #1976d2",
                      transition: "all 0.3s",
                      "&:hover": { boxShadow: 5, background: "#bbdefb", borderColor: "#21cbf3" },
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: "#1976d2" }}>
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
        </Container>
      </Box>

      {/* Section Divider */}
      <Divider sx={{ my: 0, borderColor: "#e3e3e3" }} />

      {/* Contact Us Section */}
      <Box
        id="contact"
        sx={{
          py: 7,
          px: 3,
          textAlign: "center",
          background: "linear-gradient(120deg, #e3f2fd 60%, #f8fafc 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1976d2" }}>
            Contact Us 📞
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ maxWidth: 800, margin: "auto" }}
          >
            Need help? Have a question? We're here to assist you. Feel free to reach out to us via email or phone, and our team will respond as soon as possible.
          </Typography>
          <Grid
            container
            spacing={4}
            sx={{
              justifyContent: "center",
              mt: 4,
              maxWidth: "1000px",
              mx: "auto",
            }}
          >
            {contactDetails.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "center",
                    background: "linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)",
                    borderRadius: 2,
                    boxShadow: 2,
                    border: "2px solid #1976d2",
                    transition: "all 0.3s",
                    "&:hover": { boxShadow: 5, background: "#bbdefb", borderColor: "#21cbf3" },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2" }}>
                    {item.icon} {item.title}
                  </Typography>
                  {item.info.map((detail, idx) => (
                    <Box key={idx} sx={{ mt: idx === 0 ? 2 : 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {detail.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#1976d2" }}
                      >
                        {detail.value}
                      </Typography>
                    </Box>
                  ))}
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#1976d2" }}>
              🕒 Business Hours
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Monday - Friday: 9:00 AM - 6:00 PM (IST) <br />
              Saturday - Sunday: Closed
            </Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                color: "#fff",
                fontWeight: "bold",
                px: 5,
                borderRadius: "30px",
                boxShadow: "0 4px 20px rgba(25,118,210,0.1)",
                "&:hover": { background: "linear-gradient(90deg, #1565c0 60%, #00bcd4 100%)" },
              }}
              href="mailto:zeelp3868@gmail.com"
            >
              Send an Email
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Section Divider */}
      <Divider sx={{ my: 0, borderColor: "#e3e3e3" }} />

      {/* Terms & Conditions Section */}
      <Box
        id="terms"
        sx={{
          py: 7,
          px: 3,
          textAlign: "center",
          background: "linear-gradient(120deg, #e3f2fd 60%, #f8fafc 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#1976d2" }}>
            Terms and Conditions 📜
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ maxWidth: 800, margin: "auto", mb: 3 }}
          >
            Welcome to <strong>AdFirm</strong>! By using our platform, you agree to comply with the following terms and conditions.
          </Typography>
          <Grid
            container
            spacing={4}
            sx={{ justifyContent: "center", maxWidth: "1000px", mx: "auto" }}
          >
            {termsData.map((term, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "left",
                    background: "linear-gradient(135deg, #e3f2fd 60%, #f8fafc 100%)",
                    borderRadius: 2,
                    boxShadow: 2,
                    border: "2px solid #1976d2",
                    transition: "all 0.3s",
                    "&:hover": { boxShadow: 5, background: "#bbdefb", borderColor: "#21cbf3" },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2" }}>
                    {term.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {term.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Copyright Footer */}
      <Box
        sx={{
          py: 2,
          px: 2,
          background: "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          © {new Date().getFullYear()} AdVerse. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

// Place this component at the bottom of the file (before export)
const FAQCard = ({ faq }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          background: "linear-gradient(135deg, #f8fafc 60%, #e3f2fd 100%)",
          border: "2px solid #1976d2",
          transition: "all 0.3s",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          cursor: "pointer",
          "&:hover": { boxShadow: 6, background: "#e3f2fd", borderColor: "#21cbf3" },
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <CardContent sx={{ pb: open ? 1 : 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 0, color: "#1976d2", flex: 1 }}
            >
              {faq.question}
            </Typography>
            <Box sx={{ ml: 2, fontSize: 28, color: "#1976d2" }}>
              {open ? <ExpandMoreIcon sx={{ transform: "rotate(180deg)" }} /> : <ExpandMoreIcon />}
            </Box>
          </Box>
          {open && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 2, transition: "all 0.2s" }}
            >
              {faq.answer}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};
