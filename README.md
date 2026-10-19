# VIRA · Inglês que vira conversa

Plataforma de inglês para um aluno brasileiro com rotina variável. A aplicação funciona localmente, sem conta e sem API paga: aulas, atividades, histórico, flashcards e revisões permanecem no navegador. Este repositório contém somente a plataforma VIRA.

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

- Identidade VIRA com logo própria, fonte Space Grotesk local, paleta laranja/azul/lima, navegação em grupos, barra móvel e temas. Painel com missão principal, próximos passos, sessões de 5/15/30 minutos, gráfico selecionável e evidências por habilidade. O gráfico conta primeiras respostas independentes e preserva lacunas em dias sem dados.
- **48 aulas de estruturas e comunicação**, organizadas de A1 a C1, com objetivos, explicação em português, estrutura visual, exemplos traduzidos e falados, erro comum, prática guiada, sete exercícios e duas questões reservadas de avaliação.
- **171 palavras e expressões**, em 29 categorias: contexto, tradução, IPA quando cadastrado, ilustração por categoria, áudio sintetizado e botão para flashcards.
- **761 questões**: 601 de estudo e 160 reservadas para avaliações. Há escolha, lacunas, ordenação de palavras, tradução, correção de erro, ditado e associação de ilustração/áudio a significado. A avaliação não tenta compreender qualquer resposta livre: aceita respostas cadastradas com normalização de caixa, pontuação, espaços e contrações suportadas.
- 12 situações de listening sintetizado e 10 textos de leitura; transcrição, tradução, repetição de frases e perguntas de compreensão.
- Speaking com síntese, reconhecimento quando suportado, comparação de palavras, gravação local temporária, reprodução da gravação e alternativa digitada. Não há nota fonética inventada.
- Writing com 12 propostas, respostas-modelo, dicas automáticas de padrões de erro, checklist e autoavaliação. Rascunhos são preservados durante a digitação. O sistema não afirma corrigir semanticamente escrita livre.
- **Seis cenas interativas, com 92 elementos:** corpo, casa, carro, trânsito, restaurante e cotidiano. Toque na ilustração ou nos pontos, veja inglês/tradução/exemplo, ouça e crie flashcards. Desafios de localização registram respostas.
- **12 conversas guiadas de quatro turnos**, com resposta livre por texto/voz, retomada, ajuda opcional e critérios explícitos.
- **Oito práticas de pronúncia**, cinco projetos de comunicação por nível e diagnóstico de produção complementar à avaliação objetiva.
- Revisão adaptativa de erros e sessões que combinam gramática, vocabulário, listening e reading, com sugestões de produção ao terminar.
- Flashcards com criação, edição, exclusão, histórico e SM-2 adaptado; revisão de cartões vencidos e indicação da próxima data.
- Diagnóstico, avaliação por unidade e simulado por nível. Questões menos utilizadas são priorizadas. Uma avaliação em andamento mantém posição e respostas após recarga.
- Histórico de respostas e tentativas, tempo com a página visível, classificações por tópico, conquistas sem sequência obrigatória e exportação/importação validada de backup.
- Tema claro/escuro/sistema, navegação por teclado, foco visível, menu móvel com controle de foco, avisos acessíveis e respeito a movimento reduzido.
- **VIRA Arcade com sete jogos**, desafios, XP, precisão e recordes, separado das notas e do tempo de estudo. Perfil com níveis, ranks D/C/B/A/S, oito selos e backup dos jogos.
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

Prática oral e escrita livre não recebem uma nota de domínio a partir de autoavaliação. A2 é o ponto de partida padrão, que pode ser alterado no diagnóstico prático e orienta a trilha e as sessões. Resultados de testes são amostras por competência, não certificação nem uma inferência de CEFR global.

### Revisão espaçada

SM-2 adaptado em `src/utils/learning.ts`: notas 0, 3, 4 e 5. Esquecimento reinicia repetições e agenda em um dia. Respostas lembradas geram intervalos de 1 dia, 6 dias e depois intervalo anterior × facilidade. A facilidade começa em 2,5 e usa `EF += 0.1 - (5-q)*(0.08+(5-q)*0.02)`, com piso 1,3. Cada revisão registra nota, data e intervalo. Intervalos são sugestões; não estudar em uma data não gera penalização.

### Backup

