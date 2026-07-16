import { GraduationCap, Video, Palette, TrendingUp, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

const courses = [
  {
    id: 1,
    title: "剪辑入门实战营",
    level: "入门级",
    description: "从零开始，系统学习视频剪辑的核心技能",
    duration: "8周",
    lessons: 32,
    price: "¥699",
    features: [
      "Pr/Ae/Final Cut Pro 软件操作",
      "素材管理与整理逻辑",
      "基础转场与字幕设计",
      "音效与配乐选择技巧",
      "实战项目练习",
    ],
    icon: Video,
    color: "bg-blue-500",
    available: true,
  },
  {
    id: 2,
    title: "叙事节奏进阶课",
    level: "进阶级",
    description: "深入学习影视叙事语言，掌握高级剪辑技巧",
    duration: "10周",
    lessons: 40,
    price: "¥1299",
    features: [
      "蒙太奇思维与应用",
      "音效与画面的情绪配合",
      "影视混剪的「故事重构法」",
      "节奏控制与张力营造",
      "经典作品分析解构",
    ],
    icon: GraduationCap,
    color: "bg-purple-500",
    available: true,
  },
  {
    id: 3,
    title: "调色进阶课",
    level: "进阶级",
    description: "掌握专业调色技巧，打造电影级画面质感",
    duration: "6周",
    lessons: 24,
    price: "¥899",
    features: [
      "色彩理论与情绪表达",
      "DaVinci Resolve 调色流程",
      "LUT 应用与风格化调色",
      "肤色校正与环境氛围",
      "不同场景调色实战",
    ],
    icon: Palette,
    color: "bg-pink-500",
    available: false,
  },
  {
    id: 4,
    title: "短视频策划课",
    level: "实战级",
    description: "学习短视频策划与运营，打造爆款内容",
    duration: "8周",
    lessons: 32,
    price: "¥999",
    features: [
      "短视频内容策划方法论",
      "爆款视频底层逻辑",
      "平台算法与推荐机制",
      "数据分析与优化迭代",
      "账号定位与IP打造",
    ],
    icon: TrendingUp,
    color: "bg-green-500",
    available: false,
  },
];

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">课程体系</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            系统化的剪辑课程，从入门到精通，助你成为优秀的视频创作者
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                    !course.available ? "opacity-75" : ""
                  }`}
                >
                  {/* Header */}
                  <div className={`${course.color} text-white p-6`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{course.title}</h3>
                          <span className="text-sm bg-white/20 px-3 py-1 rounded-full inline-block mt-1">
                            {course.level}
                          </span>
                        </div>
                      </div>
                      {!course.available && (
                        <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                          即将上线
                        </span>
                      )}
                    </div>
                    <p className="text-white/90">{course.description}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Course Info */}
                    <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>{course.lessons} 节课</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">课程内容</h4>
                      <ul className="space-y-2">
                        {course.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-6 border-t">
                      <div>
                        <span className="text-3xl font-bold text-blue-600">{course.price}</span>
                        <span className="text-gray-500 ml-2">/ 整套课程</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="lg"
                            disabled={!course.available}
                            className={!course.available ? "opacity-50" : ""}
                          >
                            {course.available ? "立即报名" : "敬请期待"}
                          </Button>
                        </DialogTrigger>
                        {course.available && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>报名 {course.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">{course.title}</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                  <div>
                                    <span className="text-gray-600">课程时长：</span>
                                    <span className="font-medium">{course.duration}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">课程数量：</span>
                                    <span className="font-medium">{course.lessons} 节</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t">
                                  <span className="text-gray-600">课程价格</span>
                                  <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-gray-600 mb-4">扫描下方二维码，添加课程顾问咨询报名</p>
                                <div className="flex justify-center">
                                  <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500 text-sm text-center">
                                      课程顾问二维码<br/>（动态数据，实际使用时替换为真实二维码）
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                  工作时间：周一至周五 9:00-18:00<br/>
                                  添加时请备注课程名称
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">还在犹豫？</h2>
          <p className="text-gray-600 mb-8">
            扫描下方二维码，添加课程顾问，获取试听课程和详细课程大纲
          </p>
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm text-center">
                课程顾问二维码<br/>（实际使用时替换为真实二维码）
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}