"use client"

import React, { useMemo, useState } from "react"
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Home,
  Package,
  Receipt,
  ShoppingCart,
  Soup,
  Sparkles,
  Users,
} from "lucide-react"

type ShoppingItem = { id: number; text: string; done: boolean }
type PantryItem = { id: number; text: string; qty: string; area: string; barcode?: string }
type TaskItem = { id: number; text: string; done: boolean; assignedTo: string }
type ExpenseItem = {
  id: number
  title: string
  amount: number
  category: string
  paidBy: string
  receiptName: string
}
type EventItem = { id: number; title: string; date: string; person: string }
type MenuItem = { id: number; day: string; lunch: string; dinner: string; note: string }
type DocItem = {
  id: number
  name: string
  expiry: string
  category: string
  amount: number | ""
  notifyDays: number
  paymentMethod: string
  receiptName: string
  paid: boolean
}

const barcodeCatalog: Record<string, { name: string; qty: string; area: string }> = {
  "8001505005707": { name: "Pasta", qty: "1 pacco", area: "Dispensa" },
  "8001060011379": { name: "Latte", qty: "1 confezione", area: "Frigo" },
  "8076809513757": { name: "Passata di pomodoro", qty: "1 bottiglia", area: "Dispensa" },
}

const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]

const box =
  "rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur"
