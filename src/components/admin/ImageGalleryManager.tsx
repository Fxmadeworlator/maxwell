import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ImageGalleryManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      loadImages(activeCategory);
    }
  }, [activeCategory]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    if (data && data.length > 0) {
      setCategories(data);
      setActiveCategory(data[0].id);
    }
  };

  const loadImages = async (categoryId: string) => {
    const { data } = await supabase
      .from("images")
      .select(`
        *,
        collections (name)
      `)
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });
    if (data) setImages(data);
  };

  const handleDelete = async (imageId: string, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        await supabase.storage.from("portfolio-images").remove([fileName]);
      }

      const { error } = await supabase.from("images").delete().eq("id", imageId);
      if (error) throw error;

      toast({ title: "Image deleted successfully" });
      loadImages(activeCategory);
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Manage Images</h2>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(img.id, img.image_url)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="font-medium truncate">{img.title}</p>
                    {img.collections && (
                      <p className="text-muted-foreground text-xs">{img.collections.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No images in this category yet.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ImageGalleryManager;
