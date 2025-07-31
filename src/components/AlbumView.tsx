
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import ImageGallery from './ImageGallery';

interface Image {
  id: number;
  src: string;
  title: string;
}

interface Album {
  id: number;
  title: string;
  client?: string;
  description?: string;
  images: Image[];
}

interface AlbumViewProps {
  album: Album;
  onBack: () => void;
}

const AlbumView = ({ album, onBack }: AlbumViewProps) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    if (currentImageIndex < album.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-light tracking-wide mb-2">{album.title}</h2>
          {album.client && (
            <p className="text-gray-500 tracking-wide">{album.client}</p>
          )}
          {album.description && (
            <p className="text-gray-600 mt-4 leading-relaxed">{album.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {album.images.map((image, index) => (
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
        images={album.images}
        currentIndex={currentImageIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </div>
  );
};

export default AlbumView;