const boxSoft = "rounded-[26px] border border-slate-100 bg-slate-50/80 p-4"
const input =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
const btnAccent =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-medium text-white shadow-[0_10px_25px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5"
const label = "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"

function getDaysUntilExpiry(expiry: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = new Date(expiry)
  exp.setHours(0, 0, 0, 0)
  return Math.ceil((exp.getTime() - today.getTime()) / 86400000)
}

function getDocumentStatus(doc: DocItem): { text: string; cls: string } {
  const daysLeft = getDaysUntilExpiry(doc.expiry)
  if (daysLeft < 0) return { text: "Scaduto", cls: "bg-red-100 text-red-700" }
  if (daysLeft <= doc.notifyDays) return { text: `Avviso ${daysLeft}g`, cls: "bg-amber-100 text-amber-700" }
  return { text: `${daysLeft}g`, cls: "bg-emerald-100 text-emerald-700" }
}

const helperTests = [
  getDaysUntilExpiry("2099-01-01") > 0,
  getDocumentStatus({
    id: 1,
    name: "Test",
    expiry: "2099-01-01",
    category: "Documento",
    amount: "",
    notifyDays: 7,
    paymentMethod: "Bonifico",
    receiptName: "",
    paid: false,
  }).text.length > 0,
  getDocumentStatus({
    id: 2,
    name: "Scaduto",
    expiry: "2000-01-01",
    category: "Documento",
    amount: "",
    notifyDays: 7,
    paymentMethod: "Bonifico",
    receiptName: "",
    paid: false,
  }).text === "Scaduto",
].every(Boolean)

function StatCard({
  title,
  value,
  subtitle,
  Icon,
}: {
  title: string
  value: string
  subtitle: string
  Icon: React.ElementType
}) {
  return (
    <div className={box}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={label}>{title}</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
          <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default function HubCasaApp() {
  const [tab, setTab] = useState("overview")
  const [familyName, setFamilyName] = useState("Hub Casa")

  const members = [
    { id: 1, name: "Isaia", role: "Papà" },
    { id: 2, name: "Francesca", role: "Mamma" },
    { id: 3, name: "Alessandro", role: "Bimbo" },
  ]

  const [shoppingInput, setShoppingInput] = useState("")
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    { id: 1, text: "Latte", done: false },
    { id: 2, text: "Pasta", done: true },
    { id: 3, text: "Pannolini", done: false },
  ])

  const [pantryInput, setPantryInput] = useState("")
  const [barcodeInput, setBarcodeInput] = useState("")
  const [barcodeMessage, setBarcodeMessage] = useState("")
  const [pantryList, setPantryList] = useState<PantryItem[]>([
    { id: 1, text: "Pasta", qty: "2 pacchi", area: "Dispensa" },
    { id: 2, text: "Latte", qty: "2 confezioni", area: "Frigo" },
    { id: 3, text: "Passata", qty: "3 bottiglie", area: "Dispensa" },
  ])

  const [taskInput, setTaskInput] = useState("")
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 1, text: "Pagare bolletta luce", done: false, assignedTo: "Isaia" },
    { id: 2, text: "Portare Alessandro all’asilo", done: true, assignedTo: "Francesca" },
  ])

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "Casa",
    paidBy: "Papà",
    receiptName: "",
  })
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 1,
      title: "Spesa supermercato",
      amount: 84.3,
      category: "Casa",
      paidBy: "Papà",
      receiptName: "scontrino.jpg",
    },
    {
      id: 2,
      title: "Asilo Alessandro",
      amount: 230,
      category: "Bimbo",
      paidBy: "Mamma",
      receiptName: "",
    },
  ])

  const [eventForm, setEventForm] = useState({ title: "", date: "", person: "" })
  const [events, setEvents] = useState<EventItem[]>([
    { id: 1, title: "Pediatra", date: "2026-03-14", person: "Alessandro" },
    { id: 2, title: "Riunione scuola", date: "2026-03-18", person: "Francesca" },
  ])

  const [weeklyMenu, setWeeklyMenu] = useState<MenuItem[]>(
    days.map((day, i) => ({ id: i + 1, day, lunch: "", dinner: "", note: "" }))
  )

  const [docForm, setDocForm] = useState({
    name: "",
    expiry: "",
    category: "Documento",
    amount: "",
    notifyDays: 7,
    paymentMethod: "Bonifico",
    receiptName: "",
    paid: false,
  })
  const [documents, setDocuments] = useState<DocItem[]>([
    {
      id: 1,
      name: "Assicurazione auto",
      expiry: "2026-11-10",
      category: "Assicurazione",
      amount: 540,
      notifyDays: 30,
      paymentMethod: "RID bancario",
      receiptName: "quietanza.pdf",
      paid: true,
    },
    {
      id: 2,
      name: "Spese condominio",
      expiry: "2026-07-01",
      category: "Condominio",
      amount: 180,
      notifyDays: 7,
      paymentMethod: "Bonifico",
      receiptName: "",
      paid: false,
    },
  ])

  const totalExpenses = useMemo(() => expenses.reduce((s, x) => s + x.amount, 0), [expenses])
  const dadExpenses = useMemo(
    () => expenses.filter((x) => x.paidBy === "Papà").reduce((s, x) => s + x.amount, 0),
    [expenses]
  )
  const momExpenses = useMemo(
    () => expenses.filter((x) => x.paidBy === "Mamma").reduce((s, x) => s + x.amount, 0),
    [expenses]
  )

  const addShoppingItem = () => {
    if (!shoppingInput.trim()) return
    setShoppingList((p) => [{ id: Date.now(), text: shoppingInput.trim(), done: false }, ...p])
    setShoppingInput("")
  }

  const toggleShopping = (id: number) => {
    setShoppingList((p) => p.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
  }

  const removeShopping = (id: number) => {
    setShoppingList((p) => p.filter((x) => x.id !== id))
  }

  const addPantryItem = () => {
    if (!pantryInput.trim()) return
    setPantryList((p) => [{ id: Date.now(), text: pantryInput.trim(), qty: "1", area: "Dispensa" }, ...p])
    setPantryInput("")
  }

  const addProductByBarcode = () => {
    const code = barcodeInput.trim()
    if (!code) return
    const product = barcodeCatalog[code]
    if (!product) {
      setBarcodeMessage("Codice non trovato nel catalogo demo")
      return
    }
    setPantryList((p) => [
      { id: Date.now(), text: product.name, qty: product.qty, area: product.area, barcode: code },
      ...p,
    ])
    setBarcodeInput("")
    setBarcodeMessage(`${product.name} aggiunto in dispensa`)
  }

  const removePantry = (id: number) => {
    setPantryList((p) => p.filter((x) => x.id !== id))
  }

  const movePantryToShopping = (item: PantryItem) => {
    setShoppingList((p) => [{ id: Date.now(), text: item.text, done: false }, ...p])
  }

  const addTask = () => {
    if (!taskInput.trim()) return
    setTasks((p) => [{ id: Date.now(), text: taskInput.trim(), done: false, assignedTo: "Casa" }, ...p])
    setTaskInput("")
  }

  const toggleTask = (id: number) => {
    setTasks((p) => p.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
  }

  const removeTask = (id: number) => {
    setTasks((p) => p.filter((x) => x.id !== id))
  }

  const addExpense = () => {
    if (!expenseForm.title.trim() || !expenseForm.amount) return
    setExpenses((p) => [
      {
        id: Date.now(),
        title: expenseForm.title.trim(),
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        paidBy: expenseForm.paidBy,
        receiptName: expenseForm.receiptName,
      },
      ...p,
    ])
    setExpenseForm({ title: "", amount: "", category: "Casa", paidBy: "Papà", receiptName: "" })
  }

  const removeExpense = (id: number) => {
    setExpenses((p) => p.filter((x) => x.id !== id))
  }

  const addEvent = () => {
    if (!eventForm.title.trim() || !eventForm.date) return
    setEvents((p) => [
      {
        id: Date.now(),
        title: eventForm.title.trim(),
        date: eventForm.date,
        person: eventForm.person || "Casa",
      },
      ...p,
    ])
    setEventForm({ title: "", date: "", person: "" })
  }

  const removeEvent = (id: number) => {
    setEvents((p) => p.filter((x) => x.id !== id))
  }

  const updateMenu = (id: number, field: keyof MenuItem, value: string) => {
    setWeeklyMenu((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)))
  }

  const addDocument = () => {
    if (!docForm.name.trim() || !docForm.expiry) return
    setDocuments((p) => [
      {
        id: Date.now(),
        name: docForm.name.trim(),
        expiry: docForm.expiry,
        category: docForm.category,
        amount: docForm.amount ? Number(docForm.amount) : "",
        notifyDays: docForm.notifyDays,
        paymentMethod: docForm.paymentMethod,
        receiptName: docForm.receiptName,
        paid: docForm.paid,
      },
      ...p,
    ])
    setDocForm({
      name: "",
      expiry: "",
      category: "Documento",
      amount: "",
      notifyDays: 7,
      paymentMethod: "Bonifico",
      receiptName: "",
      paid: false,
    })
  }

  const toggleDocumentPaid = (id: number) => {
    setDocuments((p) => p.map((x) => (x.id === id ? { ...x, paid: !x.paid } : x)))
  }

  const removeDocument = (id: number) => {
    setDocuments((p) => p.filter((x) => x.id !== id))
  }

  const tabs: Array<[string, string, React.ElementType]> = [
    ["overview", "Panoramica", Home],
    ["shopping", "Spesa", ShoppingCart],
    ["tasks", "Attività", ClipboardList],
    ["expenses", "Spese", CreditCard],
    ["calendar", "Calendario", CalendarDays],
    ["menu", "Menu", Soup],
    ["documents", "Scadenze", BellRing],
  ]

  const statCards: Array<[string, string, string, React.ElementType]> = [
    ["Spese mese", `€ ${totalExpenses.toFixed(2)}`, "Totale registrato", CreditCard],
    ["Attività", `${tasks.filter((x) => !x.done).length}`, "Da completare", ClipboardList],
    ["Lista spesa", `${shoppingList.filter((x) => !x.done).length}`, "Elementi mancanti", ShoppingCart],
    ["Dispensa", `${pantryList.length}`, "Prodotti registrati", Package],
    ["Scontrini", `${expenses.filter((x) => x.receiptName).length}`, "File collegati", Receipt],
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#eef2ff_45%,_#f8fafc)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-[0_22px_60px_rgba(15,23,42,0.20)] md:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-12 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85">
                <Sparkles className="h-3.5 w-3.5" /> Hub Casa Premium
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{familyName}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-200/80 md:text-base">
                Una dashboard domestica più elegante e chiara, pensata per usare davvero spesa, scadenze, menu e conti senza perdersi in schermate brutte.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50">Famiglia</div>
                  <div className="mt-1 text-lg font-semibold">{members.length} profili</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50">Test helper</div>
                  <div className="mt-1 text-lg font-semibold">{helperTests ? "OK" : "Check"}</div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/60">Nome famiglia</div>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30 focus:ring-4 focus:ring-white/10"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Nome famiglia"
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50">Scadenze</div>
                  <div className="mt-1 text-xl font-semibold">{documents.length}</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50">Spese mese</div>
                  <div className="mt-1 text-xl font-semibold">€ {totalExpenses.toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statCards.map(([title, value, subtitle, Icon]) => (
            <StatCard key={title} title={title} value={value} subtitle={subtitle} Icon={Icon} />
          ))}
        </div>

        <div className="rounded-[30px] border border-white/70 bg-white/85 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.07)] backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {tabs.map(([key, title, Icon]) => {
              const active = tab === key
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={
                    active
                      ? "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
                      : "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  }
                >
                  <Icon className="h-4 w-4" />
                  {title}
                </button>
              )
            })}
          </div>
        </div>

        {tab === "overview" && (
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Componenti famiglia</div>
                  <div className="text-sm text-slate-500">Vista rapida di chi fa parte di Hub Casa</div>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {members.map((m, index) => (
                  <div key={m.id} className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div className="font-semibold text-slate-900">{m.name}</div>
                    <div className="text-sm text-slate-500">{m.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Conti spese</div>
                  <div className="text-sm text-slate-500">Chi sta pagando cosa, senza fare archeologia</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">
                  <div className={label}>Papà</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">€ {dadExpenses.toFixed(2)}</div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-900"
                      style={{ width: `${totalExpenses ? (dadExpenses / totalExpenses) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-gradient-to-r from-indigo-50 to-white p-4">
                  <div className={label}>Mamma</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">€ {momExpenses.toFixed(2)}</div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${totalExpenses ? (momExpenses / totalExpenses) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "shopping" && (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Lista spesa</div>
                  <div className="text-sm text-slate-500">A colpo d'occhio capisci cosa manca davvero</div>
                </div>
              </div>
              <div className="mb-4 flex gap-2">
                <input
                  className={input}
                  value={shoppingInput}
                  onChange={(e) => setShoppingInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addShoppingItem()}
                  placeholder="Aggiungi prodotto"
                />
                <button className={btnAccent} onClick={addShoppingItem}>
                  <ArrowRight className="h-4 w-4" />
                  Aggiungi
                </button>
              </div>
              <div className="space-y-2">
                {shoppingList.map((x) => (
                  <div key={x.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={x.done} onChange={() => toggleShopping(x.id)} />
                      <span className={x.done ? "line-through text-slate-400" : "text-slate-900"}>{x.text}</span>
                    </label>
                    <button className={btnGhost} onClick={() => removeShopping(x.id)}>
                      Elimina
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Dispensa</div>
                  <div className="text-sm text-slate-500">Quello che hai già in casa, senza andare a memoria</div>
                </div>
              </div>
              <div className="mb-3 flex gap-2">
                <input
                  className={input}
                  value={pantryInput}
                  onChange={(e) => setPantryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPantryItem()}
                  placeholder="Aggiungi prodotto in casa"
                />
                <button className={btnAccent} onClick={addPantryItem}>
                  <ArrowRight className="h-4 w-4" />
                  Salva
                </button>
              </div>
              <div className="mb-4 rounded-xl border border-dashed border-slate-300 p-3">
                <div className="mb-2 font-medium">Codice a barre</div>
                <div className="flex gap-2">
                  <input
                    className={input}
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addProductByBarcode()}
                    placeholder="Scrivi il codice"
                  />
                  <button className={btnAccent} onClick={addProductByBarcode}>
                    <ArrowRight className="h-4 w-4" />
                    Leggi
                  </button>
                </div>
                {barcodeMessage ? <div className="mt-2 text-sm text-slate-600">{barcodeMessage}</div> : null}
              </div>
              <div className="space-y-2">
                {pantryList.map((x) => (
                  <div key={x.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{x.text}</div>
                        <div className="text-xs text-slate-500">
                          {x.qty} · {x.area}
                          {x.barcode ? ` · ${x.barcode}` : ""}
                        </div>
                      </div>
                      <button className={btnGhost} onClick={() => removePantry(x.id)}>
                        Elimina
                      </button>
                    </div>
                    <button className={`${btnGhost} mt-3`} onClick={() => movePantryToShopping(x)}>
                      Metti in lista
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "tasks" && (
          <div className={box}>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">Attività</div>
                <div className="text-sm text-slate-500">Task semplici, leggibili e veloci da spuntare</div>
              </div>
            </div>
            <div className="mb-4 flex gap-2">
              <input
                className={input}
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Nuova attività"
              />
              <button className={btnAccent} onClick={addTask}>
                <ArrowRight className="h-4 w-4" />
                Aggiungi
              </button>
            </div>
            <div className="space-y-2">
              {tasks.map((x) => (
                <div key={x.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={x.done} onChange={() => toggleTask(x.id)} />
                    <span className={x.done ? "line-through text-slate-400" : "text-slate-900"}>{x.text}</span>
                  </label>
                  <button className={btnGhost} onClick={() => removeTask(x.id)}>
                    Elimina
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "expenses" && (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Spese</div>
                  <div className="text-sm text-slate-500">Controllo chiaro di quanto spendete e da quale conto</div>
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input className={input} value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} placeholder="Descrizione" />
                <input className={input} type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} placeholder="Importo" />
                <select className={input} value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
                  <option>Casa</option>
                  <option>Bimbo</option>
                  <option>Utenze</option>
                  <option>Spesa</option>
                  <option>Auto</option>
                </select>
                <select className={input} value={expenseForm.paidBy} onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}>
                  <option>Papà</option>
                  <option>Mamma</option>
                </select>
              </div>
              <input
                className={`${input} mt-2`}
                type="file"
                accept="image/*"
                onChange={(e) => setExpenseForm({ ...expenseForm, receiptName: e.target.files?.[0]?.name || "" })}
              />
              {expenseForm.receiptName ? <div className="mt-2 text-sm text-slate-600">File: {expenseForm.receiptName}</div> : null}
              <button className={`${btnAccent} mt-3`} onClick={addExpense}>
                <ArrowRight className="h-4 w-4" />
                Aggiungi spesa
              </button>
              <div className="mt-4 space-y-2">
                {expenses.map((x) => (
                  <div key={x.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <div className="font-medium">{x.title}</div>
                      <div className="text-xs text-slate-500">
                        {x.category} · {x.paidBy}
                        {x.receiptName ? ` · ${x.receiptName}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-sm">€ {x.amount.toFixed(2)}</span>
                      <button className={btnGhost} onClick={() => removeExpense(x.id)}>
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={box}>
              <div className="mb-3 text-lg font-semibold text-slate-900">Ripartizione</div>
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className={label}>Conto Papà</div>
                  <div className="text-2xl font-bold">€ {dadExpenses.toFixed(2)}</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className={label}>Conto Mamma</div>
                  <div className="text-2xl font-bold">€ {momExpenses.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "calendar" && (
          <div className={box}>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">Calendario</div>
                <div className="text-sm text-slate-500">Impegni familiari ordinati e facili da trovare</div>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-4">
              <input className={input} value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Titolo evento" />
              <input className={input} type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
              <input className={input} value={eventForm.person} onChange={(e) => setEventForm({ ...eventForm, person: e.target.value })} placeholder="Per chi" />
              <button className={btnAccent} onClick={addEvent}>
                <ArrowRight className="h-4 w-4" />
                Aggiungi
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {events.slice().sort((a, b) => a.date.localeCompare(b.date)).map((x) => (
                <div key={x.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <div className="font-medium">{x.title}</div>
                    <div className="text-sm text-slate-500">{x.date} · {x.person}</div>
                  </div>
                  <button className={btnGhost} onClick={() => removeEvent(x.id)}>Elimina</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "menu" && (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <Soup className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Menu settimanale</div>
                  <div className="text-sm text-slate-500">Pranzi e cene della settimana in modo più ordinato</div>
                </div>
              </div>
              <div className="space-y-3">
                {weeklyMenu.map((x) => (
                  <div key={x.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 font-medium">{x.day}</div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <input className={input} value={x.lunch} onChange={(e) => updateMenu(x.id, "lunch", e.target.value)} placeholder="Pranzo" />
                      <input className={input} value={x.dinner} onChange={(e) => updateMenu(x.id, "dinner", e.target.value)} placeholder="Cena" />
                    </div>
                    <input className={`${input} mt-2`} value={x.note} onChange={(e) => updateMenu(x.id, "note", e.target.value)} placeholder="Nota del giorno" />
                  </div>
                ))}
              </div>
            </div>

            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Vista rapida</div>
                  <div className="text-sm text-slate-500">Il colpo d'occhio che ti serve davvero</div>
                </div>
              </div>
              <div className="space-y-2">
                {weeklyMenu.map((x) => (
                  <div key={x.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="font-medium">{x.day}</div>
                    <div className="text-sm text-slate-500">Pranzo: {x.lunch || "—"}</div>
                    <div className="text-sm text-slate-500">Cena: {x.dinner || "—"}</div>
                    {x.note ? <div className="text-xs text-slate-400">{x.note}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "documents" && (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <BellRing className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Scadenze</div>
                  <div className="text-sm text-slate-500">Documenti, pagamenti e ricevute sotto controllo</div>
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <input className={input} value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} placeholder="Documento o scadenza" />
                <input className={input} type="date" value={docForm.expiry} onChange={(e) => setDocForm({ ...docForm, expiry: e.target.value })} />
                <select className={input} value={docForm.category} onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}>
                  <option>Documento</option>
                  <option>Patente</option>
                  <option>Assicurazione</option>
                  <option>Condominio</option>
                  <option>Altro</option>
                </select>
                <input className={input} type="number" value={docForm.amount} onChange={(e) => setDocForm({ ...docForm, amount: e.target.value })} placeholder="Importo" />
                <select className={input} value={docForm.notifyDays} onChange={(e) => setDocForm({ ...docForm, notifyDays: Number(e.target.value) })}>
                  <option value={3}>Avvisa 3 giorni prima</option>
                  <option value={7}>Avvisa 7 giorni prima</option>
                  <option value={15}>Avvisa 15 giorni prima</option>
                  <option value={30}>Avvisa 30 giorni prima</option>
                </select>
                <select className={input} value={docForm.paymentMethod} onChange={(e) => setDocForm({ ...docForm, paymentMethod: e.target.value })}>
                  <option>Bonifico</option>
                  <option>Contanti</option>
                  <option>Bancomat</option>
                  <option>RID bancario</option>
                </select>
              </div>
              <input
                className={`${input} mt-2`}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocForm({ ...docForm, receiptName: e.target.files?.[0]?.name || "" })}
              />
              {docForm.receiptName ? <div className="mt-2 text-sm text-slate-600">Ricevuta: {docForm.receiptName}</div> : null}
              <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={docForm.paid} onChange={() => setDocForm({ ...docForm, paid: !docForm.paid })} />
                Segna come già pagato
              </label>
              <button className={`${btnAccent} mt-3`} onClick={addDocument}>
                <ArrowRight className="h-4 w-4" />
                Aggiungi scadenza
              </button>
              <div className="mt-4 space-y-2">
                {documents.slice().sort((a, b) => a.expiry.localeCompare(b.expiry)).map((x) => {
                  const s = getDocumentStatus(x)
                  return (
                    <div key={x.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{x.name}</div>
                          <div className="text-xs text-slate-500">
                            {x.category} · {x.expiry}
                            {x.amount !== "" ? ` · € ${Number(x.amount).toFixed(2)}` : ""} · {x.paymentMethod} · Avviso {x.notifyDays}g
                            {x.receiptName ? ` · ${x.receiptName}` : ""}
                          </div>
                        </div>
                        <span className={`rounded-lg px-2 py-1 text-xs ${s.cls}`}>{s.text}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                          <input type="checkbox" checked={x.paid} onChange={() => toggleDocumentPaid(x.id)} />
                          {x.paid ? "Pagato" : "Da pagare"}
                        </label>
                        <button className={btnGhost} onClick={() => removeDocument(x.id)}>Elimina</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={box}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
                  <BellRing className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">Promemoria</div>
                  <div className="text-sm text-slate-500">Informazioni utili senza disordine</div>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className={boxSoft}>Qui ci sono già importo, ricevuta, metodo di pagamento e avviso anticipato.</div>
                <div className={boxSoft}>La notifica per ora è visiva. Quella vera sul telefono arriva nel prossimo step.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
