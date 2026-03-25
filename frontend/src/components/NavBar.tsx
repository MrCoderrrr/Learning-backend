import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";

const linkClass = "text-sm font-medium text-ink-500 transition hover:text-ink-900";

const navItems = [
  { to: "/", label: "Feed" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/playlists", label: "Playlists" },
  { to: "/tweets", label: "Tweets" },
  { to: "/subscriptions", label: "Subscriptions" },
];

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="glass-panel layout-frame sticky top-3 z-40 mx-auto rounded-[16px] px-4 py-3 shadow-soft sm:px-5 lg:top-4 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-ink-900 transition hover:bg-white/10 xl:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 font-semibold text-sand-50">
              VT
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] uppercase tracking-[0.35em] text-ink-500 sm:text-sm">
                VideoTube
              </p>
              <p className="font-display text-lg font-semibold text-ink-900 sm:text-[1.35rem]">
                Studio
              </p>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="border-0 bg-gradient-to-r from-accent-purple to-accent-cyan px-3 text-sand-50 sm:px-5"
            onClick={() => navigate("/videos/publish")}
          >
            <span className="hidden sm:inline">Publish</span>
            <span className="sm:hidden">+</span>
          </Button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={user.avatar || "https://placehold.co/40x40"}
                className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
              />
              <Button
                variant="ghost"
                className="hidden lg:inline-flex"
                onClick={() => navigate("/profile")}
              >
                {user.fullName.split(" ")[0]}
              </Button>
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              className="hidden sm:inline-flex"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="mt-4 space-y-4 border-t border-white/10 pt-4 xl:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="surface-box rounded-[16px] px-4 py-3 text-sm font-medium text-ink-900 transition hover:bg-white/10"
              >
                {item.label}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/profile"
                className="surface-box rounded-[16px] px-4 py-3 text-sm font-medium text-ink-900 transition hover:bg-white/10"
              >
                Profile
              </NavLink>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {!user && (
              <Button className="w-full sm:flex-1" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
            {user && (
              <Button
                variant="ghost"
                className="w-full border border-white/10 sm:flex-1"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
