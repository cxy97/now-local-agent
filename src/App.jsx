import { useState, useRef, useCallback } from 'react';
import { defaultUserInput, feedbackPlans, intentResult } from './mockData';
import {
  parseUserIntent,
  searchActivity,
  searchRestaurant,
  checkQueue,
  planRoute,
  estimateBudget,
  composePlan,
  replanFromFeedback,
} from './tools';

const FEEDBACK_OPTIONS = [
  { key: 'indoorPlay', icon: '🎢', label: '孩子更想玩室内项目' },
  { key: 'compactRoute', icon: '📍', label: '不想走太远，路线再集中一点' },
  { key: 'lighterRestaurant', icon: '🍽', label: '餐厅再清淡一点' },
  { key: 'chaoyangParkLine', icon: '🌳', label: '想去朝阳公园和蓝色港湾' },
];

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function StepIcon({ status }) {
  if (status === 'done') return <span className="step-icon done">✓</span>;
  if (status === 'running') return <span className="step-icon running">⟳</span>;
  if (status === 'error') return <span className="step-icon error">✗</span>;
  return <span className="step-icon pending">·</span>;
}

function getRestaurantQueueTime(plan) {
  if (plan?.execution?.restaurantTarget === 'MOKA BROS 摩卡站（Solana蓝色港湾店）') return 20;
  return 10;
}

function isMujiPlan(plan) {
  return plan?.execution?.restaurantTarget === '无印良品食堂 MUJI Diner';
}

const placeImageMap = {
  从家出发: '/images/home-start.jpg',
  返程: '/images/home-start.jpg',
  返程到家: '/images/home-start.jpg',
  星河湾生态公园: '/images/park-flowers.jpg',
  '童年无限（朝阳大悦城店）': '/images/kids-playground.jpg',
  '无印良品食堂 MUJI Diner': '/images/restaurant-food.jpg',
  朝阳公园: '/images/chaoyang-park.jpg',
  '童话星球·儿童亲子密室（蓝色港湾店）': '/images/fairy-planet.jpg',
  'MOKA BROS 摩卡站（Solana蓝色港湾店）': '/images/moka-bros.jpg',
};

const placeDetailUrlMap = {
  星河湾生态公园: 'http://dpurl.cn/jR0nWSMz',
  朝阳公园: 'http://dpurl.cn/7HbyC7qz',
  '无印良品食堂 MUJI Diner': 'https://m.dianping.com/shopinfo/FW9eDT91Uat8dFhr?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=224&cityid=2&isoversea=0',
  '无印良品餐堂 MUJI Diner': 'https://m.dianping.com/shopinfo/FW9eDT91Uat8dFhr?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=224&cityid=2&isoversea=0',
  '无印良品餐堂 MUJI Diner（朝阳大悦城店）': 'https://m.dianping.com/shopinfo/FW9eDT91Uat8dFhr?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=224&cityid=2&isoversea=0',
  'MOKA BROS 摩卡站（Solana蓝色港湾店）': 'https://m.dianping.com/shopinfo/l6anZ2oWPupdNLmN?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=116&cityid=2&isoversea=0',
  'MOKA BROS 摩卡站': 'https://m.dianping.com/shopinfo/l6anZ2oWPupdNLmN?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=116&cityid=2&isoversea=0',
  'MOKA BROS': 'https://m.dianping.com/shopinfo/l6anZ2oWPupdNLmN?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=116&cityid=2&isoversea=0',
  摩卡站: 'https://m.dianping.com/shopinfo/l6anZ2oWPupdNLmN?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=116&cityid=2&isoversea=0',
};

function getTimelineImage(item) {
  const title = item?.title || '';
  if (item?.image) return item.image;
  if (placeImageMap[title]) return placeImageMap[title];
  if (title.includes('从家出发') || title.includes('返程')) return placeImageMap.返程;
  if (title.includes('星河湾')) return placeImageMap.星河湾生态公园;
  if (title.includes('童年无限')) return placeImageMap['童年无限（朝阳大悦城店）'];
  if (title.includes('MUJI Diner')) return placeImageMap['无印良品食堂 MUJI Diner'];
  if (title.includes('摩卡站')) return placeImageMap['MOKA BROS 摩卡站（Solana蓝色港湾店）'];
  if (title.includes('朝阳公园')) return placeImageMap.朝阳公园;
  return null;
}

function getTimelineDetailUrl(item) {
  const title = item?.title || item?.name || item?.placeName || '';
  if (item?.detailUrl) return item.detailUrl;
  if (placeDetailUrlMap[title]) return placeDetailUrlMap[title];
  if (title.includes('星河湾生态公园')) return placeDetailUrlMap.星河湾生态公园;
  if (title.includes('朝阳公园')) return placeDetailUrlMap.朝阳公园;
  if (title.includes('MUJI Diner') || title.includes('无印良品餐堂') || title.includes('无印良品食堂')) {
    return placeDetailUrlMap['无印良品食堂 MUJI Diner'];
  }
  if (title.includes('MOKA BROS') || title.includes('摩卡站')) return placeDetailUrlMap['MOKA BROS 摩卡站（Solana蓝色港湾店）'];
  return null;
}

