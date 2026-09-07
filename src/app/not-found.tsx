import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-universe-900 border border-gold-400/30 mx-auto flex items-center justify-center text-gold-400 shadow-glow-gold">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-cream-50 font-normal">
            Lost In Our Constellation
          </h1>
          <p className="text-sm text-cream-300 font-sans leading-relaxed">
            The page you are looking for has drifted into another corner of our universe.
          </p>
        </div>

        <div>
          <Link href="/">
            <Button
              variant="gold"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
