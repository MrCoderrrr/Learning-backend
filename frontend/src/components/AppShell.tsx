import { NavBar } from "./NavBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand-50 text-ink-900">
      <div className="bg-orbit fixed inset-0 -z-10" />
      <div className="pointer-events-none fixed -top-20 right-10 h-48 w-48 animate-float-slow rounded-full bg-ember-500/20 blur-3xl" />
      <div className="pointer-events-none fixed bottom-10 left-8 h-56 w-56 animate-float-slow rounded-full bg-moss-500/20 blur-3xl" />
      <NavBar />
      <main className="page layout-frame mx-auto mt-6 pb-16 sm:mt-8 lg:mt-10 lg:pb-20">
        {children}
      </main>
    </div>
  );
}
