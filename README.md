# English Path

Plataforma de inglês para um aluno brasileiro com rotina variável. A aplicação funciona localmente, sem conta e sem API paga: aulas, atividades, histórico, flashcards e revisões permanecem no navegador. Este repositório contém somente a plataforma English Path.

## Executar

Requisito: Node **20.20.2**, indicado em `.nvmrc`. O ambiente de nuvem já possui esse runtime em `/workspace/.cloud-setup/node-v20.20.2-linux-x64/bin`.

```bash
cd /workspace/apps
export PATH=/workspace/.cloud-setup/node-v20.20.2-linux-x64/bin:$PATH
npm ci
npm run dev -- --port 5173
```

Fora deste ambiente, use seu gerenciador de versões para ativar a versão de `.nvmrc` antes de executar `npm ci`. O projeto usa React, TypeScript, Vite, React Router, CSS organizado por responsabilidade, IndexedDB (`idb`), Lucide e Workbox.

```bash
npm test                    # testes de regras, conteúdo, persistência e mesclagem
npm run build               # TypeScript + produção + service worker
npm run preview             # servir a versão de produção
npm run test:e2e            # Playwright; inicia preview na porta 4173
```

O Playwright usa `/usr/bin/chromium` neste ambiente. Em outras máquinas, instale o Chromium do Playwright (`npx playwright install chromium`); a configuração detecta o navegador do sistema quando disponível. O modo offline deve ser testado em **produção**, não no servidor de desenvolvimento.

## O que está implementado

- Dashboard com dados reais, retomada da última aula, sessões sugeridas de 5/15/30 minutos, recomendações e gráficos de 7/30/90 dias.
- **24 unidades de gramática**, organizadas de A1 a C1, com objetivos, explicação em português, estrutura visual, exemplos traduzidos e falados, erro comum, prática guiada, sete exercícios e duas questões reservadas de avaliação.
- **92 palavras e expressões**, em 23 categorias: contexto, tradução, IPA, ilustração por categoria, áudio sintetizado e botão para flashcards.
- **338 questões**: 257 de estudo e 81 reservadas para avaliações. Há escolha, lacunas, ordenação de palavras, tradução, correção de erro, ditado e associação de ilustração/áudio a significado. A avaliação não tenta compreender qualquer resposta livre: aceita respostas cadastradas com normalização de caixa, pontuação, espaços e contrações suportadas.
- Seis situações de listening sintetizado e quatro textos de leitura; transcrição, tradução, repetição de frases e perguntas de compreensão.
- Speaking com síntese, reconhecimento quando suportado, comparação de palavras, gravação local temporária, reprodução da gravação e alternativa digitada. Não há nota fonética inventada.
- Writing com quatro propostas, respostas-modelo, checklist e autoavaliação. Rascunhos são preservados durante a digitação. O sistema não afirma corrigir semanticamente escrita livre.
- Flashcards com criação, edição, exclusão, histórico e SM-2 adaptado; revisão de cartões vencidos e indicação da próxima data.
- Diagnóstico, avaliação por unidade e simulado por nível. Questões menos utilizadas são priorizadas. Uma avaliação em andamento mantém posição e respostas após recarga.
- Histórico de respostas e tentativas, tempo com a página visível, classificações por tópico, conquistas sem sequência obrigatória e exportação/importação validada de backup.
- Tema claro/escuro/sistema, navegação por teclado, foco visível, menu móvel com controle de foco, avisos acessíveis e respeito a movimento reduzido.
- **Jogos livres**: memória inglês–português, Chuva de palavras (digitação) e Palavra secreta. Acesso independente das aulas, com recordes locais e sem afetar o progresso acadêmico.
- PWA com conteúdo local em cache e modo offline, além de configuração opcional real de autenticação/sincronização Supabase.

## Progresso e dados

O banco `english-path`, store `state`, guarda um documento versionado. Um journal síncrono em localStorage recupera uma atualização se a página fechar antes de a transação IndexedDB terminar. O journal é removido depois de confirmado o commit. Não contém senhas nem gravações de áudio.

