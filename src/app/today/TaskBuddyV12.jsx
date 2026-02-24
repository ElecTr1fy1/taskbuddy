'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, ChevronDown, ChevronRight, ChevronLeft, Mic, Send, Sun, Moon, LayoutDashboard, ListTodo, Archive, Settings, Search, X, GripVertical, Clock, User, Target, Plus, ExternalLink, Trash2, BarChart3, AlertTriangle, Calendar, Circle, Zap, Brain, Sliders, Tag } from 'lucide-react';

// ─── TASK DATA ────────────────────────────────────────────────
const tasks0 = [
  { id: 1, title: 'Research True Classic competitor ads', cat: 'Business', impact: 9, urgency: 8, effort: 5, time: 60, age: 4, done: false, status: 'todo',
    notes: 'Look at their Facebook and YouTube ad creatives. Focus on hooks, offers, and CTAs.', link: 'https://www.facebook.com/ads/library', aiReason: 'High-impact competitive intel that directly affects your ad spend ROI.',
    dueDate: '2026-02-23', deadlineType: 'soft', confidence: 8, subtasks: [{ id: 101, title: 'Pull Facebook ad library data', done: false }, { id: 102, title: 'Analyze top 5 video hooks', done: false }, { id: 103, title: 'Draft findings doc', done: false }] },
  { id: 2, title: 'Review Q1 revenue projections', cat: 'Business', impact: 8, urgency: 7, effort: 6, time: 90, age: 2, done: false, status: 'todo',
    notes: 'Compare actuals vs forecast for Jan-Feb. Identify gaps before board meeting.', link: '', aiReason: 'Aligns with your goal of data-driven decisions. Board meeting is approaching.',
    dueDate: '2026-02-25', deadlineType: 'soft', confidence: 7, subtasks: [] },
  { id: 3, title: 'Pay team salaries', cat: 'Business', impact: 6, urgency: 10, effort: 2, time: 15, age: 0, done: false, status: 'todo',
    notes: 'Process through Gusto. Verify hours for part-time team members.', link: 'https://app.gusto.com', aiReason: 'Hard deadline \u2014team depends on this. Quick to execute.',
    dueDate: '2026-02-22', deadlineType: 'hard', confidence: 9, subtasks: [] },
  { id: 4, title: 'Prepare investor pitch deck', cat: 'Work', impact: 10, urgency: 6, effort: 8, time: 180, age: 7, done: false, status: 'in_progress',
    notes: 'Use the Sequoia format. Include TAM/SAM/SOM, traction metrics, and team slide.', link: 'https://docs.google.com/presentation', aiReason: 'Your highest-impact task. Aligns with Series A goal. Consider deep-work blocks.',
    dueDate: null, deadlineType: null, confidence: 6, subtasks: [{ id: 104, title: 'Draft narrative arc', done: true }, { id: 105, title: 'Build financial model slide', done: false }, { id: 106, title: 'Design team slide', done: false }, { id: 107, title: 'Rehearse 3x', done: false }] },
  { id: 5, title: 'Morning workout routine', cat: 'Health', impact: 7, urgency: 3, effort: 4, time: 45, age: 0, done: false, status: 'todo',
    notes: 'Upper body + 20 min cardio. Gym opens at 6am.', link: '', aiReason: 'Consistent health habits fuel your productivity. You have been skipping this category.',
    dueDate: null, deadlineType: null, confidence: 8, subtasks: [] },
  { id: 6, title: 'Call supplier about Q2 inventory', cat: 'Business', impact: 7, urgency: 7, effort: 3, time: 20, age: 3, done: false, status: 'todo',
    notes: 'Confirm lead times for spring collection. Ask about bulk discount thresholds.', link: '', aiReason: 'Quick win with real business impact. 3 days overdue.',
    dueDate: '2026-02-20', deadlineType: 'soft', confidence: 9, subtasks: [] },
  { id: 7, title: 'Update LinkedIn profile', cat: 'Personal', impact: 4, urgency: 2, effort: 3, time: 30, age: 14, done: false, status: 'todo',
    notes: 'Add recent achievements, update headline, refresh headshot.', link: 'https://linkedin.com', aiReason: 'Low urgency but 14 days old. Consider batching with other personal tasks.',
    dueDate: null, deadlineType: null, confidence: 7, subtasks: [] },
  { id: 8, title: 'Send Tanaor weekly email blast', cat: 'Business', impact: 7, urgency: 8, effort: 4, time: 40, age: 1, done: false, status: 'todo',
    notes: 'Feature new arrivals. Segment: engaged buyers.', link: 'https://klaviyo.com', aiReason: 'Time-sensitive marketing. Revenue-driving activity with clear deadline.',
    dueDate: '2026-02-21', deadlineType: 'hard', confidence: 8, subtasks: [] },
  { id: 9, title: 'Quarterly tax document prep', cat: 'Work', impact: 6, urgency: 5, effort: 7, time: 120, age: 8, done: false, status: 'todo',
    notes: 'Gather receipts, categorize expenses, send to accountant.', link: '', aiReason: '8 days old and high effort. Break this into smaller chunks.',
    dueDate: '2026-03-15', deadlineType: 'hard', confidence: 5, subtasks: [] },
  { id: 10, title: 'Plan weekend trip with family', cat: 'Personal', impact: 5, urgency: 3, effort: 3, time: 25, age: 0, done: false, status: 'todo',
    notes: 'Look at Airbnb for 2-night getaway. Budget: $400.', link: 'https://airbnb.com', aiReason: 'Personal recharge supports long-term performance.',
    dueDate: null, deadlineType: null, confidence: 7, subtasks: [] },
  { id: 11, title: 'Website redesign brief', cat: 'Business', impact: 8, urgency: 4, effort: 6, time: 60, age: 14, done: false, status: 'todo',
    notes: 'Write creative brief for agency. Include brand guidelines and conversion goals.', link: '', aiReason: '14 days without progress. High impact but keeps getting pushed.',
    dueDate: null, deadlineType: null, confidence: 6, subtasks: [] },
  { id: 12, title: 'Read "Zero to One" chapter 5-7', cat: 'Personal', impact: 4, urgency: 1, effort: 2, time: 30, age: 0, done: false, status: 'todo',
    notes: 'Focus on the monopoly vs competition chapter.', link: '', aiReason: 'Quick low-effort personal development. Good for low-energy moments.',
    dueDate: null, deadlineType: null, confidence: 9, subtasks: [] },
];

