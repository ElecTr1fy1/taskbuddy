'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import { Check, Sparkles, ChevronDown, ChevronRight, ChevronLeft, Mic, Send, Sun, Moon, LayoutDashboard, ListTodo, Archive, Settings, Search, X, GripVertical, Clock, User, Target, Plus, ExternalLink, Trash2, BarChart3, AlertTriangle, Calendar, Circle, Zap, Brain } from 'lucide-react';

// ─── TASK DATA ────────────────────────────────────────────────
const tasks0 = [
  { id: 1, title: 'Research True Classic competitor ads', cat: 'Business', impact: 9, urgency: 8, effort: 5, time: 60, age: 4, done: false,
    notes: 'Look at their Facebook and YouTube ad creatives. Focus on hooks, offers, and CTAs.', link: 'https://www.facebook.com/ads/library', aiReason: 'High-impact competitive intel that directly affects your ad spend ROI.',
    dueDate: '2026-02-23', deadlineType: 'soft', subtasks: [{ id: 101, title: 'Pull Facebook ad library data', done: false }, { id: 102, title: 'Analyze top 5 video hooks', done: false }, { id: 103, title: 'Draft findings doc', done: false }] },
  { id: 2, title: 'Review Q1 revenue projections', cat: 'Business', impact: 8, urgency: 7, effort: 6, time: 90, age: 2, done: false,
    notes: 'Compare actuals vs forecast for Jan-Feb. Identify gaps before board meeting.', link: '', aiReason: 'Aligns with your goal of data-driven decisions. Board meeting is approaching.',
    dueDate: '2026-02-25', deadlineType: 'soft', subtasks: [] },
  { id: 3, title: 'Pay team salaries', cat: 'Business', impact: 6, urgency: 10, effort: 2, time: 15, age: 0, done: false,
    notes: 'Process through Gusto. Verify hours for part-time team members.', link: 'https://app.gusto.com', aiReason: 'Hard deadline — team depends on this. Quick to execute.',
    dueDate: '2026-02-22', deadlineType: 'hard', subtasks: [] },
  { id: 4, title: 'Prepare investor pitch deck', cat: 'Work', impact: 10, urgency: 6, effort: 8, time: 180, age: 7, done: false,
    notes: 'Use the Sequoia format. Include TAM/SAM/SOM, traction metrics, and team slide.', link: 'https://docs.google.com/presentation', aiReason: 'Your highest-impact task. Aligns with Series A goal. Consider deep-work blocks.',
    dueDate: null, deadlineType: null, subtasks: [{ id: 104, title: 'Draft narrative arc', done: true }, { id: 105, title: 'Build financial model slide', done: false }, { id: 106, title: 'Design team slide', done: false }, { id: 107, title: 'Rehearse 3x', done: false }] },
  { id: 5, title: 'Morning workout routine', cat: 'Health', impact: 7, urgency: 3, effort: 4, time: 45, age: 0, done: false,
    notes: 'Upper body + 20 min cardio. Gym opens at 6am.', link: '', aiReason: 'Consistent health habits fuel your productivity. You have been skipping this category.',
    dueDate: null, deadlineType: null, subtasks: [] },
  { id: 6, title: 'Call supplier about Q2 inventory', cat: 'Business', impact: 7, urgency: 7, effort: 3, time: 20, age: 3, done: false,
    notes: 'Confirm lead times for spring collection. Ask about bulk discount thresholds.', link: '', aiReason: 'Quick win with real business impact. 3 days overdue.',
    dueDate: '2026-02-20', deadlineType: 'soft', subtasks: [] },
  { id: 7, title: 'Update LinkedIn profile', cat: 'Personal', impact: 4, urgency: 2, effort: 3, time: 30, age: 14, done: false,
    notes: 'Add recent achievements, update headline, refresh headshot.', link: 'https://linkedin.com', aiReason: 'Low urgency but 14 days old. Consider batching with other personal tasks.',
    dueDate: null, deadlineType: null, subtasks: [] },
  { id: 8, title: 'Send Tanaor weekly email blast', cat: 'Business', impact: 7, urgency: 8, effort: 4, time: 40, age: 1, done: false,
    notes: 'Feature new arrivals. Segment: engaged buyers.', link: 'https://klaviyo.com', aiReason: 'Time-sensitive marketing. Revenue-driving activity with clear deadline.',
    dueDate: '2026-02-21', deadlineType: 'hard', subtasks: [] },
  { id: 9, title: 'Quarterly tax document prep', cat: 'Work', impact: 6, urgency: 5, effort: 7, time: 120, age: 8, done: false,
    notes: 'Gather receipts, categorize expenses, send to accountant.', link: '', aiReason: '8 days old and high effort. Break this into smaller chunks.',
    dueDate: '2026-03-15', deadlineType: 'hard', subtasks: [] },
  { id: 10, title: 'Plan weekend trip with family', cat: 'Personal', impact: 5, urgency: 3, effort: 3, time: 25, age: 0, done: false,
    notes: 'Look at Airbnb for 2-night getaway. Budget: $400.', link: 'https://airbnb.com', aiReason: 'Personal recharge supports long-term performance.',
    dueDate: null, deadlineType: null, subtasks: [] },
  { id: 11, title: 'Website redesign brief', cat: 'Business', impact: 8, urgency: 4, effort: 6, time: 60, age: 14, done: false,
    notes: 'Write creative brief for agency. Include brand guidelines and conversion goals.', link: '', aiReason: '14 days without progress. High impact but keeps getting pushed.',
    dueDate: null, deadlineType: null, subtasks: [] },
  { id: 12, title: 'Read "Zero to One" chapter 5-7', cat: 'Personal', impact: 4, urgency: 1, effort: 2, time: 30, age: 0, done: false,
    notes: 'Focus on the monopoly vs competition chapter.', link: '', aiReason: 'Quick low-effort personal development. Good for low-energy moments.',
    dueDate: null, deadlineType: null, subtasks: [] },
];

