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
} from "lucide-react";
import { useLearning } from "../hooks/useLearning";
import { lessons } from "../content/lessons";
import { words } from "../content/vocabulary";
const links = [
  ["/", "Visão geral", LayoutDashboard],
  ["/course", "Meu curso", BookOpen],
  ["/grammar", "Gramática", SpellCheck],
  ["/vocabulary", "Vocabulário", Languages],
  ["/listening", "Listening", Headphones],
  ["/speaking", "Speaking", Mic],
  ["/reading", "Reading", FileText],
  ["/writing", "Writing", PenLine],
  ["/flashcards", "Flashcards", Layers],
  ["/reviews", "Revisões", RotateCcw],
  ["/tests", "Testes", ClipboardCheck],
  ["/progress", "Minha evolução", ChartNoAxesCombined],
  ["/library", "Biblioteca", Library],
] as const;
export function AppLayout() {
  const { state, notice } = useLearning();
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
    <div className="app">
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
        <Link className="brand" to="/">
          <span className="brand-symbol">
            <Leaf size={24} />
          </span>
          <span>
            english<span className="brand-path">path</span>
            <small>UM PASSO DE CADA VEZ</small>
          </span>
        </Link>
        <div className="workspace-label">SEU ESPAÇO DE APRENDIZAGEM</div>
        <nav aria-label="Navegação principal">
          {links.map(([path, label, Icon], i) => (
            <div key={path}>
              {[2, 8, 11].includes(i) && <div className="nav-divider" />}
              <NavLink to={path} end={path === "/"}>
                <Icon size={18} />
                <span>{label}</span>
                {path === "/reviews" && due > 0 && (
                  <span className="nav-count">{due}</span>
                )}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="journey-note">
            <span>Seu ritmo. Seu caminho.</span>
            <p>Todo pequeno passo conta.</p>
            <span className="tiny-leaves">✦ · ✦</span>
          </div>
          <NavLink className="settings-link" to="/settings">
            <Settings size={18} />
            Configurações
          </NavLink>
          <div className="profile-mini">
            <span className="avatar">
              {state.profile.name.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{state.profile.name}</strong>
              <small>Explorando o inglês · {state.profile.initialLevel}</small>
            </div>
          </div>
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
            <Link to="/settings" className="avatar" aria-label="Meu perfil">
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
        <footer className="site-footer">
          <span>Feito para o seu ritmo.</span>
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
