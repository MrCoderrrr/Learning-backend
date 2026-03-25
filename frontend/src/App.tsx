import { Routes, Route, Outlet } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoDetail from "./pages/VideoDetail";
import VideoPublish from "./pages/VideoPublish";
import VideoEdit from "./pages/VideoEdit";
import Profile from "./pages/Profile";
import ProfileView from "./pages/ProfileView";
import Channel from "./pages/Channel";
import Dashboard from "./pages/Dashboard";
import WatchHistory from "./pages/WatchHistory";
import Likes from "./pages/Likes";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import PlaylistView from "./pages/PlaylistView";
import Subscriptions from "./pages/Subscriptions";
import Subscribers from "./pages/Subscribers";
import Tweets from "./pages/Tweets";
import NotFound from "./pages/NotFound";

function ShellLayout() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Outlet />
      </AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ShellLayout />}>
        <Route index element={<Home />} />
        <Route path="/videos/publish" element={<VideoPublish />} />
        <Route path="/videos/:videoId" element={<VideoDetail />} />
        <Route path="/videos/:videoId/edit" element={<VideoEdit />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/profile/edit" element={<Profile />} />
        <Route path="/channel/:username" element={<Channel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<WatchHistory />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:playlistId" element={<PlaylistView />} />
        <Route path="/playlists/:playlistId/edit" element={<PlaylistDetail />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscribers" element={<Subscribers />} />
        <Route path="/tweets" element={<Tweets />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
