import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Plus,
  Trash2,
  Check,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Target,
  Filter,
  CheckCircle2,
  X,
  Zap,
  Heart,
  BookOpen,
  Dumbbell,
  Coffee,
  Moon,
  Sun,
  Code
} from 'lucide-react';

// Pre-defined icons and color themes for habits
const ICON_OPTIONS = [
  { id: 'flame', label: 'Energy', icon: Flame },
  { id: 'dumbbell', label: 'Fitness', icon: Dumbbell },
  { id: 'book', label: 'Learning', icon: BookOpen },
  { id: 'heart', label: 'Wellness', icon: Heart },
  { id: 'code', label: 'Deep Work', icon: Code },
  { id: 'moon', label: 'Sleep', icon: Moon },
  { id: 'sun', label: 'Morning', icon: Sun },
  { id: 'coffee', label: 'Mindfulness', icon: Coffee },
];

const COLOR_OPTIONS = [
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500', softBg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', ring: 'ring-emerald-500/40', bar: '#10b981' },
  { id: 'violet', name: 'Violet', bg: 'bg-violet-500', softBg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30', ring: 'ring-violet-500/40', bar: '#8b5cf6' },
  { id: 'amber', name: 'Amber', bg: 'bg-amber-500', softBg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', ring: 'ring-amber-500/40', bar: '#f59e0b' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-500', softBg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', ring: 'ring-rose-500/40', bar: '#f43f5e' },
  { id: 'cyan', name: 'Cyan', bg: 'bg-cyan-500', softBg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', ring: 'ring-cyan-500/40', bar: '#06b6d4' },
];

const CATEGORIES = ['All', 'Health', 'Mindfulness', 'Growth', 'Productivity'];

// Generate 7 days of the current week (Mon - Sun)
const getWeekDays = (weekOffset = 0) => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sun, 1 is Mon
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateKey = d.toISOString().split('T')[0];
    const isToday = dateKey === now.toISOString().split('T')[0];
    return {
      dateKey,
      dayShort: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
      dayNumber: d.getDate(),
      monthShort: d.toLocaleDateString('en-US', { month: 'short' }),
      isToday,
    };
  });
};

// Build initial realistic data for the current week
const createInitialHabits = (weekDays) => {
  const d = (idx) => weekDays[idx]?.dateKey;
  return [
    {
      id: 'h-1',
      name: 'Morning Hydration & Stretch',
      category: 'Health',
      icon: 'sun',
      color: 'emerald',
      targetPerWeek: 7,
      completedDates: {
        [d(0)]: true,
        [d(1)]: true,
        [d(2)]: true,
        [d(3)]: true,
        [d(4)]: true,
        [d(5)]: false,
        [d(6)]: false,
      },
    },
    {
      id: 'h-2',
      name: '45m Strength or Cardio',
      category: 'Health',
      icon: 'dumbbell',
      color: 'rose',
      targetPerWeek: 5,
      completedDates: {
        [d(0)]: true,
        [d(1)]: false,
        [d(2)]: true,
        [d(3)]: true,
        [d(4)]: true,
        [d(5)]: false,
        [d(6)]: false,
      },
    },
    {
      id: 'h-3',
      name: 'Read 25 Pages Non-Fiction',
      category: 'Growth',
      icon: 'book',
      color: 'violet',
      targetPerWeek: 6,
      completedDates: {
        [d(0)]: true,
        [d(1)]: true,
        [d(2)]: true,
        [d(3)]: false,
        [d(4)]: true,
        [d(5)]: true,
        [d(6)]: false,
      },
    },
    {
      id: 'h-4',
      name: 'Deep Work Block (No Phone)',
      category: 'Productivity',
      icon: 'code',
      color: 'cyan',
      targetPerWeek: 5,
      completedDates: {
        [d(0)]: true,
        [d(1)]: true,
        [d(2)]: true,
        [d(3)]: true,
        [d(4)]: true,
        [d(5)]: true,
        [d(6)]: false,
      },
    },
    {
      id: 'h-5',
      name: 'Evening Wind-Down & Journal',
      category: 'Mindfulness',
      icon: 'moon',
      color: 'amber',
      targetPerWeek: 7,
      completedDates: {
        [d(0)]: false,
        [d(1)]: true,
        [d(2)]: true,
        [d(3)]: true,
        [d(4)]: false,
        [d(5)]: true,
        [d(6)]: false,
      },
    },
  ];
};