O progresso da aula guarda a etapa atual. Concluir uma unidade exige praticar os sete exercícios e acertar as duas questões finais. A posição e os resultados de avaliações globais também ficam salvos. Sessões rápidas também mantêm a seleção de questões, posição e respostas após recarga.

O tempo de estudo representa a página visível fora de `/games` e suas subrotas, registrado em intervalos, ao ocultar a aba e ao entrar nos jogos; não é prova de atenção. Relógios e datas usam o dispositivo do aluno.

Classificação usa até 20 **primeiras tentativas** por tópico, excluindo respostas com apoio e autoavaliações:

| Estado              | Critério                                                               |
| ------------------- | ---------------------------------------------------------------------- |
| Não iniciado        | Sem tentativas elegíveis                                               |
| Precisa de revisão  | Pelo menos 2 erros e aproveitamento abaixo de 70%                      |
| Bom domínio         | Pelo menos 4 questões distintas e 80%                                  |
| Domínio consolidado | Pelo menos 8 questões distintas, 90% e atividade em pelo menos 2 datas |
| Em aprendizagem     | Demais casos                                                           |

Prática oral e escrita livre não recebem uma nota de domínio a partir de autoavaliação. O nível de partida A2 é uma informação inicial do perfil. Resultados de testes são amostras por competência, não certificação nem uma inferência de CEFR global.

### Revisão espaçada

SM-2 adaptado em `src/utils/learning.ts`: notas 0, 3, 4 e 5. Esquecimento reinicia repetições e agenda em um dia. Respostas lembradas geram intervalos de 1 dia, 6 dias e depois intervalo anterior × facilidade. A facilidade começa em 2,5 e usa `EF += 0.1 - (5-q)*(0.08+(5-q)*0.02)`, com piso 1,3. Cada revisão registra nota, data e intervalo. Intervalos são sugestões; não estudar em uma data não gera penalização.

### Backup

Em **Configurações → Exportar JSON**, baixe o estado acadêmico completo. Faça isso antes de limpar dados do navegador ou trocar de dispositivo. Para restaurar, importe um JSON de até 10 MB, confira o resumo e escolha **Mesclar backup**. Arquivos incompatíveis, campos inválidos e IDs duplicados são recusados antes de alterar o estado. Respostas/testes/sessões são unidos por ID; entidades editáveis usam a atualização mais recente. Exclusões de flashcards são marcadores persistentes.

## Jogos livres

Abra **Jogos livres**, no menu, a qualquer momento. Os jogos usam o vocabulário local, não exigem conclusão de aulas e funcionam offline após o primeiro carregamento da versão de produção.

- **Memória em dois idiomas:** combine inglês e tradução em tabuleiros de 4, 6 ou 8 pares, sem limite de tempo. Vence ao encontrar todos os pares; o recorde é o menor número de jogadas por tamanho.
- **Chuva de palavras:** digite uma palavra visível e envie com Enter ou o botão. Dez acertos vencem; três palavras expiradas encerram a rodada. Há três velocidades, pausa manual e pausa automática ao ocultar a aba. O recorde considera apenas o tempo ativo, separado por velocidade.
- **Palavra secreta:** use a tradução como dica e o teclado físico ou da tela para descobrir as letras. Seis letras incorretas encerram a rodada; revelar a resposta também encerra. O recorde é o menor número de erros em uma vitória.

Partidas não geram respostas acadêmicas, revisões, conquistas, recomendações, notas nem tempo de estudo. Recordes e totais de partidas concluídas usam somente a chave `english-path-casual-games-v1` do localStorage. Não entram no backup acadêmico nem na sincronização Supabase. Rodadas em andamento recomeçam ao recarregar ou sair; rodadas abandonadas não contam para os totais. Limpar os dados do site apaga os recordes locais.

## Supabase opcional

Sem configuração, o modo local permanece integral e a interface informa que a nuvem está desativada.

