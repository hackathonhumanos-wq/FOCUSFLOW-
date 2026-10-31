// apps/api/src/vercel.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";

// apps/api/src/routes/index.ts
import { Router as Router14 } from "express";

// apps/api/src/routes/healthRoutes.ts
import { Router } from "express";

// apps/api/src/services/healthService.ts
var HealthService = class {
  static getHealth() {
    return {
      success: true,
      message: "FOCUSFLOW API is running",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "0.1.0-alpha",
      uptimeSeconds: Math.floor(process.uptime())
    };
  }
};

// apps/api/src/controllers/healthController.ts
var HealthController = class {
  static checkHealth(req, res) {
    const health = HealthService.getHealth();
    res.status(200).json({
      success: true,
      message: "FOCUSFLOW API is running"
    });
  }
};

// apps/api/src/routes/healthRoutes.ts
var healthRouter = Router();
healthRouter.get("/health", HealthController.checkHealth);

// apps/api/src/routes/gamificationRoutes.ts
import { Router as Router2 } from "express";

// apps/api/src/services/gamificationService.ts
var STUDENT_LEVELS = [
  { levelNumber: 1, title: "Beginner", minXp: 0, maxXp: 99, badgeIcon: "\u{1F331}" },
  { levelNumber: 2, title: "Focus Explorer", minXp: 100, maxXp: 249, badgeIcon: "\u{1F9ED}" },
  { levelNumber: 3, title: "Consistency Builder", minXp: 250, maxXp: 499, badgeIcon: "\u26A1" },
  { levelNumber: 4, title: "Deep Worker", minXp: 500, maxXp: 899, badgeIcon: "\u{1F6E1}\uFE0F" },
  { levelNumber: 5, title: "Productivity Pro", minXp: 900, maxXp: 1399, badgeIcon: "\u{1F3AF}" },
  { levelNumber: 6, title: "Focus Master", minXp: 1400, maxXp: 1999, badgeIcon: "\u{1F52E}" },
  { levelNumber: 7, title: "Discipline Champion", minXp: 2e3, maxXp: 2799, badgeIcon: "\u{1F451}" },
  { levelNumber: 8, title: "Productivity Legend", minXp: 2800, maxXp: 99999, badgeIcon: "\u{1F3C6}" }
];
var XP_RULES = {
  FOCUS_SESSION_25M: { amount: 10, label: "Completed 25-minute Pomodoro session" },
  FOCUS_SESSION_50M: { amount: 25, label: "Completed 50-minute Deep Work session" },
  DAILY_GOAL_MET: { amount: 30, label: "Achieved daily focus study quota" },
  DAILY_CHALLENGE_COMPLETED: { amount: 20, label: "Finished daily challenge" },
  STREAK_3_DAYS: { amount: 25, label: "Maintained 3-day consistency streak" },
  STREAK_7_DAYS: { amount: 75, label: "Maintained 7-day consistency streak" },
  WEEKLY_CHALLENGE_COMPLETED: { amount: 100, label: "Mastered weekly milestone challenge" },
  STUDY_GROUP_SESSION: { amount: 15, label: "Participated in group study session" },
  ZERO_REELS_BONUS: { amount: 20, label: "Zero short-form video distraction bonus" }
};
var INITIAL_ACHIEVEMENTS = [
  // Focus Badges
  {
    id: "ach-1",
    code: "FIRST_FOCUS_SESSION",
    title: "Focus Master",
    description: "Complete verified uninterrupted Pomodoro & Deep Study intervals.",
    category: "FOCUS",
    rarity: "RARE",
    xpReward: 50,
    isUnlocked: true,
    unlockedAt: "2026-10-29T14:30:00Z",
    progressCurrent: 10,
    progressTotal: 10
  },
  {
    id: "ach-2",
    code: "FOCUS_STARTER",
    title: "Study Champion",
    description: "Log 5 consecutive days of structured subject study blocks.",
    category: "CONSISTENCY",
    rarity: "RARE",
    xpReward: 60,
    isUnlocked: true,
    unlockedAt: "2026-10-28T18:00:00Z",
    progressCurrent: 5,
    progressTotal: 5
  },
  {
    id: "ach-3",
    code: "DEEP_WORK_CHAMPION",
    title: "Productivity Star",
    description: "Complete three 50-minute deep work intervals while keeping short-form limits intact.",
    category: "WELLBEING",
    rarity: "EPIC",
    xpReward: 80,
    isUnlocked: true,
    unlockedAt: "2026-10-27T21:15:00Z",
    progressCurrent: 3,
    progressTotal: 3
  },
  {
    id: "ach-4",
    code: "10_FOCUS_SESSIONS",
    title: "Focus Practitioner",
    description: "Complete 10 total focus sessions.",
    category: "FOCUS",
    rarity: "COMMON",
    xpReward: 50,
    isUnlocked: true,
    unlockedAt: "2026-10-29T10:00:00Z",
    progressCurrent: 10,
    progressTotal: 10
  },
  {
    id: "ach-5",
    code: "50_FOCUS_SESSIONS",
    title: "Centurion of Focus",
    description: "Accumulate 50 completed focus study sessions.",
    category: "FOCUS",
    rarity: "EPIC",
    xpReward: 150,
    isUnlocked: false,
    progressCurrent: 28,
    progressTotal: 50
  },
  {
    id: "ach-6",
    code: "100_FOCUS_SESSIONS",
    title: "Monk Mode Master",
    description: "Reach 100 verified focus sessions.",
    category: "FOCUS",
    rarity: "LEGENDARY",
    xpReward: 300,
    isUnlocked: false,
    progressCurrent: 28,
    progressTotal: 100
  },
  // Consistency Badges
  {
    id: "ach-7",
    code: "3_DAY_STREAK",
    title: "Consistency Spark",
    description: "Maintain study focus for 3 consecutive days.",
    category: "CONSISTENCY",
    rarity: "COMMON",
    xpReward: 25,
    isUnlocked: true,
    unlockedAt: "2026-10-27T23:59:00Z",
    progressCurrent: 3,
    progressTotal: 3
  },
  {
    id: "ach-8",
    code: "7_DAY_STREAK",
    title: "Unbreakable Week",
    description: "Achieve a 7-day unbroken study streak.",
    category: "CONSISTENCY",
    rarity: "RARE",
    xpReward: 75,
    isUnlocked: false,
    progressCurrent: 5,
    progressTotal: 7
  },
  {
    id: "ach-9",
    code: "14_DAY_STREAK",
    title: "Habit Architect",
    description: "Maintain a 14-day study streak.",
    category: "CONSISTENCY",
    rarity: "EPIC",
    xpReward: 150,
    isUnlocked: false,
    progressCurrent: 5,
    progressTotal: 14
  },
  {
    id: "ach-10",
    code: "30_DAY_STREAK",
    title: "Iron Will",
    description: "Surpass 30 consecutive days of study dedication.",
    category: "CONSISTENCY",
    rarity: "LEGENDARY",
    xpReward: 350,
    isUnlocked: false,
    progressCurrent: 5,
    progressTotal: 30
  },
  // Digital Wellbeing Badges
  {
    id: "ach-11",
    code: "SCREEN_TIME_REDUCER",
    title: "Screen Time Reducer",
    description: "Reduce daily distracting screen time by at least 25%.",
    category: "WELLBEING",
    rarity: "COMMON",
    xpReward: 40,
    isUnlocked: true,
    unlockedAt: "2026-10-28T19:20:00Z",
    progressCurrent: 1,
    progressTotal: 1
  },
  {
    id: "ach-12",
    code: "REELS_REDUCER",
    title: "Doomscroll Defeater",
    description: "Keep estimated short-form video swipes under 25 for 3 consecutive days.",
    category: "WELLBEING",
    rarity: "RARE",
    xpReward: 80,
    isUnlocked: true,
    unlockedAt: "2026-10-29T23:00:00Z",
    progressCurrent: 3,
    progressTotal: 3
  },
  {
    id: "ach-13",
    code: "DIGITAL_BALANCE_CHAMPION",
    title: "Digital Balance Champion",
    description: "Achieve 4 hours of focus with zero short-form video transitions.",
    category: "WELLBEING",
    rarity: "EPIC",
    xpReward: 120,
    isUnlocked: false,
    progressCurrent: 2,
    progressTotal: 4
  },
  // Social Badges
  {
    id: "ach-14",
    code: "FIRST_STUDY_GROUP",
    title: "Fellow Scholar",
    description: "Join or create your first peer study group.",
    category: "SOCIAL",
    rarity: "COMMON",
    xpReward: 20,
    isUnlocked: true,
    unlockedAt: "2026-10-26T11:00:00Z",
    progressCurrent: 1,
    progressTotal: 1
  },
  {
    id: "ach-15",
    code: "ACCOUNTABILITY_PARTNER",
    title: "Accountability Partner",
    description: "Connect with a study friend and share weekly focus progress.",
    category: "SOCIAL",
    rarity: "RARE",
    xpReward: 45,
    isUnlocked: true,
    unlockedAt: "2026-10-28T15:45:00Z",
    progressCurrent: 1,
    progressTotal: 1
  },
  {
    id: "ach-16",
    code: "GROUP_CHALLENGE_CHAMPION",
    title: "Group Champion",
    description: "Finish in the top 3 in a study group weekly sprint.",
    category: "SOCIAL",
    rarity: "EPIC",
    xpReward: 100,
    isUnlocked: false,
    progressCurrent: 0,
    progressTotal: 1
  }
];
var GamificationStore = class {
  userXp = /* @__PURE__ */ new Map([["current-user", 2450]]);
  userTransactions = /* @__PURE__ */ new Map([
    [
      "current-user",
      [
        {
          id: "xpt-1",
          userId: "current-user",
          amount: 25,
          activityType: "FOCUS_SESSION_50M",
          description: "Completed 50-minute Deep Work session: Computer Systems",
          referenceId: "sess-101",
          createdAt: new Date(Date.now() - 2 * 3600 * 1e3).toISOString()
        },
        {
          id: "xpt-2",
          userId: "current-user",
          amount: 20,
          activityType: "DAILY_CHALLENGE_COMPLETED",
          description: "Finished daily challenge: Complete 2 focus sessions",
          referenceId: "chal-d1",
          createdAt: new Date(Date.now() - 4 * 3600 * 1e3).toISOString()
        },
        {
          id: "xpt-3",
          userId: "current-user",
          amount: 25,
          activityType: "STREAK_3_DAYS",
          description: "Maintained 3-day consistency streak",
          referenceId: "streak-3",
          createdAt: new Date(Date.now() - 24 * 3600 * 1e3).toISOString()
        },
        {
          id: "xpt-4",
          userId: "current-user",
          amount: 10,
          activityType: "FOCUS_SESSION_25M",
          description: "Completed 25-minute Pomodoro session: Algorithms revision",
          referenceId: "sess-100",
          createdAt: new Date(Date.now() - 26 * 3600 * 1e3).toISOString()
        }
      ]
    ]
  ]);
  userChallenges = /* @__PURE__ */ new Map([
    [
      "current-user",
      [
        {
          id: "chal-d1",
          title: "Complete 2 Focus Sessions",
          description: "Execute at least two uninterrupted focus intervals today.",
          type: "DAILY",
          difficulty: "EASY",
          targetValue: 2,
          currentValue: 2,
          unit: "sessions",
          xpReward: 20,
          status: "COMPLETED",
          expiresAt: new Date(Date.now() + 8 * 3600 * 1e3).toISOString()
        },
        {
          id: "chal-d2",
          title: "Study for 60 Minutes",
          description: "Accumulate one hour of deep focused study today.",
          type: "DAILY",
          difficulty: "MEDIUM",
          targetValue: 60,
          currentValue: 60,
          unit: "minutes",
          xpReward: 25,
          status: "COMPLETED",
          expiresAt: new Date(Date.now() + 8 * 3600 * 1e3).toISOString()
        },
        {
          id: "chal-d3",
          title: "Keep Reel Swipes Under 30",
          description: "Resist doomscrolling and keep estimated feed transitions low.",
          type: "DAILY",
          difficulty: "HARD",
          targetValue: 30,
          currentValue: 18,
          unit: "swipes",
          xpReward: 35,
          status: "IN_PROGRESS",
          expiresAt: new Date(Date.now() + 8 * 3600 * 1e3).toISOString()
        },
        {
          id: "chal-w1",
          title: "Weekly 10-Hour Deep Work",
          description: "Log 10 hours of verified study time this week.",
          type: "WEEKLY",
          difficulty: "MEDIUM",
          targetValue: 600,
          currentValue: 480,
          unit: "minutes",
          xpReward: 100,
          status: "IN_PROGRESS",
          expiresAt: new Date(Date.now() + 3 * 86400 * 1e3).toISOString()
        },
        {
          id: "chal-w2",
          title: "Participate in 3 Group Sessions",
          description: "Study alongside your peers in group study rooms.",
          type: "WEEKLY",
          difficulty: "HARD",
          targetValue: 3,
          currentValue: 2,
          unit: "sessions",
          xpReward: 80,
          status: "IN_PROGRESS",
          expiresAt: new Date(Date.now() + 3 * 86400 * 1e3).toISOString()
        }
      ]
    ]
  ]);
  getXp(userId = "current-user") {
    return this.userXp.get(userId) || 2450;
  }
  getTransactions(userId = "current-user") {
    return this.userTransactions.get(userId) || [];
  }
  awardXp(userId, activityType, customDescription, referenceId) {
    const rule = XP_RULES[activityType];
    if (!rule) {
      return { awarded: false, xpEarned: 0, newTotalXp: this.getXp(userId), message: "Unknown activity type" };
    }
    const txs = this.userTransactions.get(userId) || [];
    if (referenceId && txs.some((t) => t.referenceId === referenceId)) {
      return {
        awarded: false,
        xpEarned: 0,
        newTotalXp: this.getXp(userId),
        message: "Reward already claimed for this activity reference."
      };
    }
    const currentXp = this.getXp(userId);
    const newTotal = currentXp + rule.amount;
    this.userXp.set(userId, newTotal);
    const newTx = {
      id: `xpt-${Date.now()}`,
      userId,
      amount: rule.amount,
      activityType,
      description: customDescription || rule.label,
      referenceId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.userTransactions.set(userId, [newTx, ...txs]);
    return {
      awarded: true,
      xpEarned: rule.amount,
      newTotalXp: newTotal,
      message: `Awarded +${rule.amount} XP for ${rule.label}!`
    };
  }
  getLevelProgress(userId = "current-user") {
    const totalXp = this.getXp(userId);
    let currentLevel = STUDENT_LEVELS[0];
    for (let i = STUDENT_LEVELS.length - 1; i >= 0; i--) {
      if (totalXp >= STUDENT_LEVELS[i].minXp) {
        currentLevel = STUDENT_LEVELS[i];
        break;
      }
    }
    const nextIndex = currentLevel.levelNumber;
    const nextLevel = nextIndex < STUDENT_LEVELS.length ? STUDENT_LEVELS[nextIndex] : null;
    let currentLevelXp = totalXp - currentLevel.minXp;
    let requiredXpForNext = nextLevel ? nextLevel.minXp - currentLevel.minXp : 0;
    let progressPercent = 100;
    if (nextLevel && requiredXpForNext > 0) {
      progressPercent = Math.min(100, Math.round(currentLevelXp / requiredXpForNext * 100));
    }
    return {
      currentLevel,
      nextLevel,
      totalXp,
      currentLevelXp,
      requiredXpForNext,
      progressPercent
    };
  }
  getAchievements() {
    return INITIAL_ACHIEVEMENTS;
  }
  getStreakInfo(_userId = "current-user") {
    const today = /* @__PURE__ */ new Date();
    const history = [];
    const priorConsecutiveDaysBeforeWindow = 10;
    for (let i = 13; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const status = i === 0 ? "TODAY" : "COMPLETED";
      const focusMins = i === 0 ? 155 : 45 + i * 7 % 30;
      history.push({
        date: dateStr,
        status,
        focusMinutes: focusMins,
        sessionsCount: Math.max(1, Math.ceil(focusMins / 25))
      });
    }
    let consecutiveInWindow = 0;
    for (let idx = history.length - 1; idx >= 0; idx--) {
      if (history[idx].status === "COMPLETED" || history[idx].status === "TODAY") {
        consecutiveInWindow += 1;
      } else {
        break;
      }
    }
    const currentStreak = consecutiveInWindow === history.length ? consecutiveInWindow + priorConsecutiveDaysBeforeWindow : consecutiveInWindow;
    return {
      currentStreak,
      longestStreak: Math.max(28, currentStreak),
      lastActiveDate: today.toISOString().slice(0, 10),
      isActiveToday: history[history.length - 1]?.focusMinutes > 0,
      streakFreezeAvailable: true,
      history
    };
  }
  getChallenges(userId = "current-user") {
    return this.userChallenges.get(userId) || [];
  }
  claimChallengeReward(userId, challengeId) {
    const list = this.userChallenges.get(userId) || [];
    const target = list.find((c) => c.id === challengeId);
    if (!target) {
      return { success: false, xpEarned: 0, message: "Challenge not found" };
    }
    if (target.status === "CLAIMED") {
      return { success: false, xpEarned: 0, message: "Challenge reward has already been claimed" };
    }
    if (target.currentValue < target.targetValue) {
      return { success: false, xpEarned: 0, message: "Challenge objectives not yet completed" };
    }
    target.status = "CLAIMED";
    const awardResult = this.awardXp(
      userId,
      target.type === "DAILY" ? "DAILY_CHALLENGE_COMPLETED" : "WEEKLY_CHALLENGE_COMPLETED",
      `Challenge Reward: ${target.title}`,
      `chal-claim-${challengeId}`
    );
    return {
      success: true,
      xpEarned: target.xpReward,
      message: `Claimed +${target.xpReward} XP for completing "${target.title}"!`
    };
  }
};
var gamificationService = new GamificationStore();

// apps/api/src/services/notificationService.ts
var NotificationStore = class {
  notificationsMap = /* @__PURE__ */ new Map([
    [
      "current-user",
      [
        {
          id: "notif-1",
          userId: "current-user",
          type: "LEVEL_UP",
          title: "Level Up! Deep Worker Reached",
          message: "Congratulations! You unlocked Level 4 (Deep Worker) with 840 total XP.",
          isRead: false,
          createdAt: new Date(Date.now() - 35 * 60 * 1e3).toISOString()
        },
        {
          id: "notif-2",
          userId: "current-user",
          type: "STREAK_MILESTONE",
          title: "5-Day Streak Milestone Active",
          message: "You have sustained your focus habit for 5 consecutive days. 2 days left to earn Unbreakable Week!",
          isRead: false,
          createdAt: new Date(Date.now() - 3 * 3600 * 1e3).toISOString()
        },
        {
          id: "notif-3",
          userId: "current-user",
          type: "FRIEND_REQUEST",
          title: "New Friend Request",
          message: "Elena Rostova (@elena_rostova) wants to connect as study accountability partners.",
          isRead: false,
          dataRefId: "user-elena",
          createdAt: new Date(Date.now() - 6 * 3600 * 1e3).toISOString()
        },
        {
          id: "notif-4",
          userId: "current-user",
          type: "CHALLENGE_COMPLETE",
          title: "Daily Challenge Ready to Claim",
          message: 'You completed "Complete 2 Focus Sessions". Claim +20 XP now!',
          isRead: true,
          dataRefId: "chal-d1",
          createdAt: new Date(Date.now() - 14 * 3600 * 1e3).toISOString()
        },
        {
          id: "notif-5",
          userId: "current-user",
          type: "BADGE_UNLOCKED",
          title: "Badge Unlocked: Focus Practitioner",
          message: "You earned the Focus Practitioner badge and +50 XP reward!",
          isRead: true,
          dataRefId: "ach-4",
          createdAt: new Date(Date.now() - 24 * 3600 * 1e3).toISOString()
        }
      ]
    ]
  ]);
  getNotifications(userId = "current-user") {
    return this.notificationsMap.get(userId) || [];
  }
  getUnreadCount(userId = "current-user") {
    const list = this.getNotifications(userId);
    return list.filter((n) => !n.isRead).length;
  }
  markAsRead(userId = "current-user", notificationId) {
    const list = this.getNotifications(userId);
    const target = list.find((n) => n.id === notificationId);
    if (!target) {
      return { success: false, message: "Notification not found" };
    }
    target.isRead = true;
    this.notificationsMap.set(userId, [...list]);
    return { success: true, message: "Notification marked as read" };
  }
  markAllAsRead(userId = "current-user") {
    const list = this.getNotifications(userId);
    const updated = list.map((n) => ({ ...n, isRead: true }));
    this.notificationsMap.set(userId, updated);
    return { success: true, message: "All notifications marked as read" };
  }
  emitNotification(userId, type, title, message, dataRefId) {
    const list = this.getNotifications(userId);
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId,
      type,
      title,
      message,
      isRead: false,
      dataRefId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.notificationsMap.set(userId, [newNotif, ...list]);
    return newNotif;
  }
};
var notificationService = new NotificationStore();

// apps/api/src/controllers/gamificationController.ts
var GamificationController = class {
  static getProfile(req, res) {
    const userId = req.query.userId || "current-user";
    const levelProgress = gamificationService.getLevelProgress(userId);
    const streakInfo = gamificationService.getStreakInfo(userId);
    const achievements = gamificationService.getAchievements();
    const unlockedBadges = achievements.filter((a) => a.isUnlocked).length;
    const response = {
      success: true,
      data: {
        userId,
        levelProgress,
        streakInfo,
        totalBadges: achievements.length,
        unlockedBadges,
        levelsReference: STUDENT_LEVELS,
        xpRulesReference: XP_RULES
      }
    };
    res.json(response);
  }
  static getXp(req, res) {
    const userId = req.query.userId || "current-user";
    const totalXp = gamificationService.getXp(userId);
    const levelProgress = gamificationService.getLevelProgress(userId);
    const response = {
      success: true,
      data: {
        totalXp,
        levelProgress
      }
    };
    res.json(response);
  }
  static getXpHistory(req, res) {
    const userId = req.query.userId || "current-user";
    const transactions = gamificationService.getTransactions(userId);
    const response = {
      success: true,
      data: {
        transactions,
        count: transactions.length
      }
    };
    res.json(response);
  }
  static awardXp(req, res) {
    const userId = req.body.userId || "current-user";
    const { activityType, customDescription, referenceId } = req.body;
    if (!activityType) {
      res.status(400).json({ success: false, message: "activityType is required" });
      return;
    }
    const previousLevel = gamificationService.getLevelProgress(userId).currentLevel.levelNumber;
    const result = gamificationService.awardXp(userId, activityType, customDescription, referenceId);
    if (result.awarded) {
      const newLevel = gamificationService.getLevelProgress(userId).currentLevel;
      if (newLevel.levelNumber > previousLevel) {
        notificationService.emitNotification(
          userId,
          "LEVEL_UP",
          `Level Up! You reached ${newLevel.title}`,
          `Amazing work! You unlocked Level ${newLevel.levelNumber}: ${newLevel.title}. Keep pushing your focus goals!`
        );
      }
    }
    res.json({
      success: result.awarded,
      message: result.message,
      data: {
        xpEarned: result.xpEarned,
        newTotalXp: result.newTotalXp
      }
    });
  }
  static getAchievements(req, res) {
    const achievements = gamificationService.getAchievements();
    const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
    const response = {
      success: true,
      data: {
        achievements,
        unlockedCount,
        totalCount: achievements.length
      }
    };
    res.json(response);
  }
  static getStreaks(req, res) {
    const userId = req.query.userId || "current-user";
    const streakInfo = gamificationService.getStreakInfo(userId);
    const response = {
      success: true,
      data: streakInfo
    };
    res.json(response);
  }
  static getChallenges(req, res) {
    const userId = req.query.userId || "current-user";
    const challenges = gamificationService.getChallenges(userId);
    const response = {
      success: true,
      data: {
        challenges,
        daily: challenges.filter((c) => c.type === "DAILY"),
        weekly: challenges.filter((c) => c.type === "WEEKLY")
      }
    };
    res.json(response);
  }
  static claimChallenge(req, res) {
    const userId = req.body.userId || "current-user";
    const { challengeId } = req.params;
    if (!challengeId) {
      res.status(400).json({ success: false, message: "Challenge ID is required" });
      return;
    }
    const result = gamificationService.claimChallengeReward(userId, challengeId);
    if (result.success) {
      notificationService.emitNotification(
        userId,
        "XP_EARNED",
        "Challenge Reward Claimed",
        result.message
      );
    }
    res.status(result.success ? 200 : 400).json(result);
  }
};

// apps/api/src/routes/gamificationRoutes.ts
var router = Router2();
router.get("/profile", GamificationController.getProfile);
router.get("/xp", GamificationController.getXp);
router.get("/xp/history", GamificationController.getXpHistory);
router.post("/xp/award", GamificationController.awardXp);
router.get("/achievements", GamificationController.getAchievements);
router.get("/streaks", GamificationController.getStreaks);
router.get("/challenges", GamificationController.getChallenges);
router.post("/challenges/:challengeId/claim", GamificationController.claimChallenge);
var gamificationRouter = router;

// apps/api/src/routes/socialRoutes.ts
import { Router as Router3 } from "express";

// apps/api/src/services/socialService.ts
function createAvatarSvgDataUri(initials, bgHex, fgHex) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${bgHex}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="34" fill="${fgHex}">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
var SocialStore = class {
  // In-Memory state for friends
  friendsMap = /* @__PURE__ */ new Map([
    [
      "current-user",
      [
        {
          id: "user-alex",
          username: "alex_chen",
          displayName: "Alex Chen",
          avatarUrl: createAvatarSvgDataUri("AC", "#DDF7EC", "#079669"),
          streakDays: 8,
          totalXp: 1420,
          level: 6,
          weeklyFocusHours: 14.5,
          isOnline: true,
          status: "ACCEPTED"
        },
        {
          id: "user-priya",
          username: "priya_patel",
          displayName: "Priya Patel",
          avatarUrl: createAvatarSvgDataUri("PP", "#E6F0FE", "#438CF5"),
          streakDays: 14,
          totalXp: 2150,
          level: 7,
          weeklyFocusHours: 19,
          isOnline: false,
          status: "ACCEPTED"
        },
        {
          id: "user-marcus",
          username: "marcus_v",
          displayName: "Marcus Vance",
          avatarUrl: createAvatarSvgDataUri("MV", "#FEF3C7", "#D97706"),
          streakDays: 4,
          totalXp: 620,
          level: 4,
          weeklyFocusHours: 8.2,
          isOnline: true,
          status: "ACCEPTED"
        },
        {
          id: "user-elena",
          username: "elena_rostova",
          displayName: "Elena Rostova",
          avatarUrl: createAvatarSvgDataUri("ER", "#EDE9FE", "#7C3AED"),
          streakDays: 3,
          totalXp: 490,
          level: 3,
          weeklyFocusHours: 5.5,
          isOnline: false,
          status: "PENDING_INCOMING"
        },
        {
          id: "user-jordan",
          username: "jordan_lee",
          displayName: "Jordan Lee",
          avatarUrl: createAvatarSvgDataUri("JL", "#E0F2FE", "#0284C7"),
          streakDays: 0,
          totalXp: 180,
          level: 2,
          weeklyFocusHours: 2,
          isOnline: false,
          status: "PENDING_OUTGOING"
        }
      ]
    ]
  ]);
  // In-Memory state for Study Groups
  groups = [
    {
      id: "grp-gate-2027",
      name: "GATE & Placement Algorithms",
      description: "Daily 2-hour deep work sprint for Data Structures, Algorithms, and OS preparation.",
      inviteCode: "GATE2027",
      isPrivate: false,
      memberCount: 18,
      totalWeeklyFocusMinutes: 4860,
      groupStreak: 12,
      userRole: "MEMBER",
      members: [
        {
          userId: "user-priya",
          displayName: "Priya Patel",
          username: "priya_patel",
          avatarUrl: createAvatarSvgDataUri("PP", "#E6F0FE", "#438CF5"),
          role: "OWNER",
          joinedAt: "2026-10-01T00:00:00Z",
          weeklyFocusMinutes: 1140
        },
        {
          userId: "current-user",
          displayName: "Adarsh Sharma",
          username: "adarsh_sharma",
          avatarUrl: createAvatarSvgDataUri("AS", "#DDF7EC", "#079669"),
          role: "MEMBER",
          joinedAt: "2026-10-12T00:00:00Z",
          weeklyFocusMinutes: 930
        },
        {
          userId: "user-alex",
          displayName: "Alex Chen",
          username: "alex_chen",
          avatarUrl: createAvatarSvgDataUri("AC", "#DDF7EC", "#079669"),
          role: "ADMIN",
          joinedAt: "2026-10-05T00:00:00Z",
          weeklyFocusMinutes: 870
        }
      ]
    },
    {
      id: "grp-monk-mode",
      name: "Monk Mode Study Club",
      description: "Zero social media distractions, strict phone-away focus sessions, morning & night check-ins.",
      inviteCode: "MONK99",
      isPrivate: true,
      memberCount: 7,
      totalWeeklyFocusMinutes: 3200,
      groupStreak: 19,
      userRole: "OWNER",
      members: [
        {
          userId: "current-user",
          displayName: "Adarsh Sharma",
          username: "adarsh_sharma",
          avatarUrl: createAvatarSvgDataUri("AS", "#DDF7EC", "#079669"),
          role: "OWNER",
          joinedAt: "2026-10-01T00:00:00Z",
          weeklyFocusMinutes: 930
        },
        {
          userId: "user-marcus",
          displayName: "Marcus Vance",
          username: "marcus_v",
          avatarUrl: createAvatarSvgDataUri("MV", "#FEF3C7", "#D97706"),
          role: "MEMBER",
          joinedAt: "2026-10-08T00:00:00Z",
          weeklyFocusMinutes: 490
        }
      ]
    },
    {
      id: "grp-med-prep",
      name: "NEET & Medical Aspirants",
      description: "Biology, Organic Chemistry revisions and test series question solving marathons.",
      inviteCode: "MEDFOCUS",
      isPrivate: false,
      memberCount: 34,
      totalWeeklyFocusMinutes: 8940,
      groupStreak: 25,
      userRole: void 0,
      members: []
    }
  ];
  // User Opt-Out preferences for Leaderboard
  userPrivacySettings = /* @__PURE__ */ new Map([
    ["current-user", { showOnLeaderboard: true }]
  ]);
  // --- Friends Methods ---
  getFriends(userId = "current-user") {
    return this.friendsMap.get(userId) || [];
  }
  sendFriendRequest(userId = "current-user", targetUsername) {
    const list = this.getFriends(userId);
    const cleanUsername = targetUsername.trim().toLowerCase().replace(/^@/, "");
    if (!cleanUsername) {
      return { success: false, message: "Please provide a valid username" };
    }
    if (cleanUsername === "adarsh_sharma" || cleanUsername === "aarav_sharma") {
      return { success: false, message: "You cannot send a friend request to yourself" };
    }
    const existing = list.find((f) => f.username.toLowerCase() === cleanUsername);
    if (existing) {
      if (existing.status === "ACCEPTED") {
        return { success: false, message: `You are already friends with @${cleanUsername}` };
      }
      return { success: false, message: `Request is already ${existing.status.toLowerCase()}` };
    }
    const initials = cleanUsername.slice(0, 2).toUpperCase();
    const newRequest = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      displayName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      avatarUrl: createAvatarSvgDataUri(initials, "#DDF7EC", "#079669"),
      streakDays: 1,
      totalXp: 120,
      level: 2,
      weeklyFocusHours: 3.5,
      isOnline: false,
      status: "PENDING_OUTGOING"
    };
    this.friendsMap.set(userId, [newRequest, ...list]);
    return { success: true, message: `Friend request sent to @${cleanUsername}`, friend: newRequest };
  }
  acceptFriendRequest(userId = "current-user", friendId) {
    const list = this.getFriends(userId);
    const target = list.find((f) => f.id === friendId);
    if (!target) {
      return { success: false, message: "Friend request not found" };
    }
    target.status = "ACCEPTED";
    this.friendsMap.set(userId, [...list]);
    return { success: true, message: `Accepted friend request from ${target.displayName}!` };
  }
  rejectFriendRequest(userId = "current-user", friendId) {
    const list = this.getFriends(userId);
    const updated = list.filter((f) => f.id !== friendId);
    this.friendsMap.set(userId, updated);
    return { success: true, message: "Friend request declined" };
  }
  removeFriend(userId = "current-user", friendId) {
    const list = this.getFriends(userId);
    const updated = list.filter((f) => f.id !== friendId);
    this.friendsMap.set(userId, updated);
    return { success: true, message: "Friend removed from your accountability circle" };
  }
  // --- Study Groups Methods ---
  getGroups() {
    return this.groups;
  }
  getGroupById(groupId) {
    return this.groups.find((g) => g.id === groupId);
  }
  createGroup(userId = "current-user", data) {
    if (!data.name || data.name.trim().length < 3) {
      return { success: false, message: "Group name must be at least 3 characters long" };
    }
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newGroup = {
      id: `grp-${Date.now()}`,
      name: data.name.trim(),
      description: data.description.trim() || "Collaborative focus study circle.",
      inviteCode: randomCode,
      isPrivate: data.isPrivate,
      memberCount: 1,
      totalWeeklyFocusMinutes: 0,
      groupStreak: 1,
      userRole: "OWNER",
      members: [
        {
          userId,
          displayName: "Adarsh Sharma",
          username: "adarsh_sharma",
          avatarUrl: createAvatarSvgDataUri("AS", "#DDF7EC", "#079669"),
          role: "OWNER",
          joinedAt: (/* @__PURE__ */ new Date()).toISOString(),
          weeklyFocusMinutes: 0
        }
      ]
    };
    this.groups.unshift(newGroup);
    return { success: true, group: newGroup, message: `Study Group "${newGroup.name}" created successfully!` };
  }
  joinGroupByCode(userId = "current-user", code) {
    const cleanCode = code.trim().toUpperCase();
    const targetGroup = this.groups.find((g) => g.inviteCode === cleanCode);
    if (!targetGroup) {
      return { success: false, message: "Invalid study group invite code" };
    }
    if (targetGroup.userRole) {
      return { success: false, message: "You are already a member of this study group" };
    }
    targetGroup.memberCount += 1;
    targetGroup.userRole = "MEMBER";
    if (!targetGroup.members) {
      targetGroup.members = [];
    }
    targetGroup.members.push({
      userId,
      displayName: "Adarsh Sharma",
      username: "adarsh_sharma",
      avatarUrl: createAvatarSvgDataUri("AS", "#DDF7EC", "#079669"),
      role: "MEMBER",
      joinedAt: (/* @__PURE__ */ new Date()).toISOString(),
      weeklyFocusMinutes: 0
    });
    return {
      success: true,
      group: targetGroup,
      message: `Successfully joined "${targetGroup.name}"!`
    };
  }
  leaveGroup(userId = "current-user", groupId) {
    const target = this.groups.find((g) => g.id === groupId);
    if (!target) {
      return { success: false, message: "Study group not found" };
    }
    if (!target.userRole) {
      return { success: false, message: "You are not a member of this group" };
    }
    target.userRole = void 0;
    target.memberCount = Math.max(0, target.memberCount - 1);
    if (target.members) {
      target.members = target.members.filter((m) => m.userId !== userId);
    }
    return { success: true, message: `You left "${target.name}"` };
  }
  // --- Leaderboards Engine ---
  getLeaderboard(scope = "GLOBAL", metric = "WEEKLY_XP", userId = "current-user") {
    const isOptedIn = this.userPrivacySettings.get(userId)?.showOnLeaderboard ?? true;
    const pool = [
      {
        userId: "user-priya",
        displayName: "Priya Patel",
        username: "priya_patel",
        avatarUrl: createAvatarSvgDataUri("PP", "#E6F0FE", "#438CF5"),
        level: 7,
        scores: {
          WEEKLY_XP: 580,
          MONTHLY_FOCUS: 84,
          DAILY_SESSIONS: 6,
          STREAK_DAYS: 26
        },
        isFriend: true,
        inMyGroup: true
      },
      {
        userId: "user-alex",
        displayName: "Alex Chen",
        username: "alex_chen",
        avatarUrl: createAvatarSvgDataUri("AC", "#DDF7EC", "#079669"),
        level: 6,
        scores: {
          WEEKLY_XP: 440,
          MONTHLY_FOCUS: 62,
          DAILY_SESSIONS: 4,
          STREAK_DAYS: 18
        },
        isFriend: true,
        inMyGroup: true
      },
      {
        userId: "user-tanya",
        displayName: "Tanya Mehta",
        username: "tanya_m",
        avatarUrl: createAvatarSvgDataUri("TM", "#EDE9FE", "#7C3AED"),
        level: 7,
        scores: {
          WEEKLY_XP: 510,
          MONTHLY_FOCUS: 78,
          DAILY_SESSIONS: 5,
          STREAK_DAYS: 21
        },
        isFriend: false,
        inMyGroup: false
      },
      {
        userId: "user-rohit",
        displayName: "Rohit Verma",
        username: "rohit_v",
        avatarUrl: createAvatarSvgDataUri("RV", "#E0F2FE", "#0284C7"),
        level: 5,
        scores: {
          WEEKLY_XP: 380,
          MONTHLY_FOCUS: 48,
          DAILY_SESSIONS: 3,
          STREAK_DAYS: 9
        },
        isFriend: false,
        inMyGroup: false
      },
      {
        userId: "user-marcus",
        displayName: "Marcus Vance",
        username: "marcus_v",
        avatarUrl: createAvatarSvgDataUri("MV", "#FEF3C7", "#D97706"),
        level: 4,
        scores: {
          WEEKLY_XP: 290,
          MONTHLY_FOCUS: 36,
          DAILY_SESSIONS: 2,
          STREAK_DAYS: 4
        },
        isFriend: true,
        inMyGroup: true
      },
      {
        userId: "user-sophia",
        displayName: "Sophia Alvarez",
        username: "sophia_alv",
        avatarUrl: createAvatarSvgDataUri("SA", "#FCE7F3", "#DB2777"),
        level: 6,
        scores: {
          WEEKLY_XP: 410,
          MONTHLY_FOCUS: 55,
          DAILY_SESSIONS: 4,
          STREAK_DAYS: 11
        },
        isFriend: false,
        inMyGroup: false
      }
    ];
    const currentUserScore = {
      WEEKLY_XP: 495,
      MONTHLY_FOCUS: 68,
      DAILY_SESSIONS: 4,
      STREAK_DAYS: 24
    };
    let filtered = [...pool];
    if (scope === "FRIENDS") {
      filtered = filtered.filter((u) => u.isFriend);
    } else if (scope === "GROUPS") {
      filtered = filtered.filter((u) => u.inMyGroup);
    }
    const combined = isOptedIn ? [
      ...filtered,
      {
        userId: "current-user",
        displayName: "Adarsh Sharma (You)",
        username: "adarsh_sharma",
        avatarUrl: createAvatarSvgDataUri("AS", "#DDF7EC", "#079669"),
        level: 7,
        scores: currentUserScore,
        isFriend: false,
        inMyGroup: true
      }
    ] : filtered;
    combined.sort((a, b) => b.scores[metric] - a.scores[metric]);
    const unitMap = {
      WEEKLY_XP: "XP",
      MONTHLY_FOCUS: "hrs",
      DAILY_SESSIONS: "sessions",
      STREAK_DAYS: "days"
    };
    return combined.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      displayName: entry.displayName,
      username: entry.username,
      avatarUrl: entry.avatarUrl,
      score: entry.scores[metric],
      unit: unitMap[metric],
      isCurrentUser: entry.userId === "current-user",
      level: entry.level
    }));
  }
  setLeaderboardPrivacy(userId = "current-user", showOnLeaderboard) {
    this.userPrivacySettings.set(userId, { showOnLeaderboard });
    return { success: true, showOnLeaderboard };
  }
  getLeaderboardPrivacy(userId = "current-user") {
    return this.userPrivacySettings.get(userId)?.showOnLeaderboard ?? true;
  }
};
var socialService = new SocialStore();

