import { useState } from 'react';
import { Button } from "@/components/ui/button";
import ImageGallery from "@/components/ImageGallery";
import AlbumView from "@/components/AlbumView";

const Index = () => {
  const [activeTab, setActiveTab] = useState('portraits');

  const tabs = [
    { id: 'portraits', label: 'PORTRAITS' },
    { id: 'clients', label: 'PRODUCT PHOTOGRAPHY' },
    { id: 'stories', label: 'VISUAL STORIES' },
    { id: 'info', label: 'INFO + CONTACT' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'portraits':
        return <PortraitsSection />;
      case 'clients':
        return <ClientsSection />;
      case 'stories':
        return <StoriesSection />;
      case 'info':
        return <InfoSection />;
      default:
        return <PortraitsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="text-center py-4 md:py-6 border-b border-gray-200 px-2">
        <h1 className="text-lg md:text-2xl font-light tracking-[0.2em] mb-3 md:mb-6">MAXWELL ANDOH</h1>
        
        {/* Navigation */}
        <nav className="flex justify-center flex-wrap gap-1 md:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[10px] md:text-xs font-light tracking-wider transition-all duration-300 hover:text-gray-600 relative group px-1 py-1 ${
                activeTab === tab.id 
                  ? 'text-black' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="whitespace-nowrap">{tab.label}</span>
              <div className={`absolute bottom-[-6px] left-0 w-full h-0.5 bg-black transform origin-left transition-all duration-300 ${
                activeTab === tab.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
              }`} />
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="animate-fade-in-up">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="text-center py-6 md:py-8 text-gray-500 text-xs md:text-sm border-t border-gray-200 px-4">
        <p>© 2025 Maxwell Andoh. All rights reserved.</p>
      </footer>
    </div>
  );
};

const PortraitsSection = () => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    { 
      id: 1, 
      src: "/lovable-uploads/73d7bd78-7241-4fb9-bf56-b8045ffb3e73.png",
      title: "Portrait I" 
    },
    { 
      id: 2, 
      src: "/lovable-uploads/4f5b6963-004f-4d29-babe-58205ed6882a.png",
      title: "Portrait II" 
    },
    { 
      id: 3, 
      src: "/lovable-uploads/fdc70fed-f854-42ce-9822-1b13f91c417f.png",
      title: "Portrait III" 
    },
    { 
      id: 4, 
      src: "/lovable-uploads/63045bc9-d8e9-45af-8c9e-4984fb99d16e.png",
      title: "Portrait IV" 
    },
    { 
      id: 5, 
      src: "/lovable-uploads/b64392d8-4c42-4d33-a18f-818a574c0aeb.png",
      title: "Portrait V" 
    },
    { 
      id: 6, 
      src: "/lovable-uploads/ef8330eb-e897-456e-9798-f9c70d955c75.png",
      title: "Portrait VI" 
    },
    { 
      id: 7, 
      src: "/lovable-uploads/1764c3ed-2154-465c-a523-e4270a15e96f.png",
      title: "Portrait VII" 
    },
  ];

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <section className="py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="group cursor-pointer"
              onClick={() => openGallery(index)}
            >
              <div className="aspect-[3/4] bg-gray-100 image-hover overflow-hidden rounded-lg">
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageGallery
        images={images}
        currentIndex={currentImageIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </section>
  );
};

