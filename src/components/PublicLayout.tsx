import React from "react"
import { Outlet, Link, ScrollRestoration } from "react-router-dom";

const PublicLayout: React.FC = () => {
    return (
        <>
          <header className="sm:h-12 bg-thin-gray p-4 sm:py-0 fixed z-10 top-0 right-0 left-0 w-full">
            <div className="mx-auto max-w-[1280px] w-full h-full flex flex-col sm:flex-row items-center sm:justify-between">
              <h1 className="text-2xl font-bold">
                <Link to="/about">時間管理君</Link>
              </h1>
              <nav className="mt-4 sm:mt-0">
                <ul className="flex flex-wrap">
                  <li className="w-1/2 sm:w-auto text-center"><Link className="p-2 text-sm sm:text-base" to="../login" relative="path">ログイン</Link></li>
                  <li className="w-1/2 sm:w-auto text-center"><Link className="p-2 text-sm sm:text-base" to="../terms" relative="path">利用規約</Link></li>
                  <li className="w-1/2 sm:w-auto text-center mt-4 sm:mt-0"><Link className="p-2 text-sm sm:text-base" to="../privacypolicy" relative="path">プライバシーポリシー</Link></li>
                  <li className="w-1/2 sm:w-auto text-center mt-4 sm:mt-0"><Link className="p-2 text-sm sm:text-base" to="https://docs.google.com/forms/d/1VkZ6plbTQlcDHEBJ2ND-KEiRKaq6KZKHuu3mWAPqSnI/edit" target="_blank">お問い合わせ</Link></li>
                </ul>
              </nav>
            </div>
          </header>
          <Outlet />
          <footer className="p-3 text-center">
            <small>© 2023 時間管理君</small>
          </footer>
          <ScrollRestoration />
        </>
    )
};

export default PublicLayout;