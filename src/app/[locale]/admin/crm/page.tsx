"use client";
import { useEffect, useMemo, useState } from "react";
import { Timestamp, collection, doc, onSnapshot, orderBy, query, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { useEsAdmin } from "@/lib/useEsAdmin";

// === Tipos (idénticos a tu implementación actual) ===
export type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  source: string;
  status: "nuevo" | "en_progreso" | "cerrado" | "descartado";
  priority: "baja" | "normal" | "alta";
  createdAt?: Timestamp | Date | null;
  updatedAt?: Timestamp | Date | null;
  assignedTo: string | null;
  followUpAt: Timestamp | Date | null;
  lastNote: string;
  notes: Array<{ text: string; at: Timestamp | Date; by?: string }>;
};

const STATUS_OPTS: Lead["status"][] = ["nuevo", "en_progreso", "cerrado", "descartado"];
const PRIORITY_OPTS: Lead["priority"][] = ["baja", "normal", "alta"];

function fmtDate(d?: Timestamp | Date | null) {
  if (!d) return "—";
  const date = d instanceof Timestamp ? d.toDate() : d;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default function CRMAdminPage() {
  // === DATOS: misma lógica de siempre ===
  const { db } = useMemo(() => getFirebase(), []);
  const { status, isAdmin, user, loginConGoogle, logout } = useEsAdmin();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Lead["status"] | "todos">("todos");
  const [priorityFilter, setPriorityFilter] = useState<Lead["priority"] | "todas">("todas");
  const [onlyMine, setOnlyMine] = useState(false);
  const [view, setView] = useState<"kanban" | "tabla">("kanban");
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    if (!db) return;
    setLoading(true);
    const q = query(collection(db, "leads"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows: Lead[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) }));
      setLeads(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [db]);

  const filtered = leads.filter((l) => {
    const q = search.trim().toLowerCase();
    const textOK = !q
      || l.name?.toLowerCase().includes(q)
      || l.email?.toLowerCase().includes(q)
      || l.message?.toLowerCase().includes(q)
      || l.source?.toLowerCase().includes(q)
      || l.assignedTo?.toLowerCase().includes(q);
    const statusOK = statusFilter === "todos" || l.status === statusFilter || (!l.status && statusFilter === "nuevo");
    const priorityOK = priorityFilter === "todas" || l.priority === priorityFilter || (!l.priority && priorityFilter === "normal");
    const mineOK = !onlyMine || (!!user?.email && l.assignedTo === user.email);
    return textOK && statusOK && priorityOK && mineOK;
  });

  const updateLead = async (id: string, patch: Partial<Lead>) => {
    if (!db) return;
    const ref = doc(db, "leads", id);
    await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() } as any);
  };

  const addNote = async (lead: Lead, text: string) => {
    if (!text.trim()) return;
    const notes = [...(lead.notes || [])];
    notes.push({ text, at: new Date(), by: user?.email || user?.uid || "admin" });
    await updateLead(lead.id, { notes, lastNote: text });
  };

  const assignToMe = async (lead: Lead) => {
    if (!user?.email) return;
    await updateLead(lead.id, { assignedTo: user.email });
  };

  const scheduleFollowUp = async (lead: Lead, iso: string) => {
    if (!iso) return;
    await updateLead(lead.id, { followUpAt: new Date(iso) });
  };

  // === RENDER ===
  if (status === "loading") {
    return (
      <main className="container mx-auto px-4 py-20"><div className="flex justify-center"><span className="loading loading-spinner loading-lg" /></div></main>
    );
  }
  if (status !== "authenticated") {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto card bg-base-200/70 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl">Acceso</h1>
            <p className="opacity-70">Iniciá sesión para gestionar el CRM.</p>
            <button className="btn btn-primary" onClick={loginConGoogle}>Entrar con Google</button>
          </div>
        </div>
      </main>
    );
  }
  if (!isAdmin) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto card bg-warning/10 border border-warning/20 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl">Sin permisos</h1>
            <p className="opacity-80">Tu usuario no tiene permisos de administrador.</p>
            <button className="btn" onClick={logout}>Salir</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="grow">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">CRM · Consultas</h1>
          
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-70 hidden sm:block">{user?.email}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Salir</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-white/10 bg-base-200/60 backdrop-blur p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="input input-bordered flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-60"><path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 015.364 10.86l3.768 3.768a.75.75 0 11-1.06 1.06l-3.768-3.767A6.75 6.75 0 1110.5 3.75zm0 1.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" clipRule="evenodd"/></svg>
              <input className="grow" placeholder="Buscar por nombre, email, mensaje, fuente…" value={search} onChange={(e)=>setSearch(e.target.value)} />
            </label>
          </div>
          <div className="md:col-span-3">
            <select className="select select-bordered w-full" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)}>
              <option value="todos">Todos los estados</option>
              {STATUS_OPTS.map((s)=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <select className="select select-bordered w-full" value={priorityFilter} onChange={(e)=>setPriorityFilter(e.target.value as any)}>
              <option value="todas">Todas las prioridades</option>
              {PRIORITY_OPTS.map((p)=> <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <label className="md:col-span-1 flex items-center gap-3 justify-start">
            <input type="checkbox" className="toggle toggle-primary" checked={onlyMine} onChange={(e)=>setOnlyMine(e.target.checked)} />
            <span className="text-sm">Sólo míos</span>
          </label>
          <div className="md:col-span-12 flex items-center justify-between text-sm opacity-70">
            <div>{loading ? "Cargando…" : `${filtered.length} resultados · ${leads.length} totales`}</div>
            <div className="join">
              <button className={`join-item btn btn-sm ${view==='kanban' ? 'btn-primary' : ''}`} onClick={()=>setView('kanban')}>Tablero</button>
              <button className={`join-item btn btn-sm ${view==='tabla' ? 'btn-primary' : ''}`} onClick={()=>setView('tabla')}>Tabla</button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Kanban or Table */}
        <div className="lg:col-span-2">
          {view === "tabla" ? (
            <TableView
              items={filtered}
              onUpdate={updateLead}
              onAssign={assignToMe}
              onFollowUp={scheduleFollowUp}
              onSelect={setSelected}
              onAddNote={addNote}
            />
          ) : (
            <KanbanView
              items={filtered}
              onUpdate={updateLead}
              onAssign={assignToMe}
              onSelect={setSelected}
            />
          )}
        </div>

        {/* Detail panel */}
        <aside className="lg:col-span-1">
          <DetailPanel
  lead={selected}
  onClose={() => setSelected(null)}
  onAddNote={(txt) => { if (selected) void addNote(selected, txt); }}
  onFollowUp={(iso) => { if (selected) void scheduleFollowUp(selected, iso); }}
  onUpdate={(patch) => { if (selected) void updateLead(selected.id, patch); }}
/>
        </aside>
      </div>
    </main>
  );
}

// ===== Subcomponentes puramente de UI =====
function TableView({ items, onUpdate, onAssign, onFollowUp, onSelect, onAddNote }:{
  items: Lead[];
  onUpdate: (id: string, patch: Partial<Lead>) => void | Promise<void>;
  onAssign: (lead: Lead) => void | Promise<void>;
  onFollowUp: (lead: Lead, iso: string) => void | Promise<void>;
  onSelect: (lead: Lead) => void;
  onAddNote: (lead: Lead, text: string) => void | Promise<void>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-base-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-xs uppercase">
              <th>Contacto</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Asignado</th>
              <th>Seguimiento</th>
              <th>Fechas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id} className="align-top hover">
                <td className="min-w-[220px]">
                  <button className="font-medium hover:underline" onClick={()=>onSelect(l)}>{l.name || "(sin nombre)"}</button>
                  <div className="text-xs opacity-70">{l.email || "—"}</div>
                  <div className="badge badge-ghost mt-1">{l.source}</div>
                </td>
                <td className="min-w-[280px] whitespace-pre-wrap">{l.message}</td>
                <td>
                  <select className="select select-sm select-bordered" value={l.status || "nuevo"} onChange={(e)=>onUpdate(l.id, { status: e.target.value as any })}>
                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <select className="select select-sm select-bordered" value={l.priority || "normal"} onChange={(e)=>onUpdate(l.id, { priority: e.target.value as any })}>
                    {PRIORITY_OPTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td className="min-w-[180px]">
                  <div className="text-sm">{l.assignedTo || "—"}</div>
                  <div className="flex gap-2 mt-1">
                    <button className="btn btn-xs" onClick={()=>onAssign(l)}>Asignarme</button>
                    {l.assignedTo && (
                      <button className="btn btn-xs btn-ghost" onClick={()=>onUpdate(l.id, { assignedTo: null })}>Quitar</button>
                    )}
                  </div>
                </td>
                <td className="min-w-[220px]">
                  <div className="text-sm">{fmtDate(l.followUpAt)}</div>
                  <input type="datetime-local" className="input input-sm input-bordered mt-1 w-full" onChange={(e)=>onFollowUp(l, e.target.value)} />
                </td>
                <td className="text-sm min-w-[220px]">
                  <div>Creado: {fmtDate(l.createdAt)}</div>
                  <div>Act.: {fmtDate(l.updatedAt)}</div>
                </td>
                <td className="min-w-[260px]">
                  <AddNoteInline onAdd={(txt)=>onAddNote(l, txt)} />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a className="btn btn-xs btn-outline" href={`mailto:${encodeURIComponent(l.email || "")}`}>Email</a>
                    <a className="btn btn-xs btn-outline" href={`https://wa.me/${encodeURIComponent((l.email||"").match(/\+?\d+/)?.[0] || "")}`} target="_blank">WhatsApp</a>
                    <button className="btn btn-xs" onClick={()=>onUpdate(l.id, { status: "en_progreso" })}>Tomar</button>
                    <button className="btn btn-xs btn-success" onClick={()=>onUpdate(l.id, { status: "cerrado" })}>Cerrar</button>
                    <button className="btn btn-xs btn-warning" onClick={()=>onUpdate(l.id, { status: "descartado" })}>Descartar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KanbanView({ items, onUpdate, onAssign, onSelect }:{
  items: Lead[];
  onUpdate: (id: string, patch: Partial<Lead>) => void | Promise<void>;
  onAssign: (lead: Lead) => void | Promise<void>;
  onSelect: (lead: Lead) => void;
}) {
  const groups: Record<Lead["status"], Lead[]> = {
    nuevo: [], en_progreso: [], cerrado: [], descartado: []
  } as any;
  for (const l of items) {
    groups[(l.status || "nuevo") as Lead["status"]]?.push(l);
  }
  const cols: { key: Lead["status"]; title: string; hint: string }[] = [
    { key: "nuevo", title: "Nuevo", hint: "Ingresos recientes" },
    { key: "en_progreso", title: "En progreso", hint: "Hablando con el cliente" },
    { key: "cerrado", title: "Cerrado", hint: "Ganado/Resuelto" },
    { key: "descartado", title: "Descartado", hint: "No califica" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cols.map((c) => (
        <div key={c.key} className="rounded-2xl border border-white/10 bg-base-200/60">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-xs opacity-70">{c.hint}</p>
            </div>
            <span className="badge badge-ghost">{groups[c.key]?.length || 0}</span>
          </div>
          <div className="p-3 space-y-3">
            {groups[c.key]?.map((l) => (
              <article key={l.id} className="rounded-xl border border-white/10 bg-base-100/70 p-3 shadow hover:shadow-lg transition">
                <header className="flex items-start justify-between gap-2">
                  <button className="font-medium hover:underline text-left" onClick={()=>onSelect(l)}>{l.name || "(sin nombre)"}</button>
                  <span className={`badge ${l.priority==='alta' ? 'badge-error' : l.priority==='baja' ? 'badge-ghost' : 'badge-info'}`}>{l.priority || 'normal'}</span>
                </header>
                <p className="mt-1 text-sm opacity-80 line-clamp-3 whitespace-pre-wrap">{l.message}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs opacity-70">
                  <span className="badge badge-ghost">{l.source}</span>
                  <span>{l.email || '—'}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn btn-xs" onClick={()=>onAssign(l)}>Asignarme</button>
                  <button className="btn btn-xs" onClick={()=>onUpdate(l.id, { status: 'en_progreso' })}>Tomar</button>
                  <button className="btn btn-xs btn-success" onClick={()=>onUpdate(l.id, { status: 'cerrado' })}>Cerrar</button>
                  <button className="btn btn-xs btn-warning" onClick={()=>onUpdate(l.id, { status: 'descartado' })}>Descartar</button>
                </div>
              </article>
            ))}
            {(!groups[c.key] || groups[c.key].length === 0) && (
              <div className="p-4 text-center text-sm opacity-60">Sin items</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailPanel({ lead, onClose, onAddNote, onFollowUp, onUpdate }:{
  lead: Lead | null;
  onClose: () => void;
  onAddNote: (text: string) => void | Promise<void>;
  onFollowUp: (iso: string) => void | Promise<void>;
  onUpdate: (patch: Partial<Lead>) => void | Promise<void>;
}) {
  const [note, setNote] = useState("");
  if (!lead) {
    return (
      <div className="rounded-2xl border border-white/10 bg-base-200/50 p-5 h-full grid place-content-center text-sm opacity-70">
        Seleccioná un lead para ver el detalle.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-base-200/60 p-5 h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">{lead.name || "(sin nombre)"}</h3>
          <div className="text-sm opacity-80">{lead.email || "—"}</div>
          <div className="badge badge-ghost mt-2">{lead.source}</div>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={onClose}>Cerrar</button>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs opacity-70">Mensaje</label>
          <p className="whitespace-pre-wrap mt-1">{lead.message}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select className="select select-sm select-bordered" value={lead.status || 'nuevo'} onChange={(e)=>onUpdate({ status: e.target.value as any })}>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="select select-sm select-bordered" value={lead.priority || 'normal'} onChange={(e)=>onUpdate({ priority: e.target.value as any })}>
            {PRIORITY_OPTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs opacity-70">Seguimiento</label>
          <input type="datetime-local" className="input input-sm input-bordered mt-1 w-full" onChange={(e)=>onFollowUp(e.target.value)} />
          <p className="text-xs opacity-70 mt-1">{fmtDate(lead.followUpAt)}</p>
        </div>
        <div>
          <label className="text-xs opacity-70">Notas</label>
          <div className="mt-1 flex gap-2">
            <input className="input input-sm input-bordered w-full" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Agregar nota…" onKeyDown={(e)=>{ if(e.key==='Enter'){ onAddNote(note); setNote(''); } }} />
            <button className="btn btn-sm" onClick={()=>{ onAddNote(note); setNote(''); }}>Guardar</button>
          </div>
          {lead.lastNote && (
            <p className="text-xs opacity-70 mt-2">Última: {lead.lastNote}</p>
          )}
        </div>
        <div className="text-xs opacity-70">
          <div>Creado: {fmtDate(lead.createdAt)}</div>
          <div>Actualizado: {fmtDate(lead.updatedAt)}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="btn btn-xs btn-outline" href={`mailto:${encodeURIComponent(lead.email || '')}`}>Email</a>
          <a className="btn btn-xs btn-outline" href={`https://wa.me/${encodeURIComponent((lead.email||'').match(/\+?\d+/)?.[0] || '')}`} target="_blank">WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

function AddNoteInline({ onAdd }: { onAdd: (text: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <div className="join w-full">
      <input className="input input-sm input-bordered join-item w-full" placeholder="Agregar nota…" value={note} onChange={(e)=>setNote(e.target.value)} onKeyDown={(e)=>{ if(e.key === "Enter"){ onAdd(note); setNote(""); } }} />
      <button className="btn btn-sm join-item" onClick={()=>{ onAdd(note); setNote(""); }}>Guardar</button>
    </div>
  );
}
