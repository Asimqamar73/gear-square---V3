import { SidebarProvider } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="bg-gray-50">

    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* <SidebarTrigger className="fixed"/> */}
        <Outlet />
      </main>
    </SidebarProvider>
    </div>
  )
}
