import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { ToastContainer } from "react-toastify";
import Posts from "./pages/Posts";
import Accounts from "./pages/Accounts";
import PostsList from "./pages/PostsList";
import CreatePostForm from "./components/posts/CreatePostForm";
import FormElements from "./pages/Forms/FormElements";
import CallbackComp from "./components/auth/CallbackComp";
import AccountDetails from "./pages/AccountDetails";
import Maketting from "./pages/Marketting/Maketting";
import Settings from "./pages/Settings/Settings";
import ManageUsers from "./pages/users/ManageUsers";
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

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
