# NEA Marketing Hub — Documento de Orientação do Projeto (PRD)

> **Arquivo norteador do projeto.** Toda decisão de arquitetura, tecnologia, design e desenvolvimento deve ser guiada por este documento. Em caso de dúvida durante a implementação, consulte este arquivo antes de tomar qualquer decisão de design ou código.

**Versão:** 2.0
**Última revisão:** 2026-03-24
**Status:** Aprovado para implementação

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Identidade Visual](#3-identidade-visual)
4. [Perfis de Usuário e Controle de Acesso](#4-perfis-de-usuário-e-controle-de-acesso)
5. [Módulos do Sistema](#5-módulos-do-sistema)
6. [Modelagem de Dados](#6-modelagem-de-dados)
7. [Regras de Negócio](#7-regras-de-negócio)
8. [Segurança](#8-segurança)
9. [Requisitos de UX](#9-requisitos-de-ux)
10. [Estrutura de Pastas](#10-estrutura-de-pastas)
11. [Performance e Infraestrutura](#11-performance-e-infraestrutura)
12. [Plano de Entrega](#12-plano-de-entrega)
13. [Princípios de Desenvolvimento](#13-princípios-de-desenvolvimento)
14. [Restrições e Proibições](#14-restrições-e-proibições)

---

## 1. Visão Geral

**Nome do sistema:** NEA Marketing Hub
**Natureza:** Plataforma web de gestão de marketing digital
**Contexto institucional:** Projeto NEA Vale do Ivaí — IFPR
**Propósito:** Centralizar todo o fluxo de marketing digital em uma única plataforma, cobrindo desde a geração de ideias até a análise de métricas, com apoio de inteligência artificial.

**Fluxo principal:**
```
IDEIA → PLANEJAMENTO → PRODUÇÃO → PUBLICAÇÃO → MÉTRICAS → OTIMIZAÇÃO
```

**Inspirações de produto:**
- Notion (organização e documentação)
- Trello (gestão de tarefas)
- Dashboards SaaS modernos
- Sistemas de gestão editorial

---

## 2. Stack Tecnológica

### 2.1 Frontend

| Tecnologia | Versão mínima | Finalidade |
|---|---|---|
| React | 18.x | Base do frontend |
| TypeScript | 5.x | Tipagem estática |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Estilização utilitária |
| shadcn/ui | latest | Componentes de UI (baseado em Radix UI) |
| React Router | 6.x | Navegação SPA |
| React Hook Form | 7.x | Gerenciamento de formulários |
| Zod | 3.x | Validação de schemas e tipos |
| TanStack Query | 5.x | Cache e sincronização de dados do servidor |
| TanStack Table | 8.x | Tabelas com filtro, paginação e ordenação |
| Lucide Icons | latest | Ícones |
| date-fns | 3.x | Manipulação de datas |
| recharts | 2.x | Gráficos e métricas |
| dnd-kit | 6.x | Drag and drop no calendário |
| sonner | latest | Feedback visual (toasts) |

> **Por que TanStack Table?** Tabelas com filtros, paginação e ordenação são requisito em múltiplos módulos. Implementar do zero com shadcn/ui seria custoso e inconsistente. TanStack Table pertence ao mesmo ecossistema TanStack Query já adotado.

### 2.2 Backend / Persistência

| Tecnologia | Finalidade |
|---|---|
| Supabase Auth | Autenticação e gestão de sessão |
| Supabase Database (PostgreSQL 15+) | Banco de dados relacional |
| Supabase Storage | Armazenamento de arquivos de mídia |
| Supabase Realtime | Notificações em tempo real |
| Row Level Security (RLS) | Controle de acesso no banco de dados |

### 2.3 Qualidade de Código

| Ferramenta | Finalidade |
|---|---|
| ESLint | Linting de código |
| Prettier | Formatação consistente |
| Vitest | Testes unitários |

### 2.4 Variáveis de Ambiente Obrigatórias

Criar `.env.local` (nunca comitar no repositório):

```bash
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key-publica]
```

> **Atenção:** Nunca usar a `service_role_key` no frontend. A `anon_key` é segura para uso público **apenas se as RLS policies estiverem corretamente configuradas**. A service role key deve ser usada apenas em scripts de seed/migração executados localmente.

> **Regra:** Não substituir tecnologias sem justificativa técnica documentada. Não adicionar bibliotecas sem necessidade comprovada.

---

## 3. Identidade Visual

### 3.1 Paleta de Cores

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-green-dark` | `#4F6F4A` | Primária, sidebar, headers |
| `--color-green-light` | `#8DAA4D` | Destaques, badges, ações secundárias |
| `--color-orange-accent` | `#F28C38` | CTAs, alertas, destaques visuais |
| `--color-beige-light` | `#E9DDC8` | Fundos suaves, cards (tema claro) |
| `--color-brown-natural` | `#8C5A2B` | Elementos de apoio (uso moderado) |
| `--color-gray-text` | `#2D2D2D` | Textos principais |
| `--color-gray-muted` | `#6B7280` | Textos secundários e placeholders |

Esses tokens devem ser registrados no `tailwind.config.ts` como cores customizadas, garantindo uso consistente em todo o projeto.

### 3.2 Tema Claro e Escuro

- Implementar via Tailwind CSS `darkMode: 'class'` (strategy baseada em classe)
- Preferência inicial lida de `window.matchMedia('prefers-color-scheme')` na primeira visita
- Após escolha manual, preferência persistida em `localStorage` (chave: `nea-theme`)
- Toggle de tema disponível no header
- Todos os tokens de cor devem ter variante dark definida no `globals.css`

### 3.3 Diretrizes de Design

- Aparência **eco-tech**: equilíbrio entre natureza e tecnologia
- Visual **institucional contemporâneo** — sem aparência infantil ou genérica
- Cards com `border-radius: 12px` e sombra suave `shadow-sm`
- Layout modular, limpo, bom uso de espaços em branco
- **Responsivo:** desktop e tablet como prioridade; mobile adaptado (ver seção 9.3)
- Sidebar fixa colapsável (expandida: 240px, recolhida: 64px)
- Header fixo com busca global, notificações e perfil

### 3.4 Tipografia

- Fonte principal: **Inter** (via Google Fonts ou instalada localmente)
- Escala de tamanhos conforme Tailwind padrão
- Hierarquia: h1 (page title), h2 (section title), h3 (card title), body, caption

---

## 4. Perfis de Usuário e Controle de Acesso

### 4.1 Roles

Os roles são definidos como ENUM no banco e propagados para o JWT do Supabase via `app_metadata`. Valores válidos:

```
admin | marketing_team | collaborator
```

### 4.2 Matriz de Permissões

| Ação | Admin | Marketing Team | Collaborator |
|---|:---:|:---:|:---:|
| Gerenciar usuários e roles | ✅ | ❌ | ❌ |
| Ver todos os módulos | ✅ | ✅ | ✅ |
| Criar/editar perfil do projeto | ✅ | ✅ | ❌ |
| Criar/editar ideias | ✅ | ✅ | ❌ |
| Arquivar ideias | ✅ | ✅ | ❌ |
| Criar/editar estratégias | ✅ | ✅ | ❌ |
| Criar/editar posts | ✅ | ✅ | ❌ |
| Arquivar posts | ✅ | ✅ | ❌ |
| Criar tarefas | ✅ | ✅ | ❌ |
| Atualizar status de tarefas próprias | ✅ | ✅ | ✅ |
| Fazer upload no Drive | ✅ | ✅ | ❌ |
| Visualizar Drive e Documentos | ✅ | ✅ | ✅ |
| Registrar métricas | ✅ | ✅ | ❌ |
| Ver métricas | ✅ | ✅ | ✅ |
| Criar/editar documentos | ✅ | ✅ | ❌ |
| Criar revisão semanal | ✅ | ✅ | ❌ |
| Configurações do sistema | ✅ | ❌ | ❌ |

> Essa matriz deve ser implementada via **RLS policies no Supabase** E via **guards de rota e condicionais no frontend**. O frontend é a primeira barreira (UX), o banco é a barreira definitiva (segurança).

### 4.3 Propagação do Role para JWT

O role do usuário deve ser armazenado em `auth.users.raw_app_meta_data` com a chave `role`. Isso permite que políticas RLS acessem o role via:

```sql
(auth.jwt() -> 'app_metadata' ->> 'role')
```

Ao criar ou atualizar um usuário, usar uma Supabase Edge Function ou trigger para sincronizar o role da tabela `public.users` com os metadados do `auth.users`.

---

## 5. Módulos do Sistema

### 5.1 Dashboard

Tela inicial com:
- Cards de resumo: tarefas pendentes, posts agendados, ideias novas, notificações não lidas
- Calendário da semana atual (view compacta)
- Lista de próximas 5 tarefas por prazo
- Gráfico resumido de métricas dos últimos 30 dias
- Feed de atividade recente
- Atalhos rápidos para os principais módulos

> **Performance:** O dashboard deve usar uma Supabase RPC function (`get_dashboard_summary`) que agrega todos os dados em uma única chamada, evitando múltiplas queries paralelas que degradam o carregamento inicial.

### 5.2 Análise de Perfil do Projeto

Editor de documento único (singleton por projeto) com campos:
- Público-alvo
- Personas (texto estruturado)
- Objetivos do projeto
- Tom de voz
- Pilares de conteúdo
- Diferenciais do projeto
- Canais utilizados

> **Cardinalidade:** Existe **um único perfil** por projeto (registro singleton). A UI deve mostrar "editar" em vez de "criar" quando o perfil já existir. Apenas `admin` e `marketing_team` podem editar.

### 5.3 Banco de Ideias

CRUD com:
- Título e descrição
- Categoria (texto livre com sugestões: `educativo`, `institucional`, `entretenimento`, `campanha`, `informativo`)
- Formato: `reels` | `carrossel` | `story` | `post_estatico` | `video` | `campanha` | `outro`
- Status: `nova` | `em_uso` | `usada` | `arquivada`
- Tags (`text[]`)
- Vínculo opcional com estratégia (`strategy_id`)
- Busca full-text por título e descrição
- Filtros: status, formato, categoria, criado por

> **Regra:** Ideias **nunca são excluídas** do banco. O status `arquivada` equivale a exclusão lógica. A UI deve ocultar ideias arquivadas por padrão com opção de exibir.

### 5.4 Estratégias

CRUD com:
- Título da estratégia
- Mês e ano de referência (constraint: **uma estratégia por mês/ano**)
- Objetivos do mês (texto)
- Campanhas do mês (campo `jsonb` com array de objetos `{nome, descricao, periodo}`)
- Distribuição de conteúdo (texto ou structured field)
- Observações e aprendizados
- Ideias vinculadas (relação N:N via tabela `strategy_ideas`)
- Posts vinculados (via FK em `posts.strategy_id`)

### 5.5 Estratégias de Stories

CRUD com:
- Título
- Descrição / objetivo
- Sequência de stories: array de steps no formato `jsonb`:
  ```json
  [
    { "ordem": 1, "tipo": "imagem|video|texto", "descricao": "...", "duracao_seg": 10 },
    { "ordem": 2, "tipo": "enquete", "pergunta": "...", "opcoes": ["...", "..."] }
  ]
  ```
- Data agendada
- CTA (texto + link opcional)
- Vínculo com estratégia (`strategy_id`, opcional)

### 5.6 Posts / Conteúdo

CRUD com os campos:
- Título
- Descrição interna (briefing)
- Legenda para publicação
- Formato: `reels` | `carrossel` | `story` | `post_estatico` | `video` | `outro`
- Plataforma: `instagram` | `facebook` | `tiktok` | `linkedin` | `youtube` | `outro`
- Objetivo
- Responsável (`assigned_to` → FK para `users`)
- Data prevista de publicação (`scheduled_at`)
- Data efetiva de publicação (`published_at`)
- Vínculo com ideia de origem (`idea_id`, opcional)
- Vínculo com estratégia (`strategy_id`, opcional)
- Tarefas relacionadas (relação N:N via tabela `post_tasks`)
- Arquivos de mídia (relação N:N via tabela `post_media`)

**Status e transições permitidas:**

```
ideia → roteiro → em_producao → revisao → pronto → agendado → publicado
                                                              ↓
                                                          arquivado
```

- Transições para frente sempre permitidas para `admin` e `marketing_team`
- Retorno de status (`publicado` → `revisao`) apenas para `admin`
- Post com status `publicado` não pode ser excluído, apenas `arquivado`
- `published_at` é preenchido automaticamente quando status muda para `publicado`

### 5.7 Tarefas

CRUD com:
- Título e descrição
- Responsável (`assigned_to` → FK para `users`, **obrigatório**)
- Prazo (`due_date`, obrigatório)
- Prioridade: `baixa` | `media` | `alta` | `urgente`
- Status: `pendente` | `em_andamento` | `em_revisao` | `concluida`
- Post relacionado (`related_post_id`, opcional)
- Estratégia relacionada (`related_strategy_id`, opcional)

> **Importante:** O status `atrasada` **não é armazenado no banco** — é calculado dinamicamente no frontend e nas queries como `due_date < NOW() AND status != 'concluida'`. Isso evita inconsistência de dados e necessidade de jobs de atualização.

### 5.8 Calendário Editorial

- Visualização mensal e semanal
- Semana começa na **segunda-feira** (padrão brasileiro/ABNT)
- Exibe posts (por `scheduled_at`) e tarefas (por `due_date`)
- Drag and drop via dnd-kit: mover item entre dias atualiza `scheduled_at` ou `due_date`
- Restrições de drag: itens com status `publicado` ou `arquivado` não são arrastáveis
- Filtros: responsável, plataforma, status
- Clique em item abre modal de detalhes/edição rápida

### 5.9 Drive & Mídias

- Upload para **Supabase Storage** (bucket privado: `media-files`)
- Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `video/mp4`, `video/mov`, `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.*`
- Tamanho máximo por arquivo: **50MB** (imagens: 10MB, documentos: 20MB)
- Campos por arquivo: título, tipo, pasta/categoria, tags (`text[]`), tamanho em bytes, MIME type, nome original
- Preview: imagens via `<img>`, PDFs via `<iframe>` ou link, vídeos via `<video>`
- Organização em pastas (campo `folder`, texto livre)
- URLs de acesso: geradas via `supabase.storage.from('media-files').createSignedUrl(path, 3600)` (expiram em 1 hora — buckets privados)
- Vinculação com posts via tabela `post_media` (relação N:N)

### 5.10 Documentos Institucionais

- Tipos: `manual_marca` | `edital` | `guia` | `referencia` | `outro`
- Campos: título, descrição, categoria, arquivo interno (via Storage) **ou** link externo — apenas um dos dois é obrigatório
- Categorização e busca por título
- Download de arquivos internos via signed URL
- Visualização de links externos em nova aba

### 5.11 Métricas

- Registro manual de métricas por post e por data
- Campos: alcance, impressões, curtidas, comentários, compartilhamentos, salvamentos, cliques, crescimento de seguidores, notas
- Constraint: **um registro por `(post_id, date_reference)`**
- Gráficos (recharts): linha temporal de alcance/impressões, barras comparativas entre posts, área para crescimento de seguidores
- Filtros: período, plataforma, responsável pelo post
- Ranking de posts por melhor desempenho (métrica configurável)

> **Nota sobre `followers_growth`:** Este campo está na tabela `metrics` associado a um post, mas representa crescimento do canal. É um registro contextual ("nesse dia em que o post X foi publicado, o canal cresceu Y seguidores"). Não é uma métrica isolada de canal.

### 5.12 Revisão Semanal

CRUD com:
- Semana de referência: campo `week_start DATE` (data da segunda-feira da semana, tipo `DATE` no PostgreSQL)
- Constraint: **uma revisão por semana** (`UNIQUE(week_start)`)
- Campos de texto: o que foi postado, o que funcionou, o que não funcionou, aprendizados, próximas ações, prioridades da próxima semana

### 5.13 Central de Notificações

Tipos de notificação:
- `task_due`: tarefa vencendo (gerada quando `due_date` está a ≤ 2 dias)
- `post_scheduled`: post com publicação próxima (gerada 1 dia antes de `scheduled_at`)
- `system`: mensagem do sistema
- `mention`: menção a usuário (futuro)

**Mecanismo de geração:**
- Notificações `task_due` e `post_scheduled` são geradas por uma **Supabase Edge Function com schedule** executada diariamente às 8h
- Notificações `system` são criadas manualmente por `admin`
- Supabase Realtime é usado para push de novas notificações ao frontend (sem polling)

Campos: `id`, `title`, `message`, `type`, `read` (boolean), `user_id`, `created_at`, `expires_at`

### 5.14 Assistente Criativo — IFizinha

**Nome público:** IFizinha
**Subtítulo/codinome conceitual:** Naiá (referência cultural ao projeto)

Implementação v1 (mock local):
- Interface de chat com campo de prompt
- Histórico persistido no **banco de dados** (tabela `ai_interactions`), não em localStorage — garante histórico entre dispositivos e sessões
- Cards de sugestões por categoria: ideias de conteúdo, legendas, campanhas, análise de métricas
- Respostas simuladas por categoria (mock de alta qualidade, não placeholder genérico)

Interface de serviço desacoplada (contrato obrigatório para facilitar integração futura com IA real):

```typescript
// src/integrations/ai/IAIService.ts
interface IAIService {
  generateIdeas(context: IdeaContext): Promise<AISuggestion[]>
  generateCaption(postContext: PostContext): Promise<string>
  suggestCampaign(strategyContext: StrategyContext): Promise<CampaignSuggestion>
  analyzeMetrics(metricsData: MetricsContext): Promise<MetricsInsight>
  improvePost(post: Post): Promise<PostImprovement>
}
```

O mock implementa essa interface. A integração real (ex: Claude API) também implementará a mesma interface, sem necessidade de alteração no código consumidor.

---

## 6. Modelagem de Dados

### 6.1 Nomenclatura e Convenções

- Todas as tabelas em `snake_case`
- PKs sempre do tipo `uuid DEFAULT gen_random_uuid()`
- FKs seguem o padrão `[tabela_referenciada_singular]_id`
- Timestamps sempre com `TIMESTAMPTZ` (com fuso horário)
- Soft delete via campo `archived_at TIMESTAMPTZ NULL` (quando aplicável) ou campo `status` com valor `arquivado`/`arquivada`

### 6.2 Tipos ENUM do PostgreSQL

```sql
CREATE TYPE user_role AS ENUM ('admin', 'marketing_team', 'collaborator');
CREATE TYPE idea_status AS ENUM ('nova', 'em_uso', 'usada', 'arquivada');
CREATE TYPE idea_format AS ENUM ('reels', 'carrossel', 'story', 'post_estatico', 'video', 'campanha', 'outro');
CREATE TYPE post_status AS ENUM ('ideia', 'roteiro', 'em_producao', 'revisao', 'pronto', 'agendado', 'publicado', 'arquivado');
CREATE TYPE post_format AS ENUM ('reels', 'carrossel', 'story', 'post_estatico', 'video', 'outro');
CREATE TYPE post_platform AS ENUM ('instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'outro');
CREATE TYPE task_status AS ENUM ('pendente', 'em_andamento', 'em_revisao', 'concluida');
CREATE TYPE task_priority AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE document_category AS ENUM ('manual_marca', 'edital', 'guia', 'referencia', 'outro');
CREATE TYPE notification_type AS ENUM ('task_due', 'post_scheduled', 'system', 'mention');
```

### 6.3 Tabelas

```sql
-- Espelho de auth.users com dados de aplicação
-- ATENÇÃO: 'users' aqui é public.users — distinto de auth.users (gerenciado pelo Supabase)
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  role        user_role NOT NULL DEFAULT 'collaborator',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Trigger para criar registro em public.users ao criar usuário no Auth
-- Trigger para sincronizar role com auth.users.raw_app_meta_data

-- Perfil institucional do projeto (singleton — uma linha por projeto)
CREATE TABLE public.project_profile (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name      TEXT NOT NULL,
  target_audience   TEXT,
  personas          TEXT,
  tone_of_voice     TEXT,
  objectives        TEXT,
  content_pillars   TEXT,
  channels          TEXT[],
  differentials     TEXT,
  created_by        UUID NOT NULL REFERENCES public.users(id),
  updated_by        UUID REFERENCES public.users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- CONSTRAINT: tabela deve ter no máximo 1 registro (enforçado via trigger ou CHECK)

-- Estratégias mensais
CREATE TABLE public.strategies (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  month               SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year                SMALLINT NOT NULL CHECK (year BETWEEN 2020 AND 2100),
  objectives          TEXT,
  campaigns           JSONB DEFAULT '[]'::jsonb,
  -- campaigns schema: [{ "nome": "", "descricao": "", "periodo": "" }]
  distribution_notes  TEXT,
  observations        TEXT,
  created_by          UUID NOT NULL REFERENCES public.users(id),
  updated_by          UUID REFERENCES public.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (month, year)  -- uma estratégia por mês/ano
);

-- Banco de ideias
CREATE TABLE public.ideas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  format      idea_format NOT NULL DEFAULT 'outro',
  tags        TEXT[] DEFAULT '{}',
  status      idea_status NOT NULL DEFAULT 'nova',
  strategy_id UUID REFERENCES public.strategies(id) ON DELETE SET NULL,
  created_by  UUID NOT NULL REFERENCES public.users(id),
  updated_by  UUID REFERENCES public.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- SEM deleted_at: arquivamento é feito exclusivamente via status = 'arquivada'
);

-- Tabela de junção ideias <-> estratégias (N:N)
CREATE TABLE public.strategy_ideas (
  strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
  idea_id     UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  PRIMARY KEY (strategy_id, idea_id)
);

-- Estratégias de stories
CREATE TABLE public.story_strategies (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT NOT NULL,
  description    TEXT,
  sequence_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- sequence_steps schema: [{ "ordem": 1, "tipo": "imagem|video|texto|enquete", "descricao": "", "duracao_seg": 10 }]
  cta            TEXT,
  cta_link       TEXT,
  scheduled_date DATE,
  strategy_id    UUID REFERENCES public.strategies(id) ON DELETE SET NULL,
  created_by     UUID NOT NULL REFERENCES public.users(id),
  updated_by     UUID REFERENCES public.users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts / Conteúdos
CREATE TABLE public.posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  caption      TEXT,
  format       post_format NOT NULL,
  platform     post_platform NOT NULL,
  objective    TEXT,
  status       post_status NOT NULL DEFAULT 'ideia',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  idea_id      UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
  strategy_id  UUID REFERENCES public.strategies(id) ON DELETE SET NULL,
  assigned_to  UUID NOT NULL REFERENCES public.users(id),
  created_by   UUID NOT NULL REFERENCES public.users(id),
  updated_by   UUID REFERENCES public.users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- Exclusão física proibida via RLS policy (apenas arquivamento via status)
);

-- Tabela de junção posts <-> media_files (N:N)
CREATE TABLE public.post_media (
  post_id       UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  media_file_id UUID NOT NULL REFERENCES public.media_files(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, media_file_id)
);

-- Tarefas
CREATE TABLE public.tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL,
  description         TEXT,
  priority            task_priority NOT NULL DEFAULT 'media',
  status              task_status NOT NULL DEFAULT 'pendente',
  due_date            DATE NOT NULL,
  assigned_to         UUID NOT NULL REFERENCES public.users(id),
  related_post_id     UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  related_strategy_id UUID REFERENCES public.strategies(id) ON DELETE SET NULL,
  created_by          UUID NOT NULL REFERENCES public.users(id),
  updated_by          UUID REFERENCES public.users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- status 'atrasada' NÃO existe no banco — é calculado no frontend:
  -- is_overdue = due_date < CURRENT_DATE AND status != 'concluida'
);

-- Arquivos de mídia
CREATE TABLE public.media_files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  file_path         TEXT NOT NULL,  -- path relativo no bucket Supabase Storage
  file_url          TEXT,           -- URL pública (apenas para buckets públicos; usar signed URL para privados)
  file_type         TEXT NOT NULL,  -- MIME type completo (ex: 'image/jpeg')
  file_size_bytes   BIGINT,
  original_filename TEXT,
  folder            TEXT DEFAULT 'geral',
  tags              TEXT[] DEFAULT '{}',
  uploaded_by       UUID NOT NULL REFERENCES public.users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documentos institucionais
CREATE TABLE public.documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  category     document_category NOT NULL DEFAULT 'outro',
  file_path    TEXT,    -- arquivo interno no Storage (mutuamente exclusivo com external_url)
  external_url TEXT,    -- link externo (mutuamente exclusivo com file_path)
  created_by   UUID NOT NULL REFERENCES public.users(id),
  updated_by   UUID REFERENCES public.users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (file_path IS NOT NULL OR external_url IS NOT NULL)  -- pelo menos um dos dois é obrigatório
);

-- Métricas por post
CREATE TABLE public.metrics (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id          UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  date_reference   DATE NOT NULL,
  reach            INTEGER DEFAULT 0,
  impressions      INTEGER DEFAULT 0,
  likes            INTEGER DEFAULT 0,
  comments         INTEGER DEFAULT 0,
  shares           INTEGER DEFAULT 0,
  saves            INTEGER DEFAULT 0,
  clicks           INTEGER DEFAULT 0,
  followers_growth INTEGER DEFAULT 0,
  notes            TEXT,
  created_by       UUID NOT NULL REFERENCES public.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, date_reference)  -- um registro por post por dia
);

-- Revisões semanais
CREATE TABLE public.weekly_reviews (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start       DATE NOT NULL,  -- sempre segunda-feira da semana (enforçado via CHECK)
  posted_summary   TEXT,
  worked_well      TEXT,
  did_not_work     TEXT,
  lessons_learned  TEXT,
  next_actions     TEXT,
  created_by       UUID NOT NULL REFERENCES public.users(id),
  updated_by       UUID REFERENCES public.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (week_start),
  CHECK (EXTRACT(DOW FROM week_start) = 1)  -- DOW 1 = segunda-feira no PostgreSQL
);

-- Notificações
CREATE TABLE public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  message    TEXT,
  type       notification_type NOT NULL DEFAULT 'system',
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,  -- notificações expiradas podem ser purgadas automaticamente
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Histórico de interações com o Assistente IA
CREATE TABLE public.ai_interactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  prompt     TEXT NOT NULL,
  response   TEXT NOT NULL,
  category   TEXT,  -- 'ideas', 'caption', 'campaign', 'metrics', 'improve_post'
  is_mock    BOOLEAN NOT NULL DEFAULT TRUE,  -- FALSE quando integração real for ativada
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 6.4 Índices de Performance

```sql
-- Queries frequentes que precisam de índice
CREATE INDEX idx_ideas_status ON public.ideas(status);
CREATE INDEX idx_ideas_created_by ON public.ideas(created_by);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_platform ON public.posts(platform);
CREATE INDEX idx_posts_assigned_to ON public.posts(assigned_to);
CREATE INDEX idx_posts_scheduled_at ON public.posts(scheduled_at);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_metrics_post_id ON public.metrics(post_id);
CREATE INDEX idx_metrics_date_reference ON public.metrics(date_reference);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read);

-- Full-text search em ideias e posts
CREATE INDEX idx_ideas_fts ON public.ideas USING gin(to_tsvector('portuguese', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_posts_fts ON public.posts USING gin(to_tsvector('portuguese', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(caption, '')));
```

### 6.5 RPC Functions para o Dashboard

```sql
-- Agrega dados do dashboard em uma única chamada (evita N queries no frontend)
CREATE OR REPLACE FUNCTION get_dashboard_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'pending_tasks_count',   (SELECT COUNT(*) FROM tasks WHERE assigned_to = p_user_id AND status != 'concluida'),
    'overdue_tasks_count',   (SELECT COUNT(*) FROM tasks WHERE assigned_to = p_user_id AND status != 'concluida' AND due_date < CURRENT_DATE),
    'scheduled_posts_count', (SELECT COUNT(*) FROM posts WHERE status = 'agendado'),
    'new_ideas_count',       (SELECT COUNT(*) FROM ideas WHERE status = 'nova'),
    'unread_notifications',  (SELECT COUNT(*) FROM notifications WHERE user_id = p_user_id AND read = FALSE)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 7. Regras de Negócio

| # | Regra | Onde enforçar |
|---|---|---|
| RN01 | Apenas `admin` pode criar, editar e alterar roles de usuários | RLS + frontend guard |
| RN02 | Ideias nunca são excluídas do banco — status `arquivada` equivale a exclusão lógica | RLS (proibir DELETE) + UI |
| RN03 | Toda tarefa deve ter `assigned_to` e `due_date` preenchidos | Zod schema + NOT NULL no banco |
| RN04 | Posts com status `publicado` não podem ser excluídos, apenas arquivados | RLS (proibir DELETE quando status = 'publicado') + UI |
| RN05 | Métricas só podem existir associadas a um post existente | FK NOT NULL + RLS |
| RN06 | O calendário exibe posts por `scheduled_at` e tarefas por `due_date` | Lógica de query no frontend |
| RN07 | O status `atrasada` em tarefas é calculado no frontend, não armazenado | Query: `due_date < CURRENT_DATE AND status != 'concluida'` |
| RN08 | Existe apenas uma estratégia por mês/ano | UNIQUE constraint no banco |
| RN09 | Existe apenas uma revisão semanal por semana | UNIQUE constraint em `week_start` |
| RN10 | `week_start` deve ser sempre uma segunda-feira | CHECK constraint no banco |
| RN11 | Documentos devem ter arquivo interno OU link externo (ao menos um) | CHECK constraint no banco + Zod |
| RN12 | Apenas um registro em `project_profile` (singleton) | Trigger no banco que verifica COUNT |
| RN13 | `published_at` é preenchido automaticamente via trigger ao mudar status para `publicado` | Trigger no banco |
| RN14 | Drag and drop no calendário não permite mover posts com status `publicado` ou `arquivado` | Lógica no componente de calendário |
| RN15 | Um arquivo de mídia pode ser vinculado a múltiplos posts (relação N:N via `post_media`) | Modelagem N:N + UI multi-seleção |
| RN16 | Notificações com `expires_at` no passado devem ser ocultadas na UI e podem ser purgadas | Filtro no frontend + job periódico |
| RN17 | `role` do usuário é propagado para `auth.users.raw_app_meta_data` ao criar/atualizar | Trigger no banco |

---

## 8. Segurança

### 8.1 Esboço de RLS Policies

Cada tabela deve ter RLS habilitado. Exemplo de estrutura das policies:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
-- (repetir para todas as tabelas)

-- Exemplo: ideas
-- SELECT: todos os usuários autenticados podem ver ideias não arquivadas
CREATE POLICY "ideas_select" ON public.ideas
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND status != 'arquivada'
    -- Admin pode ver arquivadas também:
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- INSERT: admin e marketing_team podem criar
CREATE POLICY "ideas_insert" ON public.ideas
  FOR INSERT WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'marketing_team')
  );

-- UPDATE: admin e marketing_team podem editar; arquivamento é um update de status
CREATE POLICY "ideas_update" ON public.ideas
  FOR UPDATE USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'marketing_team')
  );

-- DELETE: proibido para todos (enforçar soft delete via status)
CREATE POLICY "ideas_delete" ON public.ideas
  FOR DELETE USING (FALSE);
```

> O SQL completo de todas as RLS policies será entregue na Etapa 2 como artefato separado.

### 8.2 Supabase Storage — Configuração de Buckets

| Bucket | Visibilidade | Uso |
|---|---|---|
| `media-files` | **Privado** | Imagens, vídeos, arquivos de posts |
| `documents` | **Privado** | Documentos institucionais |
| `avatars` | **Público** | Fotos de perfil dos usuários |

Buckets privados exigem URLs assinadas (`createSignedUrl`) com expiração de 1 hora para qualquer acesso de leitura. Isso deve ser implementado no serviço de mídia do frontend.

**Storage policies (exemplo):**
```sql
-- Apenas usuários autenticados podem fazer upload em media-files
CREATE POLICY "media_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media-files' AND auth.uid() IS NOT NULL
    AND (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'marketing_team')
  );
```

### 8.3 Validação de Upload

No frontend (Zod + React Hook Form), validar antes do upload:
- MIME type permitido (whitelist explícita)
- Tamanho máximo: imagens 10MB, vídeos 50MB, documentos 20MB
- Nome do arquivo sanitizado (sem caracteres especiais, sem path traversal)

### 8.4 Proteção de Dados (LGPD)

O sistema armazena dados pessoais (`name`, `email`, `avatar_url`). Considerações obrigatórias:
- Dados ficam no Supabase em região **São Paulo (sa-east-1)** — selecionar explicitamente ao criar o projeto
- Usuários só podem ser criados por `admin` (sem auto-cadastro público)
- Ao remover um usuário do Auth, o trigger `ON DELETE CASCADE` garante remoção de `public.users`
- Dados de métricas e conteúdos são institucionais, não pessoais

### 8.5 Gestão de Senhas e Sessão

- Senhas gerenciadas pelo Supabase Auth (mínimo 8 caracteres enforçado no Supabase Dashboard)
- Reset de senha via email habilitado
- Sessão JWT com expiração de 1 hora + refresh token automático
- Logout invalida sessão no Supabase Auth

---

## 9. Requisitos de UX

### 9.1 Layout Base

- **Sidebar:** fixa, colapsável (toggle por botão), expandida = 240px, recolhida = 64px
- **Header:** fixo no topo, altura 64px, contém: toggle sidebar, breadcrumbs, busca global, contador de notificações, avatar/menu do usuário
- **Área de conteúdo:** scroll independente, padding interno de 24px

### 9.2 Busca Global

- Escopo: `ideas` (título, descrição), `posts` (título, descrição, legenda), `tasks` (título), `documents` (título, descrição)
- Implementada via PostgreSQL full-text search (`to_tsvector` em português) usando os índices GIN definidos na seção 6.4
- Exibida em modal (atalho: `Ctrl+K` / `Cmd+K`)
- Resultados agrupados por tipo de conteúdo
- Mínimo 2 caracteres para disparar a busca (debounce de 300ms)

### 9.3 Responsividade

| Breakpoint | Comportamento |
|---|---|
| Desktop (≥1280px) | Sidebar expandida por padrão, layout completo |
| Tablet (768px–1279px) | Sidebar recolhida por padrão, expansível |
| Mobile (<768px) | Sidebar vira drawer (overlay), tabelas viram cards empilhados |

### 9.4 Estados Padrão

- **Loading:** Skeleton loader (não spinner genérico) para listas e páginas; spinner para ações pontuais (submit de formulário)
- **Empty state:** Ícone contextual + texto explicativo curto + botão de ação primária ("Criar primeira ideia", "Adicionar tarefa")
- **Erro de rede:** Toast de erro com opção de retry; dados em cache permanecem visíveis
- **Sucesso de formulário:** Toast de confirmação + redirect ou fechamento de modal
- **Confirmação de ação destrutiva:** Modal de confirmação com texto descritivo para arquivamento

### 9.5 Formulários

- Validação em tempo real via React Hook Form + Zod (erro exibido ao sair do campo ou ao submeter)
- Campos obrigatórios sinalizados com `*`
- Mensagens de erro em português, claras e específicas
- Submit button desabilitado durante loading

### 9.6 Acessibilidade (a11y)

- Contraste mínimo WCAG AA (4.5:1 para texto normal)
- Labels associados a todos os inputs (`htmlFor` ou `aria-label`)
- Navegação por teclado funcional em modais e dropdowns
- `aria-live` para toasts e atualizações dinâmicas

---

## 10. Estrutura de Pastas

### 10.1 Árvore de Diretórios

```
src/
├── assets/                   # Imagens, logos, fontes locais
├── components/
│   ├── ui/                   # Componentes base shadcn/ui + customizações
│   ├── layout/               # AppLayout, Sidebar, Header, Breadcrumbs, PageWrapper
│   ├── forms/                # Componentes de formulário reutilizáveis (FieldWrapper, etc.)
│   ├── tables/               # DataTable wrapper sobre TanStack Table
│   ├── charts/               # Wrappers recharts (LineChart, BarChart, AreaChart)
│   ├── calendar/             # CalendarMonth, CalendarWeek, DraggableItem
│   └── feedback/             # EmptyState, LoadingSkeleton, ErrorBoundary
├── constants/                # Enums, listas fixas, configurações de UI
│   ├── post-status.ts        # POST_STATUS com labels, cores, transições permitidas
│   ├── task-priority.ts      # TASK_PRIORITY com labels e cores
│   ├── platforms.ts          # PLATFORMS com ícones e labels
│   └── file-upload.ts        # ALLOWED_MIME_TYPES, MAX_FILE_SIZE
├── contexts/
│   ├── AuthContext.tsx        # Usuário autenticado, role, loading
│   └── ThemeContext.tsx       # Tema claro/escuro e toggle
├── features/                 # Lógica de domínio (um diretório por módulo)
│   ├── auth/
│   │   ├── components/       # LoginForm, LogoutButton
│   │   ├── hooks/            # useAuth.ts (consome AuthContext)
│   │   └── pages/            # LoginPage.tsx
│   ├── dashboard/
│   │   ├── components/       # DashboardCard, WeekCalendarWidget, MetricsSummary
│   │   ├── hooks/            # useDashboardSummary.ts
│   │   └── pages/            # DashboardPage.tsx
│   ├── profile/              # Análise de Perfil do Projeto
│   ├── ideas/                # Banco de Ideias
│   ├── strategies/           # Estratégias mensais
│   ├── stories/              # Estratégias de Stories
│   ├── posts/                # Posts / Conteúdo
│   ├── tasks/                # Tarefas
│   ├── calendar/             # Calendário Editorial
│   ├── media/                # Drive & Mídias
│   ├── documents/            # Documentos Institucionais
│   ├── metrics/              # Métricas
│   ├── reviews/              # Revisão Semanal
│   ├── notifications/        # Central de Notificações
│   └── ai/                   # Assistente Criativo (IFizinha)
│       ├── components/
│       ├── hooks/
│       └── pages/
├── hooks/                    # Hooks reutilizáveis entre múltiplas features
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   ├── useLocalStorage.ts
│   └── useFileUpload.ts
├── integrations/
│   ├── supabase/
│   │   ├── client.ts         # Instância tipada do Supabase client
│   │   └── types.ts          # Tipos gerados pelo Supabase CLI (database.types.ts)
│   └── ai/
│       ├── IAIService.ts     # Interface (contrato)
│       └── MockAIService.ts  # Implementação mock para v1
├── lib/
│   ├── queryClient.ts        # Instância e configuração do TanStack Query
│   └── utils.ts              # cn() e outras utilities de shadcn
├── pages/                    # Componentes de página mapeados às rotas (re-exportam de features/)
├── routes/
│   ├── AppRoutes.tsx         # Definição de todas as rotas
│   ├── PrivateRoute.tsx      # Guard: requer autenticação
│   └── RoleRoute.tsx         # Guard: requer role específico
├── schemas/                  # Schemas Zod por formulário
│   ├── idea.schema.ts
│   ├── post.schema.ts
│   ├── task.schema.ts
│   └── ...
├── services/                 # Acesso ao banco via Supabase por domínio
│   ├── ideas.service.ts
│   ├── posts.service.ts
│   ├── tasks.service.ts
│   └── ...
├── types/                    # Tipos TypeScript globais e interfaces de domínio
│   ├── models.ts             # Tipos de domínio (Idea, Post, Task, etc.)
│   └── api.ts                # Tipos de request/response
└── utils/                    # Funções utilitárias puras (sem side-effects)
    ├── date.utils.ts         # Helpers de data (semana ISO, formatação em pt-BR)
    ├── file.utils.ts         # Sanitização de nomes, formatação de tamanho
    └── status.utils.ts       # Helpers de status (is_overdue, can_transition, etc.)
```

### 10.2 Convenção de Organização

- `components/` → componentes **genéricos e reutilizáveis** entre múltiplos módulos
- `features/[módulo]/components/` → componentes **específicos de um módulo**
- `hooks/` → hooks reutilizáveis entre **múltiplos módulos**
- `features/[módulo]/hooks/` → hooks específicos de **um módulo**
- `services/` → toda comunicação com Supabase Database
- `integrations/` → configuração de clientes externos (Supabase, IA)
- `constants/` → valores literais que não pertencem a um único módulo
- Não usar `store/` — estado de servidor fica no TanStack Query; estado de UI global nos Contexts; estado local no `useState`

---

## 11. Performance e Infraestrutura

### 11.1 Estratégia de Cache (TanStack Query)

| Tipo de dado | staleTime | gcTime |
|---|---|---|
| Dashboard summary | 30 segundos | 5 minutos |
| Listas (ideas, posts, tasks) | 1 minuto | 10 minutos |
| Perfil do projeto | 10 minutos | 30 minutos |
| Métricas históricas | 5 minutos | 30 minutos |
| Notificações | 30 segundos | 5 minutos |

### 11.2 Code Splitting

- Cada feature é carregada via `React.lazy()` e `Suspense`
- O bundle inicial contém apenas: layout, auth, e dashboard
- Os demais módulos são carregados sob demanda ao navegar

### 11.3 Paginação

- Padrão: paginação server-side com `limit` e `offset`
- Listas com ≤50 itens: paginação client-side via TanStack Table
- Listas potencialmente grandes (métricas, mídias): paginação server-side com `useInfiniteQuery`

### 11.4 Ambiente e Deploy

| Ambiente | Supabase Project | Frontend Hosting |
|---|---|---|
| Desenvolvimento | Projeto Supabase separado (`nea-dev`) | `localhost:5173` via Vite |
| Produção | Projeto Supabase separado (`nea-prod`) | A definir (Vercel recomendado) |

> **Importante:** Usar projetos Supabase separados para dev e prod. Nunca usar o projeto de produção para desenvolvimento ou testes.

**Plano Supabase recomendado:** Pro (US$25/mês) — inclui 8GB de banco, 100GB de storage, backups diários e point-in-time recovery. O plano Free (500MB banco, 1GB storage) é adequado apenas para desenvolvimento.

**Região:** `sa-east-1` (São Paulo) — obrigatório para conformidade com LGPD.

### 11.5 Migrations de Banco

- Usar Supabase CLI para gerenciar migrations (`supabase migration new`)
- Nunca alterar schema de produção manualmente via Dashboard do Supabase
- Migrations em `supabase/migrations/` versionadas no repositório
- Toda alteração de schema passa por migration nomeada e revisada

---

## 12. Plano de Entrega

### 12.1 Etapas e Critérios de Aceite

| Etapa | Conteúdo | Critério de Done |
|---|---|---|
| **Etapa 1** | Arquitetura, estrutura de pastas, setup do repositório | Projeto cria, compila e roda em localhost sem erros |
| **Etapa 2** | SQL completo (schema + ENUMs + índices), RLS policies, tipos TypeScript | Banco criado no Supabase Dev; tipos gerados e importados |
| **Etapa 3** | Layout base, sidebar, header, rotas, autenticação (login/logout/guards) | Login funciona; rotas protegidas redirecionam para login; usuário com role visualiza apenas o permitido |
| **Etapa 4a** | Módulos core: Dashboard, Banco de Ideias, Estratégias, Posts | CRUD completo funcionando com dados reais do Supabase |
| **Etapa 4b** | Módulos de suporte: Tarefas, Calendário, Drive & Mídias, Documentos | Upload de arquivo funciona; calendário exibe posts e tarefas; drag and drop funcional |
| **Etapa 4c** | Módulos de análise: Métricas, Revisão Semanal, Notificações, Assistente IA | Gráficos renderizados com dados reais; notificações em tempo real via Realtime |
| **Etapa 5** | Seed completo, README profissional, instruções de setup | `npm run seed` popula banco de dev com dados ricos; README permite setup em <15 minutos |

### 12.2 Ordem de Implementação (por dependências)

```
Auth + Usuários
    ↓
Layout base + Rotas
    ↓
Perfil do Projeto
    ↓
Estratégias ← Banco de Ideias (strategy_id)
    ↓
Posts (idea_id, strategy_id)
    ↓
Tarefas (related_post_id, related_strategy_id)
    ↓
Calendário (consome posts + tarefas)
    ↓
Drive & Mídias → vincula a Posts (post_media)
    ↓
Documentos
    ↓
Métricas (post_id obrigatório)
    ↓
Revisão Semanal
    ↓
Notificações (Realtime)
    ↓
Assistente IA (mock)
    ↓
Seed + README
```

---

## 13. Princípios de Desenvolvimento

- **Clean Code:** nomes claros e descritivos, funções com única responsabilidade, sem abreviações ambíguas
- **Componentes reutilizáveis:** extrair componente quando o mesmo JSX aparece 2+ vezes
- **Separação de responsabilidades:** UI nos components, queries nos services, validação nos schemas
- **Modular e escalável:** cada feature isolada em sua pasta — outra pessoa deve conseguir entender o módulo sem ler o resto do código
- **Comentários apenas em pontos críticos:** lógica de RLS, algoritmos não-óbvios, integrações externas
- **Sem over-engineering:** só o necessário para o escopo atual; não antecipar requisitos hipotéticos
- **Código real:** sem pseudocódigo, sem protótipos visuais sem lógica
- **Type safety total:** sem `any` no TypeScript; tipos de banco gerados pelo Supabase CLI usados em toda a camada de serviços

---

## 14. Restrições e Proibições

- Não substituir tecnologias da stack sem justificativa técnica documentada neste arquivo
- Não adicionar bibliotecas sem necessidade comprovada
- Não entregar apenas landing page ou protótipo visual sem lógica
- Não usar `any` no TypeScript
- Não usar `service_role_key` do Supabase no código frontend
- Não hardcodar strings de status, roles ou plataformas — usar as constantes de `src/constants/`
- Posts com status `publicado` nunca são deletados (apenas arquivados)
- Ideias nunca são deletadas (apenas arquivadas via status)
- Não criar estruturas monolíticas: cada feature em sua pasta, cada serviço em seu arquivo
- Não commitar `.env` ou `.env.local` no repositório

---

*Documento revisado em: 2026-03-24*
*Projeto: NEA Marketing Hub — NEA Vale do Ivaí / IFPR*
