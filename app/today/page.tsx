'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, ChevronDown, ChevronRight, ChevronLeft, Mic, Send, Sun, Moon, LayoutDashboard, ListTodo, Archive, Settings, Search, X, GripVertical, Clock, User, Target, Plus, ExternalLink, Trash2, BarChart3, AlertTriangle, Calendar, Circle, Zap, Brain, Sliders, Tag } from 'lucide-react';

// ─── TASK DATA ────────────────────────────────────────────────
const tasks0 = [
  { id: 1, title: 'Research True Classic competitor ads', cat: 'Business', impact: 9, urgency: 8, effort: 5, time: 60, age: 4, done: false, status: 'todo',
    notes: 'Look at their Facebook and YouTube ad creatives. Focus on hooks, offers, and CTAs.', link: 'https://www.facebook.com/ads/library', aiReason: 'High-impact competitive intel that directly affects your ad spend ROI.',
    dueDate: '2026-02-23', deadlineType: 'soft', confidence: 8, subtasks: [{ id: 101, title: 'Pull Facebook ad library data', done: false }, { id: 102, title: 'Analyze top 5 video hooks', done: false }, { id: 103, title: 'Draft findings doc', done: false }] }};