import React from "react";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/diaries" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 88px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "360px", sm: "420px" },
          borderRadius: { xs: 5, sm: 6 },
          boxShadow: "0 18px 40px rgba(35, 49, 66, 0.12)",
          bgcolor: "#fffdf8",
          overflow: "hidden",
        }}
      >
        <SignIn
          routing="path"
          path="/auth"
          signUpUrl="/auth"
          withSignUp
          fallbackRedirectUrl="/diaries"
          forceRedirectUrl="/diaries"
          appearance={{
            elements: {
              rootBox: {
                width: "100%",
                display: "block",
              },
              cardBox: {
                width: "100%",
                display: "block",
              },
              card: {
                width: "100%",
                boxShadow: "none",
                border: "none",
                borderRadius: "0px",
                background: "#fffdf8",
                padding: "24px",
              },
              headerTitle: {
                fontSize: "1.7rem",
                lineHeight: "2.2rem",
                color: "#111827",
                textAlign: "center",
              },
              headerSubtitle: {
                color: "#6b7280",
              },
              formButtonPrimary: {
                backgroundColor: "#d1512d",
                borderRadius: "999px",
                boxShadow: "0 12px 30px rgba(209, 81, 45, 0.2)",
              },
              footerActionLink: {
                color: "#d1512d",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Auth;
