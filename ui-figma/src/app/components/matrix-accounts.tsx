import { ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const accounts = [
  {
    id: 1,
    platform: "抖音",
    name: "影像创作者",
    followers: "15万",
    url: "https://douyin.com",
    logo: "/logos/douyin.png",
    color: "bg-black",
  },
  {
    id: 2,
    platform: "B站",
    name: "影像创作者",
    followers: "8万",
    url: "https://bilibili.com",
    logo: "/logos/bilibili.png",
    color: "bg-pink-500",
  },
  {
    id: 3,
    platform: "小红书",
    name: "影像创作者",
    followers: "5万",
    url: "https://xiaohongshu.com",
    logo: "/logos/xiaohongshu.png",
    color: "bg-red-500",
  },
  {
    id: 4,
    platform: "视频号",
    name: "影像创作者",
    followers: "3万",
    url: "https://weixin.qq.com",
    logo: "/logos/wechat-video.png",
    color: "bg-green-500",
  },
];

export function MatrixAccounts() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">关注我的更多平台</h2>
          <p className="text-gray-600">全网同名，持续更新优质内容</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accounts.map((account) => (
            <a
              key={account.id}
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center">
                {/* Logo */}
                <div className={`${account.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <ImageWithFallback
                    src={account.logo}
                    alt={account.platform}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </div>

                {/* Platform Name */}
                <h3 className="text-xl font-semibold mb-1">{account.platform}</h3>
                <p className="text-gray-600 text-sm mb-3">{account.name}</p>

                {/* Followers */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">{account.followers}</span>
                  <span className="text-sm text-gray-500 ml-1">粉丝</span>
                </div>

                {/* Visit Link */}
                <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="text-sm">访问主页</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
