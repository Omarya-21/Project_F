import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl font-black text-white mb-6 uppercase italic leading-none">Get in <span className="text-blue-500">Touch</span></h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md">
            Have questions about a build? Our elite technicians are ready to help you optimize your setup.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Email Us</h4>
                <p className="text-gray-400 text-sm">support@omarspc.com</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Call Us</h4>
                <p className="text-gray-400 text-sm">+1 (555) 012-3456</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Visit Lab</h4>
                <p className="text-gray-400 text-sm">123 Tech Avenue, Silicon Valley, CA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
          
          <form className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">FullName</label>
              <input 
                type="text" 
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="John Wick"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Message</label>
              <textarea 
                rows="4"
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Tell us about your dream build..."
              ></textarea>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all group italic uppercase">
              Deploy Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
