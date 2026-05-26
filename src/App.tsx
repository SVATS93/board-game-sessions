import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"

// Auth
import LoginPage from "@/pages/auth/LoginPage"
import AdminLoginPage from "@/pages/admin/AdminLoginPage"

// Player pages
import ProfilePage from "@/pages/player/ProfilePage"
import SchedulePage from "@/pages/player/SchedulePage"
import ScoresPage from "@/pages/player/ScoresPage"
import LibraryPage from "@/pages/player/LibraryPage"
import AidesPage from "@/pages/player/AidesPage"
import AnnouncementsPage from "@/pages/player/AnnouncementsPage"
import FAQsPage from "@/pages/player/FAQsPage"
import GuidelinesPage from "@/pages/player/GuidelinesPage"
import PollsPage from "@/pages/player/PollsPage"

// Admin pages
import GodModePage from "@/pages/admin/GodModePage"
import ManageProfilesPage from "@/pages/admin/ManageProfilesPage"
import ScheduleUpdatesPage from "@/pages/admin/ScheduleUpdatesPage"
import CheckBookingsPage from "@/pages/admin/CheckBookingsPage"
import ManageScoresPage from "@/pages/admin/ManageScoresPage"
import LibraryUpdationPage from "@/pages/admin/LibraryUpdationPage"
import AnnouncementsPushPage from "@/pages/admin/AnnouncementsPushPage"
import FAQsUpdationPage from "@/pages/admin/FAQsUpdationPage"
import CommunityGuidelinesPage from "@/pages/admin/CommunityGuidelinesPage"
import ManagePollsPage from "@/pages/admin/ManagePollsPage"

const DEV_BYPASS_AUTH = !import.meta.env.VITE_SUPABASE_URL

function PlayerRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (DEV_BYPASS_AUTH) return <>{children}</>
  if (isLoading) return <div className="flex h-screen items-center justify-center"><span className="text-muted-foreground">Loading…</span></div>
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth()
  if (DEV_BYPASS_AUTH) return <>{children}</>
  if (isLoading) return <div className="flex h-screen items-center justify-center"><span className="text-muted-foreground">Loading…</span></div>
  if (!user) return <Navigate to="/admin" replace />
  if (!isAdmin) return <Navigate to="/profile" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLoginPage />} />

      {/* Player */}
      <Route path="/profile" element={<PlayerRoute><ProfilePage /></PlayerRoute>} />
      <Route path="/schedule" element={<PlayerRoute><SchedulePage /></PlayerRoute>} />
      <Route path="/scores" element={<PlayerRoute><ScoresPage /></PlayerRoute>} />
      <Route path="/library" element={<PlayerRoute><LibraryPage /></PlayerRoute>} />
      <Route path="/aides" element={<PlayerRoute><AidesPage /></PlayerRoute>} />
      <Route path="/announcements" element={<PlayerRoute><AnnouncementsPage /></PlayerRoute>} />
      <Route path="/faqs" element={<PlayerRoute><FAQsPage /></PlayerRoute>} />
      <Route path="/guidelines" element={<PlayerRoute><GuidelinesPage /></PlayerRoute>} />
      <Route path="/polls" element={<PlayerRoute><PollsPage /></PlayerRoute>} />

      {/* Admin */}
      <Route path="/admin/god-mode" element={<AdminRoute><GodModePage /></AdminRoute>} />
      <Route path="/admin/manage-profiles" element={<AdminRoute><ManageProfilesPage /></AdminRoute>} />
      <Route path="/admin/schedule-updates" element={<AdminRoute><ScheduleUpdatesPage /></AdminRoute>} />
      <Route path="/admin/check-bookings" element={<AdminRoute><CheckBookingsPage /></AdminRoute>} />
      <Route path="/admin/manage-scores" element={<AdminRoute><ManageScoresPage /></AdminRoute>} />
      <Route path="/admin/library" element={<AdminRoute><LibraryUpdationPage /></AdminRoute>} />
      <Route path="/admin/announcements" element={<AdminRoute><AnnouncementsPushPage /></AdminRoute>} />
      <Route path="/admin/faqs" element={<AdminRoute><FAQsUpdationPage /></AdminRoute>} />
      <Route path="/admin/guidelines" element={<AdminRoute><CommunityGuidelinesPage /></AdminRoute>} />
      <Route path="/admin/polls" element={<AdminRoute><ManagePollsPage /></AdminRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
