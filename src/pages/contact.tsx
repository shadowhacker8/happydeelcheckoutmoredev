import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
                <p className="text-gray-600 mb-8">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-transparent"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#0046be] hover:bg-[#003494] text-white font-medium py-3 rounded-lg transition-colors duration-300"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <MapPin className="h-6 w-6 text-[#0046be] mt-1" />
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">Our Location</h3>
                          <p className="text-gray-600 mt-1">1726 Parsons Ave, Columbus, OH 43207, USA</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone className="h-6 w-6 text-[#0046be] mt-1" />
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">Phone</h3>
                          <p className="text-gray-600 mt-1">+17176484487</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="h-6 w-6 text-[#0046be] mt-1" />
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">Email</h3>
                          <p className="text-gray-600 mt-1">support@happydeel.com</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-medium text-gray-900 mb-2">Business Hours</h3>
                        <ul className="text-gray-600 space-y-1">
                          <li>Monday - Friday: 9:00 AM - 5:00 PM EST</li>
                          <li>Saturday: 10:00 AM - 3:00 PM EST</li>
                          <li>Sunday: Closed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Your message has been sent successfully!
        </div>
      )}
    </div>
  );
};

export default ContactPage;