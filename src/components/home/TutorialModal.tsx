import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Play } from "lucide-react";
import { useSetting } from "@/hooks/useSiteSettings";

const STORAGE_KEY = "gp_tutorial_seen";

function isEmbedUrl(url: string) {
  return url.includes("youtube") || url.includes("youtu.be") || url.includes("vimeo");
}

function toEmbedUrl(url: string) {
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  }
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1`;
  }
  return url;
}

export function TutorialModal() {
  const { value: videoUrl } = useSetting("site_tutorial_video_url");
  const { value: enabled } = useSetting("enable_tutorial_modal");
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    if (enabled !== "true") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, [enabled]);

  const dismiss = () => {
    setOpen(false);
    if (dontShow) localStorage.setItem(STORAGE_KEY, "1");
  };

  const watchNow = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    // keep modal open so they watch
  };

  if (enabled !== "true") return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); else setOpen(true); }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>How to Use This Website in 60 Seconds</DialogTitle>
          <DialogDescription>Watch a quick overview to get started on your global nursing journey.</DialogDescription>
        </DialogHeader>

        <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          {videoUrl ? (
            isEmbedUrl(videoUrl) ? (
              <iframe
                src={toEmbedUrl(videoUrl)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Tutorial video"
              />
            ) : (
              <video src={videoUrl} controls autoPlay muted className="w-full h-full object-cover" />
            )
          ) : (
            <div className="text-center text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Video coming soon</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <Checkbox checked={dontShow} onCheckedChange={(v) => setDontShow(!!v)} />
            Don't show again
          </label>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={dismiss}>Skip</Button>
            <Button size="sm" onClick={watchNow}>Watch Now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
