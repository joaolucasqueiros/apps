import { Brand } from "../brand/Brand";
import { useProgression } from "../progression/useProgression";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  SpellCheck,
  Languages,
  Headphones,
  Mic,
  FileText,
  PenLine,
  Layers,
  RotateCcw,
  ClipboardCheck,
  ChartNoAxesCombined,
  Library,
  Settings,
  Search,
  Bell,
  ChevronRight,
  ArrowUpRight,
  Menu,
  X,
  Leaf,
  WifiOff,
  Gamepad2,
  Compass,
  MessageCircle,
  FlaskConical,
  UserRound,
  ChevronDown,
  Zap,
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { lessons } from "../content/lessons";
import { words } from "../content/vocabulary";
const links = [
  ["/", "Visão geral", LayoutDashboard],
  ["/profile", "Meu perfil", UserRound],
  ["/course", "Meu curso", BookOpen],
  ["/grammar", "Gramática", SpellCheck],
  ["/vocabulary", "Vocabulário", Languages],
  ["/explore", "Cenas interativas", Compass],
  ["/listening", "Listening", Headphones],
  ["/speaking", "Speaking", Mic],
  ["/conversation", "Conversação", MessageCircle],
  ["/reading", "Reading", FileText],
  ["/writing", "Writing", PenLine],
  ["/flashcards", "Flashcards", Layers],
  ["/reviews", "Revisões", RotateCcw],
  ["/practice", "Prática e projetos", FlaskConical],
  ["/tests", "Testes", ClipboardCheck],
  ["/progress", "Minha evolução", ChartNoAxesCombined],
  ["/library", "Biblioteca", Library],
  ["/games", "Jogos livres", Gamepad2],
] as const;
function NavSection({
  title,
  paths,
  due,
}: {
  title: string;
  paths: string[];
  due: number;
}) {
  const location = useLocation();
  const active = paths.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(path + "/"),
  );
  const [open, setOpen] = useState(active);
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);
  return (
    <details
      className="nav-section"
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>
        {title}
        <ChevronDown size={14} />
      </summary>
      <div>
        {links
          .filter(([path]) => paths.includes(path))
          .map(([path, label, Icon]) => (
            <NavLink key={path} to={path}>
              <Icon size={17} />
              <span>{label}</span>
              {path === "/reviews" && due > 0 && (
                <span className="nav-count">{due}</span>
              )}
            </NavLink>
          ))}
      </div>
    </details>
  );
}
export function AppLayout() {
  const { state, notice } = useLearning();
  const progression = useProgression();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const input = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(
    () => matchMedia("(max-width:850px)").matches,
  );
  const location = useLocation();
  useEffect(() => {
    const media = matchMedia("(max-width:850px)");
    const change = () => setCompact(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!mobile || !compact) return;
    drawer.current?.querySelector<HTMLElement>("a")?.focus();
    return () => menuButton.current?.focus();
  }, [mobile, compact]);
  const due = state.cards.filter(
    (c) => !c.deleted && Date.parse(c.due) <= Date.now(),
  ).length;
  const title =
    links.find(([path]) =>
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path),
    )?.[1] || "Sua aula";
  useEffect(() => {
    setMobile(false);
    setSearching(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const on = () => setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);
  useEffect(() => {
    if (searching) input.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearching(false);
        setMobile(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearching(true);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [searching]);
  return (
    <div
      className={
        "app vira-app " +
        (location.pathname.startsWith("/games") ? "is-arcade" : "")
      }
    >
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      {mobile && (
        <button
          aria-label="Fechar navegação"
          className="sidebar-overlay"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        ref={drawer}
        inert={searching || (compact && !mobile)}
        aria-hidden={compact && !mobile}
        className={`sidebar ${mobile ? "open" : ""}`}
        onKeyDown={(e) => {
          if (e.key === "Tab" && compact && mobile) {
            const all =
              e.currentTarget.querySelectorAll<HTMLElement>("a,button");
            if (e.shiftKey && document.activeElement === all[0]) {
              e.preventDefault();
              all[all.length - 1]?.focus();
            } else if (
              !e.shiftKey &&
              document.activeElement === all[all.length - 1]
            ) {
              e.preventDefault();
              all[0]?.focus();
            }
          }
        }}
      >
        <Brand />
        <div className="workspace-label">TIRE SEU INGLÊS DA CABEÇA.</div>
        <nav aria-label="Navegação principal">
          <div className="nav-primary">
            <NavLink to="/" end>
              <LayoutDashboard size={19} />
              <span>Visão geral</span>
            </NavLink>
            <NavLink to="/course">
              <BookOpen size={19} />
              <span>Meu curso</span>
            </NavLink>
            <NavLink to="/explore">
              <Compass size={19} />
              <span>Cenas interativas</span>
            </NavLink>
          </div>
          <NavSection
            title="PRATICAR INGLÊS"
            paths={[
              "/grammar",
              "/vocabulary",
              "/listening",
              "/speaking",
              "/conversation",
              "/reading",
              "/writing",
            ]}
            due={due}
          />
          <NavSection
            title="FIXAR E APLICAR"
            paths={["/flashcards", "/reviews", "/practice"]}
            due={due}
          />
          <NavSection
            title="ACOMPANHAR EVOLUÇÃO"
            paths={["/tests", "/progress", "/library"]}
            due={due}
          />
          <div className="nav-arcade-block">
            <span className="nav-group-label">UMA PAUSA QUE VALE XP</span>
            <NavLink to="/games" aria-label="Jogos livres">
              <Gamepad2 size={22} />
              <span>
                Jogos livres<small>7 jogos · desafios · pontos</small>
              </span>
              <ArrowUpRight size={15} />
            </NavLink>
          </div>
        </nav>
        <div className="sidebar-bottom">
          <Link to="/profile" className="sidebar-profile-card">
            <span
              className="sidebar-rank"
              style={{ background: progression.rank.color }}
            >
              {progression.rank.key}
            </span>
            <div>
              <strong>{state.profile.name}</strong>
              <small>
                Nível {progression.level.level} ·{" "}
                {progression.xp.toLocaleString("pt-BR")} XP
              </small>
            </div>
            <ArrowUpRight size={15} />
          </Link>
          <Link to="/comece" className="sidebar-founder">
            <Zap size={15} />
            Conheça a turma fundadora
          </Link>
          <NavLink className="settings-link" to="/settings">
            <Settings size={17} />
            Configurações
          </NavLink>
        </div>
      </aside>
      <div className="app-body" inert={searching || (mobile && compact)}>
        <header className="topbar">
          <div className="breadcrumb">
            <button
              ref={menuButton}
              className="icon-button mobile-menu"
              aria-label="Abrir navegação"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span>Meu aprendizado</span>
            <ChevronRight size={14} />
            <strong>{title}</strong>
          </div>
          <div className="topbar-tools">
            <button
              className="search-trigger"
              onClick={() => setSearching(true)}
            >
              <Search size={17} />
              <span>Buscar no seu caminho</span>
              <kbd>⌘ K</kbd>
            </button>
            <Link
              className="icon-button notification"
              to="/reviews"
              aria-label={`${due} revisões pendentes`}
            >
              <Bell size={19} />
              {due > 0 && <i />}
            </Link>
            <Link to="/profile" className="avatar" aria-label="Meu perfil">
              {state.profile.name.slice(0, 1).toUpperCase()}
            </Link>
          </div>
        </header>
        {!online && (
          <div className="offline-banner" role="status">
            <WifiOff size={16} /> Você está offline. Aulas e progresso continuam
            disponíveis. Vídeos e algumas vozes precisam de conexão.
          </div>
        )}
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
        <nav className="mobile-bottom-nav" aria-label="Navegação rápida">
          <NavLink to="/" end>
            <LayoutDashboard size={20} />
            <span>Hoje</span>
          </NavLink>
          <NavLink to="/course">
            <BookOpen size={20} />
            <span>Aprender</span>
          </NavLink>
          <NavLink to="/games">
            <Gamepad2 size={21} />
            <span>Arcade</span>
          </NavLink>
          <NavLink to="/profile">
            <UserRound size={20} />
            <span>Perfil</span>
          </NavLink>
        </nav>
        <footer className="site-footer">
          <span>VIRA · Inglês que vira conversa.</span>
          <span>
            <span className="status-dot" /> Seus dados ficam neste dispositivo{" "}
            <Link to="/settings">
              Fazer backup <ArrowUpRight size={12} />
            </Link>
          </span>
        </footer>
      </div>
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
      {searching && (
        <div className="modal-overlay" onClick={() => setSearching(false)}>
          <section
            className="search-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Buscar aulas e palavras"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                const all =
                  e.currentTarget.querySelectorAll<HTMLElement>(
                    "a,button,input",
                  );
                if (e.shiftKey && document.activeElement === all[0]) {
                  e.preventDefault();
                  all[all.length - 1]?.focus();
                } else if (
                  !e.shiftKey &&
                  document.activeElement === all[all.length - 1]
                ) {
                  e.preventDefault();
                  all[0]?.focus();
                }
              }
            }}
          >
            <div className="search-input">
              <Search size={20} />
              <input
                ref={input}
                aria-label="Buscar"
                placeholder="Busque uma aula ou palavra…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="icon-button"
                aria-label="Fechar busca"
                onClick={() => setSearching(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="search-results">
              {!search.trim() ? (
                <p>Experimente “passado”, “Simple Past” ou “kitchen”.</p>
              ) : (
                <>
                  {lessons
                    .filter((l) =>
                      `${l.title} ${l.subtitle} ${l.explanation}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .slice(0, 6)
                    .map((l) => (
                      <Link key={l.id} to={`/lesson/${l.id}`}>
                        <BookOpen size={18} />
                        <span>
                          {l.title}
                          <small>{l.level} · Aula de gramática</small>
                        </span>
                        <ArrowUpRight size={16} />
                      </Link>
                    ))}
                  {words
                    .filter((w) =>
                      `${w.en} ${w.pt}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .slice(0, 5)
                    .map((w) => (
                      <Link
                        key={w.id}
                        to={`/vocabulary?q=${encodeURIComponent(w.en)}`}
                      >
                        <Languages size={18} />
                        <span>
                          {w.en}
                          <small>
                            {w.pt} · {w.category}
                          </small>
                        </span>
                      </Link>
                    ))}
                  {!lessons.some((l) =>
                    `${l.title} ${l.subtitle} ${l.explanation}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  ) &&
                    !words.some((w) =>
                      `${w.en} ${w.pt}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    ) && <p>Nenhum resultado. Tente outra palavra.</p>}
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