const catColors = { Work: '#5B6CF0', Business: '#D4643B', Health: '#2EA043', Personal: '#8B5CF6' };
const chipDefs = [
  { key: 'lowEnergy', label: 'Low Energy', icon: '🔋' },
  { key: '30min', label: '30 Min', icon: '⏱️' },
  { key: 'deepFocus', label: 'Deep Focus', icon: '🎯' },
  { key: 'quickWins', label: 'Quick Wins', icon: '⚡' },
];
const navItems = [
  { id: 'today', icon: LayoutDashboard, label: 'Today' },
  { id: 'all', icon: ListTodo, label: 'All Tasks' },
  { id: 'review', icon: BarChart3, label: 'Review' },
  { id: 'archive', icon: Archive, label: 'Archive' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];
const aiSuggestions = ['Plan my day', 'I have 45 minutes', "I'm low energy", "What's falling behind?"];

export default function TaskBuddyV7() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const [dark, setDark] = useState(true);
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
  const [settingsTab, setSettingsTab] = useState('context');
  const [ctxSaved, setCtxSaved] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [quickAdd, setQuickAdd] = useState('');
  const [briefingOpen, setBriefingOpen] = useState(true);
  const [subInput, setSubInput] = useState('');
  const [mobile, setMobile] = useState(false);
  const [aiReview, setAiReview] = useState(null);
  const [reviewTab, setReviewTab] = useState('priority');
  const [reviewData, setReviewData] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('');
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
  const c = dark
    ? { bg: '#0F1117', card: '#1A1B23', card2: '#1E1F28', bdr: '#2D333B', txt: '#C9D1D9', sub: '#8B949E', acc: '#7C8CF8', ok: '#3FB950', side: '#0D0E14', doNow: 'rgba(124,140,248,0.08)', warn: '#F0883E', danger: '#F85149', briefBg: 'rgba(124,140,248,0.05)' }
    : { bg: '#F6F8FA', card: '#FFFFFF', card2: '#F9FAFB', bdr: '#E1E4E8', txt: '#24292E', sub: '#57606A', acc: '#5B6CF0', ok: '#1A7F37', side: '#FFFFFF', doNow: 'rgba(91,108,240,0.06)', warn: '#D4643B', danger: '#CF222E', briefBg: 'rgba(91,108,240,0.04)' };

  // ─── SCORING ──────────────────────────────────────────────
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysUntilDue = (t) => { if (!t.dueDate) return null; return Math.round((new Date(t.dueDate + 'T00:00:00') - today) / 86400000); };
  const score = (t) => {
    let s = Math.min(100, Math.round(((t.impact * 4 + t.urgency * 3 + (10 - t.effort) * 1.5) / 8.5) * 10 + t.age * 0.5));
    if (userCtx.boostCats.includes(t.cat)) s = Math.min(100, Math.round(s * 1.15));
    const d = daysUntilDue(t);
    if (d !== null && t.deadlineType === 'hard') { if (d < 0) s = 100; else if (d <= 1) s = Math.max(s, 98); else if (d <= 2) s = Math.max(s, 95); else if (d <= 5) s = Math.min(100, s + 30); }
    else if (d !== null && t.deadlineType === 'soft') { if (d < 0) s = Math.min(100, s + 5); else if (d <= 2) s = Math.min(100, s + 10); }
    return s;
  };
  const reasons = (t) => {
    const r = []; const d = daysUntilDue(t);
    if (d !== null && d < 0 && t.deadlineType === 'hard') r.push('🚨 OVERDUE ' + Math.abs(d) + 'd');
    else if (d !== null && d <= 1 && t.deadlineType === 'hard') r.push('🔴 Due tomorrow — hard');
    else if (d !== null && d <= 3 && t.deadlineType === 'hard') r.push('🔴 Due in ' + d + 'd — hard');
    else if (d !== null && d < 0) r.push('⏰ ' + Math.abs(d) + 'd overdue');
    else if (d !== null && d <= 3) r.push('🟡 Due in ' + d + 'd');
    if (t.impact >= 8) r.push('🎯 High impact');
    if (t.urgency >= 8) r.push('⏱️ Time sensitive');
    if (t.effort <= 3 && t.time <= 20) r.push('⚡ Quick win');
    if (t.age >= 3 && r.length < 2) r.push('⚠️ ' + t.age + 'd old');
    if (r.length === 0) r.push('📋 Scheduled');
    return r.slice(0, 2);
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

  // ─── ACTIONS ──────────────────────────────────────────────
  const complete = (id) => { setCelebrating(id); setTimeout(() => { setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: true } : t))); setCelebrating(null); }, 600); };
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
  const addTask = (input) => {
    if (!input.trim()) return;
    const p = parseQuickAdd(input);
    setTasks((prev) => [...prev, { id: Date.now(), title: p.title, cat: 'Work', impact: 5, urgency: 5, effort: 5, time: p.time, age: 0, done: false, notes: '', link: '', aiReason: 'New task — AI will analyze on next review.', dueDate: p.dueDate, deadlineType: p.deadlineType, subtasks: [] }]);
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
        if (t.subtasks.length > 0) { const done = t.subtasks.filter((s) => s.done).length; u += ' Progress: ' + done + '/' + t.subtasks.length + ' subtasks done.'; }
        if (t.age >= 7) u += ' This task has been sitting for ' + t.age + ' days — consider breaking it down or delegating.';
        understanding[t.id] = u;
      });
      const aiScores = {};
      sorted.forEach((t) => {
        let adj = score(t);
        if (t.subtasks.length > 0 && t.subtasks.some((s) => !s.done)) adj = Math.min(100, adj + 5);
        if (t.age >= 10) adj = Math.min(100, adj + 8);
        if (t.cat === 'Health' && !done.some((d) => d.cat === 'Health')) adj = Math.min(100, adj + 10);
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
  const sendMsg = (text) => {
    if (!text.trim()) return;
    setMsgs((p) => [...p, { role: 'user', text }]);
    setAiInput('');
    setTimeout(() => {
      let reply = 'Based on your goals and priorities, I recommend focusing on your highest-scored tasks first. Try the AI Review for a deep analysis.';
      const lo = text.toLowerCase();
      if (lo.includes('low energy')) reply = 'When energy is low, try the Low Energy filter. "Read Zero to One" and "Plan weekend trip" are both light tasks.';
      else if (lo.includes('45 min') || lo.includes('30 min')) reply = 'Try the 30 Min filter. "Call supplier" (20m) and "Plan weekend trip" (25m) both fit.';
      else if (lo.includes('falling behind') || lo.includes('behind')) reply = 'A few things need attention:\n• "Website redesign brief" — 14d old\n• "Quarterly tax prep" — 8d old\n• "Pitch deck" — 7d old\nI\'d prioritize the pitch deck for your Series A.';
      else if (lo.includes('plan my day') || lo.includes('plan')) {
        const hs = tasks.filter((t) => !t.done && t.deadlineType === 'hard' && daysUntilDue(t) !== null && daysUntilDue(t) <= 2);
        reply = 'Your optimal day:\n\n';
        if (hs.length > 0) reply += '🚨 FIRST:\n' + hs.map((t) => '• ' + t.title + ' (due ' + fmtDate(t.dueDate) + ')').join('\n') + '\n\n';
        reply += '🧠 Deep work: ' + (topTask ? topTask.title : 'Top task') + '\n⚡ Quick wins: Batch sub-30m tasks\n🌅 Wind down: Low-effort personal items';
      }
      setMsgs((p) => [...p, { role: 'ai', text: reply }]);
    }, 500);
  };

  // ─── DRAG ─────────────────────────────────────────────────
  const handleDragStart = (id) => setDragId(id);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (tid) => {
    if (!dragId || dragId === tid) return;
    setTasks((p) => { const a = [...p]; const fi = a.findIndex((t) => t.id === dragId); const ti = a.findIndex((t) => t.id === tid); const [m] = a.splice(fi, 1); a.splice(ti, 0, m); return a; });
    setDragId(null);
  };

  const confetti = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#F38181', '#AA96DA', '#95E1D3', '#FF9FF3', '#48DBFB'];

  // ─── RENDER: CHECKBOX ────────────────────────────────────
  const renderChk = (t) => (
    <button onClick={(e) => { e.stopPropagation(); complete(t.id); }} style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid ' + c.acc, background: t.done ? c.acc : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative', transition: 'all 0.2s' }}>
      {t.done && <Check size={12} color="#fff" />}
      {celebrating === t.id && confetti.map((col, i) => <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: col, animation: 'cp' + i + ' 0.6s ease-out forwards' }} />)}
    </button>
  );

  // ─── RENDER: DETAIL ──────────────────────────────────────
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[{ l: 'Impact', v: t.impact }, { l: 'Urgency', v: t.urgency }, { l: 'Effort', v: t.effort }, { l: 'Score', v: score(t) }].map((b) => <div key={b.l} style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 6, background: c.bg, border: '1px solid ' + c.bdr }}><div style={{ fontSize: 10, color: c.sub, marginBottom: 2 }}>{b.l}</div><div style={{ fontSize: 14, fontWeight: 700, color: b.l === 'Score' ? c.acc : c.txt }}>{b.v}</div></div>)}
      </div>
      <button onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: c.danger, fontSize: 12, cursor: 'pointer', padding: '4px 0' }}><Trash2 size={13} /> Delete task</button>
    </div>
  );

  // ─── RENDER: TASK CARD ───────────────────────────────────
  const renderTask = (t, opts = {}) => {
    const { large, drag, dim } = opts;
    const isExp = expanded === t.id, isDragging = dragId === t.id, d = daysUntilDue(t);
    const subDone = t.subtasks ? t.subtasks.filter((s) => s.done).length : 0, subTotal = t.subtasks ? t.subtasks.length : 0;
    return (
      <div key={t.id} draggable={drag} onDragStart={drag ? () => handleDragStart(t.id) : undefined} onDragOver={drag ? handleDragOver : undefined} onDrop={drag ? () => handleDrop(t.id) : undefined}
        style={{ borderRadius: 10, border: large ? '2px solid ' + c.acc : '1px solid ' + c.bdr, background: large ? c.doNow : c.card, marginBottom: 8, opacity: isDragging ? 0.4 : dim ? 0.6 : 1, cursor: drag ? 'grab' : 'default', transition: 'all 0.2s', boxShadow: large ? '0 2px 12px rgba(124,140,248,0.12)' : '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div onClick={() => setExpanded(isExp ? null : t.id)} style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 10, padding: large ? '14px 16px' : '10px 14px', cursor: 'pointer' }}>
          {drag && !mobile && <GripVertical size={14} color={c.sub} style={{ flexShrink: 0, opacity: 0.5 }} />}
          {renderChk(t)}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: large ? 15 : 14, fontWeight: large ? 600 : 500, color: c.txt, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: catColors[t.cat], background: catColors[t.cat] + '18', padding: '1px 6px', borderRadius: 4 }}>{t.cat}</span>
              {t.dueDate && <span style={{ fontSize: 10, fontWeight: 500, color: t.deadlineType === 'hard' ? c.danger : c.sub, display: 'flex', alignItems: 'center', gap: 2 }}><Calendar size={9} /> {fmtDate(t.dueDate)}{t.deadlineType === 'hard' && d !== null && d <= 2 && <AlertTriangle size={9} style={{ marginLeft: 2 }} />}</span>}
              {subTotal > 0 && <span style={{ fontSize: 10, color: subDone === subTotal ? c.ok : c.sub, display: 'flex', alignItems: 'center', gap: 3 }}><Circle size={8} fill={subDone === subTotal ? c.ok : 'transparent'} /> {subDone}/{subTotal}</span>}
              {reasons(t).map((r, i) => <span key={i} style={{ fontSize: 10, color: c.sub }}>{r}</span>)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {!mobile && <span style={{ fontSize: 11, color: c.sub, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} /> {fmt(t.time)}</span>}
            <ChevronRight size={14} color={c.sub} style={{ transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>
        </div>
        {isExp && renderDetail(t)}
      </div>
    );
  };

  // ─── BRIEFING ─────────────────────────────────────────────
  const renderBriefing = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const hardSoon = tasks.filter((t) => !t.done && t.deadlineType === 'hard' && daysUntilDue(t) !== null && daysUntilDue(t) <= 2 && daysUntilDue(t) >= 0);
    const hardOverdue = tasks.filter((t) => !t.done && t.deadlineType === 'hard' && daysUntilDue(t) !== null && daysUntilDue(t) < 0);
    const neglected = cats.filter((cat) => !done.some((t) => t.cat === cat));
    const pctDone = tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0;
    const r = 18, circ = 2 * Math.PI * r, offset = circ - (pctDone / 100) * circ;
    if (!briefingOpen) return <button onClick={() => setBriefingOpen(true)} style={{ background: c.briefBg, border: '1px solid ' + c.bdr, borderRadius: 8, padding: '6px 12px', color: c.acc, fontSize: 12, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={12} /> Daily briefing</button>;
    return (
      <div style={{ background: c.briefBg, border: '1px solid ' + c.bdr, borderRadius: 12, padding: mobile ? 12 : 16, marginBottom: 16, position: 'relative' }}>
        <button onClick={() => setBriefingOpen(false)} style={{ position: 'absolute', top: 8, right: 8, background: 'transparent', border: 'none', color: c.sub, cursor: 'pointer' }}><X size={14} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <svg width={44} height={44} style={{ transform: 'rotate(-90deg)' }}><circle cx={22} cy={22} r={r} fill="transparent" stroke={c.bdr} strokeWidth={3} /><circle cx={22} cy={22} r={r} fill="transparent" stroke={c.acc} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" /></svg>
          <div><div style={{ fontSize: 16, fontWeight: 600, color: c.txt }}>{greeting}, Daniel</div><div style={{ fontSize: 12, color: c.sub }}>{active.length} tasks to focus on today</div></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {hardOverdue.map((t) => <div key={t.id} style={{ fontSize: 12, color: c.danger, display: 'flex', alignItems: 'flex-start', gap: 6 }}><AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} /><span><strong>{t.title}</strong> is overdue — hard deadline.</span></div>)}
          {hardSoon.map((t) => <div key={t.id} style={{ fontSize: 12, color: c.warn, display: 'flex', alignItems: 'flex-start', gap: 6 }}><AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} /><span><strong>{t.title}</strong> due {daysUntilDue(t) === 0 ? 'today' : 'tomorrow'} — hard deadline.</span></div>)}
          {done.length > 0 && <div style={{ fontSize: 12, color: c.ok }}>You completed {done.length} tasks this week.</div>}
          {neglected.length > 0 && <div style={{ fontSize: 12, color: c.sub }}>No <strong>{neglected[0]}</strong> tasks completed recently — consider "{tasks.find((t) => !t.done && t.cat === neglected[0])?.title || 'one'}" today.</div>}
        </div>
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

  // ─── PAGE: TODAY ─────────────────────────────────────────
  const renderToday = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 4px' }}>
        {renderBriefing()}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {chipDefs.map((ch) => <button key={ch.key} onClick={() => setActiveCtx(activeCtx === ch.key ? null : ch.key)} style={{ padding: '5px 10px', borderRadius: 20, border: '1px solid ' + (activeCtx === ch.key ? c.acc : c.bdr), background: activeCtx === ch.key ? c.acc + '18' : 'transparent', color: activeCtx === ch.key ? c.acc : c.sub, fontSize: 11, cursor: 'pointer' }}>{ch.icon} {ch.label}</button>)}
        </div>
        {topTask && <>{sectionHead('Do Now', 1)}{renderTask(topTask, { large: true })}</>}
        {upNext.length > 0 && <>{sectionHead('Up Next', upNext.length)}{upNext.map((t) => renderTask(t, { drag: true }))}</>}
        {later.length > 0 && <>{sectionHead('Later', later.length)}{later.map((t) => renderTask(t, { drag: true, dim: true }))}</>}
        {done.length > 0 && <>
          <button onClick={() => setShowDone(!showDone)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: c.sub, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 16, marginBottom: 8, cursor: 'pointer' }}>{showDone ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Done ({done.length})</button>
          {showDone && done.map((t) => <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 8, background: c.card, border: '1px solid ' + c.bdr, marginBottom: 6, opacity: 0.5 }}><Check size={14} color={c.ok} /><span style={{ fontSize: 13, color: c.sub, textDecoration: 'line-through' }}>{t.title}</span></div>)}
        </>}
        {active.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: c.sub, fontSize: 14 }}>All caught up!</div>}
      </div>
      <div style={{ padding: '8px 0', borderTop: '1px solid ' + c.bdr, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Plus size={16} color={c.sub} />
        <input value={quickAdd} onChange={(e) => setQuickAdd(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addTask(quickAdd); }} placeholder='Add task... ("Call Bob tomorrow !hard 15m")' style={{ flex: 1, background: 'transparent', border: 'none', color: c.txt, fontSize: 13, outline: 'none' }} />
        {quickAdd && <button onClick={() => addTask(quickAdd)} style={{ background: c.acc, border: 'none', color: '#fff', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Add</button>}
      </div>
    </div>
  );

  // ─── PAGE: ALL TASKS ─────────────────────────────────────
  const renderAllTasks = () => {
    const filtered = tasks.filter((t) => !t.done).filter((t) => filterCat === 'All' || t.cat === filterCat).filter((t) => !searchQ || t.title.toLowerCase().includes(searchQ.toLowerCase())).sort((a, b) => score(b) - score(a));
    const high = filtered.filter((t) => score(t) >= 75), med = filtered.filter((t) => score(t) >= 50 && score(t) < 75), low = filtered.filter((t) => score(t) < 50);
    return (
      <div style={{ overflowY: 'auto', height: '100%', padding: '0 4px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: c.card, border: '1px solid ' + c.bdr, borderRadius: 8, padding: '6px 10px' }}><Search size={14} color={c.sub} /><input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search tasks..." style={{ flex: 1, background: 'transparent', border: 'none', color: c.txt, fontSize: 13, outline: 'none' }} />{searchQ && <button onClick={() => setSearchQ('')} style={{ background: 'transparent', border: 'none', color: c.sub, cursor: 'pointer', padding: 0 }}><X size={13} /></button>}</div></div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {['All', ...cats].map((cat) => <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid ' + (filterCat === cat ? c.acc : c.bdr), background: filterCat === cat ? c.acc + '18' : 'transparent', color: filterCat === cat ? c.acc : c.sub, fontSize: 11, cursor: 'pointer' }}>{cat !== 'All' && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: catColors[cat], marginRight: 4 }} />}{cat}</button>)}
        </div>
        {[{ label: 'High Priority', items: high, color: c.danger }, { label: 'Medium', items: med, color: c.warn }, { label: 'Lower', items: low, color: c.sub }].map((g) => g.items.length > 0 && <div key={g.label}><div style={{ fontSize: 11, fontWeight: 600, color: g.color, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: g.color }} /> {g.label} ({g.items.length})</div>{g.items.map((t) => renderTask(t, { drag: true }))}</div>)}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: c.sub }}>No tasks match filters.</div>}
      </div>
    );
  };

  // ─── PAGE: REVIEW ────────────────────────────────────────
  const renderReview = () => {
    const cc = done.length, totalTime = done.reduce((s, t) => s + t.time, 0);
    const catCounts = cats.reduce((a, cat) => { a[cat] = done.filter((t) => t.cat === cat).length; return a; }, {});
    const maxCat = Math.max(...Object.values(catCounts), 1);
    const rolledOver = tasks.filter((t) => !t.done && t.age >= 5).sort((a, b) => b.age - a.age).slice(0, 5);
    return (
      <div style={{ overflowY: 'auto', height: '100%', padding: '0 4px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[{ label: 'Completed', value: cc, icon: Check, color: c.ok }, { label: 'Time Saved', value: fmt(totalTime), icon: Clock, color: c.acc }, { label: 'Active', value: active.length, icon: Target, color: c.warn }].map((s) => <div key={s.label} style={{ flex: 1, background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}><s.icon size={18} color={s.color} style={{ marginBottom: 6 }} /><div style={{ fontSize: 20, fontWeight: 700, color: c.txt }}>{s.value}</div><div style={{ fontSize: 11, color: c.sub }}>{s.label}</div></div>)}
        </div>
        <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.txt, marginBottom: 12 }}>By Category</div>
          {cats.map((cat) => <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><span style={{ fontSize: 12, color: c.txt, width: 70 }}>{cat}</span><div style={{ flex: 1, height: 8, background: c.bdr, borderRadius: 4, overflow: 'hidden' }}><div style={{ width: ((catCounts[cat] || 0) / maxCat) * 100 + '%', height: '100%', background: catColors[cat], borderRadius: 4 }} /></div><span style={{ fontSize: 12, color: c.sub, width: 20, textAlign: 'right' }}>{catCounts[cat] || 0}</span></div>)}
        </div>
        {rolledOver.length > 0 && <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: 16, marginBottom: 16 }}><div style={{ fontSize: 13, fontWeight: 600, color: c.txt, marginBottom: 10 }}>Rolled Over</div>{rolledOver.map((t) => <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid ' + c.bdr }}><span style={{ fontSize: 12, color: c.txt }}>{t.title}</span><span style={{ fontSize: 11, color: t.age >= 10 ? c.danger : c.warn }}>{t.age}d old</span></div>)}</div>}
      </div>
    );
  };

  // ─── PAGE: ARCHIVE ───────────────────────────────────────
  const renderArchive = () => (
    <div style={{ overflowY: 'auto', height: '100%', padding: '0 4px' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[{ label: 'Completed', value: done.length }, { label: 'Time Saved', value: fmt(done.reduce((s, t) => s + t.time, 0)) }, { label: 'Remaining', value: active.length }].map((s) => <div key={s.label} style={{ flex: 1, background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700, color: c.txt }}>{s.value}</div><div style={{ fontSize: 11, color: c.sub }}>{s.label}</div></div>)}
      </div>
      {done.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: c.sub }}>No completed tasks yet.</div>}
      {done.map((t) => <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: c.card, border: '1px solid ' + c.bdr, marginBottom: 6, opacity: 0.6 }}><Check size={14} color={c.ok} /><span style={{ fontSize: 13, color: c.sub, textDecoration: 'line-through', flex: 1 }}>{t.title}</span><span style={{ fontSize: 10, color: catColors[t.cat], background: catColors[t.cat] + '18', padding: '1px 6px', borderRadius: 4 }}>{t.cat}</span></div>)}
    </div>
  );

  // ─── PAGE: SETTINGS ──────────────────────────────────────
  const stabs = [{ id: 'context', label: 'My Context', icon: Target }, { id: 'profile', label: 'Profile', icon: User }, { id: 'prefs', label: 'Preferences', icon: Settings }];
  const renderSettings = () => (
    <div style={{ overflowY: 'auto', height: '100%', padding: '0 4px' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: c.card, borderRadius: 8, padding: 4, border: '1px solid ' + c.bdr }}>
        {stabs.map((tab) => <button key={tab.id} onClick={() => setSettingsTab(tab.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', borderRadius: 6, border: 'none', background: settingsTab === tab.id ? c.acc + '18' : 'transparent', color: settingsTab === tab.id ? c.acc : c.sub, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}><tab.icon size={14} /> {tab.label}</button>)}
      </div>
      {settingsTab === 'context' && <div>
        {[{ key: 'lifeGoals', label: 'Life Goals', ph: 'Long-term life goals?' }, { key: 'currentFocus', label: 'Current Focus', ph: 'What are you focused on?' }, { key: 'aboutMe', label: 'About Me', ph: 'Who are you?' }].map((f) => <div key={f.key} style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 4, display: 'block' }}>{f.label}</label><textarea value={userCtx[f.key]} onChange={(e) => setUserCtx((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: '100%', minHeight: 60, padding: 10, borderRadius: 8, border: '1px solid ' + c.bdr, background: c.card, color: c.txt, fontSize: 12, resize: 'vertical', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box' }} /></div>)}
        <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 6, display: 'block' }}>Priority Categories (+15% boost)</label><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{cats.map((cat) => <button key={cat} onClick={() => setUserCtx((p) => ({ ...p, boostCats: p.boostCats.includes(cat) ? p.boostCats.filter((x) => x !== cat) : [...p.boostCats, cat] }))} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid ' + (userCtx.boostCats.includes(cat) ? catColors[cat] : c.bdr), background: userCtx.boostCats.includes(cat) ? catColors[cat] + '18' : 'transparent', color: userCtx.boostCats.includes(cat) ? catColors[cat] : c.sub, fontSize: 11, cursor: 'pointer' }}>{cat}</button>)}</div></div>
        <button onClick={() => { setCtxSaved(true); setTimeout(() => setCtxSaved(false), 2000); }} style={{ background: c.acc, border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{ctxSaved ? 'Saved!' : 'Save Context'}</button>
      </div>}
      {settingsTab === 'profile' && <div>{[{ l: 'Name', v: 'Daniel' }, { l: 'Companies', v: 'Tanaor Jewelry, + others' }, { l: 'Email', v: 'danielm@tanaorjewelry.com' }].map((f) => <div key={f.l} style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 600, color: c.txt, marginBottom: 4, display: 'block' }}>{f.l}</label><div style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.card, color: c.sub, fontSize: 13 }}>{f.v}</div></div>)}</div>}
      {settingsTab === 'prefs' && <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid ' + c.bdr, marginBottom: 12 }}><div><div style={{ fontSize: 13, fontWeight: 500, color: c.txt }}>Dark Mode</div></div><button onClick={() => setDark(!dark)} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: dark ? c.acc : c.bdr, position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}><div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: dark ? 23 : 3, transition: 'left 0.3s' }} /></button></div>
        <div style={{ padding: '10px 0', borderBottom: '1px solid ' + c.bdr, marginBottom: 12 }}><div style={{ fontSize: 13, fontWeight: 500, color: c.txt }}>AI Model</div><div style={{ fontSize: 11, color: c.sub }}>Claude Opus 4.6</div></div>
        <div style={{ padding: '10px 0' }}><div style={{ fontSize: 13, fontWeight: 500, color: c.txt }}>Scoring</div><div style={{ fontSize: 11, color: c.sub, lineHeight: 1.5 }}>Base formula + 15% category boost + hard deadline override</div></div>
      </div>}
    </div>
  );

  // ─── ROUTING ─────────────────────────────────────────────
  const pages = { today: renderToday, all: renderAllTasks, review: renderReview, archive: renderArchive, settings: renderSettings };
  const pageLabel = { today: 'Today', all: 'All Tasks', review: 'Weekly Review', archive: 'Archive', settings: 'Settings' };

  // ─── MAIN RENDER ─────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #7C8CF8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: c.bg, color: c.txt, overflow: 'hidden' }}>
      {/* ── Sidebar (desktop) / Bottom Nav (mobile) ── */}
      {!mobile && (
        <div style={{ width: 56, background: c.side, borderRight: '1px solid ' + c.bdr, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: c.acc, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Sparkles size={18} color="#fff" /></div>
          {navItems.map((n) => <button key={n.id} onClick={() => { setPage(n.id); setAiReview(null); }} title={n.label} style={{ width: 40, height: 40, borderRadius: 8, border: 'none', background: page === n.id ? (dark ? '#1C2129' : '#EBEEF1') : 'transparent', color: page === n.id ? c.acc : c.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 4 }}><n.icon size={20} /></button>)}
          <div style={{ marginTop: 'auto', marginBottom: 10 }}><button onClick={() => setDark(!dark)} style={{ width: 40, height: 40, borderRadius: 8, border: 'none', background: 'transparent', color: c.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button></div>
        </div>
      )}

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingBottom: mobile ? 56 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: mobile ? '8px 12px' : '10px 20px', borderBottom: '1px solid ' + c.bdr, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: mobile ? 15 : 16, fontWeight: 700, color: c.txt }}>{aiReview ? 'AI Review' : pageLabel[page]}</span>
            {!aiReview && <span style={{ fontSize: 12, color: c.sub, background: c.bdr + '60', padding: '2px 8px', borderRadius: 10 }}>{active.length}</span>}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={runAiReview} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Brain size={13} /> AI Review</button>
            <button onClick={() => setAiOpen(!aiOpen)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: '1px solid ' + (aiOpen ? c.acc : c.bdr), background: aiOpen ? c.acc + '15' : 'transparent', color: aiOpen ? c.acc : c.sub, fontSize: 12, cursor: 'pointer' }}><Sparkles size={13} /> AI</button>
          </div>
        </div>
        <div style={{ flex: 1, padding: mobile ? '12px' : '16px 20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {aiReview ? renderAiReview() : pages[page]()}
        </div>
      </div>

      {/* ── AI Panel ── */}
      {aiOpen && (
        <div style={mobile ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: c.bg, zIndex: 50, display: 'flex', flexDirection: 'column' } : { width: 280, borderLeft: '1px solid ' + c.bdr, background: c.side, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid ' + c.bdr, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={14} color={c.acc} /><span style={{ fontSize: 13, fontWeight: 600, color: c.txt }}>AI Assistant</span><span style={{ fontSize: 9, color: c.acc, background: c.acc + '18', padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>Opus 4.6</span></div>
            <button onClick={() => setAiOpen(false)} style={{ background: 'transparent', border: 'none', color: c.sub, cursor: 'pointer' }}><X size={14} /></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {msgs.length === 0 && <div style={{ textAlign: 'center', padding: '20px 10px' }}><Sparkles size={24} color={c.acc} style={{ marginBottom: 8 }} /><div style={{ fontSize: 13, fontWeight: 600, color: c.txt, marginBottom: 4 }}>Hi Daniel!</div><div style={{ fontSize: 12, color: c.sub, marginBottom: 16, lineHeight: 1.5 }}>Ask me anything about your tasks.</div><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{aiSuggestions.map((s) => <button key={s} onClick={() => sendMsg(s)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid ' + c.bdr, background: c.card, color: c.txt, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>{s}</button>)}</div></div>}
            {msgs.map((m, i) => <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}><div style={{ maxWidth: '88%', padding: '8px 12px', borderRadius: 10, background: m.role === 'user' ? c.acc : c.card, color: m.role === 'user' ? '#fff' : c.txt, fontSize: 12, lineHeight: 1.5, border: m.role === 'ai' ? '1px solid ' + c.bdr : 'none', whiteSpace: 'pre-wrap' }}>{m.text}</div></div>)}
          </div>
          {recording && <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid ' + c.bdr }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F85149', animation: 'blink 1s infinite' }} /><span style={{ fontSize: 12, color: c.danger }}>Listening...</span></div>}
          <div style={{ padding: '8px 12px', borderTop: '1px solid ' + c.bdr, display: 'flex', gap: 6 }}>
            <button onClick={() => setRecording(!recording)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid ' + (recording ? c.danger : c.bdr), background: recording ? c.danger + '18' : 'transparent', color: recording ? c.danger : c.sub, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><Mic size={14} /></button>
            <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendMsg(aiInput); }} placeholder="Ask anything..." style={{ flex: 1, background: c.card, border: '1px solid ' + c.bdr, borderRadius: 8, padding: '6px 10px', color: c.txt, fontSize: 12, outline: 'none' }} />
            <button onClick={() => sendMsg(aiInput)} disabled={!aiInput.trim()} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: aiInput.trim() ? c.acc : c.bdr, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: aiInput.trim() ? 'pointer' : 'default', flexShrink: 0 }}><Send size={14} /></button>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Nav ── */}
      {mobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 56, background: c.side, borderTop: '1px solid ' + c.bdr, display: 'flex', alignItems: 'center', justifyContent: 'space-around', zIndex: 40 }}>
          {navItems.map((n) => <button key={n.id} onClick={() => { setPage(n.id); setAiReview(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'transparent', border: 'none', color: page === n.id ? c.acc : c.sub, cursor: 'pointer', padding: '4px 0' }}><n.icon size={20} /><span style={{ fontSize: 9 }}>{n.label}</span></button>)}
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes cp0 { to { transform: translate(20px, -25px) scale(0); opacity: 0; } }
        @keyframes cp1 { to { transform: translate(-18px, -20px) scale(0); opacity: 0; } }
        @keyframes cp2 { to { transform: translate(25px, 10px) scale(0); opacity: 0; } }
        @keyframes cp3 { to { transform: translate(-5px, 28px) scale(0); opacity: 0; } }
        @keyframes cp4 { to { transform: translate(15px, -30px) scale(0); opacity: 0; } }
        @keyframes cp5 { to { transform: translate(-22px, 5px) scale(0); opacity: 0; } }
        @keyframes cp6 { to { transform: translate(10px, 22px) scale(0); opacity: 0; } }
        @keyframes cp7 { to { transform: translate(-15px, -18px) scale(0); opacity: 0; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
        @keyframes loading { 0% { width: 0%; } 50% { width: 80%; } 100% { width: 100%; } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}
