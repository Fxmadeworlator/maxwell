import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImageUploadFormProps {
  onSuccess: () => void;
}

const ImageUploadForm = ({ onSuccess }: ImageUploadFormProps) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

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
    if (files.length === 0 || !selectedCategory) return;

    const categoryRequiresCollection = selectedCategory && 
      categories.find(c => c.id === selectedCategory)?.slug !== 'portraits';

    try {
      // Create new collection if needed
      let collectionId = selectedCollection;
      if (categoryRequiresCollection && newCollectionName && !selectedCollection) {
        const { data: newCollection, error: collectionError } = await supabase
          .from("collections")
          .insert({
            name: newCollectionName,
            category_id: selectedCategory,
          })
          .select()
          .single();

        if (collectionError) throw collectionError;
        collectionId = newCollection.id;
      }

      const totalFiles = files.length;
      let uploadedCount = 0;

      for (const file of files) {
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
          collection_id: collectionId || null,
          title: file.name.replace(/\.[^/.]+$/, ""),
          image_url: publicUrl,
        });

        if (insertError) throw insertError;

        uploadedCount++;
        setProgress((uploadedCount / totalFiles) * 100);
      }

      toast({ 
        title: "Success!", 
        description: `${totalFiles} image${totalFiles !== 1 ? 's' : ''} uploaded successfully.` 
      });
      setFiles([]);
      setSelectedCategory("");
      setSelectedCollection("");
      setNewCollectionName("");
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const categoryRequiresCollection = selectedCategory && 
    categories.find(c => c.id === selectedCategory)?.slug !== 'portraits';

  return (
    <form onSubmit={handleUpload} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold">Upload Images</h2>

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

        {selectedCategory && categories.find(c => c.id === selectedCategory)?.slug !== 'portraits' && (
          <div className="space-y-4">
            {collections.length > 0 && (
              <div>
                <Label htmlFor="collection">Select Existing Collection</Label>
                <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                  <SelectTrigger id="collection">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
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
              <Label htmlFor="new-collection-single">
                {collections.length > 0 ? "Or Create New Collection" : "Create New Collection *"}
              </Label>
              <Input
                id="new-collection-single"
                type="text"
                placeholder="Enter collection name"
                value={newCollectionName}
                onChange={(e) => {
                  setNewCollectionName(e.target.value);
                  if (e.target.value) setSelectedCollection("");
                }}
                disabled={uploading}
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="files">Select Images *</Label>
          <input
            id="files"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
            className="mt-1 block w-full text-sm text-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90
              cursor-pointer"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Select one or multiple images to upload
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Files ({files.length})</Label>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-background rounded border border-border"
                >
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <Label>Upload Progress</Label>
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">
              Uploading... {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={
          uploading || 
          files.length === 0 || 
          !selectedCategory ||
          (categoryRequiresCollection && !selectedCollection && !newCollectionName)
        } 
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Uploading..." : `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`}
      </Button>
    </form>
  );
};

export default ImageUploadForm;
