import "../styles/founder.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Gamepad2,
  Headphones,
  MessageCircle,
  Play,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import { Brand } from "../brand/Brand";
import { brand, founderContact } from "../brand/brand";
export default function FounderLanding() {
  const contact = founderContact();
  useEffect(() => {
    const anchor = location.hash
      ? document.getElementById(location.hash.slice(1))
      : null;
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
  }, []);
  return (
    <div className="founder-page">
      <header className="founder-nav">
        <Brand compact />
        <nav aria-label="Conhecer a VIRA">
          <a href="#como-funciona">Como funciona</a>
          <a href="#turma-fundadora">A turma fundadora</a>
          <Link to="/" className="founder-login">
            Entrar na plataforma
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      </header>
      <main>
        <section className="founder-hero">
          <div>
            <span className="founder-eyebrow">
              <i />
              VIRA · INGLÊS QUE VIRA CONVERSA
            </span>
            <h1>
              Seu inglês
              <br />
              merece sair
              <br />
              <em>da cabeça.</em>
              <span className="hero-exclamation" aria-hidden="true">
                ✳
              </span>
            </h1>
            <p>
              Você reconhece as palavras. Entende uma frase. Mas, na hora de
              responder, trava. Vamos transformar esse repertório em prática
              para a vida real.
            </p>
            <div className="founder-hero-actions">
              <a href="#turma-fundadora" className="button founder-primary">
                Quero fazer essa virada
                <ArrowRight size={18} />
              </a>
              <Link to="/" className="founder-demo">
                <Play size={16} />
                Experimentar a plataforma
              </Link>
            </div>
            <span className="founder-hero-note">
              Aulas curtas, cenas interativas, jogos e encontros ao vivo.
            </span>
          </div>
          <div className="founder-hero-art" aria-hidden="true">
            <div className="hero-art-orbit" />
            <span className="founder-speech speech-before">
              I know...<small>mas como eu respondo?</small>
            </span>
            <div className="founder-logo-tile">
              <img src="/brand/vira-mark.png" alt="" />
              <span>VIRA ESSA CHAVE.</span>
            </div>
            <span className="founder-speech speech-after">
              let’s talk.
              <i>
                <ArrowUpRight size={32} />
              </i>
            </span>
            <span className="founder-sticker">
              <Zap size={18} />
              DO SEU JEITO. NO SEU RITMO.
            </span>
          </div>
        </section>
        <div className="founder-marquee" aria-hidden="true">
          <span>NA VIAGEM ✳</span>
          <span>NO TRABALHO ✳</span>
          <span>NO DIA A DIA ✳</span>
          <span>
            NA SUA PRÓXIMA CONVERSA <ArrowUpRight size={20} />
          </span>
        </div>
        <section className="founder-method" id="como-funciona">
          <div className="founder-section-heading">
            <span className="eyebrow">
              MENOS “UM DIA EU APRENDO”. MAIS PRÁTICA HOJE.
            </span>
            <h2>
              Um inglês com destino.
              <br />
              <em>A sua vida.</em>
            </h2>
            <p>
              Escolha uma pausa de 5, 15 ou 30 minutos. Aprenda uma estrutura,
              explore uma situação e encontre um jeito de usar.
            </p>
          </div>
          <div className="founder-feature-grid">
            <article className="founder-feature feature-orange">
              <span>01</span>
              <MessageCircle size={33} />
              <h3>
                As situações que
                <br />
                realmente acontecem.
              </h3>
              <p>
                Restaurante, viagem, trabalho, saúde e conversas comuns. Clique
                nas cenas, descubra palavras e pratique respostas.
              </p>
              <Link to="/explore">
                Explorar uma cena
                <ArrowUpRight size={17} />
              </Link>
            </article>
            <article className="founder-feature feature-purple">
              <span>02</span>
              <Gamepad2 size={35} />
              <h3>
                Uma vontade
                <br />
                de jogar mais uma.
              </h3>
              <p>
                Sete jogos com pontos, etapas e conquistas. Um intervalo com
                inglês, preparado para a tela do celular.
              </p>
              <Link to="/games">
                Conhecer o Arcade
                <ArrowUpRight size={17} />
              </Link>
            </article>
            <article className="founder-feature feature-lime">
              <span>03</span>
              <Video size={35} />
              <h3>
                Gente de verdade.
                <br />
                Prática em grupo.
              </h3>
              <p>
                A proposta da turma fundadora reúne a plataforma e duas aulas
                coletivas ao vivo por semana.
              </p>
              <a href="#turma-fundadora">
                Ver o piloto
                <ArrowUpRight size={17} />
              </a>
            </article>
          </div>
        </section>
        <section className="founder-pain-section">
          <div className="founder-pain-art" aria-hidden="true">
            <span>“eu entendo...”</span>
            <strong>
              agora
              <br />
              <em>eu tento.</em>
            </strong>
            <i>
              <ArrowUpRight size={32} />
            </i>
          </div>
          <div>
            <span className="eyebrow">CONFIANÇA SE CONSTRÓI USANDO</span>
            <h2>
              Não precisa sair perfeito.
              <br />
              Precisa começar a sair.
            </h2>
            <p>
              Uma frase no restaurante. Uma pergunta numa viagem. Uma resposta
              numa reunião. A VIRA organiza pequenos passos para você praticar
              com propósito.
            </p>
            <ul>
              <li>
                <Check size={18} />
                48 aulas numa trilha de A1 a C1.
              </li>
              <li>
                <Check size={18} />
                Conversas guiadas e cenas para tocar e descobrir.
              </li>
              <li>
                <Check size={18} />
                Revisão dos erros e um próximo passo visível.
              </li>
              <li>
                <Check size={18} />
                Perfil com XP, selos e rank de participação.
              </li>
            </ul>
            <p className="founder-honesty">
              A trilha orienta o estudo. Seu nível de inglês é acompanhado por
              habilidade; pontos e jogos não são uma certificação.
            </p>
          </div>
        </section>
        <section className="founder-offer-section" id="turma-fundadora">
          <div>
            <span className="founder-eyebrow">
              <Sparkles size={16} />O COMEÇO É COM OS PRIMEIROS 100
            </span>
            <h2>
              Entre no começo.
              <br />
              <em>Ajude a virar o jogo.</em>
            </h2>
            <p>
              Estamos organizando uma turma piloto para validar a experiência
              com alunos reais. A proposta é simples: acesso à plataforma e
              prática acompanhada em grupo.
            </p>
            <ul>
              <li>
                <Check size={18} />
                Plataforma de estudo, revisões e jogos.
              </li>
              <li>
                <Check size={18} />
                Duas aulas coletivas ao vivo por semana.
              </li>
              <li>
                <Check size={18} />
                Espaço para dúvidas e troca durante os encontros.
              </li>
              <li>
                <Check size={18} />
                Seu feedback ajudando a melhorar a VIRA.
              </li>
            </ul>
          </div>
          <div className="founder-price-card">
            <span className="founder-price-tag">TURMA FUNDADORA · PILOTO</span>
            <p className="founder-price">
              <span>R$</span>
              {brand.pilotPrice}
              <small>/mês</small>
            </p>
            <p>Plataforma + duas aulas coletivas ao vivo por semana.</p>
            {contact ? (
              <a
                className="button"
                href={contact.href}
                target="_blank"
                rel="noreferrer"
              >
                Quero saber sobre a turma
                <ArrowUpRight size={18} />
              </a>
            ) : (
              <p>O contato da turma será divulgado aqui.</p>
            )}
            <small>
              Confirme início, horários, formato e condições pelo WhatsApp antes
              de se inscrever. Este botão abre uma conversa; não realiza
              cobrança.
            </small>
            <div className="founder-price-bottom">
              <MessageCircle size={16} />
              Conversa direta com a organização.
            </div>
          </div>
        </section>
        <section className="founder-faq">
          <div>
            <span className="eyebrow">ANTES DA PRIMEIRA VIRADA</span>
            <h2>Vamos deixar claro.</h2>
          </div>
          <div>
            <details>
              <summary>Preciso saber inglês para começar?</summary>
              <p>
                A plataforma tem uma trilha de A1 a C1 e atividades por
                habilidade. No contato sobre a turma, confirme o nível e o
                formato dos encontros para saber se combinam com seu momento.
              </p>
            </details>
            <details>
              <summary>Preciso estudar todos os dias?</summary>
              <p>
                Você pode escolher quando e por quanto tempo estudar. As sessões
                sugeridas têm 5, 15 ou 30 minutos, e os jogos ficam disponíveis
                para uma pausa. Não há perda de pontos por faltar um dia.
              </p>
            </details>
            <details>
              <summary>Como funcionam as aulas ao vivo?</summary>
              <p>
                A oferta do piloto prevê duas aulas coletivas por semana. Datas,
                início, horários e condições serão confirmados pela organização
                no WhatsApp antes da inscrição.
              </p>
            </details>
            <details>
              <summary>Os pontos mostram que fiquei fluente?</summary>
              <p>
                O rank registra participação em estudo e jogos. A compreensão e
                a produção são acompanhadas separadamente. A fluência exige
                prática de comunicação, tempo e contato com inglês real.
              </p>
            </details>
            <details>
              <summary>Já posso pagar pelo site?</summary>
              <p>
                Nesta etapa, o contato e a confirmação do piloto são feitos
                diretamente pelo WhatsApp. A página não processa pagamentos nem
                ativa uma assinatura automaticamente.
              </p>
            </details>
          </div>
        </section>
        <section className="founder-last-call">
          <span aria-hidden="true">✳</span>
          <h2>
            Sua próxima conversa
            <br />
            pode começar por aqui.
          </h2>
          {contact && (
            <a
              className="button"
              href={contact.href}
              target="_blank"
              rel="noreferrer"
            >
              Conversar sobre o piloto
              <ArrowUpRight size={18} />
            </a>
          )}
        </section>
      </main>
      <footer className="founder-footer">
        <Brand compact />
        <p>Inglês que vira conversa.</p>
        <Link to="/">
          Explorar a plataforma
          <ArrowRight size={16} />
        </Link>
      </footer>
    </div>
  );
}
