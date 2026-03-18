import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'vendor') {
        navigate('/vendor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-void p-6">
      <div className="bg-brand-card p-8 rounded-2xl w-full max-w-md border border-brand-accent/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <h2 className="font-display text-3xl font-bold text-brand-text mb-6 text-center">{t('login')}</h2>
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 font-mono text-sm">{error}</div>}
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-brand-text/60 text-xs mb-1 block">{t('login_email')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded font-sans focus:outline-none focus:border-brand-accent" />
          </div>
          <div>
            <label className="font-mono text-brand-text/60 text-xs mb-1 block">{t('login_password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded font-sans focus:outline-none focus:border-brand-accent" />
          </div>
          <button type="submit" className="w-full bg-brand-accent text-brand-void font-bold py-3 mt-4 rounded hover:bg-white transition-colors">
            {t('login_submit')}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-2 text-center font-mono text-xs">
          <p className="text-brand-text/50">
            {t('login_new_user')} <Link to="/register" className="text-brand-accent hover:underline">{t('login_register_link')}</Link>
          </p>
          <p className="text-brand-text/30">
            ARE YOU A VENDOR? <Link to="/vendor-signup" className="text-brand-accent font-bold hover:underline">JOIN THE NETWORK</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
