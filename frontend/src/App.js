import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import Auth from "./auth/Auth";
import Add from "./diaries/Add";
import Diaries from "./diaries/Diaries";
import DiaryUpdate from "./diaries/DiaryUpdate";
import Header from "./header/Header";
import Home from "./home/Home";
import Profile from "./profile/Profile";
import { syncClerkUser } from "./api-helpers/helpers";

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [isUserReady, setIsUserReady] = useState(
    Boolean(localStorage.getItem("userId"))
  );

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      localStorage.removeItem("userId");
      setIsUserReady(false);
      return;
    }

    if (!user) {
      return;
    }

    let ignore = false;

    const syncUser = async () => {
      try {
        const token = await getToken();

        if (!token) {
          if (!ignore) {
            setIsUserReady(false);
          }
          return;
        }

        const data = await syncClerkUser(
          {
            clerkId: user.id,
            name:
              user.fullName ||
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.username ||
              "Traveler",
            username: user.username || "",
            email: user.primaryEmailAddress?.emailAddress || "",
            profileImage: user.imageUrl || "",
          },
          token
        );

        if (!ignore && data?.user?._id) {
          localStorage.setItem("userId", data.user._id);
          setIsUserReady(true);
        }
      } catch (err) {
        console.log(err);
        if (!ignore) {
          setIsUserReady(false);
        }
      }
    };

    syncUser();

    return () => {
      ignore = true;
    };
  }, [getToken, isLoaded, isSignedIn, user]);

  return (
    <div>
      <header>
        <Header />
      </header>

      <section>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diaries" element={<Diaries />} />
          <Route path="/auth/*" element={<Auth />} />
          {isSignedIn && isUserReady && (
            <>
              <Route path="/add" element={<Add />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post/:id" element={<DiaryUpdate />} />
            </>
          )}
        </Routes>
      </section>
    </div>
  );
}

export default App;