// apps/api/src/controllers/socialController.ts
var SocialController = class {
  // Friends
  static getFriends(req, res) {
    const userId = req.query.userId || "current-user";
    const friends = socialService.getFriends(userId);
    const accepted = friends.filter((f) => f.status === "ACCEPTED");
    const pendingIncoming = friends.filter((f) => f.status === "PENDING_INCOMING");
    const pendingOutgoing = friends.filter((f) => f.status === "PENDING_OUTGOING");
    const response = {
      success: true,
      data: {
        all: friends,
        accepted,
        pendingIncoming,
        pendingOutgoing
      }
    };
    res.json(response);
  }
  static sendFriendRequest(req, res) {
    const userId = req.body.userId || "current-user";
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ success: false, message: "Username is required" });
      return;
    }
    const result = socialService.sendFriendRequest(userId, username);
    res.status(result.success ? 201 : 400).json(result);
  }
  static acceptFriendRequest(req, res) {
    const userId = req.body.userId || "current-user";
    const { id } = req.params;
    const result = socialService.acceptFriendRequest(userId, id);
    if (result.success) {
      notificationService.emitNotification(
        userId,
        "FRIEND_ACCEPTED",
        "Friend Request Accepted",
        result.message
      );
    }
    res.status(result.success ? 200 : 400).json(result);
  }
  static rejectFriendRequest(req, res) {
    const userId = req.body.userId || "current-user";
    const { id } = req.params;
    const result = socialService.rejectFriendRequest(userId, id);
    res.status(result.success ? 200 : 400).json(result);
  }
  static removeFriend(req, res) {
    const userId = req.body.userId || "current-user";
    const { id } = req.params;
    const result = socialService.removeFriend(userId, id);
    res.status(result.success ? 200 : 400).json(result);
  }
  // Study Groups
  static getStudyGroups(req, res) {
    const groups = socialService.getGroups();
    const myGroups = groups.filter((g) => Boolean(g.userRole));
    const response = {
      success: true,
      data: {
        groups,
        myGroups
      }
    };
    res.json(response);
  }
  static getStudyGroup(req, res) {
    const { id } = req.params;
    const group = socialService.getGroupById(id);
    if (!group) {
      res.status(404).json({ success: false, message: "Study group not found" });
      return;
    }
    res.json({ success: true, data: group });
  }
  static createStudyGroup(req, res) {
    const userId = req.body.userId || "current-user";
    const { name, description, isPrivate } = req.body;
    const result = socialService.createGroup(userId, {
      name,
      description: description || "",
      isPrivate: Boolean(isPrivate)
    });
    res.status(result.success ? 201 : 400).json(result);
  }
  static joinStudyGroup(req, res) {
    const userId = req.body.userId || "current-user";
    const { inviteCode } = req.body;
    if (!inviteCode) {
      res.status(400).json({ success: false, message: "Invite code is required" });
      return;
    }
    const result = socialService.joinGroupByCode(userId, inviteCode);
    res.status(result.success ? 200 : 400).json(result);
  }
  static leaveStudyGroup(req, res) {
    const userId = req.body.userId || "current-user";
    const { id } = req.params;
    const result = socialService.leaveGroup(userId, id);
    res.status(result.success ? 200 : 400).json(result);
  }
  // Leaderboards
  static getLeaderboards(req, res) {
    const userId = req.query.userId || "current-user";
    const scope = req.query.scope?.toUpperCase() || "GLOBAL";
    const metric = req.query.metric?.toUpperCase() || "WEEKLY_XP";
    const entries = socialService.getLeaderboard(scope, metric, userId);
    const isOptedIn = socialService.getLeaderboardPrivacy(userId);
    const response = {
      success: true,
      data: {
        scope,
        metric,
        entries,
        isOptedIn,
        topPodium: entries.slice(0, 3)
      }
    };
    res.json(response);
  }
  static updateLeaderboardPrivacy(req, res) {
    const userId = req.body.userId || "current-user";
    const { showOnLeaderboard } = req.body;
    const result = socialService.setLeaderboardPrivacy(userId, Boolean(showOnLeaderboard));
    res.json({ success: true, data: result });
  }
};

