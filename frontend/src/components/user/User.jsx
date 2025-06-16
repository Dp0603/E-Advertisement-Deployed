import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, CircularProgress, Box, CssBaseline, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import bgImage from "../assets/images/UserBackground.jpg";
import UserSidebar from "./UserSidebar";

const Footer = () => {
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#333",
        color: "white",
        textAlign: "center",
        py: 2,
        mt: "auto" // Pushes the footer to the bottom dynamically
      }}
    >
      <Typography variant="body2">© {new Date().getFullYear()} AdVerse. All rights reserved.</Typography>
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 1 }}>
        {[
          { title: "About Us", id: "about" },
          { title: "Contact Us", id: "contact" },
          { title: "FAQs", id: "faqs" },
          { title: "Privacy Policy", id: "privacy-policy" },
          { title: "Terms & Conditions", id: "terms-conditions" },
        ].map((item, index) => (
          <Grid item key={index}>
            <Button onClick={() => handleScroll(item.id)} sx={{ color: "white", textTransform: "none" }}>
              {item.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export const User = () => {
  //const user = (localStorage.getItem("token")) || {};
  const user = JSON.parse(localStorage.getItem("user")) || null;


  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await API.get("/ads");
        setAds(res.data);
      } catch (error) {
        console.log("Error Fetching Ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  return (
    <>
      <CssBaseline />
      <UserSidebar />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensures the footer stays at the bottom
          overflowX: "hidden", // Prevents horizontal scrolling
        }}
      >
        <Container
          maxWidth="xl"
          disableGutters
          sx={{
            width: "100%", // Prevents horizontal overflow
            flexGrow: 1, // Allows the main content to grow and push the footer down
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: 4,
          }}
        >
          {/* Welcome Section */}
          <Typography variant="h4" gutterBottom>
            Welcome, {user ? user.firstName : "User"}! 🎉
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Explore the latest ads and find what you need.
          </Typography>

          {/* Quick Access Cards */}
          <Grid container spacing={3} sx={{ my: 3, justifyContent: "center" }}>
            {[
              { title: "Browse Ads", link: "/browseads" },
              { title: "Saved Ads", link: "/saved-ads" },
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  component={Link}
                  to={item.link}
                  sx={{
                    textDecoration: "none",
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                      transform: "scale(1.05)",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" align="center">
                      {item.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Featured Ads */}
          <Typography variant="h5" gutterBottom>
            Featured Ads
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3} sx={{ justifyContent: "center" }}>
              {ads.slice(0, 6).map((ad) => (
                <Grid item xs={12} sm={6} md={4} key={ad._id}>
                  <Card>
                    <CardMedia component="img" height="300" image={ad.adUrl || "/placeholder.jpg"} alt={ad.title} />
                    <CardContent>
                      <Typography variant="h6">{ad.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {ad.description.substring(0, 50)}...
                      </Typography>
                      <Button component={Link} to={`/viewdetails/${ad._id}`} size="small" sx={{ mt: 1 }}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          {/* About Us Section */}
          <Box id="about" sx={{ py: 5, px: 3, textAlign: "center", backgroundColor: "#eef2f5", marginTop: "10px", width: "1550px" }}>
            <Typography variant="h4" gutterBottom>
              About AdFirm
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 800, margin: "auto" }}>
              Welcome to <strong>AdFirm</strong>, your go-to platform for online advertisements! 🚀 We connect businesses with
              potential customers by offering a seamless and effective way to promote products, services, and special offers.
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" color="textSecondary">
                At AdFirm, our mission is to empower businesses by providing a **smart, targeted, and cost-effective** advertising
                platform. Whether you're a startup or an established brand, we help you **reach the right audience at the right time**.
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" gutterBottom>
                Why Choose Us?
              </Typography>
              <Grid container spacing={3} sx={{ justifyContent: "center", mt: 1 }}>
                {[
                  { title: "📈 High Visibility", desc: "Your ads reach a wide audience with our smart algorithms." },
                  { title: "🎯 Targeted Ads", desc: "Filter your audience by location, interest, and preferences." },
                  { title: "💰 Cost-Effective", desc: "Affordable pricing plans for every business size." },
                  { title: "⚡ Real-Time Analytics", desc: "Track the performance of your ads with detailed insights." }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{ p: 2, height: "100%", textAlign: "center", backgroundColor: "#ffffff" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>{item.title}</Typography>
                      <Typography variant="body2" color="textSecondary">{item.desc}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Contact Us Section */}
          <Box id="contact" sx={{ py: 5, px: 3, textAlign: "center", backgroundColor: "#eef2f5", marginTop: "0px", width: "1550px" }}>
            <Typography variant="h4" gutterBottom>
              Contact Us 📞
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 800, margin: "auto" }}>
              Need help? Have a question? We're here to assist you. Feel free to reach out to us via email or phone, and our team
              will respond as soon as possible.
            </Typography>

            <Grid container spacing={2} sx={{ justifyContent: "center", mt: 3, maxWidth: "1000px", mx: "auto" }}>
              {/* Email Section */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 3, textAlign: "center", backgroundColor: "#ffffff" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>📧 Email Us</Typography>
                  <Typography variant="body2" color="textSecondary">For general inquiries:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0073e6" }}>
                    zeelp3868@gmail.com
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>For business partnerships:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0073e6" }}>
                    samirvithlani@gmail.com
                  </Typography>
                </Card>
              </Grid>

              {/* Phone Section */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 3, textAlign: "center", backgroundColor: "#ffffff", height: "100%" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>📱 Call Us</Typography>
                  <Typography variant="body2" color="textSecondary">Customer Support:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0073e6" }}>
                    +91 8799554591
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Business Inquiries:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0073e6" }}>
                    +91 9799554591
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Business Hours */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                🕒 Business Hours
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Monday - Friday: 9:00 AM - 6:00 PM (IST) <br />
                Saturday - Sunday: Closed
              </Typography>
            </Box>

            {/* Contact CTA */}
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#0073e6", color: "#fff", fontWeight: "bold", px: 4 }}
                href="mailto:yogeshkarthik1524@gmail.com"
              >
                Send an Email
              </Button>
            </Box>
          </Box>


          {/* FAQs Section */}
          <Box id="faqs" sx={{ mt: 6, padding: 4, marginTop: "0px", textAlign: "center", width: "1550px", backgroundColor: "#eef2f5" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Here are some common questions and answers to help you understand our platform better.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box sx={{ maxWidth: "800px", textAlign: "left" }}>
                <Accordion sx={{ my: 1, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight="bold">How do I post an ad?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      To post an ad, sign in as an advertiser, navigate to the dashboard, and click "Create Ad." Fill in the details, upload an image, and submit for review.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ my: 1, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight="bold">What types of ads can I post?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      You can post banner ads, video ads, text-based promotions, and location-based ads for maximum visibility.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ my: 1, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight="bold">How do I manage my active ads?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      You can manage active ads from the "My Ads" section in the advertiser dashboard. Edit, pause, or delete ads anytime.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ my: 1, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight="bold">How do I track ad performance?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      Our real-time analytics dashboard provides insights on ad views, clicks, conversions, and audience engagement.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ my: 1, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight="bold">What payment methods do you accept?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      We accept UPI, credit/debit cards, PayPal, and net banking for ad payments.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ my: 1, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" fontWeight="bold">How can I contact customer support?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      You can reach out via email at yogeshkarthik1524@gmail.com or call us at +91 8511605724 for assistance.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </Box>


          {/* Privacy Policy Section */}
          <Box id="privacy-policy" sx={{ textAlign: "left", width: "1540px", justifyContent: "center" }}>
            <Card sx={{ width: "100%", backgroundColor: "#eef2f5", padding: 3 }}>
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
                Privacy Policy 🔒
              </Typography>

              {/* Accordion for Sections */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">1. Data Collection</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    We collect information such as your name, email, and browsing history when you use our platform.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">2. How We Use Your Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    We use your data to enhance user experience, personalize ads, and improve our services.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">3. Third-Party Sharing</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    We do not sell your data to third parties. However, we may share it with trusted partners for service improvement.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">4. Security Measures</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    We implement encryption, secure servers, and access controls to protect your data.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="bold">5. Your Rights</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    You can request data access, corrections, or deletion by contacting our support team.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Card>
          </Box>



          {/* Terms and Conditions Section */}
          <Box
            id="terms-conditions"
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "1590px",
            }}
          >
            <Card
              sx={{
                width: "100%",
                backgroundColor: "#eef2f5",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2} marginTop={3}>
                Terms and Conditions 📜
              </Typography>

              <Typography variant="body1" mb={2}>
                Welcome to AdFirm! By using our platform, you agree to comply with the following terms and conditions:
              </Typography>

              <List sx={{ textAlign: "center", display: "inline-block" }}>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Users must provide accurate information during registration." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Advertisements must comply with ethical and legal standards." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Payments are processed securely, and refunds follow our policy." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Users must not engage in fraudulent activities or misleading ads." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="We may update terms periodically, and continued use implies acceptance." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="For any queries, contact our support team." />
                </ListItem>
              </List>
            </Card>
          </Box>



        </Container>
        {/* Footer */}
        <Footer />
      </Box>
    </>
  );
};
