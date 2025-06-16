import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Card, CardContent, Button } from "@mui/material";
import { Navbar } from "../Navbar"

export const SpecificRegister = () => {

    const navigate = useNavigate();

    const handleRegister = (role) => {
        navigate(`/register/${role}`);
    }
    return (
        <>
            <Navbar></Navbar>
            <Box
                sx={{
                    height: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5",
                    padding: 10,
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: "bold", color: "#333" }}
                    >
                        Register as?
                    </Typography>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={8}
                        gap={3}
                    >
                        {/* Register as User */}
                        <Card
                            sx={{
                                flex: 1,
                                padding: 3,
                                boxShadow: 3,
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5" align="center" gutterBottom>
                                    Register as User
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color="primary"
                                    onClick={() => handleRegister("user")}
                                >
                                    Register
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Register as Advertiser */}
                        <Card
                            sx={{
                                flex: 1,
                                padding: 3,
                                boxShadow: 3,
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5" align="center" gutterBottom>
                                    Register as Advertiser
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color="secondary"
                                    onClick={() => handleRegister("advertiser")}
                                >
                                    Register
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Another Role (Optional) */}
                        {/* <Card
                        sx={{
                            flex: 1,
                            padding: 3,
                            boxShadow: 3,
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" align="center" gutterBottom>
                                Register as Other
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                color="success"
                                onClick={() => handleRegister("other")}
                            >
                                Register
                            </Button>
                        </CardContent>
                    </Card> */}
                    </Box>
                </Container>
            </Box>
        </>
    );
};
