export const defaultUserInput =
  "周六下午想带老婆和5岁孩子出去玩4-6小时，想去朝阳大悦城附近，晚饭想吃清淡点，希望帮我安排好去哪玩、去哪吃、路线和预约。";

export const intentResult = {
  scenario: "家庭亲子",
  time: "周六下午",
  duration: "4-6小时",
  companions: "2名成人 + 1名5岁儿童",
  preferences: ["朝阳大悦城附近", "轻松", "亲子友好", "清淡晚餐"],
  goals: ["活动规划", "餐厅安排", "路线规划", "预约执行"],
};

export const activityCandidates = [
  {
    name: "星河湾生态公园",
    type: "亲子活动",
    tags: ["赏花", "樱花", "露营", "户外"],
    duration: "2小时",
    distance: "3.8km",
    price: 0,
    reason: "免费开放，自然环境好，适合带孩子赏花露营，场地开阔安全。",
    openTime: "06:00-20:00",
    address: "黄杉木店路88号",
    detailUrl: "http://dpurl.cn/jR0nWSMz",
  },
  {
    name: "童年无限（朝阳大悦城店）",
    type: "室内游乐",
    tags: ["海洋球", "拼豆DIY", "彩绘娃娃", "室内游乐"],
    duration: "1.5小时",
    distance: "0km（同商圈）",
    price: 168,
    reason: "朝阳大悦城5层，室内游乐项目丰富，适合5岁儿童，不受天气影响。",
    openTime: "09:00-20:00",
    address: "朝阳北路101号朝阳大悦城5层",
  },
  {
    name: "朝阳公园",
    type: "轻户外",
    tags: ["免费", "自然", "放松", "大草坪"],
    duration: "1.5小时",
    distance: "4.5km",
    price: 5,
    reason: "老牌城市公园，场地大，但周末人多且步行量较大，不作为第一推荐。",
    detailUrl: "http://dpurl.cn/7HbyC7qz",
  },
];

export const restaurantCandidates = [
  {
    name: "无印良品食堂 MUJI Diner",
    type: "和风融合",
    avgPrice: 73,
    tags: ["有宝宝椅", "无烟餐厅", "低脂", "朝阳大悦城B1"],
    distance: "0km（同商圈）",
    queueTime: 10,
    reservationAvailable: true,
    availableTime: "11:00",
    seatType: "家庭座",
    recommendedDishes: "手作和牛饼井饭、和风意式肉酱扁面",
    openTime: "10:30-21:30",
    address: "朝阳区朝阳北路101号朝阳大悦城负一层",
    detailUrl: "https://m.dianping.com/shopinfo/FW9eDT91Uat8dFhr?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=224&cityid=2&isoversea=0",
  },
  {
    name: "MOKA BROS 摩卡站（Solana蓝色港湾店）",
    type: "西式轻食",
    avgPrice: 98,
    tags: ["清淡", "健康", "亲子友好", "蓝色港湾"],
    distance: "2.8km",
    queueTime: 20,
    reservationAvailable: true,
    availableTime: "17:30",
    seatType: "四人桌",
    detailUrl: "https://m.dianping.com/shopinfo/l6anZ2oWPupdNLmN?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=116&cityid=2&isoversea=0",
  },
  {
    name: "麻六记",
    type: "川菜",
    avgPrice: 85,
    tags: ["重口味", "不适合儿童", "排队较长"],
    distance: "1.2km",
    queueTime: 35,
    reservationAvailable: false,
    availableTime: null,
    seatType: null,
  },
];

