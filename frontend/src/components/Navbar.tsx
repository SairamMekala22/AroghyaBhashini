import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, FileText, Pill, Languages } from 'lucide-react';
import { useUILanguage } from '@/contexts/UILanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Navbar = () => {
  const location = useLocation();
  const { uiLanguage, setUILanguage, t } = useUILanguage();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/conversation', icon: MessageSquare, label: t('nav.conversation') },
    { path: '/prescription', icon: FileText, label: t('nav.prescription') },
    { path: '/medications', icon: Pill, label: t('nav.medications') },
  ];

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-medium">
              <span className="text-2xl">🏥</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">Arogyabhashini</span>
              <span className="text-xs text-muted-foreground">Breaking Language Barriers</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            <Select value={uiLanguage} onValueChange={(value) => setUILanguage(value as 'en' | 'hi' | 'te')}>
              <SelectTrigger className="w-[140px] border-2">
                <Languages size={16} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-around pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