Em **Configurações → Exportar JSON**, baixe o estado acadêmico completo. Faça isso antes de limpar dados do navegador ou trocar de dispositivo. Para restaurar, importe um JSON de até 10 MB, confira o resumo e escolha **Mesclar backup**. Arquivos incompatíveis, campos inválidos e IDs duplicados são recusados antes de alterar o estado. Respostas/testes/sessões são unidos por ID; entidades editáveis usam a atualização mais recente. Exclusões de flashcards são marcadores persistentes.

## Cenas e prática de comunicação

- **Cenas interativas** (`/explore`): seis ilustrações próprias em SVG. A seleção mostra o nome em inglês, tradução, frase traduzida e síntese de voz. Há lista acessível, navegação por teclado, indicador de elementos explorados e desafios de seis itens. Descobertas e respostas ficam salvas; uma rodada de desafio em andamento recomeça ao sair. Explorar não concede automaticamente um acerto. As palavras novas também aparecem no vocabulário e nos jogos.
- **Conversação** (`/conversation`): 12 situações do cotidiano, viagens e trabalho. Cada roteiro tem quatro turnos; respostas e rascunhos são retomados após recarga. É prática guiada, sem interlocutor de IA. As produções são autoavaliadas e não entram no cálculo de domínio objetivo.
- **Prática e projetos** (`/practice`): erros por tema com frases ainda não respondidas antes das repetidas; oito práticas de sons/ritmo; cinco projetos A1–C1; diagnóstico de fala/escrita complementar ao teste objetivo. O portfólio e as evidências por habilidade aparecem em Minha evolução.
- **Sessões flexíveis**: 5/15/30 minutos são estimativas, não cronômetros. Elas propõem 4/7/12 questões em quatro habilidades objetivas e priorizam nível e dificuldades. Conversação e escrita são sugeridas para complementar a produção.
- **Escrita**: 15 famílias de padrões locais fornecem trechos, sugestões, explicações e links para as aulas. Não há correção semântica integral nem alteração automática do texto. Ausência de alertas não comprova correção.

As novas produções e critérios usam `attempts`/`drafts` do estado acadêmico existente. Continuam compatíveis com backup e sincronização manual, sem migração destrutiva. As autoavaliações permanecem excluídas das notas objetivas.

## Áudio humano e gravações

Listening oferece links para VOA, British Council e BBC e uma área para importar **uma gravação própria ou autorizada de até 20 MB**. O arquivo fica no IndexedDB `english-path-media`, store `clips`, e pode ser ouvido offline neste navegador. Importar outro substitui o arquivo atual. Transcrição e anotações ficam nos rascunhos; a reflexão salva é autoavaliação, sem nota automática de compreensão. O arquivo binário não entra no backup JSON nem no Supabase.

As tentativas de consultar ELLLO, Wikimedia e VOA receberam HTTP 403 do proxy neste ambiente. Por isso, não foram cadastrados arquivos externos como verificados nem incluídas gravações humanas de terceiros no pacote. Os links de recursos não constituem validação de disponibilidade ou de permissões para redistribuir áudios. As 12 lições locais usam voz sintetizada e estão identificadas assim.

Nas conversas, projetos e pronúncia, o aluno pode transcrever pelo navegador ou gravar até 90 segundos para se ouvir e baixar o arquivo. Essa gravação é temporária; sair descarta a cópia da sessão. O acesso ao microfone só começa após o botão correspondente e depende da autorização do navegador. Transcrição pode depender de um serviço externo; gravação e reprodução locais não calculam nota acústica.

## Jogos livres

Abra **Jogos livres**, no menu, a qualquer momento. Os jogos usam o vocabulário local, não exigem conclusão de aulas e funcionam offline após o primeiro carregamento da versão de produção.

- **Memória em dois idiomas:** combine inglês e tradução em tabuleiros de 4, 6 ou 8 pares, sem limite de tempo. Vence ao encontrar todos os pares; o recorde é o menor número de jogadas por tamanho.
- **Chuva de palavras:** digite uma palavra visível e envie com Enter ou o botão. Dez acertos vencem; três palavras expiradas encerram a rodada. Há três velocidades, pausa manual e pausa automática ao ocultar a aba. O recorde considera apenas o tempo ativo, separado por velocidade.
- **Palavra secreta:** use a tradução como dica e o teclado físico ou da tela para descobrir as letras. Seis letras incorretas encerram a rodada; revelar a resposta também encerra. O recorde é o menor número de erros em uma vitória.