const ClientsSection = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  
  const albums = [
    { 
      id: 1, 
      title: "Nova's", 
      client: "Fashion Brand",
      src: "/lovable-uploads/2cb8f8fa-73d5-4fdf-9073-c8b1c5a11bf0.png",
      images: [
        { id: 1, src: "/lovable-uploads/2cb8f8fa-73d5-4fdf-9073-c8b1c5a11bf0.png", title: "Nova's Product Collection" },
        { id: 2, src: "/lovable-uploads/e3942921-08e4-42e7-818d-57b55b2edcda.png", title: "Nova's Portrait 1" },
        { id: 3, src: "/lovable-uploads/cf23df2c-e261-4d59-b972-b6f7ded3049d.png", title: "Nova's Portrait 2" },
        { id: 4, src: "/lovable-uploads/aa081a12-6fbe-40d8-a727-67c92f3f90c9.png", title: "Nova's Portrait 3" },
        { id: 5, src: "/lovable-uploads/23c3a8bf-43da-4427-aa52-d9536c8df310.png", title: "Nova's Portrait 4" },
        { id: 6, src: "/lovable-uploads/86fccd73-3e96-45ac-b794-0814e20bddb6.png", title: "Nova's Portrait 5" },
        { id: 7, src: "/lovable-uploads/49e5f23e-61cf-4719-89cd-17dfdb6d71f1.png", title: "Nova's Product Detail" },
      ]
    },
    { 
      id: 2, 
      title: "Tiger Nut Milk", 
      client: "Product Photography",
      src: "/lovable-uploads/a143bcca-ddaa-4dfc-bfe7-8ec2ea9edf01.png",
      images: [
        { id: 22, src: "/lovable-uploads/a143bcca-ddaa-4dfc-bfe7-8ec2ea9edf01.png", title: "Tiger Nut Milk Product Shot 1" },
        { id: 23, src: "/lovable-uploads/f18cd41c-e876-4a4d-827a-0c092c50dd22.png", title: "Tiger Nut Milk Product Shot 2" },
      ]
    },
    { 
      id: 3, 
      title: "Portrait Studio Sessions", 
      client: "Personal Project",
      src: "/lovable-uploads/b7a60df7-e0e9-4d47-8230-6aaf6e48e027.png",
      images: [
        { id: 8, src: "/lovable-uploads/b7a60df7-e0e9-4d47-8230-6aaf6e48e027.png", title: "Studio Portrait 1" },
        { id: 9, src: "/lovable-uploads/0f349b35-32e2-4fb3-bb06-5e3b06ccc43e.png", title: "Studio Portrait 2" },
        { id: 10, src: "/lovable-uploads/22cdd75b-25fd-4aec-adf6-9f3e6860a892.png", title: "Studio Portrait 3" },
      ]
    },
    { 
      id: 4, 
      title: "Event & Lifestyle", 
      client: "Creative Documentation",
      src: "/lovable-uploads/42abf876-d500-459b-8abf-4a77972b4263.png",
      images: [
        { id: 11, src: "/lovable-uploads/42abf876-d500-459b-8abf-4a77972b4263.png", title: "Event Photography 1" },
        { id: 12, src: "/lovable-uploads/43dc3cd1-ef77-49e0-9751-8a654d1c784f.png", title: "Event Photography 2" },
        { id: 13, src: "/lovable-uploads/03d0c086-db24-433a-ab39-66817798b7a8.png", title: "Event Photography 3" },
        { id: 14, src: "/lovable-uploads/c4c47fed-ca17-4705-9228-e31650aec0b3.png", title: "Event Photography 4" },
        { id: 15, src: "/lovable-uploads/7faa4ba1-2bb1-41bb-bd38-8ebe3b1e9d46.png", title: "Event Photography 5" },
        { id: 16, src: "/lovable-uploads/420c760d-aaaf-4d39-89df-b8a0a1947eff.png", title: "Event Photography 6" },
        { id: 17, src: "/lovable-uploads/0455bbbc-12d2-4a85-b4ff-56757e263d62.png", title: "Event Photography 7" },
      ]
    },
  ];

  if (selectedAlbum) {
    return <AlbumView album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  return (
    <section className="py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {albums.map((album) => (
            <div 
              key={album.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedAlbum(album)}
            >
              <div className="aspect-[4/3] bg-gray-100 image-hover overflow-hidden mb-4 rounded-lg">
                <img 
                  src={album.src} 
                  alt={album.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="text-center">
                <h3 className="text-base md:text-lg font-light mb-1">{album.title}</h3>
                <p className="text-gray-500 text-sm tracking-wide">{album.client}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StoriesSection = () => {
  const [selectedSeries, setSelectedSeries] = useState(null);
  
  const series = [
    { 
      id: 1, 
      title: "Identity & Expression", 
      description: "Contemporary portraiture exploring personal identity and creative expression",
      src: "/lovable-uploads/9c28429f-1037-4299-8c7d-d403a1a7dd61.png",
      images: [
        { id: 1, src: "/lovable-uploads/9c28429f-1037-4299-8c7d-d403a1a7dd61.png", title: "Identity Study 1" },
        { id: 2, src: "/lovable-uploads/15059ab6-8266-45d5-b88b-312ccb05c1a7.png", title: "Identity Study 2" },
        { id: 3, src: "/lovable-uploads/a447fd4c-084f-40ed-b666-e920bd3595ef.png", title: "Identity Study 3" },
        { id: 21, src: "/lovable-uploads/e86d93aa-4f83-4f81-a11a-c9af1794f149.png", title: "Professional Headshot 1" },
        { id: 22, src: "/lovable-uploads/7cb5b9f0-b410-45d9-af08-0dfff7aed012.png", title: "Professional Headshot 2" },
      ]
    },
    { 
      id: 2, 
      title: "Mood & Atmosphere", 
      description: "Exploring dramatic lighting and atmospheric techniques in portrait photography",
      src: "/lovable-uploads/7cb5b9f0-b410-45d9-af08-0dfff7aed012.png",
      images: [
        { id: 4, src: "/lovable-uploads/7cb5b9f0-b410-45d9-af08-0dfff7aed012.png", title: "Mood Study 1" },
        { id: 5, src: "/lovable-uploads/5c566acc-db00-4142-9d10-45fb2f698421.png", title: "Mood Study 2" },
        { id: 6, src: "/lovable-uploads/e86d93aa-4f83-4f81-a11a-c9af1794f149.png", title: "Mood Study 3" },
      ]
    },
    { 
      id: 3, 
      title: "Character & Style", 
      description: "Contemporary portraiture that captures personality and individual style",
      src: "/lovable-uploads/a447fd4c-084f-40ed-b666-e920bd3595ef.png",
      images: [
        { id: 7, src: "/lovable-uploads/a447fd4c-084f-40ed-b666-e920bd3595ef.png", title: "Character Study 1" },
        { id: 8, src: "/lovable-uploads/2b94da22-7da5-4ce5-9007-92f208a95415.png", title: "Character Study 2" },
        { id: 9, src: "/lovable-uploads/1aa6af43-e4ab-46b0-8838-2dc30838e4ea.png", title: "Character Study 3" },
      ]
    },
    { 
      id: 4, 
      title: "Fashion Series", 
      description: "Contemporary fashion photography exploring style and aesthetic expression",
      src: "/lovable-uploads/5c566acc-db00-4142-9d10-45fb2f698421.png",
      images: [
        { id: 18, src: "/lovable-uploads/5c566acc-db00-4142-9d10-45fb2f698421.png", title: "Fashion Series 1" },
        { id: 19, src: "/lovable-uploads/1aa6af43-e4ab-46b0-8838-2dc30838e4ea.png", title: "Fashion Series 2" },
        { id: 20, src: "/lovable-uploads/2b94da22-7da5-4ce5-9007-92f208a95415.png", title: "Fashion Series 3" },
      ]
    },
  ];

  if (selectedSeries) {
    return <AlbumView album={selectedSeries} onBack={() => setSelectedSeries(null)} />;
  }

  return (
    <section className="py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-12 md:space-y-16">
          {series.map((item) => (
            <div key={item.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="aspect-[5/3] bg-gray-100 image-hover overflow-hidden rounded-lg">
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-light tracking-wide">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.description}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-transparent border-black text-black hover:bg-black hover:text-white transition-colors duration-300 text-sm md:text-base"
                  onClick={() => setSelectedSeries(item)}
                >
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

const InfoSection = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="space-y-8">
            <div className="aspect-[3/4] bg-gray-100 image-hover overflow-hidden rounded-lg">
              <img 
                src="/lovable-uploads/9c4e2038-879a-4cae-b5de-8e2a36c52484.png" 
                alt="Maxwell Andoh"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
          
          <div className="space-y-6 md:space-y-8">
            <div>
              <h2 className="text-xl md:text-2xl font-light tracking-wide mb-4 md:mb-6">About</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  Photographer specializing in portraiture, creative projects, and visual storytelling. 
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
              <h3 className="text-lg md:text-xl font-light tracking-wide mb-4">Enquiries</h3>
              <div className="space-y-2 text-gray-600 text-sm md:text-base">
                <a href="mailto:maxxandohh@gmail.com" className="block hover:text-gray-800 transition-colors">maxxandohh@gmail.com</a>
                <p>+233246368562</p>
                <p>Available for projects worldwide</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-light tracking-wide mb-4">Socials</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <a href="https://www.instagram.com/maxxandohh/?hl=en" target="_blank" rel="noopener noreferrer" className="block hover:text-gray-800 transition-colors">• Instagram</a>
                <a href="https://x.com/maxxandohh" target="_blank" rel="noopener noreferrer" className="block hover:text-gray-800 transition-colors">• Twitter</a>
                <a href="https://gh.linkedin.com/in/maxwell-andoh-94a255296" target="_blank" rel="noopener noreferrer" className="block hover:text-gray-800 transition-colors">• LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
