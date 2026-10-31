'use client'

import { useEffect, useState, useRef } from 'react'

interface Deal {
  id: string; name: string; value: number; stage: string; probability: number
  closeDate: string | null
  owner: { name: string; avatar: string }
  contact: { name: string } | null
  company: { name: string } | null
}

interface TaskItem {
  id: string; title: string; dueDate: string; completed: boolean; priority: string
  deal: { name: string } | null
  user: { name: string; avatar: string }
}

interface ActivityItem {
  id: string; type: string; note: string; createdAt: string
  user: { name: string; avatar: string }
  deal: { name: string } | null
  contact: { name: string } | null
}

type View = 'pipeline' | 'contacts' | 'tasks'

const STAGES = [
  { key: 'lead', label: 'Lead', color: '#6B6B8D' },
  { key: 'contacted', label: 'Contacted', color: '#22D3EE' },
  { key: 'qualified', label: 'Qualified', color: '#8B5CF6' },
  { key: 'proposal', label: 'Proposal', color: '#F59E0B' },
  { key: 'won', label: 'Won', color: '#22C55E' },
  { key: 'lost', label: 'Lost', color: '#EF4444' },
]

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  return `${days}d ago`
}

export default function PipePage() {
  const [view, setView] = useState<View>('pipeline')
  const [pipeline, setPipeline] = useState<Record<string, Deal[]>>({})
  const [metrics, setMetrics] = useState({ totalValue: 0, weightedForecast: 0, winRate: 0, wonValue: 0, dealCount: 0 })
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<string | null>(null)
  const dragRef = useRef<string | null>(null)

  const load = async () => {
    const [pRes, tRes, aRes] = await Promise.all([
      fetch('/api/pipeline').then(r => r.json()),
      fetch('/api/tasks').then(r => r.json()),
      fetch('/api/activities').then(r => r.json()),
    ])
    setPipeline(pRes.pipeline || {})
    setMetrics({ totalValue: pRes.totalValue, weightedForecast: pRes.weightedForecast, winRate: pRes.winRate, wonValue: pRes.wonValue, dealCount: pRes.dealCount })
    setTasks(tRes.tasks || [])
    setActivities(aRes.activities || [])
    setLoading(false)
  }

  const loadContacts = async () => {
    const r = await fetch(`/api/contacts${search ? `?search=${encodeURIComponent(search)}` : ''}`).then(r => r.json())
    setContacts(r.contacts || [])
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (view === 'contacts') loadContacts() }, [view, search])

  const moveDeal = async (dealId: string, newStage: string) => {
    const probs: Record<string, number> = { lead: 10, contacted: 25, qualified: 50, proposal: 75, won: 100, lost: 0 }
    await fetch('/api/deals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dealId, stage: newStage, probability: probs[newStage] }),
    })
    load()
  }

  const toggleTask = async (id: string, completed: boolean) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !completed }),
    })
    load()
  }

  const handleDragStart = (dealId: string) => {
    setDragging(dealId)
    dragRef.current = dealId
  }

  const handleDrop = (stage: string) => {
    if (dragRef.current) {
      moveDeal(dragRef.current, stage)
      dragRef.current = null
      setDragging(null)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const actIcons: Record<string, string> = { call: '\u{1F4DE}', email: '\u{2709}\u{FE0F}', meeting: '\u{1F91D}', note: '\u{1F4DD}' }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex w-56 flex-shrink-0 flex-col border-r border-[#1E1E36] bg-[#0D0D14]">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #6D4AFF, #8B5CF6)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <span className="text-lg font-bold font-display">Pipe</span>
        </div>
        <nav className="flex-1 px-3">
          {([
            { key: 'pipeline' as View, label: 'Pipeline', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
            { key: 'contacts' as View, label: 'Contacts', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
            { key: 'tasks' as View, label: 'Tasks', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
          ]).map(n => (
            <button key={n.key} onClick={() => setView(n.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-1 ${view === n.key ? 'bg-[#6D4AFF]/15 text-[#A78BFA]' : 'text-[#6B6B8D] hover:bg-[#13131C] hover:text-[#EDEDF2]'}`}
            >
              {n.icon}{n.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-[#1E1E36] px-5 py-4 text-[10px] text-[#6B6B8D]">
          Pipe CRM &middot; Zolentix
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center text-[#6B6B8D]">Loading...</div>
        ) : view === 'pipeline' ? (
          <div className="flex h-full flex-col">
            {/* KPIs */}
            <div className="border-b border-[#1E1E36] px-6 py-4">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold font-display">Sales Pipeline</h1>
                <span className="text-xs text-[#6B6B8D]">{metrics.dealCount} deals</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Pipeline Value', value: fmt(metrics.totalValue), color: '#6D4AFF' },
                  { label: 'Weighted Forecast', value: fmt(metrics.weightedForecast), color: '#22D3EE' },
                  { label: 'Win Rate', value: `${metrics.winRate}%`, color: '#22C55E' },
                  { label: 'Won Revenue', value: fmt(metrics.wonValue), color: '#F59E0B' },
                ].map((k, i) => (
                  <div key={i} className="rounded-xl border border-[#1E1E36] bg-[#13131C] p-4">
                    <div className="text-xs text-[#6B6B8D]">{k.label}</div>
                    <div className="mt-1 text-2xl font-bold font-display" style={{ color: k.color }}>{k.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kanban */}
            <div className="flex flex-1 gap-3 overflow-x-auto p-4">
              {STAGES.map(s => (
                <div
                  key={s.key}
                  className="flex w-64 flex-shrink-0 flex-col rounded-xl border border-[#1E1E36] bg-[#0D0D14]"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(s.key)}
                >
                  <div className="flex items-center justify-between border-b border-[#1E1E36] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-semibold">{s.label}</span>
                    </div>
                    <span className="rounded-full bg-[#1A1A28] px-2 py-0.5 text-[10px] text-[#6B6B8D]">
                      {(pipeline[s.key] || []).length}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {(pipeline[s.key] || []).map(deal => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDragStart(deal.id)}
                        onDragEnd={() => { setDragging(null); dragRef.current = null }}
                        className={`cursor-grab rounded-lg border border-[#1E1E36] bg-[#13131C] p-3 transition-all hover:border-[#6D4AFF]/40 active:cursor-grabbing ${dragging === deal.id ? 'opacity-40' : ''}`}
                      >
                        <div className="mb-1 text-sm font-medium leading-tight">{deal.name}</div>
                        <div className="text-xs text-[#6B6B8D]">{deal.company?.name}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-bold font-display" style={{ color: s.color }}>{fmt(deal.value)}</span>
                          <div className="flex items-center gap-1">
                            <div className="grid h-5 w-5 place-items-center rounded-full bg-[#6D4AFF]/20 text-[8px] font-bold text-[#A78BFA]">{deal.owner.avatar}</div>
                          </div>
                        </div>
                        {deal.closeDate && (
                          <div className="mt-1.5 text-[10px] text-[#6B6B8D]">Close: {deal.closeDate}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#1E1E36] px-4 py-2 text-[10px] text-[#6B6B8D] text-center">
                    {fmt((pipeline[s.key] || []).reduce((sum, d) => sum + d.value, 0))}
                  </div>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="border-t border-[#1E1E36] px-6 py-3">
              <div className="mb-2 text-xs font-bold text-[#6B6B8D]">Recent Activity</div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {activities.slice(0, 8).map(a => (
                  <div key={a.id} className="flex-shrink-0 rounded-lg border border-[#1E1E36] bg-[#13131C] px-3 py-2 text-xs" style={{ minWidth: 200 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{actIcons[a.type] || ''}</span>
                      <span className="font-medium">{a.user.name}</span>
                      <span className="text-[#6B6B8D]">{timeAgo(a.createdAt)}</span>
                    </div>
                    <div className="text-[#6B6B8D] line-clamp-1">{a.note}</div>
                    {a.deal && <div className="mt-1 text-[10px] text-[#A78BFA]">{a.deal.name}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : view === 'contacts' ? (
          <div className="h-full overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-bold font-display">Contacts</h1>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="rounded-lg border border-[#1E1E36] bg-[#13131C] px-3 py-2 text-sm text-[#EDEDF2] outline-none placeholder:text-[#6B6B8D] focus:border-[#6D4AFF]/50 w-64"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-[#1E1E36]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1E1E36] bg-[#0D0D14]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B6B8D]">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B6B8D]">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B6B8D]">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B6B8D]">Company</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c.id} className="border-b border-[#1E1E36] bg-[#13131C] hover:bg-[#1A1A28] transition-colors">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-[#6B6B8D]">{c.email}</td>
                      <td className="px-4 py-3 text-[#6B6B8D]">{c.title || '—'}</td>
                      <td className="px-4 py-3 text-[#A78BFA]">{c.company?.name || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-[#6B6B8D]">{contacts.length} contacts</div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <h1 className="mb-4 text-xl font-bold font-display">Tasks & Follow-ups</h1>
            <div className="space-y-2">
              {tasks.map(t => {
                const overdue = !t.completed && t.dueDate < today
                return (
                  <div key={t.id} className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${t.completed ? 'border-[#1E1E36] bg-[#0D0D14] opacity-60' : overdue ? 'border-[#EF4444]/30 bg-[#EF4444]/5' : 'border-[#1E1E36] bg-[#13131C]'}`}>
                    <button
                      onClick={() => toggleTask(t.id, t.completed)}
                      className={`grid h-6 w-6 flex-shrink-0 place-items-center rounded-md border-2 transition-all ${t.completed ? 'border-[#22C55E] bg-[#22C55E]/20' : 'border-[#6B6B8D]'}`}
                    >
                      {t.completed && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                    </button>
                    <div className="flex-1">
                      <div className={`font-medium ${t.completed ? 'line-through text-[#6B6B8D]' : ''}`}>{t.title}</div>
                      <div className="text-xs text-[#6B6B8D]">
                        {t.deal?.name && <span className="text-[#A78BFA]">{t.deal.name}</span>}
                        {t.deal?.name && ' · '}
                        {t.user.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${t.priority === 'high' ? 'bg-[#EF4444]/15 text-[#EF4444]' : t.priority === 'medium' ? 'bg-[#F59E0B]/15 text-[#F59E0B]' : 'bg-[#6B6B8D]/15 text-[#6B6B8D]'}`}>
                        {t.priority}
                      </span>
                      <span className={`text-xs ${overdue ? 'font-bold text-[#EF4444]' : 'text-[#6B6B8D]'}`}>
                        {overdue ? 'Overdue' : ''} {t.dueDate}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
