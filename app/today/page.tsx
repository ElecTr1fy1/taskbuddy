'use client';

import React, { useState, useEffect } from 'react';
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
    notes: 'Process through Gusto. Verify hours for part-time team members.', link: 'https://app.gusto.com', aiReason: 'Hard deadline — team depends on this. Quick to execute.',
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
  { key: 'lowEnergy', label: 'Low Energy', icon: '🔋' },
  { key: '30min', label: '30 Min', icon: '⏱️' },
  { key: 'deepFocus', label: 'Deep Focus', icon: '🎯' },
  { key: 'quickWins', label: 'Quick Wins', icon: '⚡' },
];
// V8: Updated nav — removed Review from main nav, renamed Today→Focus
const navItems = [
  { id: 'today', icon: LayoutDashboard, label: 'Focus' },
  { id: 'all', icon: ListTodo, label: 'All Tasks' },
  { id: 'archive', icon: Archive, label: 'Archive' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];
// V8: Updated AI suggestions (Lovable-inspired)
const aiSuggestions = [
  'I have 2 hours of deep work time',
  '30 min between meetings, quick wins',
  "I'm low energy, easy tasks please",
  "What's the most impactful thing right now?",
  'Reprioritize — my focus shifted to marketing',
];

export default function TaskBuddyV8() {
  const router = useRouter();
  const user = { email: 'danielm@tanaorjewelry.com' };
  const authLoading = false;

  const [dark, setDark] = useState('light');
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
  // V8.1: Left panel mode — 'chat' or 'review'
  const [leftPanel, setLeftPanel] = useState('chat');
  // V8: Add Task modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', cat: 'Business', time: 30, urgency: 5, impact: 5, confidence: 7, ease: 5, blocking: 5, delegatable: false, dueDate: '', deadlineType: 'soft' });
  // V8: All Tasks status filter
  const [statusFilter, setStatusFilter] = useState('todo');
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

  // ─── THEME ────────────────────────────────────────────────
  const themes = {
    light: { bg: '#F6F8FA', card: '#FFFFFF', card2: '#F9FAFB', bdr: '#E1E4E8', txt: '#24292E', sub: '#57606A', acc: '#E8732A', ok: '#1A7F37', side: '#FFFFFF', doNow: 'rgba(232,115,42,0.06)', warn: '#D4643B', danger: '#CF222E', briefBg: 'rgba(232,115,42,0.04)' },
    warm: { bg: '#FAF8F5', card: '#FFFDF9', card2: '#FBF9F6', bdr: '#E8E3DA', txt: '#3D3929', sub: '#7A7265', acc: '#C47B3B', ok: '#558B2F', side: '#FFFDF9', doNow: 'rgba(196,123,59,0.06)', warn: '#C47B3B', danger: '#C62828', briefBg: 'rgba(196,123,59,0.04)' },
    dark: { bg: '#0F1117', card: '#1A1B23', card2: '#1E1F28', bdr: '#2D333B', txt: '#C9D1D9', sub: '#8B949E', acc: '#F0883E', ok: '#3FB950', side: '#0D0E14', doNow: 'rgba(240,136,62,0.08)', warn: '#F0883E', danger: '#F85149', briefBg: 'rgba(240,136,62,0.05)' },
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
    let a = tasks.filter((t) => !t.done).sort((a, b) => score(b) - score(a));
    if (activeCtx === 'lowEnergy') a = a.filter((t) => t.effort <= 5).sort((x, y) => x.effort - y.effort);
    else if (activeCtx === '30min') a = a.filter((t) => t.time <= 30);
    else if (activeCtx === 'deepFocus') a = a.filter((t) => t.impact >= 7);
    else if (activeCtx === 'quickWins') a = a.filter((t) => t.effort <= 3 && t.time <= 20);
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
  const complete = (id) => { playCompletionSound(); setCelebrating(id); setCelPhase('confetti'); setTimeout(() => setCelPhase('slideout'), 600); setTimeout(() => { setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: true, status: 'done' } : t))); setCelebrating(null); setCelPhase(null); }, 1400); };

  // ─── AI TASK INSIGHT ──────────────────────────────────────
  const getTaskInsight = (t) => {
    const s = score(t);
    const tips = [];
    let intro = '**' + t.title + '** — Priority score: ' + s + '/100\n\n';
    if (t.notes) intro += '\u{1F4DD} *' + t.notes + '*\n\n';
    if (t.dueDate) {
      const d = Math.ceil((new Date(t.dueDate) - new Date()) / 86400000);
      if (d < 0) tips.push('\u{1F534} This is **' + Math.abs(d) + ' days overdue**. Do it now or reschedule with a clear new date.');
      else if (d === 0) tips.push('\u{1F534} **Due today.** Block the next ' + (t.time < 60 ? t.time + ' minutes' : Math.round(t.time/60) + ' hours') + ' and knock this out.');
      else if (d === 1) tips.push('\u{1F7E1} Due **tomorrow**. Start today if it takes more than ' + Math.round(t.time/2) + 'm.');
      else tips.push('\u{1F4C5} Due in **' + d + ' days**. You have time, but don\'t let it slip.');
    }
    if (t.effort >= 7) tips.push('\u{1F4AA} High effort — schedule during your **peak energy** hours.');
    if (t.time >= 90) tips.push('\u{23F0} ' + Math.round(t.time/60) + 'h+ task. Break into **2-3 focused sessions**.');
    if (t.time <= 20 && t.effort <= 3) tips.push('\u{26A1} Quick win — just **do it now** in under 20 minutes.');
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
      notes: newTask.description, link: '', aiReason: 'New task — AI will analyze on next review.',
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
    setTasks((prev) => [...prev, { id: Date.now(), title: p.title, cat: 'Work', impact: 5, urgency: 5, effort: 5, time: p.time, age: 0, done: false, status: 'todo', notes: '', link: '', aiReason: 'New task — AI will analyze on next review.', dueDate: p.dueDate, deadlineType: p.deadlineType, confidence: 7, subtasks: [] }]);
    setQuickAdd('');
  };
  const toggleSubtask = (taskId, subId) => { setTasks((p) => p.map((t) => t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => s.id === subId ? { ...s, done: !s.done } : s) } : t)); };
  const addSubtask = (taskId) => { if (!subInput.trim()) return; setTasks((p) => p.map((t) => t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: Date.now(), title: subInput.trim(), done: false }] } : t)); setSubInput(''); };

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
        if (t.age >= 7) u += ' This task has been sitting for ' + t.age + ' days — consider breaking it down or delegating.';
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
        { emoji: '⏱️', title: 'Time Analysis', body: 'Your active tasks total ' + fmt(totalMin) + '. Hard deadlines this week: ' + fmt(hardMin) + ' (' + hardTasks.length + ' tasks). ' + (hardMin <= 120 ? 'Easily handled — focus your energy on high-impact deep work.' : 'Significant deadline load — prioritize these first.') },
        ...(neglectedCat ? [{ emoji: '🔄', title: 'Category Blind Spot', body: 'You haven\'t completed any ' + neglectedCat + ' tasks recently. ' + (neglectedCat === 'Health' ? 'Your health fuels everything else. Consider scheduling "Morning workout" as a non-negotiable.' : 'Consider batching a ' + neglectedCat + ' task today for balance.') }] : []),
        ...(bigTasks.length > 0 ? [{ emoji: '🧩', title: 'Break It Down', body: '"' + bigTasks[0].title + '" is high effort with no subtasks. Breaking it into 3-4 smaller steps makes it less daunting and easier to start.' }] : []),
        { emoji: '📊', title: 'Category Balance', body: Object.entries(catDist).map(([k, v]) => k + ': ' + v).join(' · ') + '. ' + (catDist['Business'] > active.length * 0.6 ? 'Heavy on Business tasks — schedule a Personal task for mental reset.' : 'Good category distribution.') },
        { emoji: '🎯', title: 'Focus Recommendation', body: sorted[0] ? 'Your #1 priority is "' + sorted[0].title + '". ' + (sorted[0].time >= 60 ? 'Block 2 uninterrupted hours for this. Close Slack, silence notifications.' : 'This is quick — knock it out first to build momentum.') : 'No active tasks!' },
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

  // ─── AI CHAT ──────────────────────────────────────────────
  const sendMsg = async (text) => {
    if (!text.trim()) return;
    setMsgs((p) => [...p, { role: 'user', text }]);
    setAiInput('');
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversation_history: msgs.map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.text })) }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setMsgs((p) => [...p, { role: 'ai', text: data.response }]);
    } catch (err) {
      setMsgs((p) => [...p, { role: 'ai', text: 'Sorry, I encountered an error: ' + (err.message || 'Please try again.') }]);
    }
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

  // ─── RENDER: DETAIL (V8: with scoring dimension badges) ──
  const renderDetail = (t) => (
    <div style={{ padding: '12px 16px 16px', borderTop: '1px solid ' + c.bdr, background: c.card2 }}>
      {t.aiReason && <div style={{ display: 'flex', gap: 8, marginBottom: 12, padding: '8px 10px', borderRadius: 6, background: c.briefBg }}><Sparkles size={14} color={c.acc} style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ fontSize: 12, color: c.sub, fontStyle: 'italic', lineHeight: 1.5 }}>{t.aiReason}</span></div>}
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
      <button onClick={(e) => { e.stopPropagation(); sendTaskInsight(t); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid ' + c.acc + '40', background: c.acc + '10', color: c.acc, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: 10, width: '100%', justifyContent: 'center' }}><Sparkles size={14} /> Get AI tips & breakdown</button>
      <button onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: c.danger, fontSize: 12, cursor: 'pointer', padding: '4px 0' }}><Trash2 size={13} /> Delete task</button>
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
        style={{ borderRadius: 12, border: large ? 'none' : '1px solid ' + c.bdr, background: large ? 'transparent' : c.card, marginBottom: 8, opacity: (isCelebrating && celPhase === 'slideout') ? 0 : isDragging ? 0.4 : dim ? 0.6 : 1, cursor: drag ? 'grab' : 'default', transition: isCelebrating ? 'none' : 'opacity 0.3s ease, transform 0.3s ease', boxShadow: large ? 'none' : '0 1px 3px rgba(0,0,0,0.06)', overflow: 'visible', animation: (isCelebrating && celPhase === 'slideout') ? 'taskSlideOut 0.8s ease forwards' : 'none', transform: isDragging ? 'scale(0.98)' : 'translateX(0)', borderTop: dragOverId === t.id && dragId !== t.id ? '3px solid ' + c.acc : undefined }}>
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
              <div style={{ minWidth: 44, height: 28, borderRadius: 8, background: scoreColor + '18', border: '1px solid ' + scoreColor + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
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
        <div style={{ display: 'flex', gap: 4, m4, display: 'block' }}>Est. Time (min)</label>
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
          <button onClick={addTaskFromModal} disabled={!newTask.title.trim()} style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: newTask.title.trim() ? c.acc : c.bdr, color: '#fff', fontSize: 14, fontWeight: 600, cursor: newTask.title.trim() ? 'pointer' : 'default' }}>Add Task</button>
        </div>
      </div>
    );
  };

  // ─── PAGE: FOCUS (V8: Task queue only — AI is in left panel) ──
  const renderFocusQueue = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: c.txt }}>Focus Session</span>
          <span style={{ fontSize: 11, color: c.sub, background: c.bdr + '60', padding: '2px 8px', borderRadius: 10 }}>{active.length} tasks</span>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Plus size={14} /> Add Task</button>
      </div>
      {/* Context chips */}
      <div style={{ display: 'flex.cat}</span>
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

  // ─── ADD TASK MODAL (V8: Lovable-inspired) ────────────────
  const renderAddModal = () => {
    if (!showAddModal) return null;
    const sliderStyle = (val) => ({
      width: '100%', height: 6, appearance: 'none', WebkitAppearance: 'none', borderRadius: 3,
      background: `linear-gradient(to right, ${c.acc} ${val * 10}%, ${c.bdr} ${val * 10}%)`,
      outline: 'none', cursor: 'pointer',
    });
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowAddModal(false)}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: c.card, borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto', padding: 24, border: '1px solid ' + c.bdr, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: c.txt, margin: 0 }}>Add New Task</h2>
            <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: c.sub, cursor: 'pointer' }}><X size={18} /></button>
          </div>

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
          <button onClick={aiAutoScore} disabled={!newTask.title.trim()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, border: '1px solid ' + c.acc + '40', background: c.acc + '10', color: c.acc, fontSize: 13, fontWeight: 600, cursor: newTask.title.trim() ? 'pointer' : 'default', marginBottom: 20, width: '100%', justifyContent: 'center', opacity: newTask.title.trim() ? 1 : 0.5 }}><Sparkles size={16} /> AI Auto-Score</button>

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
          <button onClick={addTaskFromModal} disabled={!newTask.title.trim()} style={{ width: '100%', padding: '12px 0', borderRadius: 10, border: 'none', background: newTask.title.trim() ? c.acc : c.bdr, color: '#fff', fontSize: 14, fontWeight: 600, cursor: newTask.title.trim() ? 'pointer' : 'default' }}>Add Task</button>
        </div>
      </div>
    );
  };

  // ─── PAGE: FOCUS (V8: Task queue only — AI is in left panel) ──
  const renderFocusQueue = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: c.txt }}>Focus Session</span>
          <span style={{ fontSize: 11, color: c.sub, background: c.bdr + '60', padding: '2px 8px', borderRadius: 10 }}>{active.length} tasks</span>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Plus size={14} /> Add Task</button>
      </div>
      {/* Context chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {chipDefs.map((ch) => <button key={ch.key} onClick={() => setActiveCtx(activeCtx === ch.key ? null : ch.key)} style={{ padding: '5px 10px', borderRadius: 20, border: '1px solid ' + (activeCtx === ch.key ? c.acc : c.bdr), background: activeCtx === ch.key ? c.acc + '18' : 'transparent', color: activeCtx === ch.key ? c.acc : c.sub, fontSize: 11, cursor: 'pointer' }}>{ch.icon} {ch.label}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 2px' }}>
        {topTask && <div style={{ background: c.doNow, border: '2px solid ' + c.acc, borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}><div style={{ fontSize: 11, fontWeight: 700, color: c.acc, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={14} color={c.acc} /> Do Now</div>{renderTask(topTask, { large: true })}</div>}
        {upNext.length > 0 && <div style={{ marginBottom: 20 }}>{sectionHead('Up Next', upNext.length)}{upNext.map((t) => renderTask(t, { drag: true }))}</div>}
        {later.length > 0 && <div style={{ marginBottom: 20, opacity: 0.65 }}>{sectionHead('Later', later.length)}{later.map((t) => renderTask(t, { drag: true, dim: true }))}</div>}
        {done.length > 0 && <>
          <button onClick={() => setShowDone(!showDone)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: c.sub, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 16, marginBottom: 8, cursor: 'pointer' }}>{showDone ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Done ({done.length})</button>
          {showDone && done.map((t) => <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 8, background: c.card, border: '1px solid ' + c.bdr, marginBottom: 6, opacity: 0.5 }}><Check size={14} color={c.ok} /><span style={{ fontSize: 13, color: c.sub, textDecoration: 'line-through' }}>{t.title}</span></div>)}
        </>}
        {active.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: c.sub, fontSize: 14 }}>All caught up!</div>}
      </div>
    </div>
  );

  // ─── AI CHAT PANEL (V8: always visible on Focus page, left side) ──
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
            <div style={{ fontSize: 13, color: c.sub, marginBottom: 16, lineHeight: 1.6 }}>I can help you plan your focus session, reprioritize tasks, or give you a quick breakdown of what matters most right now.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {aiSuggestions.map((s) => <button key={s} onClick={() => sendMsg(s)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.card, color: c.txt, fontSize: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>{s}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}><div style={{ maxWidth: '88%', padding: '10px 14px', borderRadius: 12, background: m.role === 'user' ? c.acc : c.card, color: m.role === 'user' ? '#fff' : c.txt, fontSize: 12, lineHeight: 1.6, border: m.role === 'ai' ? '1px solid ' + c.bdr : 'none', whiteSpace: 'pre-wrap' }}>{m.text}</div></div>)}
      </div>
      {recording && <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F85149', animation: 'blink 1s infinite' }} />', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {chipDefs.map((ch) => <button key={ch.key} onClick={() => setActiveCtx(activeCtx === ch.key ? null : ch.key)} style={{ padding: '5px 10px', borderRadius: 20, border: '1px solid ' + (activeCtx === ch.key ? c.acc : c.bdr), background: activeCtx === ch.key ? c.acc + '18' : 'transparent', color: activeCtx === ch.key ? c.acc : c.sub, fontSize: 11, cursor: 'pointer' }}>{ch.icon} {ch.label}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 2px' }}>
        {topTask && <div style={{ background: c.doNow, border: '2px solid ' + c.acc, borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}><div style={{ fontSize: 11, fontWeight: 700, color: c.acc, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={14} color={c.acc} /> Do Now</div>{renderTask(topTask, { large: true })}</div>}
        {upNext.length > 0 && <div style={{ marginBottom: 20 }}>{sectionHead('Up Next', upNext.length)}{upNext.map((t) => renderTask(t, { drag: true }))}</div>}
        {later.length > 0 && <div style={{ marginBottom: 20, opacity: 0.65 }}>{sectionHead('Later', later.length)}{later.map((t) => renderTask(t, { drag: true, dim: true }))}</div>}
        {done.length > 0 && <>
          <button onClick={() => setShowDone(!showDone)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: c.sub, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 16, marginBottom: 8, cursor: 'pointer' }}>{showDone ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Done ({done.length})</button>
          {showDone && done.map((t) => <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 8, background: c.card, border: '1px solid ' + c.bdr, marginBottom: 6, opacity: 0.5 }}><Check size={14} color={c.ok} /><span style={{ fontSize: 13, color: c.sub, textDecoration: 'line-through' }}>{t.title}</span></div>)}
        </>}
        {active.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: c.sub, fontSize: 14 }}>All caught up!</div>}
      </div>
    </div>
  );

  // ─── AI CHAT PANEL (V8: always visible on Focus page, left side) ──
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
            <div style={{ fontSize: 13, color: c.sub, marginBottom: 16, lineHeight: 1.6 }}>I can help you plan your focus session, reprioritize tasks, or give you a quick breakdown of what matters most right now.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {aiSuggestions.map((s) => <button key={s} onClick={() => sendMsg(s)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.card, color: c.txt, fontSize: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>{s}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}><div style={{ maxWidth: '88%', padding: '10px 14px', borderRadius: 12, background: m.role === 'user' ? c.acc : c.card, color: m.role === 'user' ? '#fff' : c.txt, fontSize: 12, lineHeight: 1.6, border: m.role === 'ai' ? '1px solid ' + c.bdr : 'none', whiteSpace: 'pre-wrap' }}>{m.text}</div></div>)}
      </div>
      {recording && <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F85149', animation: 'blink 1s infinite' }} /><span style={{ fontSize: 12, color: c.danger }}>Recording... tap mic to stop</span></div>}
      <div style={{ borderTop: '1px solid ' + c.bdr, paddingTop: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea value={aiInput} onChange={(e) => { setAiInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(aiInput); } }} placeholder="Tell me your state..." rows={2} style={{ flex: 1, background: c.bg, border: '1px solid ' + c.bdr, borderRadius: 10, padding: '10px 14px', color: c.txt, fontSize: 13, outline: 'none', lineHeight: 1.5, minHeight: 44, maxHeight: 100, fontFamily: 'inherit', resize: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={() => setRecording(!recording)} style={{ width: 34, height: 34, borderRadius: '50%', border: recording ? 'none' : '1px solid ' + c.bdr, background: recording ? c.danger : c.card, color: recording ? '#fff' : c.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, animation: recording ? 'micPulse 1.5s infinite' : 'none' }}><Mic size={14} /></button>
            <button onClick={() => sendMsg(aiInput)} disabled={!aiInput.trim()} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: aiInput.trim() ? c.acc : c.bdr, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: aiInput.trim() ? 'pointer' : 'default', flexShrink: 0 }}><Send size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── LEFT PANEL: Tabbed Chat / Review ──────────────────────
  const renderLeftPanel = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 12, background: c.bg, borderRadius: 10, padding: 3, border: '1px solid ' + c.bdr }}>
        <button onClick={() => setLeftPanel('chat')} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: leftPanel === 'chat' ? c.card : 'transparent', color: leftPanel === 'chat' ? c.txt : c.sub, fontSize: 12, fontWeight: leftPanel === 'chat' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: leftPanel === 'chat' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}><Sparkles size={13} /> Chat</button>
        <button onClick={() => { setLeftPanel('review'); if (!aiReview && !reviewData) runAiReview(); }} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: leftPanel === 'review' ? c.card : 'transparent', color: leftPanel === 'review' ? c.acc : c.sub, fontSize: 12, fontWeight: leftPanel === 'review' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: leftPanel === 'review' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}><Brain size={13} /> Review</button>
      </div>
      {/* Panel content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {leftPanel === 'chat' ? renderAiChat() : renderAiReviewInline()}
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
        <Brain size={32} cnAiReview} style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: '1px solid ' + c.bdr, background: 'transparent', color: c.sub, fontSize: 11, cursor: 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Brain size={11} /> Re-run Review</button>
        </div>
      </div>
    );
  };

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
      .sort((a, b) => score(b) - score(a));
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
        <div style={{ width: 200, background: c.side, borderRight: '1px solid ' + c.bdr, display: 'flex', flexDirection: 'column', paddingTop: 12, flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 16px', marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: c.acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={18} color="#fff" /></div>
            <span style={{ fontSize: 15, fontWeight: 700, color: c.txt }}>TaskBuddy</span>
          </div>
          {/* Nav items */}
          {navItems.map((n) => (
            <button key={n.id} onClick={() => { setPage(n.id); setAiReview(null); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: 'none', background: page === n.id ? c.acc + '15' : 'transparent', color: page === n.id ? c.acc : c.sub, fontSize: 13, fontWeight: page === n.id ? 600 : 400, cursor: 'pointer', borderRadius: 8, margin: '0 8px 2px', textAlign: 'left' }}>
              <n.icon size={18} />
              <span>{n.label}</span>
            </button>
          ))}
          {/* AI Review button in sidebar — switches to review tab on Focus page */}
          <button onClick={() => { setPage('today'); setLeftPanel('review'); if (!aiReview && !reviewData) runAiReview(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', border: 'none', background: leftPanel === 'review' && page === 'today' ? c.acc + '15' : 'transparent', color: leftPanel === 'review' && page === 'today' ? c.acc : c.sub, fontSize: 13, fontWeight: leftPanel === 'review' && page === 'today' ? 600 : 400, cursor: 'pointer', borderRadius: 8, margin: '2px 8px', textAlign: 'left' }}>
            <Brain size={18} />
            <span>AI Review</span>
          </button>
          {/* Spacer + Dark mode toggle at bottom */}
          <div style={{ marginTop: 'auto', padding: '8px 8px 12px' }}>
            <button onClick={() => setDark(dark === 'light' ? 'warm' : dark === 'warm' ? 'dark' : 'light')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 8, border: 'none', background: 'transparent', color: c.sub, fontSize: 13, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              {dark === 'dark' ? <Sun size={18} /> : dark === 'warm' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{dark === 'light' ? 'Light Mode' : dark === 'warm' ? 'Warm Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: mobile ? 56 : 0 }}>
        {/* Header bar — simplified for V8 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: mobile ? '8px 12px' : '10px 24px', borderBottom: '1px solid ' + c.bdr, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: mobile ? 15 : 17, fontWeight: 700, color: c.txt }}>{pageLabel[page]}</span>
            <span style={{ fontSize: 12, color: c.sub, background: c.bdr + '60', padding: '2px 8px', borderRadius: 10 }}>{active.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {mobile && <button onClick={() => { runAiReview(); setAiReview('loading'); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Brain size={13} /> Review</button>}
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
