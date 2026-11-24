import React, { useEffect, useState } from "react";
import { User, LogOut, Plus, Pencil, Trash2, Check } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

const fmt = (iso) => new Date(iso).toLocaleDateString("en-US");

const card =
  "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800";

function StatCard({ value, label, color }) {
  return (
    <div className={`${card} px-5 h-[146px] flex flex-col justify-center`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function IconButton({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      {children}
    </button>
  );
}

function TaskModal({ initial, onSave, onClose }) {
  const [title, setTitle] = useState(initial?.title ?? "");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">
          {initial ? "Edit Task" : "Add New Task"}
        </h3>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 focus:border-gray-900 dark:focus:border-gray-400"
        />
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {initial ? "Save" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`w-[18px] h-[18px] rounded flex items-center justify-center border shrink-0 ${
        checked
          ? "bg-gray-700 border-gray-700 dark:bg-gray-200 dark:border-gray-200"
          : "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-500"
      }`}
    >
      {checked && (
        <Check className="w-3 h-3 text-white dark:text-gray-900" strokeWidth={3} />
      )}
    </button>
  );
}

export default function Dashboard({ username, onLogout }) {
  const storageKey = `todo_tasks_${username}`;

  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });
  const [modal, setModal] = useState(null); // null | { task?: Task }

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, storageKey]);

  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  const addTask = (title) =>
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      },
    ]);

  const editTask = (id, title) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : null,
            }
          : t
      )
    );

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleSave = (title) => {
    if (modal?.task) editTask(modal.task.id, title);
    else addTask(title);
    setModal(null);
  };

  return (
    // Top and bottom margin around the card
    <div className="min-h-screen px-4 py-8 sm:py-14">
      <div className="max-w-[1068px] mx-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm px-5 sm:px-10 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <User className="w-6 h-6 shrink-0" strokeWidth={2} />
            <h1 className="text-2xl font-bold truncate">Welcome, {username}!</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 h-10 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Add button */}
        <button
          onClick={() => setModal({})}
          className="mt-8 flex items-center gap-3 px-4 h-10 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <Plus className="w-4 h-4" />
          Add New Task
        </button>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard value={tasks.length} label="Total Tasks" color="text-gray-900 dark:text-gray-100" />
          <StatCard value={pending.length} label="Pending" color="text-orange-600 dark:text-orange-400" />
          <StatCard value={completed.length} label="Completed" color="text-green-600 dark:text-green-400" />
        </div>

        {/* Pending */}
        <h2 className="mt-10 mb-5 text-xl font-semibold">Pending Tasks</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No pending tasks.</p>
        ) : (
          <div className="space-y-5">
            {pending.map((t) => (
              <div key={t.id} className={`${card} px-6 py-8 flex items-start justify-between`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Checkbox checked={false} onChange={() => toggleTask(t.id)} />
                  </div>
                  <div>
                    <p className="text-base font-medium leading-6">{t.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Created: {fmt(t.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 -mt-3">
                  <IconButton label="Edit task" onClick={() => setModal({ task: t })}>
                    <Pencil className="w-4 h-4" />
                  </IconButton>
                  <IconButton label="Delete task" onClick={() => deleteTask(t.id)}>
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed */}
        <h2 className="mt-10 mb-5 text-xl font-semibold">Completed Tasks</h2>
        {completed.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No completed tasks yet.</p>
        ) : (
          <div className="space-y-5">
            {completed.map((t) => (
              <div key={t.id} className={`${card} px-6 py-8 flex items-start justify-between`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Checkbox checked onChange={() => toggleTask(t.id)} />
                  </div>
                  <div>
                    <p className="text-base font-medium leading-6 line-through text-gray-600 dark:text-gray-400">
                      {t.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Completed: {fmt(t.completedAt ?? t.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 -mt-3">
                  <IconButton label="Delete task" onClick={() => deleteTask(t.id)}>
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <TaskModal
          initial={modal.task}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
