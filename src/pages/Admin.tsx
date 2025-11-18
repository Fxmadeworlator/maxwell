import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, Upload } from "lucide-react";
import ImageUploadForm from "@/components/admin/ImageUploadForm";
import BulkUploadForm from "@/components/admin/BulkUploadForm";
import ImageGalleryManager from "@/components/admin/ImageGalleryManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio Admin</h1>
          <div className="flex gap-4 items-center">
            <Button onClick={() => navigate("/")} variant="outline">
              View Site
            </Button>
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="single">
                <Plus className="w-4 h-4 mr-2" />
                Single Upload
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="single" className="mt-6">
              <ImageUploadForm onSuccess={() => {}} />
            </TabsContent>
            <TabsContent value="bulk" className="mt-6">
              <BulkUploadForm onSuccess={() => {}} />
            </TabsContent>
          </Tabs>
        </div>

        <ImageGalleryManager />
      </main>
    </div>
  );
};

export default Admin;