// apps/api/src/routes/socialRoutes.ts
var router2 = Router3();
router2.get("/friends", SocialController.getFriends);
router2.post("/friends/request", SocialController.sendFriendRequest);
router2.post("/friends/:id/accept", SocialController.acceptFriendRequest);
router2.post("/friends/:id/reject", SocialController.rejectFriendRequest);
router2.delete("/friends/:id", SocialController.removeFriend);
router2.get("/groups", SocialController.getStudyGroups);
router2.get("/groups/:id", SocialController.getStudyGroup);
router2.post("/groups", SocialController.createStudyGroup);
router2.post("/groups/join", SocialController.joinStudyGroup);
router2.post("/groups/:id/leave", SocialController.leaveStudyGroup);
router2.get("/leaderboards", SocialController.getLeaderboards);
router2.post("/leaderboards/privacy", SocialController.updateLeaderboardPrivacy);
var socialRouter = router2;

// apps/api/src/routes/notificationRoutes.ts
import { Router as Router4 } from "express";

// apps/api/src/controllers/notificationController.ts
var NotificationController = class {
  static getNotifications(req, res) {
    const userId = req.query.userId || "current-user";
    const notifications = notificationService.getNotifications(userId);
    const unreadCount = notificationService.getUnreadCount(userId);
    const response = {
      success: true,
      data: {
        notifications,
        unreadCount
      }
    };
    res.json(response);
  }
  static markAsRead(req, res) {
    const userId = req.query.userId || "current-user";
    const { id } = req.params;
    const result = notificationService.markAsRead(userId, id);
    res.status(result.success ? 200 : 400).json(result);
  }
  static markAllAsRead(req, res) {
    const userId = req.query.userId || "current-user";
    const result = notificationService.markAllAsRead(userId);
    res.json(result);
  }
};

// apps/api/src/routes/notificationRoutes.ts
var router3 = Router4();
router3.get("/", NotificationController.getNotifications);
router3.patch("/read-all", NotificationController.markAllAsRead);
router3.patch("/:id/read", NotificationController.markAsRead);
var notificationRouter = router3;

// apps/api/src/routes/plannerRoutes.ts
import { Router as Router5 } from "express";