export default function App() {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('habit_pulse_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to read local storage', e);
    }
    return createInitialHabits(getWeekDays(0));
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDayIndex, setSelectedDayIndex] = useState(null); // For chart inspection
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New Habit Form State
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Health');
  const [newHabitIcon, setNewHabitIcon] = useState('flame');
  const [newHabitColor, setNewHabitColor] = useState('emerald');
  const [newHabitTarget, setNewHabitTarget] = useState(7);

  useEffect(() => {
    try {
      localStorage.setItem('habit_pulse_v1', JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits', e);
    }
  }, [habits]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Filtered habits by category
  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'All') return habits;
    return habits.filter((h) => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  // Calculate current streak and best streak for a habit across the visible week (and any logged dates)
  const calculateHabitStats = (habit) => {
    let currentStreak = 0;
    let bestStreakInWeek = 0;
    let running = 0;
    let completedInWeek = 0;

    weekDays.forEach((day) => {
      if (habit.completedDates?.[day.dateKey]) {
        completedInWeek += 1;
        running += 1;
        if (running > bestStreakInWeek) bestStreakInWeek = running;
      } else {
        running = 0;
      }
    });

    // Calculate active streak counting backwards from the latest completed day in the week
    let lastCompletedIndex = -1;
    for (let i = weekDays.length - 1; i >= 0; i--) {
      if (habit.completedDates?.[weekDays[i].dateKey]) {
        lastCompletedIndex = i;
        break;
      }
    }

    if (lastCompletedIndex !== -1) {
      for (let i = lastCompletedIndex; i >= 0; i--) {
        if (habit.completedDates?.[weekDays[i].dateKey]) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }

    const rate = Math.round((completedInWeek / 7) * 100);
    return { currentStreak, bestStreakInWeek, completedInWeek, rate };
  };

  // Toggle completion for a specific habit and dateKey
  const toggleHabitDate = (habitId, dateKey) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const nextVal = !h.completedDates?.[dateKey];
        return {
          ...h,
          completedDates: {
            ...h.completedDates,
            [dateKey]: nextVal,
          },
        };
      })
    );
  };

  // Mark all habits complete for today (or Monday if viewing another week)
  const completeAllForDay = (dateKey, dayLabel) => {
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        completedDates: {
          ...h.completedDates,
          [dateKey]: true,
        },
      }))
    );
    showToast(`All goals logged for ${dayLabel}!`);
  };

  // Handle adding a new habit
  const handleAddHabit = (e) => {
    e.preventDefault();
    const trimmed = newHabitName.trim();
    if (!trimmed) return;

    const newHabit = {
      id: `h-${Date.now()}`,
      name: trimmed,
      category: newHabitCategory,
      icon: newHabitIcon,
      color: newHabitColor,
      targetPerWeek: Number(newHabitTarget) || 7,
      completedDates: {},
    };

    setHabits((prev) => [newHabit, ...prev]);
    setNewHabitName('');
    setIsAddModalOpen(false);
    showToast(`Added "${trimmed}" to your dashboard`);
  };

  // Confirm habit deletion
  const confirmDeleteHabit = () => {
    if (!habitToDelete) return;
    const removedName = habitToDelete.name;
    setHabits((prev) => prev.filter((h) => h.id !== habitToDelete.id));
    setHabitToDelete(null);
    showToast(`Removed "${removedName}"`);
  };

  // Reset current week's check-ins
  const resetCurrentWeek = () => {
    setHabits((prev) =>
      prev.map((h) => {
        const updated = { ...h.completedDates };
        weekDays.forEach((d) => {
          delete updated[d.dateKey];
        });
        return { ...h, completedDates: updated };
      })
    );
    showToast('Cleared check-ins for this week');
  };

  // Aggregate weekly statistics for KPI cards and visual chart
  const weeklyAnalytics = useMemo(() => {
    const totalHabits = filteredHabits.length;
    const totalPossible = totalHabits * 7;

    let totalCompleted = 0;
    let longestActiveStreak = 0;
    let topHabit = null;

    const dailyStats = weekDays.map((day, idx) => {
      let count = 0;
      const completedHabitsList = [];
      filteredHabits.forEach((h) => {
        if (h.completedDates?.[day.dateKey]) {
          count += 1;
          completedHabitsList.push(h);
        }
      });
      const pct = totalHabits > 0 ? Math.round((count / totalHabits) * 100) : 0;
      return {
        ...day,
        idx,
        count,
        total: totalHabits,
        pct,
        completedHabitsList,
      };
    });

    filteredHabits.forEach((h) => {
      const stats = calculateHabitStats(h);
      totalCompleted += stats.completedInWeek;
      if (stats.currentStreak > longestActiveStreak) {
        longestActiveStreak = stats.currentStreak;
        topHabit = h;
      }
    });

    // Consecutive "Strong Days" (>= 60% of habits completed)
    let strongDayStreak = 0;
    let maxStrongDayStreak = 0;
    dailyStats.forEach((d) => {
      if (d.pct >= 60 && d.total > 0) {
        strongDayStreak += 1;
        if (strongDayStreak > maxStrongDayStreak) maxStrongDayStreak = strongDayStreak;
      } else {
        strongDayStreak = 0;
      }
    });

    const overallPercentage =
      totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    return {
      totalHabits,
      totalPossible,
      totalCompleted,
      overallPercentage,
      longestActiveStreak,
      topHabit,
      dailyStats,
      maxStrongDayStreak,
    };
  }, [filteredHabits, weekDays]);

  const getIconComponent = (iconId) => {
    const match = ICON_OPTIONS.find((item) => item.id === iconId);
    return match ? match.icon : Flame;
  };

  const getColorTheme = (colorId) => {
    return COLOR_OPTIONS.find((c) => c.id === colorId) || COLOR_OPTIONS[0];
  };

  const inspectedDay =
    selectedDayIndex !== null
      ? weeklyAnalytics.dailyStats[selectedDayIndex]
      : weeklyAnalytics.dailyStats.find((d) => d.isToday) ||
        weeklyAnalytics.dailyStats[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-16">
      {/* Subtle Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Header */}
      <header className="relative border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  StrideFlow
                </h1>
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Habit Studio
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Daily ritual tracker & weekly momentum analytics
              </p>
            </div>
          </div>

          {/* Week Switcher & Primary CTA */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setWeekOffset((w) => w - 1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Previous Week"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setWeekOffset(0)}
                className="px-3 py-1 text-xs sm:text-sm font-medium text-slate-200 hover:text-emerald-400 transition flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {weekDays[0].monthShort} {weekDays[0].dayNumber} –{' '}
                  {weekDays[6].monthShort} {weekDays[6].dayNumber}
                </span>
              </button>
              <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Next Week"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Habit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top KPI Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Overall Weekly Completion */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Weekly Completion
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {weeklyAnalytics.overallPercentage}%
                </span>
                <span className="text-xs text-emerald-400 font-medium">
                  {weeklyAnalytics.totalCompleted}/{weeklyAnalytics.totalPossible} logs
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {weeklyAnalytics.overallPercentage >= 80
                  ? 'Exceptional consistency this week!'
                  : weeklyAnalytics.overallPercentage >= 50
                  ? 'Solid momentum—keep stacking days!'
                  : 'Every single check-in counts.'}
              </p>
            </div>
            {/* SVG Circular Progress */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    26 *
                    (1 - weeklyAnalytics.overallPercentage / 100)
                  }
                  strokeLinecap="round"
                  fill="transparent"
                  className="text-emerald-400 transition-all duration-500"
                />
              </svg>
              <Target className="w-5 h-5 text-emerald-400 absolute" />
            </div>
          </div>

          {/* Card 2: Longest Active Habit Streak */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Top Habit Streak
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {weeklyAnalytics.longestActiveStreak}
                </span>
                <span className="text-sm font-semibold text-amber-400">
                  days
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 truncate max-w-[180px]">
                {weeklyAnalytics.topHabit
                  ? `Lead: ${weeklyAnalytics.topHabit.name}`
                  : 'Toggle a goal to start a streak'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400/20" />
            </div>
          </div>

          {/* Card 3: Strong Days Streak */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Power Day Streak
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {weeklyAnalytics.maxStrongDayStreak}
                </span>
                <span className="text-sm font-semibold text-violet-400">
                  days ≥ 60%
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Consecutive days hitting 60%+ goals
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Active Habits Count & Quick Action */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Active Rituals
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {weeklyAnalytics.totalHabits}
                </span>
                <span className="text-xs text-cyan-400 font-medium">
                  tracked goals
                </span>
              </div>
              <button
                onClick={resetCurrentWeek}
                className="mt-2 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset current week</span>
              </button>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Interactive Weekly Streak Chart & Daily Inspector */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Visual Weekly Streak Bar & Momentum Chart */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">
                    Weekly Streak & Momentum Chart
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any day bar to inspect completed habits or fast-log all goals
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  Power Day (≥60%)
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                  Building (&lt;60%)
                </span>
              </div>
            </div>

            {/* Interactive 7-Day Visual Chart */}
            <div className="relative pt-6 pb-2">
              {/* Horizontal Reference Lines */}
              <div className="absolute inset-x-0 top-6 bottom-12 flex flex-col justify-between pointer-events-none">
                {[100, 75, 50, 25, 0].map((val) => (
                  <div
                    key={val}
                    className="w-full border-b border-dashed border-slate-800/80 flex items-center"
                  >
                    <span className="text-[10px] text-slate-500 pr-2 -mt-4">
                      {val}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Bars Container */}
              <div className="relative z-10 grid grid-cols-7 gap-2 sm:gap-4 pl-7 h-52 items-end">
                {weeklyAnalytics.dailyStats.map((day, idx) => {
                  const isSelected = inspectedDay?.dateKey === day.dateKey;
                  const isPowerDay = day.pct >= 60 && day.total > 0;
                  const isPerfect = day.pct === 100 && day.total > 0;

                  return (
                    <div
                      key={day.dateKey}
                      onClick={() => setSelectedDayIndex(idx)}
                      className="group flex flex-col items-center h-full justify-end cursor-pointer select-none"
                    >
                      {/* Floating Percentage Pill */}
                      <div
                        className={`mb-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 scale-105'
                            : 'bg-slate-800/90 text-slate-300 group-hover:bg-slate-700'
                        }`}
                      >
                        {day.pct}%
                      </div>

                      {/* Bar Track */}
                      <div
                        className={`w-full max-w-[48px] h-36 bg-slate-950/80 rounded-xl p-1 border transition-all flex items-end overflow-hidden ${
                          isSelected
                            ? 'border-emerald-400 ring-2 ring-emerald-500/25'
                            : day.isToday
                            ? 'border-slate-700'
                            : 'border-slate-800/80 group-hover:border-slate-700'
                        }`}
                      >
                        {/* Animated Bar Fill */}
                        <div
                          style={{ height: `${Math.max(day.pct, 6)}%` }}
                          className={`w-full rounded-lg transition-all duration-500 relative ${
                            isPerfect
                              ? 'bg-gradient-to-t from-emerald-500 via-teal-400 to-emerald-300 shadow-lg shadow-emerald-500/30'
                              : isPowerDay
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                              : day.pct > 0
                              ? 'bg-gradient-to-t from-slate-700 to-slate-500'
                              : 'bg-slate-800/60'
                          }`}
                        />
                      </div>

                      {/* Day Label & Streak Connector */}
                      <div className="mt-2.5 flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-xs font-bold ${
                              day.isToday
                                ? 'text-emerald-400'
                                : isSelected
                                ? 'text-white'
                                : 'text-slate-400'
                            }`}
                          >
                            {day.dayShort}
                          </span>
                          {isPowerDay && (
                            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {day.count}/{day.total}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Day Breakdown & Streak Inspector */}
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            {inspectedDay && (
              <>
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        {inspectedDay.isToday ? 'Today’s Focus' : 'Day Inspector'}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        {inspectedDay.dayName}, {inspectedDay.monthShort}{' '}
                        {inspectedDay.dayNumber}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-white">
                        {inspectedDay.count}/{inspectedDay.total}
                      </span>
                      <p className="text-xs text-slate-400">completed</p>
                    </div>
                  </div>

                  {/* Quick Checklist for the Inspected Day */}
                  <div className="mt-4 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {filteredHabits.length === 0 ? (
                      <p className="text-sm text-slate-500 py-6 text-center">
                        No habits in this category yet.
                      </p>
                    ) : (
                      filteredHabits.map((h) => {
                        const isDone = !!h.completedDates?.[inspectedDay.dateKey];
                        const theme = getColorTheme(h.color);
                        const IconComp = getIconComponent(h.icon);

                        return (
                          <button
                            key={h.id}
                            onClick={() =>
                              toggleHabitDate(h.id, inspectedDay.dateKey)
                            }
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                              isDone
                                ? 'bg-slate-800/90 border-slate-700 text-white'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${theme.softBg} ${theme.text}`}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <span
                                className={`text-xs font-medium truncate ${
                                  isDone ? 'line-through text-slate-400' : 'text-slate-200'
                                }`}
                              >
                                {h.name}
                              </span>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition ${
                                isDone
                                  ? `${theme.bg} text-slate-950`
                                  : 'border border-slate-700 bg-slate-900'
                              }`}
                            >
                              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-400">
                    {inspectedDay.pct === 100
                      ? 'All goals achieved for this day!'
                      : `${inspectedDay.total - inspectedDay.count} remaining`}
                  </div>
                  {inspectedDay.total > 0 && inspectedDay.pct < 100 && (
                    <button
                      onClick={() =>
                        completeAllForDay(
                          inspectedDay.dateKey,
                          inspectedDay.dayShort
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete All</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Interactive 7-Day Habit Grid */}
        <section className="bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden">
          {/* Grid Header & Category Filter Pills */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>7-Day Habit Check-In Matrix</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle daily completion across the week to build your streak
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6 w-72">Habit & Category</th>
                  {weekDays.map((day, idx) => (
                    <th
                      key={day.dateKey}
                      onClick={() => setSelectedDayIndex(idx)}
                      className="py-3.5 px-2 text-center cursor-pointer hover:text-white transition"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={
                            day.isToday ? 'text-emerald-400 font-bold' : ''
                          }
                        >
                          {day.dayShort}
                        </span>
                        <span
                          className={`mt-0.5 text-xs px-2 py-0.5 rounded-full ${
                            day.isToday
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          {day.dayNumber}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="py-3.5 px-4 text-center">Streak</th>
                  <th className="py-3.5 px-4 text-center">Weekly Goal</th>
                  <th className="py-3.5 px-6 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredHabits.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400">
                      <div className="max-w-sm mx-auto space-y-3">
                        <p className="text-base font-semibold text-slate-200">
                          No habits found in "{selectedCategory}"
                        </p>
                        <p className="text-xs text-slate-400">
                          Create a new daily ritual to begin tracking your weekly consistency and streaks.
                        </p>
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Habit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHabits.map((habit) => {
                    const stats = calculateHabitStats(habit);
                    const theme = getColorTheme(habit.color);
                    const IconComponent = getIconComponent(habit.icon);

                    return (
                      <tr
                        key={habit.id}
                        className="group hover:bg-slate-800/30 transition-colors"
                      >
                        {/* Habit Name & Metadata */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl ${theme.softBg} border ${theme.border} ${theme.text} flex items-center justify-center shrink-0`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate">
                                {habit.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                                  {habit.category}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Target: {habit.targetPerWeek}d/wk
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 7-Day Checkboxes */}
                        {weekDays.map((day) => {
                          const completed = !!habit.completedDates?.[day.dateKey];
                          return (
                            <td
                              key={day.dateKey}
                              className="py-4 px-2 text-center"
                            >
                              <button
                                onClick={() =>
                                  toggleHabitDate(habit.id, day.dateKey)
                                }
                                aria-label={`Toggle ${habit.name} on ${day.dayName}`}
                                className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center transition-all duration-200 ${
                                  completed
                                    ? `${theme.bg} text-slate-950 shadow-md scale-100 hover:opacity-90`
                                    : day.isToday
                                    ? 'bg-slate-950 border-2 border-dashed border-slate-700 text-slate-500 hover:border-emerald-400 hover:text-emerald-400'
                                    : 'bg-slate-950/90 border border-slate-800 text-slate-600 hover:border-slate-700 hover:bg-slate-900'
                                }`}
                              >
                                {completed ? (
                                  <Check className="w-5 h-5 stroke-[2.8]" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                                )}
                              </button>
                            </td>
                          );
                        })}

                        {/* Current Streak Badge */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
                            <Flame
                              className={`w-4 h-4 ${
                                stats.currentStreak > 0
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                stats.currentStreak > 0
                                  ? 'text-white'
                                  : 'text-slate-500'
                              }`}
                            >
                              {stats.currentStreak}d
                            </span>
                          </div>
                        </td>

                        {/* Weekly Progress Bar */}
                        <td className="py-4 px-4">
                          <div className="w-28 mx-auto">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-200">
                                {stats.completedInWeek}/{habit.targetPerWeek}
                              </span>
                              <span className="text-slate-400">{stats.rate}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                              <div
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round(
                                      (stats.completedInWeek /
                                        habit.targetPerWeek) *
                                        100
                                    )
                                  )}%`,
                                }}
                                className={`h-full rounded-full transition-all duration-300 ${theme.bg}`}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Delete Button */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setHabitToDelete(habit)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete habit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal: Add New Habit */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Create New Daily Habit
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 20m Mindful Meditation"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Weekly Target
                  </label>
                  <select
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {[3, 4, 5, 6, 7].map((n) => (
                      <option key={n} value={n}>
                        {n} days / week
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Choose Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map((item) => {
                    const IconComp = item.icon;
                    const active = newHabitIcon === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setNewHabitIcon(item.id)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs transition ${
                          active
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-[10px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setNewHabitColor(c.id)}
                      className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center transition ${
                        newHabitColor === c.id
                          ? 'ring-4 ring-white/30 scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {newHabitColor === c.id && (
                        <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-sm hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {habitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Remove Habit?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete{' '}
                <span className="text-slate-200 font-semibold">
                  "{habitToDelete.name}"
                </span>
                ? This will remove its streak history from your dashboard.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setHabitToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Keep Habit
              </button>
              <button
                onClick={confirmDeleteHabit}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}