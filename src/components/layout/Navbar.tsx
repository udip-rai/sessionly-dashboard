import { useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();
  const isExpertDashboard = location.pathname.startsWith('/expert-dashboard');

  const navLinks = isExpertDashboard
    ? [
        { href: '#', label: 'About Sessionly' },
        { href: '#', label: 'FAQs' },
      ]
    : [
        { href: '#', label: 'For Experts' },
        { href: '#', label: 'Browse Experts' },
        { href: '#', label: 'About Sessionly' },
        { href: '#', label: 'FAQs' },
      ];

  return (
    <nav className="bg-navy shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-logo font-kavoon text-white">Sessionly</span>
          </div>
          <div className="flex items-center space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}