import { Link, NavLink } from 'react-router';
import { Button } from './ui/Button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary-600">
              UC<span className="text-secondary-500">OB</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-gray-600'}`} end>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
                About
              </NavLink>

              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button could be added here */}
        </div>
      </div>
    </nav>
  );
}
