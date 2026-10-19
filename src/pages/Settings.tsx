import { useEffect, useRef, useState } from "react";
import {
  Download,
  Upload,
  Cloud,
  Check,
  Sun,
  Moon,
  Monitor,
  Save,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { useLearning } from "../hooks/useLearning";
import { PageTitle, Badge } from "../components/ui";
import { supabase, synchronize } from "../auth/supabase";
import { validateBackup } from "../persistence/store";
import { mergeStates } from "../utils/learning";
import type { LearningState, Level } from "../types";
export function Settings() {
  const { state, update, replace, notify, flush } = useLearning();
  const [name, setName] = useState(state.profile.name);
  const [goal, setGoal] = useState(state.profile.goal);
  const [imported, setImported] = useState<LearningState | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);
  const [syncDate, setSyncDate] = useState("");
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!supabase) return;
    void supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);
  const exportBackup = async () => {
    try {
      await flush();
      const blob = new Blob([JSON.stringify(state, null, 2)], {
        type: "application/json",
      });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `english-path-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
      notify("Backup exportado. Guarde o arquivo em um local seguro.");
    } catch {
      setError(
        "O armazenamento local não foi confirmado. Tente exportar novamente.",
      );
    }
  };
  const importBackup = async (f: File) => {
    setError("");
    setImported(null);
    if (f.size > 10 * 1024 * 1024) {
      setError("O backup excede o limite de 10 MB.");
      return;
    }
    try {
      setImported(validateBackup(JSON.parse(await f.text())));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Arquivo inválido.");
    }
    if (file.current) file.current.value = "";
  };
  const authenticate = async (signUp = false) => {
    if (!supabase) return;
    setBusy(true);
    setError("");
    try {
      const result = signUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      setPassword("");
      notify(
        signUp && !result.data.session
          ? "Confira seu e-mail para confirmar a conta."
          : "Você entrou. A sincronização está disponível.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha de autenticação.");
    } finally {
      setBusy(false);
    }
  };
  const sync = async () => {
    setBusy(true);
    setError("");
    try {
      const result = await synchronize(state);
      update((s) => mergeStates(s, result));
      await flush();
      setSyncDate(new Date().toLocaleString("pt-BR"));
      notify("Progresso sincronizado.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha de sincronização.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageTitle
        eyebrow="DO SEU JEITO"
        title="Um espaço que combina com você."
        description="Seu perfil, suas preferências e o cuidado com cada descoberta."
      />
      {error && (
        <div className="feedback warning" role="alert">
          {error}
        </div>
      )}
      <div className="settings-grid">
        <section className="panel">
          <h2>Seu perfil de aprendizagem</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                profile: {
                  ...s.profile,
                  name: name.trim() || "Estudante",
                  goal,
                  updatedAt: new Date().toISOString(),
                },
              }));
              notify("Perfil salvo.");
            }}
          >
            <label>
              Como podemos chamar você?
              <input
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Seu próximo objetivo
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Level)}
              >
                {["A1", "A2", "B1", "B2", "C1"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
            <button className="button" type="submit">
              <Save size={16} />
              Salvar perfil
            </button>
          </form>
          <p className="muted">
            Nível de partida: {state.profile.initialLevel}. Os testes geram
            estimativas separadas, sem alterar silenciosamente seu perfil.
          </p>
        </section>
        <section className="panel">
          <h2>Conforto para estudar</h2>
          <p>Aparência</p>
          <div className="theme-options">
            {(
              [
                ["light", "Claro", Sun],
                ["dark", "Escuro", Moon],
                ["system", "Sistema", Monitor],
              ] as const
            ).map(([theme, label, Icon]) => (
              <button
                key={theme}
                aria-pressed={state.profile.theme === theme}
                className={state.profile.theme === theme ? "active" : ""}
                onClick={() =>
                  update((s) => ({
                    ...s,
                    profile: {
                      ...s.profile,
                      theme,
                      updatedAt: new Date().toISOString(),
                    },
                  }))
                }
              >
                <Icon size={19} />
                {label}
              </button>
            ))}
          </div>
          <label>
            Velocidade da voz: {state.profile.speechRate.toFixed(2)}×
            <input
              aria-label="Velocidade de reprodução"
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={state.profile.speechRate}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: {
                    ...s.profile,
                    speechRate: Number(e.target.value),
                    updatedAt: new Date().toISOString(),
                  },
                }))
              }
            />
          </label>
          <p className="muted">
            Sem metas diárias obrigatórias e sem penalidades por pausas.
          </p>
        </section>
        <section className="panel">
          <span className="stat-icon blue">
            <ShieldCheck size={22} />
          </span>
          <h2>Seu progresso merece um backup.</h2>
          <p>
            O modo local usa IndexedDB neste navegador. Limpar os dados do site
            ou trocar de dispositivo exige um backup ou sincronização.
          </p>
          <div className="button-row">
            <button className="button" onClick={() => void exportBackup()}>
              <Download size={16} />
              Exportar JSON
            </button>
            <button
              className="button secondary"
              onClick={() => file.current?.click()}
            >
              <Upload size={16} />
              Importar backup
            </button>
            <input
              ref={file}
              hidden
              type="file"
              accept=".json,application/json"
              aria-label="Arquivo de backup"
              onChange={(e) => {
                if (e.target.files?.[0]) void importBackup(e.target.files[0]);
              }}
            />
          </div>
          {imported && (
            <div className="import-preview">
              <h3>Backup válido, pronto para mesclar</h3>
              <p>
                {imported.attempts.length} respostas ·{" "}
                {imported.cards.filter((c) => !c.deleted).length} cartões ·{" "}
                {imported.lessons.length} registros de aulas
              </p>
              <p>
                Registros únicos serão combinados. Perfil e cartões usam a
                atualização mais recente; exclusões de cartões são preservadas.
              </p>
              <button
                className="button"
                onClick={() => {
                  replace(mergeStates(state, imported));
                  setImported(null);
                  notify("Backup mesclado com seus dados locais.");
                }}
              >
                <Check size={16} />
                Mesclar backup
              </button>
              <button className="text-button" onClick={() => setImported(null)}>
                Cancelar
              </button>
            </div>
          )}
        </section>
        <section className="panel cloud-settings">
          <span className="stat-icon lavender">
            <Cloud size={22} />
          </span>
          <div className="section-title">
            <h2>Leve seu caminho com você.</h2>
            <Badge tone={supabase ? "green" : "neutral"}>
              {supabase ? "Supabase configurado" : "Modo local"}
            </Badge>
          </div>
          {!supabase ? (
            <>
              <p>
                Todo o estudo funciona sem uma conta. A sincronização opcional
                requer um projeto Supabase configurado pelo responsável pelo
                site.
              </p>
              <p className="muted">
                Autenticação e sincronização estão desativadas neste ambiente.
                Nenhum dado foi enviado à nuvem.
              </p>
            </>
          ) : session ? (
            <>
              <p>
                Conectado como <strong>{session.user.email}</strong>
              </p>
              <button
                className="button"
                disabled={busy}
                onClick={() => void sync()}
              >
                <RefreshCw size={16} />
                {busy ? "Sincronizando…" : "Sincronizar agora"}
              </button>
              {syncDate && (
                <p role="status">
                  Última sincronização nesta sessão: {syncDate}
                </p>
              )}
              <button
                className="text-button"
                onClick={() =>
                  void supabase?.auth.signOut().then(({ error }) => {
                    if (error) setError(error.message);
                  })
                }
              >
                <LogOut size={16} />
                Sair da conta
              </button>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void authenticate();
              }}
            >
              <label>
                E-mail
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                Senha
                <input
                  type="password"
                  autoComplete="current-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <div className="button-row">
                <button className="button" disabled={busy} type="submit">
                  Entrar
                </button>
                <button
                  className="button secondary"
                  disabled={busy || !email || password.length < 8}
                  type="button"
                  onClick={() => void authenticate(true)}
                >
                  Criar conta
                </button>
              </div>
            </form>
          )}
          <details>
            <summary>Como os conflitos são resolvidos?</summary>
            <p>
              Respostas, sessões e testes são unidos por identificador. Perfil,
              cartões e posição de aula usam a data mais recente. Cartões
              excluídos mantêm um marcador. Uma versão no servidor evita
              sobrescrever silenciosamente uma sincronização concorrente; o
              cliente relê e mescla até três vezes.
            </p>
          </details>
        </section>
      </div>
      <div className="info-note">
        Aplicativo instalável: em navegadores compatíveis, use a opção “Instalar
        aplicativo” ou “Adicionar à tela inicial” no menu do navegador. O cache
        offline fica disponível após a primeira visita à versão de produção.
        Vídeos e serviços externos de voz não são armazenados offline.
      </div>
    </>
  );
}
