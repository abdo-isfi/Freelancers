import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatDate';
import { AnimatedText } from '@/components/ui/animated-shiny-text';
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Mail, 
  Building, 
  Calendar,
  Save
} from 'lucide-react';
import Button from '@/components/Common/Button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useTranslation } from 'react-i18next';

function SettingsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'appearance', label: t('appearance'), icon: Palette },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'security', label: t('security'), icon: Shield },
  ];

  return (
    <div className="page-container">
      <div className="mb-[5px] mt-8 flex flex-col gap-4">
        <div className="text-center w-full">
          <AnimatedText 
            text={t('settings')} 
            textClassName="text-5xl font-bold text-foreground"
            className="justify-center py-2"
          />
          <p className="mt-2 text-muted-foreground">{t('manageAccountPreferences')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="card p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  {t('personalInformation')}
                </h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user?.role || 'User'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t('firstName')}</label>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-foreground">
                      {user?.firstName}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t('lastName')}</label>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-foreground">
                      {user?.lastName}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t('email')}</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border text-foreground">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {user?.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t('company')}</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border text-foreground">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      {user?.company || 'Not set'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">{t('memberSince')}</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border text-foreground">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  {t('appearance')}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                    <div>
                      <h3 className="font-medium">{t('theme')}</h3>
                      <p className="text-sm text-muted-foreground">{t('themeDesc')}</p>
                    </div>
                    <ThemeToggle />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                    <div>
                      <h3 className="font-medium">{t('language')}</h3>
                      <p className="text-sm text-muted-foreground">{t('languageDesc')}</p>
                    </div>
                    <LanguageToggle />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  {t('notificationPreferences')}
                </h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'email_notif', label: t('emailNotifications'), desc: t('emailNotificationsDesc') },
                    { id: 'push_notif', label: t('pushNotifications'), desc: t('pushNotificationsDesc') },
                    { id: 'weekly_digest', label: t('weeklyDigest'), desc: t('weeklyDigestDesc') }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                      <div>
                        <h3 className="font-medium">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {t('securitySettings')}
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <h3 className="font-medium mb-4">{t('changePassword')}</h3>
                    <div className="space-y-4 max-w-md">
                      <input 
                        type="password" 
                        placeholder={t('currentPassword')}
                        className="w-full p-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                      <input 
                        type="password" 
                        placeholder={t('newPassword')}
                        className="w-full p-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                      <div className="flex justify-end">
                        <Button variant="primary" size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          {t('updatePassword')}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                    <div>
                      <h3 className="font-medium">{t('twoFactorAuth')}</h3>
                      <p className="text-sm text-muted-foreground">{t('twoFactorAuthDesc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