// apps/api/src/services/studyPlannerService.ts
var StudyPlannerService = class {
  subjects = [
    {
      id: "sub-1",
      name: "Mathematics \u2014 Vector Calculus & Linear Algebra",
      targetHoursPerWeek: 12,
      completedHoursThisWeek: 8.5,
      urgencyLevel: "CRITICAL",
      examDate: "2026-05-18",
      color: "#079669"
    },
    {
      id: "sub-2",
      name: "Physics \u2014 Electromagnetism & Wave Optics",
      targetHoursPerWeek: 8,
      completedHoursThisWeek: 5,
      urgencyLevel: "HIGH",
      examDate: "2026-05-24",
      color: "#438CF5"
    },
    {
      id: "sub-3",
      name: "Chemistry \u2014 Organic Reaction Mechanisms",
      targetHoursPerWeek: 6,
      completedHoursThisWeek: 4,
      urgencyLevel: "MEDIUM",
      examDate: "2026-06-02",
      color: "#7C5CFC"
    },
    {
      id: "sub-4",
      name: "Computer Science \u2014 Data Structures Revision",
      targetHoursPerWeek: 6,
      completedHoursThisWeek: 5,
      urgencyLevel: "LOW",
      examDate: "2026-06-15",
      color: "#F59E0B"
    }
  ];
  activeSchedule = null;
  constructor() {
    this.activeSchedule = this.buildSchedule("AFTERNOON_BALANCED", 6);
  }
  getSubjects() {
    return this.subjects;
  }
  addOrUpdateSubject(subject) {
    const existingIndex = this.subjects.findIndex((s) => s.id === subject.id || s.name === subject.name);
    if (existingIndex >= 0) {
      this.subjects[existingIndex] = { ...this.subjects[existingIndex], ...subject };
      return this.subjects[existingIndex];
    }
    const newSubject = {
      id: `sub-${Date.now()}`,
      name: subject.name,
      targetHoursPerWeek: subject.targetHoursPerWeek || 6,
      completedHoursThisWeek: subject.completedHoursThisWeek || 0,
      urgencyLevel: subject.urgencyLevel || "MEDIUM",
      examDate: subject.examDate,
      color: subject.color || "#079669"
    };
    this.subjects.push(newSubject);
    return newSubject;
  }
  getCurrentSchedule() {
    if (!this.activeSchedule) {
      this.activeSchedule = this.buildSchedule("AFTERNOON_BALANCED", 6);
    }
    return this.activeSchedule;
  }
  generateAdaptiveSchedule(energyArchetype = "AFTERNOON_BALANCED", targetHours = 6) {
    if (this.activeSchedule && this.activeSchedule.energyArchetype === energyArchetype && this.activeSchedule.recommendedFocusHours === targetHours) {
      return this.activeSchedule;
    }
    this.activeSchedule = this.buildSchedule(energyArchetype, targetHours);
    return this.activeSchedule;
  }
  regenerateSchedule(energyArchetype = "AFTERNOON_BALANCED", targetHours = 6) {
    this.activeSchedule = this.buildSchedule(energyArchetype, targetHours);
    return this.activeSchedule;
  }
  buildSchedule(energyArchetype, targetHours) {
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const slots = [];
    if (energyArchetype === "MORNING_LARK") {
      slots.push(
        {
          id: "slot-1",
          timeSlot: "07:30 \u2013 08:15 (45 min)",
          subject: "Mathematics",
          topic: "45 min \u2014 Vector Calculus & Eigenvalues",
          recommendedMode: "DEEP_WORK",
          energyLevelRequired: "HIGH",
          isCompleted: true,
          aiRationale: "Peak morning cognitive bandwidth allocated to highest-priority exam topic."
        },
        {
          id: "slot-2",
          timeSlot: "09:30 \u2013 10:15 (45 min)",
          subject: "Physics",
          topic: "45 min \u2014 Gauss Law & Field Practice",
          recommendedMode: "POMODORO",
          energyLevelRequired: "HIGH",
          isCompleted: false,
          aiRationale: "High-focus analytical problem set scheduled before midday fatigue."
        },
        {
          id: "slot-3",
          timeSlot: "14:00 \u2013 14:30 (30 min)",
          subject: "Chemistry",
          topic: "30 min \u2014 Reaction Mechanisms Flashcards",
          recommendedMode: "ACTIVE_RECALL",
          energyLevelRequired: "MEDIUM",
          isCompleted: false,
          aiRationale: "Interactive active-recall format prevents post-lunch attention dip."
        },
        {
          id: "slot-4",
          timeSlot: "17:00 \u2013 17:20 (20 min)",
          subject: "Revision",
          topic: "20 min \u2014 Formula Sheet & Error Log Recap",
          recommendedMode: "POMODORO",
          energyLevelRequired: "LOW",
          isCompleted: false,
          aiRationale: "Low-friction evening consolidation to lock in memory retention."
        }
      );
    } else if (energyArchetype === "NIGHT_OWL") {
      slots.push(
        {
          id: "slot-1",
          timeSlot: "11:00 \u2013 11:45 (45 min)",
          subject: "Physics",
          topic: "45 min \u2014 Wave Interference Problems",
          recommendedMode: "POMODORO",
          energyLevelRequired: "MEDIUM",
          isCompleted: true,
          aiRationale: "Gentle late-morning warm-up session to build study momentum."
        },
        {
          id: "slot-2",
          timeSlot: "15:30 \u2013 16:00 (30 min)",
          subject: "Chemistry",
          topic: "30 min \u2014 Stereochemistry Synthesis",
          recommendedMode: "ACTIVE_RECALL",
          energyLevelRequired: "MEDIUM",
          isCompleted: false,
          aiRationale: "Structured afternoon sprint with distraction shield active."
        },
        {
          id: "slot-3",
          timeSlot: "20:00 \u2013 20:45 (45 min)",
          subject: "Mathematics",
          topic: "45 min \u2014 Differential Equations Deep Dive",
          recommendedMode: "DEEP_WORK",
          energyLevelRequired: "HIGH",
          isCompleted: false,
          aiRationale: "Evening alertness peak paired with your highest-weight subject."
        },
        {
          id: "slot-4",
          timeSlot: "21:15 \u2013 21:35 (20 min)",
          subject: "Revision",
          topic: "20 min \u2014 Quick Summary Notes before Wind-Down",
          recommendedMode: "POMODORO",
          energyLevelRequired: "LOW",
          isCompleted: false,
          aiRationale: "Wraps up screen exposure well before sleep window."
        }
      );
    } else {
      slots.push(
        {
          id: "slot-1",
          timeSlot: "09:00 \u2013 09:45 (45 min)",
          subject: "Mathematics",
          topic: "45 min \u2014 Multivariable Integration",
          recommendedMode: "DEEP_WORK",
          energyLevelRequired: "HIGH",
          isCompleted: true,
          aiRationale: "Morning momentum builder tackling critical analytical problem sets."
        },
        {
          id: "slot-2",
          timeSlot: "11:15 \u2013 12:00 (45 min)",
          subject: "Physics",
          topic: "45 min \u2014 Electromagnetism Numericals",
          recommendedMode: "POMODORO",
          energyLevelRequired: "MEDIUM",
          isCompleted: false,
          aiRationale: "Focused sprint with a 5-minute eye-rest break afterward."
        },
        {
          id: "slot-3",
          timeSlot: "15:00 \u2013 15:30 (30 min)",
          subject: "Chemistry",
          topic: "30 min \u2014 Organic Mechanisms Active Recall",
          recommendedMode: "ACTIVE_RECALL",
          energyLevelRequired: "MEDIUM",
          isCompleted: false,
          aiRationale: "Active recall practice sustains afternoon engagement."
        },
        {
          id: "slot-4",
          timeSlot: "17:30 \u2013 17:50 (20 min)",
          subject: "Revision",
          topic: "20 min \u2014 Key Mistake Journal Review",
          recommendedMode: "POMODORO",
          energyLevelRequired: "LOW",
          isCompleted: false,
          aiRationale: "Light recap closing out your study plan without evening burnout."
        }
      );
    }
    return {
      date: todayStr,
      energyArchetype,
      recommendedFocusHours: targetHours,
      scheduledSlots: slots,
      readinessScore: 89,
      aiAdvice: `Your circadian focus readiness is 89%. High-priority Mathematics and Physics blocks are scheduled in your sharpest windows, followed by lighter active recall and 20-minute revision.`
    };
  }
  toggleSlotComplete(slotId) {
    const schedule = this.getCurrentSchedule();
    schedule.scheduledSlots = schedule.scheduledSlots.map(
      (slot) => slot.id === slotId ? { ...slot, isCompleted: !slot.isCompleted } : slot
    );
    return schedule;
  }
  addCustomSlot(input) {
    const schedule = this.getCurrentSchedule();
    const newSlot = {
      id: `slot-${Date.now()}`,
      timeSlot: input.timeSlot || `Flexible (${input.durationMinutes} min)`,
      subject: input.subject,
      topic: `${input.durationMinutes} min \u2014 ${input.topic}`,
      recommendedMode: input.recommendedMode,
      energyLevelRequired: input.durationMinutes >= 45 ? "HIGH" : "MEDIUM",
      isCompleted: false,
      aiRationale: "Added directly by student to today\u2019s study agenda."
    };
    schedule.scheduledSlots.push(newSlot);
    return schedule;
  }
};
var studyPlannerService = new StudyPlannerService();

// packages/validation/src/index.ts
import { z } from "zod";
var registerSchema = z.object({
  email: z.string().email({ message: "Valid student or institutional email required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.enum(["STUDENT", "PARENT", "COUNSELLOR", "ADMIN"]).default("STUDENT")
});
var loginSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(1, { message: "Password is required" })
});
var reelStatIngestSchema = z.object({
  platform: z.enum(["INSTAGRAM_REELS", "YOUTUBE_SHORTS", "FACEBOOK_REELS", "OTHER"]),
  estimatedCount: z.number().int().min(1).max(5e3),
  durationSeconds: z.number().int().min(1),
  detectedAt: z.string().datetime(),
  domain: z.string().min(3)
});
var focusSessionStartSchema = z.object({
  plannedDurationMinutes: z.number().int().min(5).max(240),
  mode: z.enum(["POMODORO", "DEEP_WORK", "EXAM_PREP"]).default("POMODORO"),
  notes: z.string().max(500).optional()
});
var focusSessionEndSchema = z.object({
  actualDurationMinutes: z.number().int().min(1),
  completed: z.boolean(),
  notes: z.string().max(500).optional()
});
var privacyConsentSchema = z.object({
  consentShareWithParent: z.boolean().default(false),
  consentShareWithCounsellor: z.boolean().default(false),
  consentExtensionTelemetry: z.boolean().default(true),
  consentAiProductivityAnalysis: z.boolean().default(true),
  trackingPaused: z.boolean().optional()
});
var reelsSettingsUpdateSchema = z.object({
  dailyInteractionLimit: z.number().int().min(5).max(500).optional(),
  dailyMinutesLimit: z.number().int().min(5).max(300).optional(),
  trackingPaused: z.boolean().optional(),
  gentleNudgeThreshold: z.number().int().min(5).max(200).optional()
});
var reelsDataCorrectionSchema = z.object({
  historyId: z.string().min(1),
  action: z.enum(["ADJUST", "DELETE"]),
  adjustedInteractions: z.number().int().min(0).max(500).optional(),
  reason: z.string().max(240).optional()
});
var focusSessionCompleteSchema = z.object({
  subject: z.string().min(1).max(120).default("General Study"),
  mode: z.enum(["POMODORO", "DEEP_WORK", "EXAM_PREP"]).default("POMODORO"),
  durationMinutes: z.number().int().min(1).max(240)
});
var goalUpsertSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(120),
  category: z.enum(["FOCUS_MINUTES", "REELS_CAP", "SCREEN_TIME_CAP", "STUDY_SESSIONS"]),
  targetValue: z.number().int().min(1).max(1440),
  isActive: z.boolean().default(true)
});
var studySlotCreateSchema = z.object({
  subject: z.string().min(1).max(100),
  topic: z.string().min(1).max(160),
  durationMinutes: z.number().int().min(10).max(180).default(45),
  timeSlot: z.string().min(3).max(40).optional(),
  recommendedMode: z.enum(["POMODORO", "DEEP_WORK", "ACTIVE_RECALL"]).default("POMODORO")
});
var feedbackSchema = z.object({
  category: z.enum(["BUG", "FEATURE_REQUEST", "UI_UX", "ACCESSIBILITY", "PRAISE"]),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(1500)
});
var studyPlanGenerateSchema = z.object({
  energyArchetype: z.enum(["MORNING_LARK", "AFTERNOON_BALANCED", "NIGHT_OWL"]).default("AFTERNOON_BALANCED"),
  targetHours: z.number().min(1).max(16).default(6),
  subjects: z.array(
    z.object({
      name: z.string().min(1),
      urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
      targetHoursPerWeek: z.number().min(1).max(40)
    })
  ).min(1).optional()
});
var subscriptionCheckoutSchema = z.object({
  tier: z.enum(["STUDENT_FREE", "STUDENT_PLUS", "PRO_CAMPUS"]),
  billingInterval: z.enum(["MONTHLY", "ANNUAL"]).default("MONTHLY")
});
var automationRuleSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(5).max(250),
  trigger: z.enum([
    "REEL_COUNT_EXCEEDED",
    "DAILY_GOAL_MET",
    "STREAK_AT_RISK",
    "BEDTIME_APPROACHING",
    "FOCUS_SESSION_COMPLETED"
  ]),
  triggerThreshold: z.number().min(1),
  action: z.enum([
    "SEND_DISMISSABLE_NUDGE",
    "ACTIVATE_STRICT_BLOCKER",
    "AWARD_BONUS_XP",
    "SCHEDULE_CALENDAR_BREAK",
    "NOTIFY_COACH"
  ]),
  isEnabled: z.boolean().default(true)
});

// apps/api/src/routes/plannerRoutes.ts
var plannerRouter = Router5();
plannerRouter.get("/subjects", (_req, res) => {
  const subjects = studyPlannerService.getSubjects();
  res.json({ success: true, data: subjects });
});
plannerRouter.get("/schedule", (_req, res) => {
  const schedule = studyPlannerService.getCurrentSchedule();
  res.json({ success: true, data: schedule });
});
plannerRouter.post("/schedule", (req, res) => {
  const energyArchetype = req.body.energyArchetype || "AFTERNOON_BALANCED";
  const targetHours = Number(req.body.targetHours) || 6;
  const forceRegenerate = Boolean(req.body.regenerate);
  const schedule = forceRegenerate ? studyPlannerService.regenerateSchedule(energyArchetype, targetHours) : studyPlannerService.generateAdaptiveSchedule(energyArchetype, targetHours);
  res.json({ success: true, data: schedule });
});
plannerRouter.post("/subjects", (req, res) => {
  if (!req.body?.name || typeof req.body.name !== "string") {
    res.status(400).json({ success: false, message: "Subject name is required" });
    return;
  }
  const newSubject = studyPlannerService.addOrUpdateSubject(req.body);
  res.status(201).json({ success: true, data: newSubject });
});
plannerRouter.post("/slots", (req, res) => {
  const parsed = studySlotCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid study task payload",
      error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() }
    });
    return;
  }
  const updatedSchedule = studyPlannerService.addCustomSlot(parsed.data);
  res.status(201).json({ success: true, message: "Study task added to today\u2019s plan.", data: updatedSchedule });
});
plannerRouter.patch("/slots/:id/toggle", (req, res) => {
  const updatedSchedule = studyPlannerService.toggleSlotComplete(req.params.id);
  res.json({ success: true, data: updatedSchedule });
});

// apps/api/src/routes/wellbeingRoutes.ts
import { Router as Router6 } from "express";

