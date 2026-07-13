import { useEffect, useState } from "react"; 
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    bike_name: "",
    bike_cc: "",
    city: "Bengaluru",
    bio: "",
    riding_experience: "beginner",
  });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setForm({
          full_name: data.full_name || "",
          bike_name: data.bike_name || "",
          bike_cc: data.bike_cc || "",
          city: data.city || "Bengaluru",
          bio: data.bio || "",
          riding_experience: data.riding_experience || "beginner",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("user_id", user.id);
    if (error) toast.error("Failed to save profile");
    else toast.success("Profile updated!");
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading profile...</div>;

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading font-bold mb-6">My Profile</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground font-heading text-3xl">
                {form.full_name.charAt(0) || "R"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-heading text-2xl">{form.full_name || "Set your name"}</CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><Label>Bike Name</Label><Input value={form.bike_name} onChange={(e) => setForm({ ...form, bike_name: e.target.value })} placeholder="Royal Enfield Classic 350" /></div>
            <div><Label>Engine CC</Label><Input value={form.bike_cc} onChange={(e) => setForm({ ...form, bike_cc: e.target.value })} placeholder="350" /></div>
          </div>
          <div>
            <Label>Riding Experience</Label>
            <Select value={form.riding_experience} onValueChange={(v) => setForm({ ...form, riding_experience: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="experienced">Experienced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell riders about yourself..." rows={4} /></div>
          <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? "Saving..." : "Save Profile"}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
