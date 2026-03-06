import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  )
}
// pushing it for some changes 