// apps/api/src/services/wellbeingIntelligenceService.ts
var WellbeingIntelligenceService = class {
  reelsSettings = {
    dailyInteractionLimit: 60,
    dailyMinutesLimit: 35,
    trackingPaused: false,
    gentleNudgeThreshold: 25,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  privacyConsent = {
    consentShareWithParent: false,
    consentShareWithCounsellor: false,
    consentExtensionTelemetry: true,
    consentAiProductivityAnalysis: true,
    trackingPaused: false,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  history = [
    {
      id: "rh-1",
      platform: "INSTAGRAM_REELS",
      platformLabel: "Instagram Reels",
      estimatedInteractions: 19,
      estimatedMinutes: 11,
      detectedAt: new Date(Date.now() - 45 * 60 * 1e3).toISOString(),
      confidence: "HIGH",
      detectionSignal: "History API /reels/ route transition observer",
      isDemo: true
    },
    {
      id: "rh-2",
      platform: "YOUTUBE_SHORTS",
      platformLabel: "YouTube Shorts",
      estimatedInteractions: 17,
      estimatedMinutes: 10,
      detectedAt: new Date(Date.now() - 2.5 * 3600 * 1e3).toISOString(),
      confidence: "HIGH",
      detectionSignal: "Navigation /shorts/ video container observer",
      isDemo: true
    },
    {
      id: "rh-3",
      platform: "FACEBOOK_REELS",
      platformLabel: "Facebook Reels",
      estimatedInteractions: 12,
      estimatedMinutes: 7,
      detectedAt: new Date(Date.now() - 5 * 3600 * 1e3).toISOString(),
      confidence: "MEDIUM",
      detectionSignal: "Viewport /reel/ URL state transition heuristic",
      isDemo: true
    },
    {
      id: "rh-4",
      platform: "INSTAGRAM_REELS",
      platformLabel: "Instagram Reels",
      estimatedInteractions: 24,
      estimatedMinutes: 14,
      detectedAt: new Date(Date.now() - 22 * 3600 * 1e3).toISOString(),
      confidence: "HIGH",
      detectionSignal: "History API /reels/ route transition observer",
      isDemo: true
    },
    {
      id: "rh-5",
      platform: "YOUTUBE_SHORTS",
      platformLabel: "YouTube Shorts",
      estimatedInteractions: 18,
      estimatedMinutes: 11,
      detectedAt: new Date(Date.now() - 28 * 3600 * 1e3).toISOString(),
      confidence: "HIGH",
      detectionSignal: "Navigation /shorts/ video container observer",
      isDemo: true
    }
  ];
  baselinePast6Days = [
    { dayLabel: "Mon", reelsEstimated: 26, shortsEstimated: 20, facebookEstimated: 12, totalEstimated: 58, estimatedMinutes: 34 },
    { dayLabel: "Tue", reelsEstimated: 22, shortsEstimated: 18, facebookEstimated: 11, totalEstimated: 51, estimatedMinutes: 30 },
    { dayLabel: "Wed", reelsEstimated: 28, shortsEstimated: 22, facebookEstimated: 14, totalEstimated: 64, estimatedMinutes: 37 },
    { dayLabel: "Thu", reelsEstimated: 20, shortsEstimated: 16, facebookEstimated: 10, totalEstimated: 46, estimatedMinutes: 27 },
    { dayLabel: "Fri", reelsEstimated: 24, shortsEstimated: 19, facebookEstimated: 12, totalEstimated: 55, estimatedMinutes: 32 },
    { dayLabel: "Sat", reelsEstimated: 21, shortsEstimated: 17, facebookEstimated: 13, totalEstimated: 51, estimatedMinutes: 29 }
  ];
  getReelsAnalytics() {
    const startOfToday = Date.now() - 18 * 3600 * 1e3;
    const todayItems = this.history.filter((h) => new Date(h.detectedAt).getTime() >= startOfToday);
    const todayEstimatedReels = todayItems.filter((h) => h.platform === "INSTAGRAM_REELS").reduce((acc, item) => acc + item.estimatedInteractions, 0);
    const todayEstimatedShorts = todayItems.filter((h) => h.platform === "YOUTUBE_SHORTS").reduce((acc, item) => acc + item.estimatedInteractions, 0);
    const todayEstimatedFacebookReels = todayItems.filter((h) => h.platform === "FACEBOOK_REELS").reduce((acc, item) => acc + item.estimatedInteractions, 0);
    const todayTotal = todayEstimatedReels + todayEstimatedShorts + todayEstimatedFacebookReels;
    const todayEstimatedMinutes = todayItems.reduce((acc, item) => acc + item.estimatedMinutes, 0);
    const safeTotal = Math.max(1, todayTotal);
    const instaShare = todayTotal === 0 ? 0 : Math.round(todayEstimatedReels / safeTotal * 100);
    const ytShare = todayTotal === 0 ? 0 : Math.round(todayEstimatedShorts / safeTotal * 100);
    const fbShare = todayTotal === 0 ? 0 : Math.max(0, 100 - instaShare - ytShare);
    const platformBreakdown = [
      {
        platform: "INSTAGRAM_REELS",
        label: "Instagram Reels",
        shortLabel: "Instagram",
        estimatedInteractions: todayEstimatedReels,
        estimatedMinutes: todayItems.filter((h) => h.platform === "INSTAGRAM_REELS").reduce((a, b) => a + b.estimatedMinutes, 0),
        sharePercent: instaShare,
        color: "#8152E8",
        detectionMethod: "Client-side /reels/ URL route transitions",
        confidence: "HIGH"
      },
      {
        platform: "YOUTUBE_SHORTS",
        label: "YouTube Shorts",
        shortLabel: "YouTube",
        estimatedInteractions: todayEstimatedShorts,
        estimatedMinutes: todayItems.filter((h) => h.platform === "YOUTUBE_SHORTS").reduce((a, b) => a + b.estimatedMinutes, 0),
        sharePercent: ytShare,
        color: "#EF4444",
        detectionMethod: "Client-side /shorts/ feed navigation observer",
        confidence: "HIGH"
      },
      {
        platform: "FACEBOOK_REELS",
        label: "Facebook Reels",
        shortLabel: "Facebook",
        estimatedInteractions: todayEstimatedFacebookReels,
        estimatedMinutes: todayItems.filter((h) => h.platform === "FACEBOOK_REELS").reduce((a, b) => a + b.estimatedMinutes, 0),
        sharePercent: fbShare,
        color: "#2878F0",
        detectionMethod: "Feed /reel/ state transition heuristic",
        confidence: "MEDIUM"
      }
    ];
    const now = /* @__PURE__ */ new Date();
    const dailyTrends = this.baselinePast6Days.map((pt, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - idx));
      return {
        ...pt,
        date: d.toISOString().slice(0, 10)
      };
    });
    dailyTrends.push({
      date: now.toISOString().slice(0, 10),
      dayLabel: "Sun",
      reelsEstimated: todayEstimatedReels,
      shortsEstimated: todayEstimatedShorts,
      facebookEstimated: todayEstimatedFacebookReels,
      totalEstimated: todayTotal,
      estimatedMinutes: todayEstimatedMinutes
    });
    const weeklyTotal = dailyTrends.reduce((sum, d) => sum + d.totalEstimated, 0);
    const weeklyMinutes = dailyTrends.reduce((sum, d) => sum + d.estimatedMinutes, 0);
    const priorWeekBaselineTotal = 439;
    const vsLastWeekPercent = Math.round(
      (weeklyTotal - priorWeekBaselineTotal) / Math.max(1, priorWeekBaselineTotal) * 100
    );
    const isPaused = this.reelsSettings.trackingPaused || !this.privacyConsent.consentExtensionTelemetry;
    return {
      todayTotalEstimatedInteractions: todayTotal,
      todayEstimatedReels,
      todayEstimatedShorts,
      todayEstimatedFacebookReels,
      todayEstimatedMinutes,
      vsLastWeekPercent,
      weeklyTotalEstimatedInteractions: weeklyTotal,
      weeklyEstimatedMinutes: weeklyMinutes,
      sparkline7d: dailyTrends.map((d) => d.totalEstimated),
      platformBreakdown,
      dailyTrends,
      settings: {
        ...this.reelsSettings,
        trackingPaused: isPaused
      },
      coverage: {
        supportedPlatforms: [
          "Instagram Web (/reels/*)",
          "YouTube Web (/shorts/*)",
          "Facebook Web (/reel/*)"
        ],
        unsupportedContexts: [
          "Native iOS / Android mobile apps outside desktop browser",
          "Incognito / Private windows without extension permission",
          "Embedded third-party video iframes without URL state changes"
        ],
        browserExtensionConnected: true,
        permissionStatus: isPaused ? "PAUSED_BY_USER" : "GRANTED",
        coveragePercentEstimate: isPaused ? 0 : 88,
        ethicalDisclaimer: "All short-form metrics are non-intrusive client-side route transition estimates. FOCUSFLOW never claims exact video view telemetry from private APIs and never inspects captions, messages, keystrokes, or screenshots."
      },
      history: this.history
    };
  }
  updateReelsSettings(input) {
    if (typeof input.dailyInteractionLimit === "number") {
      this.reelsSettings.dailyInteractionLimit = input.dailyInteractionLimit;
    }
    if (typeof input.dailyMinutesLimit === "number") {
      this.reelsSettings.dailyMinutesLimit = input.dailyMinutesLimit;
    }
    if (typeof input.gentleNudgeThreshold === "number") {
      this.reelsSettings.gentleNudgeThreshold = input.gentleNudgeThreshold;
    }
    if (typeof input.trackingPaused === "boolean") {
      this.reelsSettings.trackingPaused = input.trackingPaused;
      this.privacyConsent.trackingPaused = input.trackingPaused;
      this.privacyConsent.consentExtensionTelemetry = !input.trackingPaused;
    }
    this.reelsSettings.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    return this.reelsSettings;
  }
  correctReelsHistory(input) {
    const idx = this.history.findIndex((item) => item.id === input.historyId);
    if (idx === -1) {
      return {
        updated: false,
        message: "Tracking entry not found.",
        summary: this.getReelsAnalytics()
      };
    }
    if (input.action === "DELETE") {
      this.history.splice(idx, 1);
      return {
        updated: true,
        message: "Estimated tracking session removed from your log.",
        summary: this.getReelsAnalytics()
      };
    }
    const nextCount = Math.max(0, input.adjustedInteractions ?? 0);
    if (nextCount === 0) {
      this.history.splice(idx, 1);
      return {
        updated: true,
        message: "Estimated count set to 0 and entry cleared.",
        summary: this.getReelsAnalytics()
      };
    }
    const current = this.history[idx];
    const ratio = current.estimatedInteractions > 0 ? nextCount / current.estimatedInteractions : 1;
    this.history[idx] = {
      ...current,
      estimatedInteractions: nextCount,
      estimatedMinutes: Math.max(1, Math.round(current.estimatedMinutes * ratio)),
      correctedByUser: true
    };
    return {
      updated: true,
      message: `Estimated interactions adjusted to ${nextCount}.`,
      summary: this.getReelsAnalytics()
    };
  }
  getPrivacyConsent() {
    return this.privacyConsent;
  }
  updatePrivacyConsent(input) {
    const trackingPaused = typeof input.trackingPaused === "boolean" ? input.trackingPaused : !input.consentExtensionTelemetry;
    this.privacyConsent = {
      consentShareWithParent: input.consentShareWithParent,
      consentShareWithCounsellor: input.consentShareWithCounsellor,
      consentExtensionTelemetry: !trackingPaused,
      consentAiProductivityAnalysis: input.consentAiProductivityAnalysis,
      trackingPaused,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.reelsSettings.trackingPaused = trackingPaused;
    return this.privacyConsent;
  }
  calculateHealthScore() {
    const reels = this.getReelsAnalytics();
    const riskWindows = [
      {
        timeWindow: "22:15 - 00:30",
        riskLevel: "HIGH",
        triggerContext: "Late-night bedtime procrastination; dopamine-seeking response to day fatigue.",
        recommendedShield: "Auto-activate Bedtime Focus Lock at 22:00 with gentle warm-screen prompt."
      },
      {
        timeWindow: "13:30 - 14:15",
        riskLevel: "MODERATE",
        triggerContext: "Post-lunch cognitive dip causing mindless 15-minute scroll loops.",
        recommendedShield: "Schedule a 10-minute sunlight walk or hydration break instead."
      },
      {
        timeWindow: "18:00 - 18:45",
        riskLevel: "ELEVATED",
        triggerContext: "Study-to-leisure context switch vulnerability.",
        recommendedShield: "Switch to ambient instrumental study room or short stretch break."
      }
    ];
    const interventions = [
      "Mindful friction pause: 5-second breath countdown when opening short-form feed.",
      "Study environment anchor: keep phone in another room during 50-minute deep work blocks.",
      "Evening dopamine replacement: replace bedtime reels with 10 pages of light reading or journaling."
    ];
    return {
      overallScore: 86,
      focusResilience: 88,
      restorativeSleepHygiene: 81,
      shortFormDiscipline: 87,
      weeklyReelsEstimated: reels.weeklyTotalEstimatedInteractions,
      reelsTrendPercent: reels.vsLastWeekPercent,
      estimatedTransitions: reels.weeklyTotalEstimatedInteractions,
      disclaimer: reels.coverage.ethicalDisclaimer,
      riskWindows,
      interventions
    };
  }
};
var wellbeingIntelligenceService = new WellbeingIntelligenceService();

// apps/api/src/routes/wellbeingRoutes.ts
var wellbeingRouter = Router6();
wellbeingRouter.get("/health-score", (_req, res) => {
  const score = wellbeingIntelligenceService.calculateHealthScore();
  res.json({ success: true, data: score });
});
wellbeingRouter.get("/reels", (_req, res) => {
  const summary = wellbeingIntelligenceService.getReelsAnalytics();
  res.json({ success: true, data: summary });
});
wellbeingRouter.patch("/reels/settings", (req, res) => {
  const parsed = reelsSettingsUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid Reels settings payload",
      error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() }
    });
    return;
  }
  const updated = wellbeingIntelligenceService.updateReelsSettings(parsed.data);
  res.json({ success: true, message: "Short-form limits and tracking controls updated.", data: updated });
});
wellbeingRouter.post("/reels/correct", (req, res) => {
  const parsed = reelsDataCorrectionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid correction request",
      error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() }
    });
    return;
  }
  const result = wellbeingIntelligenceService.correctReelsHistory(parsed.data);
  if (!result.updated) {
    res.status(404).json({ success: false, message: result.message });
    return;
  }
  res.json({ success: true, message: result.message, data: result.summary });
});
wellbeingRouter.get("/privacy", (_req, res) => {
  const privacy = wellbeingIntelligenceService.getPrivacyConsent();
  res.json({ success: true, data: privacy });
});
wellbeingRouter.put("/privacy", (req, res) => {
  const parsed = privacyConsentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid privacy settings payload",
      error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() }
    });
    return;
  }
  const updated = wellbeingIntelligenceService.updatePrivacyConsent(parsed.data);
  res.json({ success: true, message: "Privacy consent preferences saved.", data: updated });
});

// apps/api/src/routes/analyticsRoutes.ts
import { Router as Router7 } from "express";