1. Crie um projeto Supabase e execute `supabase/migrations/001_learning_states.sql` no SQL Editor, ou aplique a migration pelo CLI.
2. Habilite autenticação por e-mail e senha. Configure os endereços permitidos de confirmação/redirecionamento para seu site no painel Auth.
3. Copie `.env.example` para `.env.local` e configure **apenas valores públicos**:

   ```dotenv
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica-anon-ou-publishable
   ```

4. Reinicie o Vite ou gere um novo build. Crie a conta em Configurações, confirme o e-mail se solicitado e entre.
5. Use **Sincronizar agora** em cada dispositivo. A sincronização é manual e informa erros; não aparece como ativa antes de funcionar.

Nunca use `service_role`, chave secreta ou credencial privada no frontend. Variáveis VITE são públicas no bundle. O aplicativo não solicita que valores privados sejam colados no chat.

O esquema usa `user_id = auth.uid()`, RLS para leitura/inserção/atualização do próprio usuário e RPC com `security invoker`. A versão otimista impede sobrescrita silenciosa: o cliente lê, mescla, tenta gravar com a versão lida e relê até três vezes em caso de conflito. Histórico é unido por ID; perfil, posição de aula e cartões usam timestamp mais recente. Exclusões têm tombstones. Relógios incorretos podem afetar a resolução por timestamp. Não há sincronização automática nem colaboração simultânea de vários alunos.

Sem credenciais de um projeto real, autenticação, envio de e-mails, execução da migration e isolamento entre usuários no serviço remoto **não foram validados de ponta a ponta**. As funções de mesclagem são cobertas por testes locais.

## Publicar no Cloudflare Workers

O site está na raiz do repositório, preparado para o projeto **apps** mostrado no painel Workers e Pages. O arquivo `wrangler.jsonc` declara os arquivos estáticos em `dist`, configura o fallback de rotas React e executa o build automaticamente antes de publicar.

No projeto Cloudflare conectado ao GitHub, use:

| Configuração               | Valor                                                                            |
| -------------------------- | -------------------------------------------------------------------------------- |
| Repositório                | `joaolucasqueiros/apps`                                                          |
| Branch de produção         | `main`                                                                           |
| Diretório raiz             | `/` (raiz do repositório)                                                        |
| Comando de build do painel | deixe vazio; o Wrangler executa `npm run build`                                  |
| Comando de deploy          | `npm run deploy` — o comando existente `npx wrangler deploy` também funciona     |
| Node.js                    | `20.20.2`, definido em `.nvmrc`; se necessário, configure `NODE_VERSION=20.20.2` |

Salve e implante o commit mais recente da `main`. Se a integração automática estiver habilitada, o push da limpeza já inicia uma nova implantação. O nome `apps` em `wrangler.jsonc` deve corresponder ao nome do Worker no painel.

Para conferir o empacotamento sem publicar nem exigir credenciais Cloudflare:

```bash
npm run deploy:check
```

Para executar o mesmo roteamento de arquivos estáticos localmente:

```bash
npx wrangler dev --local
```

O erro “Could not detect a directory containing static files” ocorria porque o repositório ainda tinha o bot antigo na raiz e nenhuma configuração de assets. Agora a raiz contém o aplicativo React, e o Wrangler cria `dist` antes de localizá-lo.

## Publicar no Cloudflare Pages

1. Conecte este repositório no Pages.
2. Diretório raiz: `/` (raiz do repositório).
3. Comando de build: `npm run build`.
4. Diretório de saída: `dist`.
5. Configure `NODE_VERSION=20.20.2` e, opcionalmente, as duas variáveis públicas Supabase.
6. Publique pelo painel. Sem um arquivo `404.html` na raiz, o Pages usa o fallback de SPA para as rotas React. No Workers, esse fallback está explícito em `wrangler.jsonc`.

HTTPS é necessário para service workers e microfone fora de loopback. O build e o empacotamento Wrangler são validados localmente. O resultado da implantação remota deve ser conferido no painel Cloudflare após o push. Para publicar o **ambiente de desenvolvimento Codex**, revise/salve a configuração do ambiente e use a publicação oferecida pelo produto; isso é independente do deploy do site.

