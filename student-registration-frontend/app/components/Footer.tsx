import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaReact } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 py-4 px-2 flex flex-col items-center mt-auto text-gray-700 text-sm">
      <div className="flex items-center gap-2 mb-1">
        <FaMapMarkerAlt className="text-indigo-600" /> Kigali, Rwanda
      </div>
      <div className="flex items-center gap-2 mb-1">
        <FaEnvelope className="text-indigo-600" /> simuoba123@gmail.com
        <FaPhoneAlt className="ml-4 text-indigo-600" /> +250 789 934 421
      </div>
      <div className="flex items-center gap-2 mt-1">
        <FaReact className="text-blue-500 animate-spin-slow" />
        <span>Built with Next.js &amp; React by obald &copy; 2025</span>
      </div>
    </footer>
  );
}
