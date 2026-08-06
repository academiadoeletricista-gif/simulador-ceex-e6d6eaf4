import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  LayoutDashboard,
  Library,
  Zap,
  Target,
  Trophy,
  Award,
  Users,
  Store,
  User,
  Settings,
  Menu,
  X,
  Briefcase,
  CreditCard,
  ShieldCheck,
  BarChart3,
  LogOut,
} from "lucide-react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não pôde ser carregada
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado do nosso lado. Tente atualizar ou voltar ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Comandos LAB - Diagnóstico Industrial" },
      { name: "description", content: "Laboratório de Diagnóstico em Comandos Elétricos" },
      { property: "og:title", content: "Comandos LAB" },
      { property: "og:description", content: "Laboratório de Diagnóstico em Comandos Elétricos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Library, label: "Biblioteca", path: "/library" },
    { icon: Zap, label: "Simulações", path: "/simulations" },
    { icon: Target, label: "Desafios", path: "/challenges" },
    { icon: Trophy, label: "Ranking", path: "/ranking" },
    { icon: Award, label: "Conquistas", path: "/achievements" },
    { icon: Award, label: "Certificações", path: "/certifications" },
    { icon: Briefcase, label: "Empresas", path: "/b2b" },
    { icon: Store, label: "Marketplace", path: "/marketplace" },
    { icon: User, label: "Perfil", path: "/profile" },
    { icon: CreditCard, label: "Assinatura", path: "/billing" },
    { icon: Settings, label: "Configurações", path: "/settings" },
    { icon: ShieldCheck, label: "Admin", path: "/admin" },
    { icon: BarChart3, label: "Enterprise", path: "/analytics" },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-all duration-300 md:relative",
            !sidebarOpen && "-translate-x-full md:translate-x-0 md:w-20"
          )}
        >
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <div className={cn("flex items-center gap-2 font-bold transition-opacity", !sidebarOpen && "md:opacity-0")}>
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Zap size={20} />
              </div>
              <span className="whitespace-nowrap">Comandos LAB</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon size={20} className="shrink-0" />
                <span className={cn("transition-all duration-300", !sidebarOpen && "md:hidden md:opacity-0 whitespace-nowrap overflow-hidden")}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center px-8 shrink-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 text-muted-foreground hover:text-foreground hidden md:block"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">Eng. Carlos Alberto</div>
                <div className="text-xs text-muted-foreground">Membro Premium</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/40">
                <User size={20} className="text-primary" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