function getFeedbackAgentText(feedbackKey, feedbackPlan, currentPlan) {
  if (feedbackKey !== 'lighterRestaurant') return feedbackPlan.agentText;
  return isMujiPlan(currentPlan)
    ? feedbackPlan.agentTextWhenMuji
    : feedbackPlan.agentTextWhenOther;
}

function getScoringBasis(plan) {
  const title = plan?.title || '';
  const tags = (plan?.tags || []).join(' ');
  const routeNodes = (plan?.route?.nodes || []).join(' ');
  const timelineTitles = (plan?.timeline || []).map((item) => item.title).join(' ');
  const planText = `${title} ${tags} ${routeNodes} ${timelineTitles}`;

  if (planText.includes('朝阳公园') && (planText.includes('蓝色港湾') || planText.includes('童话星球'))) {
    return ['户外体验 30%', '亲子娱乐完整度 25%', '路线可达性 20%', '餐饮健康度 15%', '预算 10%'];
  }
  if (planText.includes('室内项目优先') || planText.includes('增强室内游乐')) {
    return ['室内游玩占比 35%', '儿童兴趣匹配 30%', '体力消耗适中 15%', '路线集中 10%', '餐饮适配 10%'];
  }
  if (planText.includes('清淡晚餐朝阳亲子计划') || planText.includes('低脂') || planText.includes('无烟餐厅')) {
    return ['餐厅清淡度 35%', '亲子友好 25%', '路线不绕行 20%', '排队风险 10%', '预算 10%'];
  }
  if (planText.includes('路线集中') || planText.includes('集中亲子') || planText.includes('少步行')) {
    return ['路线集中度 40%', '步行距离 25%', '亲子适配 20%', '餐饮便利 10%', '预算 5%'];
  }
  return ['亲子适配 35%', '路线集中 25%', '餐厅清淡 20%', '排队风险 10%', '预算 10%'];
}

function buildRestaurantSwitchPlan(prev) {
  if (!prev) return prev;
  const newTimeline = prev.timeline.map((item) => {
    if (item.title === '无印良品食堂 MUJI Diner' || (item.desc && item.desc.includes('MUJI Diner'))) {
      return {
        ...item,
        time: '18:15 - 19:30',
        title: 'MOKA BROS 摩卡站（Solana蓝色港湾店）',
        desc: '蓝色港湾西式轻食，清淡健康，亲子友好，排队20分钟，可预约18:15四人桌。',
        image: placeImageMap['MOKA BROS 摩卡站（Solana蓝色港湾店）'],
        detailUrl: placeDetailUrlMap['MOKA BROS 摩卡站（Solana蓝色港湾店）'],
      };
    }
    return item;
  });

  return {
    ...prev,
    tags: [...prev.tags.filter((t) => t !== '已调整'), '异常补救'],
    timeline: newTimeline,
    budget: { ...prev.budget, restaurant: 295, transport: 35, total: 498 },
    route: {
      ...prev.route,
      nodes: prev.route.nodes.map((n) => (n === '无印良品食堂 MUJI Diner' ? 'MOKA BROS 摩卡站（Solana蓝色港湾店）' : n)),
      totalDistance: '9.5km',
      walkingDistance: '700m',
    },
    execution: {
      ...prev.execution,
      restaurantTarget: 'MOKA BROS 摩卡站（Solana蓝色港湾店）',
      restaurantTime: '18:15',
    },
  };
}

