import {
  FaBars,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaExchangeAlt,
  FaTimes,
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/vidaripay-logo-full.png';
import log from '../assets/Vidaripay-logo-icon.png';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: FaChartLine },
    { name: 'Transactions', path: '/transactions', icon: FaExchangeAlt },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg lg:hidden"
        >
          <FaBars className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-white shadow-xl transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            {!isCollapsed && (
              <img 
                src={logo} 
                alt="VidariPay Logo" 
                className="h-7 w-auto transition-opacity duration-300"
              />
            )}
            {isCollapsed && (
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                <img src={log} alt="VidariPay Logo Icon" className="h-5 w-5" />
              </div>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 lg:block"
            >
              {isCollapsed ? (
                <FaChevronRight className="h-4 w-4" />
              ) : (
                <FaChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? 'bg-linear-to-r from-primary-50 to-secondary-50 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.name : ''}
                    >
                      <Icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} shrink-0`} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-50 to-secondary-50 text-white">
                  <span className="text-sm font-semibold">VN</span>
                </div>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">Vendor Name</p>
                    <p className="truncate text-xs text-gray-500">vendor@vidaripay.com</p>
                  </div>
                )}
              </div>
              
              {isMobileOpen && (
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 lg:hidden"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
