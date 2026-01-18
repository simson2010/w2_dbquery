import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Connections from './pages/Connections';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 py-2 text-sm sm:px-4 sm:text-base rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo/标题 */}
            <Link to="/" className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-xl font-bold text-blue-600">SQL</span>
              <span className="text-lg sm:text-xl font-semibold text-gray-800 hidden xs:inline">Query Assistant</span>
              <span className="text-lg font-semibold text-gray-800 xs:hidden">助手</span>
            </Link>

            {/* 导航链接 */}
            <div className="flex items-center gap-1 sm:gap-2">
              <NavLink to="/">查询</NavLink>
              <NavLink to="/connections">连接管理</NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <main className="py-4 sm:py-6 px-2 sm:px-4">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connections" element={<Connections />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
