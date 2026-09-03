import React, { useState } from 'react';

export default function AccountSettingsPage({ user, onUpdateUser, initialTab = 'profile', onToast }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'password'

  // Profile state
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.phone);
  const [countryCode, setCountryCode] = useState(user.countryCode || '+91');
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup || 'O+');
  const [willingToDonate, setWillingToDonate] = useState(user.willingToDonateBlood !== false);
  const [avatar, setAvatar] = useState(user.avatar);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength logic
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-transparent' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-error' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-secondary' };
  };

  const strength = calculateStrength(newPassword);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone: mobile,
      countryCode,
      bloodGroup,
      willingToDonateBlood: willingToDonate,
      avatar
    });
    onToast({
      title: 'Profile Updated',
      message: 'Your personal information and emergency preferences have been saved.',
      type: 'success'
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      onToast({ title: 'Error', message: 'Please enter your current password.', type: 'error' });
      return;
    }
    if (newPassword.length < 8) {
      onToast({ title: 'Error', message: 'New password must be at least 8 characters long.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      onToast({ title: 'Error', message: 'New passwords do not match.', type: 'error' });
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onToast({
      title: 'Password Changed',
      message: 'Your account security credentials have been updated successfully.',
      type: 'success'
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      onToast({ title: 'Photo Selected', message: 'Profile picture updated.', type: 'info' });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header (From Bodhika UI reference) */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-2">
          <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
          Security & Preferences
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Account Settings</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Manage your personal profile details, academic identity, and security credentials.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-soft-card border border-outline-variant/30 overflow-hidden flex flex-col">
        {/* Navigation Tabs (From Page 17 & 18 screenshots) */}
        <div className="flex items-center border-b border-surface-variant px-8 pt-6 gap-8 bg-surface-container-lowest">
          <button
            onClick={() => setActiveTab('profile')}
            className={`relative pb-4 text-base font-semibold transition-colors ${
              activeTab === 'profile' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Edit Profile</span>
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`relative pb-4 text-base font-semibold transition-colors ${
              activeTab === 'password' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Change Password</span>
            {activeTab === 'password' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Tab 1: Edit Profile (Page 17) */}
        {activeTab === 'profile' && (
          <div className="p-8 space-y-8">
            {/* Student Identity Header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-variant/40">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high text-on-surface flex items-center justify-center border border-outline-variant/30 shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[24px]">person</span>
              </div>
              <div>
                <h2 className="font-bold text-base text-on-surface">{user.name}</h2>
                <div className="text-xs text-outline mt-0.5">
                  Student ID: <span className="font-mono text-on-surface font-semibold">{user.id}</span> • {user.role}
                </div>
                <div className="text-[11px] text-secondary font-medium mt-0.5">{user.department}</div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username (Read-Only) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">Username (Login Name)</label>
                  <div className="bg-surface-container h-12 rounded-xl px-4 flex items-center text-xs font-medium text-on-surface-variant cursor-not-allowed border border-surface-variant">
                    {user.username}
                  </div>
                  <span className="text-[10px] text-outline">Username cannot be changed. Contact administrator if required.</span>
                </div>

                <div className="hidden md:block"></div>

                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full bg-surface-container-low h-12 rounded-xl px-4 text-xs font-medium text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full bg-surface-container-low h-12 rounded-xl px-4 text-xs font-medium text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary"
                  />
                </div>
              </div>

              <div className="h-px bg-surface-variant/80"></div>

              {/* Contact & Medical Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">Email Address *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-surface-container-low h-12 rounded-xl pl-10 pr-4 text-xs font-medium text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary"
                    />
                  </div>
                </div>

                {/* Mobile Number with country selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">Mobile Number *</label>
                  <div className="flex bg-surface-container-low rounded-xl focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary transition-all border border-transparent focus-within:border-primary">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent pl-3 pr-2 text-xs font-semibold text-on-surface outline-none cursor-pointer border-r border-surface-variant"
                    >
                      <option value="+91">IN +91</option>
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+65">SG +65</option>
                    </select>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                      className="w-full bg-transparent h-12 px-3 text-xs font-medium text-on-surface outline-none"
                    />
                  </div>
                  <div className="text-[10px] text-secondary flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    <span>Format: 10 digits, starts with 6-9 (India) • Valid</span>
                  </div>
                </div>

                {/* Blood Group */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">
                    Blood Group <span className="text-outline font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-surface-container-low h-12 rounded-xl px-4 text-xs font-medium text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer appearance-none border border-transparent focus:border-primary"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Blood Donation Checkbox */}
              <label className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low/60 border border-surface-variant cursor-pointer group">
                <input
                  type="checkbox"
                  checked={willingToDonate}
                  onChange={(e) => setWillingToDonate(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-on-surface">
                    I'm willing to donate blood if contacted in an emergency.
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    Your contact information will be securely accessible to the campus emergency medical wing if an urgent patient match arises.
                  </span>
                </div>
              </label>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => {
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                    setEmail(user.email);
                    setMobile(user.phone);
                    onToast({ title: 'Discarded', message: 'Changes reverted.', type: 'info' });
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Change Password (Page 18) */}
        {activeTab === 'password' && (
          <div className="p-8 space-y-8">
            <div className="max-w-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Update Password</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Ensure your account uses a strong, random password to maintain academic confidentiality.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">Current Password *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                      lock
                    </span>
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full bg-surface-container-low h-12 rounded-xl pl-10 pr-10 text-xs font-medium text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showCurrent ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">New Password *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                      key
                    </span>
                    <input
                      type={showNew ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-surface-container-low h-12 rounded-xl pl-10 pr-10 text-xs font-medium text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showNew ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>

                  {/* 3-Bar Strength Indicator (From Bodhika UI reference) */}
                  <div className="pt-2">
                    <div className="flex gap-1.5 h-1">
                      <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-surface-variant'}`}></div>
                      <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-surface-variant'}`}></div>
                      <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-surface-variant'}`}></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-outline mt-1.5">
                      <span>Password Strength</span>
                      <span className="font-semibold text-on-surface">{strength.label}</span>
                    </div>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">Confirm New Password *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                      check_circle
                    </span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-surface-container-low h-12 rounded-xl pl-10 pr-10 text-xs font-medium text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showConfirm ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Password Requirements Card (From Bodhika reference) */}
                <div className="p-4 rounded-xl bg-secondary-container/20 border border-secondary-container/50 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-on-secondary-container">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                    <span>Security Checklist</span>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant text-[11px]">
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-secondary' : 'bg-outline'}`}></span>
                      Minimum 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-secondary' : 'bg-outline'}`}></span>
                      At least one uppercase character
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-secondary' : 'bg-outline'}`}></span>
                      At least one number (0-9)
                    </li>
                  </ul>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-variant">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Change Password</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
