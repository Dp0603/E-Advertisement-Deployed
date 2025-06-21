import { Routes, Route } from "react-router-dom";
import Registration from './components/pages/Registration'
import Login from './components/pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from './components/Navbar';
import { WelcomeHome } from './components/pages/WelcomeHome';
import { SpecificRegister } from './components/pages/SpecificRegister';
import { User } from './components/user/User';
import { Dashboard } from './components/agency/advertiser/Dashboard';
import { AdDetails } from "./components/agency/advertiser/AdDetails";
import { Screens } from "./components/agency/advertiser/Screens";
import { BrowseAds } from "./components/user/BrowseAds";
import { AdDetails2 } from "./components/agency/advertiser/AdDetails2";
import { Screens2 } from "./components/agency/advertiser/Screens2";
import { BookingAds } from "./components/user/BookingAds";
import { ViewDetails } from "./components/user/ViewDetails";
import { ManageBookings } from "./components/agency/advertiser/ManageBookings";
import SavedAds from "./components/user/SavedAds";
import { AdvertiserProfile } from "./components/agency/advertiser/profile/AdvertiserProfile";
import { PersonalInfo } from "./components/agency/advertiser/profile/PersonalInfo";
import Payment from './components/agency/advertiser/profile/Payment';
import { ChangePassword } from "./components/agency/advertiser/profile/ChangePassword";
import { UserProfile } from "./components/user/profile/UserProfile";
import { UserChangePassword } from "./components/user/profile/UserChangePassword";
import { UserInfo } from "./components/user/profile/UserInfo";
import BookedAds from "./components/user/BookedAds";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import { LoaderProvider } from "./context/LoaderContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <LoaderProvider>
      <ToastProvider>
        <div>
          {/* <Navbar></Navbar> */}

          <Routes>
            <Route path='/' element={<WelcomeHome />}></Route>
            <Route path='/register/:role' element={<Registration />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/forgot-password' element={<ForgotPassword />}></Route>
            <Route path='/reset-password' element={<ResetPassword />}></Route>
            <Route path='/specificregister' element={<SpecificRegister />}></Route>
            <Route path='/advertiser/dashboard/:id' element={<Dashboard />}></Route>
            <Route path="/managebookings" element={<ManageBookings />}></Route>
            <Route path="/ad-detail" element={<AdDetails />}></Route>
            <Route path="/ad-details2" element={<AdDetails2 />}></Route>
            <Route path="/advertiserprofile" element={<AdvertiserProfile />}>
              <Route path="profile" element={<PersonalInfo />} />
              <Route path='payment' element={<Payment />}></Route>
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path='/user/dashboard' element={<User />}></Route>
            <Route path="/userprofile" element={<UserProfile />}>
              <Route path="profile" element={<UserInfo/>} />
              <Route path="change-password" element={<UserChangePassword/>} />
            </Route>
            <Route path="/browseads" element={<BrowseAds />}></Route>
            <Route path="/viewdetails/:id" element={<ViewDetails />}></Route>
            <Route path="/bookings/:id" element={<BookingAds />}></Route>
            <Route path="/screenings" element={<Screens />}></Route>
            <Route path="/screenings2" element={<Screens2 />}></Route>
            <Route path="/saved-ads" element={<SavedAds />}></Route>
            <Route path="/getbookings" element={<BookedAds />}></Route>
          </Routes>
          <ToastContainer />
        </div >
      </ToastProvider>
    </LoaderProvider>
  )
}

export default App
// PANDA123!@@