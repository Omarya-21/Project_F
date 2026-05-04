import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/products', element: <Products /> },
  { path: '/products/:id', element: <ProductDetails /> },
  { path: '/cart', element: <Cart /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/profile', element: <Profile />, protected: true },
  { path: '*', element: <div className="pt-40 text-center text-red-500 font-extrabold text-9xl italic tracking-tighter uppercase stroke-white">404</div> }
];
