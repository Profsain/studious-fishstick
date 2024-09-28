import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerManager from "./scenes/customer";
import EventManager from "./scenes/event";
import EmailNotification from "./scenes/emailnotify";
import AdvertManager from "./scenes/advertisement";
import PromoCodeManager from "./scenes/promo";
import PushNotificationManager from "./scenes/pushnotify";
import SubscriptionManager from "./scenes/subscription";
import WithdrawalRequest from "./scenes/withdrawal";
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import Team from './scenes/team';
import Invoices from './scenes/invoices';
// import Bar from './scenes/bar';
import Form from './scenes/form';
// import Line from './scenes/line';
import Pie from './scenes/pie';
import FAQ from './scenes/faq';
// import Geography from './scenes/geography';
// import Calendar from './scenes/calendar/calendar';
import Login from './scenes/login';
import ForgotPassword from './scenes/forgotpassword';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import OtpVerify from './scenes/otpverify';
import EditEvent from './scenes/event/EditEvent';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Routes definition */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<OtpVerify />} />

            {/* Protected Routes */}
            <Route path="*" element={
              <ProtectedRoute>
                <>
                  <Sidebar isSidebar={isSidebar} />
                  <main className="content">
                    <Topbar setIsSidebar={setIsSidebar} />
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/customer-manager" element={<CustomerManager />} />
                      <Route path="/events" element={<EventManager />} />
                      <Route path="/advert-manager" element={<AdvertManager />} />
                      <Route path="/withdrawal" element={<WithdrawalRequest />} />
                      <Route path="/subscriptions" element={<SubscriptionManager />} />
                      <Route path="/promo-code" element={<PromoCodeManager />} />
                      <Route path="/push-notification" element={<PushNotificationManager />} />
                      <Route path="/email-notification" element={<EmailNotification />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/form" element={<Form />} />
                      {/* <Route path="/bar" element={<Bar />} /> */}
                      <Route path="/pie" element={<Pie />} />
                      {/* <Route path="/line" element={<Line />} /> */}
                      <Route path="/faq" element={<FAQ />} />
                      {/* <Route path="/calendar" element={<Calendar />} /> */}
                      {/* <Route path="/geography" element={<Geography />} /> */}
                      <Route path="/event/EditEvent/:eventId" element={<EditEvent />} />
                    </Routes>
                  </main>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
