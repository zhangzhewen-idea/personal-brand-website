import { Play, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function VideoHero() {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Placeholder - 使用图片作为视频封面 */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="/images/editing-desk-1.jpg"
          alt="Video Editing Workspace"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <div className="text-center space-y-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            用剪辑重构影像记忆
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            让每一帧都充满情绪力量
          </p>
          
          {/* Play Button */}
          <button className="mt-8 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-8 py-4 rounded-full transition-all transform hover:scale-105">
            <Play className="w-6 h-6" fill="currentColor" />
            <span className="text-lg">观看作品集</span>
          </button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
            <div>
              <div className="text-3xl md:text-4xl font-bold">1000万+</div>
              <div className="text-sm text-gray-400 mt-1">全网播放量</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">50万+</div>
              <div className="text-sm text-gray-400 mt-1">全网点赞数</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">20万+</div>
              <div className="text-sm text-gray-400 mt-1">全网粉丝数</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}
