# Registro de implementação

## Concluído

- English Path na raiz do repositório; arquivos do projeto anterior removidos após backup privado verificado.
- React/TypeScript/Vite, React Router, identidade própria, sidebar desktop e menu móvel.
- 15 áreas de navegação, estados vazios úteis e controles com ações reais.
- Jogos livres separados do curso: memória bilíngue, digitação com palavras na tela e palavra secreta; recordes locais, teclado/toque e pausa automática na digitação. Tempo de jogos excluído do tempo de estudo.
- 24 unidades com prática guiada, 7 atividades e 2 avaliações cada.
- 92 palavras/expressões em 23 categorias; 6 situações de listening e 4 textos de leitura.
- 338 questões, com 257 itens de estudo e 81 reservados para avaliação.
- Persistência IndexedDB, proteção de gravações imediatas, retomada de aulas e avaliações, rascunhos de escrita.
- Flashcards, SM-2 adaptado, edição/exclusão e histórico de revisões.
- Prática oral por síntese/reconhecimento quando disponível e alternativa sem microfone; gravação temporária local.
- Writing com modelos e checklist, sem fingir compreensão livre.
- Dados reais de progresso, dificuldade, recomendações e conquistas sem sequência obrigatória.
- Diagnóstico, avaliações por módulo, simulados por nível e histórico.
- Backup validado, importação por mesclagem, temas e preferência de voz.
- Esquema Supabase com RLS, autenticação opcional e sincronização manual com controle de conflito.
- PWA de produção com cache offline e configuração de deploy Cloudflare Workers/Pages.
- Wrangler 4.86.0 fixado, build automático e assets `dist` com fallback SPA.

## Validação local

- TypeScript e build de produção executados com Node 20.20.2.
- Vitest: correção, integridade dos 338 itens, separação de avaliações, SM-2, classificações, IndexedDB, recuperação, backup e conflitos.
- Playwright/Chromium: aulas, feedback, retomada, flashcards, revisão, perfil/tema, diagnóstico, backup, modo sem microfone, rotas móveis e offline de produção.
- Inspeção visual desktop (1440 px) e celular (390 px).
- Depois da inclusão dos jogos: build, 26 testes Vitest e 16 testes Playwright aprovados na raiz. Os fluxos verificam vitórias/derrotas, pausas, persistência de recordes, celular, cache offline e isolamento do progresso e tempo acadêmicos.
- Wrangler deploy --dry-run aprovado; emulação local serviu a rota direta da aula e o service worker com HTTP 200, sem erros de JavaScript.

Os resultados finais executados são informados na entrega. Não há teste remoto Supabase nem deploy publicado.

## Pendências e limites explícitos

- Validar vídeos e liberar os destinos necessários à curadoria no ambiente: a consulta YouTube/oEmbed retornou HTTP 403. O player está implementado e a lista permanece vazia até a verificação.
- Configurar um projeto Supabase, aplicar a migration e validar autenticação/RLS/sincronização com usuários reais, caso a nuvem seja desejada.
- Confirmar a implantação remota no painel Cloudflare e testar o endereço HTTPS de produção.
- Expandir a profundidade de B2/C1, aumentar textos/áudios e realizar revisão editorial independente do corpus.
- Validar voz/microfone em dispositivos reais e navegadores adicionais. Síntese disponível não garante reconhecimento de fala ou áudio offline.
- Aulas, avaliações, sessões rápidas e rascunhos têm retomada persistente. Rodadas de jogos em andamento recomeçam ao sair ou recarregar; apenas os recordes de partidas concluídas persistem localmente.
- A plataforma não fornece certificação CEFR, nota acústica profissional nem correção semântica de escrita livre.
