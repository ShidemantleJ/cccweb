// pages/About.js
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      <h1>About the Competition</h1>
      <p>The Collegiate Cubing Championship is a project from the University of Alabama's Cubing Club, Alabama Crimson Cubing. Starting in January, matches will be organized between teams comprised of 3 members of each of 32 college cubing clubs across the United States.</p>
      <h1>About the Organizers</h1>
      <p>The organizers of this competition are Alex Guirgues, Martin Albright, and John Shidemantle. For inquiries relating to the competition, please <Link to="/contact">contact us</Link></p>
    </div>
  );
};

export default About;
