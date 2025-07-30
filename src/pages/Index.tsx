
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeTab, setActiveTab] = useState('portraits');

  const tabs = [
    { id: 'portraits', label: 'PORTRAITS' },
    { id: 'commissions', label: 'COMMISSIONS' },
    { id: 'documentary', label: 'DOCUMENTARY' },
    { id: 'about', label: 'ABOUT + CONTACT' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'portraits':
        return <PortraitsSection />;
      case 'commissions':
        return <CommissionsSection />;
      case 'documentary':
        return <DocumentarySection />;
      case 'about':
        return <AboutSection />;
      default:
        return <PortraitsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="text-center py-12 border-b border-gray-200">
        <h1 className="text-3xl font-light tracking-[0.2em] mb-8">MAXWELL ANDOH</h1>
        
        {/* Navigation */}
        <nav className="flex justify-center space-x-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-light tracking-wider transition-colors hover:text-gray-600 ${
                activeTab === tab.id ? 'text-black border-b border-black pb-1' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="animate-fade-in-up">
        {renderContent()}
      </main>
    </div>
  );
};

const PortraitsSection = () => {
  const images = [
    { 
      id: 1, 
      src: "/lovable-uploads/15059ab6-8266-45d5-b88b-312ccb05c1a7.png",
      title: "Studio Portrait I" 
    },
    { 
      id: 2, 
      src: "/lovable-uploads/a447fd4c-084f-40ed-b666-e920bd3595ef.png",
      title: "Studio Portrait II" 
    },
    { 
      id: 3, 
      src: "/lovable-uploads/9e109dd0-b37d-4a63-9f4c-07d6c37f7b24.png",
      title: "Studio Portrait III" 
    },
    { 
      id: 4, 
      src: "/lovable-uploads/5c566acc-db00-4142-9d10-45fb2f698421.png",
      title: "Fashion Portrait I" 
    },
    { 
      id: 5, 
      src: "/lovable-uploads/1aa6af43-e4ab-46b0-8838-2dc30838e4ea.png",
      title: "Fashion Portrait II" 
    },
    { 
      id: 6, 
      src: "/lovable-uploads/2b94da22-7da5-4ce5-9007-92f208a95415.png",
      title: "Fashion Portrait III" 
    },
  ];

  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image) => (
            <div key={image.id} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 image-hover overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CommissionsSection = () => {
  const projects = [
    { 
      id: 1, 
      title: "Studio Portraits", 
      client: "Private Client",
      src: "/lovable-uploads/15059ab6-8266-45d5-b88b-312ccb05c1a7.png"
    },
    { 
      id: 2, 
      title: "Fashion Editorial", 
      client: "Fashion Brand",
      src: "/lovable-uploads/5c566acc-db00-4142-9d10-45fb2f698421.png"
    },
    { 
      id: 3, 
      title: "Creative Portraits", 
      client: "Art Direction",
      src: "/lovable-uploads/e86d93aa-4f83-4f81-a11a-c9af1794f149.png"
    },
    { 
      id: 4, 
      title: "Artistic Series", 
      client: "Gallery Commission",
      src: "/lovable-uploads/7cb5b9f0-b410-45d9-af08-0dfff7aed012.png"
    },
  ];

  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project) => (
            <div key={project.id} className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-100 image-hover overflow-hidden mb-4">
                <img 
                  src={project.src} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-light mb-1">{project.title}</h3>
                <p className="text-gray-500 text-sm tracking-wide">{project.client}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DocumentarySection = () => {
  const series = [
    { 
      id: 1, 
      title: "Portrait Studies", 
      description: "Contemporary portraiture exploring identity and expression",
      src: "/lovable-uploads/9c28429f-1037-4299-8c7d-d403a1a7dd61.png"
    },
    { 
      id: 2, 
      title: "Light & Shadow", 
      description: "Dramatic lighting techniques in portrait photography",
      src: "/lovable-uploads/7cb5b9f0-b410-45d9-af08-0dfff7aed012.png"
    },
    { 
      id: 3, 
      title: "Urban Portraits", 
      description: "Street photography meets studio aesthetics",
      src: "/lovable-uploads/a447fd4c-084f-40ed-b666-e920bd3595ef.png"
    },
  ];

  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-16">
          {series.map((item) => (
            <div key={item.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-[5/3] bg-gray-100 image-hover overflow-hidden">
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-light tracking-wide">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                <Button variant="outline" className="mt-4 bg-transparent border-black text-black hover:bg-black hover:text-white">
                  View Series
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-16 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="aspect-[3/4] bg-gray-100 image-hover overflow-hidden">
              <img 
                src="/lovable-uploads/9c28429f-1037-4299-8c7d-d403a1a7dd61.png" 
                alt="Self Portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-light tracking-wide mb-6">About</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Photographer specializing in portraiture, documentary, and commissioned work. 
                  Based between urban landscapes and cultural narratives, I capture authentic 
                  moments that tell compelling stories.
                </p>
                <p>
                  My work focuses on the intersection of humanity and environment, exploring 
                  how individuals relate to their surroundings and communities.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-light tracking-wide mb-4">Enquiries</h3>
              <div className="space-y-2 text-gray-600">
                <a href="" className="block hover:text-gray-800 transition-colors">hello@photographer.com</a>
                <p>+1 (555) 123-4567</p>
                <p>Available for commissions worldwide</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-light tracking-wide mb-4">Socials</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <a href="" className="block hover:text-gray-800 transition-colors">• Instagram</a>
                <a href="" className="block hover:text-gray-800 transition-colors">• Twitter</a>
                <a href="" className="block hover:text-gray-800 transition-colors">• LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
