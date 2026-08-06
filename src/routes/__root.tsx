function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const sidebarOpen = useAppStore(state => state.isSidebarOpen);
  const toggleSidebar = useAppStore(state => state.toggleSidebar);
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
              onClick={toggleSidebar}
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
              onClick={toggleSidebar}
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
