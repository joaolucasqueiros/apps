import * as baileys from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { makeWASocket, useMultiFileAuthState, DisconnectReason } = baileys;


const vendas = [];
const estado = {};
const atendentes = new Set();
const aguardandoConfirmacao = new Set();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LINK_VIDEO = 'https://bit.ly/3FudXEl';

const LINKS_PRODUTOS = {
  '1 pote': 'https://ev.braip.com/ref?pl=plaoz2eg&ck=che5v17v&af=afio86p19g',
  '3 potes': 'https://ev.braip.com/ref?pl=plazne1j&ck=che5v17v&af=afio86p19g',
  '5 potes': 'https://ev.braip.com/ref?pl=pla2kz20&ck=che5v17v&af=afio86p19g',
};

function limpar(txt) {
  return txt.replace(/\s+/g, ' ').trim();
}

function soNumero(txt) {
  return txt.replace(/\D/g, '');
}

async function enviarMensagem(sock, jid, texto) {
  await sock.sendMessage(jid, { text: texto });
}

async function reiniciarFluxo(sock, jid) {
  estado[jid] = { etapa: 'boas_vindas' };
  atendentes.delete(jid);
  aguardandoConfirmacao.delete(jid);
  const msgBoasVindas =
    "🔁 *Bot reiniciado!*\n\n" +
    "👋 Olá, seja muito bem-vindo ao *Atendimento Fire Max*!\n\n" +
    "🔒 *Privacidade 100% garantida.* Aqui seu segredo está seguro e protegido.\n\n" +
    "Escolha o que mais combina com você:\n" +
    "1️⃣ Sofro com ejaculação precoce\n" +
    "2️⃣ Tenho dificuldades de ereção (impotência)\n" +
    "3️⃣ Quero aumentar minha potência e durar mais\n" +
    "4️⃣ Não sei o que está acontecendo comigo\n" +
    "5️⃣ Já conheço o Fire Max e quero saber mais\n\n" +
    "Digite o número da sua opção:";
  await enviarMensagem(sock, jid, msgBoasVindas);
}

