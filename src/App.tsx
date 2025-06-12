import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AppointmentProvider } from "./contexts/AppointmentContext";
import { CustomFieldsProvider } from "./contexts/CustomFieldsContext";
import BottomNavigation from "./components/Layout/BottomNavigation";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Shop from "./pages/Shop";
import Suppliers from "./pages/Suppliers";
import BookAppointment from "./pages/BookAppointment";
import Wishlist from "./pages/Wishlist";
import Subscriptions from "./pages/Subscriptions";
import NotFound from "./pages/NotFound";
import LinkTree from "./pages/LinkTree";
import CustomFields from "./pages/CustomFields";
import { InstallPWA } from './components/InstallPWA'

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <AppointmentProvider>
          <CustomFieldsProvider>
            <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/book" element={<BookAppointment />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/custom-fields" element={<CustomFields />} />
                <Route path="/linktree" element={<LinkTree />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNavigation />
            </div>
            <Toaster />
            <Sonner />
            <InstallPWA />
            </BrowserRouter>
          </CustomFieldsProvider>
        </AppointmentProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
