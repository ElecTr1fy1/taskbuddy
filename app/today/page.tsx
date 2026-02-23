'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Plus, Search, Settings, Sun, Moon, Zap, CheckCircle2, Circle, Clock, Flame, TrendingUp, Calendar, Trash2 } from 'lucide-react';

const TaskBuddyV10 = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Close Q1 business deals', cat: 'Business', impact: 10, urgency: 9, effort: 8, time: 240, done: false, status: 'active', notes: 'Follow up with 3 leads', link: 'crm.salesforce.com', dueDate: '2026-02-25', deadlineType: 'hard', confidence: 7, subtasks: ['Email follow-ups', 'Prepare proposals'] },
    { id: 2, title: 'Review investor deck', cat: 'Business', impact: 9, urgency: 8, effort: 6, time: 120, done: false, status: 'active', notes: 'Financial projections section', link: '', dueDate: '2026-02-24', deadlineType: 'hard', confidence: 8, subtasks: ['Check numbers', 'Add visuals'] },
    { id: 3, title: 'Plan marketing campaign', cat: 'Work', impact: 8, urgency: 7, effort: 7, time: 180, done: false, status: 'active', notes: 'Q1 content strategy', link: '', dueDate: '2026-02-28', deadlineType: 'soft', confidence: 6, subtasks: ['Brainstorm ideas', 'Create calendar'] },
    { id: 4, title: 'Write quarterly blog post', cat: 'Work', impact: 6, urgency: 5, effort: 5, time: 90, done: false, status: 'active', notes: 'Productivity tips for entrepreneurs', link: 'blog.taskbuddy.io', dueDate: '2026-03-01', deadlineType: 'soft', confidence: 8, subtasks: ['Research', 'Write draft', 'Edit'] },
    { id: 5, title: 'Morning meditation', cat: 'Health', impact: 7, urgency: 8, effort: 1, time: 15, done: false, status: 'active', notes: 'Headspace daily practice', link: '', dueDate: '2026-02-23', deadlineType: 'daily', confidence: 9, subtasks: [] },
    { id: 6, title: 'Gym session', cat: 'Health', impact: 7, urgency: 6, effort: 5, time: 60, done: false, status: 'active', notes: 'Upper body day', link: '', dueDate: '2026-02-23', deadlineType: 'daily', confidence: 6, subtasks: ['Warmup', 'Compound lifts', 'Core work'] },
    { id: 7, title: 'Doctor appointment', cat: 'Health', impact: 8, urgency: 7, effort: 2, time: 45, done: false, status: 'active', notes: 'Annual checkup', link: '', dueDate: '2026-02-25', deadlineType: 'hard', confidence: 9, subtasks: [] },
    { id: 8, title: 'Plan vacation', cat: 'Personal', impact: 6, urgency: 4, effort: 4, time: 60, done: false, status: 'active', notes: 'Summer trip ideas', link: '', dueDate: '2026-03-15', deadlineType: 'soft', confidence: 5, subtasks: ['Research destinations', 'Check flights'] },
    { id: 9, title: 'Call mom', cat: 'Personal', impact: 5, urgency: 5, effort: 1, time: 20, done: false, status: 'active', notes: 'Weekly check-in', link: '', dueDate: '2026-02-24', deadlineType: 'daily', confidence: 9, subtasks: [] },
    { id: 10, title: 'Organize desk', cat: 'Personal', impact: 4, urgency: 3, effort: 3, time: 45, done: false, status: 'active', notes: 'Clear clutter, file documents', link: '', dueDate: '2026-03-01', deadlineType: 'soft', confidence: 6, subtasks: ['Trash pile', 'File papers', 'Cable management'] },
    { id: 11, title: 'Update resume', cat: 'Work', impact: 7, urgency: 5, effort: 4, time: 75, done: false, status: 'active', notes: 'Add recent projects and skills', link: '', dueDate: '2026-03-10', deadlineType: 'soft', confidence: 7, subtasks: ['Update work history', 'Add achievements'] },
    { id: 12, title: 'Learn Next.js 14', cat: 'Work', impact: 8, urgency: 6, effort: 7, time: 150, done: false, status: 'active', notes: 'App Router deep dive', link: 'nextjs.org', dueDate: '2026-03-05', deadlineType: 'soft', confidence: 6, subtasks: ['Server components', 'Data fetching', 'Streaming'] }
  ]);

  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [currentView, setCurrentView] = useState('focus'); // focus | tasks | insights
  const [darkMode, setDarkMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(1500);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [streak, setStreak] = useState(5);
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', text: 'Hi! I notice you have some big deadlines coming up. Want help prioritizing?' }]);
  const [chatInput, setChatInput] = useState('');
  const [completionAnimation, setCompletionAnimation] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);
  const pomodoroIntervalRef = useRef(null);
  const confettiCanvasRef = useRef(null);

  // ============================================================================
  // CALCULATIONS & UTILITIES
  // ============================================================================

  const getPriorityScore = (task) => {
    return Math.round((task.impact * 0.4 + task.urgency * 0.4 + (10 - task.effort) * 0.2));
  };

  const getPriorityLevel = (task) => {
    const score = getPriorityScore(task);
    if (score >= 7) return { level: 'high', color: '#EF4444', dot: '🔴' };
    if (score >= 4) return { level: 'medium', color: '#F59E0B', dot: '🟡' };
    return { level: 'low', color: '#10B981', dot: '🟢' };
  };

  const getCategoryColor = (cat) => {
    const colors = {
      Business: '#EC4899',
      Work: '#06B6D4',
      Health: '#10B981',
      Personal: '#F59E0B'
    };
    return colors[cat] || '#6366F1';
  };

  const getTasksForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => !t.done && (t.dueDate === today || t.deadlineType === 'daily'));
  };

  const getCompletedCount = () => tasks.filter(t => t.done).length;
  const getTotalCount = () => tasks.length;
  const getProgressPercent = () => Math.round((getCompletedCount() / getTotalCount()) * 100);

  // ============================================================================
  // ANIMATIONS & EFFECTS
  // ============================================================================

  useEffect(() => {
    if (!pomodoroActive) return;
    pomodoroIntervalRef.current = setInterval(() => {
      setPomodoroTime(t => t > 0 ? t - 1 : 0);
    }, 1000);
    return () => clearInterval(pomodoroIntervalRef.current);
  }, [pomodoroActive]);

  // Confetti animation
  const createConfetti = (x, y) => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: x || canvas.width / 2,
        y: y || canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -12,
        life: 1,
        size: Math.random() * 6 + 2,
        color: ['#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#6366F1'][Math.floor(Math.random() * 5)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let hasParticles = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.015;

        if (p.life > 0) {
          hasParticles = true;
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      });

      ctx.globalAlpha = 1;
      if (hasParticles) requestAnimationFrame(animate);
    };

    animate();
  };

  const completeTask = (taskId) => {
    setCompletionAnimation(taskId);
    setTasks(tasks.map(t => t.id === taskId ? { ...t, done: true } : t));
    createConfetti();

    const timeoutId = setTimeout(() => {
      setUndoTimeout(null);
    }, 5000);
    setUndoTimeout(timeoutId);
  };

  const undoComplete = (taskId) => {
    if (undoTimeout) clearTimeout(undoTimeout);
    setTasks(tasks.map(t => t.id === taskId ? { ...t, done: false } : t));
    setCompletionAnimation(null);
    setUndoTimeout(null);
  };

  const startFocusMode = (taskId) => {
    setFocusTaskId(taskId);
    setFocusMode(true);
    setPomodoroTime(1500);
    setPomodoroActive(false);
  };

  const exitFocusMode = () => {
    setPomodoroActive(false);
    setFocusMode(false);
    setPomodoroTime(1500);
  };

  const sendChat = (text) => {
    if (!text.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', text }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Great question! Focus on the high-impact tasks first. You\'ve got this!' }]);
    }, 500);
  };

  // ============================================================================
  // RENDER: COLOR PALETTE
  // ============================================================================

  const colors = darkMode ? {
    bg: '#0F0F23',
    surface: '#1A1A2E',
    card: 'rgba(30, 30, 50, 0.7)',
    text: '#F5F5F7',
    textSecondary: '#A0A0A8',
    border: 'rgba(255, 255, 255, 0.1)',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    accent: '#EC4899'
  } : {
    bg: '#FAFBFF',
    surface: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.8)',
    text: '#0F0F23',
    textSecondary: '#64748B',
    border: 'rgba(0, 0, 0, 0.08)',
    primary: '#6366F1',
    primaryLight: '#818CF8',
    accent: '#EC4899'
  };

  // ============================================================================
  // RENDER: TASK CARD COMPONENT
  // ============================================================================

  const TaskCard = ({ task }) => {
    const isExpanded = expandedTaskId === task.id;
    const priority = getPriorityLevel(task);
    const categoryColor = getCategoryColor(task.cat);

    return (
      <div
        key={task.id}
        style={{
          display: completionAnimation === task.id ? 'none' : 'block',
          animation: completionAnimation === task.id ? 'fadeOut 0.3s ease-out' : 'none',
          marginBottom: '12px',
          transition: 'all 0.2s ease'
        }}
      >
        <div
          style={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '16px',
            borderLeft: `4px solid ${categoryColor}`,
            backdrop: 'blur(10px)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: 'translateY(0)',
            boxShadow: isExpanded ? `0 10px 30px rgba(0,0,0,0.1)` : 'none'
          }}
          onMouseEnter={(e) => {
            if (!isExpanded) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 20px rgba(99, 102, 241, 0.1)`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isExpanded) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {/* Main row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Checkbox */}
            <button
              onClick={() => completeTask(task.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}
            >
              <Circle size={24} color={colors.textSecondary} />
            </button>

            {/* Title & Priority */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: colors.text,
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {task.title}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: colors.textSecondary }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {task.time}m
                </span>
                <span style={{ fontSize: '18px' }}>{priority.dot}</span>
              </div>
            </div>

            {/* Expand button */}
            <button
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: colors.textSecondary,
                transition: 'transform 0.2s ease'
              }}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {/* Expanded content */}
          {isExpanded && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${colors.border}` }}>
              {/* Metadata grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
                <div>
                  <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>Impact</div>
                  <div style={{ color: colors.text, fontWeight: '600' }}>{task.impact}/10</div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>Urgency</div>
                  <div style={{ color: colors.text, fontWeight: '600' }}>{task.urgency}/10</div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>Effort</div>
                  <div style={{ color: colors.text, fontWeight: '600' }}>{task.effort}/10</div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>Priority Score</div>
                  <div style={{ color: colors.text, fontWeight: '600' }}>{getPriorityScore(task)}/10</div>
                </div>
              </div>

              {/* Notes */}
              {task.notes && (
                <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: `rgba(99, 102, 241, 0.1)`, borderRadius: '8px', fontSize: '13px', color: colors.text }}>
                  <strong style={{ display: 'block', marginBottom: '4px', color: colors.primary }}>Notes</strong>
                  {task.notes}
                </div>
              )}

              {/* Due date */}
              {task.dueDate && (
                <div style={{ marginBottom: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary }}>
                  <Calendar size={14} />
                  Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}

              {/* Subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '8px' }}>Subtasks</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {task.subtasks.map((subtask, i) => (
                      <li key={i} style={{ fontSize: '13px', color: colors.textSecondary, padding: '4px 0', paddingLeft: '20px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0 }}>•</span>
                        {subtask}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => startFocusMode(task.id)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: colors.primary,
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryLight}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                  Focus Mode
                </button>
                <button
                  onClick={() => completeTask(task.id)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    backgroundColor: '#10B981',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
                >
                  Mark Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: FOCUS MODE
  // ============================================================================

  if (focusMode && focusTaskId) {
    const task = tasks.find(t => t.id === focusTaskId);
    if (!task) return null;

    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    const progress = ((1500 - pomodoroTime) / 1500) * 100;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: darkMode ? 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)' : 'linear-gradient(135deg, #FAFBFF 0%, #F0F4FF 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        zIndex: 1000
      }}>
        {/* Exit button */}
        <button
          onClick={exitFocusMode}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: colors.text
          }}
        >
          ✕
        </button>

        {/* Task title */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: colors.text,
          marginBottom: '40px',
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          {task.title}
        </h2>

        {/* Timer circle */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          marginBottom: '40px'
        }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r="90" fill="none" stroke={colors.border} strokeWidth="8" />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={colors.primary}
              strokeWidth="8"
              strokeDasharray={`${(progress / 100) * 565.48} 565.48`}
              style={{ transition: 'stroke-dasharray 0.1s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: colors.text }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '14px', color: colors.textSecondary, marginTop: '8px' }}>
              {pomodoroActive ? 'Working' : 'Ready to start'}
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <button
            onClick={() => setPomodoroActive(!pomodoroActive)}
            style={{
              padding: '14px 32px',
              backgroundColor: colors.primary,
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryLight}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
          >
            {pomodoroActive ? 'Pause' : 'Start Working'}
          </button>
          <button
            onClick={() => {
              completeTask(task.id);
              exitFocusMode();
            }}
            style={{
              padding: '14px 32px',
              backgroundColor: '#10B981',
              color: '#FFF',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}
          >
            Done
          </button>
        </div>

        {/* Skip button */}
        <button
          onClick={() => {
            setFocusTaskId(null);
            const activeTaskIndex = tasks.findIndex(t => t.id === task.id);
            const nextTask = tasks.find((t, i) => i > activeTaskIndex && !t.done);
            if (nextTask) startFocusMode(nextTask.id);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            color: colors.textSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Next Task
        </button>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN VIEW
  // ============================================================================

  const todaysTasks = getTasksForToday();
  const activeTasks = tasks.filter(t => !t.done);

  return (
    <div style={{
      backgroundColor: colors.bg,
      color: colors.text,
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Confetti canvas */}
      <canvas
        ref={confettiCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 100
        }}
        width={typeof window !== 'undefined' ? window.innerWidth : 0}
        height={typeof window !== 'undefined' ? window.innerHeight : 0}
      />

      {/* Header */}
      <header style={{
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              background: `linear-gradient(135deg, ${colors.primary} 0%, #EC4899 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TaskBuddy
            </div>
            <div style={{
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#EC4899'
            }}>
              <Flame size={20} /> {streak}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: colors.card, padding: '4px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
              {['focus', 'tasks', 'insights'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCurrentView(tab)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: currentView === tab ? colors.primary : 'transparent',
                    color: currentView === tab ? '#FFF' : colors.textSecondary,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: colors.text,
                padding: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', display: 'flex', gap: '24px' }}>

        {/* Tasks panel (main) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {currentView === 'focus' && (
            <>
              {/* Today's overview */}
              <div style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>Today's Progress</h3>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: colors.primary }}>
                    {getCompletedCount()}/{getTotalCount()}
                  </span>
                </div>

                {/* Progress ring */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: colors.border,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${getProgressPercent()}%`,
                    background: `linear-gradient(90deg, ${colors.primary} 0%, #EC4899 100%)`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                {/* Quick stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>Today</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: colors.text }}>{todaysTasks.length}</div>
                  </div>
                  <div>
                    <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>Active</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: colors.text }}>{activeTasks.length}</div>
                  </div>
                  <div>
                    <div style={{ color: colors.textSecondary, marginBottom: '4px' }}>Time left</div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: colors.text }}>
                      {Math.round(activeTasks.reduce((sum, t) => sum + t.time, 0) / 60)}h
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks list */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: colors.text }}>Active Tasks</h3>
                <div>
                  {activeTasks.length > 0 ? (
                    activeTasks.sort((a, b) => getPriorityScore(b) - getPriorityScore(a)).map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  ) : (
                    <div style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      color: colors.textSecondary
                    }}>
                      <CheckCircle2 size={48} style={{ margin: '0 auto', marginBottom: '16px', opacity: 0.5 }} />
                      <p>All done! Great work!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Undo notification */}
              {undoTimeout && (
                <div style={{
                  position: 'fixed',
                  bottom: '20px',
                  left: '20px',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  padding: '16px 20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  zIndex: 40
                }}>
                  <span style={{ fontSize: '14px', color: colors.text }}>Task completed!</span>
                  <button
                    onClick={() => {
                      const completedTask = tasks.find(t => t.done);
                      if (completedTask) undoComplete(completedTask.id);
                    }}
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: colors.primary,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Undo
                  </button>
                </div>
              )}
            </>
          )}

          {currentView === 'tasks' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.text,
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(99, 102, 241, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {currentView === 'insights' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Weekly Activity</h3>
              <div style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                  {['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'].map((day, i) => (
                    <div key={day} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: '20px', marginBottom: '8px', opacity: i < 5 ? 1 : 0.5 }}>
                        {i < 5 ? '🟢' : '🟡'}
                      </div>
                      <div style={{ fontSize: '12px', color: colors.textSecondary }}>{day}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Stats</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, padding: '16px', borderRadius: '8px' }}>
                    <div style={{ color: colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>Completed This Week</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: colors.primary }}>28</div>
                  </div>
                  <div style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}`, padding: '16px', borderRadius: '8px' }}>
                    <div style={{ color: colors.textSecondary, fontSize: '13px', marginBottom: '8px' }}>Avg Time Per Task</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: colors.accent }}>45m</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Chat sidebar */}
        <div style={{ width: chatOpen ? '350px' : '0', transition: 'width 0.3s ease', overflow: 'hidden' }}>
          <div style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            height: '600px',
            width: '350px'
          }}>
            {/* Chat header */}
            <div style={{
              padding: '16px',
              borderBottom: `1px solid ${colors.border}`,
              fontWeight: '600',
              fontSize: '14px'
            }}>
              ✨ AI Assistant
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    backgroundColor: msg.role === 'user' ? colors.primary : colors.card,
                    color: msg.role === 'user' ? '#FFF' : colors.text,
                    borderRadius: '8px',
                    fontSize: '13px',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    animation: `slideIn 0.3s ease`,
                    wordWrap: 'break-word'
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '16px', borderTop: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat(chatInput)}
                  placeholder="Ask me..."
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    color: colors.text,
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => sendChat(chatInput)}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: colors.primary,
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat toggle button (floating) */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
              color: '#FFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: `0 10px 30px rgba(99, 102, 241, 0.3)`,
              transition: 'all 0.2s ease',
              zIndex: 40
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = `0 15px 40px rgba(99, 102, 241, 0.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 10px 30px rgba(99, 102, 241, 0.3)`;
            }}
          >
            ✨
          </button>
        )}
      </main>

      {/* Global styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        * {
          box-sizing: border-box;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        button {
          font-family: inherit;
        }

        input {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default TaskBuddyV10;
