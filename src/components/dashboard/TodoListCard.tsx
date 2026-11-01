"use client";

import React, { useState } from "react";
import { CheckSquare, Calendar, CheckCircle2, Circle } from "lucide-react";

interface TodoItem {
  id: string;
  title: string;
  courseTitle?: string;
  completed: boolean;
  dueDate?: string;
}

interface TodoListCardProps {
  todos: TodoItem[];
}

export function TodoListCard({ todos: initialTodos }: TodoListCardProps) {
  const [todos, setTodos] = useState(initialTodos);

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-600" />
          <span>Todo List</span>
        </h2>
        <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold shadow-sm">
          {todos.filter((t) => !t.completed).length} Pending
        </span>
      </div>

      <div className="space-y-2">
        {todos.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleTodo(t.id)}
            className={`p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
              t.completed
                ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-royal-400"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {t.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <div className="min-w-0">
                <div
                  className={`text-xs font-semibold text-slate-900 dark:text-white truncate ${
                    t.completed ? "line-through text-slate-400" : ""
                  }`}
                >
                  {t.title}
                </div>
                {t.courseTitle && (
                  <div className="text-[11px] text-slate-500 truncate">{t.courseTitle}</div>
                )}
              </div>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
              {t.completed ? "Done" : "Action Required"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

