import {
  intentResult,
  activityCandidates,
  restaurantCandidates,
  basePlan,
  feedbackPlans,
} from './mockData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function parseUserIntent() {
  await delay(600);
  return { ...intentResult };
}

export async function searchActivity() {
  await delay(700);
  return [...activityCandidates];
}

export async function searchRestaurant() {
  await delay(650);
  return [...restaurantCandidates];
}

export async function checkQueue(restaurants) {
  await delay(500);
  return restaurants.map((r) => ({
    ...r,
    queueStatus: r.queueTime < 15 ? '无需排队' : `预计排队${r.queueTime}分钟`,
  }));
}

export async function planRoute() {
  await delay(600);
  return { ...basePlan.route };
}

export async function estimateBudget() {
  await delay(550);
  return { ...basePlan.budget };
}

export async function composePlan() {
  await delay(700);
  return { ...basePlan };
}

export async function executePlan(plan) {
  await delay(800);
  return {
    success: true,
    actions: [
      { label: `门票已锁定：${plan.execution?.ticketTarget || basePlan.execution.ticketTarget}`, status: 'done' },
      { label: `餐厅已预约 ${plan.execution?.restaurantTime || basePlan.execution.restaurantTime} 家庭座：${plan.execution?.restaurantTarget || basePlan.execution.restaurantTarget}`, status: 'done' },
      { label: '路线导航已生成', status: 'done' },
      { label: `出发提醒已设置为 ${plan.execution?.reminderTime || basePlan.execution.reminderTime}`, status: 'done' },
      { label: '分享文案已生成', status: 'done' },
    ],
  };
}

export async function replanFromFeedback(feedbackKey) {
  await delay(800);
  return feedbackPlans[feedbackKey] || null;
}
