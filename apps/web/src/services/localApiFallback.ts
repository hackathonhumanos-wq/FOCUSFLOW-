/**
 * @file apps/web/src/services/localApiFallback.ts
 * @description Strictly typed isomorphic fallback dispatcher for static-only hosting environments
 * where `/api/v1/*` serverless routes are unreachable. Executes the exact domain services and Zod
 * validation schemas from `@focusflow/validation` and `apps/api/src/services` while preserving `[DEMO]`
 * / `isDemo: true` telemetry labeling per AGENTS.md.
 */
import type {
  AgentAutonomyLevel,
  AgentId,
  BillingInterval,
  LeaderboardMetric,
  LeaderboardScope,
  SubjectWorkload,
  SubscriptionTier,
  XPActivityType,
} from '../../../../packages/shared-types/src/index.ts';
import {
  automationRuleSchema,
  feedbackSchema,
  focusSessionCompleteSchema,
  goalUpsertSchema,
  privacyConsentSchema,
  reelsDataCorrectionSchema,
  reelsSettingsUpdateSchema,
  studySlotCreateSchema,
  subscriptionCheckoutSchema,
} from '../../../../packages/validation/src/index.ts';
import { agentOrchestrator } from '../../../api/src/services/ai/agentOrchestrator.ts';
import { analyticsService } from '../../../api/src/services/analyticsService.ts';
import { automationService } from '../../../api/src/services/automationService.ts';
import { feedbackService } from '../../../api/src/services/feedbackService.ts';
import {
  gamificationService,
  STUDENT_LEVELS,
  XP_RULES,
} from '../../../api/src/services/gamificationService.ts';
import { HealthService } from '../../../api/src/services/healthService.ts';
import { institutionalService } from '../../../api/src/services/institutionalService.ts';
import { notificationService } from '../../../api/src/services/notificationService.ts';
import { socialService } from '../../../api/src/services/socialService.ts';
import { studyPlannerService } from '../../../api/src/services/studyPlannerService.ts';
import { subscriptionService } from '../../../api/src/services/subscriptionService.ts';
import { wellbeingIntelligenceService } from '../../../api/src/services/wellbeingIntelligenceService.ts';