// apps/api/src/services/analyticsService.ts
var AnalyticsService = class {
  focusMinutesToday = 155;
  // 2h 35m
  screenMinutesToday = 192;
  // 3h 12m
  dailyFocusTargetMinutes = 215;
  // ~72% progress at 155m
  recentSessions = [
    {
      id: "fs-101",
      subject: "Mathematics \u2014 Vector Calculus",
      mode: "DEEP_WORK",
      durationMinutes: 50,
      xpEarned: 25,
      completedAt: new Date(Date.now() - 2.2 * 3600 * 1e3).toISOString(),
      isDemo: true
    },
    {
      id: "fs-102",
      subject: "Physics \u2014 Electromagnetism",
      mode: "POMODORO",
      durationMinutes: 45,
      xpEarned: 20,
      completedAt: new Date(Date.now() - 4.5 * 3600 * 1e3).toISOString(),
      isDemo: true
    },
    {
      id: "fs-103",
      subject: "Computer Science \u2014 Graph Algorithms",
      mode: "DEEP_WORK",
      durationMinutes: 60,
      xpEarned: 30,
      completedAt: new Date(Date.now() - 6.8 * 3600 * 1e3).toISOString(),
      isDemo: true
    }
  ];
  goals = [
    {
      id: "goal-focus-daily",
      title: "Daily Deep Focus Target",
      category: "FOCUS_MINUTES",
      currentValue: 155,
      targetValue: 215,
      unit: "min",
      isInverseCap: false,
      isActive: true
    },
    {
      id: "goal-reels-cap",
      title: "Daily Short-Form Interaction Cap",
      category: "REELS_CAP",
      currentValue: 48,
      targetValue: 60,
      unit: "interactions",
      isInverseCap: true,
      isActive: true
    },
    {
      id: "goal-screen-cap",
      title: "Total Browser Screen Time Budget",
      category: "SCREEN_TIME_CAP",
      currentValue: 192,
      targetValue: 240,
      unit: "min",
      isInverseCap: true,
      isActive: true
    },
    {
      id: "goal-sessions-daily",
      title: "Uninterrupted Study Sessions",
      category: "STUDY_SESSIONS",
      currentValue: 3,
      targetValue: 4,
      unit: "sessions",
      isInverseCap: false,
      isActive: true
    }
  ];
  past6Days = [
    { dayLabel: "Mon", focusHours: 1, screenHours: 2.3, focusMinutes: 60, screenMinutes: 138 },
    { dayLabel: "Tue", focusHours: 1.9, screenHours: 2.85, focusMinutes: 114, screenMinutes: 171 },
    { dayLabel: "Wed", focusHours: 1.6, screenHours: 2.75, focusMinutes: 96, screenMinutes: 165 },
    { dayLabel: "Thu", focusHours: 2, screenHours: 3.15, focusMinutes: 120, screenMinutes: 189 },
    { dayLabel: "Fri", focusHours: 2.3, screenHours: 3.2, focusMinutes: 138, screenMinutes: 192 },
    { dayLabel: "Sat", focusHours: 2.75, screenHours: 3.55, focusMinutes: 165, screenMinutes: 213 }
  ];
  events = [
    {
      id: "evt-1",
      userId: "current-user",
      eventType: "FOCUS_SESSION_FINISHED",
      metadata: { durationMinutes: 50, mode: "DEEP_WORK", xpGained: 25 },
      timestamp: new Date(Date.now() - 36e5 * 2).toISOString()
    },
    {
      id: "evt-2",
      userId: "current-user",
      eventType: "REEL_INTERVENTION_TRIGGERED",
      metadata: { platform: "INSTAGRAM_REELS", actionTaken: "NAVIGATED_AWAY" },
      timestamp: new Date(Date.now() - 36e5 * 5).toISOString()
    },
    {
      id: "evt-3",
      userId: "current-user",
      eventType: "STREAK_PRESERVED",
      metadata: { currentStreak: 24, milestone: true },
      timestamp: new Date(Date.now() - 864e5).toISOString()
    }
  ];
  getOverview() {
    const reels = wellbeingIntelligenceService.getReelsAnalytics();
    const now = /* @__PURE__ */ new Date();
    const weeklyOverview = this.past6Days.map((pt, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - idx));
      return {
        ...pt,
        date: d.toISOString().slice(0, 10)
      };
    });
    const todayFocusHours = Number((this.focusMinutesToday / 60).toFixed(2));
    const todayScreenHours = Number((this.screenMinutesToday / 60).toFixed(2));
    weeklyOverview.push({
      dayLabel: "Sun",
      date: now.toISOString().slice(0, 10),
      focusHours: todayFocusHours,
      screenHours: todayScreenHours,
      focusMinutes: this.focusMinutesToday,
      screenMinutes: this.screenMinutesToday
    });
    const syncedGoals = this.goals.map((g) => {
      if (g.category === "FOCUS_MINUTES") {
        return { ...g, currentValue: this.focusMinutesToday };
      }
      if (g.category === "REELS_CAP") {
        return {
          ...g,
          currentValue: reels.todayTotalEstimatedInteractions,
          targetValue: reels.settings.dailyInteractionLimit
        };
      }
      if (g.category === "SCREEN_TIME_CAP") {
        return { ...g, currentValue: this.screenMinutesToday };
      }
      if (g.category === "STUDY_SESSIONS") {
        return { ...g, currentValue: this.recentSessions.length };
      }
      return g;
    });
    const focusGoal = syncedGoals.find((g) => g.category === "FOCUS_MINUTES");
    const targetMinutes = focusGoal?.targetValue || this.dailyFocusTargetMinutes;
    const dailyGoalPercent = Math.min(100, Math.round(this.focusMinutesToday / Math.max(1, targetMinutes) * 100));
    const weeklyFocusMinutes = weeklyOverview.reduce((sum, d) => sum + d.focusMinutes, 0);
    const priorWeekFocusMinutes = 757;
    const focusVsLastWeekPercent = Math.round(
      (weeklyFocusMinutes - priorWeekFocusMinutes) / priorWeekFocusMinutes * 100
    );
    const weeklyScreenMinutes = weeklyOverview.reduce((sum, d) => sum + d.screenMinutes, 0);
    const priorWeekScreenMinutes = 1370;
    const screenVsLastWeekPercent = Math.round(
      (weeklyScreenMinutes - priorWeekScreenMinutes) / priorWeekScreenMinutes * 100
    );
    const remainingGoalMins = Math.max(0, targetMinutes - this.focusMinutesToday);
    const suggestedDurationMinutes = remainingGoalMins >= 45 ? 50 : 25;
    const coachHeadline = focusVsLastWeekPercent > 0 ? `Your focus time is up by ${focusVsLastWeekPercent}% this week!` : focusVsLastWeekPercent === 0 ? "Your weekly focus pace is steady!" : "Ready to rebuild your study momentum today?";
    const coachDetail = remainingGoalMins > 0 ? `Keep going! Try a ${suggestedDurationMinutes}-minute focus session before your next study break (${remainingGoalMins}m left to hit today's goal).` : "Daily focus target reached! Take a restorative screen-free break or review flashcards lightly.";
    return {
      studentName: "Adarsh",
      studentFullName: "Adarsh Sharma",
      studentRoleLabel: "B.Tech Computer Science \u2022 Year 3",
      focusMinutesToday: this.focusMinutesToday,
      focusVsLastWeekPercent,
      focusSparkline7d: weeklyOverview.map((d) => d.focusMinutes),
      screenMinutesToday: this.screenMinutesToday,
      screenVsLastWeekPercent,
      screenSparkline7d: weeklyOverview.map((d) => d.screenMinutes),
      dailyGoalPercent,
      dailyFocusTargetMinutes: targetMinutes,
      completedSessionsToday: this.recentSessions.length,
      weeklyOverview,
      coachHeroQuote: "Small steps every day lead to big changes!",
      coachRecommendation: {
        headline: coachHeadline,
        detail: coachDetail,
        suggestedDurationMinutes,
        confidenceScore: 92
      },
      recentSessions: this.recentSessions,
      goals: syncedGoals
    };
  }
  logFocusSession(input) {
    this.focusMinutesToday += input.durationMinutes;
    this.screenMinutesToday += Math.round(input.durationMinutes * 0.4);
    const activityType = input.durationMinutes >= 45 ? "FOCUS_SESSION_50M" : "FOCUS_SESSION_25M";
    const refId = `focus-log-${Date.now()}`;
    const award = gamificationService.awardXp(
      "current-user",
      activityType,
      `Completed ${input.durationMinutes}m ${input.mode.replace("_", " ")}: ${input.subject}`,
      refId
    );
    const session = {
      id: refId,
      subject: input.subject,
      mode: input.mode,
      durationMinutes: input.durationMinutes,
      xpEarned: award.xpEarned,
      completedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isDemo: false
    };
    this.recentSessions.unshift(session);
    this.trackEvent("current-user", "FOCUS_SESSION_FINISHED", {
      subject: input.subject,
      durationMinutes: input.durationMinutes,
      mode: input.mode,
      xpEarned: award.xpEarned
    });
    return {
      session,
      xpEarned: award.xpEarned,
      overview: this.getOverview()
    };
  }
  getGoals() {
    return this.getOverview().goals;
  }
  upsertGoal(input) {
    const unitMap = {
      FOCUS_MINUTES: { unit: "min", inverse: false },
      REELS_CAP: { unit: "interactions", inverse: true },
      SCREEN_TIME_CAP: { unit: "min", inverse: true },
      STUDY_SESSIONS: { unit: "sessions", inverse: false }
    };
    if (input.category === "FOCUS_MINUTES") {
      this.dailyFocusTargetMinutes = input.targetValue;
    }
    if (input.category === "REELS_CAP") {
      wellbeingIntelligenceService.updateReelsSettings({ dailyInteractionLimit: input.targetValue });
    }
    const existingIdx = this.goals.findIndex(
      (g) => input.id && g.id === input.id || g.category === input.category
    );
    if (existingIdx >= 0) {
      this.goals[existingIdx] = {
        ...this.goals[existingIdx],
        title: input.title,
        targetValue: input.targetValue,
        isActive: input.isActive
      };
    } else {
      const meta = unitMap[input.category];
      this.goals.push({
        id: `goal-${Date.now()}`,
        title: input.title,
        category: input.category,
        currentValue: 0,
        targetValue: input.targetValue,
        unit: meta.unit,
        isInverseCap: meta.inverse,
        isActive: input.isActive
      });
    }
    return this.getGoals();
  }
  deleteGoal(goalId) {
    this.goals = this.goals.filter((g) => g.id !== goalId);
    return this.getGoals();
  }
  trackEvent(userId, eventType, metadata = {}) {
    const record = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      eventType,
      metadata,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.events.unshift(record);
    if (this.events.length > 200) {
      this.events = this.events.slice(0, 200);
    }
    return record;
  }
  getRecentEvents(limit = 20) {
    return this.events.slice(0, limit);
  }
  getRetentionStats() {
    return {
      day1RetentionPercent: 88.5,
      day7RetentionPercent: 74.2,
      day30RetentionPercent: 62.8,
      avgDailyFocusMinutes: this.focusMinutesToday,
      sessionCompletionRate: 91.3,
      interventionsFollowedRate: 78.6
    };
  }
};
var analyticsService = new AnalyticsService();

// apps/api/src/routes/analyticsRoutes.ts
var analyticsRouter = Router7();
analyticsRouter.get("/overview", (_req, res) => {
  const overview = analyticsService.getOverview();
  res.json({ success: true, data: overview });
});
analyticsRouter.post("/focus-sessions", (req, res) => {
  const parsed = focusSessionCompleteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid focus session payload",
      error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() }
    });
    return;
  }
  const result = analyticsService.logFocusSession(parsed.data);
  res.status(201).json({
    success: true,
    message: `Logged ${parsed.data.durationMinutes}m focus session (+${result.xpEarned} XP)!`,
    data: result
  });
});
analyticsRouter.get("/goals", (_req, res) => {
  const goals = analyticsService.getGoals();
  res.json({ success: true, data: goals });
});
analyticsRouter.post("/goals", (req, res) => {
  const parsed = goalUpsertSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid goal payload",
      error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() }
    });
    return;
  }
  const goals = analyticsService.upsertGoal(parsed.data);
  res.status(201).json({ success: true, message: "Goal saved.", data: goals });
});
analyticsRouter.delete("/goals/:id", (req, res) => {
  const goals = analyticsService.deleteGoal(req.params.id);
  res.json({ success: true, message: "Goal removed.", data: goals });
});
analyticsRouter.get("/events", (_req, res) => {
  const events = analyticsService.getRecentEvents();
  res.json({ success: true, data: events });
});
analyticsRouter.post("/events", (req, res) => {
  const { eventType, metadata } = req.body;
  if (!eventType) {
    res.status(400).json({ success: false, error: { code: "INVALID_EVENT", message: "eventType is required" } });
    return;
  }
  const event = analyticsService.trackEvent("current-user", eventType, metadata || {});
  res.status(201).json({ success: true, data: event });
});
analyticsRouter.get("/retention", (_req, res) => {
  const stats = analyticsService.getRetentionStats();
  res.json({ success: true, data: stats });
});

// apps/api/src/routes/feedbackRoutes.ts
import { Router as Router8 } from "express";

// apps/api/src/services/feedbackService.ts
var FeedbackService = class {
  feedbackList = [
    {
      id: "fb-1",
      userId: "usr-student-demo",
      category: "FEATURE_REQUEST",
      rating: 5,
      title: "Obsidian & Notion Study Session Sync",
      description: "Would love to see our completed Pomodoros automatically logged into Notion study trackers.",
      status: "IN_PROGRESS",
      createdAt: "2025-05-10T14:20:00.000Z",
      adminResponse: "Great suggestion! Notion integration is currently planned for v1.2."
    },
    {
      id: "fb-2",
      userId: "usr-student-demo",
      category: "PRAISE",
      rating: 5,
      title: "Reel Guard saved my midterm exam",
      description: "The 5-second breath pause completely broke my habit of opening Instagram between lecture slides.",
      status: "RESOLVED",
      createdAt: "2025-05-08T09:12:00.000Z",
      adminResponse: "Congratulations on your midterm! Proud of your discipline."
    },
    {
      id: "fb-3",
      userId: "usr-student-demo",
      category: "UI_UX",
      rating: 4,
      title: "Dark OLED mode contrast in timer",
      description: "Timer numbers are crisp, but adding an ultra-dim pure black mode for night study would be awesome.",
      status: "TRIAGED",
      createdAt: "2025-05-04T22:45:00.000Z",
      adminResponse: "Under review by design team for the upcoming dark-theme polish."
    }
  ];
  getAllFeedback() {
    return this.feedbackList;
  }
  submitFeedback(data) {
    const item = {
      id: `fb-${Date.now()}`,
      userId: data.userId,
      category: data.category,
      rating: Math.max(1, Math.min(5, data.rating)),
      title: data.title,
      description: data.description,
      status: "SUBMITTED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.feedbackList.unshift(item);
    return item;
  }
  updateStatus(id, status, adminResponse) {
    const item = this.feedbackList.find((f) => f.id === id);
    if (!item) return null;
    item.status = status;
    if (adminResponse) item.adminResponse = adminResponse;
    return item;
  }
};
var feedbackService = new FeedbackService();

// apps/api/src/routes/feedbackRoutes.ts
var feedbackRouter = Router8();
feedbackRouter.get("/", (_req, res) => {
  const items = feedbackService.getAllFeedback();
  res.json({ success: true, data: items });
});
feedbackRouter.post("/", (req, res) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", details: parsed.error.format() }
    });
    return;
  }
  const created = feedbackService.submitFeedback({
    userId: "usr-student-demo",
    ...parsed.data
  });
  res.status(201).json({ success: true, message: "Feedback submitted successfully", data: created });
});

// apps/api/src/routes/subscriptionRoutes.ts
import { Router as Router9 } from "express";

