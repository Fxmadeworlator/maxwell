import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BulkUploadFormProps {
  onSuccess: () => void;
}

const BulkUploadForm = ({ onSuccess }: BulkUploadFormProps) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !selectedCategory) return;

    setUploading(true);
    setProgress(0);

    try {
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
          collection_id: selectedCollection || null,
          title: file.name.replace(/\.[^/.]+$/, ""),
          image_url: publicUrl,
        });

        if (insertError) throw insertError;

        uploadedCount++;
        setProgress((uploadedCount / totalFiles) * 100);
      }

      toast({ 
        title: "Success!", 
        description: `${totalFiles} images uploaded successfully.` 
      });
      
      setFiles([]);
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
      setProgress(0);
    }
  };

  const categoryRequiresCollection = selectedCategory && 
    categories.find(c => c.id === selectedCategory)?.slug !== 'portraits';

  return (
    <form onSubmit={handleBulkUpload} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold">Bulk Upload Images</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="bulk-category">Category *</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="bulk-category">
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
            <Label htmlFor="bulk-collection">
              Collection {categoryRequiresCollection && "*"}
            </Label>
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger id="bulk-collection">
                <SelectValue placeholder="Select or create collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryRequiresCollection && (
              <p className="text-sm text-muted-foreground mt-1">
                All images will be grouped in this collection
              </p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="bulk-files">Select Images *</Label>
          <input
            id="bulk-files"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90
              cursor-pointer"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Select multiple images to upload at once
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
          (categoryRequiresCollection && !selectedCollection)
        }
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Uploading..." : `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`}
      </Button>
    </form>
  );
};

export default BulkUploadForm;
