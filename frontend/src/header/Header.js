import React from "react";
import { AppBar, Tab, Tabs, Toolbar, Box } from "@mui/material";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { useAuth } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

const guestLinks = [
  { label: "Home", to: "/", icon: <CottageOutlinedIcon fontSize="small" /> },
  {
    label: "Diaries",
    to: "/diaries",
    icon: <MenuBookOutlinedIcon fontSize="small" />,
  },
  { label: "Auth", to: "/auth", icon: <LoginOutlinedIcon fontSize="small" /> },
];

const loggedInLinks = [
  { label: "Home", to: "/", icon: <CottageOutlinedIcon fontSize="small" /> },
  {
    label: "Diaries",
    to: "/diaries",
    icon: <MenuBookOutlinedIcon fontSize="small" />,
  },
  { label: "Add", to: "/add", icon: <AddCircleOutlineIcon fontSize="small" /> },
  {
    label: "Profile",
    to: "/profile",
    icon: <AccountCircleOutlinedIcon fontSize="small" />,
  },
];

const Header = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const navLinks = isSignedIn ? loggedInLinks : guestLinks;

  const currentPath = location.pathname.startsWith("/post/")
    ? "/profile"
    : location.pathname;

  const activeTab = navLinks.some((link) => link.to === currentPath)
    ? currentPath
    : false;

  return (
    <AppBar
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(35, 49, 66, 0.12)",
        position: "sticky",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          py: 1,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent={{ xs: "center", sm: "flex-start" }}
        >
          <Box
            component="img"
            src="/applogo.png"
            alt="Travel Diaries"
            sx={{
              height: { xs: 42, sm: 48, md: 54 },
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        <Tabs
          value={activeTab}
          TabIndicatorProps={{ style: { display: "none" } }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: "auto",
            alignSelf: { xs: "center", sm: "auto" },
            maxWidth: "100%",
            "& .MuiTabs-scroller": {
              overflowX: "auto !important",
            },
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
          }}
        >
          {navLinks.map((link) => (
            <Tab
              key={link.to}
              value={link.to}
              icon={link.icon}
              iconPosition="start"
              LinkComponent={Link}
              to={link.to}
              label={link.label}
              sx={{
                minHeight: "auto",
                borderRadius: "999px",
                color: "#556072",
                fontFamily: "Quicksand, sans-serif",
                fontSize: { xs: "0.82rem", sm: "0.92rem" },
                fontWeight: 700,
                letterSpacing: "0.04em",
                minWidth: "unset",
                px: { xs: 1.4, sm: 2 },
                py: { xs: 0.8, sm: 1.1 },
                textTransform: "none",
                transition:
                  "background-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                "& .MuiTab-iconWrapper": {
                  mb: "0 !important",
                },
                "& .MuiSvgIcon-root": {
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                },
                "&:hover": {
                  bgcolor: "rgba(209, 81, 45, 0.08)",
                  color: "#d1512d",
                  transform: "translateY(-1px)",
                },
                "&.Mui-selected": {
                  bgcolor: "#233142",
                  color: "#f7f1e8",
                  boxShadow: "0 12px 30px rgba(35, 49, 66, 0.18)",
                },
              }}
            />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
