# AUDITORIA ARQUITETURAL - SPRINT CORE-00

## 1. Nova Estrutura de Pastas (Simulation Core)

O Simulation Core foi isolado em `src/simulation-core/` com a seguinte topologia:

- `domain/`: Contém a lógica de negócio pura (Entidades elétricas, Solver, Engine).
  - `components/`: Definições de componentes físicos (`ElectricalComponent.ts`).
  - `solver/`: Motor matemático de propagação de tensão (`CircuitSolver.ts`).
  - `diagnosis/`: Máquina de estado do diagnóstico (`DiagnosisEngine.ts`).
  - `sessions/`: Estado da sessão e tipos de progresso.
- `api/`: Ponto de entrada único para a UI (`SimulationAPI.ts`).
- `repositories/`: (Estrutura criada) Responsável pelo isolamento do Supabase.

## 2. Diagrama de Dependências (Simplificado)

```text
React (UI/Routes) -> hooks/useDiagnosis -> SimulationAPI -> DiagnosisEngine -> CircuitSolver -> Components
```

- **Invariante:** A UI nunca acessa o `CircuitSolver` ou instâncias de `ElectricalComponent` diretamente.
- **Isolamento:** O `SimulationCore` não possui dependências de React, Tailwind ou TanStack.

## 3. Débito Técnico Eliminado

- Removida lógica de "conversão de nós" manual dentro do `useDiagnosis.ts`.
- Removida manipulação direta de objetos do `DiagnosisEngine` dentro do `simulations.tsx`.
- Centralizada a criação de circuitos industriais através de funções de setup injetáveis.

## 4. Riscos para SPRINT CORE-01

- **Persistência Complexa:** A migração total do `SessionRepository` para dentro do Core exigirá mapeamento cuidadoso de JSONB no Supabase.
- **Topologias Dinâmicas:** Atualmente o `SimulationAPI` possui um hardcoded de "Partida Direta". Na CORE-01, isso deve vir de arquivos de configuração ou do banco.

---
Auditoria concluída com sucesso. O sistema está pronto para a implementação da física avançada.
