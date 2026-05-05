export default function Privacy() {
  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-400 leading-relaxed">
      <h1 className="text-4xl font-black text-white mb-8 uppercase italic">Privacy <span className="text-blue-500">Policy</span></h1>
      <p className="mb-6">Last updated: May 2026</p>
      
      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">1. Information Collection</h2>
        <p className="mb-4">
          At Omar's PC, we collect information to provide better services to all our users. This includes technical data about your build requirements when you interact with our AI Assistant, as well as account information needed for orders.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">2. How We Use Data</h2>
        <p className="mb-4">
          Data is used to facilitate orders, improve our product recommendations, and ensure compatibility during the build process. We do not sell your personal data to third parties.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">3. Security</h2>
        <p className="mb-4">
          We implement military-grade encryption and security protocols to protect your information and transactions from unauthorized access.
        </p>
      </section>
    </div>
  );
}