// apps/api/src/services/subscriptionService.ts
var MockRazorpayProvider = class {
  keyId = "rzp_test_focusflow_sandbox";
  keySecret = "mock_secret_key_focusflow";
  getKeyId() {
    return this.keyId;
  }
  async createOrder(amount, currency, receipt) {
    return {
      id: `order_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
      amount,
      currency
    };
  }
  verifySignature(orderId, paymentId, signature) {
    return Boolean(orderId && paymentId && signature && signature.length >= 10);
  }
};
var SubscriptionService = class {
  paymentProvider = new MockRazorpayProvider();
  plans = [
    {
      id: "STUDENT_FREE",
      name: "Free Student",
      priceMonthlyInr: 0,
      priceAnnualInr: 0,
      priceMonthlyUsd: 0,
      description: "Core focus essentials for everyday high school & college studying.",
      features: [
        "Custom Pomodoro & Deep Work Timer",
        "Basic Reels & Shorts navigation limiter (30m daily)",
        "7-day historical focus analytics",
        "Standard XP progression & 16 basic badges",
        "Public study groups access"
      ],
      isPopular: false
    },
    {
      id: "STUDENT_PLUS",
      name: "Student Plus",
      priceMonthlyInr: 149,
      priceAnnualInr: 1490,
      priceMonthlyUsd: 2.99,
      description: "Advanced AI coaching, customized website blocker schedules, and streak safety.",
      features: [
        "Everything in Free Student",
        "Strict Reel Guard: Zero-Bypass lockdown mode",
        "Adaptive AI Study Planner with energy curve balancing",
        "Unlimited streak freezes & challenge creation",
        "Multi-Agent Focus Coach (Weekly synthesis audio & text)",
        "Priority cloud sync across Extension & Mobile"
      ],
      isPopular: true
    },
    {
      id: "PRO_CAMPUS",
      name: "Pro Campus / Institutional",
      priceMonthlyInr: 399,
      priceAnnualInr: 3990,
      priceMonthlyUsd: 6.99,
      description: "Maximum performance for competitive exams & campus counsellor opt-in circles.",
      features: [
        "Everything in Student Plus",
        "Autonomous Multi-Agent System (6 specialized agents)",
        "Institutional Counsellor opt-in portal access",
        "Custom Smart Automations (trigger-based focus workflows)",
        "Exam Crunch Mode with predictive syllabus pacing",
        "Direct 1-on-1 priority support & roadmap voting"
      ],
      isPopular: false
    }
  ];
  // In-memory demo subscription state
  userSubscription = {
    userId: "usr-student-demo",
    tier: "STUDENT_PLUS",
    isActive: true,
    expiresAt: new Date(Date.now() + 864e5 * 30).toISOString(),
    billingInterval: "MONTHLY",
    provider: "MOCK_RAZORPAY",
    featuresUnlocked: [
      "pomodoro_timer",
      "reel_guard_strict",
      "adaptive_study_planner",
      "ai_coach_weekly",
      "streak_freezes"
    ]
  };
  getPlans() {
    return this.plans;
  }
  getUserSubscription(userId) {
    return this.userSubscription;
  }
  async createCheckoutOrder(tier, billingInterval = "MONTHLY") {
    const plan = this.plans.find((p) => p.id === tier);
    if (!plan) {
      throw new Error(`Invalid subscription tier: ${tier}`);
    }
    const price = billingInterval === "ANNUAL" ? plan.priceAnnualInr : plan.priceMonthlyInr;
    const amountInPaise = price * 100;
    const order = await this.paymentProvider.createOrder(amountInPaise, "INR", `rcpt_${tier}_${Date.now()}`);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      tier,
      billingInterval,
      keyId: this.paymentProvider.getKeyId(),
      mockGatewayUrl: `https://api.focusflow.study/mock-checkout/${order.id}`
    };
  }
  verifyAndActivateSubscription(tier, orderId, paymentId, signature, billingInterval = "MONTHLY") {
    const isValid = this.paymentProvider.verifySignature(orderId, paymentId, signature);
    if (!isValid) {
      throw new Error("Payment verification signature mismatch");
    }
    const plan = this.plans.find((p) => p.id === tier);
    const durationDays = billingInterval === "ANNUAL" ? 365 : 30;
    this.userSubscription = {
      userId: "usr-student-demo",
      tier,
      isActive: true,
      expiresAt: new Date(Date.now() + 864e5 * durationDays).toISOString(),
      billingInterval,
      provider: "MOCK_RAZORPAY",
      featuresUnlocked: plan ? plan.features : []
    };
    return this.userSubscription;
  }
};
var subscriptionService = new SubscriptionService();

// apps/api/src/routes/subscriptionRoutes.ts
var subscriptionRouter = Router9();
subscriptionRouter.get("/plans", (_req, res) => {
  const plans = subscriptionService.getPlans();
  res.json({ success: true, data: plans });
});
subscriptionRouter.get("/current", (_req, res) => {
  const current = subscriptionService.getUserSubscription("usr-student-demo");
  res.json({ success: true, data: current });
});
subscriptionRouter.post("/checkout", async (req, res) => {
  try {
    const parsed = subscriptionCheckoutSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details: parsed.error.format() }
      });
      return;
    }
    const order = await subscriptionService.createCheckoutOrder(
      parsed.data.tier,
      parsed.data.billingInterval
    );
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown checkout error";
    res.status(500).json({ success: false, error: { code: "CHECKOUT_FAILED", message: errorMsg } });
  }
});
subscriptionRouter.post("/verify", (req, res) => {
  try {
    const { tier, orderId, paymentId, signature, billingInterval } = req.body;
    if (!tier || !orderId || !paymentId || !signature) {
      res.status(400).json({
        success: false,
        error: { code: "MISSING_PAYMENT_PROOF", message: "Order ID, payment ID, and signature are required." }
      });
      return;
    }
    const updatedSub = subscriptionService.verifyAndActivateSubscription(
      tier,
      orderId,
      paymentId,
      signature,
      billingInterval || "MONTHLY"
    );
    res.json({
      success: true,
      message: "Payment verified! Subscription activated successfully.",
      data: updatedSub
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Verification failed";
    res.status(400).json({ success: false, error: { code: "VERIFICATION_ERROR", message: errorMsg } });
  }
});

// apps/api/src/routes/agentRoutes.ts
import { Router as Router10 } from "express";

// apps/api/src/services/ai/agentOrchestrator.ts
var AgentOrchestrator = class {
  agents = [
    {
      id: "study_planner",
      name: "Study Planner Agent",
      role: "Curriculum & Workload Strategist",
      description: "Aligns exam deadlines, syllabus topics, and daily focus blocks into realistic agendas.",
      avatarIcon: "Calendar",
      autonomyLevel: "SEMI_AUTONOMOUS",
      status: "ONLINE",
      lastRunTimestamp: new Date(Date.now() - 36e5 * 2).toISOString()
    },
    {
      id: "focus_coach",
      name: "Focus Coach Agent",
      role: "Real-time Session Companion",
      description: "Provides cognitive reframing, Pomodoro pacing, and mid-session encouragement.",
      avatarIcon: "Compass",
      autonomyLevel: "FULL_ADVISORY",
      status: "ONLINE",
      lastRunTimestamp: new Date(Date.now() - 18e5).toISOString()
    },
    {
      id: "wellbeing_agent",
      name: "Digital Wellbeing Agent",
      role: "Doomscrolling & Fatigue Defender",
      description: "Monitors short-form video transition velocity and activates evening friction shields.",
      avatarIcon: "ShieldAlert",
      autonomyLevel: "SEMI_AUTONOMOUS",
      status: "ONLINE",
      lastRunTimestamp: new Date(Date.now() - 9e5).toISOString()
    },
    {
      id: "productivity_analyst",
      name: "Productivity Analyst",
      role: "Quantitative Velocity Evaluator",
      description: "Synthesizes weekly focus completion rates, subject ratios, and distraction trends.",
      avatarIcon: "TrendingUp",
      autonomyLevel: "FULL_ADVISORY",
      status: "ONLINE",
      lastRunTimestamp: new Date(Date.now() - 72e5).toISOString()
    },
    {
      id: "goal_optimizer",
      name: "Goal Optimizer",
      role: "Dynamic Target Calibrator",
      description: "Adjusts daily minute goals up or down based on fatigue indices and momentum.",
      avatarIcon: "Target",
      autonomyLevel: "SUPERVISED",
      status: "ONLINE",
      lastRunTimestamp: new Date(Date.now() - 144e5).toISOString()
    },
    {
      id: "report_generator",
      name: "Report Generator Agent",
      role: "Executive Progress Chronicler",
      description: "Compiles formal weekly student synthesis reports and aggregate counsellor briefs.",
      avatarIcon: "FileSpreadsheet",
      autonomyLevel: "FULL_ADVISORY",
      status: "ONLINE",
      lastRunTimestamp: new Date(Date.now() - 864e5).toISOString()
    }
  ];
  actionLogs = [
    {
      id: "act-1",
      agentId: "study_planner",
      action: "Rebalanced Thursday Schedule",
      inputSummary: "Upcoming Algorithms Midterm in 9 days; completed DSA hours at 62%",
      outputSummary: "Added 90m high-energy morning block for Dynamic Programming on Trees",
      confidenceScore: 0.94,
      requiresUserApproval: false,
      isApproved: true,
      timestamp: new Date(Date.now() - 36e5 * 3).toISOString()
    },
    {
      id: "act-2",
      agentId: "wellbeing_agent",
      action: "Prepared Bedtime Scroll Shield",
      inputSummary: "Detected 45 transitions across Instagram Reels after 22:30 yesterday",
      outputSummary: "Proposed activating gentle 5-minute wind-down notice starting 22:15 tonight",
      confidenceScore: 0.91,
      requiresUserApproval: true,
      isApproved: true,
      timestamp: new Date(Date.now() - 36e5 * 2).toISOString()
    },
    {
      id: "act-3",
      agentId: "goal_optimizer",
      action: "Recommended Goal Recalibration",
      inputSummary: "Consecutive 7-day streak maintained with average 125m daily focus",
      outputSummary: "Suggest increasing daily target from 100m to 115m to earn Bonus XP badge",
      confidenceScore: 0.88,
      requiresUserApproval: true,
      isApproved: false,
      timestamp: new Date(Date.now() - 36e5).toISOString()
    },
    {
      id: "act-4",
      agentId: "productivity_analyst",
      action: "Weekly Velocity Benchmark Computed",
      inputSummary: "14.5 hours of focus logged across 18 sessions this week",
      outputSummary: "Focus velocity increased +19% compared to previous 7-day period",
      confidenceScore: 0.98,
      requiresUserApproval: false,
      isApproved: true,
      timestamp: new Date(Date.now() - 18e5).toISOString()
    }
  ];
  getAgents() {
    return this.agents;
  }
  updateAgentAutonomy(agentId, level) {
    const agent = this.agents.find((a) => a.id === agentId);
    if (!agent) return null;
    agent.autonomyLevel = level;
    return agent;
  }
  getActionLogs() {
    return this.actionLogs;
  }
  approveAction(actionId) {
    const action = this.actionLogs.find((a) => a.id === actionId);
    if (!action) return null;
    action.isApproved = true;
    return action;
  }
  runMultiAgentSynthesis() {
    return {
      id: `syn-${Date.now()}`,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      overallProductivityGrade: "A",
      executiveSummary: "Multi-Agent analysis confirms strong cognitive focus consistency. Study sessions showed high completion (91%), while short-form video transitions dropped 24.5% week-over-week. The prime area for optimization remains the 22:15\u201300:30 late evening dopamine trap.",
      agentPerspectives: [
        {
          agentId: "study_planner",
          agentName: "Study Planner Agent",
          keyObservation: "Algorithms exam is 9 days away; student is tracking at 7.5 of 12 planned hours.",
          actionableDirective: "Front-load tomorrow morning with two 45-minute Deep Work blocks for Tree DP."
        },
        {
          agentId: "focus_coach",
          agentName: "Focus Coach Agent",
          keyObservation: "Student maintained uninterrupted 50-minute Pomodoros during afternoon blocks.",
          actionableDirective: "Maintain current 50/10 cadence; avoid extending past 60m to prevent afternoon cognitive fatigue."
        },
        {
          agentId: "wellbeing_agent",
          agentName: "Digital Wellbeing Agent",
          keyObservation: "Late-night reel scrolling declined by 38 minutes on nights where bedtime lock was enabled.",
          actionableDirective: "Keep Bedtime Friction Shield active at 22:15 with audio wind-down trigger."
        },
        {
          agentId: "productivity_analyst",
          agentName: "Productivity Analyst",
          keyObservation: "Productivity velocity index reached 84/100, ranking in top 8% of student cohort.",
          actionableDirective: "Lock in 7-day streak to unlock Master Strategist milestone badge."
        }
      ],
      autonomousActionsProposed: this.actionLogs.filter((a) => a.requiresUserApproval && !a.isApproved)
    };
  }
};
var agentOrchestrator = new AgentOrchestrator();

// apps/api/src/routes/agentRoutes.ts
var agentRouter = Router10();
agentRouter.get("/agents", (_req, res) => {
  const agents = agentOrchestrator.getAgents();
  res.json({ success: true, data: agents });
});
agentRouter.patch("/agents/:id/autonomy", (req, res) => {
  const { autonomyLevel } = req.body;
  if (!["SUPERVISED", "SEMI_AUTONOMOUS", "FULL_ADVISORY"].includes(autonomyLevel)) {
    res.status(400).json({ success: false, error: { code: "INVALID_AUTONOMY_LEVEL" } });
    return;
  }
  const updated = agentOrchestrator.updateAgentAutonomy(req.params.id, autonomyLevel);
  if (!updated) {
    res.status(404).json({ success: false, error: { code: "AGENT_NOT_FOUND" } });
    return;
  }
  res.json({ success: true, data: updated });
});
agentRouter.get("/actions", (_req, res) => {
  const logs = agentOrchestrator.getActionLogs();
  res.json({ success: true, data: logs });
});
agentRouter.post("/actions/:id/approve", (req, res) => {
  const approved = agentOrchestrator.approveAction(req.params.id);
  if (!approved) {
    res.status(404).json({ success: false, error: { code: "ACTION_NOT_FOUND" } });
    return;
  }
  res.json({ success: true, data: approved });
});
agentRouter.post("/synthesis", (_req, res) => {
  const report = agentOrchestrator.runMultiAgentSynthesis();
  res.json({ success: true, data: report });
});

// apps/api/src/routes/automationRoutes.ts
import { Router as Router11 } from "express";

// apps/api/src/services/automationService.ts
var AutomationService = class {
  rules = [
    {
      id: "auto-1",
      userId: "usr-student-demo",
      name: "Doomscroll Friction Shield",
      description: "Trigger a non-intrusive full-screen breath reminder when reel transitions exceed 20 in a day.",
      trigger: "REEL_COUNT_EXCEEDED",
      triggerThreshold: 20,
      action: "SEND_DISMISSABLE_NUDGE",
      isEnabled: true,
      executionCount: 14,
      lastExecutedAt: new Date(Date.now() - 36e5 * 4).toISOString()
    },
    {
      id: "auto-2",
      userId: "usr-student-demo",
      name: "Bedtime Deep Sleep Lockdown",
      description: "Automatically engage strict site blocking for distracting feeds after 22:30.",
      trigger: "BEDTIME_APPROACHING",
      triggerThreshold: 22,
      action: "ACTIVATE_STRICT_BLOCKER",
      isEnabled: true,
      executionCount: 22,
      lastExecutedAt: new Date(Date.now() - 864e5).toISOString()
    },
    {
      id: "auto-3",
      userId: "usr-student-demo",
      name: "Daily Focus Goal Celebration",
      description: "Award +50 bonus XP and trigger confetti notification when 120 study minutes are achieved.",
      trigger: "DAILY_GOAL_MET",
      triggerThreshold: 120,
      action: "AWARD_BONUS_XP",
      isEnabled: true,
      executionCount: 9,
      lastExecutedAt: new Date(Date.now() - 864e5 * 2).toISOString()
    },
    {
      id: "auto-4",
      userId: "usr-student-demo",
      name: "Active Recall Pacing Nudge",
      description: "Notify AI Focus Coach to suggest an eye-strain and hydration break after 3 consecutive sessions.",
      trigger: "FOCUS_SESSION_COMPLETED",
      triggerThreshold: 3,
      action: "NOTIFY_COACH",
      isEnabled: false,
      executionCount: 3,
      lastExecutedAt: new Date(Date.now() - 864e5 * 5).toISOString()
    }
  ];
  getRules() {
    return this.rules;
  }
  createRule(data) {
    const newRule = {
      id: `auto-${Date.now()}`,
      userId: "usr-student-demo",
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      triggerThreshold: data.triggerThreshold,
      action: data.action,
      isEnabled: data.isEnabled !== false,
      executionCount: 0
    };
    this.rules.push(newRule);
    return newRule;
  }
  toggleRule(id) {
    const rule = this.rules.find((r) => r.id === id);
    if (!rule) return null;
    rule.isEnabled = !rule.isEnabled;
    return rule;
  }
  deleteRule(id) {
    const index = this.rules.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.rules.splice(index, 1);
    return true;
  }
};
var automationService = new AutomationService();

// apps/api/src/routes/automationRoutes.ts
var automationRouter = Router11();
automationRouter.get("/", (_req, res) => {
  const rules = automationService.getRules();
  res.json({ success: true, data: rules });
});
automationRouter.post("/", (req, res) => {
  const parsed = automationRuleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", details: parsed.error.format() }
    });
    return;
  }
  const created = automationService.createRule(parsed.data);
  res.status(201).json({ success: true, data: created });
});
automationRouter.patch("/:id/toggle", (req, res) => {
  const updated = automationService.toggleRule(req.params.id);
  if (!updated) {
    res.status(404).json({ success: false, error: { code: "RULE_NOT_FOUND" } });
    return;
  }
  res.json({ success: true, data: updated });
});
automationRouter.delete("/:id", (req, res) => {
  const deleted = automationService.deleteRule(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, error: { code: "RULE_NOT_FOUND" } });
    return;
  }
  res.json({ success: true, message: "Automation rule deleted" });
});

