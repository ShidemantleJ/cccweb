// pages/About.js
import React from "react";
import { Link } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material";
import "./Home.css";

const About = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", padding: 4, minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{ padding: 4, maxWidth: 800, margin: "auto", textAlign: "center" }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          About the Competition
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          The Collegiate Cubing Championship is a project from the University of
          Alabama's Cubing Club, Alabama Crimson Cubing. Starting in January,
          matches will be organized between teams comprised of 3 members each
          from 28 college cubing clubs across the United States.
        </Typography>
        <Typography variant="h3" sx={{ mb: 3 }}>
          About the Organizers
        </Typography>
        <Typography variant="body1">
          The organizers of this competition are Alex Guirgues, Martin Albright,
          and John Shidemantle. For inquiries relating to the competition,
          please <Link to="/contact">contact us</Link> at
          crimsoncubingorganizers@gmail.com
        </Typography>
      </Paper>
    </Box>
  );
};

export default About;
