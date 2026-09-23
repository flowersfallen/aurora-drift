import { Language } from '../types';

export interface Translations {
  header: {
    brandSubtitle: string;
    brandBadge: string;
    pearlsTitle: string;
    themeAurora: string;
    themeSunset: string;
    themeNight: string;
    themeCycle: string;
    mixer: string;
    album: string;
    albumTitle: string;
    info: string;
    share: string;
    fullscreen: string;
    langToggle: string;
  };
  timer: {
    presets: {
      1: { label: string; desc: string };
      5: { label: string; desc: string };
      25: { label: string; desc: string };
      45: { label: string; desc: string };
    };
    startDive: string;
    cancelDive: string;
    resetTimer: string;
    divingDepth: string;
    cancelConfirm: string;
  };
  otter: {
    dialogues: string[];
  };
  album: {
    title: string;
    unlockedCount: string;
    tabs: {
      all: { label: string; shortLabel: string };
      postcard: { label: string; shortLabel: string };
      relic: { label: string; shortLabel: string };
      letter: { label: string; shortLabel: string };
    };
    rarity: {
      common: string;
      rare: string;
      legendary: string;
    };
    generatePoster: string;
    copyQuote: string;
    copied: string;
    close: string;
    fromAuthor: string;
  };
  shop: {
    title: string;
    subtitle: string;
    pearlsLabel: string;
    pearlsUnit: string;
    placed: string;
    unlock: string;
    needPearls: string;
    items: {
      hasHotCocoa: { title: string; desc: string };
      hasFairyLights: { title: string; desc: string };
      hasCozyQuilt: { title: string; desc: string };
      hasGramophone: { title: string; desc: string };
    };
  };
  mixer: {
    title: string;
    subtitle: string;
    masterVolume: string;
    muted: string;
    soundActive: string;
    unmuteHint: string;
    channels: {
      wind: string;
      fire: string;
      waves: string;
      music: string;
    };
  };
  cracking: {
    title: string;
    subtitle: string;
    stage0: string;
    stage1: string;
    stage2: string;
    claim: string;
    unlockedBadge: string;
  };
  share: {
    tabTreasure: string;
    tabFocus: string;
    saveImage: string;
    copyImage: string;
    copiedToast: string;
    mobileHint: string;
    starBanner: string;
    posterTitle: string;
    posterSubtitle: string;
    statFocusTime: string;
    statShells: string;
    statTreasures: string;
    minsUnit: string;
    journalTitle: string;
    journalQuotes: string[];
    quoteCreed: string;
    streakLabel: string;
    streakUnit: string;
    streakUnitSingular: string;
    pearlsLabel: string;
    pearlsFound: string;
    campDecorLabel: string;
    decorUnlocked: string;
    scanPrompt: string;
    bottomLocation: string;
    postcardType: string;
    relicType: string;
    letterType: string;
    authorPrefix: string;
    cardExpedition: string;
  };
  about: {
    title: string;
    subtitle: string;
    p1: string;
    p2: string;
    p3: string;
    quote: string;
    generatePoster: string;
    backToCamp: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    header: {
      brandSubtitle: 'iceotter.com',
      brandBadge: 'Cozy Web',
      pearlsTitle: 'Your Ice Pearls - Click to open Camp Shop',
      themeAurora: 'Northern Lights Aurora',
      themeSunset: 'Polar Sunset',
      themeNight: 'Quiet Midnight',
      themeCycle: 'Theme: {theme} - Tap to cycle sky',
      mixer: 'Ambient Sound Mixer',
      album: 'Album',
      albumTitle: 'Open Polar Memory Album',
      info: 'About Ice Otter',
      share: 'Share & Generate Poster',
      fullscreen: 'Toggle Fullscreen',
      langToggle: 'Language Switcher',
    },
    timer: {
      presets: {
        1: { label: '1m Demo', desc: 'Quick demo' },
        5: { label: '5m Chill', desc: 'Short break' },
        25: { label: '25m Focus', desc: 'Classic Pomodoro' },
        45: { label: '45m Deep', desc: 'Deep flow' },
      },
      startDive: 'Start Ice Dive',
      cancelDive: 'Cancel Dive',
      resetTimer: 'Reset timer',
      divingDepth: 'Diving to {depth}m depth',
      cancelConfirm: 'Cancel current deep dive? The otter will return to the iceberg without a treasure.',
    },
    otter: {
      dialogues: [
        'A little otter in a cooler world ✨',
        'Slide on your belly whenever you find snow! ❄️',
        'Chill, swim, crack shells, repeat~ 🦦',
        'Look! I found the sparkliest ice cube 🧊',
        "Take a cozy deep breath... you're doing great ☕",
        'Always keep your favorite pebble close 🪨',
        'Small otter, big cozy dreams! 🏔️',
        'The polar aurora is dancing just for you 🌌',
      ],
    },
    album: {
      title: 'Polar Memory Album',
      unlockedCount: 'Unlocked {count} of {total} polar treasures ({percent}%)',
      tabs: {
        all: { label: 'All Items', shortLabel: 'All' },
        postcard: { label: 'Postcards', shortLabel: 'Postcards' },
        relic: { label: 'Ancient Relics', shortLabel: 'Relics' },
        letter: { label: 'Bottle Letters', shortLabel: 'Letters' },
      },
      rarity: {
        common: 'Common',
        rare: 'Rare',
        legendary: 'Legendary',
      },
      generatePoster: 'Generate Poster',
      copyQuote: 'Copy Quote',
      copied: 'Copied!',
      close: 'Close',
      fromAuthor: 'From {author}',
    },
    shop: {
      title: 'Iceberg Camp Decor',
      subtitle: 'Make your floating ice sanctuary warm & cozy',
      pearlsLabel: 'Your Ice Pearls:',
      pearlsUnit: 'Pearls',
      placed: 'Placed',
      unlock: 'Unlock',
      needPearls: 'Need {cost} 🦪',
      items: {
        hasHotCocoa: {
          title: 'Steaming Hot Cocoa',
          desc: 'Rich chocolate cocoa with marshmallows. Gently warms chilly paws.',
        },
        hasFairyLights: {
          title: 'Aurora Fairy Lights',
          desc: 'Soft pastel glow strung across the ice ledge, shimmering like twilight.',
        },
        hasCozyQuilt: {
          title: 'Arctic Fluffy Quilt',
          desc: 'Plump wool blanket for curling up and afternoon belly slides.',
        },
        hasGramophone: {
          title: 'Brass Gramophone',
          desc: 'Vintage horn player gently echoing nostalgic melodies across the sea.',
        },
      },
    },
    mixer: {
      title: 'Ambient Sound Mixer',
      subtitle: 'Craft your personal arctic focus sanctuary',
      masterVolume: 'Master Volume:',
      muted: 'Muted',
      soundActive: 'Sound Active',
      unmuteHint: 'Tap to unmute ambient audio',
      channels: {
        wind: 'Arctic Wind',
        fire: 'Campfire',
        waves: 'Ocean Waves',
        music: 'Aurora Melody',
      },
    },
    cracking: {
      title: 'Deep Sea Arctic Clam',
      subtitle: 'The Ice Otter surfaced with a mysterious shell! Strike with pebble to crack it open.',
      stage0: '👉 Tap shell or pebble to smash it open! (1/3)',
      stage1: '💥 CLACK! First crack opened! Strike again! (2/3)',
      stage2: '⚡ CRACK! One final heavy smash to open! (3/3)',
      claim: 'Claim Treasure & {pearls} Pearls',
      unlockedBadge: 'New Treasure Unlocked!',
    },
    share: {
      tabTreasure: 'Treasure Poster',
      tabFocus: 'Focus Milestone',
      saveImage: 'Save Image',
      copyImage: 'Copy Image',
      copiedToast: 'Poster copied to clipboard!',
      mobileHint: 'Tap or long-press image to save / share',
      starBanner: '★ ★ ★  DAILY FOCUS MILESTONE  ★ ★ ★',
      posterTitle: 'Polar Focus Milestone',
      posterSubtitle: '— Deep Work & Ambient Ocean Journey —',
      statFocusTime: 'Focus Time',
      statShells: 'Shells Cracked',
      statTreasures: 'Treasures',
      minsUnit: 'mins',
      journalTitle: '📜 ARCTIC OTTER JOURNAL & WISDOM',
      journalQuotes: [
        '“Slide on your belly whenever you find snow. Keep your favourite stone close.”',
        '“In this bustling world, give yourself a quiet ocean of peaceful stars.”',
        '“Take a deep breath and listen to the waves. Calm waters run deep.”',
      ],
      quoteCreed: '— The Arctic Otter Creed —',
      streakLabel: 'STREAK',
      streakUnit: 'DAYS',
      streakUnitSingular: 'DAY',
      pearlsLabel: 'PEARLS',
      pearlsFound: 'FOUND',
      campDecorLabel: 'CAMP DECOR',
      decorUnlocked: '{count} / 4 UNLOCKED',
      scanPrompt: 'SCAN TO VISIT ICEOTTER.COM',
      bottomLocation: '📍 POLAR DRIFT · DEEP DIVE FOCUS SANCTUARY',
      postcardType: '📬 Polar Postcard',
      relicType: '🧭 Ancient Relic',
      letterType: '📜 Bottle Letter',
      authorPrefix: 'From',
      cardExpedition: 'EXPEDITION',
    },
    about: {
      title: 'About Aurora Drift',
      subtitle: 'Crafted for iceotter.com',
      p1: '❄️ <strong>Cozy Ambient Focus:</strong> A peaceful haven designed for deep work, study, or simple relaxation.',
      p2: '🤿 <strong>The Arctic Dive:</strong> While you focus, your little Ice Otter explores the deep glacial waters and returns with mysterious shells.',
      p3: '✨ <strong>Tactile ASMR:</strong> Tap with your lucky pebble to crack shells and uncover 16 collectible polar postcards, ancient relics, and heartwarming bottle letters.',
      quote: '“Slide on your belly whenever you find snow. Keep your favourite stone close.”',
      generatePoster: 'Generate Share Poster',
      backToCamp: 'Back to Campsite',
    },
  },
  zh: {
    header: {
      brandSubtitle: 'iceotter.com',
      brandBadge: '极地治愈自习室',
      pearlsTitle: '你的冰晶珍珠 - 点击打开营地小铺',
      themeAurora: '极光漫天',
      themeSunset: '极地日落',
      themeNight: '静谧午夜',
      themeCycle: '天空主题: {theme} - 点击切换',
      mixer: '白噪音调音台',
      album: '相册',
      albumTitle: '打开极地记忆相册',
      info: '关于极光水獭',
      share: '生成分享海报',
      fullscreen: '切换全屏',
      langToggle: '中英文切换',
    },
    timer: {
      presets: {
        1: { label: '1m 体验', desc: '快速演示' },
        5: { label: '5m 小憩', desc: '短暂呼吸' },
        25: { label: '25m 番茄', desc: '经典番茄钟' },
        45: { label: '45m 沉浸', desc: '深度专注流' },
      },
      startDive: '开启极地潜水',
      cancelDive: '浮上海面',
      resetTimer: '重置计时器',
      divingDepth: '正在潜行至 {depth} 米深处',
      cancelConfirm: '确认中断本次深度潜水吗？小水獭将空手返回浮冰哦。',
    },
    otter: {
      dialogues: [
        '清凉世界里的一只小小水獭 ✨',
        '只要看到雪，就用肚皮尽情滑行吧！❄️',
        '发呆、游泳、敲贝壳，又是快乐的一天~ 🦦',
        '看！我找到了最亮晶晶的冰块 🧊',
        '深吸一口气... 你今天做得很棒哦 ☕',
        '记得把你最喜欢的那颗小石头带好 🪨',
        '小小的水獭，也有暖洋洋的大梦想！🏔️',
        '今晚的极光，正在为你跳舞呢 🌌',
      ],
    },
    album: {
      title: '极地记忆相册',
      unlockedCount: '已解锁 {count} / {total} 件极地珍宝 ({percent}%)',
      tabs: {
        all: { label: '全部珍宝', shortLabel: '全部' },
        postcard: { label: '极地明信片', shortLabel: '明信片' },
        relic: { label: '古老遗物', shortLabel: '遗物' },
        letter: { label: '漂流信瓶', shortLabel: '信瓶' },
      },
      rarity: {
        common: '普通',
        rare: '稀有',
        legendary: '传说',
      },
      generatePoster: '生成海报',
      copyQuote: '复制文案',
      copied: '已复制到剪贴板！',
      close: '关闭',
      fromAuthor: '来自 {author}',
    },
    shop: {
      title: '营地装扮小铺',
      subtitle: '让你的浮冰庇护所更加温馨治愈',
      pearlsLabel: '持有冰晶珍珠:',
      pearlsUnit: '珍珠',
      placed: '已放置',
      unlock: '兑换道具',
      needPearls: '还需 {cost} 🦪',
      items: {
        hasHotCocoa: {
          title: '暖心热可可',
          desc: '香浓棉花糖热可可，冒着丝丝热气，悄悄温暖冰凉的小爪子。',
        },
        hasFairyLights: {
          title: '极光小彩灯',
          desc: '缠绕在冰崖边缘的柔光灯串，如暮色星辰般轻盈闪烁。',
        },
        hasCozyQuilt: {
          title: '北极蓬松羊绒毯',
          desc: '厚实软糯的雪地羊绒毯，小水獭最喜欢缩在里面睡懒觉。',
        },
        hasGramophone: {
          title: '黄铜古典留声机',
          desc: '优雅复古的黄铜大喇叭，向冰海缓缓流淌着怀旧旋律。',
        },
      },
    },
    mixer: {
      title: '极地白噪音调音台',
      subtitle: '调制专属于你的极地专注空间',
      masterVolume: '总音量:',
      muted: '已静音',
      soundActive: '声音播放中',
      unmuteHint: '点击开启环境声音',
      channels: {
        wind: '极地寒风',
        fire: '暖融篝火',
        waves: '冰海波涛',
        music: '极光轻音乐',
      },
    },
    cracking: {
      title: '深海北极神秘贝壳',
      subtitle: '小水獭浮上海面，带来了神秘贝壳！用小石子敲击开启吧。',
      stage0: '👉 敲击贝壳或幸运石，准备开贝！(1/3)',
      stage1: '💥 咔哒！出现第一道裂缝了！继续敲！(2/3)',
      stage2: '⚡ 咔嚓！最后一击，即将开出惊喜！(3/3)',
      claim: '收入相册，获得 {pearls} 颗冰晶珍珠',
      unlockedBadge: '发现新珍宝！',
    },
    share: {
      tabTreasure: '珍宝海报',
      tabFocus: '专注成就',
      saveImage: '保存图片',
      copyImage: '复制图片',
      copiedToast: '海报已复制到剪贴板！',
      mobileHint: '点击或长按图片可直接保存与分享',
      starBanner: '★ ★ ★  极 地 专 注 成 就  ★ ★ ★',
      posterTitle: '极地专注里程碑',
      posterSubtitle: '— 冰洋深处的心流与治愈之旅 —',
      statFocusTime: '专注时长',
      statShells: '敲开贝壳',
      statTreasures: '收集珍宝',
      minsUnit: '分钟',
      journalTitle: '📜 极光水獭的温暖日记与信条',
      journalQuotes: [
        '“只要看见雪，就用肚皮滑行吧；记得把你最喜欢的那颗小石头，贴身带好。”',
        '“在忙碌纷扰的世界里，记得为自己留下一片星光浩瀚的安静海洋。”',
        '“深吸一口气，听听冰海的潮汐。静水深流，每一步都不算迟。”',
      ],
      quoteCreed: '— 极地海獭信条 —',
      streakLabel: '连续自习',
      streakUnit: '天',
      streakUnitSingular: '天',
      pearlsLabel: '冰晶珍珠',
      pearlsFound: '颗已收集',
      campDecorLabel: '营地装扮',
      decorUnlocked: '已拥有 {count} / 4',
      scanPrompt: '扫码开启你的极地自习室',
      bottomLocation: '📍 极地漂流 · 深度沉浸陪伴空间',
      postcardType: '📬 极地明信片',
      relicType: '🧭 古老遗物',
      letterType: '📜 漂流信瓶',
      authorPrefix: '来自',
      cardExpedition: '极地远征',
    },
    about: {
      title: '关于极光漂流 (Aurora Drift)',
      subtitle: '专为 iceotter.com 打造',
      p1: '❄️ <strong>极地治愈陪伴：</strong>专为深度工作、自习备考与静心放松打造的极简数字庇护所。',
      p2: '🤿 <strong>极地潜水探索：</strong>在你专注的同时，可爱的小水獭会潜入冰洋深处，为你寻回神秘的极地贝壳。',
      p3: '✨ <strong>治愈 ASMR 敲敲乐：</strong>用幸运石敲开贝壳，收集 16 件充满故事的极地明信片、古老遗物与温暖漂流信。',
      quote: '“只要看见雪，就用肚皮尽情滑行吧。随时带好你最喜欢的那颗小石头。”',
      generatePoster: '生成分享海报',
      backToCamp: '返回营地',
    },
  },
};
