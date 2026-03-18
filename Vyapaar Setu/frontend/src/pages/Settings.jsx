import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { db, auth } from '../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { User, Store, Shield, Save, Check, AlertCircle } from 'lucide-react';


const Settings = () => {
  const { user, login } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  // Profile state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Business state (vendor only)
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setBusinessName(user.businessName || '');
      setBusinessCategory(user.businessCategory || '');
      setBusinessDesc(user.businessDesc || '');
      setBusinessAddress(user.businessAddress || '');
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        phone,
      });
      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      showMessage('error', err.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  const handleBusinessSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        businessName,
        businessCategory,
        businessDesc,
        businessAddress,
      });
      showMessage('success', 'Business details updated!');
    } catch (err) {
      showMessage('error', err.message || 'Failed to update business details');
    }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showMessage('success', 'Password changed successfully!');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        showMessage('error', 'Current password is incorrect.');
      } else {
        showMessage('error', err.message || 'Failed to change password');
      }
    }
    setSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    ...(user?.role === 'vendor' ? [{ id: 'business', label: 'Business Info', icon: Store }] : []),
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-brand-void text-brand-text flex items-center justify-center pt-20">
          <p className="font-mono text-brand-text/50">Please login to access settings.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-brand-void text-brand-text p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
              Settings <span className="text-brand-accent italic font-drama font-normal">&amp; Profile</span>
            </h1>
            <p className="font-mono text-sm text-brand-text/60">Manage your account, business details, and security.</p>
          </header>

          {/* Status Message */}
          {message.text && (
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 font-mono text-sm border ${message.type === 'success' ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-brand-text/10 pb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs transition-all ${activeTab === tab.id ? 'bg-brand-accent text-brand-void' : 'bg-brand-card text-brand-text/60 hover:text-brand-text border border-brand-text/10'}`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Info Tab */}
          {activeTab === 'profile' && (
            <div className="bg-brand-card rounded-2xl border border-brand-text/10 p-8">
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <User size={20} className="text-brand-accent" /> Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">FULL NAME</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">EMAIL ADDRESS</label>
                  <input type="email" value={email} disabled
                    className="w-full bg-brand-void/50 border border-brand-text/5 text-brand-text/40 p-3 rounded-lg font-sans cursor-not-allowed" />
                  <p className="font-mono text-[10px] text-brand-text/30 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">PHONE NUMBER</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">ROLE</label>
                  <div className="w-full bg-brand-void/50 border border-brand-text/5 text-brand-accent p-3 rounded-lg font-mono text-sm uppercase">
                    {user.role || 'customer'}
                  </div>
                </div>
              </div>
              <button onClick={handleProfileSave} disabled={saving}
                className="mt-8 flex items-center gap-2 bg-brand-accent text-brand-void px-6 py-3 rounded-full font-display font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50">
                <Save size={16} /> {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          )}

          {/* Business Info Tab (Vendor Only) */}
          {activeTab === 'business' && user?.role === 'vendor' && (
            <div className="bg-brand-card rounded-2xl border border-brand-text/10 p-8">
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <Store size={20} className="text-brand-accent" /> Business Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">BUSINESS NAME</label>
                  <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)}
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">CATEGORY</label>
                  <select value={businessCategory} onChange={e => setBusinessCategory(e.target.value)}
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors">
                    <option value="">Select Category</option>
                    <option value="grocery">Grocery</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="hardware">Hardware</option>
                    <option value="bakery">Bakery</option>
                    <option value="printing">Printing</option>
                    <option value="barber">Barber</option>
                    <option value="tailor">Tailor</option>
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">DESCRIPTION</label>
                  <textarea value={businessDesc} onChange={e => setBusinessDesc(e.target.value)} rows={3}
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">ADDRESS</label>
                  <input type="text" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)}
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors" />
                </div>
              </div>
              <button onClick={handleBusinessSave} disabled={saving}
                className="mt-8 flex items-center gap-2 bg-brand-accent text-brand-void px-6 py-3 rounded-full font-display font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50">
                <Save size={16} /> {saving ? 'SAVING...' : 'SAVE BUSINESS INFO'}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-brand-card rounded-2xl border border-brand-text/10 p-8">
              <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-3">
                <Shield size={20} className="text-brand-accent" /> Change Password
              </h2>
              <div className="flex flex-col gap-5 max-w-md">
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">CURRENT PASSWORD</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">NEW PASSWORD</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-brand-text/60 text-xs mb-2 block">CONFIRM NEW PASSWORD</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent transition-colors" />
                </div>
              </div>
              <button onClick={handlePasswordChange} disabled={saving}
                className="mt-8 flex items-center gap-2 bg-brand-accent text-brand-void px-6 py-3 rounded-full font-display font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50">
                <Shield size={16} /> {saving ? 'UPDATING...' : 'CHANGE PASSWORD'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