function PlanView({ plan }) {
  if (!plan) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-text">输入需求并点击"开始规划"，方案将在这里展示</div>
      </div>
    );
  }

  return (
    <div>
      {/* 1. AI 需求理解卡 */}
      <div className="plan-card">
        <div className="section-title" style={{ marginTop: 0 }}>AI 需求理解</div>
        <div className="intent-grid">
          <div className="intent-item">
            <span className="intent-label">场景</span>
            <span className="intent-value">{intentResult.scenario}</span>
          </div>
          <div className="intent-item">
            <span className="intent-label">时间</span>
            <span className="intent-value">{intentResult.time}</span>
          </div>
          <div className="intent-item">
            <span className="intent-label">时长</span>
            <span className="intent-value">{intentResult.duration}</span>
          </div>
          <div className="intent-item">
            <span className="intent-label">同行人</span>
            <span className="intent-value">{intentResult.companions}</span>
          </div>
          <div className="intent-item">
            <span className="intent-label">偏好</span>
            <span className="intent-value">{intentResult.preferences.join('、')}</span>
          </div>
          <div className="intent-item">
            <span className="intent-label">目标</span>
            <span className="intent-value">{intentResult.goals.join('、')}</span>
          </div>
        </div>
      </div>

      {/* 2. 方案 Hero */}
      <div className="plan-hero-card">
        <div className="plan-hero-copy">
          <div className="plan-title">{plan.title}</div>
          <div className="plan-tags">
            {plan.tags.map((t, i) => (
              <span key={i} className="tag">{t}</span>
            ))}
          </div>
          <div className="plan-hero-desc">
            从亲子活动、休息缓冲到清淡晚餐，Agent 已组合出一条轻松少折返的半日路线。
          </div>
        </div>
        <div className="plan-hero-image">
          <img
            src="/images/family-hero.png"
            alt=""
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>

      {/* 3. 核心摘要卡片 */}
      <div className="plan-card">
        <div className="summary-grid">
          <div className="summary-card">
            <span>预计预算</span>
            <strong>¥{plan.budget.total}</strong>
            <em>总计</em>
          </div>
          <div className="summary-card">
            <span>总距离</span>
            <strong>{plan.route.totalDistance}</strong>
            <em>行程距离</em>
          </div>
          <div className="summary-card">
            <span>步行距离</span>
            <strong>{plan.route.walkingDistance}</strong>
            <em>轻松步行</em>
          </div>
          <div className="summary-card">
            <span>餐厅排队</span>
            <strong>{getRestaurantQueueTime(plan)}分钟</strong>
            <em>预计等待</em>
          </div>
        </div>
      </div>

      {/* 4. AI 决策过程卡 */}
      <div className="decision-card" style={{ marginTop: 18 }}>
        <div className="section-title" style={{ marginTop: 0 }}>AI 决策过程</div>

        <div className="scoring-section">
          <div className="scoring-label">活动候选评分</div>
          <div className="scoring-list">
            <div className="scoring-row">
              <div className="scoring-info">
                <span className="scoring-name">星河湾生态公园</span>
                <span className="scoring-reason">免费、自然环境好、亲子露营</span>
              </div>
              <div className="scoring-bar-wrap">
                <div className="scoring-bar" style={{ width: '91%' }} />
              </div>
              <span className="scoring-score">91</span>
            </div>
            <div className="scoring-row">
              <div className="scoring-info">
                <span className="scoring-name">童年无限（朝阳大悦城店）</span>
                <span className="scoring-reason">室内游乐、项目丰富、同商圈</span>
              </div>
              <div className="scoring-bar-wrap">
                <div className="scoring-bar" style={{ width: '88%' }} />
              </div>
              <span className="scoring-score">88</span>
            </div>
            <div className="scoring-row">
              <div className="scoring-info">
                <span className="scoring-name">朝阳公园</span>
                <span className="scoring-reason">老牌公园但周末人多、步行量大</span>
              </div>
              <div className="scoring-bar-wrap">
                <div className="scoring-bar" style={{ width: '72%' }} />
              </div>
              <span className="scoring-score">72</span>
            </div>
          </div>
        </div>

        <div className="scoring-section">
          <div className="scoring-label">餐厅候选评分</div>
          <div className="scoring-list">
            <div className="scoring-row">
              <div className="scoring-info">
                <span className="scoring-name">无印良品食堂 MUJI Diner</span>
                <span className="scoring-reason">清淡、有宝宝椅、同商圈零移动</span>
              </div>
              <div className="scoring-bar-wrap">
                <div className="scoring-bar" style={{ width: '90%' }} />
              </div>
              <span className="scoring-score">90</span>
            </div>
            <div className="scoring-row">
              <div className="scoring-info">
                <span className="scoring-name">MOKA BROS 摩卡站（Solana蓝色港湾店）</span>
                <span className="scoring-reason">健康轻食但距离稍远</span>
              </div>
              <div className="scoring-bar-wrap">
                <div className="scoring-bar" style={{ width: '79%' }} />
              </div>
              <span className="scoring-score">79</span>
            </div>
            <div className="scoring-row">
              <div className="scoring-info">
                <span className="scoring-name">麻六记</span>
                <span className="scoring-reason">川菜重口、不适合5岁儿童</span>
              </div>
              <div className="scoring-bar-wrap">
                <div className="scoring-bar" style={{ width: '45%' }} />
              </div>
              <span className="scoring-score">45</span>
            </div>
          </div>
        </div>

        <div className="scoring-section">
          <div className="scoring-label">评分依据</div>
          <div className="scoring-basis">
            {getScoringBasis(plan).map((basis) => (
              <span key={basis}>{basis}</span>
            ))}
          </div>
        </div>

        <div className="scoring-section">
          <div className="scoring-label">最终选择策略</div>
          <div className="strategy-chain">
            <span className="strategy-tag">亲子适配</span>
            <span className="strategy-arrow">&gt;</span>
            <span className="strategy-tag">距离</span>
            <span className="strategy-arrow">&gt;</span>
            <span className="strategy-tag">排队时间</span>
            <span className="strategy-arrow">&gt;</span>
            <span className="strategy-tag">预算</span>
            <span className="strategy-arrow">&gt;</span>
            <span className="strategy-tag">口味偏好</span>
          </div>
        </div>
      </div>

      {/* 5. 方案决策依据卡 */}
      <div className="decision-card">
        <div className="section-title">方案决策依据</div>
        <div className="decision-list">
          <div className="decision-item">
            <span className="decision-icon">🎯</span>
            <div>
              <strong>活动选择：</strong>
              优先户外亲子活动（星河湾生态公园），搭配室内游乐（童年无限），适合5岁儿童
            </div>
          </div>
          <div className="decision-item">
            <span className="decision-icon">🍽</span>
            <div>
              <strong>餐厅筛选：</strong>
              清淡口味 + 有宝宝椅 + 无烟餐厅 + 同商圈零移动
            </div>
          </div>
          <div className="decision-item">
            <span className="decision-icon">🗺</span>
            <div>
              <strong>路线逻辑：</strong>
              星河湾生态公园 → 童年无限（大悦城5层） → MUJI Diner（大悦城B1），少折返
            </div>
          </div>
          <div className="decision-item">
            <span className="decision-icon">💡</span>
            <div>
              <strong>约束平衡：</strong>
              控制在4-6小时内，总预算约{plan.budget.total}元
            </div>
          </div>
        </div>
      </div>

      {/* 6. 时间线 */}
      <div className="plan-card">
        <div className="section-title" style={{ marginTop: 0 }}>时间线</div>
        <div className="timeline">
          {plan.timeline.map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-thumb">
                {getTimelineImage(item) && (
                  <img
                    src={getTimelineImage(item)}
                    alt=""
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
              </div>
              <div className="timeline-content">
                <div className="timeline-time">{item.time}</div>
                <div className="timeline-title">{item.title}</div>
                <div className="timeline-desc">{item.desc}</div>
                {getTimelineDetailUrl(item) && (
                  <a
                    className="place-detail-link"
                    href={getTimelineDetailUrl(item)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看详情 →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 执行信息卡 */}
      <div className="plan-card">
        <div className="section-title" style={{ marginTop: 0 }}>可执行动作</div>
        <div className="decision-rationale">
          <div className="rationale-item">
            <span className="success-check">✓</span>
            <div className="rationale-text">{plan.execution.ticketTarget} 门票可锁定</div>
          </div>
          <div className="rationale-item">
            <span className="success-check">✓</span>
            <div className="rationale-text">{plan.execution.restaurantTarget} 支持 {plan.execution.restaurantTime} 家庭座预约</div>
          </div>
          <div className="rationale-item">
            <span className="success-check">✓</span>
            <div className="rationale-text">路线导航可生成：{plan.route.nodes.join(' → ')}</div>
          </div>
          <div className="rationale-item">
            <span className="success-check">✓</span>
            <div className="rationale-text">出发提醒可设置为 {plan.execution.reminderTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildIntentLines(res) {
  return [
    `✓ 已识别场景：${res.scenario}`,
    `✓ 已识别时间：${res.time}`,
    `✓ 已识别时长：${res.duration}`,
    `✓ 已识别同行人：${res.companions}`,
    `✓ 已识别偏好：${res.preferences.join('、')}`,
    `✓ 已识别目标：${res.goals.join(' + ')}`,
  ];
}

function buildActivityLines(res) {
  return [
    `✓ 找到 ${res.length} 个候选活动`,
    `✓ 优先推荐：${res[0].name}`,
    `✓ 备选活动：${res.slice(1).map((r) => r.name).join('、')}`,
  ];
}

function buildRestaurantLines(res) {
  return [
    `✓ 找到 ${res.length} 家候选餐厅`,
    `✓ 优先推荐：${res[0].name}`,
    `✓ 备选餐厅：${res.slice(1).map((r) => r.name).join('、')}`,
  ];
}

function buildQueueLines(res) {
  return res.map((r) =>
    r.reservationAvailable
      ? `✓ ${r.name}：预计排队${r.queueTime}分钟，可预约${r.availableTime}${r.seatType}`
      : `✓ ${r.name}：预计排队${r.queueTime}分钟，暂不支持预约`
  );
}

function buildRouteLines(res) {
  return [
    `✓ 总距离：${res.totalDistance}`,
    `✓ 步行距离：${res.walkingDistance}`,
    `✓ 交通方式：${res.transportMode}`,
    `✓ 预计返回：${res.estimatedReturnTime}`,
  ];
}

function buildBudgetLines(res) {
  return [
    `✓ 活动门票：约${res.activity}元`,
    `✓ 晚餐：约${res.restaurant}元`,
    `✓ 交通：约${res.transport}元`,
    `✓ 合计：约${res.total}元`,
  ];
}

function buildPlanLines(res) {
  return [
    `✓ 已生成「${res.title}」`,
    `✓ 已组合活动、餐厅、路线与预算`,
    `✓ 可分享方案，也可一键安排`,
  ];
}

export default function App() {
  const [userInput, setUserInput] = useState(defaultUserInput);
  const [steps, setSteps] = useState([]);
  const [plan, setPlan] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreCheckModal, setShowPreCheckModal] = useState(false);
  const [preCheckDone, setPreCheckDone] = useState(false);
  const [shareText, setShareText] = useState('');
  const abortRef = useRef(false);

  const [executionSteps, setExecutionSteps] = useState([]);
  const [executionDone, setExecutionDone] = useState(false);
  const [shareStage, setShareStage] = useState('edit');
  const [customFeedback, setCustomFeedback] = useState('');
  const [agentExpanded, setAgentExpanded] = useState(false);

  const runPlan = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setPlan(null);
    setSteps([]);
    setShowPreCheckModal(false);
    setPreCheckDone(false);
    setAgentExpanded(true);
    abortRef.current = false;

    const stepDefs = [
      { title: '需求解析', runningText: '正在解析用户需求……' },
      { title: '活动搜索', runningText: '正在搜索适合亲子家庭的本地活动……' },
      { title: '餐厅匹配', runningText: '正在匹配清淡、亲子友好餐厅……' },
      { title: '排队检查', runningText: '正在检查餐厅排队和预约状态……' },
      { title: '路线规划', runningText: '正在规划活动、过渡休息和晚餐路线……' },
      { title: '预算估算', runningText: '正在估算整体预算……' },
      { title: '方案生成', runningText: '正在生成可执行方案……' },
    ];

    const toolFns = [
      () => parseUserIntent(),
      () => searchActivity(),
      () => searchRestaurant(),
      () => checkQueue(results[2]),
      () => planRoute(),
      () => estimateBudget(),
      () => composePlan(),
    ];

    const lineBuilders = [
      buildIntentLines,
      buildActivityLines,
      buildRestaurantLines,
      buildQueueLines,
      buildRouteLines,
      buildBudgetLines,
      buildPlanLines,
    ];

    const results = [];

    for (let i = 0; i < stepDefs.length; i++) {
      if (abortRef.current) break;

      // Add step as running
      setSteps((prev) => [
        ...prev,
        { title: stepDefs[i].title, runningText: stepDefs[i].runningText, status: 'running', result: '' },
      ]);

      await delay(500 + Math.random() * 300);

      try {
        const res = await toolFns[i]();
        results.push(res);

        const lines = lineBuilders[i](res);

        // Reveal lines one by one while keeping status as running
        for (let j = 0; j < lines.length; j++) {
          if (abortRef.current) break;
          const line = lines[j];
          setSteps((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, result: last.result ? last.result + '\n' + line : line };
            return next;
          });
          if (j < lines.length - 1) {
            await delay(250 + Math.random() * 150);
          }
        }

        // All lines shown, mark done
        setSteps((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], status: 'done' };
          return next;
        });

        if (i === 6) {
          setPlan(res);
          setShareText(buildShareText(res));
          setAgentExpanded(false);
        }
      } catch {
        setSteps((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], status: 'error', result: '调用失败' };
          return next;
        });
      }
    }

    setIsRunning(false);
  }, [isRunning]);

  const handleFeedback = useCallback(
    async (fbKey) => {
      setShowShareModal(false);
      setIsRunning(true);
      setAgentExpanded(true);

      // Step 1: feedback received
      setSteps((prev) => [
        ...prev,
        {
          title: '收到反馈，正在重新规划',
          runningText: '正在根据反馈调整方案……',
          status: 'running',
          result: '',
          isFeedback: true,
          feedbackText: feedbackPlans[fbKey].feedbackText,
        },
      ]);

      await delay(500);

      const fb = await replanFromFeedback(fbKey);

      // Reveal agentText lines one by one
      const agentLines = getFeedbackAgentText(fbKey, fb, plan).map((line) => `✓ ${line}`);
      for (let j = 0; j < agentLines.length; j++) {
        const line = agentLines[j];
        setSteps((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, result: last.result ? last.result + '\n' + line : line };
          return next;
        });
        if (j < agentLines.length - 1) await delay(250 + Math.random() * 150);
      }

      // Mark first feedback step done
      setSteps((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], status: 'done' };
        return next;
      });

      // Step 2: apply updates
      setSteps((prev) => [
        ...prev,
        {
          title: '方案调整',
          runningText: '正在应用方案调整……',
          status: 'running',
          result: '',
        },
      ]);

      await delay(600);

      // Reveal update lines one by one
      const updateLines = fb.updates.map((line) => `✓ ${line}`);
      for (let j = 0; j < updateLines.length; j++) {
        const line = updateLines[j];
        setSteps((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, result: last.result ? last.result + '\n' + line : line };
          return next;
        });
        if (j < updateLines.length - 1) await delay(250 + Math.random() * 150);
      }

      // Mark second feedback step done
      setSteps((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], status: 'done' };
        return next;
      });

      setPlan(fb.plan);
      setShareText(buildShareText(fb.plan));
      setIsRunning(false);
      setAgentExpanded(false);
    },
    [plan]
  );

  function buildShareText(p) {
    const lines = [];
    lines.push(`周六下午的朝阳亲子安排来啦~`);
    lines.push('');
    p.timeline.forEach((t) => {
      if (t.title === '从家出发' || t.title.includes('返程')) {
        lines.push(`${t.time}  ${t.title}`);
      } else {
        lines.push(`${t.time}  ${t.title}  ${t.desc}`);
      }
    });
    lines.push('');
    lines.push(`总共大概花 ¥${p.budget.total}，路线是 ${p.route.nodes.join(' → ')}`);
    lines.push(`你觉得行不行？不满意我再调~`);
    return lines.join('\n');
  }

  const handleCustomFeedback = useCallback(async () => {
    if (!customFeedback.trim()) return;
    const feedback = customFeedback.trim();
    setShowShareModal(false);
    setCustomFeedback('');
    setIsRunning(true);
    setAgentExpanded(true);

    // Feedback banner
    setSteps((prev) => [
      ...prev,
      {
        title: '收到反馈，正在重新规划',
        runningText: '正在根据反馈调整方案……',
        status: 'running',
        result: '',
        isFeedback: true,
        feedbackText: feedback,
      },
    ]);

    await delay(500);

    // Reveal analysis lines
    const analysisLines = [
      '✓ 已收到新的同行人反馈',
      '✓ 优先基于已有候选活动和餐厅重新组合',
      '✓ 重新检查时间、预算和路线',
      '✓ 生成新版方案',
    ];
    for (let j = 0; j < analysisLines.length; j++) {
      setSteps((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, result: last.result ? last.result + '\n' + analysisLines[j] : analysisLines[j] };
        return next;
      });
      if (j < analysisLines.length - 1) await delay(250 + Math.random() * 150);
    }

    setSteps((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], status: 'done' };
      return next;
    });

    // Build adjusted plan from existing candidates
    const adjustedPlan = {
      title: '朝阳公园蓝色港湾亲子计划',
      tags: ['同行人反馈', '朝阳公园', '蓝色港湾', '清淡晚餐'],
      timeline: [
        { time: '14:00', title: '从家出发', desc: '前往朝阳公园，先安排轻户外活动。', image: placeImageMap.从家出发 },
        { time: '14:20 - 15:40', title: '朝阳公园', desc: '大草坪和湖区适合亲子散步，节奏更完整。', image: placeImageMap.朝阳公园, detailUrl: placeDetailUrlMap.朝阳公园 },
        { time: '16:00 - 17:30', title: '童话星球·儿童亲子密室（蓝色港湾店）', desc: '蓝色港湾亲子室内项目，适合孩子继续玩。', image: placeImageMap['童话星球·儿童亲子密室（蓝色港湾店）'] },
        { time: '18:00 - 19:15', title: 'MOKA BROS 摩卡站（Solana蓝色港湾店）', desc: '健康轻食，适合亲子清淡晚餐。', image: placeImageMap['MOKA BROS 摩卡站（Solana蓝色港湾店）'], detailUrl: placeDetailUrlMap['MOKA BROS 摩卡站（Solana蓝色港湾店）'] },
        { time: '19:35', title: '返程到家', desc: '从蓝色港湾返程，整体体验更完整。', image: placeImageMap.返程 },
      ],
      budget: { activity: 218, restaurant: 295, transport: 45, total: 558 },
      route: {
        nodes: ['家', '朝阳公园', '童话星球·儿童亲子密室（蓝色港湾店）', 'MOKA BROS 摩卡站（Solana蓝色港湾店）', '家'],
        totalDistance: '10.6km',
        walkingDistance: '950m',
        transportMode: '打车/自驾',
        estimatedReturnTime: '19:35',
      },
      execution: {
        ticketTarget: '童话星球·儿童亲子密室（蓝色港湾店）',
        restaurantTarget: 'MOKA BROS 摩卡站（Solana蓝色港湾店）',
        restaurantTime: '18:00',
        reminderTime: '13:40',
      },
    };

    setPlan(adjustedPlan);
    setShareText(buildShareText(adjustedPlan));
    setIsRunning(false);
    setAgentExpanded(false);
  }, [customFeedback]);

  const startExecution = useCallback(async (planToExecute) => {
    if (!planToExecute) return;
    setExecutionSteps([]);
    setExecutionDone(false);
    setShowSuccessModal(true);

    const execDefs = [
      { runningText: '正在锁定活动门票……', label: `门票已锁定：${planToExecute.execution.ticketTarget}` },
      { runningText: '正在预约餐厅座位……', label: `餐厅已预约：${planToExecute.execution.restaurantTime} ${planToExecute.execution.restaurantTarget} 家庭座` },
      { runningText: '正在生成路线导航……', label: '路线导航已生成' },
      { runningText: '正在设置出发提醒……', label: `出发提醒已设置为 ${planToExecute.execution.reminderTime}` },
      { runningText: '正在生成分享文案……', label: '分享文案已生成' },
    ];

    for (let i = 0; i < execDefs.length; i++) {
      const def = execDefs[i];
      setExecutionSteps((prev) => [...prev, { label: def.label, runningText: def.runningText, status: 'running' }]);
      await delay(500 + Math.random() * 200);
      setExecutionSteps((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], status: 'done' };
        return next;
      });
    }

    setExecutionDone(true);
  }, []);

  const handleExecute = useCallback(() => {
    if (!plan) return;
    if (!preCheckDone && isMujiPlan(plan)) {
      setShowPreCheckModal(true);
      return;
    }
    startExecution(plan);
  }, [plan, preCheckDone, startExecution]);

  const handlePreCheckSwitch = useCallback(() => {
    const updatedPlan = buildRestaurantSwitchPlan(plan);
    if (!updatedPlan) return;
    setPlan(updatedPlan);
    setShareText(buildShareText(updatedPlan));
    setPreCheckDone(true);
    setShowPreCheckModal(false);
    startExecution(updatedPlan);
  }, [plan, startExecution]);

  const handlePreCheckKeep = useCallback(() => {
    setPreCheckDone(true);
    setShowPreCheckModal(false);
    startExecution(plan);
  }, [plan, startExecution]);

  const preCheckSwitchPlan = showPreCheckModal ? buildRestaurantSwitchPlan(plan) : null;
  const preCheckCurrentRestaurant = plan?.execution?.restaurantTarget || '当前餐厅';
  const preCheckCurrentBudget = plan?.budget?.total ?? '-';
  const preCheckCurrentRoute = plan?.route?.nodes?.join(' → ') || '当前路线';
  const preCheckSwitchRestaurant = preCheckSwitchPlan?.execution?.restaurantTarget || '备选餐厅';
  const preCheckSwitchBudget = preCheckSwitchPlan?.budget?.total ?? '-';
  const preCheckSwitchRoute = preCheckSwitchPlan?.route?.nodes?.join(' → ') || '建议路线';
  const preCheckBudgetDelta =
    typeof preCheckCurrentBudget === 'number' && typeof preCheckSwitchBudget === 'number'
      ? preCheckSwitchBudget - preCheckCurrentBudget
      : null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <div className="header-brand">
            <span className="header-brand-main">NOW</span>
            <span className="header-brand-divider">|</span>
            <span className="header-brand-sub">AI 本地生活 Agent</span>
          </div>
          <div className="header-context">
            <div className="header-pill header-location-pill">
              <span>📍</span>
              <span>北京·朝阳区｜朝阳大悦城附近</span>
            </div>
            <div className="header-pill header-weather-pill">
              <span>🌤</span>
              <span>26°C 多云</span>
            </div>
          </div>
        </div>
        <div className="header-right header-actions">
          <button
            className="header-share-btn"
            disabled={!plan}
            onClick={() => { setShareStage('edit'); setShowShareModal(true); }}
          >
            分享方案
          </button>
          <div className="user-avatar" aria-label="用户头像占位">U</div>
        </div>
      </header>

      <div className="app-container">
        {/* Left Column */}
        <div className="col-left">
          <div className="panel-header">
            <span className="dot" />
            <h3>用户输入</h3>
          </div>
          <div className="col-left-body">

          <div>
            <div className="input-label">描述你的需求</div>
            <div className="input-desc">输入一句话，Agent 会结合定位自动规划活动、餐厅、路线与预约</div>
            <textarea
              className="user-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="描述你想要的周末安排..."
            />
          </div>

          <button className="btn-primary" onClick={runPlan} disabled={isRunning || !userInput.trim()}>
            {isRunning ? '规划中...' : '开始规划'}
          </button>

          <div className="city-illustration">
            <img
              src="/images/city-illustration.png"
              alt=""
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>
      </div>

      {/* Center Column */}
      <div className="col-center">
        <div className="panel-header">
          <span className="dot" />
          <h3>Agent 执行过程</h3>
          {steps.length > 0 && !isRunning && plan && (
            <button
              className="agent-toggle-btn"
              onClick={() => setAgentExpanded((v) => !v)}
            >
              {agentExpanded ? '收起' : '展开'}
            </button>
          )}
        </div>
        <div className="col-center-body">
          {steps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🤖</div>
              <div className="empty-state-text">Agent 等待中，点击"开始规划"启动</div>
            </div>
          ) : isRunning || agentExpanded ? (
            <div className="agent-steps">
              {steps.map((step, i) => (
                <div key={i}>
                  {step.isFeedback && (
                    <div className="feedback-banner">
                      <span className="fb-icon">💬</span>
                      <span className="feedback-banner-text">反馈：{step.feedbackText}</span>
                    </div>
                  )}
                  {i > 0 && !steps[i - 1]?.isFeedback && !step.isFeedback && (
                    <div className="step-connector" />
                  )}
                  <div className="agent-step">
                    <StepIcon status={step.status} />
                    <div className="step-content">
                      <div className="step-title">{step.title}</div>
                      {step.status === 'running' && step.runningText && (
                        <div className="step-params">{step.runningText}</div>
                      )}
                      {step.result && step.result.split('\n').map((line, li) => (
                        <div key={li} className="step-result">{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="agent-summary-card">
              <div className="agent-summary-title">本次规划已完成</div>
              <div className="agent-summary-list">
                <div className="agent-summary-item">✓ 已识别用户需求</div>
                <div className="agent-summary-item">✓ 已召回活动和餐厅候选</div>
                <div className="agent-summary-item">✓ 已完成路线和预算估算</div>
                <div className="agent-summary-item">✓ 已生成可执行方案</div>
              </div>
              <button
                className="agent-toggle-btn-inline"
                onClick={() => setAgentExpanded(true)}
              >
                查看完整过程
              </button>
            </div>
          )}
          <div className="agent-capability-chain">
            能力链路：需求理解 → 候选评分 → 方案生成 → 反馈重规划 → 执行前检查
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-right">
        <div className="panel-header">
          <span className="dot" />
          <h3>方案结果</h3>
        </div>
        <div className="col-right-body">
          <PlanView plan={plan} />
          {plan && (
            <div className="plan-actions">
              <button className="btn-secondary" onClick={() => { setShareStage('edit'); setShowShareModal(true); }}>
                分享方案
              </button>
              <button className="btn-accent" onClick={handleExecute}>
                确认并一键安排
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share / Feedback Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => { setShowShareModal(false); setCustomFeedback(''); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>{shareStage === 'edit' ? '分享方案' : '同行人反馈'}</h4>
              <button className="modal-close" onClick={() => { setShowShareModal(false); setCustomFeedback(''); }}>×</button>
            </div>
            <div className="modal-body">
              {shareStage === 'edit' ? (
                <>
                  <div className="section-title">即将发送</div>
                  <textarea
                    className="share-textarea"
                    value={shareText}
                    onChange={(e) => setShareText(e.target.value)}
                  />
                  <button
                    className="btn-accent"
                    style={{ width: '100%' }}
                    onClick={() => setShareStage('feedback')}
                  >
                    分享至同行人
                  </button>
                </>
              ) : (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    background: 'var(--green-dim)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: 'var(--green)',
                    fontWeight: 600,
                  }}>
                    ✓ 方案已分享给同行人
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px',
                    lineHeight: 1.6,
                  }}>
                    如果对方觉得方案不合适，可以选择一个反馈，Agent 会自动重新规划。
                  </div>
                  <div className="feedback-grid">
                    {FEEDBACK_OPTIONS.map((fb) => (
                      <button key={fb.key} className="feedback-btn" onClick={() => handleFeedback(fb.key)}>
                        <span className="fb-icon">{fb.icon}</span>
                        {fb.label}
                      </button>
                    ))}
                  </div>
                  <div className="section-title" style={{ marginTop: '20px' }}>都不是？输入其他需求</div>
                  <textarea
                    className="user-input"
                    style={{ minHeight: '60px', marginBottom: '10px' }}
                    value={customFeedback}
                    onChange={(e) => setCustomFeedback(e.target.value)}
                    placeholder="例如：想更安静一点、不要排队太久、孩子想吃甜品"
                  />
                  <button
                    className="btn-secondary"
                    style={{ width: '100%' }}
                    disabled={!customFeedback.trim()}
                    onClick={() => handleCustomFeedback()}
                  >
                    发送并重新规划
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pre-execution Status Check Modal */}
      {showPreCheckModal && (
        <div className="modal-overlay" onClick={() => setShowPreCheckModal(false)}>
          <div className="modal precheck-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>执行前状态检查</h4>
              <button className="modal-close" onClick={() => setShowPreCheckModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="precheck-alert">
                <div className="precheck-alert-title">餐厅排队异常</div>
                <div className="precheck-alert-desc">
                  {preCheckCurrentRestaurant} 当前预计排队45分钟，超过30分钟阈值。
                </div>
              </div>

              <div className="precheck-recommend">
                <span className="precheck-recommend-label">Agent 建议</span>
                <strong>切换至 {preCheckSwitchRestaurant}</strong>
              </div>

              <div className="precheck-compare">
                <div className="precheck-plan-row">
                  <span className="precheck-plan-label">原方案</span>
                  <span className="precheck-plan-value">{preCheckCurrentRestaurant}｜排队45分钟｜预算¥{preCheckCurrentBudget}</span>
                </div>
                <div className="precheck-impact">
                  当前路线：{preCheckCurrentRoute}
                </div>
                <div className="precheck-plan-row recommended">
                  <span className="precheck-plan-label">建议方案</span>
                  <span className="precheck-plan-value">{preCheckSwitchRestaurant}｜排队20分钟｜预算¥{preCheckSwitchBudget}</span>
                </div>
                <div className="precheck-impact">
                  建议路线：{preCheckSwitchRoute}
                </div>
                <div className="precheck-impact">
                  影响：等待减少约25分钟{preCheckBudgetDelta === null ? '' : `，预算${preCheckBudgetDelta >= 0 ? '增加' : '减少'}约${Math.abs(preCheckBudgetDelta)}元`}
                </div>
              </div>

              <div className="precheck-actions">
                <button className="btn-accent" onClick={handlePreCheckSwitch}>
                  同意切换并继续安排
                </button>
                <button className="btn-secondary" onClick={handlePreCheckKeep}>
                  继续原方案
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>{executionDone ? '一键安排完成' : '一键安排中'}</h4>
              <button className="modal-close" onClick={() => setShowSuccessModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="success-list">
                {executionSteps.map((step, i) => (
                  <div key={i} className="success-item">
                    {step.status === 'done' ? (
                      <span className="success-check">✓</span>
                    ) : (
                      <span className="step-icon running" style={{ fontSize: '12px' }}>⟳</span>
                    )}
                    <span className="success-text">
                      {step.status === 'done' ? step.label : step.runningText}
                    </span>
                  </div>
                ))}
              </div>
              {executionDone && (
                <button
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '18px' }}
                  onClick={() => alert('路线方案已生成，可复制发送给好友。')}
                >
                  分享路线至好友
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
