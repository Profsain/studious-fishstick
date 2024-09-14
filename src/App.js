import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import Geography from './scenes/geography';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Calendar from './scenes/calendar/calendar';
import TeamManager from './scenes/teamManager';
import CustomerManager from './scenes/customerManager';
import EventsManager from './scenes/eventsManager';
import AdvertManager from './scenes/advertManager';
import WithdrawalRequest from './scenes/withdrawalRequest';
import SubscriptionManager from './scenes/subscriptionManager';
import PromoManager from './scenes/promoManager';
import PushNotification from './scenes/pushNotification';
import EmailNotification from './scenes/emailNotification';
import CookieConsent from './components/CookieConsent';
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              {/* Existing routes */}
              <Route path="/" element={<Dashboard />} />
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
              <Route path="/team-manager" element={<TeamManager />} />
              <Route path="/customer-manager" element={<CustomerManager />} />
              <Route path="/events-manager" element={<EventsManager />} />
              <Route path="/advert-manager" element={<AdvertManager />} />
              <Route path="/withdrawal-request" element={<WithdrawalRequest />} />
              <Route path="/subscription-manager" element={<SubscriptionManager />} />
              <Route path="/promo-manager" element={<PromoManager />} />
              <Route path="/push-notification" element={<PushNotification />} />
              <Route path="/email-notification" element={<EmailNotification />} />
            </Routes>
            <CookieConsent /> 
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;