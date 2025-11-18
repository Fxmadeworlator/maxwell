import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Check, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CollectionManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCollections(selectedCategory);
    } else {
      setCollections([]);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    if (data) {
      setCategories(data);
      // Auto-select first non-portrait category
      const defaultCat = data.find(c => c.slug !== 'portraits');
      if (defaultCat) setSelectedCategory(defaultCat.id);
    }
  };

  const loadCollections = async (categoryId: string) => {
    const { data } = await supabase
      .from("collections")
      .select("*")
      .eq("category_id", categoryId)
      .order("display_order");
    if (data) setCollections(data);
  };

  const startEdit = (collection: any) => {
    setEditingId(collection.id);
    setEditName(collection.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (collectionId: string) => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Collection name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("collections")
      .update({ name: editName.trim() })
      .eq("id", collectionId);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Collection name updated!" });
      setEditingId(null);
      setEditName("");
      loadCollections(selectedCategory);
    }
  };

  return (
    <div className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold">Manage Collections</h2>

      <div>
        <Label htmlFor="category-filter">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories
              .filter(cat => cat.slug !== 'portraits')
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {collections.length > 0 ? (
        <div className="space-y-2">
          <Label>Collections ({collections.length})</Label>
          <div className="space-y-2">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="flex items-center gap-2 p-3 bg-background rounded border border-border"
              >
                {editingId === collection.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveEdit(collection.id)}
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEdit}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{collection.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(collection)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No collections yet. Upload images to create collections.
        </p>
      )}
    </div>
  );
};

export default CollectionManager;
