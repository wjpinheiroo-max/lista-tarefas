 "use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "minha-lista-tarefas-v1";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("todas");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setTasks(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, ready]);

  function addTask(event) {
    event.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTasks((current) => [
      { id: `${Date.now()}-${Math.random()}`, title, completed: false },
      ...current,
    ]);
    setText("");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  const visibleTasks = useMemo(() => {
    if (filter === "pendentes") return tasks.filter((task) => !task.completed);
    if (filter === "concluidas") return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, filter]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <main className="page-shell">
      <section className="app-card">
        <header className="topline">
          <div className="brand-mark" aria-hidden="true">✓</div>
          <span className="eyebrow">SEU ESPAÇO DE ORGANIZAÇÃO</span>
        </header>

        <div className="intro">
          <p className="date-label">UM PASSO DE CADA VEZ</p>
          <h1>Organize seu <span>dia.</span></h1>
          <p className="subtitle">Tire as ideias da cabeça e coloque seus planos em movimento.</p>
        </div>

        <div className="stats" aria-label="Resumo das tarefas">
          <div className="stat stat-total">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pendentes</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Concluídas</span>
          </div>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">Digite uma nova tarefa</label>
          <input
            id="new-task"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="O que você precisa fazer?"
            maxLength={120}
          />
          <button type="submit" disabled={!text.trim()}>Adicionar <span>＋</span></button>
        </form>

        <div className="list-heading">
          <div>
            <h2>Suas tarefas</h2>
            <p>{tasks.length === 0 ? "Sua lista começa com um pequeno passo." : `${pendingCount} tarefa(s) esperando por você`}</p>
          </div>
          <span className="task-count">{tasks.length.toString().padStart(2, "0")}</span>
        </div>

        <nav className="filters" aria-label="Filtrar tarefas">
          {[
            ["todas", "Todas"],
            ["pendentes", "Pendentes"],
            ["concluidas", "Concluídas"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "filter active" : "filter"}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="task-list">
          {!ready ? (
            <p className="empty-state">Carregando suas tarefas...</p>
          ) : visibleTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <strong>{tasks.length === 0 ? "Ainda não há tarefas" : "Nada por aqui!"}</strong>
              <span>{tasks.length === 0 ? "Adicione sua primeira tarefa acima." : "Experimente selecionar outro filtro."}</span>
            </div>
          ) : (
            visibleTasks.map((task) => (
              <article className={task.completed ? "task-item completed" : "task-item"} key={task.id}>
                <button
                  className="check-button"
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
                  title={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
                >
                  {task.completed ? "✓" : ""}
                </button>
                <span className="task-title">{task.title}</span>
                <span className="status-label">{task.completed ? "Concluída" : "Pendente"}</span>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Excluir tarefa: ${task.title}`}
                  title="Excluir tarefa"
                >
                  ×
                </button>
              </article>
            ))
          )}
        </div>

        <footer className="footer">
          <span>Feito para deixar a rotina mais leve.</span>
          <span>{completedCount} de {tasks.length} concluídas</span>
        </footer>
      </section>
      <p className="page-note">ORGANIZAÇÃO TAMBÉM É UMA FORMA DE CUIDAR DE SI.</p>
    </main>
  );
}
