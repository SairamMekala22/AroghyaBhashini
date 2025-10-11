import { Link } from 'react-router-dom';
import { MessageSquare, FileText, Pill, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUILanguage } from '@/contexts/UILanguageContext';

const HomePage = () => {
  const { t } = useUILanguage();

  const features = [
    {
      icon: MessageSquare,
      title: t('home.feature1.title'),
      description: t('home.feature1.desc'),
      link: '/conversation',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: FileText,
      title: t('home.feature2.title'),
      description: t('home.feature2.desc'),
      link: '/prescription',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Pill,
      title: t('home.feature3.title'),
      description: t('home.feature3.desc'),
      link: '/medications',
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <div className="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-large mb-6 mx-auto animate-in zoom-in duration-500">
              <span className="text-5xl">🏥</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground animate-in slide-in-from-bottom-4 duration-500">
            Arogyabhashini
          </h1>
          
          <p className="text-xl md:text-2xl text-primary font-semibold animate-in slide-in-from-bottom-4 duration-500 delay-100">
            {t('home.tagline')}
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500 delay-200">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <Link to="/conversation">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-large transition-all duration-200 hover:scale-105">
                <MessageSquare className="mr-2" size={20} />
                {t('home.start')}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/prescription">
              <Button size="lg" variant="outline" className="border-2 shadow-soft hover:shadow-medium transition-all duration-200">
                <FileText className="mr-2" size={20} />
                Translate Prescription
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            {t('home.features')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="h-full border-2 border-border hover:border-primary hover:shadow-large transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-medium mb-4`}>
                        <Icon className="text-white" size={28} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full justify-between hover:bg-secondary">
                        Get Started
                        <ArrowRight size={18} />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-primary text-primary-foreground shadow-large border-0">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold">10+</p>
                  <p className="text-sm md:text-base opacity-90">Indian Languages</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold">Real-time</p>
                  <p className="text-sm md:text-base opacity-90">Translation</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl md:text-5xl font-bold">24/7</p>
                  <p className="text-sm md:text-base opacity-90">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