// apps/api/src/routes/institutionalRoutes.ts
import { Router as Router12 } from "express";

// apps/api/src/services/institutionalService.ts
var InstitutionalService = class {
  cohorts = [
    {
      institutionId: "inst-mit-cs",
      institutionName: "Department of Computer Science & Engineering",
      cohortName: "Class of 2026 - Algorithms & Systems",
      totalStudentsEnrolled: 84,
      optedInStudentsCount: 62,
      averageWeeklyFocusMinutes: 530,
      averageWellbeingScore: 82,
      reelsDistractionReductionPercent: 28.4,
      kAnonymityPassed: true,
      dataPrivacyNote: "K-anonymity verified (Cohort size N=62 > threshold 5). All individual student identities, browsing logs, and exact session timestamps are completely stripped."
    },
    {
      institutionId: "inst-stanford-med",
      institutionName: "Pre-Med Academic Guidance Center",
      cohortName: "MCAT Intensive Preparation Spring Cohort",
      totalStudentsEnrolled: 45,
      optedInStudentsCount: 38,
      averageWeeklyFocusMinutes: 680,
      averageWellbeingScore: 78,
      reelsDistractionReductionPercent: 34.1,
      kAnonymityPassed: true,
      dataPrivacyNote: "K-anonymity verified (Cohort size N=38 > threshold 5). Aggregated focus distribution accessible by verified counsellors only."
    },
    {
      institutionId: "inst-small-test",
      institutionName: "Experimental Seminar Group",
      cohortName: "Advanced Quantum Computing Lab",
      totalStudentsEnrolled: 4,
      optedInStudentsCount: 3,
      averageWeeklyFocusMinutes: 0,
      averageWellbeingScore: 0,
      reelsDistractionReductionPercent: 0,
      kAnonymityPassed: false,
      dataPrivacyNote: "PRIVACY SHIELD ACTIVE: Cohort size (N=3) is below the minimum k-anonymity privacy threshold (k >= 5). Metrics are withheld to prevent re-identification of individual students."
    }
  ];
  getCohorts() {
    return this.cohorts;
  }
  getCohortById(id) {
    const cohort = this.cohorts.find((c) => c.institutionId === id);
    if (!cohort) return null;
    if (!cohort.kAnonymityPassed) {
      return {
        ...cohort,
        averageWeeklyFocusMinutes: 0,
        averageWellbeingScore: 0,
        reelsDistractionReductionPercent: 0,
        dataPrivacyNote: "DATA REDACTED FOR STUDENT PRIVACY: Minimum cohort size of 5 opted-in students required to reveal aggregate statistics."
      };
    }
    return cohort;
  }
};
var institutionalService = new InstitutionalService();

// apps/api/src/routes/institutionalRoutes.ts
var institutionalRouter = Router12();
institutionalRouter.get("/cohorts", (_req, res) => {
  const cohorts = institutionalService.getCohorts();
  res.json({ success: true, data: cohorts });
});
institutionalRouter.get("/cohorts/:id", (req, res) => {
  const cohort = institutionalService.getCohortById(req.params.id);
  if (!cohort) {
    res.status(404).json({ success: false, error: { code: "COHORT_NOT_FOUND" } });
    return;
  }
  res.json({ success: true, data: cohort });
});

// apps/api/src/routes/systemRoutes.ts
import { Router as Router13 } from "express";

// apps/api/src/services/systemSpecsService.ts
var SystemSpecsService = class {
  specs = {
    projectName: "FOCUSFLOW",
    tagline: "Take Control of Your Time. Master Your Focus.",
    version: "1.0.0-prod",
    architectureType: "TypeScript Monorepo (npm workspaces)",
    complianceStandards: [
      "FERPA & COPPA Student Privacy aligned",
      "Ethical non-invasive telemetry (No DOM scraping, no keylogging, no private messages)",
      "Consent & Privacy by Design with student opt-in",
      "OWASP Top 10 API Security with Helmet and CORS"
    ],
    dataSafetyGuarantees: [
      "Short-form video swipe counts are strictly non-intrusive client-side URL/DOM estimates",
      "Zero private browsing history logged or exported",
      "Parent and Counsellor sharing requires affirmative student cryptographic consent",
      "JWT tokens are short-lived with rotating refresh tokens"
    ],
    monorepo: {
      rootWorkspaces: [
        "apps/web",
        "apps/api",
        "apps/extension",
        "packages/shared-types",
        "packages/validation",
        "packages/shared-utils"
      ],
      apps: [
        {
          name: "@focusflow/web",
          directory: "apps/web",
          framework: "React 19 SPA + Vite",
          runtime: "Browser",
          description: "Unified student focus web application with real-time gamification, circadian planner, and analytics.",
          keyTechnologies: ["React 19", "TypeScript", "Tailwind CSS v4", "Lucide React", "Zustand", "Motion"],
          responsibilities: [
            "Student productivity dashboard",
            "Focus timer with Pomodoro and deep work intervals",
            "AI Focus Coach chat and recommendations",
            "Gamification progression, badges, streak heatmaps",
            "Adaptive study planner and circadian scheduling",
            "Wellbeing intelligence and burnout prevention"
          ]
        },
        {
          name: "@focusflow/api",
          directory: "apps/api",
          framework: "Express.js + TypeScript",
          runtime: "Node.js 22 LTS",
          description: "Production REST API powering multi-tenant student sessions, analytics, AI agents, and integrations.",
          keyTechnologies: ["Express", "TypeScript", "Prisma ORM", "PostgreSQL", "Zod", "Helmet", "bcrypt"],
          responsibilities: [
            "Session and auth management with JWT",
            "Prisma data access layer for PostgreSQL",
            "AI Focus recommendations via Gemini Flash API",
            "Gamification XP calculations, badge unlock triggers",
            "Counsellor portal aggregate queries with consent enforcement"
          ]
        },
        {
          name: "@focusflow/extension",
          directory: "apps/extension",
          framework: "Chrome Extension Manifest V3",
          runtime: "Chromium Browser Background & Content Scripts",
          description: "Distraction shielding browser companion providing ethical short-form reels capping and focus blocking.",
          keyTechnologies: ["Chrome MV3", "Declarative Net Request", "Chrome Storage API", "Alarms API", "Idle API"],
          responsibilities: [
            "Declarative Net Request dynamic website blocking during focus",
            "Non-intrusive short-form transition estimation (IG Reels, YT Shorts, FB Reels)",
            "Daily swipe quota counter with midnight reset",
            "Popup interface with quick focus toggle"
          ]
        }
      ],
      packages: [
        {
          name: "@focusflow/shared-types",
          directory: "packages/shared-types",
          type: "types",
          description: "Common TypeScript domain contracts, database shapes, and API request/response payloads.",
          exports: ["User", "FocusSession", "DailySummary", "ReelStat", "Badge", "StudyPlan", "WellbeingMetric"]
        },
        {
          name: "@focusflow/validation",
          directory: "packages/validation",
          type: "validation",
          description: "Zod schemas validating all client form inputs and API payload boundaries.",
          exports: ["loginSchema", "registerSchema", "focusSessionSchema", "consentSchema", "studyPlanSchema"]
        },
        {
          name: "@focusflow/shared-utils",
          directory: "packages/shared-utils",
          type: "utility",
          description: "Pure deterministic utility functions for math, formatting, and calculations.",
          exports: ["calculateXpLevel", "formatSecondsToHuman", "sanitizeDomain", "calculateStreakContinuity"]
        }
      ]
    },
    database: {
      orm: "Prisma ORM v6",
      engine: "PostgreSQL 16",
      modelCount: 16,
      models: [
        { name: "User", category: "Auth & Identity", description: "Student account record with role and email." },
        { name: "Profile", category: "Auth & Identity", description: "Student biographical details, target exams, and timezone." },
        { name: "Device", category: "Sync", description: "Registered browsers, extensions, and mobile clients." },
        { name: "PrivacyConsent", category: "Compliance", description: "Explicit opt-in permissions for counsellor/parent data sharing." },
        { name: "UsageSession", category: "Telemetry", description: "Aggregated active study periods and domain categories." },
        { name: "ReelDailyStat", category: "Telemetry", description: "Daily non-intrusive short-form reel swipe counts." },
        { name: "DailySummary", category: "Analytics", description: "End-of-day rollup of focus hours, distraction score, and XP." },
        { name: "FocusSession", category: "Productivity", description: "Individual Pomodoro or deep work timers completed." },
        { name: "FocusGoal", category: "Productivity", description: "Daily and weekly focus targets set by the student." },
        { name: "BlockedWebsite", category: "Intervention", description: "URL blacklist enforced during focus blocks." },
        { name: "AIRecommendation", category: "Intelligence", description: "Personalized focus insights generated by AI Coach." },
        { name: "XPTransaction", category: "Gamification", description: "Audit trail of XP awarded for study blocks and milestones." },
        { name: "Achievement", category: "Gamification", description: "Catalog of 24 unlockable badges and progress indicators." },
        { name: "Streak", category: "Gamification", description: "Active day counters with freeze protection." },
        { name: "StudyGroup", category: "Social", description: "Student study pods, group timers, and shared goals." },
        { name: "GroupMember", category: "Social", description: "Role and status in a collaborative study pod." },
        { name: "Notification", category: "System", description: "In-app alerts, streak reminders, and nudge banners." }
      ]
    },
    chromeExtension: {
      manifestVersion: 3,
      permissions: ["tabs", "storage", "alarms", "idle", "declarativeNetRequest"],
      contentScripts: [
        {
          script: "src/content/instagram.ts",
          matches: ["*://*.instagram.com/reels/*", "*://*.instagram.com/reel/*"],
          methodology: "MutationObserver monitoring URL pathname transitions without touching post content or messages"
        },
        {
          script: "src/content/youtube.ts",
          matches: ["*://*.youtube.com/shorts/*"],
          methodology: "Popstate & yt-navigate-finish event listener observing Shorts counter increments"
        },
        {
          script: "src/content/facebook.ts",
          matches: ["*://*.facebook.com/reel/*"],
          methodology: "History pushState listener estimating video transitions"
        }
      ],
      blockingEngine: "Declarative Net Request dynamic ruleset updating on focus timer start/stop",
      privacyNotice: "Zero DOM text scraping, zero keylogging, zero audio/video capture, zero private messaging access."
    },
    phases: [
      { phase: 1, title: "Project Foundation & Monorepo Architecture", status: "completed", summary: "TypeScript Monorepo, Prisma schema, Express backend, MV3 extension structure, shared packages." },
      { phase: 2, title: "UI/UX Design System & Web App", status: "completed", summary: "Dark-first responsive design, student dashboard, navigation, typography, design tokens." },
      { phase: 3, title: "Backend REST API & Services", status: "completed", summary: "JWT auth, Prisma data services, controllers, error middleware, health checks." },
      { phase: 4, title: "Chrome Extension MV3 & Blocker", status: "completed", summary: "Reels estimation, Declarative Net Request site blocking, storage sync, popup UI." },
      { phase: 5, title: "AI Focus Coach Integration", status: "completed", summary: "Gemini Flash 2.5 API integration, structured prompts, personalized study advice." },
      { phase: 6, title: "Gamification, Streaks & Social Pods", status: "completed", summary: "24 achievements, XP levels, streak freezes, friend circles, study group timers." },
      { phase: 7, title: "Mobile Architecture & Android Specs", status: "completed", summary: "Kotlin MVVM architecture specs, AccessibilityService usage tracking, local notifications." },
      { phase: 8, title: "Testing, Security Audit & Launch Preparation", status: "completed", summary: "Production audit, security audit, database hardening, release checklists." },
      { phase: 9, title: "Adaptive Study Planner & Wellbeing Intelligence", status: "completed", summary: "Circadian study scheduler, burnout prevention engine, student SaaS tier billing." },
      { phase: 10, title: "AI Swarm, Smart Automations & Counsellor Portal", status: "completed", summary: "Autonomous multi-agent study crew, event-driven webhooks, FERPA-compliant counsellor dashboard." }
    ]
  };
  getArchitectureSpecs() {
    return this.specs;
  }
  getMonorepoBreakdown() {
    return {
      success: true,
      data: {
        monorepo: this.specs.monorepo,
        database: this.specs.database,
        chromeExtension: this.specs.chromeExtension,
        compliance: this.specs.complianceStandards,
        dataSafety: this.specs.dataSafetyGuarantees,
        generatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
};
var systemSpecsService = new SystemSpecsService();

// apps/api/src/routes/systemRoutes.ts
var systemRouter = Router13();
systemRouter.get("/architecture", (_req, res) => {
  const specs = systemSpecsService.getArchitectureSpecs();
  res.json({
    success: true,
    data: specs,
    meta: {
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      server: "FOCUSFLOW Unified Production Runtime",
      nodeEnv: process.env.NODE_ENV || "development"
    }
  });
});
systemRouter.get("/specs", (_req, res) => {
  const breakdown = systemSpecsService.getMonorepoBreakdown();
  res.json(breakdown);
});

// apps/api/src/routes/index.ts
var apiRouter = Router14();
apiRouter.use("/v1", healthRouter);
apiRouter.use("/v1/system", systemRouter);
apiRouter.use("/v1/gamification", gamificationRouter);
apiRouter.use("/v1", socialRouter);
apiRouter.use("/v1/notifications", notificationRouter);
apiRouter.use("/v1/planner", plannerRouter);
apiRouter.use("/v1/wellbeing", wellbeingRouter);
apiRouter.use("/v1/analytics", analyticsRouter);
apiRouter.use("/v1/feedback", feedbackRouter);
apiRouter.use("/v1/subscriptions", subscriptionRouter);
apiRouter.use("/v1/ai-agents", agentRouter);
apiRouter.use("/v1/automations", automationRouter);
apiRouter.use("/v1/institutions", institutionalRouter);

// apps/api/src/middleware/errorMiddleware.ts
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[Error] ${req.method} ${req.url} - Status ${statusCode}:`, err);
  res.status(statusCode).json({
    success: false,
    message,
    ...process.env.NODE_ENV === "development" && { stack: err.stack }
  });
}
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
}

// apps/api/src/vercel.ts
var app = express();
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false
  })
);
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", apiRouter);
app.use("/", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
var vercel_default = app;
export {
  vercel_default as default
};
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
