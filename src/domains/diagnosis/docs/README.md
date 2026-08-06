# Diagnosis Engine Foundation - Documentação Técnica

## Visão Geral
A Diagnosis Engine é o núcleo de processamento lógico dos simuladores CEEX. Projetada seguindo princípios de **Clean Architecture** e **DDD**, ela é totalmente desacoplada de frameworks de UI (React), persistência (Supabase) ou gerenciamento de estado global (Zustand).

## Arquitetura
A estrutura segue o padrão de domínios isolados:

- **Domain**: Entidades imutáveis e objetos de valor que representam o negócio de diagnóstico.
- **Engine**: A Máquina de Estados que processa as transições entre nós.
- **Application**: Casos de uso e serviços de orquestração.
- **Types**: Definições de contratos e esquemas (Universal Case Schema).
- **Mappers**: Transformação de dados externos (JSON/API) para o domínio interno.

## Universal Case Schema
Contrato oficial para definição de casos:
- **Metadata**: Título, descrição, dificuldade, recompensas.
- **Nodes**: Estados do diagnóstico (Informação, Pergunta, Medição, etc.).
- **Choices**: Transições entre estados com feedback e efeitos.

## Fluxo da Engine
1. `load(schema)`: Valida e mapeia o JSON para o domínio.
2. `start()`: Inicia a sessão no nó inicial.
3. `selectChoice(id)`: Processa a transição e atualiza o estado interno.
4. `getState()`: Retorna o estado atual (histórico, pontuação, nó corrente).

## Roadmap
- Sprint 2B: Integração com React Hooks.
- Sprint 2C: Persistência no Supabase.
- Sprint 3: Tutor IA (RAG) integrado ao histórico da Engine.
