// pages/Calendar.js
import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export const Schedule = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", padding: 4, minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{ padding: 4, maxWidth: 800, margin: "auto", textAlign: "center" }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          Match Schedule
        </Typography>
        <iframe
          src="https://calendar.google.com/calendar/embed?src=9244b1006e694dfc26b5b023846b3729b4bbb001ba2284b1c13bd52e88c8829d%40group.calendar.google.com&ctz=America%2FChicago"
          style={{ border: 0 }}
          width="100%"
          height="600"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </Paper>
    </Box>
  );
};
