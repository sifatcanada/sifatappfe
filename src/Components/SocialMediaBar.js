import * as React from "react";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import TikTokIcon from './TikTokIcon';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import jsonData from '../data.json'; // Import the JSON file

export default function SocialMediaBar() {
  const tiktok_link = jsonData.tiktok_link;
  const youtube_link = jsonData.youtube_link;
  const insta_link = jsonData.insta_link;
  const facebook_link = jsonData.facebook_link;
  const phone_number = jsonData.phone_number;
  const email_address = jsonData.email_address;
  return (
    <Container maxWidth="md" sx={{ mt: 1 }}>
      <Stack direction="row" spacing={1}>

        <a href={tiktok_link} target="_blank" rel="noopener noreferrer">
          <div style={{ width: "35px" }}>
            <TikTokIcon />
          </div>
        </a>

        <a href={youtube_link} target="_blank" rel="noopener noreferrer">
          <YouTubeIcon fontSize="large" sx={{ color: "#FF0000" }} />
        </a>

        <a href={insta_link} target="_blank" rel="noopener noreferrer">
        <InstagramIcon fontSize="large" sx={{ color: "#E1306C" }} />
        </a>

        <a href={facebook_link} target="_blank" rel="noopener noreferrer">
        <FacebookIcon color="primary" fontSize="large" />
        </a>

        <a href={`tel:${phone_number}`} rel="noopener noreferrer">
            <PhoneIcon fontSize="large" sx={{ color: "#000000" }}/>
        </a>
        <a href={`mailto:${email_address}`} rel="noopener noreferrer">
            <EmailIcon  fontSize="large" sx={{ color: "#000000" }}/>
        </a>
        
      </Stack>
    </Container>
  );
}