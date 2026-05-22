import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box width="100%">
      <Box
        position="relative"
        minHeight={{ xs: "50vh", sm: "56vh", md: "72vh" }}
        sx={{
          backgroundImage:
            "linear-gradient(90deg, rgba(167, 195, 223, 0.95) 0%, rgba(167, 195, 223, 0.7) 34%, rgba(13, 22, 38, 0.2) 62%, rgba(13, 22, 38, 0.75) 100%), url('/yjhd.jpg')",
          backgroundSize: "cover",
          backgroundPosition: { xs: "72% top", md: "center top" },
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "58%" },
            px: { xs: 2.5, sm: 4, md: 7 },
            pt: { xs: 5, sm: 6, md: 8 },
            pb: { xs: 4, md: 0 },
          }}
        >
          <Typography
            fontFamily={"Dancing Script,cursive"}
            fontWeight="bold"
            sx={{
              color: "#1f2530",
              fontSize: { xs: "1.9rem", sm: "2.6rem", md: "4rem" },
              lineHeight: 1.1,
              textShadow: "0 2px 12px rgba(255,255,255,0.18)",
              maxWidth: { xs: "12ch", sm: "14ch", md: "16ch" },
            }}
          >
            Dare to live the life you&apos;ve always wanted
          </Typography>
        </Box>
      </Box>
      <Box
        width="100%"
        display={"flex"}
        flexDirection="column"
        sx={{ background: "#f7f1e8", py: 5 }}
      >
        <Typography
          fontFamily={"quicksand"}
          textAlign={"center"}
          variant="h4"
          padding={2}
          color="#233142"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            px: 2,
          }}
        >
          SHARE YOUR TRAVEL DIARIES WITH US
        </Typography>
        <Box
          margin="auto"
          display="flex"
          gap={2}
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="center"
          width={{ xs: "100%", sm: "auto" }}
          maxWidth={{ xs: "320px", sm: "none" }}
          px={2}
        >
          <Button
            LinkComponent={Link}
            to="/add"
            variant="outlined"
            sx={{
              borderColor: "#233142",
              color: "#233142",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Share Your Story
          </Button>
          <Button
            LinkComponent={Link}
            to="/diaries"
            variant="contained"
            sx={{ background: "#d1512d", width: { xs: "100%", sm: "auto" } }}
          >
            View Diaries
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
