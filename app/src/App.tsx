import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import CallbackComp from "./components/auth/CallbackComp";
import { ScrollToTop } from "./components/common/ScrollToTop";
import CreatePostForm from "./components/posts/CreatePostForm";
import AppLayout from "./layout/AppLayout";
import AccountDetails from "./pages/AccountDetails";
import Accounts from "./pages/Accounts";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Calendar from "./pages/Calendar";
import Home from "./pages/Dashboard/Home";
import Maketting from "./pages/Marketting/Maketting";
import NotFound from "./pages/OtherPage/NotFound";
import Posts from "./pages/Posts";
import PostsList from "./pages/PostsList";
import Settings from "./pages/Settings/Settings";
import UserProfiles from "./pages/UserProfiles";
import ManageUsers from "./pages/users/ManageUsers";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
export default function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        stacked
        style={{ fontSize: 14, padding: "10px" }}
      />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Page for the Oauth Callbacks */}
          <Route path="accounts/callback" element={<CallbackComp />} />

          {/* Dashboard Layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />

            {/* Others Page */}
            <Route path="profile" element={<UserProfiles />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="accounts/:accountId" element={<AccountDetails />} />

            {/* Posts */}
            <Route path="posts" element={<Posts />}>
              <Route index element={<PostsList />} />
              <Route path="create" element={<CreatePostForm />} />
            </Route>

            {/* Posts */}
            <Route path="marketing" element={<Maketting />} />
            <Route path="settings" element={<Settings />} />
            <Route path="manageusers" element={<ManageUsers />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/terms-conditions" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
