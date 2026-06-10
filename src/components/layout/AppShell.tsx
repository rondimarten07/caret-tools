import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { ShortcutsOverlay } from "./ShortcutsOverlay";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileCategoriesDrawer } from "./MobileCategoriesDrawer";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function AppShell() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isEmbedded = new URLSearchParams(location.search).get("embed") === "1";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Embedded mode: strip chrome (sidebar/header/footer/bottom nav)
  if (isEmbedded) {
    return (
      <div className="flex h-full w-full flex-col">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar onOpenSearch={() => setPaletteOpen(true)} />
      </div>

      {/* Mobile drawer for full sidebar */}
      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent className="left-0 top-0 h-full max-w-[280px] translate-x-0 translate-y-0 rounded-none border-r p-0 data-[state=open]:slide-in-from-left">
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <Sidebar
            onNavigate={() => setMobileNavOpen(false)}
            onOpenSearch={() => {
              setMobileNavOpen(false);
              setPaletteOpen(true);
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          onSearchClick={() => setPaletteOpen(true)}
        />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Outlet />
          <Footer />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav
        onSearchClick={() => setPaletteOpen(true)}
        onCategoriesClick={() => setMobileCategoriesOpen(true)}
        onFavoritesClick={() => navigate("/favorites")}
      />

      {/* Mobile categories drawer */}
      <MobileCategoriesDrawer
        open={mobileCategoriesOpen}
        onOpenChange={setMobileCategoriesOpen}
      />

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <ShortcutsOverlay />
    </div>
  );
}