export const basePlan = {
  title: "朝阳亲子轻松半日计划",
  tags: ["亲子友好", "朝阳大悦城", "清淡晚餐", "少排队", "可预约"],
  timeline: [
    {
      time: "14:00",
      title: "从家出发",
      desc: "建议打车前往星河湾生态公园，约15分钟车程。",
      image: "/images/home-start.jpg",
    },
    {
      time: "14:15 - 16:15",
      title: "星河湾生态公园",
      desc: "免费开放，带孩子赏花露营，场地开阔安全，营业至20:00。",
      image: "/images/park-flowers.jpg",
      detailUrl: "http://dpurl.cn/jR0nWSMz",
    },
    {
      time: "16:30 - 18:00",
      title: "童年无限（朝阳大悦城店）",
      desc: "朝阳大悦城5层，海洋球、拼豆DIY、彩绘娃娃，室内游乐适合5岁儿童。",
      image: "/images/kids-playground.jpg",
    },
    {
      time: "18:15 - 19:30",
      title: "无印良品食堂 MUJI Diner",
      desc: "朝阳大悦城B1，推荐手作和牛饼井饭、和风意式肉酱扁面，有宝宝椅，无烟餐厅。",
      image: "/images/restaurant-food.jpg",
      detailUrl: "https://m.dianping.com/shopinfo/FW9eDT91Uat8dFhr?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=224&cityid=2&isoversea=0",
    },
    {
      time: "19:45",
      title: "返程",
      desc: "整体节奏轻松，朝阳大悦城附近打车便利。",
      image: "/images/home-start.jpg",
    },
  ],
  budget: {
    activity: 168,
    restaurant: 220,
    transport: 30,
    total: 418,
  },
  route: {
    nodes: ["家", "星河湾生态公园", "童年无限（朝阳大悦城店）", "无印良品食堂 MUJI Diner", "家"],
    totalDistance: "8.2km",
    walkingDistance: "600m",
    transportMode: "打车/自驾",
    estimatedReturnTime: "19:45",
  },
  reason: [
    "星河湾生态公园免费开放，自然环境好，适合带孩子赏花露营。",
    "童年无限室内游乐项目丰富，适合5岁儿童，不受天气影响。",
    "星河湾到朝阳大悦城车程约10分钟，路线少折返。",
    "MUJI Diner口味清淡，人均73元，有宝宝椅和无烟环境。",
    "全程活动和用餐都在朝阳大悦城附近，步行距离极短。",
  ],
  execution: {
    ticketTarget: "童年无限（朝阳大悦城店）",
    restaurantTarget: "无印良品食堂 MUJI Diner",
    restaurantTime: "18:15",
    reminderTime: "13:40",
  },
};

