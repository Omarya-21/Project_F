import React from 'react';
import { Cpu, Github, Twitter, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Cpu className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                    NEXUS<span className="text-blue-600">PC</span>
                </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for high-end PC hardware and professional builds. 
              We empower gamers and creators with the best tech in the market.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/products" className="hover:text-blue-500 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=CPU" className="hover:text-blue-500 transition-colors">Processors</Link></li>
              <li><Link to="/products?category=GPU" className="hover:text-blue-500 transition-colors">Graphics Cards</Link></li>
              <li><Link to="/cart" className="hover:text-blue-500 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-slate-500">Add:</span>
                <span>123 Tech Avenue, Silicon Valley, CA 94025</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-slate-500">Tel:</span>
                <span>+1 (555) 000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-slate-500">Email:</span>
                <span>support@nexuspc.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© 2024 NexusPC. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="underline decoration-slate-700 underline-offset-4 hover:text-white">Privacy Policy</a>
            <a href="#" className="underline decoration-slate-700 underline-offset-4 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
