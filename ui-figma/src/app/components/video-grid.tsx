import { Play, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const videos = [
  {
    id: 1,
    title: "《时光碎片》- 影视混剪",
    description: "用经典电影片段重构时间的记忆，探索蒙太奇的叙事魅力",
    thumbnail: "/covers/video-cover-1.jpg",
    platform: "抖音",
    views: "180万",
  },
  {
    id: 2,
    title: "《节奏大师》- 音乐混剪",
    description: "将音乐节奏与画面完美融合，打造视听双重冲击",
    thumbnail: "/covers/video-cover-2.jpg",
    platform: "B站",
    views: "95万",
  },
  {
    id: 3,
    title: "《情绪流转》- 情感叙事",
    description: "通过色彩与节奏的变化，讲述情感的起伏变化",
    thumbnail: "/covers/video-cover-3.jpg",
    platform: "小红书",
    views: "62万",
  },
  {
    id: 4,
    title: "《城市脉搏》- 延时摄影混剪",
    description: "捕捉城市的昼夜更替，感受时间的流动之美",
    thumbnail: "/covers/video-cover-4.jpg",
    platform: "抖音",
    views: "210万",
  },
];

export function VideoGrid() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">猜你喜欢</h2>
          <p className="text-gray-600">精选作品，感受剪辑的魅力</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-gray-900">
                <ImageWithFallback
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white" fill="currentColor" />
                  </button>
                </div>
                
                {/* Platform Badge */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {video.platform}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{video.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{video.views} 播放</span>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
                    <span className="text-sm">观看完整视频</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
