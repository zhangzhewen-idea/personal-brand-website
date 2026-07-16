import { Scissors, Volume2, Video, Gift, ShoppingCart, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

const materials = [
  {
    id: 1,
    title: "转场素材",
    description: "150+ 精选转场效果，涵盖各种风格",
    icon: Scissors,
    price: "¥49",
    items: 150,
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "音效素材",
    description: "300+ 高质量音效，提升作品质感",
    icon: Volume2,
    price: "¥39",
    items: 300,
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "视频练习",
    description: "20+ 实战项目素材，边学边练",
    icon: Video,
    price: "¥99",
    items: 20,
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "粉丝福利",
    description: "免费素材整合包，持续更新",
    icon: Gift,
    price: "免费",
    items: 100,
    color: "bg-orange-500",
    isFree: true,
  },
];

export function MaterialLibrary() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">素材库</h2>
          <p className="text-gray-600">优质素材资源，助力你的创作</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((material) => {
            const Icon = material.icon;
            return (
              <div
                key={material.id}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`${material.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{material.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">{material.price}</span>
                  <span className="text-sm text-gray-500">{material.items}+ 素材</span>
                </div>

                {material.isFree ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="default">
                        <Download className="w-4 h-4 mr-2" />
                        免费下载
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>获取免费素材</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-gray-600">扫描下方二维码，关注公众号获取网盘链接</p>
                        <div className="flex justify-center">
                          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500 text-sm text-center">二维码占位<br/>（实际使用时替换为真实二维码）</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          网盘链接: https://pan.example.com/xxxxx<br/>
                          提取码: abcd
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        立即购买
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>购买 {material.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{material.title}</span>
                            <span className="text-xl font-bold text-blue-600">{material.price}</span>
                          </div>
                          <p className="text-sm text-gray-600">{material.description}</p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <p className="text-sm text-red-600 mb-4">
                            ⚠️ 重要声明：素材仅供个人学习使用，请勿用于商业或其他用途
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500 text-sm text-center">支付二维码<br/>（实际使用时接入真实支付）</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
