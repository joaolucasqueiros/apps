import * as baileys from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { makeWASocket, useMultiFileAuthState, DisconnectReason } = baileys;

const vendas = [];
const estado = {};
const atendentes = new Set();
const finalizados = new Set();

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

async function processaMensagem(sock, jid, texto) {
  if (finalizados.has(jid)) return;
  if (atendentes.has(jid)) return;

  if (!estado[jid]) estado[jid] = { etapa: 'boas_vindas' };
  const lead = estado[jid];
  const textoLimpo = texto.toLowerCase().trim();
  const op = soNumero(textoLimpo);
  let resposta = '';

  const comVideo = (txt) =>
    `${txt}\n\n🎥 Veja o relato real de um cliente:\nAssista aqui: ${LINK_VIDEO}\n\n💬 Quer continuar? Digite:\n1️⃣ Sim\n2️⃣ Pular para próximos passos`;

  switch (lead.etapa) {
    case 'boas_vindas':
      resposta =
        '👋 Olá, meu amigo!\n\n' +
        'Aqui é um espaço 100% *privado e seguro*, pensado para homens que sentem que a vida íntima não está como gostariam. 🔐🔥\n\n' +
        'Me diga, qual dessas situações você vive hoje?\n' +
        '1️⃣ Sinto vergonha por ejacular rápido demais 😞\n' +
        '2️⃣ Minha ereção não dura como antes 😔\n' +
        '3️⃣ Quero ser mais potente e duradouro 💪\n' +
        '4️⃣ Não entendo por que está acontecendo comigo 🤷‍♂️\n' +
        '5️⃣ Quero entender como o FireMax pode ajudar';
      lead.etapa = 'dor_inicial';
      break;

    case 'dor_inicial':
      if (!['1', '2', '3', '4', '5'].includes(op)) {
        resposta = 'Por favor, escolha uma das opções: 1, 2, 3, 4 ou 5.';
        break;
      }
      switch (op) {
        case '1':
          resposta =
            '😢 Sei como é frustrante sentir que o prazer acaba cedo demais e que você não está no controle.\n\n' +
            'Essa sensação pode roubar sua autoestima e até afetar seu relacionamento. Você não está sozinho, meu amigo.';
          break;
        case '2':
          resposta =
            '💔 Sentir que a ereção não é mais firme como antes pode ser desanimador e gerar insegurança.\n\n' +
            'Mas saiba que isso tem solução e não precisa ser assim para sempre.';
          break;
        case '3':
          resposta =
            '🔥 Querer mais potência e duração é um desejo legítimo!\n\n' +
            'Muitos homens buscam isso para recuperar o prazer e a confiança no quarto.';
          break;
        case '4':
          resposta =
            '🤔 Nem sempre entendemos porque nosso corpo muda, e isso pode gerar ansiedade.\n\n' +
            'Mas vamos esclarecer tudo e te mostrar uma saída natural.';
          break;
        case '5':
          resposta =
            '⚙️ O FireMax é um suplemento natural criado para ajudar homens como você a recuperar potência, controle e autoestima.\n\n' +
            'Quer ver um vídeo com relato real de quem usou?';
          lead.etapa = 'video_mandatorio';
          await enviarMensagem(sock, jid, resposta);
          return;
      }
      resposta = comVideo(resposta);
      lead.etapa = 'confirma_interesse';
      break;

    case 'confirma_interesse':
      if (op === '1' || textoLimpo.includes('sim')) {
        resposta =
          '✅ Que ótimo que quer saber mais!\n\n' +
          'O FireMax age estimulando a produção natural dos nutrientes que o corpo vai perdendo com o tempo.\n' +
          'Ele melhora a circulação sanguínea e o controle muscular, devolvendo a potência que você merece.';
        resposta = comVideo(resposta);
        lead.etapa = 'beneficios_1';
      } else if (op === '2' || textoLimpo.includes('não') || textoLimpo.includes('nao')) {
        resposta =
          'Sem problemas, vou direto aos benefícios e planos para você começar a transformação.\n\n' +
          'Lembre-se: você não está sozinho nessa jornada.';
        lead.etapa = 'beneficios_1';
      } else {
        resposta = 'Digite 1️⃣ para continuar e entender melhor, ou 2️⃣ para ir para os benefícios e planos.';
      }
      break;

    case 'beneficios_1':
      resposta =
        '🛡️ O FireMax tem *90 dias de garantia* para planos a partir de 1 pote. Se não funcionar, seu dinheiro volta.\n\n' +
        '🚚 Entregamos com *discrição total*, entre 7 e 9 dias úteis, com nota fiscal e segurança.\n\n' +
        '✅ Benefícios que você sentirá:\n' +
        '- Ereção mais firme e duradoura 💪\n' +
        '- Controle total da ejaculação ⏳\n' +
        '- Autoestima renovada ✨\n' +
        '- Vida sexual ativa e prazerosa novamente 🔥\n\n' +
        '👉 Pronto para escolher seu plano?';
      lead.etapa = 'planos';
      break;

    case 'planos':
      resposta =
        '🔥 Temos três planos especiais para sua recuperação:\n\n' +
        '1️⃣ 1 pote - R$197\n' +
        '2️⃣ 3 potes - R$297\n' +
        '3️⃣ 5 potes (completo) - R$397\n\n' +
        '💳 Aceitamos Pix, Cartão (12x), e Boleto à vista (por segurança).\n\n' +
        'Qual plano deseja? Digite 1, 2, 3 ou 4 para falar com atendente.';
      lead.etapa = 'escolha_plano';
      break;

    case 'escolha_plano':
      if (['1', '2', '3'].includes(op)) {
        lead.pacote = {
          '1': '1 pote',
          '2': '3 potes',
          '3': '5 potes',
        }[op];
        resposta = 'Qual forma de pagamento prefere?\n1️⃣ Pix\n2️⃣ Cartão\n3️⃣ Boleto à vista';
        lead.etapa = 'forma_pagamento';
      } else if (op === '4') {
        resposta = 'Ok, vou te conectar com um atendente. Aguarde... 📞';
        atendentes.add(jid);
        lead.etapa = 'fim_atendimento';
      } else {
        resposta = 'Por favor, digite 1, 2, 3 ou 4.';
      }
      break;

    case 'forma_pagamento':
      if (['1', '2', '3'].includes(op)) {
        lead.pagamento = {
          '1': 'Pix',
          '2': 'Cartão',
          '3': 'Boleto',
        }[op];
        resposta = '📛 Por favor, informe seu nome completo:';
        lead.etapa = 'dados_nome';
      } else {
        resposta = 'Escolha a forma de pagamento: 1 para Pix, 2 para Cartão ou 3 para Boleto.';
      }
      break;

    case 'dados_nome':
      if (texto.length < 3) {
        resposta = 'Por favor, informe seu nome completo para continuar.';
      } else {
        lead.nome = texto.trim();
        resposta =
          `✅ Pedido confirmado para *${lead.nome}*!\n` +
          `Plano escolhido: *${lead.pacote}* via *${lead.pagamento}*.\n\n` +
          'Um atendente irá entrar em contato em breve para enviar o link de pagamento.\n\n' +
          'Se quiser receber o link agora, digite:\n1️⃣ Receber link agora\n2️⃣ Aguardar contato do atendente';
        lead.etapa = 'confirma_link';
      }
      break;

    case 'confirma_link':
      if (op === '1') {
        await enviarMensagem(
          sock,
          jid,
          `Aqui está seu link de pagamento:\n${LINKS_PRODUTOS[lead.pacote]}\n\nObrigado pela confiança! Qualquer dúvida, estamos à disposição.`
        );
        finalizados.add(jid);
        return;
      } else if (op === '2') {
        resposta = 'Ok, um atendente entrará em contato em breve. Obrigado pela confiança!';
        finalizados.add(jid);
      } else {
        resposta = 'Digite 1 para receber o link agora, ou 2 para aguardar o atendente.';
      }
      break;

    case 'fim_atendimento':
      resposta = 'Você está em atendimento humano, aguarde que logo um atendente responderá.';
      break;

    default:
      resposta = 'Não entendi, por favor digite uma opção válida.';
      lead.etapa = 'boas_vindas';
  }

  await enviarMensagem(sock, jid, resposta);
}

async function iniciar() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode !== DisconnectReason.loggedOut) {
        iniciar();
      }
    }
    if (connection === 'open') {
      console.log('✔️ Conectado ao WhatsApp');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const jid = msg.key.remoteJid;
    const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    if (texto) await processaMensagem(sock, jid, texto);
  });
}

iniciar();
