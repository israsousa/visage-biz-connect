
import React from 'react';
import { Instagram, ExternalLink, MapPin, Phone, Mail, Clock } from 'lucide-react';

const LinkTree = () => {
  const links = [
    {
      title: "Agende seu Horário",
      description: "Reserve já o seu atendimento",
      url: "/book",
      icon: Clock,
      gradient: "from-purple-500 to-pink-500",
      isInternal: true
    },
    {
      title: "Nossa Loja Online",
      description: "Produtos de beleza selecionados",
      url: "/shop",
      icon: ExternalLink,
      gradient: "from-pink-500 to-orange-400",
      isInternal: true
    },
    {
      title: "WhatsApp",
      description: "Fale conosco diretamente",
      url: "https://wa.me/5511999999999",
      icon: Phone,
      gradient: "from-green-500 to-emerald-600",
      isInternal: false
    },
    {
      title: "Localização",
      description: "Encontre nosso salão",
      url: "https://maps.google.com",
      icon: MapPin,
      gradient: "from-blue-500 to-cyan-500",
      isInternal: false
    },
    {
      title: "Email",
      description: "contato@beautybiz.com",
      url: "mailto:contato@beautybiz.com",
      icon: Mail,
      gradient: "from-indigo-500 to-purple-600",
      isInternal: false
    }
  ];

  const handleLinkClick = (url: string, isInternal: boolean) => {
    if (isInternal) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-20">
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-6">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Instagram className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">@beautybiz</h1>
        <p className="text-gray-600 max-w-sm mx-auto">
          Seu salão de beleza favorito ✨ Cabelo, unha e estética em um só lugar
        </p>
      </div>

      {/* Links */}
      <div className="px-6 space-y-4">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <button
              key={index}
              onClick={() => handleLinkClick(link.url, link.isInternal)}
              className={`w-full p-4 bg-white rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${link.gradient} flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 px-6">
        <p className="text-gray-500 text-sm">
          Powered by BeautyBiz
        </p>
      </div>
    </div>
  );
};

export default LinkTree;
