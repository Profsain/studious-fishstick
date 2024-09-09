
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import CustomerManager from "./scenes/customer";
import EventManager from "./scenes/event";
import EmailNotification from "./scenes/emailnotify";
import AdvertManager from "./scenes/advertisement";
import PromoCodeManager from "./scenes/promo";
import PushNotificationManager from "./scenes/pushnotify";
import SubscriptionManager from "./scenes/subscription";
import WithdrawalRequest from "./scenes/withdrawal";
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './scenes/login';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import Team from './scenes/team';
import Invoices from './scenes/invoices';
import Contacts from './scenes/contacts';
import Bar from './scenes/bar';
import Form from './scenes/form';
import Line from './scenes/line';
import Pie from './scenes/pie';
import FAQ from './scenes/faq';
import Blank from './scenes/blank';
import Adverts from './scenes/adverts';
import Events from './scenes/events';
import Payments from './scenes/payments';
import Profile from './scenes/profile';
import Geography from './scenes/geography';
import Calendar from './scenes/calendar/calendar';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import { useAuth } from './context/AuthContext'; // Import the custom hook

// AppLayout Component for Protected Routes
const AppLayout = () => {
  const [isSidebar, setIsSidebar] = useState(true);
  const { user, setUser } = useContext(AuthContext); // Access setUser from context

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setUser({ username: 'user' }); // Replace 'user' with appropriate user data
    }
  }, [setUser]); // Add setUser to the dependency array
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        {user ? ( // Conditionally render routes if user exists
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/line" element={<Line />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/geography" element={<Geography />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/adverts" element={<Adverts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
          </Routes>
        ) : (
          <Navigate to="/login" /> // Redirect to login if no user
        )}
      </main>
    </div>
  );
};


// Main App Component
function App() {
  const [theme, colorMode] = useMode();
  const { user } = useAuth(); // Use the custom hook

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
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
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