function parseBody(rawBody?: BodyInit | null): Record<string, unknown> {
  if (!rawBody || typeof rawBody !== 'string') {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(rawBody);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export async function dispatchLocalApiFallback<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const method = (options?.method || 'GET').toUpperCase();
  const parsedUrl = new URL(endpoint, 'http://focusflow.local');
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;
  const body = parseBody(options?.body);
  const defaultUserId = (searchParams.get('userId') ||
    (typeof body.userId === 'string' ? body.userId : '') ||
    'current-user') as string;

  // 1. Health
  if (method === 'GET' && pathname === '/health') {
    const health = HealthService.getHealth();
    return {
      success: true,
      message: health.message,
      data: {
        status: 'ok',
        timestamp: health.timestamp || new Date().toISOString(),
      },
    } as T;
  }

  // 2. Analytics, Overview, Focus Sessions & Goals
  if (method === 'GET' && pathname === '/analytics/overview') {
    return {
      success: true,
      data: analyticsService.getOverview(),
    } as T;
  }

  if (method === 'POST' && pathname === '/analytics/focus-sessions') {
    const parsed = focusSessionCompleteSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid focus session payload');
    }
    const result = analyticsService.logFocusSession(parsed.data);
    return {
      success: true,
      message: `Logged ${parsed.data.durationMinutes}m focus session (+${result.xpEarned} XP)!`,
      data: result,
    } as T;
  }

  if (method === 'GET' && pathname === '/analytics/goals') {
    return {
      success: true,
      data: analyticsService.getGoals(),
    } as T;
  }

  if (method === 'POST' && pathname === '/analytics/goals') {
    const parsed = goalUpsertSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid goal payload');
    }
    const goals = analyticsService.upsertGoal(parsed.data);
    return {
      success: true,
      message: 'Goal saved.',
      data: goals,
    } as T;
  }

  const deleteGoalMatch = pathname.match(/^\/analytics\/goals\/([^/]+)$/);
  if (method === 'DELETE' && deleteGoalMatch) {
    const goals = analyticsService.deleteGoal(decodeURIComponent(deleteGoalMatch[1]));
    return {
      success: true,
      message: 'Goal removed.',
      data: goals,
    } as T;
  }

  // 3. Wellbeing, Reels & Shorts, Privacy Consent
  if (method === 'GET' && pathname === '/wellbeing/health-score') {
    return {
      success: true,
      data: wellbeingIntelligenceService.calculateHealthScore(),
    } as T;
  }

  if (method === 'GET' && pathname === '/wellbeing/reels') {
    return {
      success: true,
      data: wellbeingIntelligenceService.getReelsAnalytics(),
    } as T;
  }

  if (method === 'PATCH' && pathname === '/wellbeing/reels/settings') {
    const parsed = reelsSettingsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid Reels settings payload');
    }
    const updated = wellbeingIntelligenceService.updateReelsSettings(parsed.data);
    return {
      success: true,
      message: 'Short-form limits and tracking controls updated.',
      data: updated,
    } as T;
  }

  if (method === 'POST' && pathname === '/wellbeing/reels/correct') {
    const parsed = reelsDataCorrectionSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid correction request');
    }
    const result = wellbeingIntelligenceService.correctReelsHistory(parsed.data);
    if (!result.updated) {
      throw new Error(result.message);
    }
    return {
      success: true,
      message: result.message,
      data: result.summary,
    } as T;
  }

  if (method === 'GET' && pathname === '/wellbeing/privacy') {
    return {
      success: true,
      data: wellbeingIntelligenceService.getPrivacyConsent(),
    } as T;
  }

  if (method === 'PUT' && pathname === '/wellbeing/privacy') {
    const parsed = privacyConsentSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid privacy settings payload');
    }
    const updated = wellbeingIntelligenceService.updatePrivacyConsent(parsed.data);
    return {
      success: true,
      message: 'Privacy consent preferences saved.',
      data: updated,
    } as T;
  }

  // 4. Adaptive Study Planner
  if (method === 'GET' && pathname === '/planner/subjects') {
    return {
      success: true,
      data: studyPlannerService.getSubjects(),
    } as T;
  }

  if (method === 'POST' && pathname === '/planner/subjects') {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      throw new Error('Subject name is required');
    }
    const created = studyPlannerService.addOrUpdateSubject(
      body as Partial<SubjectWorkload> & { name: string }
    );
    return {
      success: true,
      data: created,
    } as T;
  }

  if (method === 'GET' && pathname === '/planner/schedule') {
    return {
      success: true,
      data: studyPlannerService.getCurrentSchedule(),
    } as T;
  }

  if (method === 'POST' && pathname === '/planner/schedule') {
    const energyArchetype =
      body.energyArchetype === 'MORNING_LARK' ||
      body.energyArchetype === 'AFTERNOON_BALANCED' ||
      body.energyArchetype === 'NIGHT_OWL'
        ? body.energyArchetype
        : 'AFTERNOON_BALANCED';
    const targetHours = Number(body.targetHours) || 6;
    const regenerate = Boolean(body.regenerate);
    const schedule = regenerate
      ? studyPlannerService.regenerateSchedule(energyArchetype, targetHours)
      : studyPlannerService.generateAdaptiveSchedule(energyArchetype, targetHours);
    return {
      success: true,
      data: schedule,
    } as T;
  }

  if (method === 'POST' && pathname === '/planner/slots') {
    const parsed = studySlotCreateSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid study task payload');
    }
    const updatedSchedule = studyPlannerService.addCustomSlot(parsed.data);
    return {
      success: true,
      message: 'Study task added to today’s plan.',
      data: updatedSchedule,
    } as T;
  }

  const toggleSlotMatch = pathname.match(/^\/planner\/slots\/([^/]+)\/toggle$/);
  if (method === 'PATCH' && toggleSlotMatch) {
    const updatedSchedule = studyPlannerService.toggleSlotComplete(
      decodeURIComponent(toggleSlotMatch[1])
    );
    return {
      success: true,
      data: updatedSchedule,
    } as T;
  }

  // 5. Gamification & XP
  if (method === 'GET' && pathname === '/gamification/profile') {
    const levelProgress = gamificationService.getLevelProgress(defaultUserId);
    const streakInfo = gamificationService.getStreakInfo(defaultUserId);
    const achievements = gamificationService.getAchievements();
    const unlockedBadges = achievements.filter((item) => item.isUnlocked).length;
    return {
      success: true,
      data: {
        userId: defaultUserId,
        levelProgress,
        streakInfo,
        totalBadges: achievements.length,
        unlockedBadges,
        levelsReference: STUDENT_LEVELS,
        xpRulesReference: XP_RULES,
      },
    } as T;
  }

  if (method === 'GET' && pathname === '/gamification/xp') {
    return {
      success: true,
      data: {
        totalXp: gamificationService.getXp(defaultUserId),
        levelProgress: gamificationService.getLevelProgress(defaultUserId),
      },
    } as T;
  }

  if (method === 'GET' && pathname === '/gamification/xp/history') {
    const transactions = gamificationService.getTransactions(defaultUserId);
    return {
      success: true,
      data: {
        transactions,
        count: transactions.length,
      },
    } as T;
  }

  if (method === 'POST' && pathname === '/gamification/xp/award') {
    const activityType = body.activityType as XPActivityType | undefined;
    if (!activityType) {
      throw new Error('activityType is required');
    }
    const customDescription =
      typeof body.customDescription === 'string' ? body.customDescription : undefined;
    const referenceId = typeof body.referenceId === 'string' ? body.referenceId : undefined;
    const previousLevel = gamificationService.getLevelProgress(defaultUserId).currentLevel.levelNumber;
    const result = gamificationService.awardXp(
      defaultUserId,
      activityType,
      customDescription,
      referenceId
    );
    if (result.awarded) {
      const newLevel = gamificationService.getLevelProgress(defaultUserId).currentLevel;
      if (newLevel.levelNumber > previousLevel) {
        notificationService.emitNotification(
          defaultUserId,
          'LEVEL_UP',
          `Level Up! You reached ${newLevel.title}`,
          `Amazing work! You unlocked Level ${newLevel.levelNumber}: ${newLevel.title}. Keep pushing your focus goals!`
        );
      }
    }
    return {
      success: result.awarded,
      message: result.message,
      data: {
        xpEarned: result.xpEarned,
        newTotalXp: result.newTotalXp,
      },
    } as T;
  }

  if (method === 'GET' && pathname === '/gamification/achievements') {
    const achievements = gamificationService.getAchievements();
    return {
      success: true,
      data: {
        achievements,
        unlockedCount: achievements.filter((item) => item.isUnlocked).length,
        totalCount: achievements.length,
      },
    } as T;
  }

  if (method === 'GET' && pathname === '/gamification/streaks') {
    return {
      success: true,
      data: gamificationService.getStreakInfo(defaultUserId),
    } as T;
  }

  if (method === 'GET' && pathname === '/gamification/challenges') {
    const challenges = gamificationService.getChallenges(defaultUserId);
    return {
      success: true,
      data: {
        challenges,
        daily: challenges.filter((c) => c.type === 'DAILY'),
        weekly: challenges.filter((c) => c.type === 'WEEKLY'),
      },
    } as T;
  }

  const claimChallengeMatch = pathname.match(/^\/gamification\/challenges\/([^/]+)\/claim$/);
  if (method === 'POST' && claimChallengeMatch) {
    const challengeId = decodeURIComponent(claimChallengeMatch[1]);
    const result = gamificationService.claimChallengeReward(defaultUserId, challengeId);
    if (!result.success) {
      throw new Error(result.message);
    }
    notificationService.emitNotification(
      defaultUserId,
      'XP_EARNED',
      'Challenge Reward Claimed',
      result.message
    );
    return result as T;
  }

  // 6. Friends, Study Groups & Leaderboards
  if (method === 'GET' && pathname === '/friends') {
    const friends = socialService.getFriends(defaultUserId);
    return {
      success: true,
      data: {
        all: friends,
        accepted: friends.filter((f) => f.status === 'ACCEPTED'),
        pendingIncoming: friends.filter((f) => f.status === 'PENDING_INCOMING'),
        pendingOutgoing: friends.filter((f) => f.status === 'PENDING_OUTGOING'),
      },
    } as T;
  }

  if (method === 'POST' && pathname === '/friends/request') {
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    if (!username) {
      throw new Error('Username is required');
    }
    const result = socialService.sendFriendRequest(defaultUserId, username);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result as T;
  }

  const acceptFriendMatch = pathname.match(/^\/friends\/([^/]+)\/accept$/);
  if (method === 'POST' && acceptFriendMatch) {
    const result = socialService.acceptFriendRequest(
      defaultUserId,
      decodeURIComponent(acceptFriendMatch[1])
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    notificationService.emitNotification(
      defaultUserId,
      'FRIEND_ACCEPTED',
      'Friend Request Accepted',
      result.message
    );
    return result as T;
  }

  const rejectFriendMatch = pathname.match(/^\/friends\/([^/]+)\/reject$/);
  if (method === 'POST' && rejectFriendMatch) {
    const result = socialService.rejectFriendRequest(
      defaultUserId,
      decodeURIComponent(rejectFriendMatch[1])
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return result as T;
  }

  const deleteFriendMatch = pathname.match(/^\/friends\/([^/]+)$/);
  if (method === 'DELETE' && deleteFriendMatch) {
    const result = socialService.removeFriend(
      defaultUserId,
      decodeURIComponent(deleteFriendMatch[1])
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return result as T;
  }

  if (method === 'GET' && pathname === '/groups') {
    const groups = socialService.getGroups();
    return {
      success: true,
      data: {
        groups,
        myGroups: groups.filter((g) => Boolean(g.userRole)),
      },
    } as T;
  }

  if (method === 'POST' && pathname === '/groups') {
    const name = typeof body.name === 'string' ? body.name : '';
    const description = typeof body.description === 'string' ? body.description : '';
    const isPrivate = Boolean(body.isPrivate);
    const result = socialService.createGroup(defaultUserId, { name, description, isPrivate });
    if (!result.success) {
      throw new Error(result.message);
    }
    return result as T;
  }

  if (method === 'POST' && pathname === '/groups/join') {
    const inviteCode = typeof body.inviteCode === 'string' ? body.inviteCode.trim() : '';
    if (!inviteCode) {
      throw new Error('Invite code is required');
    }
    const result = socialService.joinGroupByCode(defaultUserId, inviteCode);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result as T;
  }

  const leaveGroupMatch = pathname.match(/^\/groups\/([^/]+)\/leave$/);
  if (method === 'POST' && leaveGroupMatch) {
    const result = socialService.leaveGroup(
      defaultUserId,
      decodeURIComponent(leaveGroupMatch[1])
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return result as T;
  }

  if (method === 'GET' && pathname === '/leaderboards') {
    const scope = ((searchParams.get('scope') || 'GLOBAL').toUpperCase() as LeaderboardScope);
    const metric = ((searchParams.get('metric') || 'WEEKLY_XP').toUpperCase() as LeaderboardMetric);
    const entries = socialService.getLeaderboard(scope, metric, defaultUserId);
    const isOptedIn = socialService.getLeaderboardPrivacy(defaultUserId);
    return {
      success: true,
      data: {
        scope,
        metric,
        entries,
        isOptedIn,
        topPodium: entries.slice(0, 3),
      },
    } as T;
  }

  if (method === 'POST' && pathname === '/leaderboards/privacy') {
    const result = socialService.setLeaderboardPrivacy(
      defaultUserId,
      Boolean(body.showOnLeaderboard)
    );
    return {
      success: true,
      data: result,
    } as T;
  }

  // 7. Notifications
  if (method === 'GET' && pathname === '/notifications') {
    return {
      success: true,
      data: {
        notifications: notificationService.getNotifications(defaultUserId),
        unreadCount: notificationService.getUnreadCount(defaultUserId),
      },
    } as T;
  }

  if (method === 'PATCH' && pathname === '/notifications/read-all') {
    return notificationService.markAllAsRead(defaultUserId) as T;
  }

  const markReadMatch = pathname.match(/^\/notifications\/([^/]+)\/read$/);
  if (method === 'PATCH' && markReadMatch) {
    const result = notificationService.markAsRead(
      defaultUserId,
      decodeURIComponent(markReadMatch[1])
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return result as T;
  }

  // 8. Feedback
  if (method === 'GET' && pathname === '/feedback') {
    return {
      success: true,
      data: feedbackService.getAllFeedback(),
    } as T;
  }

  if (method === 'POST' && pathname === '/feedback') {
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid feedback payload');
    }
    const created = feedbackService.submitFeedback({
      userId: 'usr-student-demo',
      ...parsed.data,
    });
    return {
      success: true,
      message: 'Feedback submitted successfully',
      data: created,
    } as T;
  }

  // 9. Subscriptions
  if (method === 'GET' && pathname === '/subscriptions/plans') {
    return {
      success: true,
      data: subscriptionService.getPlans(),
    } as T;
  }

  if (method === 'GET' && pathname === '/subscriptions/current') {
    return {
      success: true,
      data: subscriptionService.getUserSubscription('usr-student-demo'),
    } as T;
  }

  if (method === 'POST' && pathname === '/subscriptions/checkout') {
    const parsed = subscriptionCheckoutSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid checkout payload');
    }
    const order = await subscriptionService.createCheckoutOrder(
      parsed.data.tier,
      parsed.data.billingInterval
    );
    return {
      success: true,
      data: order,
    } as T;
  }

  if (method === 'POST' && pathname === '/subscriptions/verify') {
    const tier = body.tier as SubscriptionTier | undefined;
    const orderId = typeof body.orderId === 'string' ? body.orderId : '';
    const paymentId = typeof body.paymentId === 'string' ? body.paymentId : '';
    const signature = typeof body.signature === 'string' ? body.signature : '';
    const billingInterval = (body.billingInterval as BillingInterval | undefined) || 'MONTHLY';
    if (!tier || !orderId || !paymentId || !signature) {
      throw new Error('Order ID, payment ID, and signature are required.');
    }
    const updatedSub = subscriptionService.verifyAndActivateSubscription(
      tier,
      orderId,
      paymentId,
      signature,
      billingInterval
    );
    return {
      success: true,
      message: 'Payment verified! Subscription activated successfully.',
      data: updatedSub,
    } as T;
  }

  // 10. AI Agent Swarm
  if (method === 'GET' && pathname === '/ai-agents/agents') {
    return {
      success: true,
      data: agentOrchestrator.getAgents(),
    } as T;
  }

  if (method === 'GET' && pathname === '/ai-agents/actions') {
    return {
      success: true,
      data: agentOrchestrator.getActionLogs(),
    } as T;
  }

  if (method === 'POST' && pathname === '/ai-agents/synthesis') {
    return {
      success: true,
      data: agentOrchestrator.runMultiAgentSynthesis(),
    } as T;
  }

  const updateAutonomyMatch = pathname.match(/^\/ai-agents\/agents\/([^/]+)\/autonomy$/);
  if (method === 'PATCH' && updateAutonomyMatch) {
    const agentId = decodeURIComponent(updateAutonomyMatch[1]) as AgentId;
    const autonomyLevel = body.autonomyLevel as AgentAutonomyLevel;
    if (!['SUPERVISED', 'SEMI_AUTONOMOUS', 'FULL_ADVISORY'].includes(autonomyLevel)) {
      throw new Error('Invalid autonomy level');
    }
    const updated = agentOrchestrator.updateAgentAutonomy(agentId, autonomyLevel);
    if (!updated) {
      throw new Error('Agent not found');
    }
    return {
      success: true,
      data: updated,
    } as T;
  }

  const approveActionMatch = pathname.match(/^\/ai-agents\/actions\/([^/]+)\/approve$/);
  if (method === 'POST' && approveActionMatch) {
    const approved = agentOrchestrator.approveAction(
      decodeURIComponent(approveActionMatch[1])
    );
    if (!approved) {
      throw new Error('Agent action not found');
    }
    return {
      success: true,
      data: approved,
    } as T;
  }

  // 11. Smart Automations
  if (method === 'GET' && pathname === '/automations') {
    return {
      success: true,
      data: automationService.getRules(),
    } as T;
  }

  if (method === 'POST' && pathname === '/automations') {
    const parsed = automationRuleSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid automation rule payload');
    }
    return {
      success: true,
      data: automationService.createRule(parsed.data),
    } as T;
  }

  const toggleAutomationMatch = pathname.match(/^\/automations\/([^/]+)\/toggle$/);
  if (method === 'PATCH' && toggleAutomationMatch) {
    const updated = automationService.toggleRule(
      decodeURIComponent(toggleAutomationMatch[1])
    );
    if (!updated) {
      throw new Error('Automation rule not found');
    }
    return {
      success: true,
      data: updated,
    } as T;
  }

  const deleteAutomationMatch = pathname.match(/^\/automations\/([^/]+)$/);
  if (method === 'DELETE' && deleteAutomationMatch) {
    const deleted = automationService.deleteRule(
      decodeURIComponent(deleteAutomationMatch[1])
    );
    if (!deleted) {
      throw new Error('Automation rule not found');
    }
    return {
      success: true,
      message: 'Automation rule deleted',
    } as T;
  }

  // 12. Institutional Cohorts
  if (method === 'GET' && pathname === '/institutions/cohorts') {
    return {
      success: true,
      data: institutionalService.getCohorts(),
    } as T;
  }

  throw new Error(`Endpoint not found: ${method} ${pathname}`);
}
