'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import { Check, Sparkles, ChevronDown, ChevronRight, ChevronLeft, Mic, Send, Sun, Moon, LayoutDashboard, ListTodo, Archive, Settings, Search, X, GripVertical, Clock, User, Target, Plus, ExternalLink, Trash2, BarChart3, AlertTriangle, Calendar, Circle, Zap, Brain } from 'lucide-react';

// â”€â”€â”€ TASK DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const tasks0 = [
  { id: 1, title: 'Research True Classic competitor ads', cat: 'Business', impact: 9, urgency: 8, effort: 5, time: 60, age: 4, done: false,
    notes: 'Look at their Facebook and YouTube ad creatives. Focus on hooks, offers, and CTAs.', link: 'https://www.facebook.com/ads/library', aiReason: 'High-impact competitive intel that directly affects your ad spend ROI.',
    dueDate: '2026-02-23', deadlineType: 'soft', subtasks: [{ id: 101, title: 'Pull Facebook ad library data', done: false }, { id: 102, title: 'Analyze top 5 video hooks', done: false }, { id: 103, title: 'Draft findings doc', done: false }] },
  { id: 2, title: 'Review Q1 revenue projections', cat: 'Business', impact: 8, urgency: 7, effort: 6, time: 90, age: 2, done: false,
    notes: 'Compare actuals vs forecast for Jan-Feb. Identify gaps before board meeting.', link: '', aiReason: 'Aligns with your goal of data-driven decisions. Board meeting is approaching.',
    dueDate: '2026-02-25', deadlineType: 'soft', subtasks: [] },
  { id: 3, title: 'Pay team salaries', cat: 'Business', impact: 6, urgency: 10, effort: 2, time: 15, age: 0, done: false,
    notes: 'Process through Gusto. Verify hours for part-time team members.', link: 'https://app.gusto.com', aiReason: 'Hard deadline â€” team depends on this. Quick to execute.',
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
  { key: 'lowEnergy', label: 'Low Energy', icon: 'ðŸ”‹' },
  { key: '30min', label: '30 Min', icon: 'â±ï¸' },
  { key: 'deepFocus', label: 'Deep Focus', icon: 'ðŸŽ¯' },
  { key: 'quickWins', label: 'Quick Wins', icon: 'âš¡' },
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

  // â”€â”€â”€ RESPONSIVE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // â”€â”€â”€ THEME â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const themes = {
    light: { bg: '#F6F8FA', card: '#FFFFFF', card2: '#F9FAFB', bdr: '#E1E4E8', txt: '#24292E', sub: '#57606A', acc: '#5B6CF0', ok: '#1A7F37', side: '#FFFFFF', doNow: 'rgba(91,108,240,0.06)', warn: '#D4643B', danger: '#CF222E', briefBg: 'rgba(91,108,240,0.04)' },
    warm: { bg: '#FAF8F5', card: '#FFFDF9', card2: '#FBF9F6', bdr: '#E8E3DA', txt: '#3D3929', sub: '#7A7265', acc: '#C47B3B', ok: '#558B2F', side: '#FFFDF9', doNow: 'rgba(196,123,59,0.06)', warn: '#C47B3B', danger: '#C62828', briefBg: 'rgba(196,123,59,0.04)' },
    dark: { bg: '#0F1117', card: '#1A1B23', card2: '#1E1F28', bdr: '#2D333B', txt: '#C9D1D9', sub: '#8B949E', acc: '#7C8CF8', ok: '#3FB950', side: '#0D0E14', doNow: 'rgba(124,140,248,0.08)', warn: '#F0883E', danger: '#F85149', briefBg: 'rgba(124,140,248,0.05)' },
  };
  const c = themes[dark] || themes.light;

  // â”€â”€â”€ SCORING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    if (d !== null && d < 0 && t.deadlineType === 'hard') r.push('ðŸš¨ OVERDUE ' + Math.abs(d) + 'd');
    else if (d !== null && d <= 1 && t.deadlineType === 'hard') r.push('ðŸ”´ Due tomorrow â€” hard');
    else if (d !== null && d <= 3 && t.deadlineType === 'hard') r.push('ðŸ”´ Due in ' + d + 'd â€” hard');
    else if (d !== null && d < 0) r.push('â° ' + Math.abs(d) + 'd overdue');
    else if (d !== null && d <= 3) r.push('ðŸŸ¡ Due in ' + d + 'd');
    if (t.impact >= 8) r.push('ðŸŽ¯ High impact');
    if (t.urgency >= 8) r.push('â±ï¸ Time sensitive');
    if (t.effort <= 3 && t.time <= 20) r.push('âš¡ Quick win');
    if (t.age >= 3 && r.length < 2) r.push('âš ï¸ ' + t.age + 'd old');
    if (r.length === 0) r.push('ðŸ“‹ Scheduled');
    return r.slice(0, 2);
  };
  const fmt = (m) => m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60 > 0 ? (m % 60) + 'm' : '') : m + 'm';
  const fmtDate = (ds) => { if (!ds) return ''; const d = new Date(ds + 'T00:00:00'); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getDate(); };

  // â”€â”€â”€ FILTERED â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€ SOUND & EFFECTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const playCompletionSound = () => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.setValueAtTime(800, ctx.currentTime); osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1); gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3); } catch(e) {} };

  // â”€â”€â”€ ACTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const complete = (id) => { playCompletionSound(); setCelebrating(id); setTimeout(() => { setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: true } : t))); setCelebrating(null); }, 800); };
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
    setTasks((prev) => [...prev, { id: Date.now(), title: p.title, cat: 'Work', impact: 5, urgency: 5, effort: 5, time: p.time, age: 0, done: false, notes: '', link: '', aiReason: 'New task â€” AI will analyze on next review.', dueDate: p.dueDate, deadlineType: p.deadlineType, subtasks: [] }]);
    setQuickAdd('');
  };
  const toggleSubtask = (taskId, subId) => { setTasks((p) => p.map((t) => t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => s.id === subId ? { ...s, done: !s.done } : s) } : t)); };
  const addSubtask = (taskId) => { if (!subInput.trim()) return; setTasks((p) => p.map((t) => t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: Date.now(), title: subInput.trim(), done: false }] } : t)); setSubInput(''); };

  // â”€â”€â”€ AI REVIEW ENGINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        if (t.age >= 7) u += ' This task has been sitting for ' + t.age + ' days â€” consider breaking it down or delegating.';
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
        { emoji: 'â±ï¸', title: 'Time Analysis', body: 'Your active tasks total ' + fmt(totalMin) + '. Hard deadlines this week: ' + fmt(hardMin) + ' (' + hardTasks.length + ' tasks). ' + (hardMin <= 120 ? 'Easily handled â€” focus your energy on high-impact deep work.' : 'Significant deadline load â€” prioritize these first.') },
        ...(neglectedCat ? [{ emoji: 'ðŸ”„', title: 'Category Blind Spot', body: 'You haven\'t completed any ' + neglectedCat + ' tasks recently. ' + (neglectedCat === 'Health' ? 'Your health fuels everything else. Consider scheduling "Morning workout" as a non-negotiable.' : 'Consider batching a ' + neglectedCat + ' task today for balance.') }] : []),
        ...(bigTasks.length > 0 ? [{ emoji: 'ðŸ§©', title: 'Break It Down', body: '"' + bigTasks[0].title + '" is high effort with no subtasks. Breaking it into 3-4 smaller steps makes it less daunting and easier to start.' }] : []),
        { emoji: 'ðŸ“Š', title: 'Category Balance', body: Object.entries(catDist).map(([k, v]) => k + ': ' + v).join(' Â· ') + '. ' + (catDist['Business'] > active.length * 0.6 ? 'Heavy on Business tasks â€” schedule a Personal task for mental reset.' : 'Good category distribution.') },
        { emoji: 'ðŸŽ¯', title: 'Focus Recommendation', body: sorted[0] ? 'Your #1 priority is "' + sorted[0].title + '". ' + (sorted[0].time >= 60 ? 'Block 2 uninterrupted hours for this. Close Slack, silence notifications.' : 'This is quick â€” knock it out first to build momentum.') : 'No active tasks!' },
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

  // â”€â”€â”€ AI CHAT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const sendMsg = async (text) => {
    if (!text.trim()) return;
    setMsgs((p) => [...p, { role: 'user', text }]);
    setAiInput('');
    setAiOpen(true);
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

  // â”€â”€â”€ DRAG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDragStart = (id) => setDragId(id);
  const handleDragOver = (e, tid) => { e.preventDefault(); if (dragId && dragId !== tid) setDragOverId(tid); };
  const handleDragLeave = () => setDragOverId(null);
  const handleDrop = (tid) => {
    if (!dragId || dragId === tid) return;
    setTasks((p) => { const a = [...p]; const fi = a.findIndex((t) => t.id === dragId); const ti = a.findIndex((t) => t.id === tid); const [m] = a.splice(fi, 1); a.splice(ti, 0, m); return a; });
    setDragId(null); setDragOverId(null);
  };

  const confetti = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#F38181', '#AA96DA', '#95E1D3', '#FF9FF3', '#48DBFB'];

  // â”€â”€â”€ RENDER: CHECKBOX â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderChk = (t) => (
    <button onClick={(e) => { e.stopPropagation(); complete(t.id); }} style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid ' + c.acc, background: t.done ? c.acc : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative', transition: 'all 0.2s' }}>
      {t.done && <Check size={12} color="#fff" />}
      {celebrating === t.id && confetti.map((col, i) => <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: col, animation: 'cp' + i + ' 0.6s ease-out forwards' }} />)}
    </button>
  );

  // â”€â”€â”€ RENDER: DETAIL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€ RENDER: TASK CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderTask = (t, opts = {}) => {
    const { large, drag, dim } = opts;
    const isExp = expanded === t.id, isDragging = dragId === t.id, d = daysUntilDue(t);
    const isCelebrating = celebrating === t.id;
    const subDone = t.subtasks ? t.subtasks.filter((s) => s.done).length : 0, subTotal = t.subtasks ? t.subtasks.length : 0;
    return (
      <div key={t.id} draggable={drag} onDragStart={drag ? () => handleDragStart(t.id) : undefined} onDragOver={drag ? (e) => handleDragOver(e, t.id) : undefined} onDragLeave={drag ? handleDragLeave : undefined} onDrop={drag ? () => handleDrop(t.id) : undefined}
        style={{ borderRadius: 10, border: large ? '2px solid ' + c.acc : '1px solid ' + c.bdr, background: large ? c.doNow : c.card, marginBottom: 8, opacity: isCelebrating ? 0 : isDragging ? 0.4 : dim ? 0.6 : 1, cursor: drag ? 'grab' : 'default', transition: 'opacity 0.5s ease, transform 0.5s ease, max-height 0.3s ease 0.4s, margin 0.3s ease 0.4s', boxShadow: large ? '0 2px 12px rgba(124,140,248,0.12)' : '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden', transform: isCelebrating ? 'translateX(80px)' : 'translateX(0)', maxHeight: isCelebrating ? '0px' : '500px', borderTop: dragOverId === t.id && dragId !== t.id ? '3px solid ' + c.acc : 'none' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ minWidth: 36, height: 24, borderRadius: 6, background: (score(t) >= 81 ? c.ok : score(t) >= 61 ? c.acc : score(t) >= 31 ? c.warn : c.danger) + '18', border: '1px solid ' + (score(t) >= 81 ? c.ok : score(t) >= 61 ? c.acc : score(t) >= 31 ? c.warn : c.danger), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: score(t) >= 81 ? c.ok : score(t) >= 61 Ë˜XØÈˆØÛÜ™J
HHÌHÈËØ\›ˆˆË™[™Ù\ˆ_OžÜØÛÜ™J
_OÙ]‚ˆÈ[[Øš[H	‰ˆÜ[ˆÝ[O^ÞÈ›ÛÚ^™NˆL‹›ÛÙZYÚˆLÛÛÜŽˆË\Ü^Nˆ	Ù›^	Ë[YÛ’][\Îˆ	ØÙ[\‰ËØ\ˆ_OÛØÚÈÚ^™O^ÌLŸHÏˆÙ›]
[YJ_OÜÜ[ŸBˆÚ]œ›Û”šYÚÚ^™O^ÌMHÛÛÜ^ØËœÝXŸHÝ[O^ÞÈ˜[œÙ›Ü›Nˆ\Ñ^È	Ü›Ý]JLYÊIÈˆ	Û›Û™IË˜[œÚ][ÛŽˆ	Ý˜[œÙ›Ü›HŒœÉÈ_HÏ‚ˆÙ]‚ˆÙ]‚ˆÚ\Ñ^	‰ˆ™[™\‘]Z[

_BˆÙ]‚ˆ
NÂˆNÂ‚ˆËÈ8¥ 8¥ 8¥ ”’QQ’S‘È8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ ˆÛÛœÝ™[™\œšYYš[™ÈH

HOˆÂˆÛÛœÝÝ\ˆH™]È]J
K™Ù]Ý\œÊ
NÂˆÛÛœÝÜ™Y][™ÈHÝ\ˆLˆÈ	ÑÛÛÙ[Ü›š[™ÉÈˆÝ\ˆMÈtvööBgFW&æööâr¢tvööBWfVæ–ærs°¢6öç7B†&E6ööâÒF6·2æf–ÇFW"‚‡B’ÓâBæFöæRbbBæFVFÆ–æUG—RÓÓÒv†&BrbbF—5VçF–ÄGVR‡B’ÓÒçVÆÂbbF—5VçF–ÄGVR‡B’ÃÒ"bbF—5VçF–ÄGVR‡B’ãÒ“°¢6öç7B†&D÷fW&GVRÒF6·2æf–ÇFW"‚‡B’ÓâBæFöæRbbBæFVFÆ–æUG—RÓÓÒv†&BrbbF—5VçF–ÄGVR‡B’ÓÒçVÆÂbbF—5VçF–ÄGVR‡B’Â“°¢6öç7BæVvÆV7FVBÒ6G2æf–ÇFW"‚†6B’ÓâFöæRç6öÖR‚‡B’ÓâBæ6BÓÓÒ6B’“°¢6öç7B7DFöæRÒF6·2æÆVæwF‚âòÖF‚ç&÷VæB‚†FöæRæÆVæwF‚òF6·2æÆVæwF‚’¢’¢°¢6öç7B"Ò‚Â6—&2Ò"¢ÖF‚å’¢"Âöfg6WBÒ6—&2Ò‡7DFöæRò’¢6—&3°¢–b‚'&–Vf–æt÷Vâ’&WGW&âÆ'WGFöâöä6Æ–6³×²‚’Óâ6WD'&–Vf–æt÷Vâ‡G'VR—Ò7G–ÆS×·²&6¶w&÷VæC¢2æ'&–Vd&rÂ&÷&FW#¢s‚6öÆ–Br²2æ&G"Â&÷&FW%&F—W3¢‚ÂFF–æs¢sg‚'‚rÂ6öÆ÷#¢2æ62ÂföçE6—¦S¢"Â7W'6÷#¢wö–çFW"rÂÖ&v–ä&÷GFöÓ¢"ÂF—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢v6VçFW"rÂv¢b×ÓãÅ7&¶ÆW26—¦S×³'ÒóâF–Ç’'&–Vf–æsÂö'WGFöãã°¢&WGW&â€¢ÆF—b7G–ÆS×·²&6¶w&÷VæC¢2æ'&–Vd&rÂ&÷&FW#¢s‚6öÆ–Br²2æ&G"Â&÷&FW%&F—W3¢"ÂFF–æs¢Öö&–ÆRòB¢#ÂÖ&v–ä&÷GFöÓ¢#BÂ÷6—F–öã¢w&VÆF—fRr×Óà¢Æ'WGFöâöä6Æ–6³×²‚’Óâ6WD'&–Vf–æt÷Vâ†fÇ6R—Ò7G–ÆS×·²÷6—F–öã¢v'6öÇWFRrÂF÷¢‚Â&–v‡C¢‚Â&6¶w&÷VæC¢wG&ç7&VçBrÂ&÷&FW#¢væöæRrÂ6öÆ÷#¢2ç7V"Â7W'6÷#¢wö–çFW"r×ÓãÅ‚6—¦S×³GÒóãÂö'WGFöãà¢ÆF—b7G–ÆS×·²F—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢v6VçFW"rÂv¢BÂÖ&v–ä&÷GFöÓ¢×Óà¢Ç7frv–GFƒ×³CGÒ†V–v‡C×³CGÒ7G–ÆS×·²G&ç6f÷&Ó¢w&÷FFR‚Ó“FVr’r×ÓãÆ6—&6ÆR7ƒ×³#'Ò7“×³#'Ò#×·'Òf–ÆÃÒ'G&ç7&VçB"7G&ö¶S×¶2æ&G'Ò7G&ö¶Uv–GFƒ×³7ÒóãÆ6—&6ÆR7ƒ×³#'Ò7“×³#'Ò#×·'Òf–ÆÃÒ'G&ç7&VçB"7G&ö¶S×¶2æ67Ò7G&ö¶Uv–GFƒ×³7Ò7G&ö¶TF6†'&“×¶6—&7Ò7G&ö¶TF6†öfg6WC×¶öfg6WGÒ7G&ö¶TÆ–æV6Ò'&÷VæB"óãÂ÷7fsà¢ÆF—cãÆF—b7G–ÆS×·²föçE6—¦S¢bÂföçEvV–v‡C¢cÂ6öÆ÷#¢2çG‡B×Óç¶w&VWF–æwÒÂFæ–VÃÂöF—cãÆF—b7G–ÆS×·²föçE6—¦S¢"Â6öÆ÷#¢2ç7V"×Óç¶7F—fRæÆVæwF‡ÒF6·2Fòfö7W2öâFöF“ÂöF—cãÂöF—cà¢ÂöF—cà¢ÆF—b7G–ÆS×·²F—7Æ“¢vfÆW‚rÂfÆW„F—&V7F–öã¢v6öÇVÖârÂv¢b×Óà¢¶†&D÷fW&GVRæÖ‚‡B’ÓâÆF—b¶W“×·Bæ–GÒ7G–ÆS×·²föçE6—¦S¢"Â6öÆ÷#¢2æFævW"ÂF—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢vfÆW‚×7F'BrÂv¢b×ÓãÄÆW'EG&–ævÆR6—¦S×³7Ò7G–ÆS×·²fÆW…6‡&–æ³¢ÂÖ&v–åF÷¢×ÒóãÇ7ããÇ7G&öæsç·BçF—FÆWÓÂ÷7G&öæsâ—2÷fW&GVR(	B†&BFVFÆ–æRãÂ÷7ããÂöF—câ—Ð¢¶†&E6ööâæÖ‚‡B’ÓâÆF—b¶W“×·Bæ–GÒ7G–ÆS×·²föçE6—¦S¢"Â6öÆ÷#¢2çv&âÂF—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢vfÆW‚×7F'BrÂv¢b×ÓãÄÆW'EG&–ævÆR6—¦S×³7Ò7G–ÆS×·²fÆW…6‡&–æ³¢ÂÖ&v–åF÷¢×ÒóãÇ7ããÇ7G&öæsç·BçF—FÆWÓÂ÷7G&öæsâGVR¶F—5VçF–ÄGVR‡B’ÓÓÒòwFöF’r¢wFöÖ÷'&÷rwÒ(	B†&BFVFÆ–æRãÂ÷7ããÂöF—câ—Ð¢¶FöæRæÆVæwF‚âbbÆF—b7G–ÆS×·²föçE6—¦S¢"Â6öÆ÷#¢2æö²×Óå–÷R6ö×ÆWFVB¶FöæRæÆVæwF‡ÒF6·2F†—2vVV²ãÂöF—cçÐ¢¶æVvÆV7FVBæÆVæwF‚âbbÆF—b7G–ÆS×·²föçE6—¦S¢"Â6öÆ÷#¢2ç7V"×ÓäæòÇ7G&öæsç¶æVvÆV7FVE³×ÓÂ÷7G&öæsâF6·26ö×ÆWFVB&V6VçFÇ’(	B6öç6–FW"'·F6·2æf–æB‚‡B’ÓâBæFöæRbbBæ6BÓÓÒæVvÆV7FVE³Ò“òçF—FÆRÇÂvöæRwÒ"FöF’ãÂöF—cçÐ¢ÂöF—cà¢ÆF—b7G–ÆS×·²Ö&v–åF÷¢BÂ&÷&FW%F÷¢s‚6öÆ–Br²2æ&G"ÂFF–æuF÷¢"×Óà¢ÆF—b7G–ÆS×·²F—7Æ“¢vfÆW‚rÂv¢bÂÖ&v–ä&÷GFöÓ¢‚ÂfÆW…w&¢ww&r×Óà¢¶•7VvvW7F–öç2æÖ‚‡2’ÓâÆ'WGFöâ¶W“×·7Òöä6Æ–6³×²‚’Óâ6VæD×6r‡2—Ò7G–ÆS×·²FF–æs¢sG‚‚rÂ&÷&FW%&F—W3¢#Â&÷&FW#¢s‚6öÆ–Br²2æ&G"Â&6¶w&÷VæC¢2æ6&BÂ6öÆ÷#¢2ç7V"ÂföçE6—¦S¢Â7W'6÷#¢wö–çFW"r×Óç·7ÓÂö'WGFöãâ—Ð¢ÂöF—cà¢ÆF—b7G–ÆS×·²F—7Æ“¢vfÆW‚rÂv¢‚ÂÆ–vä—FV×3¢v6VçFW"r×Óà¢Å7&¶ÆW26—¦S×³GÒ6öÆ÷#×¶2æ67Òóà¢Æ–çWBfÇVS×¶”–çWGÒöä6†ævS×²†R’Óâ6WD”–çWB†RçF&vWBçfÇVR—Òöä¶W”F÷vã×²†R’Óâ²–b†Ræ¶W’ÓÓÒtVçFW"r’6VæD×6r†”–çWB“²×ÒÆ6V†öÆFW#Ò$6²–÷W"’6†–Vböb7Ffbâââ"7G–ÆS×·²fÆWƒ¢Â&6¶w&÷VæC¢2æ6&BÂ&÷&FW#¢s‚6öÆ–Br²2æ&G"Â&÷&FW%&F—W3¢‚ÂFF–æs¢s‡‚'‚rÂ6öÆ÷#¢2çG‡BÂföçE6—¦S¢"Â÷WFÆ–æS¢væöæRr×Òóà¢¶”–çWBçG&–Ò‚’bbÆ'WGFöâöä6Æ–6³×²‚’Óâ6VæD×6r†”–çWB—Ò7G–ÆS×·²&6¶w&÷VæC¢2æ62Â&÷&FW#¢væöæRrÂ6öÆ÷#¢r6ffbrÂ&÷&FW%&F—W3¢‚ÂFF–æs¢sg‚'‚rÂföçE6—¦S¢"ÂföçEvV–v‡C¢cÂ7W'6÷#¢wö–çFW"r×Óå6VæCÂö'WGFöãçÐ¢ÂöF—cà¢ÂöF—cà¢ÂöF—cà¢“°¢Ó° ¢6öç7B6V7F–öä†VBÒ†Æ&VÂÂ6÷VçB’ÓâÆF—b7G–ÆS×·²föçE6—¦S¢ÂföçEvV–v‡C¢cÂ6öÆ÷#¢2ç7V"ÂFW‡EG&ç6f÷&Ó¢wWW&66RrÂÆWGFW%76–æs¢ã‚ÂÖ&v–ä&÷GFöÓ¢‚ÂÖ&v–åF÷¢bÂF—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢v6VçFW"rÂv¢‚×Óç¶Æ&VÇÒÇ7â7G–ÆS×·²föçE6—¦S¢ÂföçEvV–v‡C¢C×Óâ‡¶6÷VçGÒ“Â÷7ããÂöF—cã° ¢òò)H)H)H’$Ud”UräTÂ)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)H)HˆÛÛœÝ™[™\ZT™]šY]ÈH

HOˆÂˆYˆ
RT™]šY]ÈOOH	ÛØY[™ÉÊH™]\›ˆ
ˆ]ˆÝ[O^ÞÈ\Ü^Nˆ	Ù›^	Ë›^\™XÝ[ÛŽˆ	ØÛÛ[[‰Ë[YÛ’][\Îˆ	ØÙ[\‰Ë\ÝYžPÛÛ[ˆ	ØÙ[\‰ËZYÚˆ	ÌL	IËØ\ˆMˆ_O‚ˆ]ˆÝ[O^ÞÈ[š[X][ÛŽˆ	Ü[ÙHK\È[™š[š]IÈ_Oœ˜Z[ˆÚ^™O^ÍHÛÛÜ^ØË˜XØßHÏÙ]‚ˆ]ˆÝ[O^ÞÈ›ÛÚ^™NˆMK›ÛÙZYÚˆŒÛÛÜŽˆË_ORHY\[˜[\Ú\ÏÙ]‚ˆ]ˆÝ[O^ÞÈ›ÛÚ^™NˆLËÛÛÜŽˆËœÝX‹[š[X][ÛŽˆ	Ù˜YTÛYH\ÈX\ÙIÈ_HÙ^O^ÛØY[™Ó\ÙßOž×™±½…‘¥¹5Íôð½‘¥Øø(€€€€€€€€€€ñ‘¥ØÍÑå±”õíìÝ¥‘Ñ è€ÄÈÀ°¡•¥¡Ðè€Ì°‰…­É½Õ¹èŒ¹‰‘È°‰½É‘•ÉI…‘¥ÕÌè€È°½Ù•É™±½Üè€¡¥‘‘•¸œõôøñ‘¥ØÍÑå±”õíìÝ¥‘Ñ è€œØÀ”œ°¡•¥¡Ðè€œÄÀÀ”œ°‰…­É½Õ¹èŒ¹…Œ°‰½É‘•ÉI…‘¥ÕÌè€È°…¹¥µ…Ñ¥½¸è€±½…‘¥¹œ€ÉÌ•…Í”¥¹™¥¹¥Ñ”œõô€¼øð½‘¥Øø(€€€€€€ð½‘¥Øø(€€€€¤ì(€€€¥˜€ …É•Ù¥•Ý…Ñ„¤É•ÑÕÉ¸¹Õ±°ì(€€€½¹ÍÐÑ…‰Ì€ômì¥è€ÁÉ¥½É¥Ñäœ°±…‰•°è€AÉ¥½É¥Ñä=É‘•Èœ°¥½¸èQ…É•Ðô°ì¥è€¥¹Í¥¡ÑÌœ°±…‰•°è€%¹Í¥¡ÑÌœ°¥½¸èi…Àô°ì¥è€Á±…¸œ°±…‰•°è€…¥±äA±…¸œ°¥½¸è±½¬õtì(€€€É•ÑÕÉ¸€ (€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°™±•á¥É•Ñ¥½¸è€½±Õµ¸œ°¡•¥¡Ðè€œÄÀÀ”œõôø(€€€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°…Àè€à°µ…É¥¹	½ÑÑ½´è€ÄÈõôø(€€€€€€€€€€ñ‰ÕÑÑ½¸½¹±¥¬õì ¤€ôøÍ•Ñ¥I•Ù¥•Ü¡¹Õ±°¥ôÍÑå±”õíì‰…­É½Õ¹è€ÑÉ…¹ÍÁ…É•¹Ðœ°‰½É‘•Èè€¹½¹”œ°½±½ÈèŒ¹ÍÕˆ°ÕÉÍ½Èè€Á½¥¹Ñ•Èœ°‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°…Àè€Ð°™½¹ÑM¥é”è€ÄÈõôøñ¡•ÙÉ½¹1•™ÐÍ¥é”õìÄÑô€¼ø	…¬ð½‰ÕÑÑ½¸ø(€€€€€€€€€€ñ‘¥ØÍÑå±”õíì™±•àè€Äõô€¼ø(€€€€€€€€€€ñ	É…¥¸Í¥é”õìÄÙô½±½ÈõíŒ¹…ô€¼ø(€€€€€€€€€€ñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄÐ°™½¹Ñ]•¥¡Ðè€ØÀÀ°½±½ÈèŒ¹ÑáÐõôù$I•Ù¥•Ýð€ð½ÍÁ…¸ø(€€€€€€€€€€ñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ä°½±½ÈèŒ¹…Œ°‰…­É½Õ¹èŒ¹…Œ€¬€œÄàœ°Á…‘‘¥¹œè€œÅÁà€ÕÁàœ°‰½É‘•ÉI…‘¥ÕÌè€Ð°™½¹Ñ]•¥¡Ðè€ØÀÀõôù=ÁÕÌ€Ð¸Øð½ÍÁ…¸ø(€€€€€€€€ð½‘¥Øø(€€€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…Àè€Ð°µ…É¥¹	½ÑÑ½´è€ÄÈ°‰…­É½Õ¹èŒ¹…É°‰½É‘•ÉI…‘¥ÕÌè€à°Á…‘‘¥¹œè€Ð°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬Œ¹‰‘Èõôø(€€€€€€€€€íÑ…‰Ì¹µ…À ¡Ñ…ˆ¤€ôø€ñ‰ÕÑÑ½¸­•äõíÑ…ˆ¹¥‘ô½¹±¥¬õì ¤€ôøÍ•ÑI•Ù¥•ÝQ…ˆ¡Ñ…ˆ¹¥¥ôÍÑå±”õíì™±•àè€Ä°‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°©ÕÍÑ¥™å½¹Ñ•¹Ðè€•¹Ñ•Èœ°…Àè€Ð°Á…‘‘¥¹œè€œÝÁà€Àœ°‰½É‘•ÉI…‘¥ÕÌè€Ø°‰½É‘•Èè€¹½¹”œ°‰…­É½Õ¹èÉ•Ù¥•ÝQ…ˆ€ôôôÑ…ˆ¹¥€üŒ¹…Œ€¬€œÄàœ€è€ÑÉ…¹ÍÁ…É•¹Ðœ°½±½ÈèÉ•Ù¥•ÝQ…ˆ€ôôôÑ…ˆ¹¥€üŒ¹…Œ€èŒ¹ÍÕˆ°™½¹ÑM¥é”è€ÄÄ°™½¹Ñ]•¥¡Ðè€ÔÀÀ°ÕÉÍ½Èè€Á½¥¹Ñ•ÈœõôøñÑ…ˆ¹¥½¸Í¥é”õìÄÉô€¼øíÑ…ˆ¹±…‰•±ôð½‰ÕÑÑ½¸ø¥ô(€€€€€€€€ð½‘¥Øø(€€€€€€€€ñ‘¥ØÍÑå±”õíì™±•àè€Ä°½Ù•É™±½Ýdè€…ÕÑ¼œõôø(€€€€€€€€€ìÉ•Ù¥•ÝQ…ˆ€ôôô€ÁÉ¥½É¥Ñäœ€˜˜€ (€€€€€€€€€€€€ñ‘¥Øø(€€€€€€€€€€€€€íÉ•Ù¥•Ý…Ñ„¹Í½ÉÑ•¹µ…À ¡Ð°¤¤€ôøì(€€€€€€€€€€€€€€€½¹ÍÐ½É¥M½É”€ôÍ½É”¡Ð¤°…¥M½É”€ôÉ•Ù¥•Ý…Ñ„¹…¥M½É•ÍmÐ¹¥‘tì(€€€€€€€€€€€€€€€½¹ÍÐ‘¥™˜€ô…¥M½É”€´½É¥M½É”ì(€€€€€€€€€€€€€€€É•ÑÕÉ¸€ (€€€€€€€€€€€€€€€€€€ñ‘¥Ø­•äõíÐ¹¥‘ôÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…Àè€ÄÀ°Á…‘‘¥¹œè€œÄÁÁà€ÄÉÁàœ°‰½É‘•ÉI…‘¥ÕÌè€à°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬Œ¹‰‘È°‰…­É½Õ¹è¤€ôôô€À€üŒ¹‘½9½Ü€èŒ¹…É°µ…É¥¹	½ÑÑ½´è€Øõôø(€€€€€€€€€€€€€€€€€€€€ñ‘¥ØÍÑå±”õíìÝ¥‘Ñ è€ÈÐ°¡•¥¡Ðè€ÈÐ°‰½É‘•ÉI…‘¥ÕÌè€œÔÀ”œ°‰…­É½Õ¹è¤€ôôô€À€üŒ¹…Œ€èŒ¹‰‘È°½±½Èè¤€ôôô€À€ü€œ™™˜œ€èŒ¹ÍÕˆ°‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°©ÕÍÑ¥™å½¹Ñ•¹Ðè€•¹Ñ•Èœ°™½¹ÑM¥é”è€ÄÄ°™½¹Ñ]•¥¡Ðè€ÜÀÀ°™±•áM¡É¥¹¬è€Àõôùí¤€¬€Åôð½‘¥Øø(€€€€€€€€€€€€€€€€€€€€ñ‘¥ØÍÑå±”õíì™±•àè€Ä°µ¥¹]¥‘Ñ è€Àõôø(€€€€€€€€€€€€€€€€€€€€€€ñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÌ°™½¹Ñ]•¥¡Ðè€ÔÀÀ°½±½ÈèŒ¹ÑáÐ°µ…É¥¹	½ÑÑ½´è€ÌõôùíÐ¹Ñ¥Ñ±•ôð½‘¥Øø(€€€€€€€€€€€€€€€€€€€€€€ñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÄ°½±½ÈèŒ¹ÍÕˆ°™½¹ÑMÑå±”è€¥Ñ…±¥Œœ°±¥¹•!•¥¡Ðè€Ä¸Ð°µ…É¥¹	½ÑÑ½´è€ÐõôùíÉ•Ù¥•Ý…Ñ„¹Õ¹‘•ÉÍÑ…¹‘¥¹mÐ¹¥‘uôð½‘¥Øø(€€€€€€€€€€€€€€€€€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°…Àè€àõôø(€€€€€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄÀ°½±½Èè…Ñ½±½ÉÍmÐ¹…Ñt°‰…­É½Õ¹è…Ñ½±½ÉÍmÐ¹…Ñt€¬€œÄàœ°Á…‘‘¥¹œè€œÅÁà€ÙÁàœ°‰½É‘•ÉI…‘¥ÕÌè€ÐõôùíÐ¹…Ñôð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€€€€€€€€í‘¥™˜€„ôô€À€˜˜€ñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄÀ°™½¹Ñ]•¥¡Ðè€ØÀÀ°½±½Èè‘¥™˜€ø€À€üŒ¹½¬€èŒ¹‘…¹•Èõôùí‘¥™˜€ø€À€ü€ŸŠDœ€è€ŸŠLôí½É¥M½É•ôƒŠHí…¥M½É•ôð½ÍÁ…¸ùô(€€€€€€€€€€€€€€€€€€€€€€€€ñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄÀ°½±½ÈèŒ¹ÍÕˆõôùí™µÐ¡Ð¹Ñ¥µ”¥ôð½ÍÁ…¸ø(€€€€€€€€€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€€€¤ì(€€€€€€€€€€€€€ô¥ô(€€€€€€€€€€€€€€ñ‰ÕÑÑ½¸½¹±¥¬õí…ÁÁ±å¥=É‘•ÉôÍÑå±”õíìÝ¥‘Ñ è€œÄÀÀ”œ°Á…‘‘¥¹œè€œÄÁÁà€Àœ°‰½É‘•ÉI…‘¥ÕÌè€à°‰½É‘•Èè€¹½¹”œ°‰…­É½Õ¹èŒ¹…Œ°½±½Èè€œ™™˜œ°™½¹ÑM¥é”è€ÄÌ°™½¹Ñ]•¥¡Ðè€ØÀÀ°ÕÉÍ½Èè€Á½¥¹Ñ•Èœ°µ…É¥¹Q½Àè€àõôùÁÁ±ä$=É‘•Èð½‰ÕÑÑ½¸ø(€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€¥ô(€€€€€€€€€ìÉ•Ù¥•ÝQ…ˆ€ôôô€¥¹Í¥¡ÑÌœ€˜˜€ (€€€€€€€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°™±•á¥É•Ñ¥½¸è€½±Õµ¸œ°…Àè€àõôø(€€€€€€€€€€€€€íÉ•Ù¥•Ý…Ñ„¹¥¹Í¥¡ÑÌ¹µ…À ¡¥¹Ì°¤¤€ôø€ (€€€€€€€€€€€€€€€€ñ‘¥Ø­•äõí¥ôÍÑå±”õíìÁ…‘‘¥¹œè€ÄÐ°‰½É‘•ÉI…‘¥ÕÌè€ÄÀ°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬Œ¹‰‘È°‰…­É½Õ¹èŒ¹…Éõôø(€€€€€€€€€€€€€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°…Àè€à°µ…É¥¹	½ÑÑ½´è€ØõôøñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄØõôùí¥¹Ì¹•µ½©¥ôð½ÍÁ…¸øñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄÌ°™½¹Ñ]•¥¡Ðè€ØÀÀ°½±½ÈèŒ¹ÑáÐõôùí¥¹Ì¹Ñ¥Ñ±•ôð½ÍÁ…¸øð½‘¥Øø(€€€€€€€€€€€€€€€€€€ñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÈ°½±½ÈèŒ¹ÍÕˆ°±¥¹•!•¥¡Ðè€Ä¸Øõôùí¥¹Ì¹‰½‘åôð½‘¥Øø(€€€€€€€€€€€€€€€€ð½‘¥Øø(€€€€€€€€€€€€€€)¦s}
            </div>
          )}
          { reviewTab === 'plan' && (
            <div>
              <div style={{ fontSize: 12, color: c.sub, marginBottom: 12 }}>Your AI-optimized schedule for today:</div>
              {reviewData.plan.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
                  <div style={{ width: 60, fontSize: 12, fontWeight: 600, color: c.acc, textAlign: 'right', flexShrink: 0, paddingTop: 10 }}>{{p.time}</div>
                  <div style={{ width: 2, background: c.bdr, flexShrink: 0, position: 'relative' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? c.acc : c.bdr, position: 'absolute', top: 12, left: -3 }} /></diw>
                  <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: c.card, border: '1px solid ' + c.bdr, marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c.txt }}>{{.p.task.title}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: catColors[p.task.cat], background: catColors[p.task.cat] + '18', padding: '1px 6px', borderRadius: 4 }}>{p.task.cat}</span>
                      <span style={{ fontSize: 10, color: c.sub }}>{fmt(p.duration)}</span>
                      <span style={{ fontSize: 10, color: c.sub }}>{p.reason}</span>
                    </div>
                  </div>
                </div>
              
os9%
              <button onClick={applyAiOrder} style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: c.acc, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 12 }}>Apply This Plan</button>
            </div>
          )}
        </div>
      </div>
  
  )$VRŠRŠR AèQ=dƒŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠRŠR ¢6öç7B&VæFW%FöF’Ò‚’Óâ€¢ÆF—b7G–ÆS×·²F—7Æ“¢vfÆW‚rÂfÆW„F—&V7F–öã¢v6öÇVÖârÂ†V–v‡C¢sRr×Óà¢ÆF—b7G–ÆS×·²fÆWƒ¢Â÷fW&fÆ÷u“¢vWFòrÂFF–æs¢sG‚r×Óà¢·&VæFW$'&–Vf–ær‚—Ð¢ÆF—b7G–ÆS×·²F—7Æ“¢vfÆW‚rÂfÆW…w&¢ww&rÂv¢bÂÖ&v–ä&÷GFöÓ¢b×Óà¢¶6†—FVg2æÖ‚†6‚’ÓâÆ'WGFöâ¶W“×¶6‚æ¶W—Òöä6Æ–6³×²‚’Óâ6WD7F—fT7G‚†7F—fT7G‚ÓÓÒ6‚æ¶W’òçVÆÂ¢6‚æ¶W—Ò7G–ÆS×·²FF–æs¢sW‚‚rÂ&÷&FW%&F—W3¢#Â&÷&FW#¢s‚6öÆ–Br²†7F—fT7G‚ÓÓÒ6‚æ¶W’ò2æ62¢2æ&G"’Â&6¶w&÷VæC¢7F—fT7G‚ÓÓÒ6‚æ¶W’ò2æ62²s‚r¢wG&ç7&VçBrÂ6öÆ÷#¢7F—fT7G‚ÓÓÒ6‚æ¶W’ò2æ62¢2ç7V"ÂföçE6—¦S¢Â7W'6÷#¢wö–çFW"r×Óç¶6‚æ–6öçÒ¶6‚æÆ&VÇÓÂö'WGFöãâ—Ð¢ÂöF—cà¢·F÷F6²bbÆF—b7G–ÆS×·²&6¶w&÷VæC¢2æFôæ÷rÂ&÷&FW#¢s'‚6öÆ–Br²2æ62Â&÷&FW%&F—W3¢"ÂFF–æs¢s'‚G‚rÂÖ&v–ä&÷GFöÓ¢#B×ÓãÆF—b7G–ÆS×·²föçE6—¦S¢"ÂföçEvV–v‡C¢sÂ6öÆ÷#¢2æ62ÂFW‡EG&ç6f÷&Ó¢wWW&66RrÂÆWGFW%76–æs¢ã"ÂÖ&v–ä&÷GFöÓ¢ÂF—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢v6VçFW"rÂv¢b×ÓãÅ¦6—¦S×³GÒ6öÆ÷#×¶2æ67ÒóâFòæ÷sÂöF—cç·&VæFW%F6²‡F÷F6²Â²Æ&vS¢G'VRÒ—ÓÂöF—cçÐ¢·WæW‡BæÆVæwF‚âbbÆF—b7G–ÆS×·²Ö&v–ä&÷GFöÓ¢#B×Óç·6V7F–öä†VB‚uWæW‡BrÂWæW‡BæÆVæwF‚—×·WæW‡BæÖ‚‡B’Óâ&VæFW%F6²‡BÂ²G&s¢G'VRÒ’—ÓÂöF—cçÐ¢¶ÆFW"æÆVæwF‚âbbÆF—b7G–ÆS×·²Ö&v–ä&÷GFöÓ¢#BÂ÷6—G“¢ãcR×Óç·6V7F–öä†VB‚tÆFW"rÂÆFW"æÆVæwF‚—×¶ÆFW"æÖ‚‡B’Óâ&VæFW%F6²‡BÂ²G&s¢G'VRÂF–Ó¢G'VRÒ’—ÓÂöF—cçÐ¢¶FöæRæÆVæwF‚âbbÃà¢Æ'WGFöâöä6Æ–6³×²‚’Óâ6WE6†÷tFöæR‚6†÷tFöæR—Ò7G–ÆS×·²F—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢v6VçFW"rÂv¢bÂ&6¶w&÷VæC¢wG&ç7&VçBrÂ&÷&FW#¢væöæRrÂ6öÆ÷#¢2ç7V"ÂföçE6—¦S¢ÂföçEvV–v‡C¢cÂFW‡EG&ç6f÷&Ó¢wWW&66RrÂÆWGFW%76–æs¢ã‚ÂÖ&v–åF÷¢bÂÖ&v–ä&÷GFöÓ¢‚Â7W'6÷#¢wö–çFW"r×Óç·6†÷tFöæRòÄ6†Wg&öäF÷vâ6—¦S×³7Òóâ¢Ä6†Wg&öå&–v‡B6—¦S×³7ÒóçÒFöæR‡¶FöæRæÆVæwF‡Ò“Âö'WGFöãà¢·6†÷tFöæRbbFöæRæÖ‚‡B’ÓâÆF—b¶W“×·Bæ–GÒ7G–ÆS×·²F—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢v6VçFW"rÂv¢ÂFF–æs¢s‡‚G‚rÂ&÷&FW%&F—W3¢‚Â&6¶w&÷VæC¢2æ6&BÂ&÷&FW#¢s‚6öÆ–Br²2æ&G"ÂÖ&v–ä&÷GFöÓ¢bÂ÷6—G“¢ãR×ÓãÄ6†V6²6—¦S×³GÒ6öÆ÷#×¶2æö·ÒóãÇ7â7G–ÆS×·²föçE6—¦S¢2Â6öÆ÷#¢2ç7V"ÂFW‡DFV6÷&F–öã¢vÆ–æR×F‡&÷Vv‚r×Óç·BçF—FÆWÓÂ÷7ããÂöF—câ—Ð¢ÂóçÐ¢²7F—fRæÆVæwF‚ÓÓÒbbÆF—b7G–ÆS×·²FW‡DÆ–vã¢v6VçFW"rÂFF–æs¢CÂ6öÆ÷#¢2ç7V"ÂföçE6—¦S¢B×ÓäÆÂ6Vv‡BWÂöF—cçÐ¢ÂöF—cà¢ÆF—b7G–ÆS×·²FF–æs¢s‡‚rÂ&÷&FW%F÷¢s‚6öÆ–Br²2æ&G"ÂF—7Æ“¢vfÆW‚rÂv¢‚ÂÆ–vä—FV×3¢v6VçFW"r×Óà¢ÅÇW26—¦S×³gÒ6öÆ÷#×¶2ç7V'Òóà¢Æ–çWBfÇVS×·V–6´FGÒöä6†ævS×²†R’Óâ6WEV–6´FB†RçF&vWBçfÇVR—Òöä¶W”F÷vã×²†R’Óâ²–b†Ræ¶W’ÓÓÒtVçFW"r’FEF6²‡V–6´FB“²×ÒÆ6V†öÆFW#ÒtFBF6²âââ‚$6ÆÂ&ö"FöÖ÷'&÷r†&BVÒ"’r7G–ÆS×·²fÆWƒ¢Â&6¶w&÷VæC¢wG&ç7&VçBrÂ&÷&FW#¢væöæRrÂ6öÆ÷#¢2çG‡BÂföçE6—¦S¢2Â÷WFÆ–æS¢væöæRr×Òóà¢·V–6´FBbbÆ'WGFöâöä6Æ–6³×²‚’ÓâFEF6²‡V–6´FB—Ò7G–ÆS×·²&6¶w&÷VæC¢2æ62Â&÷&FW#¢væöæRrÂ6öÆ÷#¢r6ffbrÂ&÷&FW%&F—W3¢bÂFF–æs¢sG‚‚rÂföçE6—¦S¢"Â7W'6÷#¢wö–çFW"r×ÓäFCÂö'WGFöãçÐ¢ÂöF—cà¢ ¢ ò¼te: CGT‘Q%S%0PGE: ALL TASKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€(€½¹ÍÐÉ•¹‘•É±±Q…Í­Ì€ô€ ¤€ôø€ì(€€€½¹ÍÐ™¥±Ñ•É•€ôÑ…Í­Ì¹™¥±Ñ•È ¡Ð¤€ôø€…Ð¹‘½¹”¤¹™¥±Ñ•È ¡Ð¤€ôø™¥±Ñ•É…Ð€ôôô€±°œñðÐ¹…Ð€ôôô™¥±Ñ•É…Ð¤¹™¥±Ñ•È ¡Ð¤€ôø€…Í•…É¡DñðÐ¹Ñ¥Ñ±”¹Ñ½1½Ý•É…Í” ¤¹¥¹±Õ‘•Ì¡Í•…É¡D¹Ñ½1½Ý•É…Í” ¤¤¤¹Í½ÉÐ ¡„°ˆ¤€ôøÍ½É”¡ˆ¤€´Í½É”¡„¤¤ì(€€€½¹ÍÐ¡¥ €ô™¥±Ñ•É•¹™¥±Ñ•È ¡Ð¤€ôøÍ½É”¡Ð¤€øô€ÜÔ¤°µ•€ô™¥±Ñ•É•¹™¥±Ñ•È ¡Ð¤€ôøÍ½É”¡Ð¤€øô€ÔÀ€˜˜Í½É”¡Ð¤€ð€ÜÔ¤°±½Ü€ô™¥±Ñ•É•¹™¥±Ñ•È ¡Ð¤€ôøÍ½É”¡Ð¤€ð€ÔÀ¤ì(€€€É•ÑÕÉ¸€ (€€€€€€ñ‘¥ØÍÑå±”õíì½Ù•É™±½Ýdè€…ÕÑ¼œ°¡•¥¡Ðè€œÄÀÀ”œ°Á…‘‘¥¹œè€œÀ€ÑÁàœõôø(€€€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…Àè€à°µ…É¥¹	½ÑÑ½´è€ÄÈõôøñ‘¥ØÍÑå±”õíì™±•àè€Ä°‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°…Àè€à°‰…­É½Õ¹èŒ¹…É°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬Œ¹‰‘È°‰½É‘•ÉI…‘¥ÕÌè€à°Á…‘‘¥¹œè€œÙÁà€ÄÁÁàœõôøñM•…É Í¥é”õìÄÑô½±½ÈõíŒ¹ÍÕ‰ô€¼øñ¥¹ÁÕÐÙ…±Õ”õíÍ•…É¡Eô½¹¡…¹”õì¡”¤€ôøÍ•ÑM•…É¡D¡”¹Ñ…É•Ð¹Ù…±Õ”¥ôÁ±…•¡½±‘•Èô‰M•…É Ñ…Í­Ì¸¸¸ˆÍÑå±”õíì™±•àè€Ä°‰…­É½Õ¹è€ÑÉ…¹ÍÁ…É•¹Ðœ°‰½É‘•Èè€¹½¹”œ°½±½ÈèŒ¹ÑáÐ°™½¹ÑM¥é”è€ÄÌ°½ÕÑ±¥¹”è€¹½¹”œõô€¼ùííÍ•…É¡D€˜˜€ñ‰ÕÑÑ½¸½¹±¥¬õì ¤€ôøÍ•ÑM•…É¡D œœ¥ôÍÑå±”õíì‰…­É½Õ¹è€ÑÉ…¹ÍÁ…É•¹Ðœ°‰½É‘•Èè€¹½¹”œ°½±½ÈèŒ¹ÍÕˆ°ÕÉÍ½Èè€Á½¥¹Ñ•Èœ°Á…‘‘¥¹œè€Àõôøñ`Í¥é”õìÄÍô€¼øð½‰ÕÑÑ½¸ùõõôð½‘¥Øøð½‘¥Øø((€€€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…Àè€Ø°µ…É¥¹	½ÑÑ½´è€ÄØ°™±•á]É…Àè€ÝÉ…Àœõôø(€€€€€€€€€íl±°œ°€¸¸¹…ÑÍt¹µ…À ¡…Ð¤€ôø€ñ‰ÕÑÑ½¸­•äõí…Ñô½¹±¥¬õì ¤€ôøÍ•Ñ¥±Ñ•É…Ð¡…Ð¥ôÍÑå±”õíìÁ…‘‘¥¹œè€œÑÁà€ÄÁÁàœ°‰½É‘•ÉI…‘¥ÕÌè€Ø°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬€¡™¥±Ñ•É…Ð€ôôô…Ð€üŒ¹…Œ€èŒ¹‰‘È¤°‰…­É½Õ¹è™¥±Ñ•É…Ð€ôôô…Ð€üŒ¹…Œ€¬€œÄàœ€è€ÑÉ…¹ÍÁ…É•¹Ðœ°½±½Èè™¥±Ñ•É…Ð€ôôô…Ð€üŒ¹…Œ€èŒ¹ÍÕˆ°™½¹ÑM¥é”è€ÄÄ°ÕÉÍ½Èè€Á½¥¹Ñ•Èœõôùí…Ð€„ôô€±°œ€˜˜€ñÍÁ…¸ÍÑå±”õíì‘¥ÍÁ±…äè€¥¹±¥¹”µ‰±½¬œ°Ý¥‘Ñ è€à°¡•¥¡Ðè€à°‰½É‘•ÉI…‘¥ÕÌè€œÔÀ”œ°‰…­É½Õ¹è…Ñ½±½ÉÍm…Ñt°µ…É¥¹I¥¡Ðè€Ðõô€¼ùõí…Ñôð½‰ÕÑÑ½¸ø¥ô(€€€€€€€€ð½‘¥Øø(€€€€€€€íímì±…‰•°è€!¥ AÉ¥½É¥Ñäœ°¥Ñ•µÌè¡¥¨°½±½ÈèŒ¹‘…¹•Èô°ì±…‰•°è€5•‘¥Õ´œ°¥Ñ•µÌèµ•°½±½ÈèŒ¹Ý…É¸ô°ì±…‰•°è€1½Ý•Èœ°¥Ñ•µÌè±½Ü°½±½ÈèŒ¹ÍÕˆõt¹µ…À ¡œ¤€ôøœ¹¥Ñ•µÌ¹±•¹Ñ €ø€À€˜˜€ñ‘¥Ø­•äõíœ¹±…‰•±ôøñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÄ°™½¹Ñ]•¥¡Ðè€ØÀÀ°½±½Èèœ¹½±½È°Ñ•áÑQÉ…¹Í™½É´è€ÕÁÁ•É…Í”œ°±•ÑÑ•ÉMÁ…¥¹œè€À¸à°µ…É¥¹	½ÑÑ½´è€à°µ…É¥¹Q½Àè€ÄÈ°‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°…Àè€ØõôøñÍÁ…¸ÍÑå±”õíìÝ¥‘Ñ è€Ø°¡•¥¡Ðè€Ø°‰½É‘•ÉI…‘¥ÕÌè€œÔÀ”œ°‰…­É½Õ¹èœ¹½±½Èõô€¼øíœ¹±…‰•±ô€¡íœ¹¥Ñ•µÌ¹±•¹Ñ¡ô¤ð½‘¥Øùííœ¹¥Ñ•µÌ¹µ…À ¡Ð¤€ôøÉ•¹‘•ÉQ…Í¬¡Ð°ì‘É…œèÑÉÕ”ô¤¥ôð½‘¥Øùô(€€€€€€€ô(€€€€€€€í™¥±Ñ•É•¹±•¹Ñ €ôôô€À€˜˜€ñ‘¥ØÍÑå±”õíìÑ•áÑ±¥¸è€•¹Ñ•Èœ°Á…‘‘¥¹œè€ÐÀ°½±½ÈèŒ¹ÍÕˆõôù9¼Ñ…Í­Ìµ…Ñ ™¥±Ñ•ÉÌ¸ð½‘¥Øùô(€€€€€€ð½‘¥Øø(€€€€¤ì(€ôì((€€¼¼ƒŠRŠRŠR AèIRE-P€T’ÒU•ò¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥ 8¥   const renderReview = () => {
    const cc = done.length, totalTime = done.reduce((s, t) => s + t.time, 0);
    const catCounts = cats.reduce((a, cat) => { a[cat] = done.filter((t) => t.cat === cat).length; return a; }, {});
    const maxCat = Math.max(...Object.values(catCounts), 1);
    const rolledOver = tasks.filter((t) => !t.done && t.age >= 5).sort((a, b) => b.age - a.age).slice(0, 5);
    return (
      <div style={{ overflowY: 'auto', height: '100%', padding: '0 4px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[{ label: 'Completed', value: cc, icon: Check, color: c.ok }, { label: 'Time Saved', value: fmt(totalTime), icon: Clock, color: c.acc }, { label: 'Active', value: active.length, icon: Target, color: c.warn }].map((s) => <div key={s.label} style={{ flex: 1, background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}><s.icon size={18} color={s.color} style={{ marginBottom: 6 }} /><div style={{ fontSize: 20, fontWeight: 700, color: c.txt }}>{s.value}</div><div style={{ fontSize: 11, color: c.sub }}>{s.label}</div></div>)_}
        </div>
        <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.txt, marginBottom: 12 }}>By Category</div>
          {cats.map((cat) => <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><span style={{ fontSize: 12, color: c.txt, width: 70 }}>{cat}</span><div style={{ flex: 1, height: 8, background: c.bdr, borderRadius: 4, overflow: 'hidden' }}><div style={{ width: ((catCounts[cat] || 0) / maxCat) * 100 + '%', height: '100%', background: catColors[cat], borderRadius: 4 }} /></div><span style={{ fontSize: 12, color: c.sub, width: 20, textAlign: 'right' }}>{catCounts[cat] || 0}</span></div>)}
        </div>
        {rolledOver.length > 0 && <div style={{ background: c.card, border: '1px solid ' + c.bdr, borderRadius: 10, padding: 16, marginBottom: 16 }}><div style={{ fontSize: 13, fontWeight: 600, color: c.txt, marginBottom: 10 }}>Rolled Over</div>{rolledOver.map((t) => <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0x, borderBottom: '1px solid ' + c.bdr }}><span style={{ fontSize: 12, color: c.txt }}>{t.title}</span><span style={{ fontSize: 11, color: t.age >= 10 ? c.danger : c.warn }}>{t.age}d old</span></div>)}</div>}
      </div>
  
  ( €¤ì(€€(€½¹ÍÐÍÑ…‰Ì€ômì¥è€½¹Ñ•áÐœ°±…‰•°è€5ä½¹Ñ•áÐœ°¥½¸èQ…É•Ðô°ì¥è€ÁÉ½™¥±”œ°±…‰•°è€AÉ½™¥±”œ°¥½¸èUÍ•Èô°ì¥è€ÁÉ•™Ìœ°±…‰•°è€AÉ•™•É•¹•Ìœ°¥½¸èM•ÑÑ¥¹Ìõtì(€½¹ÍÐÉ•¹‘•ÉM•ÑÑ¥¹Ì€ô€ ¤€ôø€ (€€€€ñ‘¥ØÍÑå±”õíì½Ù•É™±½Ýdè€…ÕÑ¼œ°¡•¥¡Ðè€œÄÀÀ”œ°Á…‘‘¥¹œè€œÀ€ÑÁàœõôø(€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…Àè€Ð°µ…É¥¹	½ÑÑ½´è€ÄØ°‰…­É½Õ¹èŒ¹…É°‰½É‘•ÉI…‘¥ÕÌè€à°Á…‘‘¥¹œè€Ð°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬Œ¹‰‘Èõôø(€€€€€€€íÍÑ…‰Ì¹µ…À ¡Ñ…ˆ¤€ôø€ñ‰ÕÑÑ½¸­•äõíÑ…ˆ¹¥‘ô½¹±¥¬õì ¤€ôøÍ•ÑM•ÑÑ¥¹ÍQ…ˆ¡Ñ…ˆ¹¥¥ôÍÑå±”õíì™±•àè€Ä°‘¥ÍÁ±…äè€™±•àœ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°©ÕÍÑ¥™å½¹Ñ•¹Ðè€•¹Ñ•Èœ°…Àè€Ø°Á…‘‘¥¹œè€œáÁà€Àœ°‰½É‘•ÉI…‘¥ÕÌè€Ø°‰½É‘•Èè€¹½¹”œ°‰…­É½Õ¹èÍ•ÑÑ¥¹ÍQ…ˆ€ôôôÑ…ˆ¹¥€üŒ¹…Œ€¬€œÄàœ€è€ÑÉ…¹ÍÁ…É•¹Ðœ°½±½ÈèÍ•ÑÑ¥¹ÍQ…ˆ€ôôôÑ…ˆ¹¥€üŒ¹…Œ€èŒ¹ÍÕˆ°™½¹ÑM¥é”è€ÄÈ°™½¹Ñ]•¥¡Ðè€ÔÀÀ°ÕÉÍ½Èè€Á½¥¹Ñ•ÈœõôøñÑ…ˆ¹¥½¸Í¥é”õìÄÑô€¼øíÑ…ˆ¹±…‰•±ôð½‰ÕÑÑ½¸ø¥ô(€€€€€€ð½‘¥Øø(€€€€€ìÍ•ÑÑ¥¹ÍQ…ˆ€ôôô€½¹Ñ•áÐœ€˜˜€ñ‘¥Øø(€€€€€€€ímì­•äè€±¥™•½…±Ìœ°±…‰•°è€1¥™”½…±Ìœ°Á è€1½¹œµÑ•É´±¥™”½…±Ìüœô°ì­•äè€ÕÉÉ•¹Ñ½ÕÌœ°±…‰•°è€ÕÉÉ•¹Ð½ÕÌœ°Á è€]¡…Ð…É”å½Ô™½ÕÍ•½¸üœô°ì­•äè€…‰½ÕÑ5”œ°±…‰•°è€‰½ÕÐ5”œ°Á è€]¡¼…É”å½Ôüœõt¹µ…À ¡˜¤€ôø€ñ‘¥Ø­•äõí˜¹­•åôÍÑå±”õíìµ…É¥¹	½ÑÑ½´è€ÄÐõôøñ±…‰•°ÍÑå±”õíì™½¹ÑM¥é”è€ÄÈ°™½¹Ñ]•¥¡Ðè€ØÀÀ°½±½ÈèŒ¹ÑáÐ°µ…É¥¹	½ÑÑ½´è€Ð°‘¥ÍÁ±…äè€‰±½¬œõôùí˜¹±…‰•±ôð½±…‰•°øñÑ•áÑ…É•„Ù…±Õ”õíÕÍ•ÉÑám˜¹­•åuô½¹¡…¹”õì¡”¤€ôøÍ•ÑUÍ•ÉÑà ¡À¤€ôø€¡ì€¸¸¹À°m˜¹­•åtè”¹Ñ…É•Ð¹Ù…±Õ”ô¤¥ôÁ±…•¡½±‘•Èõí˜¹Á¡ôÍÑå±”õíìÝ¥‘Ñ è€œÄÀÀ”œ°µ¥¹!•¥¡Ðè€ØÀ°Á…‘‘¥¹œè€ÄÀ°‰½É‘•ÉI…‘¥ÕÌè€à°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬Œ¹‰‘È°‰…­É½Õ¹èŒ¹…É°½±½ÈèŒ¹ÑáÐ°™½¹ÑM¥é”è€ÄÈ°É•Í¥é”è€Ù•ÉÑ¥…°œ°½ÕÑ±¥¹”è€¹½¹”œ°±¥¹•!•¥¡Ðè€Ä¸Ô°‰½áM¥é¥¹œè€‰½É‘•Èµ‰½àœõô€¼øð½‘¥Øø¥ô(€€€€€€€€ñ‘¥ØÍÑå±”õíìµ…É¥¹	½ÑÑ½´è€ÄÐõôøñ±…‰•°ÍÑå±”õíì™½¹ÑM¥é”è€ÄÈ°™½¹Ñ]•¥¡Ðè€ØÀÀ°½±½ÈèŒ¹ÑáÐ°µ…É¥¹	½ÑÑ½´è€Ø°‘¥ÍÁ±…äè€‰±½¬œõôùAÉ¥½É¥Ñä…Ñ•½É¥•Ì€ ¬ÄÔ”‰½½ÍÐ¤ð½±…‰•°øñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…Àè€Ø°™±•á]É…Àè€ÝÉ…Àœõôùí…ÑÌ¹µ…À ¡…Ð¤€ôø€ñ‰ÕÑÑ½¸­•äõí…Ñô½¹±¥¬õì ¤€ôøÍ•ÑUÍ•ÉÑà ¡À¤€ôø€¡ì€¸¸¹À°‰½½ÍÑ…ÑÌèÀ¹‰½½ÍÑ…ÑÌ¹¥¹±Õ‘•Ì¡…Ð¤€üÀ¹‰½½ÍÑ…ÑÌ¹™¥±Ñ•È ¡à¤€ôøà€„ôô…Ð¤€èl¸¸¹À¹‰½½ÍÑ…ÑÌ°…Ñtô¤¥ôÍÑå±”õíìÁ…‘‘¥¹œè€œÑÁà€ÄÁÁàœ°‰½É‘•ÉI…‘¥ÕÌè€Ø°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬€¡ÕÍ•ÉÑà¹‰½½ÍÑ…ÑÌ¹¥¹±Õ‘•Ì¡…Ð¤€ü…Ñ½±½ÉÍm…Ñt€èŒ¹‰‘È¤°‰…­É½Õ¹èÕÍ•ÉÑà¹‰½½ÍÑ…ÑÌ¹¥¹±Õ‘•Ì¡…Ð¤€ü…Ñ½±½ÉÍm…Ñt€¬€œÄàœ€è€ÑÉ…¹ÍÁ…É•¹Ðœ°½±½ÈèÕÍ•ÉÑà¹‰½½ÍÑ…ÑÌ¹¥¹±Õ‘•Ì¡…Ð¤€ü…Ñ½±½ÉÍm…Ñt€èŒ¹ÍÕˆ°™½¹ÑM¥é”è€ÄÄ°ÕÉÍ½Èè€Á½¥¹Ñ•Èœõôùí…Ñôð½‰ÕÑÑ½¸ø¥ôð½‘¥Øøð½‘¥Øø(€€€€€€€€ñ‰ÕÑÑ½¸½¹±¥¬õì ¤€ôøìÍ•ÑÑáM…Ù•¡ÑÉÕ”¤ìÍ•ÑQ¥µ•½ÕÐ  ¤€ôøÍ•ÑÑáM…Ù•¡™…±Í”¤°€ÈÀÀÀ¤ìõôÍÑå±”õíì‰…­É½Õ¹èŒ¹…Œ°‰½É‘•Èè€¹½¹”œ°½±½Èè€œ™™˜œ°Á…‘‘¥¹œè€œáÁà€ÈÁÁàœ°‰½É‘•ÉI…‘¥ÕÌè€à°™½¹ÑM¥é”è€ÄÌ°™½¹Ñ]•¥¡Ðè€ØÀÀ°ÕÉÍ½Èè€Á½¥¹Ñ•ÈœõôùíÑáM…Ù•€ü€M…Ù•„œ€è€M…Ù”½¹Ñ•áÐôð½‰ÕÑÑ½¸ø(€€€€€€ð½‘¥Øùô(€€€€€íÍ•ÑÑ¥¹ÍQ…ˆ€ôôô€ÁÉ½™¥±”œ€˜˜€ñ‘¥Øùímì°è€9…µ”œ°Øè€…¹¥•°œô°ì°è€½µÁ…¹¥•Ìœ°Øè€Q…¹…½È)”{YÌœ°€¬½Ñ¡•ÉÌœô°ì°è€µ…¥°œ°Øè€‘…¹¥•±µÑ…¹…½É©•Ý•±Éä¹½´œõt¹µ…À ¡˜¤€ôø€ñ‘¥Ø­•äõí˜¹±ôÍÑå±”õíìµ…É¥¹	½ÑÑ½´è€ÄÐõôøñ±…‰•°ÍÑå±”õíì™½¹ÑM¥é”è€ÄÈ°™½¹Ñ]•¥¡Ðè€ØÀÀ°½±½ÈèŒ¹ÑáÐ°µ…É¥¹	½ÑÑ½´è€Ð°‘¥ÍÁ±…äè€‰±½¬œõôùí˜¹±ôð½±…‰•°øñ‘¥ØÍÑå±”õíìÁ…‘‘¥¹œè€œáÁà€ÄÁÁàœ°‰½É‘•ÉI…‘¥ÕÌè€à°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬Œ¹‰‘È°‰…­É½Õ¹èŒ¹…É°½±½ÈèŒ¹ÍÕˆ°™½¹ÑM¥é”è€ÄÌõôùí˜¹Ùôð½‘¥Øøð½‘¥Øø¥ôð½‘¥Øùô(€€€€€íÍ•ÑÑ¥¹ÍQ…ˆ€ôôô€ÁÉ•™Ìœ€˜˜€ñ‘¥Øø(€€€€€€€€ñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°©ÕÍÑ¥™å½¹Ñ•¹Ðè€ÍÁ…”µ‰•ÑÝ••¸œ°…±¥¹%Ñ•µÌè€•¹Ñ•Èœ°Á…‘‘¥¹œè€œÄÁÁà€Àœ°‰½É‘•É	½ÑÑ½´è€œÅÁàÍ½±¥€œ€¬Œ¹‰‘È°µ…É¥¹	½ÑÑ½´è€ÄÈõôøñ‘¥Øøñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÌ°™½¹Ñ]•¥¡Ðè€ÔÀÀ°½±½ÈèŒ¹ÑáÐõôùQ¡•µ”ð½‘¥Øøð½‘¥Øøñ‘¥ØÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°…Àè€ØõôùímìÙ…°è€±¥¡Ðœ°±‰°è€1¥¡Ðœô°ìÙ…°è€Ý…É´œ°±‰°è€]…É´œô°ìÙ…°è€‘…É¬œ°±‰°è€…É¬œõt¹µ…À ¡Ð¤€ôø€ñ‰ÕÑÑ½¸­•äõíÐ¹Ù…±ô½¹±¥¬õì ¤€ôøÍ•Ñ…É¬¡Ð¹Ù…°¥ôÍÑå±”õíìÁ…‘‘¥¹œè€œÑÁà€ÄÁÁàœ°‰½É‘•ÉI…‘¥ÕÌè€Ø°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬€¡‘…É¬€ôôôÐ¹Ù…°€üŒ¹…Œ€èŒ¹‰‘È¤°‰…­É½Õ¹è‘…É¬€ôôôÐ¹Ù…°€üŒ¹…Œ€¬€œÄàœ€è€ÑÉ…¹ÍÁ…É•¹Ðœ°½±½Èè‘…É¬€ôôôÐ¹Ù…°€üŒ¹…Œ€èŒ¹ÍÕˆ°™½¹ÑM¥é”è€ÄÄ°ÕÉÍ½Èè€Á½¥¹Ñ•ÈœõôùíÐ¹±‰±ôð½‰ÕÑÑ½¸ø¥ôð½‘¥Øøð½‘¥Øø(€€€€€€€€ñ‘¥ØÍÑå±”õíìÁ…‘‘¥¹œè€œÄÁÁà€Àœ°‰½É‘•É	½ÑÑ½´è€œÅÁàÍ½±¥€œ€¬Œ¹‰‘È°µ…É¥¹	½ÑÑ½´è€ÄÈõôøñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÌ°™½¹Ñ]•¥¡Ðè€ÔÀÀ°½±½ÈèŒ¹ÑáÐõôù$5½‘•°ð½‘¥Øøñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÄ°½±½ÈèŒ¹ÍÕˆõôù±…Õ‘”=ÁÕÌ€Ð¸Øð½‘¥Øøð½‘¥Øø(€€€€€€€€ñ‘¥ØÍÑå±”õíìÁ…‘‘¥¹œè€œÄÁÁà€Àœõôøñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÌ°™½¹Ñ]•¥¡Ðè€ÔÀÀ°½±½ÈèŒ¹ÑáÐõôùM½É¥¹œð½‘¥Øøñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÄ°½±½ÈèŒ¹ÍÕˆ°±¥¹•!•¥¡Ðè€Ä¸Ôõôù	…Í”™½ÉµÕ±„€¬€ÄÔ”…Ñ•½Éä‰½½ÍÐ€¬¡…É‘•…‘±¥¹”½Ù•ÉÉ¥‘”ð½‘¥Øøð½‘¥Øø(€€€€€€ð½‘¥Øùô(€€€€ð½‘¥Øø(€€(€€<¦öÆ÷#Ò"6ffb"óçÓÂöF—cãÇ7â7G–ÆS×·²föçE6—¦S¢"Â6öÆ÷#¢2æFöæRò2ç7V"¢2çG‡BÂFW‡DFV6÷&F–öã¢2æFöæRòvÆ–æR×F‡&÷Vv‚r¢væöæRr×Óç·2çF—FÆWÓÂ÷7ããÂöF—câ—Ð¢ÆF—b7G–ÆS×·²F—7Æ“¢vfÆW‚rÂv¢bÂFF–æs¢sg‚‚rÂ&÷&FW%F÷¢s‚6öÆ–Br²2æ&G"×ÓãÆ–çWBfÇVS×·7V$–çWGÒöä6†ævS×²†R’Óâ6WE7V$–çWB†RçF&vWBçfÇVR—Òöä¶W”F÷vã×²†R’Óâ²–b†Ræ¶W’ÓÓÒtVçFW"r’²Rç7F÷&÷vF–öâ‚“²FE7V'F6²‡Bæ–B“²Ò×Òöä6Æ–6³×²†R’ÓâRç7F÷&÷vF–öâ‚—ÒÆ6V†öÆFW#Ò$FB7V'F6²âââ"7G–ÆS×·²fÆWƒ¢Â&6¶w&÷VæC¢wG&ç7&VçBrÂ&÷&FW#¢væöæRrÂ6öÆ÷#¢2çG‡BÂföçE6—¦S¢"Â÷WFÆ–æS¢væöæRr×ÒóãÆ'WGFöâöä6Æ–6³×²†R’Óâ²Rç7F÷&÷vF–öâ‚“²FE7V'F6²‡Bæ–B“²×Ò7G–ÆS×·²&6¶w&÷VæC¢wG&ç7&VçBrÂ&÷&FW#¢væöæRrÂ6öÆ÷#¢2æ62Â7W'6÷#¢wö–çFW"rÂFF–æs¢×ÓãÅÇW26—¦S×³GÒóãÂö'WGFöããÂöF—cà¢ÂöF—cà¢ÂöF—cà¢—Ð¢ÆF—b7G–ÆS×·²F—7Æ“¢vfÆW‚rÂv¢‚ÂÖ&v–ä&÷GFöÓ¢"×Óà¢µ·²Ã¢t–×7BrÂc¢Bæ–×7BÒÂ²Ã¢uW&vVæ7’rÂc¢BçW&vVæ7’ÒÂ²Ã¢tVff÷'BrÂc¢BæVff÷'BÒÂ²Ã¢u66÷&RrÂc¢66÷&R‡B’ÕÒæÖ‚†"’ÓâÆF—b¶W“×¶"æÇÒ7G–ÆS×·²fÆWƒ¢ÂFW‡DÆ–vã¢v6VçFW"rÂFF–æs¢sg‚rÂ&÷&FW%&F—W3¢bÂ&6¶w&÷VæC¢2æ&rÂ&÷&FW#¢s‚6öÆ–Br²2æ&G"×ÓãÆF—b7G–ÆS×·²föçE6—¦S¢Â6öÆ÷#¢2ç7V"ÂÖ&v–ä&÷GFöÓ¢"×Óç¶"æÇÓÂöF—cãÆF—b7G–ÆS×·²föçE6—¦S¢BÂföçEvV–v‡C¢sÂ6öÆ÷#¢"æÂÓÓÒu66÷&Rrò2æ62¢2çG‡B×Óç¶"çgÓÂöF—cãÂöF—câ—Ð¢ÂöF—cà¢Æ'WGFöâöä6Æ–6³×²†R’Óâ²Rç7F÷&÷vF–öâ‚“²FVÆWFUF6²‡Bæ–B“²×Ò7G–ÆS×·²F—7Æ“¢vfÆW‚rÂÆ–vä—FV×3¢v6VçFW"rÂv¢bÂ&6¶w&÷VæC¢wG&ç7&VçBrÂ&÷&FW#¢væöæRrÂ6öÆ÷#¢2æFævW"ÂföçE6—¦S¢"Â7W'6÷#¢wö–çFW"rÂFF–æs¢sG‚r×ÓãÅG&6ƒ"6—¦S×³7ÒóâFVÆWFRF6³Âö'WGFöãà¢ÂöF—cà¢ ùMÈÈ›ÛÚ^™NˆL‹ÛÛÜŽˆËœÝX‹ÚYˆŒ_OžØØ]OÜÜ[]ˆÝ[O^ÞÈ›^ˆKZYÚˆ˜XÚÙÜ›Ý[™ˆË˜™‹›Ü™\”˜Y]\ÎˆÝ™\™›ÝÎˆ	ÚY[‰È_O]ˆÝ[O^ÞÈÚYˆ

Ø]ÛÝ[ÖØØ]H
HÈX^Ø]
H
ˆL
È	ÉIËZYÚˆ	ÌL	IË˜XÚÙÜ›Ý[™ˆØ]ÛÛÜœÖØØ]K›Ü™\”˜Y]\Îˆ_HÏÙ]Ü[ˆÝ[O^ÞÈ›ÛÚ^™NˆL‹ÛÛÜŽˆËœÝX‹ÚYˆŒ^[YÛŽˆ	ÜšYÚ	È_OžØØ]ÛÝ[ÖØØ]HOÜÜ[Ù]Š_BˆÙ]‚ˆÜ›ÛYÝ™\‹›[™Ýˆ	‰ˆ]ˆÝ[O^ÞÈ˜XÚÙÜ›Ý[™ˆË˜Ø\™›Ü™\Žˆ	Ì\ÛÛY	È
ÈË˜™‹›Ü™\”˜Y]\ÎˆLY[™ÎˆM‹X\™Ú[›ÝÛNˆMˆ_O]ˆÝ[O^ÞÈ›ÛÚ^™NˆLË›ÛÙZYÚˆŒÛÛÜŽˆËX\™Ú[›ÝÛNˆL_O”›ÛYÝ™\Ù]žÜ›ÛYÝ™\‹›X\


HOˆ]ˆÙ^O^ÝšYHÝ[O^ÞÈ\Ü^Nˆ	Ù›^	Ë\ÝYžPÛÛ[ˆ	ÜÜXÙKX™]ÙY[‰ËY[™Îˆ	Î	Ë›Ü™\›ÝÛNˆ	Ì\ÛÛY	È
ÈË˜™ˆ_OÜ[ˆÝ[O^ÞÈ›ÛÚ^™NˆL‹ÛÛÜŽˆË_OžÝ]_OÜÜ[Ü[ˆÝ[O^ÞÈ›ÛÚ^™NˆLKÛÛÜŽˆ˜YÙHHLÈË™[™Ù\ˆˆËØ\›ˆ_OžÝ˜YÙ_YÛÜÜ[Ù]Š_OÙ]ŸBˆÙ]‚ˆˆØ0óÃ/ÞØXÚO×ØXÚNˆ›Ë\ÝÜ™KÙ[XÝÚ\˜XÝ\œË›ËXØXÚBˆØXÚKPÛÛ›Ûˆ›Ë\ÝÜ™KÙ[XÝXÚ\˜XÝ\œË›ËXØXÚBˆØXÚKXÛØÚÎˆ›Ûˆ[OÈÑÑÑŒ‘QŒŒÑŽŽÍÎQŽMÌÌŒÍÑŒBMBFÆr²föçE6—¦S¢"Â6öÆ÷#¢2ç7V"Âv–GFƒ¢c×Óç¶6GÓÂ÷7ããÆF—b7G–ÆS×·²fÆWƒ¢Â†V–v‡C¢‚Â&6¶w&÷VæC¢2æ&G"Â&÷&FW%&F—W3¢BÂ÷fW&fÆ÷s¢v†–FFVâr×ÓãÆF—b7G–ÆS×·²v–GFƒ¢‚†6D6÷VçG5¶6EÒÇÂ’òÖ„6B’¢²rRrÂ†V–v‡C¢sRrÂ&6¶w&÷VæC¢6D6öÆ÷'5¶6EÒÂ&÷&FW%&F—W3¢B×ÒóãÂöF—cãÇ7â7G–ÆS×·²föçE6—¦S¢"Â6öÆ÷#¢2ç7V"Âv–GFƒ¢#ÂFW‡DÆ–vã¢w&–v‡Br×Óç¶6D6÷VçG5¶6EÒÇÂÓÂ÷7ããÂöF—câ—Ð¢ÂöF—cà¢·&öÆÆVD÷fW"æÆVæwF‚âbbÆF—b7G–ÆS×·²&6¶w&÷VæC¢2æ6&BÂ&÷&FW#¢s‚6öÆ–Br²2æ&G"Â&÷&FW%&F—W3¢ÂFF–æs¢bÂÖ&v–ä&÷GFöÓ¢b×ÓãÆF—b7G–ÆS×·²föçE6—¦S¢2ÂföçEvV–v‡C¢cÂ6öÆ÷#¢2çG‡BÂÖ&v–ä&÷GFöÓ¢×Óå&öÆÆVB÷fW#ÂöF—cç·&öÆÆVD÷fW"æÖ‚‡B’ÓâÆF—b¶W“×·Bæ–GÒ7G–ÆS×·²F—7Æ“¢vfÆW‚rÂ§W7F–g”6öçFVçC¢w76RÖ&WGvVVârÂFF–æs¢s‡‚rÂ&÷&FW$&÷GFöÓ¢s‚6öÆ–Br²2æ&G"×ÓãÇ7â7G–ÆS×·²föçE6—¦S¢"Â6öÆ÷#¢2çG‡B×Óç·BçF—FÆWÓÂ÷7ããÇ7â7G–ÆS×·²föçE6—¦S¢Â6öÆ÷#¢BævRãÒò2æFævW"¢2çv&â×Óç·BævWÖBöÆCÂ÷7ããÂöF—câ—ÓÂöF—cçÐ¢ÂöF—cà¢ ¢ö<ðË÷„66†SõÅ„66†S¢æò×7F÷&RÂ6VÆV7B6†&7FW'2ÂæòÖ66†P¢„66†RÔ6öçG&öÃ¢æò×7F÷&RÂ6VÆV7BÖ6†&7FW'2ÂæòÖ66†P¢„66†RÖ6Æö6³¢æöâFÆSò4D4tc$Tc#4C#ƒƒ#„3s„#Tc„ScC33#3tD#P“P‘±„Üì™½¹ÑM¥é”è€ÄÈ°½±½ÈèŒ¹ÍÕˆ°Ý¥‘Ñ è€ØÀõôùí…Ñôð½ÍÁ…¸øñ‘¥ØÍÑå±”õíì™±•àè€Ä°¡•¥¡Ðè€à°‰…­É½Õ¹èŒ¹‰‘È°‰½É‘•ÉI…‘¥ÕÌè€Ð°½Ù•É™±½Üè€¡¥‘‘•¸œõôøñ‘¥ØÍÑå±”õíìÝ¥‘Ñ è€ ¡…Ñ½Õ¹ÑÍm…Ñtñð€À¤€¼µ…á…Ð¤€¨€ÄÀÀ€¬€œ”œ°¡•¥¡Ðè€œÄÀÀ”œ°‰…­É½Õ¹è…Ñ½±½ÉÍm…Ñt°‰½É‘•ÉI…‘¥ÕÌè€Ðõô€¼øð½‘¥ØøñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄÈ°½±½ÈèŒ¹ÍÕˆ°Ý¥‘Ñ è€ÈÀ°Ñ•áÑ±¥¸è€É¥¡Ðœõôùí…Ñ½Õ¹ÑÍm…Ñtñð€Áôð½ÍÁ…¸øð½‘¥Øø¥ô(€€€€€€€€ð½‘¥Øø(€€€€€€€íÉ½±±•‘=Ù•È¹±•¹Ñ €ø€À€˜˜€ñ‘¥ØÍÑå±”õíì‰…­É½Õ¹èŒ¹…É°‰½É‘•Èè€œÅÁàÍ½±¥€œ€¬Œ¹‰‘È°‰½É‘•ÉI…‘¥ÕÌè€ÄÀ°Á…‘‘¥¹œè€ÄØ°µ…É¥¹	½ÑÑ½´è€ÄØõôøñ‘¥ØÍÑå±”õíì™½¹ÑM¥é”è€ÄÌ°™½¹Ñ]•¥¡Ðè€ØÀÀ°½±½ÈèŒ¹ÑáÐ°µ…É¥¹	½ÑÑ½´è€ÄÀõôùI½±±•=Ù•Èð½‘¥ØùíÉ½±±•‘=Ù•È¹µ…À ¡Ð¤€ôø€ñ‘¥Ø­•äõíÐ¹¥‘ôÍÑå±”õíì‘¥ÍÁ±…äè€™±•àœ°©ÕÍÑ¥™å½¹Ñ•¹Ðè€ÍÁ…”µ‰•ÑÝ••¸œ°Á…‘‘¥¹œè€œáÁà€Àœ°‰½É‘•É	½ÑÑ½´è€œÅÁàÍ½±¥€œ€¬Œ¹‰‘ÈõôøñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄÈ°½±½ÈèŒ¹ÑáÐõôùíÐ¹Ñ¥Ñ±•ôð½ÍÁ…¸øñÍÁ…¸ÍÑå±”õíì™½¹ÑM¥é”è€ÄÄ°½±½ÈèÐ¹…”€øô€ÄÀ€üŒ¹‘…¹•È€èŒ¹Ý…É¸õôùíÐ¹…•õ½±ð½ÍÁ…¸øð½‘¥Øø¥ôð½‘¥Øùô(€€€€€€ð½‘¥Øø(€€(€=ƒ@2ýá…¡”ýqa…¡”è¹¼µÍÑ½É”°Í•±•Ð¡…É…Ñ•ÉÌ°¹¼µ…¡”(€a…¡”µ½¹ÑÉ½°è¹¼µÍÑ½É”°Í•±•Ðµ¡…É…Ñ•ÉÌ°¹¼µ…¡”(€a…¡”µ±½¬è9½¸Q…±”üÉÈÍÈààÈáÜáÕáØÐÌÌÈÌÝÀÔ$Ô