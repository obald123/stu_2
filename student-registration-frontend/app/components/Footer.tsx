import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaReact } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-6 px-4 flex flex-col items-center mt-auto text-sm">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-yellow-300" />
          <span>Kigali, Rwanda</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-yellow-300" />
            <a href="mailto:simuoba123@gmail.com" className="hover:underline">simuoba123@gmail.com</a>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-yellow-300" />
            <a href="tel:+250789934421" className="hover:underline">+250 789 934 421</a>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span>&copy; 2025 All Rights Reserved</span>
      </div>
    </footer>
  );
}
