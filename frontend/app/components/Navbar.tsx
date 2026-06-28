import { Link, NavLink, useNavigate } from 'react-router';
import { Button } from './ui/Button';
import { useEffect, useState, useRef } from 'react';
import { getMe, logout } from '../lib/api';
import { User, LogOut, ChevronDown } from 'lucide-react';

interface UserType {
  username: string;
  role: string;
}

export function Navbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary-600">
              UC<span className="text-secondary-500">OB</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6 md:space-x-8">
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-gray-600'}`} end>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
                About
              </NavLink>
            </div>

            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="hidden sm:block">
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-inner">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="hidden flex-col items-start md:flex">
                      <span className="text-xs font-bold text-gray-900 leading-tight">{user.username}</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-500 leading-tight mt-0.5">{user.role}</span>
                    </div>
                    <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 animate-fade-in animate-slide-up duration-200">
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Lihat Profil
                      </Link>
                      <div className="my-1 border-t border-gray-100"></div>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white ${
          isMobileMenuOpen ? 'max-h-64 border-t border-gray-100' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 space-y-4 shadow-lg">
          <NavLink to="/" className={({ isActive }) => `block text-base font-medium ${isActive ? 'text-primary-600' : 'text-gray-600'}`} onClick={() => setIsMobileMenuOpen(false)} end>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `block text-base font-medium ${isActive ? 'text-primary-600' : 'text-gray-600'}`} onClick={() => setIsMobileMenuOpen(false)}>
            About
          </NavLink>
          <Link to="/dashboard" className="block" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
