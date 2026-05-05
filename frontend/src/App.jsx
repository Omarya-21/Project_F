import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Products from './pages/Products';
import CategoryProducts from './pages/CategoryProducts';
import CPUPage from './pages/store/CPU';
import GPUPage from './pages/store/GPU';
import RamPage from './pages/store/Ram';
import RomPage from './pages/store/Rom';
import PSUPage from './pages/store/PSU';
import CasesPage from './pages/store/Cases';
import ScreensPage from './pages/store/Screens';
import MousesPage from './pages/store/Mouses';
import KeyboardsPage from './pages/store/Keyboards';
import GamingChairsPage from './pages/store/GamingChairs';
import PcTablesPage from './pages/store/PcTables';
import HeadphonesPage from './pages/store/Headphones';
import ControllersPage from './pages/store/Controllers';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import Dashboard from './admin/Dashboard';
import ProductsAdmin from './admin/ProductsAdmin';
import UsersAdmin from './admin/UsersAdmin';
import OrdersAdmin from './admin/OrdersAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/category/:categoryName" element={<CategoryProducts />} />
                <Route path="/store/cpu" element={<CPUPage />} />
                <Route path="/store/gpu" element={<GPUPage />} />
                <Route path="/store/ram" element={<RamPage />} />
                <Route path="/store/rom" element={<RomPage />} />
                <Route path="/store/psu" element={<PSUPage />} />
                <Route path="/store/cases" element={<CasesPage />} />
                <Route path="/store/screens" element={<ScreensPage />} />
                <Route path="/store/mouses" element={<MousesPage />} />
                <Route path="/store/keyboards" element={<KeyboardsPage />} />
                <Route path="/store/gaming-chairs" element={<GamingChairsPage />} />
                <Route path="/store/pc-tables" element={<PcTablesPage />} />
                <Route path="/store/headphones" element={<HeadphonesPage />} />
                <Route path="/store/controllers" element={<ControllersPage />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedRoute adminOnly={true}>
                    <ProductsAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute adminOnly={true}>
                    <UsersAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute adminOnly={true}>
                    <OrdersAdmin />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <AIAssistant />
            <CookieBanner />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
