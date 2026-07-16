import { TrendingUp, Heart, Award, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const stats = [
  { label: "全网播放量", value: "1000万+", icon: TrendingUp },
  { label: "全网点赞数", value: "50万+", icon: Heart },
  { label: "全网粉丝数", value: "20万+", icon: Award },
];

const milestones = [
  {
    year: 2020,
    title: "开始剪辑创作",
    description: "第一条爆款视频播放破100万，正式踏上创作之路",
  },
  {
    year: 2022,
    title: "粉丝突破10万",
    description: "成为抖音独家创作者，获得平台流量扶持",
  },
  {
    year: 2024,
    title: "入选精选计划",
    description: "入选抖音精选创作者计划，单条作品播放破500万",
  },
  {
    year: 2026,
    title: "全网20万粉丝",
    description: "全网粉丝突破20万，开启商业化运营新阶段",
  },
];

const platforms = [
  { name: "抖音", followers: "15万", url: "#", color: "bg-black" },
  { name: "B站", followers: "8万", url: "#", color: "bg-pink-500" },
  { name: "小红书", followers: "5万", url: "#", color: "bg-red-500" },
  { name: "视频号", followers: "3万", url: "#", color: "bg-green-500" },
];

const interests = [
  "《肖申克的救赎》- 叙事的力量",
  "《盗梦空间》- 时间与剪辑",
  "《布达佩斯大饭店》- 对称美学",
  "《寄生虫》- 社会隐喻",
  "《爆裂鼓手》- 节奏张力",
  "《鸟人》- 长镜头魅力",
];

const directors = [
  "克里斯托弗·诺兰 - 时间叙事大师",
  "韦斯·安德森 - 视觉风格化",
  "大卫·芬奇 - 精准控制节奏",
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">关于我</h1>
              <div className="space-y-4 text-lg text-blue-100">
                <p className="font-medium text-2xl text-white">剪辑创作者 · 抖音精选作者</p>
                <p className="text-xl italic border-l-4 border-white/50 pl-4">
                  "用剪辑重构影像记忆，让每帧都有情绪力量"
                </p>
                <p>
                  对「叙事节奏」的极致追求，对经典作品的「敬畏与创新」，
                  用心打磨每一个作品，传递影像的力量。
                </p>
              </div>

              {/* Platform Links */}
              <div className="flex flex-wrap gap-3 mt-8">
                {platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    className={`${platform.color} text-white px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform flex items-center gap-2`}
                  >
                    <span>{platform.name}</span>
                    <span className="text-xs opacity-80">{platform.followers}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
                    alt="Creator Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white text-gray-900 px-6 py-3 rounded-xl shadow-lg">
                  <div className="text-sm text-gray-600">抖音精选作者</div>
                  <div className="text-lg font-bold">@影像创作者</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-3">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">成长里程碑</h2>
            <p className="text-gray-600">记录每一个重要时刻</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8"}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">幕后故事</h2>
            <p className="text-gray-600">记录创作的每一个瞬间</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1575320854760-bfffc3550640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                alt="Workspace"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600">剪辑台工作日常</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1709316131422-35a5fb1e9eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                alt="Production"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600">拍摄现场记录</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1723396612574-961649793bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                alt="Cinema"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600">观影学习时刻</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Favorite Films */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">我的年度十佳影片</h3>
              <p className="text-gray-600 mb-4 text-sm">这些电影深刻影响了我的剪辑理念</p>
              <ul className="space-y-2">
                {interests.map((film, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">{index + 1}.</span>
                    <span className="text-gray-700">{film}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Favorite Directors */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">影响我的三位导演</h3>
              <p className="text-gray-600 mb-4 text-sm">向大师学习，不断精进</p>
              <div className="space-y-4">
                {directors.map((director, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{director}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">联系方式</h2>
          <p className="text-xl text-blue-100 mb-12">期待与您的合作</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">商务合作邮箱</h3>
              <p className="text-blue-100 mb-4">business@example.com</p>
              <a
                href="mailto:business@example.com"
                className="inline-flex items-center gap-2 text-sm hover:underline"
              >
                <span>发送邮件</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* WeChat */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">合作微信</h3>
              <p className="text-blue-100 mb-4">扫码添加（注明"商务合作"）</p>
              <div className="inline-block bg-white p-4 rounded-lg">
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-xs text-center">二维码占位</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
