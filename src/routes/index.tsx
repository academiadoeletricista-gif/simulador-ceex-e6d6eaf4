import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-6">
      <h1 className="text-4xl font-bold">Laboratório de Diagnóstico em Comandos Elétricos</h1>
      <p className="text-xl text-muted-foreground">Sistema em manutenção e atualização de fluxo.</p>
      <div className="flex gap-4">
        <Link to="/library" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold">Acessar Biblioteca</Link>
        <Link to="/simulations" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-bold">Ir para Simulações</Link>
      </div>
    </div>
  );
}