async function processaMensagem(sock, jid, texto) {
  const textoLimpo = texto.toLowerCase().trim();
  const op = soNumero(textoLimpo);

  // Comandos universais
  if (['reiniciar', 'menu', 'voltar'].includes(textoLimpo)) {
    await reiniciarFluxo(sock, jid);
    return;
  }

  // Se cliente está em confirmação de pagamento, para de responder
  if (aguardandoConfirmacao.has(jid)) {
    // Não responde mais, atendimento passa para humano
    return;
  }

  if (!estado[jid]) estado[jid] = { etapa: 'boas_vindas' };
  const lead = estado[jid];

  let resposta = '';

  const comVideo = (txt) =>
    `${txt}\n\n🎥 Veja o relato real de um cliente:\nAssista aqui: ${LINK_VIDEO}\n\n💬 Quer continuar? Digite:\n1️⃣ Sim\n2️⃣ Pular para próximos passos`;

  switch (lead.etapa) {
    case 'boas_vindas':
      resposta =
        '👋 Olá, meu amigo!\n\n' +
        'Este é um ambiente 100% *privado e seguro*, feito para homens que querem melhorar sua vida íntima com confiança. 🔐🔥\n\n' +
        'Me conte qual situação te representa melhor:\n' +
        '1️⃣ Sofro com ejaculação precoce\n' +
        '2️⃣ Tenho dificuldades de ereção (impotência)\n' +
        '3️⃣ Quero aumentar minha potência e durar mais\n' +
        '4️⃣ Não sei o que está acontecendo comigo\n' +
        '5️⃣ Já ouvi falar do Fire Max e quero saber mais';
      lead.etapa = 'dor_inicial';
      break;

    case 'dor_inicial':
      if (!['1', '2', '3', '4', '5'].includes(op)) {
        resposta = '❌ Por favor, escolha uma opção válida: 1, 2, 3, 4 ou 5.';
        break;
      }
      switch (op) {
        case '1':
          resposta =
            '😔 A ejaculação precoce pode minar sua confiança e atrapalhar relacionamentos.\n\n' +
            'Você não está sozinho e existe uma solução natural e eficaz.';
          break;
        case '2':
          resposta =
            '💪 Dificuldade de ereção (impotência) é comum e tem tratamento.\n\n' +
            'Vamos mostrar como recuperar sua potência de forma segura.';
          break;
        case '3':
          resposta =
            '🔥 Quer aumentar potência e durar mais? Excelente decisão!\n\n' +
            'Muitos homens buscam melhorar seu desempenho para ter mais prazer e confiança.';
          break;
        case '4':
          resposta =
            '🤔 Não entender o que está acontecendo com seu corpo pode gerar ansiedade.\n\n' +
            'Estamos aqui para esclarecer tudo e ajudar você.';
          break;
        case '5':
          resposta =
            '⚙️ O Fire Max é um suplemento natural para aumentar potência, controle e confiança.\n\n' +
            'Quer ver um vídeo com relato real de quem usou?';
          lead.etapa = 'video_mandatorio';
          await enviarMensagem(sock, jid, resposta);
          return;
      }
      resposta = comVideo(resposta);
      lead.etapa = 'confirma_interesse';
      break;

    case 'video_mandatorio':
      if (op === '1' || textoLimpo.includes('sim')) {
        resposta =
          '✅ Que ótimo que quer saber mais!\n\n' +
          'O Fire Max estimula a produção natural dos nutrientes que o corpo perde com o tempo.\n' +
          'Ele melhora a circulação e o controle muscular, devolvendo a potência que você merece.';
        resposta = comVideo(resposta);
        lead.etapa = 'beneficios_1';
      } else if (op === '2' || textoLimpo.includes('não') || textoLimpo.includes('nao')) {
        resposta =
          'Sem problemas, vou direto aos benefícios e planos para você começar sua transformação.\n\n' +
          'Lembre-se: você não está sozinho nessa jornada.';
        lead.etapa = 'beneficios_1';
      } else {
        resposta = 'Digite 1️⃣ para continuar e entender melhor, ou 2️⃣ para ir para os benefícios e planos.';
      }
      break;

    case 'confirma_interesse':
      if (op === '1' || textoLimpo.includes('sim')) {
        resposta =
          '✅ Que bom que quer seguir!\n\n' +
          'O Fire Max age natural e eficazmente para recuperar sua potência e confiança.\n' +
          'Confira o vídeo de quem já teve resultados incríveis!';
        resposta = comVideo(resposta);
        lead.etapa = 'beneficios_1';
      } else if (op === '2' || textoLimpo.includes('não') || textoLimpo.includes('nao')) {
        resposta =
          'Tudo bem! Vamos seguir para os benefícios e planos para você começar hoje mesmo.';
        lead.etapa = 'beneficios_1';
      } else {
        resposta = 'Digite 1️⃣ para continuar ou 2️⃣ para seguir para os benefícios e planos.';
      }
      break;

    case 'beneficios_1':
      resposta =
        '🛡️ *Garantia de 90 dias* para planos a partir de 1 pote: se não funcionar, devolvemos seu dinheiro.\n\n' +
        '🚚 Entrega rápida e discreta em até 9 dias úteis, com total segurança e nota fiscal.\n\n' +
        '✅ Benefícios que você vai sentir:\n' +
        '- Ereção mais firme e duradoura 💪\n' +
        '- Controle total da ejaculação ⏳\n' +
        '- Autoestima renovada ✨\n' +
        '- Vida sexual mais ativa e prazerosa 🔥\n\n' +
        '👉 Está pronto para escolher seu plano e dar o próximo passo?';
      lead.etapa = 'planos';
      break;

    case 'planos':
      resposta =
        '🔥 *Escolha o plano ideal para transformar sua vida íntima:* 🔥\n\n' +
        '1️⃣ *1 pote* - R$197\n' +
        '👉 Ideal para testar e começar a sentir os primeiros resultados.\n\n' +
        '2️⃣ *3 potes* - R$297\n' +
        '💥 Plano mais popular! Economia garantida e resultados visíveis em até 90 dias.\n\n' +
        '3️⃣ *5 potes (completo)* - R$397\n' +
        '🚀 Melhor custo-benefício para quem quer uma transformação completa e duradoura.\n\n' +
        '💳 Aceitamos Pix, Cartão (12x sem juros) e Boleto à vista (por segurança).\n\n' +
        'Qual plano deseja? Digite 1, 2, 3 ou 4 para falar com um atendente.';
      lead.etapa = 'captura_nome';
      break;

    case 'captura_nome':
      if (textoLimpo.length < 3) {
        resposta = '🤔 Por favor, digite seu nome completo para continuarmos.';
      } else {
        lead.nome = textoLimpo
          .split(' ')
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(' ');
        resposta =
          `👏 Obrigado, *${lead.nome}*!\n\n` +
          'Como prefere continuar?\n' +
          '1️⃣ Quero receber o link de compra para finalizar sozinho.\n' +
          '2️⃣ Prefiro falar com um atendente para finalizar o pagamento.';
        lead.etapa = 'opcao_link_ou_atendente';
      }
      break;

    case 'opcao_link_ou_atendente':
      if (['1', '2'].includes(op)) {
        if (op === '1') {
          // Definir pacote selecionado: para simplicidade, assume o pacote conforme última escolha em 'planos'
          // Aqui vamos assumir que lead.pacote é definido pelo número escolhido
          // Como na etapa 'planos' o usuário escolhe 1, 2 ou 3, vamos guardar isso para usar aqui
          if (!lead.pacote) {
            // Se ainda não definido, setar conforme escolha no planos (deve ter guardado)
            // Se não existir, usa 1 pote
            lead.pacote = {
              '1': '1 pote',
              '2': '3 potes',
              '3': '5 potes',
            }[lead.ultimaEscolhaPlano || '1'];
          }
          const urlCompra = LINKS_PRODUTOS[lead.pacote];
          resposta =
            `🔗 Aqui está seu link para comprar o *${lead.pacote}*:\n${urlCompra}\n\n` +
            '⚠️ Após finalizar o pagamento, envie uma mensagem com o comprovante ou confirme que pagou.\n' +
            'Assim, um atendente continuará seu atendimento para garantir tudo certo.\n\n' +
            '📩 Estou aguardando sua confirmação.';
          aguardandoConfirmacao.add(jid);
        } else {
          resposta =
            '📞 Um atendente está ciente e irá entrar em contato para finalizar seu pedido.\n\n' +
            'Por favor, aguarde um momento. Após a confirmação do pagamento, o atendimento será concluído pelo atendente.\n\n' +
            'Se quiser, digite *menu* ou *reiniciar* para voltar ao início.';
          atendentes.add(jid);
        }
      } else {
        resposta = '❌ Por favor, escolha 1 para receber o link ou 2 para falar com um atendente.';
      }
      break;

    default:
      resposta =
        '❓ Não entendi. Digite *menu* para ver as opções ou *reiniciar* para começar novamente.';
      break;
  }

  // Guardar a última escolha do plano para uso posterior
  if (lead.etapa === 'captura_nome' && ['1', '2', '3'].includes(op)) {
    lead.ultimaEscolhaPlano = op;
    // Também já setar o pacote para usar no link depois
    lead.pacote = {
      '1': '1 pote',
      '2': '3 potes',
      '3': '5 potes',
    }[op];
  }

  await enviarMensagem(sock, jid, resposta);
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('firemax_auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log('📲 Escaneie o QR code acima para conectar o bot.');
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log('❌ Conexão fechada, motivo:', reason);
      if (reason !== DisconnectReason.loggedOut) {
        start();
      }
    }

    if (connection === 'open') {
      console.log('✅ Conectado ao WhatsApp.');
    }
  });

  sock.ev.on('messages.upsert', async (msg) => {
    if (!msg.messages) return;
    const m = msg.messages[0];
    if (!m.message || m.key.fromMe) return;

    const jid = m.key.remoteJid;
    let texto = '';

    if (m.message.conversation) texto = m.message.conversation;
    else if (m.message.extendedTextMessage?.text) texto = m.message.extendedTextMessage.text;

    if (!texto) return;

    await processaMensagem(sock, jid, texto);
  });

  sock.ev.on('creds.update', saveCreds);
}

start();
