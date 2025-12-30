import { Calendar, Users, Sparkles, CheckCircle } from 'lucide-react';

const AuthLayout = ({ children, type = 'login' }) => {
  const features = [
    {
      icon: Calendar,
      title: 'Create Events',
      description: 'Easily create and manage your events with our intuitive platform'
    },
    {
      icon: Users,
      title: 'Connect with Others',
      description: 'RSVP to events and meet people with similar interests'
    },
    {
      icon: Sparkles,
      title: 'Smart Features',
      description: 'AI-powered descriptions and smart event recommendations'
    },
    {
      icon: CheckCircle,
      title: 'Easy Management',
      description: 'Track attendees, manage capacity, and update events in real-time'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <Calendar className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">EventHub</h1>
                <p className="text-indigo-200 text-sm">Your Event Platform</p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                {type === 'login' 
                  ? 'Welcome back to your events' 
                  : 'Start your event journey today'}
              </h2>
              <p className="text-indigo-200 text-lg">
                {type === 'login'
                  ? 'Log in to manage your events and connect with your community'
                  : 'Join thousands of users creating amazing events'}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-indigo-200 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="relative z-10 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
            <div>
              <p className="text-3xl font-bold text-white mb-1">10K+</p>
              <p className="text-indigo-200 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">50K+</p>
              <p className="text-indigo-200 text-sm">Events Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">98%</p>
              <p className="text-indigo-200 text-sm">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EventHub</h1>
              </div>
            </div>

            {/* Form Container */}
            <div className="w-full">
              {children}
            </div>

            {/* Mobile Features - Simplified */}
            <div className="lg:hidden mt-12 space-y-4">
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Why choose EventHub?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {features.slice(0, 4).map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <p className="text-xs text-gray-600">{feature.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none lg:hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" fillOpacity="0.1"/>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#4F46E5"/>
              <stop offset="100%" stopColor="#7C3AED"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default AuthLayout;