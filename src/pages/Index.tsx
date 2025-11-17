
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ImageGallery from "@/components/ImageGallery";
import AlbumView from "@/components/AlbumView";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState('portraits');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
        
        setIsAdmin(!!roleData);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

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
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="text-[10px] md:text-xs font-light tracking-wider transition-all duration-300 hover:text-gray-600 relative group px-1 py-1 text-gray-500 hover:text-gray-800"
            >
              <span className="whitespace-nowrap">ADMIN</span>
              <div className="absolute bottom-[-6px] left-0 w-full h-0.5 bg-black transform origin-left transition-all duration-300 scale-x-0 group-hover:scale-x-50" />
            </button>
          )}
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
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'portraits')
        .single();

      if (category) {
        const { data } = await supabase
          .from('images')
          .select('*')
          .eq('category_id', category.id)
          .is('collection_id', null)
          .order('display_order');
        
        if (data) {
          setImages(data.map(img => ({
            id: img.id,
            src: img.image_url,
            title: img.title || 'Untitled'
          })));
        }
      }
    };

    loadImages();
  }, []);

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

  if (images.length === 0) {
    return (
      <section className="py-8 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          No portraits yet. Add some from the admin panel!
        </div>
      </section>
    );
  }

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
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const loadCollections = async () => {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'product-photography')
        .single();

      if (category) {
        const { data } = await supabase
          .from('collections')
          .select(`
            *,
            images (*)
          `)
          .eq('category_id', category.id)
          .order('display_order');
        
        if (data) {
          setCollections(data.map(col => ({
            id: col.id,
            title: col.name,
            description: col.description,
            src: col.images?.[0]?.image_url || '',
            images: col.images?.map((img: any) => ({
              id: img.id,
              src: img.image_url,
              title: img.title || 'Untitled'
            })) || []
          })));
        }
      }
    };

    loadCollections();
  }, []);

  if (selectedAlbum) {
    return <AlbumView album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  if (collections.length === 0) {
    return (
      <section className="py-8 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          No collections yet. Add some from the admin panel!
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {collections.map((album) => (
            <div 
              key={album.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedAlbum(album)}
            >
              <div className="aspect-[3/4] bg-gray-100 image-hover overflow-hidden rounded-lg">
                <img 
                  src={album.src} 
                  alt={album.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm font-medium">{album.title}</h3>
                {album.description && <p className="text-xs text-gray-500">{album.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StoriesSection = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'visual-stories')
        .single();

      if (category) {
        const { data } = await supabase
          .from('collections')
          .select(`
            *,
            images (*)
          `)
          .eq('category_id', category.id)
          .order('display_order');
        
        if (data) {
          setStories(data.map(col => ({
            id: col.id,
            title: col.name,
            description: col.description,
            src: col.images?.[0]?.image_url || '',
            images: col.images?.map((img: any) => ({
              id: img.id,
              src: img.image_url,
              title: img.title || 'Untitled'
            })) || []
          })));
        }
      }
    };

    loadStories();
  }, []);

  if (selectedAlbum) {
    return <AlbumView album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  if (stories.length === 0) {
    return (
      <section className="py-8 md:py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          No stories yet. Add some from the admin panel!
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {stories.map((album) => (
            <div 
              key={album.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedAlbum(album)}
            >
              <div className="aspect-[3/4] bg-gray-100 image-hover overflow-hidden rounded-lg">
                <img 
                  src={album.src} 
                  alt={album.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm font-medium">{album.title}</h3>
                {album.description && <p className="text-xs text-gray-500">{album.description}</p>}
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
