import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { getOilPrice, getOilStock, getMe, logout } from '../lib/api';
import { Droplet, TrendingUp, TrendingDown, User, LogOut, ChevronDown, Activity } from 'lucide-react';

interface UserType {
  username: string;
  role: string;
}

export function DashboardHeader() {
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [user, setUser] = useState<UserType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [buyRes, sellRes, stockRes] = await Promise.all([getOilPrice('Buy'), getOilPrice('Sell'), getOilStock()]);
      setBuyPrice(buyRes.data?.price_per_liter || 0);
      setSellPrice(sellRes.data?.price_per_liter || 0);
      setStock(stockRes.data?.delta || 0);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    getMe()
      .then((res) => setUser(res.data))
      .catch(console.error);

    // 30s interval for stats
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
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
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-white/80 px-6 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      {/* Realtime Ticker Area */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 w-full mr-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 shadow-sm transition-transform hover:scale-105 shrink-0">
          <div className="bg-blue-100 p-1.5 rounded-full">
            <Droplet className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600/70 leading-none mb-0.5">Stok Tersedia</span>
            <span className="text-sm font-extrabold text-blue-900 leading-tight">{stock.toLocaleString('id-ID')} L</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100 shadow-sm transition-transform hover:scale-105 shrink-0">
          <div className="bg-emerald-100 p-1.5 rounded-full">
            <TrendingDown className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/70 leading-none mb-0.5">Harga Beli Minyak</span>
            <span className="text-sm font-extrabold text-emerald-900 leading-tight">Rp {buyPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-100 shadow-sm transition-transform hover:scale-105 shrink-0">
          <div className="bg-amber-100 p-1.5 rounded-full">
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600/70 leading-none mb-0.5">Harga Jual Minyak</span>
            <span className="text-sm font-extrabold text-amber-900 leading-tight">Rp {sellPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 animate-pulse ml-2 shrink-0">
          <Activity className="w-3.5 h-3.5" /> LIVE
        </div>
      </div>

      {/* User Dropdown */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 rounded-full border border-gray-200 bg-white p-1 pr-4 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-inner">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden flex-col items-start md:flex">
            <span className="text-sm font-bold text-gray-900 leading-tight">{user ? user.username : 'Loading...'}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 leading-tight mt-0.5">{user ? user.role : ''}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 mb-1 md:hidden border-b border-gray-100">
              <span className="block text-sm font-bold text-gray-900">{user?.username}</span>
              <span className="block text-xs text-gray-500">{user?.role}</span>
            </div>
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
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
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