- **Remixa:** reconstrua cinco palavras a partir de letras embaralhadas e pistas em português. Toque ou teclado físico; peças repetidas têm identidade própria.
- **Caça-conexões:** tabuleiro de 8 × 8 com 4/5/6 palavras. Arraste, toque nas duas pontas ou use setas e Enter. As etapas acrescentam verticais e diagonais; uma ocorrência alternativa válida também é aceita.
- **Frase na mão:** cinco frases das aulas em blocos, com pista traduzida e primeira palavra do modelo. Toque para selecionar/remover, conferir e ouvir.
- **Bate-pronto:** oito traduções de múltipla escolha, três corações e meta de seis acertos. Feedback e exemplo entre escolhas, sem limite de tempo.

Os quatro jogos novos têm três etapas. A segunda abre com três vitórias na família ou 400 XP no perfil; a terceira, com oito vitórias ou 1.200 XP. A primeira fica disponível desde o início. No celular, jogos de montagem usam botões de pelo menos 44 px de altura; o caça-palavras tem gestos e alternativa por duas pontas. A digitação mantém pausa manual/automática e entrada compatível com teclado móvel.

Partidas não geram respostas acadêmicas, revisões, notas nem tempo de estudo. Geram XP e selos de participação no **perfil** (`/profile`). Cada vitória vale 40–80 XP conforme etapa e aproveitamento; a primeira vitória do dia dá +25 XP. Derrotas dão até 10 XP pelos acertos. Abandonar ou reiniciar não registra resultado. Cada rodada concluída tem ID persistente para evitar crédito duplicado por remontagem ou importação.

O rank é **pessoal e de participação**, separado da trilha A1–C1 e de avaliações. D inicia em 0 XP, C em 500, B em 1.500, A em 4.000 e S em 9.000. O nível usa limiares de 100/300/600/1.000… XP. Estudos também pontuam: até 15 XP por questão independente, 80 por aula concluída, 10 por cartão lembrado/dia e 25 por produção revisada. Repetir o mesmo registro não acumula XP ilimitado. O sistema local não é um ranking competitivo entre contas.

A chave `english-path-casual-games-v1` foi preservada; o payload v2 guarda histórico por rodada. Recordes v1 são mantidos e cada vitória antiga recebe 40 XP uma única vez, sem inventar datas/precisão. Exportação e importação **próprias dos jogos** ficam no perfil; a mesclagem une IDs e conserva os melhores recordes. Jogos continuam fora do backup acadêmico e da sincronização Supabase. Rodadas em andamento recomeçam ao sair. Limpar os dados do site apaga o progresso local; exporte uma cópia antes.

## Turma fundadora

A página pública **`/comece`** apresenta a VIRA e a proposta de um piloto para os primeiros 100 alunos: **R$ 19,90/mês**, plataforma e duas aulas coletivas ao vivo por semana. O CTA abre uma mensagem pronta no WhatsApp **+55 (38) 99814-6695**, informado pelo responsável. O número público padrão fica em `src/brand/brand.ts`; `VITE_FOUNDER_WHATSAPP` pode substituí-lo no build (código do país + DDD + número).

A página abre sem o banco de estudo e funciona offline depois do cache inicial. Não há contador fictício de inscritos, depoimentos inventados, checkout ou cobrança automática. Início, horários e condições do piloto são combinados no contato. Controle de assinantes, autenticação obrigatória, cobrança recorrente e sala/agenda das aulas ao vivo ainda precisam de implementação/organização para a operação paga.

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
  interactive/     cenas SVG e exploração/desafios
  practice/        conversação, pronúncia, erros, projetos e áudio local
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

Consulte [STATUS.md](STATUS.md) para o registro de entrega. O núcleo local funciona e foi testado em Chromium, inclusive persistência, retomada, revisão, importação/exportação, mobile e offline. As 48 aulas e os projetos ampliam o percurso A1–C1, mas não constituem certificação ou garantia de fluência. Os 761 itens usam conteúdo autoral e ainda precisam de revisão editorial externa. Não existe avaliador de IA para respostas livres.

Permanecem dependentes de configuração ou curadoria: Supabase real, vídeos verificados e deploy Cloudflare. Safari/Firefox, qualidade acústica, envio de e-mail e áudio físico/microfone em dispositivos reais não foram validados neste ambiente. A experiência não depende deles para estudar localmente.