## Offline, voz e vídeo

Depois da primeira visita à versão de produção, Workbox mantém o shell e o conteúdo empacotado em cache. Respostas e flashcards usam o banco local. Updates aguardam o ciclo de ativação do service worker; feche as outras abas do site se uma versão antiga persistir.

A síntese usa as vozes disponíveis no navegador/sistema; algumas dependem de rede. Reconhecimento de fala pode ser indisponível ou usar um serviço externo do navegador. O aluno pode praticar sem microfone. Gravações não são enviadas à nuvem e são descartadas ao sair da sessão.

O componente `VideoPlayer` incorpora vídeos sob demanda usando `youtube-nocookie.com`, com título, canal, motivo, tema, idioma, duração opcional, link externo e alternativa quando a incorporação falhar. A verificação por oEmbed recebeu HTTP 403 neste ambiente. Por isso, a lista inicial está vazia e a interface indica **curadoria pendente**; não foram inventados IDs. Vídeos não são armazenados offline.

Para adicionar um vídeo:

1. Confirme o vídeo no canal oficial e valide o ID no YouTube/oEmbed, sem API paga.
2. Confirme que o canal permite incorporação e confira o conteúdo pedagógico.
3. Cadastre um objeto `Video` em `src/content/videos.ts`, incluindo `verifiedAt`, `lessonId`, metadados e motivo da recomendação.
4. A biblioteca renderiza o player automaticamente. A aula relacionada também apresenta os vídeos daquele `lessonId`.
5. Revise periodicamente, pois a permissão de incorporação pode mudar.

## Organização e novo conteúdo

```text
src/
  components/      exercícios, áudio, player de vídeo e elementos visuais
  games/           regras, componentes e recordes dos jogos casuais
  layouts/         navegação e estrutura responsiva
  pages/           áreas de estudo e configurações
  content/         unidades, vocabulário, histórias e curadoria
  types.ts         contratos tipados
  persistence/     IndexedDB, journal e validação de backup
  hooks/           estado de aprendizagem e tempo de estudo
  auth/            Supabase e sincronização
  assessments/     banco de questões e seleção reservada
  utils/           correção, SM-2, domínio e mesclagem
  styles/          base, layout, dashboard e atividades
  tests/           testes unitários e de integridade
tests/             fluxos de navegador Playwright
supabase/migrations/ esquema, RLS e RPC
wrangler.jsonc      build e assets do Cloudflare Workers
```

Dados pedagógicos ficam fora dos componentes. Para adicionar uma unidade, siga o contrato `Lesson` e o formato dos seeds em `content/lessons.ts`: identificador estável, nível, objetivos, explicação, fórmula, exemplos, erro comum, prática guiada, contexto e perguntas de avaliação diferentes das de estudo. Em rows, `<…>` marca a parte-alvo e `|` separa a tradução. Revise cada gabarito, os distratores e o uso real. `answers` admite alternativas explícitas; não acrescente equivalências sem verificar o sentido.

Vocabulário segue `Word`, histórias seguem `Story`. IDs existentes não devem mudar, pois o histórico os referencia. Ao alterar o formato de persistência, crie uma migração e mantenha compatibilidade de backup. Atualize os testes de integridade quando ampliar deliberadamente o banco; os números atuais refletem o conteúdo entregue.

## Estado e limites

Consulte [STATUS.md](STATUS.md) para o registro de entrega. O núcleo local funciona e foi testado em Chromium, inclusive persistência, retomada, revisão, importação/exportação, mobile e offline. A cobertura de B2/C1 é inicial; 24 unidades não representam um curso integral de todos os níveis CEFR. Os 338 itens usam um corpus pedagógico inicial, não uma validação editorial externa. Não existe avaliador de IA para respostas livres.

Permanecem dependentes de configuração ou curadoria: Supabase real, vídeos verificados e deploy Cloudflare. Safari/Firefox, qualidade acústica, envio de e-mail e áudio físico/microfone em dispositivos reais não foram validados neste ambiente. A experiência não depende deles para estudar localmente.
