import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { initials } from "@/lib/api";
import { postCategories, residentPostCategories } from "@/lib/taxonomy";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommunityBadge, OfficialBadge } from "@/components/badges";

export function PostComposer() {
  const { user, profile, isStaff } = useAuth();
  const qc = useQueryClient();
  const [category, setCategory] = useState<string>("community_update");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [official, setOfficial] = useState(false);
  const [preview, setPreview] = useState(false);

  const options = isStaff ? postCategories : residentPostCategories;

  const create = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in to post.");
      const { error } = await supabase.from("posts").insert({
        author_id: user.id,
        category: category as never,
        content: content.trim(),
        image_url: imageUrl.trim() || null,
        location_label: location.trim() || null,
        is_official: official && isStaff,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      setImageUrl("");
      setLocation("");
      setPreview(false);
      toast.success("Your post is now live in the community feed.");
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!user) return null;

  const name = official && isStaff ? "Barangay Balibago Official" : (profile?.full_name ?? "Resident");

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-secondary text-xs">{initials(name)}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">
          Share something with Barangay Balibago, {profile?.full_name?.split(" ")[0] ?? "neighbour"}.
        </p>
      </div>

      <div className="mt-4 grid gap-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Post type</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="composer-location">Location (optional)</Label>
            <Input
              id="composer-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Purok 4, near the covered court"
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="composer-content">What would you like to share?</Label>
          <Textarea
            id="composer-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Write an update, ask a question, or raise a concern…"
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="composer-image" className="flex items-center gap-1.5">
            <ImageIcon className="size-3.5" /> Image link (optional)
          </Label>
          <Input
            id="composer-image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>

        {isStaff ? (
          <label className="flex items-center gap-2 rounded-md border border-official/40 bg-official-soft/40 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={official}
              onChange={(e) => setOfficial(e.target.checked)}
            />
            Publish as an official Barangay Balibago post
          </label>
        ) : null}

        {preview && content.trim() ? (
          <div className="rounded-md border border-dashed border-border bg-background p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Preview
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{name}</span>
              {official && isStaff ? <OfficialBadge /> : <CommunityBadge />}
            </div>
            <p className="mt-2 text-sm whitespace-pre-wrap">{content}</p>
            {location ? (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {location}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreview((v) => !v)}
            disabled={!content.trim()}
          >
            {preview ? "Hide preview" : "Preview"}
          </Button>
          <Button
            size="sm"
            onClick={() => create.mutate()}
            disabled={!content.trim() || create.isPending}
          >
            <Send className="size-4" /> Post
          </Button>
          <p className="text-xs text-muted-foreground">
            You can edit or delete your post at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
