import { Video } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-semibold text-white">影像创作者</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              用剪辑重构影像记忆，让每帧都有情绪力量
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">作品展示</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">服务</a></li>
              <li><a href="/consulting" className="hover:text-white transition-colors">商业咨询</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">关于我</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-medium mb-4">联系方式</h3>
            <ul className="space-y-2 text-sm">
              <li>商务合作</li>
              <li className="text-blue-400">business@example.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; 2026 影像创作者. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
