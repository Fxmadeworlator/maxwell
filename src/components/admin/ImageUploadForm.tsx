import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface ImageUploadFormProps {
  onSuccess: () => void;
}

const ImageUploadForm = ({ onSuccess }: ImageUploadFormProps) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCollections(selectedCategory);
    } else {
      setCollections([]);
      setSelectedCollection("");
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    if (data) setCategories(data);
  };

  const loadCollections = async (categoryId: string) => {
    const { data } = await supabase
      .from("collections")
      .select("*")
      .eq("category_id", categoryId)
      .order("display_order");
    if (data) setCollections(data);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedCategory) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("images").insert({
        category_id: selectedCategory,
        collection_id: selectedCollection || null,
        title: title || file.name,
        image_url: publicUrl,
      });

      if (insertError) throw insertError;

      toast({ title: "Image uploaded successfully!" });
      setTitle("");
      setFile(null);
      setSelectedCategory("");
      setSelectedCollection("");
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold">Upload New Image</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {collections.length > 0 && (
          <div>
            <Label htmlFor="collection">Collection (Optional)</Label>
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger id="collection">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (main gallery)</SelectItem>
                {collections.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="title">Title (Optional)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Image title"
          />
        </div>

        <div>
          <Label htmlFor="file">Image File *</Label>
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={uploading || !file || !selectedCategory}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>
    </form>
  );
};

export default ImageUploadForm;
