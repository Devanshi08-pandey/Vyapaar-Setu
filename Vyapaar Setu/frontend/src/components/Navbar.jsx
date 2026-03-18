import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { Moon, Sun, Globe, LogOut, ShoppingCart, Settings, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, changeLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-brand-void/80 backdrop-blur-md border-b border-brand-text/10 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-display font-bold text-xl text-brand-text display-flex">
          <div className='flex'><h1 className='text-yellow-600'>Vyapaar</h1>
          <h1 className='text-white-600'>Setu</h1></div>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/marketplace" className="font-mono text-xs text-brand-text/60 hover:text-brand-accent transition-colors">Products</Link>
          <Link to="/services" className="font-mono text-xs text-brand-text/60 hover:text-brand-accent transition-colors">Services</Link>
          <Link to="/ai-customize" className="font-mono text-xs text-brand-text/60 hover:text-brand-accent transition-colors flex items-center gap-1">
            <Sparkles size={12} /> Customize
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => changeLanguage(language === 'en' ? 'hi' : 'en')} className="flex items-center gap-1.5 text-xs text-brand-text/70 hover:text-brand-accent transition-colors">
          <Globe size={16} /> {language.toUpperCase() === 'EN' ? 'HI' : 'EN'}
        </button>
        <button onClick={toggleTheme} className="text-brand-text/70 hover:text-brand-accent transition-colors">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <Link to="/cart" className="relative text-brand-text/70 hover:text-brand-accent transition-colors">
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-void text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/settings" className="text-brand-text/70 hover:text-brand-accent transition-colors">
              <Settings size={16} />
            </Link>
            <Link to={user.role === 'vendor' ? '/vendor-dashboard' : '/dashboard'} className="text-xs font-mono text-brand-text/80 hover:text-brand-accent">
              {(user.name || user.displayName || user.email?.split('@')[0] || 'USER').toUpperCase()}
            </Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-xs font-mono text-brand-text/80 hover:text-brand-accent transition-colors">
              {t('nav_login') ? t('nav_login').toUpperCase() : 'LOGIN'}
            </Link>
            <Link to="/register" className="bg-brand-accent text-brand-void px-3 py-1.5 rounded-full font-display font-semibold text-xs hover:scale-105 transition-transform">
              {t('nav_register') ? t('nav_register').toUpperCase() : 'REGISTER'}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

