"use client";

import { useMemo, useState } from "react";
import { Bookmark, Film, MessageCircle, Sparkles } from "lucide-react";

function ModuleEntry({ lesson, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border px-4 py-3 text-left transition ${active ? "border-cyber-red bg-white/5" : "border-white/10 bg-black/20 hover:border-cyber-red/30"}`}
    >
      <p className="font-black text-white">{lesson.title}</p>
      <p className="mt-1 text-sm text-cyber-muted">{lesson.duration || 8} min · {lesson.type}</p>
    </button>
  );
}

export default function CoursePlayer({ course = {}, progress = 0 }) {
  const modules = course.modules || [];
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const activeLesson = useMemo(() => {
    const module = modules[activeModuleIndex] || {};
    return (module.lessons || [])[activeLessonIndex] || {};
  }, [modules, activeModuleIndex, activeLessonIndex]);

  const courseCompletion = Math.round(progress || course.progress || 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_0.7fr]">
      <section className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_0_40px_rgba(255,0,60,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Course player</p>
            <h2 className="mt-2 text-3xl font-black uppercase">{course.title || "Course Module"}</h2>
          </div>
          <div className="rounded-full border border-cyber-red/40 bg-cyber-red/10 px-4 py-2 text-sm uppercase tracking-[0.12em] text-cyber-red">{courseCompletion}% complete</div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="aspect-[16/9] overflow-hidden rounded-3xl bg-black/80">
              <div className="flex h-full items-center justify-center text-sm text-cyber-muted">Video player placeholder</div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Lesson</p>
                <p className="mt-2 text-lg font-black text-white">{activeLesson.title || "Select a lesson"}</p>
                <p className="mt-2 text-sm text-cyber-muted">{activeLesson.summary || "Follow the step-by-step guide to build your skills."}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-cyber-muted">
                <p className="uppercase tracking-[0.12em] text-cyber-red">Resources</p>
                <ul className="mt-3 space-y-2">
                  {(activeLesson.resources || ["Notebook", "CLI commands", "Artifacts"]).map((item) => (
                    <li key={item} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Notes</p>
                <textarea className="mt-3 h-28 w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none" placeholder="Capture a note from this lesson..." />
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Lesson progress</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-sm text-white">Module {activeModuleIndex + 1}</span>
                  <span className="text-sm text-cyber-muted">{courseCompletion}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-cyber-red" style={{ width: `${courseCompletion}%` }} />
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Discussion</p>
                <div className="mt-3 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black px-3 py-3 text-sm text-cyber-muted">Ask questions and review mentor tips for this course.</div>
                  <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyber-red px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white">Open chat</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Modules</p>
          <div className="mt-4 grid gap-3">
            {modules.map((module, moduleIndex) => (
              <div key={module.title || moduleIndex} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <p className="font-black text-white">{module.title || `Module ${moduleIndex + 1}`}</p>
                <p className="mt-1 text-sm text-cyber-muted">{module.lessons?.length || 0} lessons</p>
                <div className="mt-3 space-y-2">
                  {(module.lessons || []).map((lesson, lessonIndex) => (
                    <ModuleEntry
                      key={`${moduleIndex}-${lessonIndex}`}
                      lesson={lesson}
                      active={moduleIndex === activeModuleIndex && lessonIndex === activeLessonIndex}
                      onClick={() => {
                        setActiveModuleIndex(moduleIndex);
                        setActiveLessonIndex(lessonIndex);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-cyber-red">Course signals</p>
              <p className="mt-2 text-2xl font-black text-white">{course.modules?.length || 0} modules</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-cyber-muted">{course.category || "Security"}</div>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-cyber-muted">
            <div className="rounded-2xl border border-white/10 bg-black px-3 py-3">Certification: {course.certificateEnabled ? "Enabled" : "Preview"}</div>
            <div className="rounded-2xl border border-white/10 bg-black px-3 py-3">Quizzes: {course.quizzes?.length || 0}</div>
            <div className="rounded-2xl border border-white/10 bg-black px-3 py-3">Estimated runtime: {course.duration || 0} min</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
