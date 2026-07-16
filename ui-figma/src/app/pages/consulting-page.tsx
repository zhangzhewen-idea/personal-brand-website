import { Video, Sparkles, Camera, Award, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

const services = [
  {
    id: 1,
    title: "宣传片剪辑",
    description: "企业形象片、品牌宣传片专业剪辑制作，提升品牌形象",
    icon: Video,
    features: ["专业剪辑团队", "快速交付", "不限修改次数", "提供源文件"],
    price: "¥2000起",
    duration: "3-5个工作日",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "产品短视频",
    description: "电商产品展示视频、种草视频，提升转化率",
    icon: Sparkles,
    features: ["创意策划", "精美包装", "适配多平台", "提升转化"],
    price: "¥800起",
    duration: "2-3个工作日",
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "活动记录快剪",
    description: "会议、活动现场快速剪辑，当天交付精彩瞬间",
    icon: Camera,
    features: ["快速响应", "当天交付", "多机位剪辑", "精彩集锦"],
    price: "¥1500起",
    duration: "1-2个工作日",
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "年会视频制作",
    description: "年会开场视频、年度回顾视频，打造震撼效果",
    icon: Award,
    features: ["创意策划", "特效制作", "配音配乐", "现场播放支持"],
    price: "¥3000起",
    duration: "5-7个工作日",
    color: "bg-orange-500",
  },
];

const workflow = [
  { step: 1, title: "联系咨询", description: "扫码添加微信，说明需求" },
  { step: 2, title: "需求沟通", description: "详细了解项目需求与预算" },
  { step: 3, title: "方案确认", description: "提供方案与报价，确认合作" },
  { step: 4, title: "制作交付", description: "按时交付成品，支持修改" },
];

export function ConsultingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">商业剪辑服务</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            专业的剪辑团队，为您的品牌和活动提供高质量视频制作服务
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                立即咨询
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>联系商务合作</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-gray-600">扫描下方二维码，添加管理员微信咨询服务</p>
                <div className="flex justify-center">
                  <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm text-center">
                      管理员微信二维码<br/>（动态数据，实际使用时替换）
                    </p>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-500">
                  <p>工作时间：周一至周五 9:00-18:00</p>
                  <p>24小时内回复咨询</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">服务项目</h2>
            <p className="text-gray-600">多样化的视频制作服务，满足您的不同需求</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className={`${service.color} text-white p-6`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold">{service.title}</h3>
                    </div>
                    <p className="text-white/90">{service.description}</p>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">服务特色</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                        <div className="text-sm text-gray-500">{service.duration}</div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>咨询服务</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>咨询 {service.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-2">{service.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">起步价格</span>
                                <span className="font-semibold text-blue-600">{service.price}</span>
                              </div>
                            </div>
                            <p className="text-gray-600">扫描下方二维码，添加管理员微信</p>
                            <div className="flex justify-center">
                              <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500 text-sm text-center">
                                  管理员微信二维码<br/>（动态数据）
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">合作流程</h2>
            <p className="text-gray-600">简单四步，开启合作之旅</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-md text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-0.5 bg-blue-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Placeholder */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">成功案例</h2>
            <p className="text-gray-600">已为100+客户提供专业视频制作服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">客户案例 {i}</h3>
                  <p className="text-sm text-gray-600">
                    为知名品牌提供专业视频制作服务，获得客户高度认可
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