export const feedbackPlans = {
  indoorPlay: {
    feedbackText: "孩子更想玩室内项目",
    agentText: [
      "已收到反馈：孩子更想玩室内项目。",
      "Agent 重新规划：保留星河湾生态公园作为短暂停留点，延长童年无限（朝阳大悦城店）的游玩时间。",
      "调整原因：室内儿童乐园更适合孩子消耗精力，也能减少天气和体力影响。",
    ],
    updates: [
      "星河湾生态公园改为短暂停留",
      "童年无限（朝阳大悦城店）游玩时间延长",
      "晚餐继续保留无印良品食堂 MUJI Diner",
    ],
    plan: {
      title: "增强室内游乐朝阳亲子计划",
      tags: ["室内项目优先", "亲子友好", "朝阳大悦城", "清淡晚餐"],
      timeline: [
        { time: "14:00", title: "从家出发", desc: "先前往星河湾生态公园短暂户外活动。", image: "/images/home-start.jpg" },
        { time: "14:15 - 15:15", title: "星河湾生态公园", desc: "短暂赏花散步，降低户外停留比重。", image: "/images/park-flowers.jpg", detailUrl: "http://dpurl.cn/jR0nWSMz" },
        { time: "15:30 - 17:30", title: "童年无限（朝阳大悦城店）", desc: "延长室内游乐时间，海洋球、拼豆DIY、彩绘娃娃，让孩子充分玩乐。", image: "/images/kids-playground.jpg" },
        { time: "18:00 - 19:15", title: "无印良品食堂 MUJI Diner", desc: "同商圈清淡晚餐，有宝宝椅、无烟环境，适合亲子用餐。", image: "/images/restaurant-food.jpg", detailUrl: "https://m.dianping.com/shopinfo/FW9eDT91Uat8dFhr?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=224&cityid=2&isoversea=0" },
        { time: "19:30", title: "返程到家", desc: "活动更充分，整体节奏仍然轻松。", image: "/images/home-start.jpg" },
      ],
      budget: { activity: 168, restaurant: 220, transport: 30, total: 418 },
      route: {
        nodes: ["家", "星河湾生态公园", "童年无限（朝阳大悦城店）", "无印良品食堂 MUJI Diner", "家"],
        totalDistance: "8.2km",
        walkingDistance: "600m",
        transportMode: "打车/自驾",
        estimatedReturnTime: "19:30",
      },
      execution: {
        ticketTarget: "童年无限（朝阳大悦城店）",
        restaurantTarget: "无印良品食堂 MUJI Diner",
        restaurantTime: "18:00",
        reminderTime: "13:40",
      },
    },
  },

  compactRoute: {
    feedbackText: "不想走太远，路线再集中一点",
    agentText: [
      "收到反馈：希望路线更集中。",
      "保留朝阳大悦城周边路线，不切换到蓝色港湾",
      "避免跨商圈移动，减少路程和体力消耗",
      "餐厅继续使用无印良品食堂 MUJI Diner，同商圈零移动",
    ],
    updates: [
      "移除蓝色港湾备选，不做跨商圈切换",
      "童年无限（朝阳大悦城店）作为核心室内节点",
      "朝阳大悦城内浏览作为休息过渡",
      "步行距离压缩至约300m",
    ],
    plan: {
      title: "朝阳大悦城集中亲子计划",
      tags: ["路线集中", "朝阳大悦城", "少步行", "清淡晚餐"],
      timeline: [
        { time: "14:00", title: "从家出发", desc: "直接前往朝阳大悦城，减少路上消耗。", image: "/images/home-start.jpg" },
        { time: "14:20 - 16:50", title: "童年无限（朝阳大悦城店）", desc: "室内亲子游乐作为主活动，海洋球和DIY项目适合5岁儿童。", image: "/images/kids-playground.jpg" },
        { time: "16:50 - 17:30", title: "朝阳大悦城内浏览", desc: "同商圈休息过渡，避免跨商圈移动。", image: "/images/joycity-mall.jpg" },
        { time: "17:30 - 19:00", title: "无印良品食堂 MUJI Diner", desc: "朝阳大悦城B1，清淡晚餐，有宝宝椅、无烟环境。", image: "/images/restaurant-food.jpg", detailUrl: "https://m.dianping.com/shopinfo/FW9eDT91Uat8dFhr?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=224&cityid=2&isoversea=0" },
        { time: "19:15", title: "返程到家", desc: "全程集中在朝阳大悦城，体力消耗更低。", image: "/images/home-start.jpg" },
      ],
      budget: { activity: 168, restaurant: 220, transport: 20, total: 408 },
      route: {
        nodes: ["家", "童年无限（朝阳大悦城店）", "无印良品食堂 MUJI Diner", "家"],
        totalDistance: "3.5km",
        walkingDistance: "300m",
        transportMode: "打车/自驾",
        estimatedReturnTime: "19:15",
      },
      execution: {
        ticketTarget: "童年无限（朝阳大悦城店）",
        restaurantTarget: "无印良品食堂 MUJI Diner",
        restaurantTime: "17:30",
        reminderTime: "13:40",
      },
    },
  },

  lighterRestaurant: {
    feedbackText: "餐厅再清淡一点",
    agentTextWhenMuji: [
      "已收到反馈：希望晚餐再清淡一点。",
      "Agent 判断：当前餐厅已符合清淡、低脂、无烟、有宝宝椅的亲子晚餐需求。",
      "调整结果：不更换餐厅，继续保留 MUJI Diner，并优先推荐更清淡的菜品。",
      "原因：换餐厅会增加移动成本，而当前餐厅已经满足清淡和亲子友好要求。",
    ],
    agentTextWhenOther: [
      "已收到反馈：希望晚餐再清淡一点。",
      "Agent 判断：当前餐厅虽然健康，但距离、预算和亲子适配不如 MUJI Diner。",
      "调整结果：切换至无印良品食堂 MUJI Diner。",
      "原因：MUJI Diner 位于朝阳大悦城内，路线更集中，同时具备低脂、无烟、有宝宝椅等标签。",
    ],
    updates: [
      "晚餐安排为无印良品食堂 MUJI Diner",
      "优先推荐低脂、清淡、适合儿童的菜品",
      "继续保持朝阳大悦城内用餐，减少额外移动",
    ],
    plan: {
      title: "清淡晚餐朝阳亲子计划",
      tags: ["清淡晚餐", "低脂", "无烟餐厅", "亲子友好"],
      timeline: [
        { time: "14:00", title: "从家出发", desc: "建议打车前往星河湾生态公园，约15分钟车程。", image: "/images/home-start.jpg" },
        { time: "14:15 - 16:15", title: "星河湾生态公园", desc: "免费开放，带孩子赏花露营，场地开阔安全。", image: "/images/park-flowers.jpg", detailUrl: "http://dpurl.cn/jR0nWSMz" },
        { time: "16:30 - 18:00", title: "童年无限（朝阳大悦城店）", desc: "朝阳大悦城5层，室内游乐适合5岁儿童。", image: "/images/kids-playground.jpg" },
        { time: "18:15 - 19:30", title: "无印良品食堂 MUJI Diner", desc: "低脂、无烟、有宝宝椅，适合亲子清淡晚餐。", image: "/images/restaurant-food.jpg", detailUrl: "https://m.dianping.com/shopinfo/FW9eDT91Uat8dFhr?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=224&cityid=2&isoversea=0" },
        { time: "19:45", title: "返程到家", desc: "晚餐后从朝阳大悦城返程。", image: "/images/home-start.jpg" },
      ],
      budget: { activity: 168, restaurant: 220, transport: 30, total: 418 },
      route: {
        nodes: ["家", "星河湾生态公园", "童年无限（朝阳大悦城店）", "无印良品食堂 MUJI Diner", "家"],
        totalDistance: "8.2km",
        walkingDistance: "600m",
        transportMode: "打车/自驾",
        estimatedReturnTime: "19:45",
      },
      execution: {
        ticketTarget: "童年无限（朝阳大悦城店）",
        restaurantTarget: "无印良品食堂 MUJI Diner",
        restaurantTime: "18:15",
        reminderTime: "13:40",
      },
    },
  },

  chaoyangParkLine: {
    feedbackText: "想去朝阳公园和蓝色港湾",
    agentText: [
      "已收到反馈：更想去朝阳公园和蓝色港湾。",
      "Agent 重新规划：将路线从“朝阳大悦城周边轻松线”切换为“朝阳公园 + 蓝色港湾亲子线”。",
      "调整后路线：从家出发 → 朝阳公园 → 童话星球·儿童亲子密室 → MOKA BROS 摩卡站 → 返程到家。",
      "变化说明：这条路线户外体验更丰富，儿童活动更完整，但移动距离和预算会略有上升。",
    ],
    updates: [
      "路线切换为朝阳公园 + 蓝色港湾亲子线",
      "新增童话星球·儿童亲子密室（蓝色港湾店）",
      "晚餐安排为 MOKA BROS 摩卡站（Solana蓝色港湾店）",
      "移动距离和预算略有上升",
    ],
    plan: {
      title: "朝阳公园蓝色港湾亲子计划",
      tags: ["朝阳公园", "蓝色港湾", "亲子友好", "体验更完整"],
      timeline: [
        { time: "14:00", title: "从家出发", desc: "前往朝阳公园，先安排轻户外活动。", image: "/images/home-start.jpg" },
        { time: "14:20 - 15:40", title: "朝阳公园", desc: "大草坪和湖区适合亲子散步，体验更完整。", image: "/images/chaoyang-park.jpg", detailUrl: "http://dpurl.cn/7HbyC7qz" },
        { time: "16:00 - 17:30", title: "童话星球·儿童亲子密室（蓝色港湾店）", desc: "蓝色港湾亲子室内项目，适合孩子继续玩。", image: "/images/fairy-planet.jpg" },
        { time: "18:00 - 19:15", title: "MOKA BROS 摩卡站（Solana蓝色港湾店）", desc: "健康轻食，适合亲子清淡晚餐。", image: "/images/moka-bros.jpg", detailUrl: "https://m.dianping.com/shopinfo/l6anZ2oWPupdNLmN?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=116&cityid=2&isoversea=0" },
        { time: "19:35", title: "返程到家", desc: "从蓝色港湾返程，整体体验更完整。", image: "/images/home-start.jpg" },
      ],
      budget: { activity: 218, restaurant: 295, transport: 45, total: 558 },
      route: {
        nodes: ["家", "朝阳公园", "童话星球·儿童亲子密室（蓝色港湾店）", "MOKA BROS 摩卡站（Solana蓝色港湾店）", "家"],
        totalDistance: "10.6km",
        walkingDistance: "950m",
        transportMode: "打车/自驾",
        estimatedReturnTime: "19:35",
      },
      execution: {
        ticketTarget: "童话星球·儿童亲子密室（蓝色港湾店）",
        restaurantTarget: "MOKA BROS 摩卡站（Solana蓝色港湾店）",
        restaurantTime: "18:00",
        reminderTime: "13:40",
      },
    },
  },
};
