import { useState } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REASONS = [
  "Spam or misleading",
  "Harassment or hate speech",
  "Inappropriate content",
  "False or unverified claim presented as official",
  "Private information shared",
  "Other",
];

export function ReportDialog({
  entityType,
  entityId,
  label = "Report",
}: {
  entityType: "post" | "comment" | "suggestion" | "issue";
  entityId: string;
  label?: string;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("content_reports").insert({
      reporter_id: user.id,
      entity_type: entityType,
      entity_id: entityId,
      reason,
      details: details || null,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setOpen(false);
    setDetails("");
    toast.success("Report submitted for review by barangay moderators.");
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="size-4" /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this {entityType}</DialogTitle>
          <DialogDescription>
            Reports are reviewed by barangay moderators. Please only report content that breaks
            community rules.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="report-details">Additional details (optional)</Label>
            <Textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={saving}>
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
