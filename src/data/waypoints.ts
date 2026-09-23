import { DriftWaypoint } from '../types';

export const DRIFT_WAYPOINTS: DriftWaypoint[] = [
  {
    id: 'still_floe',
    name: 'The Still Floe',
    name_zh: '孤寂浮冰',
    requiredMiles: 0,
    subtitle: 'Where your journey began',
    subtitle_zh: '一切故事开始的极简安歇地',
    description:
      'A solitary iceberg drifting under the dancing polar sky. Here you crafted your first warm camp and began diving for deep ocean shells.',
    description_zh:
      '漂流在极光下的孤独冰块。在这里你搭建起最初的营地，开始潜入冰海打捞第一枚神秘贝壳。',
    story:
      'The little Ice Otter discovered this pristine ice block. With steaming hot cocoa, fairy lights, and cozy blankets, warmth gradually returned to the silent polar sea.',
    story_zh:
      '小小水獭发现了这块纯净的浮冰。伴随着热可可的蒸气与羊绒毯，冰冷的大海第一次有了家的温度。',
    icon: '🧊',
    rewardText: 'Camp Setup & Clam Diving',
    rewardText_zh: '基础营地搭建与开贝打卡',
  },
  {
    id: 'echo_straits',
    name: 'The Echo Straits',
    name_zh: '回音海峡',
    requiredMiles: 100,
    subtitle: 'Where melodies meet wild spirits',
    subtitle_zh: '留声机旋律回荡的生灵海湾',
    description:
      'Narrow waterways flanked by singing ice arches. The brass gramophone melody resonates through the misty fjord, drawing friendly animal guests.',
    description_zh:
      '冰崖拱门环抱的回音水道。留声机播放的音符穿透浓雾，引来了冰洋深处好奇的野生动物。',
    story:
      'Smelling the steaming hot cocoa and hearing the gentle vinyl chimes, the rare Aurora Fox leapt onto the ice floe. It curled up contentedly on your cozy wool quilt.',
    story_zh:
      '闻着热可可的香气，听着黑胶留声机的轻快旋律，珍稀的极光雪狐跃上了浮冰，在羊绒毯旁舒舒服服地蜷缩打盹。',
    icon: '🦊',
    guestId: 'fox',
    rewardText: 'Guest: Aurora Fox visits your camp!',
    rewardText_zh: '神秘访客：极光雪狐登岛作客！',
  },
  {
    id: 'lighthouse',
    name: "Lighthouse at World's End",
    name_zh: '世界尽头的灯塔',
    requiredMiles: 300,
    subtitle: 'Ancient beacon of lost travelers',
    subtitle_zh: '守塔人留下的冰霜航标',
    description:
      'An imposing ancient stone lighthouse encrusted in frost. Its giant glass lens once guided generations of brave arctic explorers through the polar night.',
    description_zh:
      '耸立在冰原边缘的古老石砌灯塔。巨大的透镜曾指引过一代代穿越极夜与风暴的无畏探索者。',
    story:
      'Following the clues in the bottle letters, you found the lighthouse keeper’s sanctuary. Though the keeper has journeyed on, the roaring fireplace and mailbox remain warm.',
    story_zh:
      '顺着漂流瓶中的信笺线索，你找到了守塔人的庇护所。尽管守塔人已远行，但巨大的壁炉与沉甸甸的信箱依然散发着余温。',
    icon: '🗼',
    guestId: 'whale',
    rewardText: 'Lighthouse Beacon & Whale Songs',
    rewardText_zh: '点亮冰海灯塔，座头鲸伴航',
  },
  {
    id: 'aurora_oasis',
    name: 'The Aurora Oasis',
    name_zh: '极光终极绿洲',
    requiredMiles: 600,
    subtitle: 'Where the sky touches the sea',
    subtitle_zh: '星辰坠落的温暖乐土',
    description:
      'The fabled geothermal haven at the edge of the world. Here, endless meteor showers streak across the auroral crown, and flowers bloom in the snow.',
    description_zh:
      '极地传说中被地热眷顾的永恒绿洲。无数流星划过璀璨的极光冠冕，冰雪深处盛开着永不凋零的花朵。',
    story:
      'After hundreds of focused nautical miles, the floating ice sanctuary reached its permanent paradise. The Ice Otter and all companions celebrate under an infinite shower of wishing stars.',
    story_zh:
      '跨越漫长的自律航程，浮冰方舟终于抵达了它的终极乐园。小水獭与所有动物朋友在漫天流星下欢聚，这是对每一位坚持者的崇高礼赞。',
    icon: '🌌',
    rewardText: 'Grandmaster Polar Guardian Badge & Meteor Sky',
    rewardText_zh: '极地大宗师终极荣耀勋章与流星夜空',
  },
];