const catColors = { Work: '#5B6CF0', Business: '#D4643B', Health: '#2EA043', Personal: '#8B5CF6' };
const chipDefs = [
  { key: 'lowEnergy', label: 'Low Energy', icon: String.fromCodePoint(0x1F50B) },
  { key: '30min', label: '30 Min', icon: String.fromCodePoint(0x23F1) },
  { key: 'deepFocus', label: 'Deep Focus', icon: String.fromCodePoint(0x1F3AF) },
  { key: 'quickWins', label: 'Quick Wins', icon: String.fromCodePoint(0x26A1) },
];
// V8: Updated nav \u2014removed Review from main nav, renamed Today to Focus
const navItems = [
  { id: 'today', icon: LayoutDashboard, label: 'Focus' },
  { id: 'all', icon: ListTodo, label: 'All Tasks' },
  { id: 'archive', icon: Archive, label: 'Archive' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];
// V8: Updated AI suggestions (Lovable-inspired)
const aiSuggestions = [
  'Review my tasks',
  'Plan my next 2 hours',
  'Archive all completed tasks',
  'Add task: call supplier by Friday',
  "I have 30 min, what's most important?",
  "What's overdue?",
];

export default function TaskBuddyV12() {
  const router = useRouter();
  const user = { email: 'danielm@tanaorjewelry.com' };
  const authLoading = false;

  const [dark, setDark] = useState('dark');
  const [streak, setStreak] = useState(5);
  const [focusMode, setFocusMode] = useState(false);
  const [focusTimer, setFocusTimer] = useState(0);
  const [focusDuration, setFocusDuration] = useState(0);
  const [focusPickerOpen, setFocusPickerOpen] = useState(false);
  const focusIntervalRef = useRef(null);
  const [tasks, setTasks] = useState(tasks0);
  const [page, setPage] = useState('today');
  const [msgs, setMsgs] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [celebrating, setCelebrating] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [activeCtx, setActiveCtx] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [ctxSaved, setCtxSaved] = useState(false);
  const [celPhase, setCelPhase] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [quickAdd, setQuickAdd] = useState('');
  const [subInput, setSubInput] = useState('');
  const [mobile, setMobile] = useState(false);
  const [aiReview, setAiReview] = useState(null);
  const [reviewTab, setReviewTab] = useState('priority');
  const [reviewData, setReviewData] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [showAiNudge, setShowAiNudge] = useState(null);
  // V11: Chat context for follow-up commands
  const [chatContext, setChatContext] = useState({ lastCmd: null, lastAffected: [], lastPlan: null, lastTasksSnapshot: null });
  // V14: Gemini AI integration
  const [geminiApiKey] = useState('AIzaSyDRClPj-DFXY6eJwOyuwCK8YG91s0H0BgM');
  const [geminiConvo, setGeminiConvo] = useState([]);
  // V8: Add Task modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', cat: 'Business', time: 30, urgency: 5, impact: 5, confidence: 7, ease: 5, blocking: 5, delegatable: false, dueDate: '', deadlineType: 'soft' });
  // V8: All Tasks status filter
  const [statusFilter, setStatusFilter] = useState('todo');
  // V8.3: Brain Dump + UX improvements
  const [addMode, setAddMode] = useState('brainDump');
  const [dumpText, setDumpText] = useState('');
  const [parsedTasks, setParsedTasks] = useState([]);
  const [reviewingDump, setReviewingDump] = useState(false);
  const [dumpProcessing, setDumpProcessing] = useState(false);
  const [selectedParsed, setSelectedParsed] = useState(new Set());
  const [aiThinking, setAiThinking] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [undoTask, setUndoTask] = useState(null);
  const chatEndRef = useRef(null);
  const speechRef = useRef(null);
  const dumpSpeechRef = useRef(null);
  const completeTimerRef = useRef(null);
  const [userCtx, setUserCtx] = useState({
    lifeGoals: 'Build a portfolio of successful e-commerce brands. Achieve financial freedom by 35. Stay healthy and present for family.',
    currentFocus: 'Scaling Tanaor Jewelry, closing Series A funding round, maintaining work-life balance.',
    aboutMe: 'CEO running multiple businesses. 200+ tasks across companies and personal life. Need AI to prioritize what matters most.',
    boostCats: ['Business'],
  });

  // ─── RESPONSIVE ───────────────────────────────────────────
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // V8.3: Auto-scroll chat to bottom on new messages
  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  // V8.3: Undo toast auto-dismiss
  useEffect(() => { if (undoTask) { const t = setTimeout(() => setUndoTask(null), 5000); return () => clearTimeout(t); } }, [undoTask]);
  // V12: Focus timer countdown
  useEffect(() => {
    if (focusMode && focusTimer > 0) {
      focusIntervalRef.current = setInterval(() => {
        setFocusTimer(prev => {
          if (prev <= 1) {
            clearInterval(focusIntervalRef.current);
            setFocusMode(false); setFocusDuration(0);
            try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGQcBj+a2teleC8MLICi0dCrWBwJWZ/R5a9hIhBEjcXcrGQsDzuDq9XIrFsjDk2Zy+GwYx0MR5LA3apkKBBBhbTWyKldIRFIkr/apGcoEkKHstrIp10fD0yUw96qZigRPIC00c6tYSQSTZK+3KpmKQ==').play(); } catch(e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(focusIntervalRef.current);
    }
  }, [focusMode, focusTimer > 0]);
  const startFocus = (mins) => { setFocusDuration(mins * 60); setFocusTimer(mins * 60); setFocusMode(true); setFocusPickerOpen(false); };
  const stopFocus = () => { clearInterval(focusIntervalRef.current); setFocusMode(false); setFocusTimer(0); setFocusDuration(0); };
  const fmtTimer = (s) => { const m = Math.floor(s / 60); const sec = s % 60; return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0'); };

  // ─── THEME ────────────────────────────────────────────────
  const themes = {
    light: { bg: '#F6F8FA', card: '#FFFFFF', card2: '#F9FAFB', bdr: '#E1E4E8', txt: '#24292E', sub: '#57606A', acc: '#E8732A', ok: '#1A7F37', side: '#FFFFFF', doNow: 'rgba(232,115,42,0.06)', warn: '#D4643B', danger: '#CF222E', briefBg: 'rgba(232,115,42,0.04)' },
    dark: { bg: '#0f172a', card: '#1e293b', card2: '#0f172a', bdr: '#334155', txt: '#e2e8f0', sub: '#94a3b8', acc: '#f97316', ok: '#22c55e', side: '#0f172a', doNow: 'rgba(249,115,22,0.1)', warn: '#f97316', danger: '#ef4444', briefBg: 'rgba(249,115,22,0.08)' },
  };
  const c = themes[dark] || themes.light;

  // ─── SCORING ──────────────────────────────────────────────
  const today2 = new Date(); today2.setHours(0, 0, 0, 0);
  const daysUntilDue = (t) => { if (!t.dueDate) return null; return Math.round((new Date(t.dueDate + 'T00:00:00') - today2) / 86400000); };
  const score = (t) => {
    let s = Math.min(100, Math.round(((t.impact * 4 + t.urgency * 3 + (10 - t.effort) * 1.5) / 8.5) * 10 + t.age * 0.5));
    if (userCtx.boostCats.includes(t.cat)) s = Math.min(100, Math.round(s * 1.15));
    const d = daysUntilDue(t);
    if (d !== null && t.deadlineType === 'hard') { if (d < 0) s = 100; else if (d <= 1) s = Math.max(s, 98); else if (d <= 2) s = Math.max(s, 95); else if (d <= 5) s = Math.min(100, s + 30); }
    else if (d !== null && t.deadlineType === 'soft') { if (d < 0) s = Math.min(100, s + 5); else if (d <= 2) s = Math.min(100, s + 10); }
    return s;
  };
  const sortTasks = (arr) => [...arr].sort((a, b) => {
    const diff = score(b) - score(a);
    if (diff !== 0) return diff;
    const dA = daysUntilDue(a), dB = daysUntilDue(b);
    if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; }
    if (dA !== null) return -1;
    if (dB !== null) return 1;
    return a.id - b.id;
  });
  // V8: Smart tags (Lovable-inspired)
  const getSmartTags = (t) => {
    const tags = [];
    if (t.effort <= 3) tags.push({ label: 'Delegatable', color: '#8B5CF6' });
    const d = daysUntilDue(t);
    if (d !== null && d <= 3 && d >= 0) tags.push({ label: 'Time sensitive', color: '#CF222E' });
    if (d !== null && d < 0) tags.push({ label: 'Overdue', color: '#CF222E' });
    if (t.impact >= 8 && t.urgency >= 7) tags.push({ label: 'Pipeline blocker', color: '#D4643B' });
    if (t.effort <= 3 && t.time <= 20) tags.push({ label: 'Quick win', color: '#2EA043' });
    return tags.slice(0, 3);
  };
  const fmt = (m) => m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60 > 0 ? (m % 60) + 'm' : '') : m + 'm';
  const fmtDate = (ds) => { if (!ds) return ''; const d = new Date(ds + 'T00:00:00'); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getDate(); };

  // ─── FILTERED ─────────────────────────────────────────────
  const getActive = () => {
    let a = sortTasks(tasks.filter((t) => !t.done));
    if (activeCtx === 'lowEnergy') a = a.filter((t) => t.effort <= 5).sort((x, y) => x.effort - y.effort);
    else if (activeCtx === '30min') a = a.filter((t) => t.time <= 30);
    else if (activeCtx === 'deepFocus') a = a.filter((t) => t.impact >= 7);
    else if (activeCtx === 'quickWins') a = a.filter((t) => t.effort <= 3 && t.time <= 20);
    else if (activeCtx === 'catBusiness') { const m = a.filter(t => t.cat === 'Business'); const r = a.filter(t => t.cat !== 'Business'); a = [...m, ...r]; }
    else if (activeCtx === 'catHealth') { const m = a.filter(t => t.cat === 'Health'); const r = a.filter(t => t.cat !== 'Health'); a = [...m, ...r]; }
    else if (activeCtx === 'catPersonal') { const m = a.filter(t => t.cat === 'Personal'); const r = a.filter(t => t.cat !== 'Personal'); a = [...m, ...r]; }
    else if (activeCtx === 'catWork') { const m = a.filter(t => t.cat === 'Work'); const r = a.filter(t => t.cat !== 'Work'); a = [...m, ...r]; }
    return a;
  };
  const active = getActive();
  const done = tasks.filter((t) => t.done);
  const topTask = active[0] || null;
  const upNext = active.slice(1, 5);
  const later = active.slice(5);
  const cats = [...new Set(tasks.map((t) => t.cat))];

  // ─── SOUND & EFFECTS ──────────────────────────────────────
  const playCompletionSound = () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.setValueAtTime(800, ctx.currentTime); osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1); gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3); } catch(e) {} };

  // ─── ACTIONS ──────────────────────────────────────────────
  const complete = (id) => {
    playCompletionSound(); setCelebrating(id); setCelPhase('confetti');
    setTimeout(() => setCelPhase('slideout'), 600);
    completeTimerRef.current = setTimeout(() => {
      setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: true, status: 'done' } : t)));
      setCelebrating(null); setCelPhase(null); setUndoTask(id);
      completeTimerRef.current = null;
    }, 1400);
  };
  const undoComplete = (id) => {
    if (completeTimerRef.current) { clearTimeout(completeTimerRef.current); completeTimerRef.current = null; setCelebrating(null); setCelPhase(null); }
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: false, status: 'todo' } : t)));
    setUndoTask(null);
  };

  // ─── AI TASK INSIGHT ──────────────────────────────────────
  const getTaskInsight = (t) => {
    const s = score(t);
    const tips = [];
    let intro = '**' + t.title + '** \u2014 Priority score: ' + s + '/100\n\n';
    if (t.notes) intro += '\u{1F4DD} *' + t.notes + '*\n\n';
    if (t.dueDate) {
      const d = Math.ceil((new Date(t.dueDate) - new Date()) / 86400000);
      if (d < 0) tips.push('\u{1F534} This is **' + Math.abs(d) + ' days overdue**. Do it now or reschedule with a clear new date.');
      else if (d === 0) tips.push('\u{1F534} **Due today.** Block the next ' + (t.time < 60 ? t.time + ' minutes' : Math.round(t.time/60) + ' hours') + ' and knock this out.');
      else if (d === 1) tips.push('\u{1F7E1} Due **tomorrow**. Start today if it takes more than ' + Math.round(t.time/2) + 'm.');
      else tips.push('\u{1F4C5} Due in **' + d + ' days**. You have time, but don\'t let it slip.');
    }
    if (t.effort >= 7) tips.push('\u{1F4AA} High effort \u2014 schedule during your **peak energy** hours.');
    if (t.time >= 90) tips.push('\u{23F0} ' + Math.round(t.time/60) + 'h+ task. Break into **2-3 focused sessions**.');
    if (t.time <= 20 && t.effort <= 3) tips.push('\u{26A1} Quick win \u2014 just **do it now** in under 20 minutes.');
    if (t.age >= 7) tips.push('\u{23F3} Sitting for **' + t.age + ' days**. Commit to a start time or remove it.');
    const bd = [];
    if (t.subtasks && t.subtasks.length > 0) {
      const dn = t.subtasks.filter(x => x.done).length;
      bd.push('\n**Progress: ' + dn + '/' + t.subtasks.length + ' subtasks done**');
      const nx = t.subtasks.find(x => !x.done);
      if (nx) bd.push('\u{1F449} Next step: **' + nx.title + '**');
    } else {
      bd.push('\n**Suggested breakdown:**');
      if (t.time >= 60) { bd.push('1. Research / gather what you need (' + Math.round(t.time*0.2) + 'm)'); bd.push('2. Do the core work (' + Math.round(t.time*0.6) + 'm)'); bd.push('3. Review and finalize (' + Math.round(t.time*0.2) + 'm)'); }
      else { bd.push('1. Open/prep what you need (5m)'); bd.push('2. Execute (' + Math.max(t.time-10,5) + 'm)'); bd.push('3. Quick review (5m)'); }
    }
    return intro + (tips.length > 0 ? tips.join('\n') + '\n' : '') + bd.join('\n');
  };
  const sendTaskInsight = (t) => {
    setMsgs((p) => [...p, { role: 'user', text: 'Tell me about "' + t.title + '"' }]);
    setTimeout(() => { setMsgs((p) => [...p, { role: 'ai', text: getTaskInsight(t) }]); }, 600);
  };
  const deleteTask = (id) => { setTasks((p) => p.filter((t) => t.id !== id)); setExpanded(null); };
  const parseQuickAdd = (input) => {
    let title = input, dueDate = null, deadlineType = null, time = 30;
    if (/!hard/i.test(title)) { deadlineType = 'hard'; title = title.replace(/!hard/i, ''); }
    else if (/!soft/i.test(title)) { deadlineType = 'soft'; title = title.replace(/!soft/i, ''); }
    const tm = title.match(/(\d+)\s*m(?:in)?(?:s)?/i); if (tm) { time = parseInt(tm[1]); title = title.replace(tm[0], ''); }
    const hm = title.match(/(\d+)\s*h(?:r|our)?s?/i); if (hm) { time = parseInt(hm[1]) * 60; title = title.replace(hm[0], ''); }
    const tw = title.match(/\btomorrow\b/i);
    if (tw) { const d = new Date(); d.setDate(d.getDate() + 1); dueDate = d.toISOString().split('T')[0]; if (!deadlineType) deadlineType = 'soft'; title = title.replace(tw[0], ''); }
    title = title.replace(/\s+/g, ' ').trim();
    return { title, dueDate, deadlineType, time };
  };
  // V8: Add task from modal
  const addTaskFromModal = () => {
    if (!newTask.title.trim()) return;
    setTasks((prev) => [...prev, {
      id: Date.now(), title: newTask.title.trim(), cat: newTask.cat,
      impact: newTask.impact, urgency: newTask.urgency, effort: 10 - newTask.ease,
      time: newTask.time, age: 0, done: false, status: 'todo',
      notes: newTask.description, link: '', aiReason: 'New task \u2014AI will analyze on next review.',
      dueDate: newTask.dueDate || null, deadlineType: newTask.dueDate ? newTask.deadlineType : null,
      confidence: newTask.confidence, subtasks: [],
    }]);
    setShowAddModal(false);
    setNewTask({ title: '', description: '', cat: 'Business', time: 30, urgency: 5, impact: 5, confidence: 7, ease: 5, blocking: 5, delegatable: false, dueDate: '', deadlineType: 'soft' });
  };
  // V8: AI Auto-Score mock
  const aiAutoScore = () => {
    const title = newTask.title.toLowerCase();
    let impact = 5, urgency = 5, confidence = 7, ease = 5, blocking = 3;
    if (title.includes('investor') || title.includes('pitch') || title.includes('revenue')) { impact = 9; urgency = 7; blocking = 8; }
    if (title.includes('call') || title.includes('email') || title.includes('send')) { ease = 8; urgency = 7; }
    if (title.includes('deadline') || title.includes('urgent') || title.includes('asap')) { urgency = 9; }
    if (title.includes('workout') || title.includes('read') || title.includes('personal')) { impact = 5; ease = 7; confidence = 8; }
    setNewTask(p => ({ ...p, impact, urgency, confidence, ease, blocking }));
  };
  const addTask = (input) => {
    if (!input.trim()) return;
    const p = parseQuickAdd(input);
    setTasks((prev) => [...prev, { id: Date.now(), title: p.title, cat: 'Work', impact: 5, urgency: 5, effort: 5, time: p.time, age: 0, done: false, status: 'todo', notes: '', link: '', aiReason: 'New task \u2014AI will analyze on next review.', dueDate: p.dueDate, deadlineType: p.deadlineType, confidence: 7, subtasks: [] }]);
    setQuickAdd('');
  };
  const toggleSubtask = (taskId, subId) => { setTasks((p) => p.map((t) => t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => s.id === subId ? { ...s, done: !s.done } : s) } : t)); };
  const addSubtask = (taskId) => { if (!subInput.trim()) return; setTasks((p) => p.map((t) => t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: Date.now(), title: subInput.trim(), done: false }] } : t)); setSubInput(''); };

  // ─── V8.3: BRAIN DUMP PARSER ─────────────────────────────
  const parseBrainDump = (text) => {
    if (!text.trim()) return [];
    // V9: Much smarter splitting for ADHD brain dumps
    // First try sentence endings
    let sentences = text.split(/(?<=[.!?;])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 5);
    // If only 1 result, try splitting on natural phrase boundaries (commas + transition words)
    if (sentences.length <= 1) {
      sentences = text.split(/,\s*(?=also |oh and |and i |i also |i need |need to |i have to |i should |i want to |i keep |i gotta |plus |then |should |the \w+ (?:team|said|needs|website|warehouse))/i)
        .map(s => s.trim()).filter(s => s.length > 8);
    }
    // If still 1, try splitting on just commas for long text
    if (sentences.length <= 1 && text.length > 80) {
      sentences = text.split(/,\s+/).map(s => s.trim()).filter(s => s.length > 10);
    }
    const parsed = sentences.map((sentence, i) => {
      const lower = sentence.toLowerCase();
      let title = sentence.replace(/^(ok so |so |ok |i need to |i have to |i should |i want to |i must |need to |have to |should |gotta |gonna |also |and |then |plus |oh and |oh |and i should probably )/i, '');
      title = title.charAt(0).toUpperCase() + title.slice(1);
      if (title.length > 80) title = title.slice(0, 77) + '...';
      title = title.replace(/[.!;]+$/, '').trim();
      let urgency = 5;
      if (/urgent|asap|today|right now|immediately|critical|deadline|overdue|super important|that's super/i.test(lower)) urgency = 9;
      else if (/soon|this week|important|priority|before friday|before monday|in \d+ (?:day|week)/i.test(lower)) urgency = 7;
      else if (/sometime|eventually|when i can|no rush|low priority|probably|keep forgetting/i.test(lower)) urgency = 3;
      let time = 30, effort = 5;
      if (/quick|fast|5 min|10 min|simple|easy|just|small|renew/i.test(lower)) { time = 15; effort = 2; }
      else if (/research|build|create|develop|design|write.*report|prepare|prep|presentation|landing page/i.test(lower)) { time = 90; effort = 7; }
      else if (/call|email|send|text|message|reply|respond|schedule/i.test(lower)) { time = 15; effort = 2; }
      else if (/review|check|look at|read|go through|portfolio/i.test(lower)) { time = 30; effort = 4; }
      const minMatch = lower.match(/(\d+)\s*min/); if (minMatch) time = parseInt(minMatch[1]);
      const hrMatch = lower.match(/(\d+)\s*h(?:our|r)/); if (hrMatch) time = parseInt(hrMatch[1]) * 60;
      let cat = 'Work';
      if (/investor|revenue|sales|marketing|ad|campaign|supplier|inventory|brand|shop|store|product|customer|order|shipment|warehouse|landing page|spring collection|series a|raising|funding|website|new hire|design role|portfolio/i.test(lower)) cat = 'Business';
      else if (/workout|gym|health|exercise|sleep|diet|eat|run|walk|meditate|doctor|dentist|healthy|membership/i.test(lower)) cat = 'Health';
      else if (/family|friend|personal|hobby|read|book|trip|vacation|birthday|gift|netflix|mom|dad|brother|sister|call.*back/i.test(lower)) cat = 'Personal';
      let impact = 5;
      if (/investor|revenue|pitch|funding|critical|key|major|huge|game.?changer|series a|raising/i.test(lower)) impact = 9;
      else if (/important|significant|strategic|growth|landing page|spring collection|inventory/i.test(lower)) impact = 7;
      else if (/small|minor|trivial|nice.?to.?have/i.test(lower)) impact = 3;
      const s = Math.min(100, Math.round(((impact * 4 + urgency * 3 + (10 - effort) * 1.5) / 8.5) * 10));
      return { id: Date.now() + i, title, cat, impact, urgency, effort, time, age: 0, done: false, status: 'todo', notes: sentence !== title ? sentence : '', link: '', aiReason: 'Added via Brain Dump — AI will refine on next review.', dueDate: null, deadlineType: null, confidence: 7, subtasks: [], _score: s };
    });
    return parsed.sort((a, b) => b._score - a._score);
  };
  const addParsedTasks = () => {
    const toAdd = parsedTasks.filter((_, i) => selectedParsed.has(i));
    setTasks((prev) => [...prev, ...toAdd.map(t => { const { _score, ...task } = t; return task; })]);
    setParsedTasks([]); setSelectedParsed(new Set()); setReviewingDump(false); setDumpText(''); setShowAddModal(false); setAddMode('brainDump');
  };

  // ─── V8.3: WEB SPEECH API ──────────────────────────────
  const startSpeech = (target) => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) { alert('Speech recognition not supported in this browser. Try Chrome.'); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let final = '', interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + ' ';
        else interim += event.results[i][0].transcript;
      }
      if (target === 'chat') setAiInput(final + interim);
      else setDumpText((prev) => { const base = prev.replace(/\[listening\.\.\.\]$/,'').trim(); return (base ? base + ' ' : '') + final + (interim ? interim : ''); });
    };
    recognition.onerror = () => { setRecording(false); };
    recognition.onend = () => {
      if (target === 'chat') { setRecording(false); }
    };
    recognition.start();
    if (target === 'chat') speechRef.current = recognition;
    else dumpSpeechRef.current = recognition;
    setRecording(true);
  };
  const stopSpeech = (target) => {
    if (target === 'chat' && speechRef.current) { speechRef.current.stop(); speechRef.current = null; }
    else if (dumpSpeechRef.current) { dumpSpeechRef.current.stop(); dumpSpeechRef.current = null; }
    setRecording(false);
  };

  // ─── V8.3: EDIT TASK ──────────────────────────────────────
  const startEditTask = (t) => {
    setEditingTask(t.id);
    setNewTask({ title: t.title, description: t.notes || '', cat: t.cat, time: t.time, urgency: t.urgency, impact: t.impact, confidence: t.confidence || 7, ease: 10 - t.effort, blocking: Math.min(10, Math.round(t.impact * 0.6 + t.urgency * 0.4)), delegatable: t.effort <= 3, dueDate: t.dueDate || '', deadlineType: t.deadlineType || 'soft' });
    setAddMode('manual');
    setShowAddModal(true);
  };
  const saveEditTask = () => {
    if (!newTask.title.trim() || !editingTask) return;
    setTasks((prev) => prev.map((t) => t.id === editingTask ? { ...t, title: newTask.title.trim(), notes: newTask.description, cat: newTask.cat, time: newTask.time, urgency: newTask.urgency, impact: newTask.impact, effort: 10 - newTask.ease, confidence: newTask.confidence, dueDate: newTask.dueDate || null, deadlineType: newTask.dueDate ? newTask.deadlineType : null } : t));
    setShowAddModal(false); setEditingTask(null);
    setNewTask({ title: '', description: '', cat: 'Business', time: 30, urgency: 5, impact: 5, confidence: 7, ease: 5, blocking: 5, delegatable: false, dueDate: '', deadlineType: 'soft' });
  };

  // ─── AI REVIEW ENGINE ─────────────────────────────────────
  const runAiReview = () => {
    setAiReview('loading'); setReviewTab('priority'); setLoadingMsg('Reading your goals...');
    setTimeout(() => setLoadingMsg('Analyzing ' + active.length + ' tasks...'), 500);
    setTimeout(() => setLoadingMsg('Mapping dependencies...'), 1000);
    setTimeout(() => setLoadingMsg('Building your optimal day...'), 1500);
    setTimeout(() => {
      const sorted = [...active].sort((a, b) => {
        const sa = score(a), sb = score(b);
        const da = daysUntilDue(a), db = daysUntilDue(b);
        if (a.deadlineType === 'hard' && da !== null && da <= 2) return -1;
        if (b.deadlineType === 'hard' && db !== null && db <= 2) return 1;
        return sb - sa;
      });
      const understanding = {};
      sorted.forEach((t) => {
        let u = t.aiReason || '';
        if (t.deadlineType === 'hard' && daysUntilDue(t) !== null && daysUntilDue(t) <= 2) u = 'CRITICAL: Hard deadline approaching. ' + u;
        if (t.subtasks.length > 0) { const dn2 = t.subtasks.filter((s) => s.done).length; u += ' Progress: ' + dn2 + '/' + t.subtasks.length + ' subtasks done.'; }
        if (t.age >= 7) u += ' This task has been sitting for ' + t.age + ' days \u2014consider breaking it down or delegating.';
        understanding[t.id] = u;
      });
      const aiScores = {};
      sorted.forEach((t) => {
        let adj = score(t);
        if (t.subtasks.length > 0 && t.subtasks.some((s) => !s.done)) adj = Math.min(100, adj + 5);
        if (t.age >= 10) adj = Math.min(100, adj + 8);
        if (t.cat === 'Health' && !done.some((d2) => d2.cat === 'Health')) adj = Math.min(100, adj + 10);
        aiScores[t.id] = adj;
      });
      const catDist = cats.reduce((a, cat) => { a[cat] = active.filter((t) => t.cat === cat).length; return a; }, {});
      const totalMin = active.reduce((s, t) => s + t.time, 0);
      const hardTasks = active.filter((t) => t.deadlineType === 'hard' && daysUntilDue(t) !== null && daysUntilDue(t) <= 7);
      const hardMin = hardTasks.reduce((s, t) => s + t.time, 0);
      const neglectedCat = cats.find((cat) => !done.some((t) => t.cat === cat) && active.some((t) => t.cat === cat));
      const bigTasks = active.filter((t) => t.effort >= 7 && t.subtasks.length === 0);
      const insights = [
        { emoji: String.fromCodePoint(0x23F1), title: 'Time Analysis', body: 'Your active tasks total ' + fmt(totalMin) + '. Hard deadlines this week: ' + fmt(hardMin) + ' (' + hardTasks.length + ' tasks). ' + (hardMin <= 120 ? 'Easily handled \u2014 focus your energy on high-impact deep work.' : 'Significant deadline load \u2014 prioritize these first.') },
        ...(neglectedCat ? [{ emoji: String.fromCodePoint(0x1F504), title: 'Category Blind Spot', body: 'You haven\'t completed any ' + neglectedCat + ' tasks recently. ' + (neglectedCat === 'Health' ? 'Your health fuels everything else. Consider scheduling "Morning workout" as a non-negotiable.' : 'Consider batching a ' + neglectedCat + ' task today for balance.') }] : []),
        ...(bigTasks.length > 0 ? [{ emoji: String.fromCodePoint(0x1F9E9), title: 'Break It Down', body: '"' + bigTasks[0].title + '" is high effort with no subtasks. Breaking it into 3-4 smaller steps makes it less daunting and easier to start.' }] : []),
        { emoji: String.fromCodePoint(0x1F4CA), title: 'Category Balance', body: Object.entries(catDist).map(([k, v]) => k + ': ' + v).join(' \u00B7 ') + '. ' + (catDist['Business'] > active.length * 0.6 ? 'Heavy on Business tasks \u2014 schedule a Personal task for mental reset.' : 'Good category distribution.') },
        { emoji: String.fromCodePoint(0x1F3AF), title: 'Focus Recommendation', body: sorted[0] ? 'Your #1 priority is "' + sorted[0].title + '". ' + (sorted[0].time >= 60 ? 'Block 2 uninterrupted hours for this. Close Slack, silence notifications.' : 'This is quick \u2014 knock it out first to build momentum.') : 'No active tasks!' },
      ];
      let runningTime = 9 * 60;
      const plan = sorted.slice(0, 8).map((t) => {
        const h = Math.floor(runningTime / 60); const m = runningTime % 60;
        const timeStr = (h > 12 ? h - 12 : h) + ':' + String(m).padStart(2, '0') + (h >= 12 ? ' PM' : ' AM');
        const entry = { time: timeStr, task: t, duration: t.time, reason: t.deadlineType === 'hard' ? 'Hard deadline' : t.impact >= 8 ? 'High impact' : t.effort <= 3 ? 'Quick win' : 'Scheduled' };
        runningTime += t.time + 10;
        return entry;
      });
      setReviewData({ sorted, understanding, aiScores, insights, plan });
      setAiReview('ready');
    }, 2000);
  };

  const applyAiOrder = () => {
    if (!reviewData) return;
    const orderMap = {};
    reviewData.sorted.forEach((t, i) => { orderMap[t.id] = i; });
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (reviewData.aiScores[t.id] !== undefined) { return { ...t, impact: Math.min(10, Math.round(reviewData.aiScores[t.id] / 10)), aiReason: reviewData.understanding[t.id] || t.aiReason }; }
        return t;
      });
      const doneT = updated.filter((t) => t.done);
      const activeT = updated.filter((t) => !t.done).sort((a, b) => (orderMap[a.id] ?? 999) - (orderMap[b.id] ?? 999));
      return [...activeT, ...doneT];
    });
    setAiReview(null);
    setPage('today');
  };

  // ─── V11: AI COMMAND CENTER ──────────────────────────────
  // Fuzzy match: find tasks by loose title reference
  const fuzzyMatch = (query, taskList) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const exact = taskList.filter(t => t.title.toLowerCase().includes(q));
    if (exact.length > 0) return exact;
    const words = q.split(/\s+/).filter(w => w.length > 2);
    return taskList.filter(t => {
      const title = t.title.toLowerCase();
      return words.filter(w => title.includes(w)).length >= Math.max(1, Math.floor(words.length * 0.5));
    });
  };

  // Reorder tasks by intent (used by reprioritize command and chips)
  const reorderByIntent = (intent) => {
    const intentKey = typeof intent === 'object' ? 'time' : intent;
    setTasks((prev) => {
      const doneT = prev.filter((t) => t.done);
      const activeT = prev.filter((t) => !t.done);
      let sorted;
      if (intentKey === 'lowEnergy') {
        const match = activeT.filter((t) => t.effort <= 5).sort((a, b) => a.effort - b.effort);
        const rest = activeT.filter((t) => t.effort > 5).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        sorted = [...match, ...rest];
      } else if (intentKey === 'quickWins') {
        const match = activeT.filter((t) => t.effort <= 3 && t.time <= 20).sort((a, b) => a.time - b.time);
        const rest = activeT.filter((t) => !(t.effort <= 3 && t.time <= 20)).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        sorted = [...match, ...rest];
      } else if (intentKey === 'deepFocus') {
        const match = activeT.filter((t) => t.impact >= 7).sort((a, b) => b.impact - a.impact);
        const rest = activeT.filter((t) => t.impact < 7).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        sorted = [...match, ...rest];
      } else if (intentKey === '30min') {
        const match = activeT.filter((t) => t.time <= 30).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        const rest = activeT.filter((t) => t.time > 30).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        sorted = [...match, ...rest];
      } else if (/^cat/.test(intentKey)) {
        const catName = intentKey.replace('cat', '');
        const match = activeT.filter((t) => t.cat === catName).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        const rest = activeT.filter((t) => t.cat !== catName).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        sorted = [...match, ...rest];
      } else if (intentKey === 'time') {
        const mins = intent.minutes;
        const match = activeT.filter((t) => t.time <= mins).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        const rest = activeT.filter((t) => t.time > mins).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        sorted = [...match, ...rest];
      } else {
        sorted = activeT.sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
      }
      return [...sorted, ...doneT];
    });
  };
  const resetTaskOrder = () => {
    setActiveCtx(null);
    setTasks((prev) => {
      const doneT = prev.filter((t) => t.done);
      const activeT = sortTasks(prev.filter((t) => !t.done));
      return [...activeT, ...doneT];
    });
  };

  // V14: Gemini AI - Build system prompt with task context
  const buildGeminiPrompt = () => {
    const active = tasks.filter(t => !t.done);
    const overdue = active.filter(t => { const d = daysUntilDue(t); return d !== null && d < 0; });
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    return `You are TaskBuddy AI — a sharp, supportive productivity assistant for ADHD entrepreneurs. You're embedded in a task management app.

TODAY: ${today} (${timeOfDay})
USER: ${userCtx.aboutMe}
GOALS: ${userCtx.lifeGoals}
CURRENT FOCUS: ${userCtx.currentFocus}
PRIORITY CATEGORIES: ${userCtx.boostCats.join(', ')}

TASK SUMMARY: ${active.length} active tasks, ${tasks.filter(t => t.done).length} completed, ${overdue.length} overdue

ALL ACTIVE TASKS (sorted by priority score):
${active.sort((a, b) => score(b) - score(a)).map((t, i) => `${i + 1}. "${t.title}" [${t.cat}] Score: ${score(t)}/100, Time: ${t.time}min, Impact: ${t.impact}/10, Urgency: ${t.urgency}/10${t.dueDate ? ', Due: ' + t.dueDate : ''}${t.notes ? ', Notes: ' + t.notes.substring(0, 80) : ''}${t.subtasks?.length ? ', Subtasks: ' + t.subtasks.filter(s => s.done).length + '/' + t.subtasks.length + ' done' : ''}`).join('\n')}

INSTRUCTIONS:
- Be conversational, warm, and concise (2-4 short paragraphs max)
- Reference specific tasks by name when giving advice
- Understand the user's emotional state and energy level
- Give actionable, specific recommendations — not generic productivity tips
- If the user seems overwhelmed, help them focus on just ONE next step
- You can suggest app commands like: "mark [task] as done", "plan my next 30 min", "add task: [name]", "review"
- Format with **bold** for emphasis, use line breaks for readability
- Don't repeat task lists the user can already see — add insight and strategy instead
- If the user asks you to do something to tasks (complete, create, modify), tell them the exact command to type`;
  };

  // V14: Call Gemini API
  const callGemini = async (userMessage) => {
    const systemPrompt = buildGeminiPrompt();
    const newConvo = [...geminiConvo, { role: 'user', parts: [{ text: userMessage }] }];

    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-05-06:generateContent?key=' + geminiApiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: newConvo,
          generationConfig: { maxOutputTokens: 800, temperature: 0.8 }
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'API error ' + res.status);
      }

      const data = await res.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response.';
      setGeminiConvo([...newConvo, { role: 'model', parts: [{ text: aiText }] }]);
      return { type: 'text', text: aiText };
    } catch (err) {
      return { type: 'text', text: '⚠️ Gemini error: ' + err.message + '\n\nTry a built-in command like **"help"**, **"plan my next 30 min"**, or **"review"**.' };
    }
  };

  // V11: Command Parser
  const parseCommand = (text) => {
    const t = text.toLowerCase().trim();
    const activeTasks = tasks.filter(tk => !tk.done);
    const doneTasks = tasks.filter(tk => tk.done);

    // HELP
    if (/^(help|what can you do|commands|how do i use|how does this work|what do you do)\??$/i.test(t) || /\b(help me|show.+commands|what are.+commands)\b/i.test(t)) {
      return { type: 'help' };
    }

    // BRAIN DUMP (must be before CREATE to catch "brain dump: I need to..." before "i need to" triggers create)
    if (/^brain\s*dump\s*[:;-]\s*/i.test(t)) {
      const dumpText = text.replace(/^brain\s*dump\s*[:;-]\s*/i, '').trim();
      if (dumpText.length > 5) return { type: 'braindump', text: dumpText };
    }

    // COMPLETE ALL — check before specific complete to avoid "all" going to fuzzyMatch
    if (/\b(mark|done with|finished|completed?|i did|just did|i.ve done)\b/i.test(t) && /\b(all|every|everything)\b/i.test(t) && /\b(task|them|it|my)\b/i.test(t)) {
      return { type: 'completeAll', matched: activeTasks };
    }

    // ARCHIVE
    if (/\b(archive|clear|clean up|remove)\b/i.test(t)) {
      if (/\b(all|everything|every task)\b/i.test(t) && !/\b(done|completed|finished)\b/i.test(t)) {
        return { type: 'archive', scope: 'all', matched: activeTasks };
      }
      if (/\b(done|completed|finished)\b/i.test(t)) {
        return { type: 'archive', scope: 'done', matched: doneTasks.length > 0 ? doneTasks : activeTasks.filter(tk => tk.status === 'done') };
      }
      const afterArchive = t.replace(/^.*?\b(?:archive|clear|remove)\s+(?:the\s+)?/i, '');
      const matched = fuzzyMatch(afterArchive, activeTasks);
      if (matched.length > 0) return { type: 'archive', scope: 'specific', matched };
      return { type: 'archive', scope: 'all', matched: activeTasks };
    }

    // COMPLETE (single or multiple tasks)
    if (/\b(mark|done with|finished|completed?|i did|just did|i.ve done)\b/i.test(t)) {
      const taskRef = t.replace(/^.*?\b(?:mark|done with|finished|completed?|i did|just did|i've done|i.ve done)\s+(?:the\s+)?/i, '').replace(/\s+(?:as\s+)?(?:done|complete|finished)\s*$/i, '');
      // Check for multiple tasks separated by "and" or commas
      const parts = taskRef.split(/\s*(?:,\s*(?:and\s+)?|\s+and\s+)\s*/i).map(p => p.trim()).filter(p => p.length > 2);
      if (parts.length > 1) {
        const allMatched = [];
        for (const part of parts) {
          const m = fuzzyMatch(part, activeTasks);
          if (m.length > 0) allMatched.push(m[0]);
        }
        if (allMatched.length > 0) return { type: 'complete', matched: allMatched };
      }
      const matched = fuzzyMatch(taskRef, activeTasks);
      if (matched.length > 0) return { type: 'complete', matched };
    }

    // RENAME / EDIT TASK NAME
    if (/\b(rename|change\s+(?:the\s+)?name|retitle)\b/i.test(t)) {
      const renameMatch = t.match(/(?:rename|change\s+(?:the\s+)?name\s+(?:of\s+)?|retitle)\s*(.+?)\s+(?:to|→|->)\s+(.+)/i);
      if (renameMatch) {
        const oldName = renameMatch[1].trim();
        const newName = renameMatch[2].trim();
        const matched = fuzzyMatch(oldName, activeTasks);
        if (matched.length > 0) return { type: 'rename', task: matched[0], newName: newName.charAt(0).toUpperCase() + newName.slice(1) };
      }
    }

    // MODIFY (change due date, priority, urgency, etc.)
    if (/\b(change|update|set|move|reschedule)\b/i.test(t) && /\b(deadline|urgency|priority|impact|effort|due|date)\b/i.test(t)) {
      // Try to extract task name and the property being changed
      const dueDateMatch = t.match(/(?:due\s*(?:date)?|deadline)\s*(?:of|for)\s+(.+?)\s+(?:to|→)\s+(.+)/i) || t.match(/(?:change|move|reschedule|set)\s+(?:the\s+)?(?:due\s*(?:date)?|deadline)\s+(?:of|for)\s+(.+?)\s+(?:to|→)\s+(.+)/i) || t.match(/(.+?)\s+(?:due\s*(?:date)?|deadline)\s+(?:to|→)\s+(.+)/i);
      if (dueDateMatch) {
        const taskName = dueDateMatch[1].replace(/^(?:the\s+)/i, '').trim();
        const dateStr = dueDateMatch[2].trim();
        const matched = fuzzyMatch(taskName, activeTasks);
        if (matched.length > 0) return { type: 'modify', subtype: 'dueDate', task: matched[0], value: dateStr };
      }
      // Generic modify for other properties
      return { type: 'modify', text: t };
    }

    // CREATE (including "i need to" but NOT if it's a brain dump)
    if (/\b(add|new task|create|i need to)\b/i.test(t)) {
      let taskText = t.replace(/^.*?\b(?:add\s+(?:a\s+)?task|new task|create\s+(?:a\s+)?task|i need to)\s*:?\s*/i, '');
      if (!taskText || taskText === t) taskText = t.replace(/^.*?\b(?:add|create)\s+/i, '');
      return { type: 'create', text: taskText };
    }

    // REVIEW
    if (/\b(review|analyze|analysis|how am i doing|assess|evaluate)\b/i.test(t) && /\b(task|prior|work|doing|progress)\b/i.test(t)) {
      return { type: 'review' };
    }
    if (/^review\s*$/i.test(t) || /^review my tasks$/i.test(t)) {
      return { type: 'review' };
    }

    // PLAN
    if (/\b(plan|schedule|what should i do|what.s next|next\s+\d+\s*(hour|min))\b/i.test(t)) {
      const timeMatch2 = t.match(/(\d+)\s*(?:hour|hr)/i);
      const minMatch = t.match(/(\d+)\s*(?:min)/i);
      let minutes = 120;
      if (timeMatch2) minutes = parseInt(timeMatch2[1]) * 60;
      else if (minMatch) minutes = parseInt(minMatch[1]);
      return { type: 'plan', minutes };
    }

    // STATUS
    if (/\b(overdue|what.?s urgent|show me|how many|status|quick wins)\b/i.test(t)) {
      if (/overdue/i.test(t)) return { type: 'status', filter: 'overdue' };
      if (/quick win/i.test(t)) return { type: 'status', filter: 'quickWins' };
      if (/how many/i.test(t)) return { type: 'status', filter: 'count' };
      if (/urgent/i.test(t)) return { type: 'status', filter: 'urgent' };
      return { type: 'status', filter: 'summary' };
    }

    // UNDO
    if (/\b(undo|undo that|revert)\b/i.test(t)) {
      return { type: 'undo' };
    }

    // APPLY follow-up
    if (/\b(apply|apply that|do it|yes.+apply|sounds good)\b/i.test(t) && chatContext.lastPlan) {
      return { type: 'apply' };
    }

    // REPRIORITIZE
    if (/low energy|tired|exhausted|burned out|no energy|drained|overwhelmed|stressed|anxious|can.t focus|scattered|foggy/i.test(t)) return { type: 'reprioritize', intent: 'lowEnergy' };
    if (/quick win|quick task|small task|easy task|fast task|knock out/i.test(t)) return { type: 'reprioritize', intent: 'quickWins' };
    if (/deep focus|deep work|concentrate|uninterrupted|flow state/i.test(t)) return { type: 'reprioritize', intent: 'deepFocus' };
    if (/30 min|half hour|between meeting|short window|15 min/i.test(t)) return { type: 'reprioritize', intent: '30min' };
    const catMatch = t.match(/(?:focus(?:ed)? on|shifted? to|prioritize|reprioritize.*?(?:for|to|on))\s+(\w+)/i);
    if (catMatch) {
      const focus = catMatch[1].toLowerCase();
      if (/market|brand|ad|campaign|sale|revenue|ecom|business|supplier|inventory/i.test(focus)) return { type: 'reprioritize', intent: 'catBusiness' };
      if (/health|gym|workout|fitness|exercise/i.test(focus)) return { type: 'reprioritize', intent: 'catHealth' };
      if (/personal|family|friend|self/i.test(focus)) return { type: 'reprioritize', intent: 'catPersonal' };
      if (/work|project|code|dev|design/i.test(focus)) return { type: 'reprioritize', intent: 'catWork' };
    }
    if (/impactful|most important|highest priority|what matters|biggest impact|what should i tackle/i.test(t)) return { type: 'reprioritize', intent: 'impact' };
    const timeMatch = t.match(/(\d+)\s*(?:min(?:utes?)?|hours?)/i);
    if (timeMatch) {
      const mins = /hour/i.test(t) ? parseInt(timeMatch[1]) * 60 : parseInt(timeMatch[1]);
      return { type: 'reprioritize', intent: { type: 'time', minutes: mins } };
    }

    // BULK
    if (/\band\s+(then\s+)?(add|archive|create|mark|remove)/i.test(t)) {
      const parts = t.split(/\band\s+(?:then\s+)?(?=add|archive|create|mark|remove)/i);
      return { type: 'bulk', parts: parts.map(p => p.trim()) };
    }

    return null;
  };

  // V11: Command Executor
  const executeCommand = (cmd) => {
    const activeTasks = tasks.filter(t => !t.done);
    const snapshot = [...tasks];

    switch (cmd.type) {
      case 'help': {
        return { type: 'text', text: '**Here\'s what I can do:**\n\n' +
          '**Complete tasks:** "mark [task] as done", "I finished [task]", "done with [task and task]"\n' +
          '**Complete all:** "mark all tasks as done", "I\'ve done everything"\n' +
          '**Add tasks:** "add task: [name] by [date], [time]"\n' +
          '**Brain dump:** "brain dump: [list everything on your mind]"\n' +
          '**Plan time:** "plan my next 30 minutes", "I have 2 hours"\n' +
          '**Review:** "review my tasks", "how am I doing"\n' +
          '**Status:** "what\'s overdue?", "how many tasks?", "show quick wins"\n' +
          '**Energy/mood:** "I\'m tired", "low energy", "overwhelmed", "deep focus"\n' +
          '**Archive:** "archive [task]", "clear done tasks"\n' +
          '**Rename:** "rename [task] to [new name]"\n' +
          '**Undo:** "undo" (reverts last action)\n\n' +
          'Or just tell me how you\'re feeling and I\'ll reorder your tasks!' };
      }
      case 'braindump': {
        const parsed = parseBrainDump(cmd.text);
        if (parsed.length === 0) return { type: 'text', text: 'I couldn\'t parse any tasks from that. Try separating them with commas or periods.' };
        const newTasks = parsed.map(t => ({ ...t, _score: undefined }));
        setTasks(prev => [...newTasks, ...prev]);
        setChatContext(prev => ({ ...prev, lastCmd: 'braindump', lastAffected: newTasks.map(t => t.id), lastTasksSnapshot: snapshot }));
        const taskWord = newTasks.length === 1 ? 'task' : 'tasks';
        return { type: 'tasks', text: 'Brain dump processed! Created **' + newTasks.length + ' ' + taskWord + '**:', newTasks, canUndo: true };
      }
      case 'completeAll': {
        const ids = cmd.matched.map(t => t.id);
        const count = ids.length;
        ids.forEach(id => complete(id));
        setChatContext(prev => ({ ...prev, lastCmd: 'completeAll', lastAffected: ids, lastTasksSnapshot: snapshot }));
        return { type: 'action', text: 'Marked all **' + count + ' task' + (count !== 1 ? 's' : '') + '** as done! Amazing work!', action: 'complete', count, canUndo: true };
      }
      case 'archive': {
        const ids = cmd.matched.map(t => t.id);
        const count = ids.length;
        setTasks(prev => prev.map(t => ids.includes(t.id) ? { ...t, done: true, status: 'done' } : t));
        setChatContext(prev => ({ ...prev, lastCmd: 'archive', lastAffected: ids, lastTasksSnapshot: snapshot }));
        const remaining = activeTasks.length - count;
        return { type: 'action', text: 'Archived **' + count + ' task' + (count !== 1 ? 's' : '') + '**. ' + remaining + ' active task' + (remaining !== 1 ? 's' : '') + ' remaining.', action: 'archive', count, canUndo: true };
      }
      case 'complete': {
        // Support completing multiple tasks at once
        if (cmd.matched.length > 1) {
          const ids = cmd.matched.map(t => t.id);
          cmd.matched.forEach(t => complete(t.id));
          setChatContext(prev => ({ ...prev, lastCmd: 'complete', lastAffected: ids, lastTasksSnapshot: snapshot }));
          const names = cmd.matched.map(t => '**' + t.title + '**');
          return { type: 'action', text: 'Marked ' + names.join(' and ') + ' as done! Great work!', action: 'complete', count: cmd.matched.length, canUndo: true };
        }
        const task = cmd.matched[0];
        complete(task.id);
        setChatContext(prev => ({ ...prev, lastCmd: 'complete', lastAffected: [task.id], lastTasksSnapshot: snapshot }));
        return { type: 'action', text: 'Marked **' + task.title + '** as done! Great work!', action: 'complete', count: 1, canUndo: true };
      }
      case 'rename': {
        const task = cmd.task;
        const oldTitle = task.title;
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, title: cmd.newName } : t));
        setChatContext(prev => ({ ...prev, lastCmd: 'rename', lastAffected: [task.id], lastTasksSnapshot: snapshot }));
        return { type: 'action', text: 'Renamed **' + oldTitle + '** to **' + cmd.newName + '**.', action: 'rename', count: 1, canUndo: true };
      }
      case 'modify': {
        if (cmd.subtype === 'dueDate' && cmd.task) {
          let dueDate = null;
          const val = cmd.value.toLowerCase();
          if (/tomorrow/i.test(val)) {
            const d = new Date(); d.setDate(d.getDate() + 1); dueDate = d.toISOString().split('T')[0];
          } else if (/next\s*friday|friday/i.test(val)) {
            const d = new Date(); const day = d.getDay(); const diff = (5 - day + 7) % 7 || 7; d.setDate(d.getDate() + diff); dueDate = d.toISOString().split('T')[0];
          } else if (/next\s*monday|monday/i.test(val)) {
            const d = new Date(); const day = d.getDay(); const diff = (1 - day + 7) % 7 || 7; d.setDate(d.getDate() + diff); dueDate = d.toISOString().split('T')[0];
          } else if (/next\s*week/i.test(val)) {
            const d = new Date(); d.setDate(d.getDate() + 7); dueDate = d.toISOString().split('T')[0];
          } else if (/\d{4}-\d{2}-\d{2}/.test(val)) {
            dueDate = val.match(/\d{4}-\d{2}-\d{2}/)[0];
          }
          if (dueDate) {
            setTasks(prev => prev.map(t => t.id === cmd.task.id ? { ...t, dueDate } : t));
            setChatContext(prev => ({ ...prev, lastCmd: 'modify', lastAffected: [cmd.task.id], lastTasksSnapshot: snapshot }));
            return { type: 'action', text: 'Updated **' + cmd.task.title + '** due date to **' + dueDate + '**.', action: 'modify', count: 1, canUndo: true };
          }
          return { type: 'text', text: 'I couldn\'t parse that date. Try: "tomorrow", "next friday", "next monday", or a date like "2026-03-01".' };
        }
        return { type: 'text', text: 'To modify a task, try:\n- "change due date of [task] to [date]"\n- Or click on a task card and use **Edit task**.' };
      }
      case 'create': {
        const text = cmd.text;
        let cat = 'Business';
        if (/health|gym|workout|exercise/i.test(text)) cat = 'Health';
        else if (/personal|family|friend/i.test(text)) cat = 'Personal';
        else if (/work|code|dev|design/i.test(text)) cat = 'Work';
        let urgency = 5, impact = 5, effort = 5, time = 30;
        if (/high urgency|urgent|asap|critical/i.test(text)) urgency = 9;
        if (/low urgency|whenever|no rush/i.test(text)) urgency = 3;
        if (/high impact|important|crucial/i.test(text)) impact = 9;
        if (/easy|simple|quick/i.test(text)) { effort = 3; time = 15; }
        if (/hard|complex|difficult/i.test(text)) { effort = 8; time = 120; }
        const durMatch = text.match(/(\d+)\s*(?:min|hour|hr|h)/i);
        if (durMatch) time = /hour|hr|h/i.test(durMatch[0]) ? parseInt(durMatch[1]) * 60 : parseInt(durMatch[1]);
        let dueDate = null, deadlineType = 'soft';
        if (/tomorrow/i.test(text)) {
          const d = new Date(); d.setDate(d.getDate() + 1);
          dueDate = d.toISOString().split('T')[0];
        } else if (/friday/i.test(text)) {
          const d = new Date(); const day = d.getDay(); const diff = (5 - day + 7) % 7 || 7;
          d.setDate(d.getDate() + diff); dueDate = d.toISOString().split('T')[0];
        } else if (/monday/i.test(text)) {
          const d = new Date(); const day = d.getDay(); const diff = (1 - day + 7) % 7 || 7;
          d.setDate(d.getDate() + diff); dueDate = d.toISOString().split('T')[0];
        }
        if (/!hard|hard deadline/i.test(text)) deadlineType = 'hard';
        let title = text.replace(/,?\s*(high|low)\s*(urgency|impact|effort)/gi, '').replace(/,?\s*by\s*(tomorrow|friday|monday)/gi, '').replace(/,?\s*!?(hard|soft)\s*(deadline)?/gi, '').replace(/,?\s*\d+\s*(?:min|hour|hr|h)\b/gi, '').replace(/,?\s*(urgent|asap|critical|important|easy|simple|quick|hard|complex|difficult)\b/gi, '').trim();
        if (title.length < 2) title = text.trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);
        const newT = { id: Date.now(), title, cat, impact, urgency, effort, time, age: 0, done: false, status: 'todo', notes: '', link: '', aiReason: 'Created via AI chat', dueDate, deadlineType, confidence: 7, subtasks: [] };
        setTasks(prev => [newT, ...prev]);
        setChatContext(prev => ({ ...prev, lastCmd: 'create', lastAffected: [newT.id], lastTasksSnapshot: snapshot }));
        return { type: 'tasks', text: 'Created new task:', newTasks: [newT] };
      }
      case 'reprioritize': {
        const intent = cmd.intent;
        const intentKey = typeof intent === 'object' ? intent.type : intent;
        if (intentKey === 'impact') { resetTaskOrder(); } else {
          setActiveCtx(typeof intent === 'string' ? intent : intentKey);
          reorderByIntent(intent);
        }
        setChatContext(prev => ({ ...prev, lastCmd: 'reprioritize', lastTasksSnapshot: snapshot }));
        const topAfter = activeTasks.sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; }).slice(0, 3);
        let label = '';
        if (intentKey === 'lowEnergy') label = 'Low energy mode activated';
        else if (intentKey === 'quickWins') label = 'Quick wins mode';
        else if (intentKey === 'deepFocus') label = 'Deep focus mode';
        else if (intentKey === '30min') label = '30-minute window';
        else if (intentKey === 'time') label = intent.minutes + '-minute window';
        else if (/^cat/.test(intentKey)) label = 'Reprioritized for ' + intentKey.replace('cat', '');
        else label = 'Reprioritized by impact';
        return { type: 'text', text: '**' + label + '** \u2014 I\'ve reordered your ' + activeTasks.length + ' tasks.\n\nTop priorities:\n' + topAfter.map((tk, i) => (i + 1) + '. **' + tk.title + '** (' + score(tk) + '/100, ' + fmt(tk.time) + ')').join('\n') + '\n\nFocus on #1 first!' };
      }
      case 'plan': {
        const hr = new Date().getHours();
        const sorted = [...activeTasks].sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
        // Time-of-day awareness: deprioritize contextually inappropriate tasks
        const timeAppropriate = [];
        const timeInappropriate = [];
        for (const tk of sorted) {
          const tl = tk.title.toLowerCase();
          if (hr >= 17 && /\bmorning\b/.test(tl)) timeInappropriate.push(tk);
          else if (hr < 12 && /\b(evening|night)\b/.test(tl)) timeInappropriate.push(tk);
          else timeAppropriate.push(tk);
        }
        const planPool = [...timeAppropriate, ...timeInappropriate];
        let remaining = cmd.minutes;
        const planItems = [];
        const usedIds = new Set();
        let rt = new Date();
        rt.setMinutes(Math.ceil(rt.getMinutes() / 5) * 5, 0, 0);
        const addToPlan = (tk) => {
          const h = rt.getHours(), m = rt.getMinutes();
          const ampm = h >= 12 ? 'PM' : 'AM';
          const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
          planItems.push({ time: h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm, task: tk, duration: tk.time });
          rt = new Date(rt.getTime() + (tk.time + 5) * 60000);
          remaining -= tk.time;
          usedIds.add(tk.id);
        };
        // First pass: greedy by score
        for (const tk of planPool) {
          if (remaining <= 0) break;
          if (tk.time <= remaining) addToPlan(tk);
        }
        // Second pass: fill remaining time with shorter tasks
        if (remaining > 0) {
          const leftover = planPool.filter(tk => !usedIds.has(tk.id) && tk.time <= remaining).sort((a, b) => b.time - a.time);
          for (const tk of leftover) {
            if (remaining <= 0) break;
            if (tk.time <= remaining) addToPlan(tk);
          }
        }
        const totalPlanned = planItems.reduce((s, p) => s + p.duration, 0);
        setChatContext(prev => ({ ...prev, lastCmd: 'plan', lastPlan: planItems.map(p => p.task), lastAffected: planItems.map(p => p.task.id) }));
        const taskWord = planItems.length === 1 ? 'task' : 'tasks';
        return { type: 'plan', text: 'Here\'s your **' + (cmd.minutes >= 60 ? Math.round(cmd.minutes / 60) + '-hour' : cmd.minutes + '-min') + ' plan** (' + planItems.length + ' ' + taskWord + ', ' + fmt(totalPlanned) + ' total):', plan: planItems };
      }
      case 'review': {
        const sorted = [...activeTasks].sort((a, b) => {
          const da = daysUntilDue(a), db = daysUntilDue(b);
          if (a.deadlineType === 'hard' && da !== null && da <= 2) return -1;
          if (b.deadlineType === 'hard' && db !== null && db <= 2) return 1;
          return score(b) - score(a);
        });
        const catDist = cats.reduce((a2, ct) => { a2[ct] = activeTasks.filter((tk) => tk.cat === ct).length; return a2; }, {});
        const totalMin = activeTasks.reduce((s, tk) => s + tk.time, 0);
        const overdueTasks = activeTasks.filter(tk => { const d = daysUntilDue(tk); return d !== null && d < 0; });
        const neglectedCat = cats.find((ct) => !tasks.filter(tk => tk.done).some((tk) => tk.cat === ct) && activeTasks.some((tk) => tk.cat === ct));
        const bigTasks = activeTasks.filter((tk) => tk.effort >= 7 && tk.subtasks.length === 0);
        const insights = [];
        insights.push(String.fromCodePoint(0x1F4CA) + ' **Category Balance:** ' + Object.entries(catDist).map(([k, v]) => k + ': ' + v).join(' \u00B7 '));
        insights.push(String.fromCodePoint(0x23F1) + ' **Total workload:** ' + fmt(totalMin) + ' across ' + activeTasks.length + ' tasks');
        if (overdueTasks.length > 0) insights.push(String.fromCodePoint(0x26A0) + ' **Overdue:** ' + overdueTasks.length + ' task' + (overdueTasks.length > 1 ? 's' : '') + ' past due');
        if (neglectedCat) insights.push(String.fromCodePoint(0x1F504) + ' **Blind spot:** No ' + neglectedCat + ' tasks completed recently.');
        if (bigTasks.length > 0) insights.push(String.fromCodePoint(0x1F9E9) + ' **Break it down:** "' + bigTasks[0].title + '" is high effort with no subtasks.');
        insights.push(String.fromCodePoint(0x1F3AF) + ' **#1 Priority:** "' + (sorted[0] ? sorted[0].title : 'None') + '" (' + (sorted[0] ? score(sorted[0]) : 0) + '/100)');
        const suggested = sorted.slice(0, 5);
        setChatContext(prev => ({ ...prev, lastCmd: 'review', lastPlan: sorted, lastAffected: sorted.map(tk => tk.id), lastTasksSnapshot: snapshot }));
        return { type: 'review', text: '**AI Task Review:**\n\n' + insights.join('\n\n') + '\n\n**Suggested order:**\n' + suggested.map((tk, i) => (i + 1) + '. **' + tk.title + '** (' + score(tk) + '/100, ' + fmt(tk.time) + ')').join('\n') + '\n\nSay **"apply that"** to reorder your tasks.', sorted };
      }
      case 'status': {
        if (cmd.filter === 'overdue') {
          const overdue = activeTasks.filter(tk => { const d = daysUntilDue(tk); return d !== null && d < 0; });
          if (overdue.length === 0) return { type: 'text', text: 'No overdue tasks! You\'re on track.' };
          return { type: 'tasks', text: '**' + overdue.length + ' overdue task' + (overdue.length > 1 ? 's' : '') + ':**', newTasks: overdue };
        }
        if (cmd.filter === 'quickWins') {
          const qw = activeTasks.filter(tk => tk.effort <= 3 && tk.time <= 20).sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
          if (qw.length === 0) return { type: 'text', text: 'No quick wins right now.' };
          return { type: 'tasks', text: '**' + qw.length + ' quick win' + (qw.length > 1 ? 's' : '') + ':**', newTasks: qw.slice(0, 5) };
        }
        if (cmd.filter === 'count') {
          const doneCount = tasks.filter(tk => tk.done).length;
          return { type: 'text', text: 'You have **' + activeTasks.length + ' active tasks** and **' + doneCount + ' completed**. Total: ' + fmt(activeTasks.reduce((s, tk) => s + tk.time, 0)) + '.' };
        }
        if (cmd.filter === 'urgent') {
          const urgent = activeTasks.filter(tk => tk.urgency >= 7).sort((a, b) => b.urgency - a.urgency);
          if (urgent.length === 0) return { type: 'text', text: 'Nothing urgent right now!' };
          return { type: 'tasks', text: '**' + urgent.length + ' urgent task' + (urgent.length > 1 ? 's' : '') + ':**', newTasks: urgent.slice(0, 5) };
        }
        const doneCount = tasks.filter(tk => tk.done).length;
        const top = activeTasks.sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; }).slice(0, 3);
        return { type: 'text', text: '**Task Summary:**\n\n' + doneCount + ' completed, ' + activeTasks.length + ' active (' + fmt(activeTasks.reduce((s, tk) => s + tk.time, 0)) + ' total)\n\n**Top 3:**\n' + top.map((tk, i) => (i + 1) + '. ' + tk.title + ' (' + score(tk) + '/100)').join('\n') };
      }
      case 'undo': {
        if (chatContext.lastTasksSnapshot) {
          setTasks(chatContext.lastTasksSnapshot);
          setChatContext(prev => ({ ...prev, lastTasksSnapshot: null, lastCmd: null }));
          return { type: 'action', text: 'Undone! Reverted the last action.', action: 'undo', count: 0 };
        }
        return { type: 'text', text: 'Nothing to undo right now.' };
      }
      case 'apply': {
        if (chatContext.lastPlan && Array.isArray(chatContext.lastPlan)) {
          const orderMap = {};
          chatContext.lastPlan.forEach((tk, i) => { orderMap[tk.id] = i; });
          setTasks(prev => {
            const doneT = prev.filter(tk => tk.done);
            const activeT = prev.filter(tk => !tk.done).sort((a, b) => (orderMap[a.id] !== undefined ? orderMap[a.id] : 999) - (orderMap[b.id] !== undefined ? orderMap[b.id] : 999));
            return [...activeT, ...doneT];
          });
          setChatContext(prev => ({ ...prev, lastPlan: null }));
          return { type: 'action', text: 'Applied! Your tasks are now reordered.', action: 'apply', count: 0 };
        }
        return { type: 'text', text: 'No pending suggestion to apply.' };
      }
      default: return null;
    }
  };

  // V14: Send message - commands first, Gemini fallback for conversation
  const sendMsg = (text) => {
    if (!text || !text.trim()) return;
    setMsgs((p) => [...p, { role: 'user', text }]);
    setAiInput('');
    setAiThinking(true);

    const processMsg = async () => {
      const cmd = parseCommand(text);
      let response;
      if (cmd && cmd.type === 'bulk') {
        const results = [];
        for (const part of cmd.parts) {
          const subCmd = parseCommand(part);
          if (subCmd) { const r = executeCommand(subCmd); if (r) results.push(r.text); }
        }
        response = { type: 'text', text: results.join('\n\n') || 'Done!' };
      } else if (cmd) {
        response = executeCommand(cmd);
      }
      if (!response) {
        // V14: No command matched — send to Gemini for real AI conversation
        response = await callGemini(text);
      }
      setMsgs((p) => [...p, { role: 'ai', ...response }]);
      setAiThinking(false);
    };

    setTimeout(processMsg, 200);
  };
  // ─── DRAG ─────────────────────────────────────────────────
  const handleDragStart = (id) => setDragId(id);
  const handleDragOver = (e, tid) => { e.preventDefault(); if (dragId && dragId !== tid) setDragOverId(tid); };
  const handleDragLeave = () => setDragOverId(null);
  const handleDrop = (tid) => {
    if (!dragId || dragId === tid) return;
    setTasks((p) => { const a = [...p]; const fi = a.findIndex((t) => t.id === dragId); const ti = a.findIndex((t) => t.id === tid); const [mv] = a.splice(fi, 1); a.splice(ti, 0, mv); return a; });
    setDragId(null); setDragOverId(null);
  };

  const confetti = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#F38181', '#AA96DA', '#95E1D3', '#FF9FF3', '#48DBFB'];

  // ─── RENDER: CHECKBOX ────────────────────────────────────
  const renderChk = (t) => {
    const isCel = celebrating === t.id;
    const isConfetti = isCel && celPhase === 'confetti';
    const sc = score(t) >= 81 ? c.ok : score(t) >= 61 ? c.acc : score(t) >= 31 ? c.warn : c.danger;
    return (
    <button onClick={(e) => { e.stopPropagation(); if (!isCel) complete(t.id); }} style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid ' + sc, background: isConfetti ? sc : t.done ? sc : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative', transition: 'all 0.2s' }}>
      {(t.done || isConfetti) && <Check size={12} color="#fff" style={isConfetti ? { animation: 'checkPop 0.3s ease forwards' } : {}} />}
      {isConfetti && confetti.map((col, i) => <div key={i} style={{ position: 'absolute', width: i%2===0 ? 8 : 6, height: i%2===0 ? 8 : 6, borderRadius: i%3===0 ? '50%' : '2px', background: col, animation: 'cp' + i + ' 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards' }} />)}
    </button>
    );
  };

  // ─── RENDER: DETAIL (V10: with conditional AI nudge display) ──
  const renderDetail = (t) => (
    <div style={{ padding: '12px 16px 16px', borderTop: '1px solid ' + c.bdr, background: c.card2 }}>
      {showAiNudge === t.id && t.aiReason && <div style={{ display: 'flex', gap: 8, marginBottom: 12, padding: '10px 12px', borderRadius: 8, background: c.briefBg, border: '1px solid ' + c.acc + '20' }}><Sparkles size={14} color={c.acc} style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ fontSize: 12, color: c.txt, fontStyle: 'italic', lineHeight: 1.5 }}>{t.aiReason}</span></div>}
      {t.notes && <div style={{ fontSize: 12, color: c.txt, marginBottom: 10, lineHeight: 1.5 }}>{t.notes}</div>}
      {t.link && <a href={t.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: c.acc, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}><ExternalLink size={12} /> {t.link.replace(/https?:\/\/(www\.)?/, '').split('/')[0]}</a>}
      {t.dueDate && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 12, color: t.deadlineType === 'hard' ? c.danger : c.sub }}><Calendar size={12} /> Due {fmtDate(t.dueDate)} {t.deadlineType === 'hard' && <span style={{ background: c.danger, color: '#fff', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>HARD</span>}{t.deadlineType === 'soft' && <span style={{ background: c.bdr, color: c.sub, padding: '1px 6px', borderRadius: 4, fontSize: 10 }}>soft</span>}</div>}
      {t.subtasks && t.subtasks.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: c.sub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Subtasks ({t.subtasks.filter((s) => s.done).length}/{t.subtasks.length})</div>
          <div style={{ background: c.card, borderRadius: 6, border: '1px solid ' + c.bdr, overflow: 'hidden' }}>
            {t.subtasks.map((s, si) => <div key={s.id} onClick={(e) => { e.stopPropagation(); toggleSubtask(t.id, s.id); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderBottom: si < t.subtasks.length - 1 ? '1px solid ' + c.bdr : 'none', cursor: 'pointer' }}><div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid ' + (s.done ? c.ok : c.bdr), background: s.done ? c.ok : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.done && <Check size={10} color="#fff" />}</div><span style={{ fontSize: 12, color: s.done ? c.sub : c.txt, textDecoration: s.done ? 'line-through' : 'none' }}>{s.title}</span></div>)}
            <div style={{ display: 'flex', gap: 6, padding: '6px 10px', borderTop: '1px solid ' + c.bdr }}><input value={subInput} onChange={(e) => setSubInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); addSubtask(t.id); } }} onClick={(e) => e.stopPropagation()} placeholder="Add subtask..." style={{ flex: 1, background: 'transparent', border: 'none', color: c.txt, fontSize: 12, outline: 'none' }} /><button onClick={(e) => { e.stopPropagation(); addSubtask(t.id); }} style={{ background: 'transparent', border: 'none', color: c.acc, cursor: 'pointer', padding: 0 }}><Plus size={14} /></button></div>
          </div>
        </div>
      )}
      {/* V8: Scoring dimension badges (Lovable style) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {[
          { l: 'Impact', v: t.impact, color: '#5B6CF0' },
          { l: 'Urgency', v: t.urgency, color: '#D4643B' },
          { l: 'Blocking', v: Math.min(10, Math.round(t.impact * 0.6 + t.urgency * 0.4)), color: '#CF222E' },
          { l: 'Ease', v: 10 - t.effort, color: '#2EA043' },
          { l: 'Confidence', v: t.confidence || 7, color: '#8B5CF6' },
        ].map((b) => (
          <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: b.color + '15', border: '1px solid ' + b.color + '30' }}>
            <span style={{ fontSize: 11, color: b.color, fontWeight: 500 }}>{b.l}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.v}</span>
          </div>
        ))}
      </div>
      <button onClick={(e) => { e.stopPropagation(); setShowAiNudge(showAiNudge === t.id ? null : t.id); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid ' + c.acc + '40', background: c.acc + '10', color: c.acc, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: 10, width: '100%', justifyContent: 'center' }}><Sparkles size={14} /> {showAiNudge === t.id ? 'Hide AI Tips' : 'Get AI Tips & Breakdown'}</button>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={(e) => { e.stopPropagation(); startEditTask(t); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: c.acc, fontSize: 12, cursor: 'pointer', padding: '4px 0' }}><Sliders size={13} /> Edit task</button>
        <button onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: c.danger, fontSize: 12, cursor: 'pointer', padding: '4px 0' }}><Trash2 size={13} /> Delete task</button>
      </div>
    </div>
  );

  // ─── RENDER: TASK CARD (V8: description + smart tags + score/100) ──
  const renderTask = (t, opts = {}) => {
    const { large, drag, dim } = opts;
    const isExp = expanded === t.id, isDragging = dragId === t.id, d = daysUntilDue(t);
    const isCelebrating = celebrating === t.id;
    const subDone = t.subtasks ? t.subtasks.filter((s) => s.done).length : 0, subTotal = t.subtasks ? t.subtasks.length : 0;
    const smartTags = getSmartTags(t);
    const scoreVal = score(t);
    const scoreColor = scoreVal >= 81 ? c.ok : scoreVal >= 61 ? c.acc : scoreVal >= 31 ? c.warn : c.danger;
    return (
      <div key={t.id} draggable={drag} onDragStart={drag ? () => handleDragStart(t.id) : undefined} onDragOver={drag ? (e) => handleDragOver(e, t.id) : undefined} onDragLeave={drag ? handleDragLeave : undefined} onDrop={drag ? () => handleDrop(t.id) : undefined}
        style={{ borderRadius: 12, border: large ? 'none' : '1px solid ' + c.bdr, background: large ? 'transparent' : c.card, marginBottom: 8, opacity: (isCelebrating && celPhase === 'slideout') ? 0 : isDragging ? 0.4 : dim ? 0.6 : 1, cursor: drag ? 'grab' : 'default', transition: isCelebrating ? 'none' : 'opacity 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease', boxShadow: large ? 'none' : '0 1px 3px rgba(0,0,0,0.06)', overflow: 'visible', animation: (isCelebrating && celPhase === 'slideout') ? 'taskSlideOut 0.8s ease forwards' : 'none', transform: isDragging ? 'scale(0.98)' : 'translateX(0)', borderTop: dragOverId === t.id && dragId !== t.id ? '3px solid ' + c.acc : undefined }} onMouseEnter={(e) => { if (!large && !drag) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; if (!large && !drag) e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { if (!large && !drag) e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; if (!large && !drag) e.currentTarget.style.transform = 'translateY(0)'; }}>
        <div onClick={() => setExpanded(isExp ? null : t.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: mobile ? 8 : 10, padding: large ? '14px 16px' : '12px 14px', cursor: 'pointer' }}>
          {drag && !mobile && <GripVertical size={14} color={c.sub} style={{ flexShrink: 0, opacity: 0.5, marginTop: 4 }} />}
          <div style={{ marginTop: 2 }}>{renderChk(t)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: large ? 15 : 14, fontWeight: large ? 600 : 500, color: c.txt, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
            {/* V8: Description subtitle */}
            {t.notes && <div style={{ fontSize: 12, color: c.sub, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.notes}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: catColors[t.cat], background: catColors[t.cat] + '18', padding: '2px 8px', borderRadius: 10 }}>{t.cat}</span>
              {/* V8: Smart tags */}
              {smartTags.map((tag, i) => <span key={i} style={{ fontSize: 10, fontWeight: 500, color: tag.color, background: tag.color + '15', padding: '2px 8px', borderRadius: 10 }}>{tag.label}</span>)}
              {t.dueDate && <span style={{ fontSize: 10, fontWeight: 500, color: t.deadlineType === 'hard' ? c.danger : c.sub, display: 'flex', alignItems: 'center', gap: 2 }}><Calendar size={9} /> {fmtDate(t.dueDate)}{t.deadlineType === 'hard' && d !== null && d <= 2 && <AlertTriangle size={9} style={{ marginLeft: 2 }} />}</span>}
              {subTotal > 0 && <span style={{ fontSize: 10, color: subDone === subTotal ? c.ok : c.sub, display: 'flex', alignItems: 'center', gap: 3 }}><Circle size={8} fill={subDone === subTotal ? c.ok : 'transparent'} /> {subDone}/{subTotal}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexShrink: 0 }}>
            {/* V8: Score as /100 badge */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ minWidth: 44, height: 28, borderRadius: 12, background: scoreColor + '18', border: '1px solid ' + scoreColor + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, transition: 'all 0.2s' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}>{scoreVal}</span>
                <span style={{ fontSize: 9, fontWeight: 500, color: scoreColor, opacity: 0.7 }}>/100</span>
              </div>
            </div>
            {!mobile && <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: c.sub, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fmt(t.time)}</div>
            </div>}
            <ChevronRight size={14} color={c.sub} style={{ transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', marginTop: 6 }} />
          </div>
        </div>
        {isExp && renderDetail(t)}
      </div>
    );
  };

  const sectionHead = (label, count) => <div style={{ fontSize: 11, fontWeight: 600, color: c.sub, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>{label} <span style={{ fontSize: 10, fontWeight: 400 }}>({count})</span></div>;

  // ─── AI REVIEW PANEL ──────────────────────────────────────
  const renderAiReview = () => {
    if (aiReview === 'loading') return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
        <div style={{ animation: 'pulse 1.5s infinite' }}><Brain size={40} color={c.acc} /></div>
        <div style={{ fontSize: 15, fontWeight: 600, color: c.txt }}>AI Deep Analysis</div>
        <div style={{ fontSize: 13, color: c.sub, animation: 'fadeSlide 0.5s ease' }} key={loadingMsg}>{loadingMsg}</div>
        <div style={{ width: 120, height: 3, background: c.bdr, borderRadius: 2, overflow: 'hidden' }}><div style={{ width: '60%', height: '100%', background: c.acc, borderRadius: 2, animation: 'loading 2s ease infinite' }} /></div>
      </div>
    );
    if (!reviewData) return null;
    const tabs = [{ id: 'priority', label: 'Priority Order', icon: Target }, { id: 'insights', label: 'Insights', icon: Zap }, { id: 'plan', label: 'Daily Plan', icon: Clock }];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setAiReview(null)} style={{ background: 'transparent', border: 'none', color: c.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><ChevronLeft size={14} /> Back</button>
          <div style={{ flex: 1 }} />
          <Brain size={16} color={c.acc} />
          <span style={{ fontSize: 14, fontWeight: 600, color: c.txt }}>AI Review</span>
          <span style={{ fontSize: 9, color: c.acc, background: c.acc + '18', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>Opus 4.6</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 12, background: c.card, borderRadius: 8, padding: 4, border: '1px solid ' + c.bdr }}>
          {tabs.map((tab) => <button key={tab.id} onClick={() => setReviewTab(tab.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '7px 0', borderRadius: 6, border: 'none', background: reviewTab === tab.id ? c.acc + '18' : 'transparent', color: reviewTab === tab.id ? c.acc : c.sub, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}><tab.icon size={12} /> {tab.label}</button>)}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {reviewTab === 'priority' && (
            <div>
              {reviewData.sorted.map((t, i) => {
                const origScore = score(t), aiScore = reviewData.aiScores[t.id];
                const diff = aiScore - origScore;
                return (
                  <div key={t.id} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: i === 0 ? c.doNow : c.card, marginBottom: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? c.acc : c.bdr, color: i === 0 ? '#fff' : c.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: c.txt, marginBottom: 3 }}>{t.title}</div>
                      <div style={{ fontSize: 11, color: c.sub, fontStyle: 'italic', lineHeight: 1.4, marginBottom: 4 }}>{reviewData.understanding[t.id]}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, color: catColors[t.cat], background: catColors[t.cat] + '18', padding: '1px 6px', borderRadius: 4 }}>{t.cat}</span>
                        {diff !== 0 && <span style={{ fontSize: 10, fontWeight: 600, color: diff > 0 ? c.ok : c.danger }}>{diff > 0 ? '↑' : '↓'} {origScore} → {aiScore}</span>}
                        <span style={{ fontSize: 10, color: c.sub }}>{fmt(t.time)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={applyAiOrder} style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Apply AI Order</button>
            </div>
          )}
          {reviewTab === 'insights' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reviewData.insights.map((ins, i) => (
                <div key={i} style={{ padding: 14, borderRadius: 10, border: '1px solid ' + c.bdr, background: c.card }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><span style={{ fontSize: 16 }}>{ins.emoji}</span><span style={{ fontSize: 13, fontWeight: 600, color: c.txt }}>{ins.title}</span></div>
                  <div style={{ fontSize: 12, color: c.sub, lineHeight: 1.6 }}>{ins.body}</div>
                </div>
              ))}
            </div>
          )}
          {reviewTab === 'plan' && (
            <div>
              <div style={{ fontSize: 12, color: c.sub, marginBottom: 12 }}>Your AI-optimized schedule for today:</div>
              {reviewData.plan.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
                  <div style={{ width: 60, fontSize: 12, fontWeight: 600, color: c.acc, textAlign: 'right', flexShrink: 0, paddingTop: 10 }}>{p.time}</div>
                  <div style={{ width: 2, background: c.bdr, flexShrink: 0, position: 'relative' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? c.acc : c.bdr, position: 'absolute', top: 12, left: -3 }} /></div>
                  <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: c.card, border: '1px solid ' + c.bdr, marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c.txt }}>{p.task.title}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: catColors[p.task.cat], background: catColors[p.task.cat] + '18', padding: '1px 6px', borderRadius: 4 }}>{p.task.cat}</span>
                      <span style={{ fontSize: 10, color: c.sub }}>{fmt(p.duration)}</span>
                      <span style={{ fontSize: 10, color: c.sub }}>{p.reason}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={applyAiOrder} style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>Apply This Plan</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── ADD TASK MODAL (V8.3: Brain Dump default + Manual tab) ──
  const renderAddModal = () => {
    if (!showAddModal) return null;
    const sliderStyle = (val) => ({
      width: '100%', height: 6, appearance: 'none', WebkitAppearance: 'none', borderRadius: 3,
      background: `linear-gradient(to right, ${c.acc} ${val * 10}%, ${c.bdr} ${val * 10}%)`,
      outline: 'none', cursor: 'pointer',
    });
    const closeModal = () => { setShowAddModal(false); setEditingTask(null); setReviewingDump(false); setParsedTasks([]); setDumpText(''); setAddMode('brainDump'); setNewTask({ title: '', description: '', cat: 'Business', time: 30, urgency: 5, impact: 5, confidence: 7, ease: 5, blocking: 5, delegatable: false, dueDate: '', deadlineType: 'soft' }); };
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={closeModal}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: c.card, borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '88vh', overflowY: 'auto', padding: 24, border: '1px solid ' + c.bdr, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: c.txt, margin: 0 }}>{editingTask ? 'Edit Task' : 'Add Tasks'}</h2>
            <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: c.sub, cursor: 'pointer' }}><X size={18} /></button>
          </div>

          {/* Tab switcher (only when not editing) */}
          {!editingTask && (
            <div style={{ display: 'flex', gap: 2, marginBottom: 20, background: c.bg, borderRadius: 10, padding: 3, border: '1px solid ' + c.bdr }}>
              <button onClick={() => setAddMode('brainDump')} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: addMode === 'brainDump' ? c.card : 'transparent', color: addMode === 'brainDump' ? c.acc : c.sub, fontSize: 12, fontWeight: addMode === 'brainDump' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: addMode === 'brainDump' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}><Brain size={13} /> AI Brain Dump</button>
              <button onClick={() => setAddMode('manual')} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: addMode === 'manual' ? c.card : 'transparent', color: addMode === 'manual' ? c.txt : c.sub, fontSize: 12, fontWeight: addMode === 'manual' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: addMode === 'manual' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}><Plus size={13} /> Manual</button>
            </div>
          )}

          {/* ── BRAIN DUMP TAB ── */}
          {addMode === 'brainDump' && !editingTask && !reviewingDump && (
            <div>
              <div style={{ fontSize: 12, color: c.sub, marginBottom: 12, lineHeight: 1.6 }}>Dump everything on your mind — tasks, ideas, things you need to do. Speak freely or type it all out. AI will parse it into structured, ranked tasks.</div>
              <textarea value={dumpText} onChange={(e) => setDumpText(e.target.value)} placeholder={"I need to call the supplier about Q2 inventory, it's urgent. Also review the Q1 numbers before Friday — should schedule the investor call sometime this week. Oh and I should probably work out tomorrow morning..."} rows={8} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.7, fontFamily: 'inherit', boxSizing: 'border-box', minHeight: 160 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => { if (recording) stopSpeech('dump'); else startSpeech('dump'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, border: '1px solid ' + (recording ? c.danger : c.bdr), background: recording ? c.danger + '15' : c.card, color: recording ? c.danger : c.sub, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}><Mic size={14} /> {recording ? 'Stop Recording' : 'Voice Input'}</button>
                <div style={{ flex: 1 }} />
                <button onClick={() => { setDumpProcessing(true); setTimeout(() => { const parsed = parseBrainDump(dumpText); setParsedTasks(parsed); setSelectedParsed(new Set(parsed.map((_, i) => i))); setReviewingDump(true); setDumpProcessing(false); }, 800); }} disabled={dumpText.trim().length < 10 || dumpProcessing} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: dumpText.trim().length >= 10 ? c.acc : c.bdr, color: '#fff', fontSize: 13, fontWeight: 600, cursor: dumpText.trim().length >= 10 ? 'pointer' : 'default' }}><Sparkles size={14} /> {dumpProcessing ? 'Processing...' : 'Process with AI'}</button>
              </div>
              {recording && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: c.danger, animation: 'blink 1s infinite' }} /><span style={{ fontSize: 12, color: c.danger }}>Listening... speak freely</span></div>}
            </div>
          )}

          {/* ── BRAIN DUMP REVIEW ── */}
          {addMode === 'brainDump' && !editingTask && reviewingDump && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.txt }}>Parsed {parsedTasks.length} tasks</div>
                <button onClick={() => { setReviewingDump(false); setParsedTasks([]); }} style={{ fontSize: 11, color: c.sub, background: 'transparent', border: 'none', cursor: 'pointer' }}>Back to edit</button>
              </div>
              <div style={{ fontSize: 11, color: c.sub, marginBottom: 12 }}>Review, edit, and select tasks to add. Click a title to edit it.</div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {parsedTasks.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid ' + (selectedParsed.has(i) ? c.acc + '60' : c.bdr), background: selectedParsed.has(i) ? c.acc + '08' : c.card, marginBottom: 6, alignItems: 'flex-start' }}>
                    <button onClick={() => setSelectedParsed(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; })} style={{ width: 20, height: 20, borderRadius: 4, border: '2px solid ' + (selectedParsed.has(i) ? c.acc : c.bdr), background: selectedParsed.has(i) ? c.acc : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}>{selectedParsed.has(i) && <Check size={11} color="#fff" />}</button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <input value={pt.title} onChange={(e) => setParsedTasks(prev => prev.map((p, j) => j === i ? { ...p, title: e.target.value } : p))} style={{ width: '100%', background: 'transparent', border: 'none', color: c.txt, fontSize: 13, fontWeight: 500, outline: 'none', padding: 0 }} />
                      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: catColors[pt.cat], background: catColors[pt.cat] + '18', padding: '1px 6px', borderRadius: 4 }}>{pt.cat}</span>
                        <span style={{ fontSize: 10, color: c.sub }}>{fmt(pt.time)}</span>
                        <span style={{ fontSize: 10, color: c.sub }}>urgency: {pt.urgency}</span>
                        <span style={{ fontSize: 10, color: c.sub }}>impact: {pt.impact}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: pt._score >= 60 ? c.ok : c.acc, flexShrink: 0 }}>{pt._score}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button onClick={() => setSelectedParsed(selectedParsed.size === parsedTasks.length ? new Set() : new Set(parsedTasks.map((_, i) => i)))} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid ' + c.bdr, background: 'transparent', color: c.sub, fontSize: 12, cursor: 'pointer' }}>{selectedParsed.size === parsedTasks.length ? 'Deselect All' : 'Select All'}</button>
                <div style={{ flex: 1 }} />
                <button onClick={addParsedTasks} disabled={selectedParsed.size === 0} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: selectedParsed.size > 0 ? c.acc : c.bdr, color: '#fff', fontSize: 13, fontWeight: 600, cursor: selectedParsed.size > 0 ? 'pointer' : 'default' }}>Add {selectedParsed.size} Task{selectedParsed.size !== 1 ? 's' : ''}</button>
              </div>
            </div>
          )}

          {/* ── MANUAL TAB (original form) ── */}
          {(addMode === 'manual' || editingTask) && (
            <div>
              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 4, display: 'block' }}>Title</label>
                <input value={newTask.title} onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 4, display: 'block' }}>Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask(p => ({ ...p, description: e.target.value }))} placeholder="Add details, notes, or context..." rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.5, fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              {/* AI Auto-Score */}
              {!editingTask && <button onClick={aiAutoScore} disabled={!newTask.title.trim()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, border: '1px solid ' + c.acc + '40', background: c.acc + '10', color: c.acc, fontSize: 13, fontWeight: 600, cursor: newTask.title.trim() ? 'pointer' : 'default', marginBottom: 20, width: '100%', justifyContent: 'center', opacity: newTask.title.trim() ? 1 : 0.5 }}><Sparkles size={16} /> AI Auto-Score</button>}
              {/* Category + Time row */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 4, display: 'block' }}>Category</label>
                  <select value={newTask.cat} onChange={(e) => setNewTask(p => ({ ...p, cat: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 13, outline: 'none' }}>
                    {['Business', 'Work', 'Health', 'Personal'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 4, display: 'block' }}>Est. Time (min)</label>
                  <input type="number" value={newTask.time} onChange={(e) => setNewTask(p => ({ ...p, time: parseInt(e.target.value) || 0 }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              {/* Scoring sliders */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 10, display: 'block' }}>Scoring Dimensions</label>
                {[
                  { key: 'urgency', label: 'Urgency' },
                  { key: 'impact', label: 'Impact' },
                  { key: 'confidence', label: 'Confidence' },
                  { key: 'ease', label: 'Ease' },
                  { key: 'blocking', label: 'Blocking Potential' },
                ].map(dim => (
                  <div key={dim.key} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: c.sub }}>{dim.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: c.acc }}>{newTask[dim.key]}</span>
                    </div>
                    <input type="range" min="1" max="10" value={newTask[dim.key]} onChange={(e) => setNewTask(p => ({ ...p, [dim.key]: parseInt(e.target.value) }))} style={sliderStyle(newTask[dim.key])} />
                  </div>
                ))}
              </div>
              {/* Due date + Delegatable row */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 4, display: 'block' }}>Due Date (optional)</label>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <button onClick={() => setNewTask(p => ({ ...p, delegatable: !p.delegatable }))} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: '1px solid ' + (newTask.delegatable ? c.acc : c.bdr), background: newTask.delegatable ? c.acc + '15' : 'transparent', color: newTask.delegatable ? c.acc : c.sub, fontSize: 12, cursor: 'pointer' }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid ' + (newTask.delegatable ? c.acc : c.bdr), background: newTask.delegatable ? c.acc : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{newTask.delegatable && <Check size={10} color="#fff" />}</div>
                    Can be delegated?
                  </button>
                </div>
              </div>
              {/* Submit */}
              <button onClick={editingTask ? saveEditTask : addTaskFromModal} disabled={!newTask.title.trim()} style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: newTask.title.trim() ? c.acc : c.bdr, color: '#fff', fontSize: 14, fontWeight: 600, cursor: newTask.title.trim() ? 'pointer' : 'default' }}>{editingTask ? 'Save Changes' : 'Add Task'}</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── PAGE: FOCUS (V10: Task queue with progress bar, Start Focus button) ──
  const renderFocusQueue = () => {
    const completedToday = done.length;
    const totalTasksToday = active.length + done.length;
    const progressPct = totalTasksToday > 0 ? (completedToday / totalTasksToday) * 100 : 0;
    return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: c.txt }}>Focus Session</span>
          <span style={{ fontSize: 11, color: c.sub, background: c.bdr + '60', padding: '2px 8px', borderRadius: 10 }}>{active.length} tasks</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => sendMsg('review my tasks')} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: '1px solid ' + c.acc, background: c.acc + '15', color: c.acc, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Sparkles size={13} /> AI Review</button>
          <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Plus size={14} /> Add Task</button>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: c.sub }}>Today Progress</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: c.acc }}>{completedToday} of {totalTasksToday} completed</span>
        </div>
        <div style={{ height: 6, background: c.bdr, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg, ${c.ok} 0%, ${c.acc} 100%)`, width: progressPct + '%', borderRadius: 3, transition: 'width 0.3s ease' }} />
        </div>
      </div>
      {!focusMode && !focusPickerOpen && <button onClick={() => setFocusPickerOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: 'none', background: c.card, color: c.acc, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: 14, justifyContent: 'center', transition: 'all 0.15s', width: '100%' }}><Zap size={14} /> Start Focus</button>}
      {focusPickerOpen && !focusMode && <div style={{ marginBottom: 14, padding: 12, borderRadius: 10, background: c.card, border: '1px solid ' + c.acc + '40' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: c.txt, marginBottom: 8 }}>Choose focus duration:</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[25, 45, 60, 90].map(m => <button key={m} onClick={() => startFocus(m)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: 'transparent', color: c.txt, fontSize: 11, cursor: 'pointer', fontWeight: 500 }}>{m}m</button>)}
          {topTask && topTask.time && <button onClick={() => startFocus(topTask.time)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid ' + c.acc, background: c.acc + '12', color: c.acc, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>{topTask.time}m (task)</button>}
        </div>
        <button onClick={() => setFocusPickerOpen(false)} style={{ marginTop: 6, fontSize: 10, color: c.sub, background: 'transparent', border: 'none', cursor: 'pointer' }}>Cancel</button>
      </div>}
      {focusMode && <div style={{ marginBottom: 14, padding: 12, borderRadius: 10, background: c.acc + '12', border: '1px solid ' + c.acc + '40', textAlign: 'center' }}>
        {topTask && <div style={{ fontSize: 11, fontWeight: 600, color: c.acc, marginBottom: 4 }}>Focusing on: {topTask.title}</div>}
        <div style={{ fontSize: 28, fontWeight: 700, color: c.acc, fontFamily: 'monospace', letterSpacing: 2 }}>{fmtTimer(focusTimer)}</div>
        <div style={{ height: 3, background: c.bdr, borderRadius: 2, marginTop: 8, overflow: 'hidden' }}><div style={{ height: '100%', background: c.acc, borderRadius: 2, width: (focusDuration > 0 ? ((focusDuration - focusTimer) / focusDuration * 100) : 0) + '%', transition: 'width 1s linear' }} /></div>
        <button onClick={stopFocus} style={{ marginTop: 8, padding: '4px 14px', borderRadius: 6, border: 'none', background: c.danger, color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Exit Focus</button>
      </div>}
      {/* Context chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: activeCtx ? 8 : 16 }}>
        {chipDefs.map((ch) => <button key={ch.key} onClick={() => { if (activeCtx === ch.key) resetTaskOrder(); else { setActiveCtx(ch.key); reorderByIntent(ch.key); } }} style={{ padding: '5px 10px', borderRadius: 20, border: '1px solid ' + (activeCtx === ch.key ? c.acc : c.bdr), background: activeCtx === ch.key ? c.acc + '18' : 'transparent', color: activeCtx === ch.key ? c.acc : c.sub, fontSize: 11, cursor: 'pointer' }}>{ch.icon} {ch.label}</button>)}
      </div>
      {/* V8.3: Active filter banner */}
      {activeCtx && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: c.acc + '12', border: '1px solid ' + c.acc + '30', marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: c.acc }}>Sorted for: {activeCtx === 'lowEnergy' ? 'Low Energy' : activeCtx === 'quickWins' ? 'Quick Wins' : activeCtx === 'deepFocus' ? 'Deep Focus' : activeCtx === '30min' ? '30 Min' : activeCtx === 'catBusiness' ? 'Business Focus' : activeCtx === 'catHealth' ? 'Health Focus' : activeCtx === 'catPersonal' ? 'Personal Focus' : activeCtx === 'catWork' ? 'Work Focus' : activeCtx === 'time' ? 'Time Window' : activeCtx}</span>
          <button onClick={resetTaskOrder} style={{ fontSize: 11, color: c.acc, background: 'transparent', border: '1px solid ' + c.acc + '40', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>Reset Order</button>
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 2px' }}>
        {topTask && <div style={{ background: focusMode ? c.doNow : 'transparent', border: '2px solid ' + c.acc, borderRadius: 12, padding: '12px 14px', marginBottom: 20, opacity: focusMode ? 1 : 1, transition: 'opacity 0.2s' }}><div style={{ fontSize: 11, fontWeight: 700, color: c.acc, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={14} color={c.acc} /> Do Now</div>{renderTask(topTask, { large: true })}</div>}
        {upNext.length > 0 && <div style={{ marginBottom: 20, opacity: focusMode ? 0.3 : 1, transition: 'opacity 0.2s' }}>{sectionHead('Up Next', upNext.length)}{upNext.map((t) => renderTask(t, { drag: true }))}</div>}
        {later.length > 0 && <div style={{ marginBottom: 20, opacity: focusMode ? 0.2 : 0.65, transition: 'opacity 0.2s' }}>{sectionHead('Later', later.length)}{later.map((t) => renderTask(t, { drag: true, dim: true }))}</div>}
        {done.length > 0 && <>
          <button onClick={() => setShowDone(!showDone)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: c.sub, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 16, marginBottom: 8, cursor: 'pointer' }}>{showDone ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Done ({done.length})</button>
          {showDone && done.map((t) => <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 8, background: c.card, border: '1px solid ' + c.bdr, marginBottom: 6, opacity: 0.5 }}><Check size={14} color={c.ok} /><span style={{ fontSize: 13, color: c.sub, textDecoration: 'line-through' }}>{t.title}</span></div>)}
        </>}
        {active.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: c.sub, fontSize: 14 }}>All caught up!</div>}
      </div>
    </div>
  );
  };

  // ─── AI CHAT PANEL (V8: always visible on Focus page, left side) ──
  // Simple markdown renderer for AI chat messages
  const renderMd = (text) => {
    if (!text) return text;
    const lines = text.split('\n');
    return lines.map((line, li) => {
      // Process inline markdown: **bold** and *italic*
      const parts = [];
      let remaining = line;
      let key = 0;
      while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        const italicMatch = remaining.match(/\*(.+?)\*/);
        const match = boldMatch && italicMatch
          ? (boldMatch.index <= italicMatch.index ? boldMatch : italicMatch)
          : boldMatch || italicMatch;
        if (!match) { parts.push(<span key={key++}>{remaining}</span>); break; }
        if (match.index > 0) parts.push(<span key={key++}>{remaining.slice(0, match.index)}</span>);
        if (match[0].startsWith('**')) parts.push(<strong key={key++} style={{ fontWeight: 700 }}>{match[1]}</strong>);
        else parts.push(<em key={key++} style={{ fontStyle: 'italic' }}>{match[1]}</em>);
        remaining = remaining.slice(match.index + match[0].length);
      }
      return <span key={li}>{parts}{li < lines.length - 1 && <br />}</span>;
    });
  };

  const renderAiChat = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Brain size={18} color={c.acc} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.txt }}>AI Chief of Staff</div>
          <div style={{ fontSize: 11, color: c.sub }}>Tell me your state, I'll plan your session</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: 9, color: c.acc, background: c.acc + '18', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>Opus 4.6</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
        {msgs.length === 0 && (
          <div style={{ padding: '16px 4px' }}>
            <div style={{ fontSize: 13, color: c.sub, marginBottom: 16, lineHeight: 1.6 }}>{renderMd("I'm your AI Chief of Staff. I can **archive** tasks, **create** new ones, **plan** your time, **review** priorities, or **reprioritize** based on your energy and schedule. Just tell me what you need.")}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {aiSuggestions.map((s) => <button key={s} onClick={() => sendMsg(s)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.card, color: c.txt, fontSize: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>{s}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}><div style={{ maxWidth: '88%', padding: '10px 14px', borderRadius: 12, background: m.role === 'user' ? c.acc : c.card, color: m.role === 'user' ? '#fff' : c.txt, fontSize: 12, lineHeight: 1.6, border: m.role === 'ai' ? '1px solid ' + c.bdr : 'none' }}>
              {m.role === 'ai' ? (<>
                {renderMd(m.text)}
                {m.type === 'plan' && m.plan && (<div style={{ marginTop: 10 }}>{m.plan.map((p, pi) => (<div key={pi} style={{ display: 'flex', gap: 8, padding: '6px 8px', borderRadius: 6, background: c.bg, border: '1px solid ' + c.bdr, marginBottom: 4 }}><span style={{ fontSize: 10, fontWeight: 700, color: c.acc, whiteSpace: 'nowrap', minWidth: 65 }}>{p.time}</span><span style={{ fontSize: 11, color: c.txt, flex: 1 }}>{p.task.title}</span><span style={{ fontSize: 9, color: c.sub }}>{fmt(p.duration)}</span></div>))}<button onClick={() => sendMsg('apply that')} style={{ marginTop: 6, padding: '5px 14px', borderRadius: 6, border: '1px solid ' + c.acc, background: c.acc + '12', color: c.acc, fontSize: 11, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Apply this plan</button></div>)}
                {m.type === 'tasks' && m.newTasks && (<div style={{ marginTop: 8 }}>{m.newTasks.map((tk, ti) => (<div key={ti} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, background: c.bg, border: '1px solid ' + c.bdr, marginBottom: 3 }}><span style={{ fontSize: 9, color: catColors[tk.cat], background: catColors[tk.cat] + '18', padding: '1px 5px', borderRadius: 4 }}>{tk.cat}</span><span style={{ fontSize: 11, color: c.txt, flex: 1 }}>{tk.title}</span><span style={{ fontSize: 9, color: c.sub }}>{fmt(tk.time)}</span></div>))}</div>)}
                {m.canUndo && (<button onClick={() => sendMsg('undo')} style={{ marginTop: 8, padding: '4px 12px', borderRadius: 6, border: '1px solid ' + c.bdr, background: 'transparent', color: c.acc, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Undo</button>)}
              </>) : m.text}
            </div></div>)}
        {aiThinking && <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'flex-start' }}><div style={{ padding: '10px 18px', borderRadius: 12, background: c.card, border: '1px solid ' + c.bdr }}><span style={{ fontSize: 14, animation: 'pulse 1s infinite' }}>{String.fromCodePoint(0x1F914)} Thinking...</span></div></div>}
        <div ref={chatEndRef} />
      </div>
      {recording && <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F85149', animation: 'blink 1s infinite' }} /><span style={{ fontSize: 12, color: c.danger }}>Recording... tap mic to stop</span></div>}
      <div style={{ borderTop: '1px solid ' + c.bdr, paddingTop: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <button onClick={() => { if (recording) stopSpeech('chat'); else startSpeech('chat'); }} style={{ width: 34, height: 34, borderRadius: '50%', border: recording ? 'none' : '1px solid ' + c.bdr, background: recording ? c.danger : c.card, color: recording ? '#fff' : c.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, animation: recording ? 'micPulse 1.5s infinite' : 'none' }}><Mic size={14} /></button>
          <textarea value={aiInput} onChange={(e) => { setAiInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(aiInput); } }} placeholder="Tell me your state..." rows={2} style={{ flex: 1, background: c.bg, border: '1px solid ' + c.bdr, borderRadius: 10, padding: '10px 14px', color: c.txt, fontSize: 13, outline: 'none', lineHeight: 1.5, minHeight: 44, maxHeight: 100, fontFamily: 'inherit', resize: 'none' }} />
          <button onClick={() => sendMsg(aiInput)} disabled={!aiInput.trim()} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: aiInput.trim() ? c.acc : c.bdr, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: aiInput.trim() ? 'pointer' : 'default', flexShrink: 0 }}><Send size={14} /></button>
        </div>
        {msgs.length > 0 && (() => {
          const hr = new Date().getHours();
          const allActive = tasks.filter(tk => !tk.done);
          const overdue = allActive.filter(tk => { const d = daysUntilDue(tk); return d !== null && d < 0; });
          const hints = [];
          if (overdue.length > 0) hints.push("What's overdue?");
          if (hr >= 14) hints.push('Plan my remaining time');
          if (hr < 12) hints.push("Plan my morning");
          hints.push('Review my priorities');
          if (chatContext.lastPlan) hints.push('Apply that');
          return <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>{hints.slice(0, 4).map(h => <button key={h} onClick={() => sendMsg(h)} style={{ padding: '3px 8px', borderRadius: 12, border: '1px solid ' + c.bdr, background: 'transparent', color: c.sub, fontSize: 10, cursor: 'pointer' }}>{h}</button>)}</div>;
        })()}
      </div>
    </div>
  );

  // ─── AI Review rendered inline in left panel ──────────────
  const renderAiReviewInline = () => {
    if (aiReview === 'loading') return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
        <div style={{ animation: 'pulse 1.5s infinite' }}><Brain size={40} color={c.acc} /></div>
        <div style={{ fontSize: 15, fontWeight: 600, color: c.txt }}>AI Deep Analysis</div>
        <div style={{ fontSize: 13, color: c.sub, animation: 'fadeSlide 0.5s ease' }} key={loadingMsg}>{loadingMsg}</div>
        <div style={{ width: 120, height: 3, background: c.bdr, borderRadius: 2, overflow: 'hidden' }}><div style={{ width: '60%', height: '100%', background: c.acc, borderRadius: 2, animation: 'loading 2s ease infinite' }} /></div>
      </div>
    );
    if (!reviewData) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
        <Brain size={32} color={c.sub} />
        <div style={{ fontSize: 13, color: c.sub, textAlign: 'center', lineHeight: 1.6 }}>Run AI Review to get a personalized priority order, insights, and a daily plan for your tasks.</div>
        <button onClick={runAiReview} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: c.acc, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Brain size={14} /> Run Review</button>
      </div>
    );
    const tabs = [{ id: 'priority', label: 'Priority', icon: Target }, { id: 'insights', label: 'Insights', icon: Zap }, { id: 'plan', label: 'Plan', icon: Clock }];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, background: c.bg, borderRadius: 8, padding: 3, border: '1px solid ' + c.bdr }}>
          {tabs.map((tab) => <button key={tab.id} onClick={() => setReviewTab(tab.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 0', borderRadius: 6, border: 'none', background: reviewTab === tab.id ? c.acc + '18' : 'transparent', color: reviewTab === tab.id ? c.acc : c.sub, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}><tab.icon size={11} /> {tab.label}</button>)}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {reviewTab === 'priority' && reviewData.sorted.map((t, i) => {
            const origScore = score(t), aiScore = reviewData.aiScores[t.id];
            const diff = aiScore - origScore;
            return (
              <div key={t.id} style={{ display: 'flex', gap: 8, padding: '8px 10px', borderRadius: 8, border: '1px solid ' + c.bdr, background: i === 0 ? c.doNow : c.card, marginBottom: 5 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? c.acc : c.bdr, color: i === 0 ? '#fff' : c.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: c.txt, marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: 10, color: c.sub, fontStyle: 'italic', lineHeight: 1.4, marginBottom: 3 }}>{reviewData.understanding[t.id]}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 9, color: catColors[t.cat], background: catColors[t.cat] + '18', padding: '1px 5px', borderRadius: 4 }}>{t.cat}</span>
                    {diff !== 0 && <span style={{ fontSize: 9, fontWeight: 600, color: diff > 0 ? c.ok : c.danger }}>{diff > 0 ? '↑' : '↓'} {origScore} → {aiScore}</span>}
                    <span style={{ fontSize: 9, color: c.sub }}>{fmt(t.time)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {reviewTab === 'insights' && reviewData.insights.map((ins, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.card, marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><span style={{ fontSize: 14 }}>{ins.emoji}</span><span style={{ fontSize: 12, fontWeight: 600, color: c.acc }}>{ins.title}</span></div>
              <div style={{ fontSize: 11, color: c.sub, lineHeight: 1.5 }}>{ins.body}</div>
            </div>
          ))}
          {reviewTab === 'plan' && reviewData.plan.map((block, i) => (
            <div key={i} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.card, marginBottom: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: c.txt }}>{block.time}</span>
                <span style={{ fontSize: 9, color: c.sub }}>{typeof block.duration === 'number' ? fmt(block.duration) : block.duration}</span>
              </div>
              <div style={{ fontSize: 11, color: c.sub }}>{typeof block.task === 'object' ? block.task.title : block.task}</div>
            </div>
          ))}
          {reviewTab === 'priority' && <button onClick={applyAiOrder} style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}>Apply AI Order</button>}
          <button onClick={runAiReview} style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: '1px solid ' + c.bdr, background: 'transparent', color: c.sub, fontSize: 11, cursor: 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Brain size={11} /> Re-run Review</button>
        </div>
      </div>
    );
  };

  // ─── LEFT PANEL: Always Chat (V11) ──────────────────────
  const renderLeftPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {renderAiChat()}
    </div>
  );

  // ─── PAGE: FOCUS (V8.1: 2-panel with tabbed left panel) ───
  const renderToday = () => {
    if (mobile) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {renderFocusQueue()}
        </div>
      );
    }
    // Desktop: side-by-side tabbed panel (left) + Task Queue (right)
    return (
      <div style={{ display: 'flex', gap: 20, height: '100%' }}>
        <div style={{ width: '38%', minWidth: 280, background: c.card, borderRadius: 14, border: '1px solid ' + c.bdr, padding: 16, display: 'flex', flexDirection: 'column' }}>
          {renderLeftPanel()}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {renderFocusQueue()}
        </div>
      </div>
    );
  };

  // ─── PAGE: ALL TASKS (V8: Status filter tabs) ─────────────
  const renderAllTasks = () => {
    const todoCount = tasks.filter(t => !t.done && (t.status || 'todo') === 'todo').length;
    const ipCount = tasks.filter(t => !t.done && t.status === 'in_progress').length;
    const doneCount = done.length;
    const getFilteredByStatus = () => {
      if (statusFilter === 'todo') return tasks.filter(t => !t.done && (t.status || 'todo') === 'todo');
      if (statusFilter === 'in_progress') return tasks.filter(t => !t.done && t.status === 'in_progress');
      if (statusFilter === 'done') return done;
      return tasks.filter(t => !t.done);
    };
    const filtered = getFilteredByStatus()
      .filter((t) => filterCat === 'All' || t.cat === filterCat)
      .filter((t) => !searchQ || t.title.toLowerCase().includes(searchQ.toLowerCase()))
      .sort((a, b) => { const d = score(b) - score(a); if (d !== 0) return d; const dA = daysUntilDue(a), dB = daysUntilDue(b); if (dA !== null && dB !== null) { const dd = dA - dB; if (dd !== 0) return dd; } if (dA !== null) return -1; if (dB !== null) return 1; return a.id - b.id; });
    return (
      <div style={{ overflowY: 'auto', height: '100%', padding: '0 4px' }}>
        {/* V8: Status tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: c.card, borderRadius: 10, padding: 4, border: '1px solid ' + c.bdr }}>
          {[
            { id: 'todo', label: todoCount + ' To Do' },
            { id: 'in_progress', label: ipCount + ' In Progress' },
            { id: 'done', label: doneCount + ' Done' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setStatusFilter(tab.id)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: statusFilter === tab.id ? c.acc + '18' : 'transparent', color: statusFilter === tab.id ? c.acc : c.sub, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>{tab.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: c.card, border: '1px solid ' + c.bdr, borderRadius: 8, padding: '6px 10px' }}>
            <Search size={14} color={c.sub} />
            <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search tasks..." style={{ flex: 1, background: 'transparent', border: 'none', color: c.txt, fontSize: 13, outline: 'none' }} />
            {searchQ && <button onClick={() => setSearchQ('')} style={{ background: 'transparent', border: 'none', color: c.sub, cursor: 'pointer', padding: 0 }}><X size={13} /></button>}
          </div>
          <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}><Plus size={14} /> Add</button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {['All', ...cats].map((cat) => <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid ' + (filterCat === cat ? c.acc : c.bdr), background: filterCat === cat ? c.acc + '18' : 'transparent', color: filterCat === cat ? c.acc : c.sub, fontSize: 11, cursor: 'pointer' }}>{cat !== 'All' && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: catColors[cat], marginRight: 4 }} />}{cat}</button>)}
        </div>
        {filtered.map((t) => renderTask(t, { drag: true }))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: c.sub }}>No tasks match filters.</div>}
      </div>
    );
  };

  // ─── PAGE: ARCHIVE ───────────────────────────────────────
  const renderArchive = () => (
    <div style={{ overflowY: 'auto', height: '100%', padding: '0 4px' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[{ label: 'Completed', value: done.length, icon: Check, color: c.ok }, { label: 'Time Saved', value: fmt(done.reduce((s, t) => s + t.time, 0)), icon: Clock, color: c.acc }, { label: 'Active', value: active.length, icon: Target, color: c.warn }].map((s) => <div key={s.label} style={{ flex: 1, background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}><s.icon size={18} color={s.color} style={{ marginBottom: 6 }} /><div style={{ fontSize: 20, fontWeight: 700, color: c.txt }}>{s.value}</div><div style={{ fontSize: 11, color: c.sub }}>{s.label}</div></div>)}
      </div>
      {/* Category chart */}
      <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: c.txt, marginBottom: 12 }}>By Category</div>
        {cats.map((cat) => {
          const catCount = done.filter(t => t.cat === cat).length;
          const maxC = Math.max(...cats.map(c2 => done.filter(t => t.cat === c2).length), 1);
          return <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><span style={{ fontSize: 12, color: c.txt, width: 70 }}>{cat}</span><div style={{ flex: 1, height: 8, background: c.bdr, borderRadius: 4, overflow: 'hidden' }}><div style={{ width: (catCount / maxC) * 100 + '%', height: '100%', background: catColors[cat], borderRadius: 4 }} /></div><span style={{ fontSize: 12, color: c.sub, width: 20, textAlign: 'right' }}>{catCount}</span></div>;
        })}
      </div>
      {/* Rolled over */}
      {(() => { const rolledOver = tasks.filter((t) => !t.done && t.age >= 5).sort((a, b) => b.age - a.age).slice(0, 5); return rolledOver.length > 0 ? <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: 16, marginBottom: 16 }}><div style={{ fontSize: 13, fontWeight: 600, color: c.txt, marginBottom: 10 }}>Rolled Over</div>{rolledOver.map((t) => <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid ' + c.bdr }}><span style={{ fontSize: 12, color: c.txt }}>{t.title}</span><span style={{ fontSize: 11, color: t.age >= 10 ? c.danger : c.warn }}>{t.age}d old</span></div>)}</div> : null; })()}
      {done.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: c.sub }}>No completed tasks yet.</div>}
      {done.map((t) => <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: c.card, border: '1px solid ' + c.bdr, marginBottom: 6, opacity: 0.6 }}><Check size={14} color={c.ok} /><span style={{ fontSize: 13, color: c.sub, textDecoration: 'line-through', flex: 1 }}>{t.title}</span><span style={{ fontSize: 10, color: catColors[t.cat], background: catColors[t.cat] + '18', padding: '1px 6px', borderRadius: 4 }}>{t.cat}</span></div>)}
    </div>
  );

  // ─── PAGE: SETTINGS (V8: Simplified single-page) ──────────
  const renderSettings = () => (
    <div style={{ overflowY: 'auto', height: '100%', padding: '0 4px' }}>
      {/* About Me card */}
      <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: c.acc + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} color={c.acc} /></div>
          <div style={{ fontSize: 15, fontWeight: 600, color: c.txt }}>About Me</div>
        </div>
        <textarea value={userCtx.aboutMe} onChange={(e) => setUserCtx((p) => ({ ...p, aboutMe: e.target.value }))} placeholder="Tell the AI who you are, what you do, and how you work best..." style={{ width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 13, resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', fontFamily: 'inherit' }} />
      </div>

      {/* Life Goals card */}
      <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2EA043' + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={18} color="#2EA043" /></div>
          <div style={{ fontSize: 15, fontWeight: 600, color: c.txt }}>Life Goals</div>
        </div>
        <textarea value={userCtx.lifeGoals} onChange={(e) => setUserCtx((p) => ({ ...p, lifeGoals: e.target.value }))} placeholder="What are your long-term life goals? These help the AI understand what really matters..." style={{ width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 13, resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', fontFamily: 'inherit' }} />
      </div>

      {/* Current Quarter Goals card */}
      <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#5B6CF0' + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={18} color="#5B6CF0" /></div>
          <div style={{ fontSize: 15, fontWeight: 600, color: c.txt }}>Current Quarter Goals</div>
        </div>
        <textarea value={userCtx.currentFocus} onChange={(e) => setUserCtx((p) => ({ ...p, currentFocus: e.target.value }))} placeholder="What are you focused on this quarter? The AI uses this to prioritize tasks that align with your current direction..." style={{ width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: '1px solid ' + c.bdr, background: c.bg, color: c.txt, fontSize: 13, resize: 'vertical', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', fontFamily: 'inherit' }} />
      </div>

      {/* Priority categories */}
      <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: c.txt, marginBottom: 8 }}>Priority Categories (+15% score boost)</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {cats.map((cat) => <button key={cat} onClick={() => setUserCtx((p) => ({ ...p, boostCats: p.boostCats.includes(cat) ? p.boostCats.filter((x) => x !== cat) : [...p.boostCats, cat] }))} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid ' + (userCtx.boostCats.includes(cat) ? catColors[cat] : c.bdr), background: userCtx.boostCats.includes(cat) ? catColors[cat] + '18' : 'transparent', color: userCtx.boostCats.includes(cat) ? catColors[cat] : c.sub, fontSize: 12, cursor: 'pointer' }}>{cat}</button>)}
        </div>
      </div>

      {/* Save button */}
      <button onClick={() => { setCtxSaved(true); setTimeout(() => setCtxSaved(false), 2000); }} style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: c.acc, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{ctxSaved ? 'Saved!' : 'Save Context'}</button>
    </div>
  );

  // ─── ROUTING ─────────────────────────────────────────────
  const pages = { today: renderToday, all: renderAllTasks, archive: renderArchive, settings: renderSettings };
  const pageLabel = { today: 'Focus', all: 'All Tasks', archive: 'Archive', settings: 'Settings' };

  // ─── MAIN RENDER ─────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #F0883E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: c.bg, color: c.txt, overflow: 'hidden' }}>
      {/* ── V8 Sidebar: expanded with text labels ── */}
      {!mobile && (
        <div style={{ width: 200, background: c.side, borderRight: '1px solid ' + c.bdr, display: 'flex', flexDirection: 'column', paddingTop: 12, flexShrink: 0, backgroundImage: dark === 'dark' ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'none' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 16px', marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: c.acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={18} color="#fff" /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: c.txt }}>TaskBuddy</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: c.txt }}>{String.fromCodePoint(0x1F525)}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c.acc }}>{streak}</span>
            </div>
          </div>
          {/* Nav items */}
          {navItems.map((n) => (
            <button key={n.id} onClick={() => { setPage(n.id); setAiReview(null); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: 'none', background: page === n.id ? c.acc + '15' : 'transparent', color: page === n.id ? c.acc : c.sub, fontSize: 13, fontWeight: page === n.id ? 600 : 400, cursor: 'pointer', borderRadius: 8, margin: '0 8px 2px', textAlign: 'left', transition: 'all 0.15s ease' }}>
              <n.icon size={18} />
              <span>{n.label}</span>
            </button>
          ))}

          {/* Spacer + Dark mode toggle at bottom */}
          <div style={{ marginTop: 'auto', padding: '8px 8px 12px' }}>
            <button onClick={() => setDark(dark === 'light' ? 'dark' : 'light')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 8, border: 'none', background: 'transparent', color: c.sub, fontSize: 13, cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s' }}>
              {dark === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{dark === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: mobile ? 56 : 0 }}>
        {/* Header bar \u2014simplified for V8 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: mobile ? '8px 12px' : '10px 24px', borderBottom: '1px solid ' + c.bdr, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: mobile ? 15 : 17, fontWeight: 700, color: c.txt }}>{pageLabel[page]}</span>
            <span style={{ fontSize: 12, color: c.sub, background: c.bdr + '60', padding: '2px 8px', borderRadius: 10 }}>{active.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {mobile && <button onClick={() => sendMsg('review my tasks')} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Sparkles size={13} /> Review</button>}
          </div>
        </div>
        <div style={{ flex: 1, padding: mobile ? '12px' : '20px 24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {pages[page]()}
        </div>
      </div>

      {/* ── Mobile: AI Panel toggle ── */}
      {mobile && (
        <>
          {/* Floating AI button */}
          <button onClick={() => {
            // Toggle mobile AI chat overlay
            const el = document.getElementById('mobileAiPanel');
            if (el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
          }} style={{ position: 'fixed', bottom: 70, right: 16, width: 48, height: 48, borderRadius: '50%', background: c.acc, border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 45 }}><Brain size={22} /></button>
          {/* Mobile AI panel (hidden by default) */}
          <div id="mobileAiPanel" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: c.bg, zIndex: 50, flexDirection: 'column', padding: 16 }}>
            <button onClick={() => { document.getElementById('mobileAiPanel').style.display = 'none'; }} style={{ alignSelf: 'flex-end', background: 'transparent', border: 'none', color: c.sub, cursor: 'pointer', marginBottom: 8 }}><X size={18} /></button>
            {renderAiChat()}
          </div>
        </>
      )}

      {/* ── Mobile Bottom Nav ── */}
      {mobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 56, background: c.side, borderTop: '1px solid ' + c.bdr, display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 40 }}>
          {navItems.map((n) => <button key={n.id} onClick={() => { setPage(n.id); setAiReview(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'transparent', border: 'none', color: page === n.id ? c.acc : c.sub, cursor: 'pointer', padding: '4px 0' }}><n.icon size={20} /><span style={{ fontSize: 9 }}>{n.label}</span></button>)}
        </div>
      )}

      {/* ── Add Task Modal ── */}
      {renderAddModal()}

      {/* V8.3: Undo completion toast */}
      {undoTask && (
        <div style={{ position: 'fixed', bottom: mobile ? 70 : 24, left: '50%', transform: 'translateX(-50%)', background: c.card, border: '1px solid ' + c.bdr, borderRadius: 12, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 90, animation: 'fadeSlide 0.3s ease' }}>
          <Check size={14} color={c.ok} />
          <span style={{ fontSize: 13, color: c.txt }}>Task completed</span>
          <button onClick={() => undoComplete(undoTask)} style={{ fontSize: 12, fontWeight: 600, color: c.acc, background: 'transparent', border: '1px solid ' + c.acc, borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>Undo</button>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes cp0 { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(28px, -35px) scale(0); opacity:0; } }
        @keyframes cp1 { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(-24px, -28px) scale(0); opacity:0; } }
        @keyframes cp2 { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(32px, 14px) scale(0); opacity:0; } }
        @keyframes cp3 { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(-8px, 34px) scale(0); opacity:0; } }
        @keyframes cp4 { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(20px, -40px) scale(0); opacity:0; } }
        @keyframes cp5 { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(-30px, 8px) scale(0); opacity:0; } }
        @keyframes cp6 { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(14px, 28px) scale(0); opacity:0; } }
        @keyframes cp7 { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(-20px, -22px) scale(0); opacity:0; } }
        @keyframes taskSlideOut { 0% { opacity:1; transform:translateX(0); } 60% { opacity:1; transform:translateX(0); } 100% { opacity:0; transform:translateX(80px); } }
        @keyframes checkPop { 0% { transform:scale(0); } 50% { transform:scale(1.3); } 100% { transform:scale(1); } }
        @keyframes micPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(229,83,75,0.4); } 50% { box-shadow: 0 0 0 8px rgba(229,83,75,0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
        @keyframes loading { 0% { width: 0%; } 50% { width: 80%; } 100% { width: 100%; } }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${c.acc}; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: ${c.acc}; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}
