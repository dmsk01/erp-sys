import { Layout } from "antd";
import React from "react";
import { Header } from "renderer/components/Header";

interface AppLayoutProps {
  children:React.ReactNode
}

function AppLayout({children}:AppLayoutProps){
  return (
    <Layout>
      <Header />
      <main>
        {children}
      </main>
    </Layout>
  )
}

export { AppLayout }