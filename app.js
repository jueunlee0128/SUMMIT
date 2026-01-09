// ===== 프로젝트 카드 동적 추가 함수 =====
function addProjectCard({ name, year, desc, images }) {
  const grid = document.querySelector('.project-grid');
  const template = document.getElementById('project-card-template');
  if (!grid || !template) return;
  const node = template.content.cloneNode(true);
  node.querySelector('.project-name').textContent = name;
  node.querySelector('.project-meta').textContent = year;
  node.querySelector('.project-desc').textContent = desc;
  // 이미지 배열이 있으면 첫 번째 이미지만 표시
  if (images && images.length > 0) {
    const photoDiv = node.querySelector('.project-photo');
    if (photoDiv) {
      const img = document.createElement('img');
      img.src = images[0];
      img.alt = name;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      photoDiv.appendChild(img);
    }
  }
  grid.appendChild(node);
}

// 예시: DOMContentLoaded 시 9개 카드 추가
document.addEventListener('DOMContentLoaded', () => {
  const exampleProjects = [
    { name: 'SUMMIT1', year: '2025년', desc: '2025년 프로젝트 설명입니다.', images: ['images/Jueun.png', 'images/Imda.png'] },
    { name: 'SUMMIT2', year: '2025년', desc: '2025년 프로젝트 설명입니다.', images: ['images/project2.jpg'] },
    { name: 'SUMMIT3', year: '2025년', desc: '2025년 프로젝트 설명입니다.', images: ['images/project3.jpg', 'images/project3-2.jpg', 'images/project3-3.jpg'] },
    { name: 'SUMMIT4', year: '2025년', desc: '2025년 프로젝트 설명입니다.', images: ['images/project4.jpg'] },
    { name: 'SUMMIT5', year: '2025년', desc: '2025년 프로젝트 설명입니다.', images: ['images/project5.jpg', 'images/project5-2.jpg'] },
    { name: 'SUMMIT6', year: '2025년', desc: '2025년 프로젝트 설명입니다.', images: ['images/project6.jpg'] },
  ];

  // 칩 필터 생성
  const years = ['전체', '2026년', '2025년'];
  const chipTemplate = document.getElementById('project-chip-template');
  const chipContainer = document.querySelector('.project-filters');
  let selectedYear = '전체';
  function renderChips() {
    chipContainer.innerHTML = '';
    years.forEach(year => {
      const chipNode = chipTemplate.content.cloneNode(true);
      const chipBtn = chipNode.querySelector('.project-chip');
      chipBtn.textContent = year;
      chipBtn.classList.toggle('active', year === selectedYear);
      chipBtn.addEventListener('click', () => {
        if (selectedYear === year) return; // Prevent re-render if same chip
        selectedYear = year;
        renderChips();
        renderProjectCards();
      });
      chipContainer.appendChild(chipBtn);
    });
  }

  function renderProjectCards() {
    const grid = document.querySelector('.project-grid');
    // Fade out existing cards
    const cards = Array.from(grid.children);
    const filtered = exampleProjects.filter(p => selectedYear === '전체' ? true : p.year === selectedYear);
    if (cards.length > 0) {
      cards.forEach(card => card.classList.add('fade-out'));
      setTimeout(() => {
        grid.innerHTML = '';
        if (filtered.length === 0 && selectedYear !== '전체') {
          const msg = document.createElement('div');
          msg.className = 'project-empty-message';
          msg.textContent = `${selectedYear}의 SUMMIT을 기대해주세요!`;
          grid.appendChild(msg);
        } else {
          filtered.forEach(data => {
            addProjectCard(data);
            const newCard = grid.lastElementChild;
            if (newCard) {
              newCard.style.opacity = '0';
              void newCard.offsetWidth;
              newCard.classList.add('fade-in');
              setTimeout(() => {
                newCard.classList.remove('fade-in');
                newCard.style.opacity = '';
              }, 100);
            }
          });
        }
        updateProjectScrollPadding();
      }, 120);
    } else {
      grid.innerHTML = '';
      if (filtered.length === 0 && selectedYear !== '전체') {
        const msg = document.createElement('div');
        msg.className = 'project-empty-message';
        msg.textContent = `${selectedYear}의 SUMMIT을 기대해주세요!`;
        grid.appendChild(msg);
      } else {
        filtered.forEach(data => {
          addProjectCard(data);
          const newCard = grid.lastElementChild;
          if (newCard) {
            newCard.style.opacity = '0';
            void newCard.offsetWidth;
            newCard.classList.add('fade-in');
            setTimeout(() => {
              newCard.classList.remove('fade-in');
              newCard.style.opacity = '';
            }, 380);
          }
        });
      }
      updateProjectScrollPadding();
    }
  } 

  // 초기 렌더링
  renderChips();
  renderProjectCards();
});
// ===== 입력 칸 포커스 시 snake-border 확장 애니메이션 =====
function setupSnakeBorderInputFocus() {
  const inputs = document.querySelectorAll('.result-input');
  const snakeBorders = document.querySelectorAll('.snake-border');
  if (!inputs.length || !snakeBorders.length) return;
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      snakeBorders.forEach(sb => sb.classList.add('active'));
    });
    input.addEventListener('blur', () => {
      snakeBorders.forEach(sb => sb.classList.remove('active'));
    });
  });
}

// DOMContentLoaded 이후에 실행
document.addEventListener('DOMContentLoaded', () => {
  setupSnakeBorderInputFocus();
  // 홈 섹션 아래로 스크롤 유도 화살표 표시
  const homeSection = document.getElementById('home-section');
  const scrollArrow = document.getElementById('scrollDownArrow');
  if (homeSection && scrollArrow) {
    // 홈 섹션이 보일 때만 화살표 표시
    const showArrow = () => {
      if (homeSection.style.display !== 'none' && homeSection.classList.contains('active-home')) {
        scrollArrow.style.display = 'block';
      } else {
        scrollArrow.style.display = 'none';
      }
    };
    // 탭 전환 등에서 호출될 수 있도록 이벤트 바인딩
    const observer = new MutationObserver(showArrow);
    observer.observe(homeSection, { attributes: true, attributeFilter: ['class', 'style'] });
    showArrow();
    // 스크롤이 일정 이상 내려가면 화살표 숨김
    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) {
        scrollArrow.style.opacity = 0;
      } else {
        scrollArrow.style.opacity = 0.85;
      }
    });
  }
});
// ===== 동아리 신청/합격자 확인 기간 설정 =====
const isRecruitmentPeriod = false;   // true: 모집 신청 기간
const isResultCheckPeriod = true;  // true: 합격자 확인 기간


// ===== 합격/불합격자 데이터 저장 =====
// 아래 배열에 합격자와 불합격자의 학번(id), 이름(name), 전화번호(phone)을 각각 추가하세요.
// 예: { id: '2026-001', name: '홍길동', phone: '01012345678' }
const ACCEPTED_STUDENTS = [
  // { id: '2026-001', name: '홍길동', phone: '01012345678' },
  { id: '1419', name: '이주은', phone: '01011112222'},
];
const FAILED_STUDENTS = [
  { id: '2417', name: '이주은', phone: '01033334444'},
];

// ===== 홈 스크롤 페이드 설정 =====
const HOME_SCROLL_START = 80;   // px: 이 높이부터 효과 시작
const HOME_SCROLL_END = 320;    // px: 이 높이에 도달하면 완전 페이드아웃
// 홈 섹션 스크롤 페이드 효과의 활성 상태를 추적하는 플래그입니다.
// true일 때만 스크롤 리스너를 유지하며, 중복 등록을 방지합니다.
// 다른 탭으로 전환되면 false로 바꿔 리스너를 제거하고 스타일을 초기화합니다.
let homeScrollEnabled = false;
// 홈 스크롤 핸들러 바인딩 소스/참조 (Lenis vs window)
let __homeScrollSource = null;
let __homeScrollHandler = null;

// Lenis 싱글톤 참조 (중복 초기화 방지)
let __lenisInstance = null;
let __lenisTickerBound = false;

// 최근 스크롤 위치(홈 페이드 방향 판단용)
let __prevScrollY = 0;

// 탭별 스크롤 상태 저장/복원 (탭 독립 스크롤)
let __currentTab = 'home';
const __tabScrollY = { home: 0, project: 0, member: 0, qna: 0 };

function __getScrollY() {
  return window.scrollY || window.pageYOffset || 0;
}

function saveCurrentTabScroll() {
  if (!__currentTab) return;
  __tabScrollY[__currentTab] = __getScrollY();
}

function restoreTabScroll(tab) {
  // 항상 스크롤을 0으로 이동
  if (__lenisInstance && typeof __lenisInstance.scrollTo === 'function') {
    __lenisInstance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

function applyHomeScrollEffects() {
  const homeActive = document.getElementById('home-section').classList.contains('active-home');
  if (!homeActive) return;

  const y = window.scrollY || window.pageYOffset || 0;
  const was = __prevScrollY;
  const goingDown = y >= was;
  const range = HOME_SCROLL_END - HOME_SCROLL_START;
  const t = Math.min(Math.max((y - HOME_SCROLL_START) / range, 0), 1);
  const translateY = -t * 50; // 최대 50px 위로 이동
  const opacity = 1 - t;      // 서서히 0으로 감소

  const logo = document.querySelector('.center-logo');
  const subtitle = document.querySelector('.subtitle');
  const recruitButtons = document.getElementById('recruitButtons');
  if (logo) {
    logo.style.transform = `translateY(${translateY}px)`;
    logo.style.opacity = opacity;
  }
  if (subtitle) {
    subtitle.style.transform = `translateY(${translateY}px)`;
    subtitle.style.opacity = opacity;
  }
  // 버튼 컨테이너가 보일 때는 동일한 스크롤 페이드 적용 (조금 지연/가속)
  if (recruitButtons && recruitButtons.style.display !== 'none') {
    const delayPx = 20; // 내려갈 때(올라갈 때) 약간 늦게 시작
    if (goingDown) {
      // 스크롤 다운: 중앙 로고보다 살짝 늦게 올라가도록 오프셋 적용
      const tb = Math.min(Math.max((y - HOME_SCROLL_START - delayPx) / range, 0), 1);
      const btnTranslate = -tb * 50;
      const btnOpacity = 1 - tb;
      recruitButtons.style.transform = `translateY(${btnTranslate}px)`;
      recruitButtons.style.opacity = btnOpacity;
    } else {
      // 스크롤 업: 중앙 로고보다 살짝 빠르게 내려오도록 약간 더 빠른 복귀
      const tb = Math.min(Math.max((y - HOME_SCROLL_START) / range, 0), 1);
      const btnTranslate = -(tb * 50 * 0.9); // 약간 더 작은 이동량 → 더 빨리 원위치
      const btnOpacity = 1 - (tb * 0.9);     // 더 빨리 원래 불투명도로 복귀
      recruitButtons.style.transform = `translateY(${btnTranslate}px)`;
      recruitButtons.style.opacity = btnOpacity;
    }
  }

  __prevScrollY = y;
}

function resetHomeScrollEffects() {
  const logo = document.querySelector('.center-logo');
  const subtitle = document.querySelector('.subtitle');
  const recruitButtons = document.getElementById('recruitButtons');
  if (logo) {
    logo.style.transform = '';
    logo.style.opacity = '';
  }
  if (subtitle) {
    subtitle.style.transform = '';
    subtitle.style.opacity = '';
  }
  if (recruitButtons) {
    recruitButtons.style.transform = '';
    recruitButtons.style.opacity = '';
  }
}

function enableHomeScroll() {
  // 홈 탭 스크롤 애니메이션 활성화
  if (homeScrollEnabled) return;
  homeScrollEnabled = true;
  // Lenis가 활성화되어 있으면 Lenis의 스크롤 이벤트에 바인딩
  if (__lenisInstance && typeof __lenisInstance.on === 'function') {
    __homeScrollSource = 'lenis';
    __homeScrollHandler = applyHomeScrollEffects;
    __lenisInstance.on('scroll', __homeScrollHandler);
  } else {
    __homeScrollSource = 'window';
    __homeScrollHandler = applyHomeScrollEffects;
    window.addEventListener('scroll', __homeScrollHandler);
  }
  // 초기 상태 적용
  applyHomeScrollEffects();
}

function disableHomeScroll() {
  if (!homeScrollEnabled) return;
  homeScrollEnabled = false;
  // 바인딩 해제
  if (__homeScrollSource === 'window' && __homeScrollHandler) {
    window.removeEventListener('scroll', __homeScrollHandler);
  }
  if (__homeScrollSource === 'lenis' && __homeScrollHandler && __lenisInstance) {
    // Lenis는 off를 제공하는 버전도 있으므로 가능하면 사용
    if (typeof __lenisInstance.off === 'function') {
      __lenisInstance.off('scroll', __homeScrollHandler);
    }
  }
  __homeScrollSource = null;
  __homeScrollHandler = null;
  resetHomeScrollEffects();
}

// 홈 섹션 로고/서브타이틀 초기 등장 애니메이션
function initHomeIntroAnimation() {
  if (typeof gsap === 'undefined') return;
  const home = document.getElementById('home-section');
  if (!home || !home.classList.contains('active-home')) return;

  const logo = home.querySelector('.center-logo');
  const subtitle = home.querySelector('.subtitle');
  const buttons = document.getElementById('recruitButtons');
  const topLeftLogo = document.querySelector('.top-left-logo');
  const topRightNav = document.querySelector('.top-right-nav');
  if (!logo && !subtitle) return;

  // 중앙 요소: 아래에서 위로, 상단 요소: 위에서 아래로
  gsap.set([logo, subtitle, buttons].filter(Boolean), { opacity: 0, y: 20 });
  if (topLeftLogo) gsap.set(topLeftLogo, { opacity: 0, y: -20 });
  if (topRightNav) gsap.set(topRightNav, { opacity: 0, y: -20 });

  const tl = gsap.timeline();
  // 모든 요소를 동시에 등장시키기
  const targets = [topLeftLogo, topRightNav, logo, subtitle, buttons].filter(Boolean);
  tl.to(targets, {
    opacity: 1,
    y: 0,
    duration: 0.3,
    ease: 'power2.out'
  }, 0);
}

// ===== Lenis Smooth Scrolling =====
function initSmoothScrolling() {
  // 이미 초기화된 경우 재초기화하지 않음
  if (__lenisInstance) {
    return __lenisInstance;
  }

  const lenis = new Lenis({
    lerp: 0.05, // 더 강한 속도 제한
    duration: 1, // 반응 완
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.35, // 마우스 휠 입력 민감도 더 감소
    wheelMultiplier: 0.5,
    smoothTouch: false,
    touchMultiplier: 0.8, // 터치 입력 민감도 더 감소
    infinite: false,
  });

  __lenisInstance = lenis;
  window.__lenisInstance = lenis;

  // GSAP ScrollTrigger와 Lenis를 동기화
  lenis.on('scroll', ScrollTrigger.update);

  if (!__lenisTickerBound) {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    __lenisTickerBound = true;
  }

  gsap.ticker.lagSmoothing(0);
}

// ===== GSAP: Pin sections when they hit the top =====
function initSectionPins() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.getAll().forEach(t => t.kill());

  // 홈 탭이 활성화되지 않았다면 섹션 핀을 설정하지 않음 (다른 탭에서 겹침 방지)
  const home = document.getElementById('home-section');
  if (!home || !home.classList.contains('active-home')) {
    return;
  }

  // 디바이스별 과도한 모멘텀(트랙패드/터치) 완화
  if (ScrollTrigger.normalizeScroll) {
    ScrollTrigger.normalizeScroll(true);
  }

  const ids = ['home-section', 'intro-section', 'values-section', 'inform-section', 'mascot-section'];
  const sections = ids.map(id => document.getElementById(id)).filter(el => el);

  // 섹션 간 간격을 유지하여 전환이 급하지 않도록 함 (gap은 그대로 유지)

  // 초기 상태 설정: 1번째 섹션은 보이도록, 나머지는 투명 상태로 대기
  if (sections[0]) gsap.set(sections[0], { opacity: 1 });
  sections.slice(1).forEach(s => gsap.set(s, { opacity: 0 }));

  sections.forEach((sec, i) => {
    // 모든 섹션(1~5)에 pin 적용
    const isInform = sec.id === 'inform-section';
    const pinTrigger = ScrollTrigger.create({
      id: isInform ? 'inform-pin' : undefined,
      trigger: sec,
      start: 'top top',
      end: isInform ? '+=70%' : 'bottom top', // inform 섹션만 pin 길이를 조금 줄임
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // snapping은 페이드 구간을 단축시켜 갑작스런 사라짐을 유발할 수 있어 제거
    });

    // 다음 섹션 참조 (없으면 마지막 섹션)
    const next = sections[i + 1];

    // 1~4번째 섹션: pin 해제 직후 위로 올라가며 페이드 아웃, 다음 섹션 pin 시작까지 지속
    if (i < 4) {
      gsap.fromTo(
        sec,
        {
          autoAlpha: 1,
          opacity: 1,
          yPercent: 0,
          immediateRender: false,
        },
        {
          autoAlpha: 0,
          opacity: 0,
          yPercent: -40,
          ease: 'none',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: sec,
            // pin이 false가 되는 정확한 지점에서 페이드 시작
            start: () => pinTrigger.end,
            // 1번째 섹션은 더 짧은 범위로 빠르게 복귀하도록 조정
            end: () => pinTrigger.end + (window.innerHeight * (i === 0 ? 0.18 : 0.35)),
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // 다음 섹션(2~5): 화면에 들어오는 순간부터 pin 시작까지 페이드 인
    if (next && i < 4) {
      gsap.fromTo(next, { autoAlpha: 0, opacity: 0 }, {
        autoAlpha: 1,
        opacity: 1,
        ease: 'none',
        overwrite: 'auto',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',
          end: i === 0 ? 'top 85%' : 'top top', // 첫 전환 구간은 더 짧게 페이드 인
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }
  });

  ScrollTrigger.refresh();
}

// ===== 4번째(정보) 섹션 카드 슬라이드 인 =====
let __informCardsTL;
function initInformCards() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const section = document.getElementById('inform-section');
  if (!section || getComputedStyle(section).display === 'none') return;
  // 새 카드 덱이 존재하면 기존 순차 슬라이드는 건너뜁니다.
  if (section.querySelector('.inform-deck')) return;

  const cards = section.querySelectorAll('.media-placeholder');
  if (!cards || cards.length === 0) return;

  // 기존 타임라인이 있으면 제거 후 재생성 (중복 방지)
  if (__informCardsTL) {
    __informCardsTL.scrollTrigger && __informCardsTL.scrollTrigger.kill();
    __informCardsTL.kill();
    __informCardsTL = null;
  }

  // 초기 상태: 카드들은 아래에서, 투명하게 대기 (슬라이드/페이드 인만 적용)
  gsap.set(cards, { opacity: 0, y: 40 });

  // 섹션 내부 스크롤 진행에 따라 카드가 하나씩 자연스럽게 슬라이드/페이드 인
  __informCardsTL = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    }
  });

  cards.forEach((card, i) => {
    __informCardsTL.to(card, {
      opacity: 1,
      y: 0,
      ease: 'power1.out'
    }, i * 0.25); // 타임라인 내에서 순차적으로 등장 (조금 더 촘촘하게)
  });

  // (회전 효과 제거) 슬라이드/페이드 인만 적용

  // 트리거 측정 보정
  ScrollTrigger.refresh();
}

// === Inform: 7-card deck autoplay showing only 3 ===
function initInformDeck() {
  const section = document.getElementById('inform-section');
  if (!section || getComputedStyle(section).display === 'none') return;
  const deck = section.querySelector('.inform-deck');
  if (!deck) return;
  const cards = Array.from(deck.querySelectorAll('.value-card'));
  if (cards.length === 0) return;

  let start = 0; // visible window start index -> shows [start, start+1, start+2]
  const total = cards.length;
  const AUTOPLAY_MS = 2000;
  let intervalId = null;

  function setWindow() {
    cards.forEach((c, idx) => {
      c.classList.remove('is-left', 'is-center', 'is-right', 'is-hidden');
      if (idx === start) {
        c.classList.add('is-left');
      } else if (idx === (start + 1) % total) {
        c.classList.add('is-center');
      } else if (idx === (start + 2) % total) {
        c.classList.add('is-right');
      } else {
        c.classList.add('is-hidden');
      }
    });
  }

  function next() {
    start = (start + 1) % total;
    setWindow();
  }

  // Initial placement
  setWindow();

  // Autoplay only while section is in view
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => { if (!intervalId) intervalId = setInterval(next, AUTOPLAY_MS); },
      onEnterBack: () => { if (!intervalId) intervalId = setInterval(next, AUTOPLAY_MS); },
      onLeave: () => { if (intervalId) { clearInterval(intervalId); intervalId = null; } },
      onLeaveBack: () => { if (intervalId) { clearInterval(intervalId); intervalId = null; } },
    });
  } else {
    // Fallback: always autoplay
    if (!intervalId) intervalId = setInterval(next, AUTOPLAY_MS);
  }
}

// ===== 4번째 섹션 점(블러) 스크롤 애니메이션 =====
function initInformDots() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  const section = document.getElementById('inform-section');
  if (!section || getComputedStyle(section).display === 'none') return;
  const copy = section.querySelector('.inform-copy');
  if (!copy) return;

  const DOT_MARGIN = 14; // 양 끝 여유
  function computeTargets() {
    const w = copy.clientWidth || 0;
    return {
      topTarget: Math.max(0, w - DOT_MARGIN),      // 위쪽 점: 좌→우로 이동
      bottomTarget: -Math.max(0, w - DOT_MARGIN),  // 아래쪽 점: 우→좌로 이동
    };
  }
  let { topTarget, bottomTarget } = computeTargets();
  gsap.set(copy, { '--dotTopX': '0px', '--dotBottomX': '0px' });

  const pin = ScrollTrigger.getById('inform-pin');
  gsap.to(copy, {
    '--dotTopX': () => `${topTarget}px`,
    '--dotBottomX': () => `${bottomTarget}px`,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: section,
      start: pin ? pin.start : 'top top',
      end: pin ? pin.end : 'top+=70% top',
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: () => { const t = computeTargets(); topTarget = t.topTarget; bottomTarget = t.bottomTarget; },
    }
  });
}

// ===== 5번째(마스코트) 섹션: 이미지 먼저, 텍스트는 양쪽에서 동시에 등장 =====
let __mascotTL;
function initMascotAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const section = document.getElementById('mascot-section');
  if (!section || getComputedStyle(section).display === 'none') return;

  const title = section.querySelector('.mascot-title');
  const outline = section.querySelector('.mascot-outline');
  const image = section.querySelector('.mascot-image');
  const infoCard = section.querySelector('.mascot-info-card');
  if (!title || !outline || !image) return;

  // 중복 방지: 기존 타임라인 제거
  if (__mascotTL) {
    __mascotTL.scrollTrigger && __mascotTL.scrollTrigger.kill();
    __mascotTL.kill();
    __mascotTL = null;
  }

  // 로딩 직후 초기 상태: 화면 밖으로 배치
  gsap.set(title, { xPercent: -120, opacity: 0 });     // 왼쪽 밖
  gsap.set(outline, { xPercent: 120, opacity: 0 });    // 오른쪽 밖
  gsap.set(image, { yPercent: 120, opacity: 0 });      // 아래 밖
  if (infoCard) gsap.set(infoCard, { xPercent: 120, opacity: 0 }); // 텍스트 카드: 오른쪽 밖

  // 스크롤 진행에 따라 이미지가 먼저 등장, 이어서 텍스트들이 동시에 등장
  __mascotTL = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',   // 섹션 상단이 뷰포트 하단에 들어올 때부터
      end: 'bottom top',     // 섹션 하단이 뷰포트 상단을 지나갈 때까지
      scrub: true,
      invalidateOnRefresh: true,
    }
  });

  // 1단계: 이미지가 아래에서 자연스럽게 올라옴
  __mascotTL.to(image, {
    yPercent: 0,
    opacity: 1,
    ease: 'power1.out',
    duration: 0.45
  }, 0);

  // 2단계: 더 스크롤하면 텍스트(타이틀+아웃라인)만 양쪽에서 동시에 등장
  __mascotTL.to([title, outline], {
    xPercent: 0,
    opacity: 1,
    ease: 'power1.out',
    duration: 0.45
  }, '+=0.25');

  // 3단계: 추가 스크롤 시 정보 카드가 우측에서 들어오고, 이미지는 좌측으로 자연스럽게 밀림
  if (infoCard) {
    __mascotTL.to(infoCard, {
      xPercent: -15, // 카드도 더 왼쪽으로 밀기
      opacity: 1,
      ease: 'power1.out',
      duration: 0.45
    }, '+=0.25');
    // 카드 등장과 동시에 이미지가 좌측으로 살짝 이동
    __mascotTL.to(image, {
      xPercent: -25, // 이미지를 더 왼쪽으로 밀어 강조
      ease: 'power1.out',
      duration: 0.45
    }, '-=0.45');
  }

  ScrollTrigger.refresh();
}

// ===== 섹션 전환 기능 =====
function showSection(sectionName) {
    // 합격자 창 배경 바 슬라이드 애니메이션
    if (sectionName === 'result-pass') {
      setTimeout(() => {
        const bars = document.querySelectorAll('.result-pass-bg .bar');
        bars.forEach((bar, i) => {
          bar.style.transition = 'transform 0.8s cubic-bezier(0.6,0,0.4,1), opacity 0.5s';
          bar.style.transform = 'scaleY(0)';
          bar.style.opacity = '0.7';
          bar.style.transitionDelay = '';
        });
        // 순차적으로 scaleY를 1로 변경
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.transform = 'scaleY(1)';
            bar.style.transitionDelay = `${i * 0.18}s`;
          }, i * 180);
        });
      }, 50);
    }
  const FADE_DURATION = 300; // ms, matches CSS per-screen fade (style.css)
  const targetId = sectionName + '-section';
  // 현재 탭의 스크롤 저장
  saveCurrentTabScroll();
  // 홈에서 다른 탭으로 이동 시, 먼저 모든 ScrollTrigger를 제거해 pin 상태 해제
  if (sectionName !== 'home' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(t => t.kill());
    ScrollTrigger.refresh();
  }
  // 모든 섹션 중 대상이 아닌 섹션만 페이드아웃 및 숨김 예약
  document.querySelectorAll('.section').forEach((section) => {
    if (section.id !== targetId) {
      section.classList.remove('active-home', 'active-project', 'active-member', 'active-qna', 'active-inform', 'active-values', 'active-intro', 'active-mascot');
      // 홈 섹션은 pin 잔상 방지를 위해 즉시 숨김
      if (section.id === 'home-section') {
        section.style.display = 'none';
      } else {
        setTimeout(() => {
          section.style.display = 'none';
        }, FADE_DURATION);
      }
    }
  });

  // 선택된 섹션 페이드인
  setTimeout(() => {
    const targetSection = document.getElementById(targetId);
    targetSection.style.display = 'flex';
    // 탭 진입 시 항상 스크롤 상단으로 이동
    if (window.__lenisInstance && typeof window.__lenisInstance.scrollTo === 'function') {
      window.__lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    setTimeout(() => {
      const activeClass = `active-${sectionName}`;
      targetSection.classList.add(activeClass);
      // 홈 전환 시 스크롤 효과 활성화, 그 외는 비활성화
      if (sectionName === 'home') {
        document.body.classList.add('home-mode');
        // QnA/멤버 모드 해제 및 인라인 높이 초기화
        document.body.classList.remove('qna-mode');
        document.body.classList.remove('member-mode');
        document.body.style.minHeight = '';
        enableHomeScroll();
        // 홈 화면에서는 섹션 간 간격 박스를 표시
        document.querySelectorAll('.section-gap').forEach(g => {
          g.style.display = 'block';
        });
        const intro = document.getElementById('intro-section');
        if (intro) {
          intro.style.display = 'flex';
          intro.classList.add('active-intro');
          const values = document.getElementById('values-section');
          if (values) {
            values.style.display = 'flex';
            values.classList.add('active-values');
          }
          const inform = document.getElementById('inform-section');
          if (inform) {
            inform.style.display = 'flex';
            inform.classList.add('active-inform');
          }
          const mascot = document.getElementById('mascot-section');
          if (mascot) {
            mascot.style.display = 'flex';
            mascot.classList.add('active-mascot');
          }
        }
          // 디버깅: 홈 탭 진입 시 상태 출력
          const homeSection = document.getElementById('home-section');
          console.log('[홈탭 진입]');
          console.log('body.classList:', Array.from(document.body.classList));
          console.log('body.style.minHeight:', document.body.style.minHeight);
          console.log('body CSS min-height:', getComputedStyle(document.body).minHeight);
          if (homeSection) {
            console.log('homeSection.style.display:', homeSection.style.display);
            console.log('homeSection.classList:', Array.from(homeSection.classList));
          }
          console.log('homeScrollEnabled:', homeScrollEnabled);
          console.log('__homeScrollSource:', __homeScrollSource);
          console.log('__homeScrollHandler:', __homeScrollHandler);
      } else {
        document.body.classList.remove('home-mode');
        disableHomeScroll();
        // 홈이 아닐 때는 모든 ScrollTrigger 제거로 겹침 방지
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.getAll().forEach(t => t.kill());
          ScrollTrigger.refresh();
        }
        // 다른 탭에서는 간격 박스를 숨김
        document.querySelectorAll('.section-gap').forEach(g => {
          g.style.display = 'none';
        });
        const intro = document.getElementById('intro-section');
        if (intro) {
          intro.classList.remove('active-intro');
          intro.style.display = 'none';
        }
        const values = document.getElementById('values-section');
        if (values) {
          values.classList.remove('active-values');
          values.style.display = 'none';
        }
        const inform = document.getElementById('inform-section');
        if (inform) {
          inform.classList.remove('active-inform');
          inform.style.display = 'none';
        }
        const mascot = document.getElementById('mascot-section');
        if (mascot) {
          mascot.classList.remove('active-mascot');
          mascot.style.display = 'none';
        }
        // QnA/Member/Project 탭은 스크롤 여유 제공 (한 화면 높이 추가) 및 섹션별 초기화
        if (sectionName === 'qna') {
          document.body.classList.add('qna-mode');
          document.body.classList.remove('member-mode');
          document.body.classList.remove('project-mode');
          document.body.style.minHeight = '200vh';
          // QnA 아코디언 초기화
          if (typeof initQnaAccordion === 'function') {
            initQnaAccordion();
          }
        } else if (sectionName === 'member') {
          document.body.classList.add('member-mode');
          document.body.classList.remove('qna-mode');
          document.body.classList.remove('project-mode');
          // 멤버 탭은 카드 개수에 따라 스크롤 여유를 동적으로 계산
          // 멤버 섹션 초기화 (필터 + 그리드)
          initMemberSection();
          // 렌더 직후 동적 스크롤 높이 설정
          updateMemberScrollPadding();
          // 리사이즈 시에도 재계산 (중복 등록 방지)
          if (!window.__memberResizeBound) {
            window.__memberResizeBound = true;
            window.addEventListener('resize', () => {
              if (__currentTab === 'member') updateMemberScrollPadding();
            });
          }
        } else if (sectionName === 'project') {
            document.body.classList.add('project-mode');
            document.body.classList.remove('qna-mode');
            document.body.classList.remove('member-mode');
            // 프로젝트 탭은 카드 개수에 따라 스크롤 여유를 동적으로 계산
            updateProjectScrollPadding();
            // 리사이즈 시에도 재계산 (중복 등록 방지)
            if (!window.__projectResizeBound) {
              window.__projectResizeBound = true;
              window.addEventListener('resize', () => {
                if (__currentTab === 'project') updateProjectScrollPadding();
              });
            }
        } else if (sectionName === 'result' || sectionName === 'result-pass' || sectionName === 'result-fail') {
          // 결과 확인 탭은 특별 초기화 없음
          document.body.classList.remove('qna-mode');
          document.body.classList.remove('member-mode');
          document.body.classList.remove('project-mode');
          document.body.style.minHeight = '';
        } else {
          document.body.classList.remove('qna-mode');
          document.body.classList.remove('member-mode');
          document.body.classList.remove('project-mode');
          document.body.style.minHeight = '';
        }

        // 결과 탭에서는 상단 좌측 로고와 우측 네비를 숨김
        const topLeftLogo = document.querySelector('.top-left-logo');
        const topRightNav = document.querySelector('.top-right-nav');
        if (sectionName === 'result' || sectionName === 'result-pass' || sectionName === 'result-fail') {
          if (topLeftLogo) topLeftLogo.style.display = 'none';
          if (topRightNav) topRightNav.style.display = 'none';
        } else if (sectionName === 'home') {
          if (topLeftLogo) {
            topLeftLogo.removeAttribute('style');
            topLeftLogo.style.display = 'block';
            topLeftLogo.style.visibility = 'visible';
            topLeftLogo.style.opacity = '1';
            topLeftLogo.style.zIndex = '100';
          }
          if (topRightNav) {
            topRightNav.removeAttribute('style');
            topRightNav.style.display = 'flex';
            topRightNav.style.visibility = 'visible';
            topRightNav.style.opacity = '1';
            topRightNav.style.zIndex = '101';
          }
        } else {
          if (topLeftLogo) topLeftLogo.style.display = 'block';
          if (topRightNav) topRightNav.style.display = 'flex';
        }
      }
      // 홈 이외 탭은 즉시 스크롤 위치 복원
      if (sectionName !== 'home') {
        restoreTabScroll(sectionName);
      }
      // 현재 탭 업데이트
      __currentTab = sectionName;
    }, 50);
  }, 300);

  // 네비게이션 활성 상태 변경
  document.querySelectorAll('.nav-link').forEach((link) => {
    const isActive = link.getAttribute('data-section') === sectionName;
    if (isActive) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 네비게이션 클릭 이벤트
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const section = this.getAttribute('data-section');
    showSection(section);
    // 홈으로 이동 시에만 홈 전용 트리거/애니메이션 재초기화
    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        if (section === 'home') {
          initSectionPins();
          initInformCards();
          initInformDeck();
            initInformDots();
          initMascotAnimations();
          // 트리거 초기화 직후 홈 스크롤 위치 복원
          setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
              ScrollTrigger.refresh();
            }
            restoreTabScroll('home');
          }, 60);
        } else {
          ScrollTrigger.getAll().forEach(t => t.kill());
          ScrollTrigger.refresh();
        }
      }
    }, 400);
  });
});

// QnA 아코디언: 클릭 시 열고 닫기 (단일 열림)
let __qnaBound = false;
function initQnaAccordion() {
  const section = document.getElementById('qna-section');
  if (!section) return;
  const items = Array.from(section.querySelectorAll('.qna-item'));
  if (items.length === 0) return;

  // 중복 바인딩 방지: 기존 리스너 제거를 위해 새로 delegating
  if (__qnaBound) return;
  __qnaBound = true;

  section.addEventListener('click', (e) => {
    const head = e.target.closest('.qna-head');
    if (!head) return;
    const item = head.closest('.qna-item');
    const opened = item.classList.contains('open');
    // 모두 닫기
    items.forEach(i => i.classList.remove('open'));
    // 토글 현재
    if (!opened) item.classList.add('open');
  });
}

// ===== 로딩 애니메이션 =====
let progress = 0;
let targetProgress = 0;
let isPageLoaded = false;
const loadingText = document.querySelector('.loading-text');
const bars = document.querySelectorAll('.bar');
const startTime = performance.now();
let loadTime = 2000;

// 페이지 로딩 상태 추적
function checkLoadingState() {
  if (document.readyState === 'loading') {
    targetProgress = 30;
  } else if (document.readyState === 'interactive') {
    targetProgress = 60;
  } else if (document.readyState === 'complete') {
    targetProgress = 100;
    isPageLoaded = true;
    loadTime = performance.now() - startTime;
  }
}

window.addEventListener('load', () => {
  targetProgress = 100;
  isPageLoaded = true;
  loadTime = performance.now() - startTime;
});

document.addEventListener('readystatechange', checkLoadingState);

function updateProgress() {
  bars.forEach((bar, index) => {
    const barStart = index * 25;
    const barEnd = (index + 1) * 25;

    let barProgress = 0;
    if (progress > barEnd) {
      barProgress = 1;
    } else if (progress > barStart) {
      barProgress = (progress - barStart) / 25;
    }

    bar.style.transform = `scaleY(${barProgress})`;
  });

  loadingText.textContent = Math.floor(progress) + '%';
}

function updateLoading() {
  if (progress < targetProgress) {
    let increment;
    if (loadTime < 100) {
      increment = 5;
    } else if (loadTime < 500) {
      increment = 3;
    } else {
      increment = 1;
    }

    progress += increment;
    if (progress > targetProgress) progress = targetProgress;

    updateProgress();
  }

  // 100% 완료 시
  if (progress >= 100 && isPageLoaded) {
    setTimeout(() => {
      // 로딩창 숨김
      document.querySelector('.logo-container').classList.add('fade-out');
      // 1단계: display 변경 (중앙 요소는 opacity 0, y 20px로 세팅)
      document.querySelector('.top-left-logo').style.display = 'block';
      document.querySelector('.top-right-nav').style.display = 'flex';
      const homeSection = document.getElementById('home-section');
      homeSection.style.display = 'flex';
      // 중앙 요소들 opacity 0, y 20px로 세팅 (애니메이션 자연스럽게)
      const logo = homeSection.querySelector('.center-logo');
      const subtitle = homeSection.querySelector('.subtitle');
      const buttons = document.getElementById('recruitButtons');
      // GSAP가 등장 애니메이션을 처리하므로 직접 opacity/transform을 설정하지 않음

      const introAtLoad = document.getElementById('intro-section');
      if (introAtLoad) {
        introAtLoad.style.display = 'flex';
        introAtLoad.classList.add('active-intro');
      }
      const informAtLoad = document.getElementById('inform-section');
      if (informAtLoad) {
        informAtLoad.style.display = 'flex';
        // 페이드인은 body.loaded 후에 활성화
      }

      // 한 프레임 뒤에 GSAP 애니메이션 시작 (강제 리플로우)
      requestAnimationFrame(() => {
        initHomeIntroAnimation();
      });

      // 2단계: 브라우저가 렌더링한 후 opacity transition 시작
      setTimeout(() => {
        document.body.classList.add('loaded');
        // 초기 홈 섹션을 활성화하여 섹션 페이드인을 트리거
        const homeSection = document.getElementById('home-section');
        // 홈 초기 진입: 홈 전용 스크롤 여유 활성화
        document.body.classList.add('home-mode');
        // 초기 로딩 시는 1.5s로 다른 요소들과 동기화
        homeSection.classList.add('initial-fade');
        homeSection.classList.add('active-home');
        // 핵심 가치 섹션도 함께 표시 및 페이드인
        const valuesSection = document.getElementById('values-section');
        if (valuesSection) {
          valuesSection.style.display = 'flex';
          valuesSection.classList.add('active-values');
        }

        // 결과 조회 버튼 핸들러 바인딩
        setupResultCheck();
        setupResultHomeLogo();
        // 가치 소개 섹션도 표시 및 페이드인
        const informSection = document.getElementById('inform-section');
        if (informSection) {
          informSection.style.display = 'flex';
          informSection.classList.add('active-inform');
        }
        // 마스코트 섹션도 표시 및 페이드인
        const mascotSection = document.getElementById('mascot-section');
        if (mascotSection) {
          mascotSection.style.display = 'flex';
          mascotSection.classList.add('active-mascot');
        }
        // 홈 로고/서브타이틀 초기 천천히 등장 애니메이션
        initHomeIntroAnimation();
        // 초기 페이드 이후에는 기본 0.3s 전환으로 복원
        setTimeout(() => {
          homeSection.classList.remove('initial-fade');
        }, 300);

        // 버튼 표시: 기간에 따라 한 종류만 노출
        const buttons = document.getElementById('recruitButtons');
        if (buttons) {
          const applyBtn = buttons.querySelector('.primary-btn');
          const resultBtn = buttons.querySelector('.secondary-btn');
          // 기본은 모두 숨김
          if (applyBtn) applyBtn.style.display = 'none';
          if (resultBtn) resultBtn.style.display = 'none';
          if (isRecruitmentPeriod && !isResultCheckPeriod) {
            if (applyBtn) applyBtn.style.display = 'inline-flex';
            buttons.style.display = 'flex';
          } else if (isResultCheckPeriod && !isRecruitmentPeriod) {
            if (resultBtn) resultBtn.style.display = 'inline-flex';
            buttons.style.display = 'flex';
          } else if (isRecruitmentPeriod && isResultCheckPeriod) {
            // 둘 다 true인 예외 상황: 신청 버튼만 우선 노출
            if (applyBtn) applyBtn.style.display = 'inline-flex';
            buttons.style.display = 'flex';
          } else {
            // 어떤 기간도 아니면 컨테이너 숨김
            buttons.style.display = 'none';
          }

          // 버튼 클릭 동작: 기간에 따라 탭 이동
          if (applyBtn) {
            applyBtn.addEventListener('click', (e) => {
              e.preventDefault();
              if (isRecruitmentPeriod) {
                // 추후 'apply' 섹션이 생기면 탭 전환
                // 현재는 홈 유지
              } else {
                alert('현재는 모집 신청 기간이 아닙니다.');
              }
            });
          }
          if (resultBtn) {
            resultBtn.addEventListener('click', (e) => {
              e.preventDefault();
              if (isResultCheckPeriod) {
                showSection('result');
              } else {
                alert('현재는 합격자 확인 기간이 아닙니다.');
              }
            });
          }
        }

        // 홈 활성화 상태이므로 스크롤 효과를 켭니다
        enableHomeScroll();
        // 부드러운 스크롤 초기화
        initSmoothScrolling();
        // 섹션 핀 초기화 (로더 완료 후 표시된 상태에서)
        initSectionPins();
        // 4번째 섹션 카드 슬라이드 인 초기화
        initInformCards();
        // 7장 중 3장만 표시하는 덱 초기화
        initInformDeck();
        // 4번째 섹션 점 애니메이션 초기화
        initInformDots();
        // 5번째 섹션 마스코트 애니메이션 초기화
        initMascotAnimations();
        // 한 번 더 새로고침으로 트리거 측정치 보정
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 200);
        }
      }, 50);
    }, 300);
    return;
  }

  let delay = loadTime < 100 ? 20 : 50;
  setTimeout(updateLoading, delay);
}

// ===== Member: Data-driven filters and grid =====
// 버튼(필터) 추가를 간단히: 아래 배열에 { id, label, variant } 항목을 추가하세요.
// variant: 'primary' | 'muted' (디자인 톤)
const MEMBER_FILTERS = [
  { id: '1기', label: '1기', variant: 'primary' },
  { id: '창립멤버', label: '창립멤버', variant: 'muted' },
];

// 멤버 박스 데이터: { name, role, tags, bio }에서 tags에 해당 필터 id를 넣으면 필터링됩니다.
const MEMBERS = [
  { name: '황인성', role: '동장 / 개발', tags: ['창립멤버'], bio: '안녕하세요, 저는 황인성입니다.', image: 'images/SummitMainLogo1.png' },
  { name: '조현석', role: '창동장 / 디자인', tags: ['창립멤버'], bio: '안녕하세요, 저는 조현석입니다.', image: 'images/SummitMainLogo1.png' },
  { name: '양신우', role: '디자인', tags: ['창립멤버'], bio: '안녕하세요, 저는 양신우입니다.', image: 'images/SummitMainLogo1.png' },
  { name: '김민경', role: '디자인', tags: ['창립멤버'], bio: '안녕하세요, 저는 김민경입니다.', image: 'images/SummitMainLogo1.png' },
  { name: '임다솔', role: '기획', tags: ['창립멤버'], bio: '23기 학홍 팀장', image: 'images/Imda.png' },
  { name: '서은찬', role: '기획', tags: ['창립멤버'], bio: '안녕하세요, 저는 서은찬입니다.', image: 'images/SummitMainLogo1.png' },
  { name: '주윤성', role: '개발', tags: ['창립멤버'], bio: '안녕하세요, 저는 주윤성입니다.', image: 'images/SummitMainLogo1.png' },
  { name: '손연우', role: '개발', tags: ['창립멤버'], bio: '안녕하세요, 저는 손연우입니다.', image: 'images/SummitMainLogo1.png' },
  { name: '민수연', role: '동장 / 개발', tags: ['1기'], bio: '안녕하세요, 저는 민수연입니다.', image: 'images/Sym.png' },
  { name: '이주은', role: '창동장 / 개발', tags: ['1기'], bio: '서밋 잡일 담당 바지사장🥲', image: 'images/Jueun.png' },
  { name: '양세린', role: '디자인', tags: ['1기'], bio: '안녕하세요, 저는 양세린입니다.', image: 'images/Saerine.png' },
  { name: '김서윤', role: '디자인', tags: ['1기'], bio: '안녕하세요, 저는 김서윤입니다.', image: 'images/SummitMainLogo1.png' },
  { name: '장세혁', role: '기획', tags: ['1기'], bio: '테토남', image: 'images/Saeping.png' }
];

let __memberActiveFilter = null; // 선택된 필터 id (null이면 전체)

function getHighestGenerationFilterId() {
  let maxGen = -Infinity;
  let chosen = null;
  MEMBER_FILTERS.forEach(f => {
    const text = String(f.id ?? f.label ?? '');
    // 우선 '숫자+기' 패턴을 찾고, 없으면 최초 숫자를 사용
    let num = NaN;
    const m1 = text.match(/(\d+)\s*기/);
    if (m1) {
      num = parseInt(m1[1], 10);
    } else {
      const m2 = text.match(/(\d+)/);
      if (m2) num = parseInt(m2[1], 10);
    }
    if (!isNaN(num) && num > maxGen) {
      maxGen = num;
      chosen = f.id;
    }
  });
  return chosen;
}

function renderMemberFilters() {
  const section = document.getElementById('member-section');
  if (!section) return;
  const wrap = section.querySelector('.member-filters');
  const tpl = document.getElementById('member-chip-template');
  if (!wrap || !tpl) return;

  wrap.innerHTML = '';
  MEMBER_FILTERS.forEach(f => {
    const chipNode = tpl.content.cloneNode(true);
    const btn = chipNode.querySelector('.member-chip');
    btn.textContent = f.label;
    btn.dataset.filterId = f.id;
    btn.classList.add(f.variant === 'primary' ? 'chip-primary' : 'chip-muted');
    if (__memberActiveFilter === f.id) btn.classList.add('active');
    btn.addEventListener('click', () => {
      if (__memberActiveFilter === f.id) return; // Prevent re-render if same chip
      __memberActiveFilter = f.id;
      // active 상태 업데이트
      wrap.querySelectorAll('.member-chip').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      renderMemberGrid();
    });
    wrap.appendChild(chipNode);
  });
}

function renderMemberGrid() {
  const section = document.getElementById('member-section');
  if (!section) return;
  const grid = section.querySelector('.member-grid');
  const tpl = document.getElementById('member-card-template');
  if (!grid || !tpl) return;

  // 그리드 페이드 아웃 → 데이터 교체 → 페이드 인 애니메이션
  function setMemberImage(node, m) {
    const imgEl = node.querySelector('.member-image');
    if (imgEl && m.image) {
      imgEl.src = m.image;
      imgEl.alt = m.name || '';
    }
  }
  if (typeof gsap !== 'undefined') {
    gsap.to(grid, { opacity: 0, duration: 0.18, onComplete: () => {
      grid.innerHTML = '';
      const data = (Array.isArray(MEMBERS) ? MEMBERS : [])
        .filter(m => {
          if (!__memberActiveFilter) return true;
          const tags = Array.isArray(m.tags) ? m.tags : [];
          return tags.includes(__memberActiveFilter);
        });
      const useData = data.length > 0 ? data : new Array(3).fill({ name: '멤버', role: '' });
      useData.forEach((m) => {
        const node = tpl.content.cloneNode(true);
        setMemberImage(node, m);
        const nameEl = node.querySelector('.member-name');
        const bioEl = node.querySelector('.member-bio');
        const tagsWrap = node.querySelector('.member-tags');
        if (nameEl) nameEl.textContent = m.name || '멤버';
        if (bioEl) bioEl.textContent = m.bio || '';
        // 역할을 칩으로 분할 렌더링 (예: '동장 / 개발')
        const tokens = String(m.role || '').split('/').map(s => s.trim()).filter(Boolean);
        if (tagsWrap) {
          tokens.forEach(t => {
            const chip = document.createElement('span');
            chip.className = 'member-tag';
            chip.textContent = t;
            // 동장/창동장은 빨간색 하이라이트
            if (t === '동장' || t === '창동장') {
              chip.classList.add('lead');
            }
            // 카드 수가 변경되었을 수 있으므로 스크롤 여유 재계산
            updateMemberScrollPadding();
            tagsWrap.appendChild(chip);
          });
        }
        grid.appendChild(node);
      });
      gsap.to(grid, { opacity: 1, duration: 0.22, overwrite: true });
    }, overwrite: true });
  } else {
    grid.innerHTML = '';
    const data = (Array.isArray(MEMBERS) ? MEMBERS : [])
      .filter(m => {
        if (!__memberActiveFilter) return true;
        const tags = Array.isArray(m.tags) ? m.tags : [];
        return tags.includes(__memberActiveFilter);
      });
    const useData = data.length > 0 ? data : new Array(3).fill({ name: '멤버', role: '' });
    useData.forEach((m) => {
      const node = tpl.content.cloneNode(true);
      setMemberImage(node, m);
      const nameEl = node.querySelector('.member-name');
      const bioEl = node.querySelector('.member-bio');
      const tagsWrap = node.querySelector('.member-tags');
      if (nameEl) nameEl.textContent = m.name || '멤버';
      if (bioEl) bioEl.textContent = m.bio || '';
      // 역할을 칩으로 분할 렌더링 (예: '동장 / 개발')
      const tokens = String(m.role || '').split('/').map(s => s.trim()).filter(Boolean);
      if (tagsWrap) {
        tokens.forEach(t => {
          const chip = document.createElement('span');
          chip.className = 'member-tag';
          chip.textContent = t;
          if (t === '동장' || t === '창동장') {
            chip.classList.add('lead');
          }
          updateMemberScrollPadding();
          tagsWrap.appendChild(chip);
        });
      }
      grid.appendChild(node);
    });
  }
}

      // ===== Member: dynamic scroll padding based on rows =====
      function updateMemberScrollPadding() {
        const section = document.getElementById('member-section');
        if (!section) return;
        const grid = section.querySelector('.member-grid');
        if (!grid) return;
        const count = grid.children.length;
        // CSS 브레이크포인트에 맞춘 컬럼 계산
        const w = window.innerWidth || document.documentElement.clientWidth || 0;
        const cols = w <= 640 ? 1 : (w <= 1024 ? 2 : 3);
        const rows = Math.max(1, Math.ceil(count / cols));
        // 최소 스크롤 여유: 1행일 때 140vh, 추가 행마다 50vh 가산
        const base = 140; // vh
        const perRow = 50; // vh
        const minVh = base + perRow * (rows - 1);
        // 콘텐츠가 더 길면 자연 높이를 우선하므로 min-height만 설정
        // 멤버 탭에 있을 때만 min-height를 동적으로 조정
        if (document.body.classList.contains('member-mode')) {
          document.body.style.minHeight = `${minVh}vh`;
        }
      }

        // ===== Project: dynamic scroll padding based on rows =====
        function updateProjectScrollPadding() {
          const section = document.getElementById('project-section');
          if (!section) return;
          const grid = section.querySelector('.project-grid');
          if (!grid) return;
          const count = grid.children.length;
          // CSS 브레이크포인트에 맞춘 컬럼 계산
          const w = window.innerWidth || document.documentElement.clientWidth || 0;
          const cols = w <= 640 ? 1 : (w <= 1024 ? 2 : 3);
          const rows = Math.max(1, Math.ceil(count / cols));
          // 최소 스크롤 여유: 1행일 때 100vh, 추가 행마다 50vh 가산
          const base = 100; // vh
          const perRow = 50; // vh
          const minVh = base + perRow * (rows - 1);
          // 프로젝트 탭에 있을 때만 min-height를 동적으로 조정
          if (document.body.classList.contains('project-mode')) {
            document.body.style.minHeight = `${minVh}vh`;
          }
        }

function initMemberSection() {
  // 처음 진입 시 가장 높은 기수 탭을 기본 활성화
  if (!__memberActiveFilter) {
    const def = getHighestGenerationFilterId();
    __memberActiveFilter = def || null;
  }
  renderMemberFilters();
  renderMemberGrid();
}

// 초기화
bars.forEach((bar) => {
  bar.style.transform = 'scaleY(0)';
});

checkLoadingState();
updateLoading();

// 네비게이션으로 섹션 표시 상태가 바뀔 때 트리거 새로고침
// 전역 클릭 후크는 제거하고 각 링크 핸들러에서 처리

// Lenis 초기화
initSmoothScrolling();

// ===== 합격자 조회 기능 =====
let __resultCheckBound = false;
function setupResultCheck() {
  if (__resultCheckBound) return;
  const btn = document.getElementById('checkResultBtn');
  if (!btn) return;
  __resultCheckBound = true;
  function handleResultCheck() {
    if (!isResultCheckPeriod) {
      alert('현재는 합격자 확인 기간이 아닙니다.');
      return;
    }
    const idInput = document.getElementById('studentId');
    const nameInput = document.getElementById('studentName');
    const id = String(idInput && idInput.value ? idInput.value : '').trim();
    const name = String(nameInput && nameInput.value ? nameInput.value : '').trim();
    if (!id || !name) {
      showResultError('학번과 이름을 모두 입력하세요.');
      return;
    }
    // 학생 데이터 찾기
    let student = ACCEPTED_STUDENTS.find(s => String(s.id).trim() === id && String(s.name).trim() === name);
    let isAccepted = !!student;
    if (!student) {
      student = FAILED_STUDENTS.find(s => String(s.id).trim() === id && String(s.name).trim() === name);
    }
    let isFailed = !!student && !isAccepted;
    if (!student) {
      showResultError('명단에 없는 정보입니다. 학번과 이름을 다시 확인하세요.');
      return;
    }
    // 전화번호 입력 모달 띄우기
    const phoneModalBg = document.getElementById('modal-phone-bg');
    const phoneInput = document.getElementById('studentPhoneInput');
    const phoneModalClose = document.getElementById('modal-phone-close');
    const phoneModalCancel = document.getElementById('modal-phone-cancel');
    if (phoneModalBg && phoneInput && phoneModalClose && phoneModalCancel) {
      phoneModalBg.style.display = 'flex';
      phoneInput.value = '';
      setTimeout(function() { phoneInput.focus(); }, 80);
      function closeModal() {
        phoneModalBg.style.display = 'none';
        phoneModalClose.removeEventListener('click', verifyPhone);
        phoneModalCancel.removeEventListener('click', cancelModal);
        document.removeEventListener('keydown', escListener);
      }
      function escListener(e) {
        if (e.key === 'Escape') closeModal();
      }
      function verifyPhone() {
        const inputPhone = String(phoneInput.value).replace(/\D/g, '');
        if (inputPhone === student.phone) {
          closeModal();
          if (isAccepted) {
            showSection('result-pass');
            setTimeout(() => {
              const nameAccent = document.querySelector('#result-pass-section .name-accent');
              if (nameAccent) {
                nameAccent.textContent = name + ' 님';
              }
            }, 10);
          } else if (isFailed) {
            showSection('result-fail');
            setTimeout(() => {
              const failMsg = document.getElementById('resultFailMessage');
              if (failMsg) {
                failMsg.innerHTML =
                  `<span class=\"fail-main\"><span class='fail-name'>${name} 님</span>은 SUMMIT 2기 모집에 최종 <span class='fail-red'>불합격</span>하셨습니다.</span>` +
                  `<span class=\"fail-sub\">약 20분 후, 기재해 주신 전화번호로 안내 문자가 발송됩니다.</span>` +
                  `<span class=\"fail-sub\">다시 한번 지원해 주셔서 감사드리며,<br>앞으로의 도전과 활동을 진심으로 응원합니다.</span>`;
              }
            }, 10);
          }
        } else {
          showResultError('전화번호가 일치하지 않습니다. 다시 입력하세요.');
        }
      }
      function cancelModal() {
        closeModal();
      }
      phoneModalClose.addEventListener('click', verifyPhone);
      phoneModalCancel.addEventListener('click', cancelModal);
      document.addEventListener('keydown', escListener);
      // 중복 방지: 기존 keydown 리스너 제거 후 추가
      if (phoneInput._enterHandler) {
        phoneInput.removeEventListener('keydown', phoneInput._enterHandler);
      }
      phoneInput._enterHandler = function(e) {
        if (e.key === 'Enter') {
          if (e.shiftKey || e.ctrlKey) {
            // Shift+Enter 또는 Ctrl+Enter는 취소로 처리
            cancelModal();
          } else {
            verifyPhone();
            phoneInput.blur();
          }
        }
      };
      phoneInput.addEventListener('keydown', phoneInput._enterHandler);
    }
  }

  // 에러 모달 노출 함수
  function showResultError(msg) {
    var modalBg = document.getElementById('modal-error-bg');
    var modalMsg = document.getElementById('modal-error-message');
    var modalClose = document.getElementById('modal-error-close');
    if (modalBg && modalMsg && modalClose) {
      modalMsg.textContent = msg;
      modalBg.style.display = 'flex';
      // 포커스 이동
      setTimeout(function() { modalClose.focus(); }, 80);
      // 닫기 버튼 이벤트
      function closeModal() {
        modalBg.style.display = 'none';
        modalClose.removeEventListener('click', closeModal);
        document.removeEventListener('keydown', escListener);
      }
      function escListener(e) {
        if (e.key === 'Escape') closeModal();
      }
      modalClose.addEventListener('click', closeModal);
      document.addEventListener('keydown', escListener);
    }
  }
  

  btn.addEventListener('click', handleResultCheck);

  // Enter key triggers result check if both fields are filled
  const idInput = document.getElementById('studentId');
  const nameInput = document.getElementById('studentName');
  [idInput, nameInput].forEach(input => {
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          const id = String(idInput && idInput.value ? idInput.value : '').trim();
          const name = String(nameInput && nameInput.value ? nameInput.value : '').trim();
          if (id && name) {
            handleResultCheck();
          }
        }
      });
    }
  });
}

// ===== 모든 SummitMainLogo1.png(홈 제외) 클릭 시 홈 이동 =====
let __resultLogoBound = false;
function setupResultHomeLogo() {
  if (__resultLogoBound) return;
  // 홈 섹션을 제외한 모든 SummitMainLogo1.png(좌측 상단 로고) 선택
  const allLogos = Array.from(document.querySelectorAll('img[src$="SummitMainLogo1.png"]'));
  // 홈 섹션의 .top-left-logo는 제외
  const homeLogo = document.querySelector('.top-left-logo');
  const logos = allLogos.filter(el => el !== homeLogo);
  if (logos.length === 0) return;
  __resultLogoBound = true;
  logos.forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      // 현재 탭이 project/member/qna/result/result-pass/result-fail면 홈 섹션 요소만 애니메이션 적용
      const currentTab = window.__currentTab || '';
      showSection('home');
      setTimeout(() => {
        // 홈 섹션 진입 시 상단 로고/네비 항상 복원
        const topLeftLogo = document.querySelector('.top-left-logo');
        const topRightNav = document.querySelector('.top-right-nav');
        if (topLeftLogo) {
          topLeftLogo.removeAttribute('style');
          topLeftLogo.style.display = 'block';
          topLeftLogo.style.visibility = 'visible';
          topLeftLogo.style.opacity = '1';
          topLeftLogo.style.zIndex = '100';
        }
        if (topRightNav) {
          topRightNav.removeAttribute('style');
          topRightNav.style.display = 'flex';
          topRightNav.style.visibility = 'visible';
          topRightNav.style.opacity = '1';
          topRightNav.style.zIndex = '101';
        }
        // 입력칸 초기화
        const idInput = document.getElementById('studentId');
        const nameInput = document.getElementById('studentName');
        if (idInput) idInput.value = '';
        if (nameInput) nameInput.value = '';
        if ([
          'project', 'member', 'qna',
          'result', 'result-pass', 'result-fail'
        ].includes(currentTab)) {
          // 홈 섹션 요소만 애니메이션(상단 로고/네비 제외)
          if (typeof gsap !== 'undefined') {
            const home = document.getElementById('home-section');
            const logo = home ? home.querySelector('.center-logo') : null;
            const subtitle = home ? home.querySelector('.subtitle') : null;
            const buttons = document.getElementById('recruitButtons');
            gsap.set([logo, subtitle, buttons].filter(Boolean), { opacity: 0, y: 20 });
            gsap.to([logo, subtitle, buttons].filter(Boolean), {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
              stagger: 0
            });
          }
        } else {
          // 기존 전체 애니메이션(상단 로고/네비 포함)
          if (typeof initHomeIntroAnimation === 'function') {
            setTimeout(() => { initHomeIntroAnimation(); }, 100);
          }
        }
        if (typeof ScrollTrigger !== 'undefined') {
          initSectionPins();
          initInformCards();
          initInformDeck();
          initInformDots();
          initMascotAnimations();
          setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
              ScrollTrigger.refresh();
            }
            restoreTabScroll('home');
          }, 60);
        }
      }, 400);
    });
  });
}

// ===== 최종 합격자 섹션 막대 애니메이션 =====
function animateResultPassBars() {
  const barsBg = document.querySelector('.result-pass-bars-bg');
  if (!barsBg) return;
  const svg = barsBg.querySelector('svg');
  if (!svg) return;
  const bars = svg.querySelectorAll('.bar');
  if (!bars.length) return;
  // 각 막대의 원래 y, height 저장
  const barData = [
    { y: 230, height: 280 },
    { y: 160, height: 250 },
    { y: 280, height: 170 },
    { y: 0,   height: 380 }
  ];
  bars.forEach((bar, i) => {
    bar.setAttribute('height', 0);
    bar.setAttribute('y', barData[i].y + barData[i].height);
  });
  bars.forEach((bar, i) => {
    setTimeout(() => {
      if (typeof gsap !== 'undefined') {
        gsap.to(bar, {
          attr: {
            height: barData[i].height,
            y: barData[i].y
          },
          duration: 1, // 느리게
          ease: 'power2.out',
          onComplete: () => {
            // 마지막 막대가 끝나면 컨페티 실행
            if (i === bars.length - 1) {
              setTimeout(launchConfetti, 50);
            }
          }
        });
      } else {
        bar.style.transition = 'height 0.7s, y 0.7s cubic-bezier(0.4,0,0.2,1)';
        bar.setAttribute('height', barData[i].height);
        bar.setAttribute('y', barData[i].y);
        if (i === bars.length - 1) {
          setTimeout(launchConfetti, 1400);
        }
      }
    }, 250 + i * 350); // 딜레이도 더 느리게
  });
}

// ===== 컨페티 폭죽 애니메이션 =====
function launchConfetti() {
  if (document.getElementById('confetti-canvas')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  // 컨페티 파티클 생성
  const colors = ['#D61F26', '#fff']; // 흰색, 빨간색만 사용
  const confettiCount = 500; // 컨페티 양 극대화
  let confetti = [];
  let phase = 'burst';
  function createBurstConfetti() {
    const arr = [];
    for (let i = 0; i < confettiCount; i++) {
      let x, angle;
      if (i % 2 === 0) {
        x = 0;
        angle = (Math.PI / 3) + (Math.random() * (Math.PI / 3));
      } else {
        x = W;
        angle = (2 * Math.PI / 3) - (Math.random() * (Math.PI / 3));
      }
      // burst 속도와 중력을 높임(더 빠르게)
      const speed = 15 + Math.random() * 7; // burst 속도 대폭 증가
      const startY = H * (0.95 + Math.random() * 0.1); // 다시 아래에서 쏘도록 복구
      arr.push({
        x: x,
        y: startY,
        w: 6 + Math.random() * 14,
        h: 2 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed * (1.3 + Math.random() * 0.9),
        vy: -Math.sin(angle) * speed * (2.2 + Math.random() * 1.0),
        gravity: 0.28 + Math.random() * 0.13, // burst 중력도 증가
        rotate: Math.random() * Math.PI * 2,
        rotateSpeed: (Math.random() - 0.5) * 0.1,
        alpha: 1,
        spreadX: (() => {
          const edgeRatio = 0.18;
          const r = Math.random();
          if (r < 0.18) {
            return Math.random() * (W * edgeRatio);
          } else if (r > 0.82) {
            return W * (1 - edgeRatio) + Math.random() * (W * edgeRatio);
          } else {
            return W * edgeRatio + Math.random() * (W * (1 - 2 * edgeRatio));
          }
        })(),
      });
    }
    return arr;
  }
  // burst에서 사용한 confetti 배열을 그대로 fall로 넘기고, 속도/중력만 fall용으로 변환
  function convertBurstToFallConfetti(confettiArr) {
    return confettiArr.map((c, i) => ({
      ...c,
      y: -100 - Math.random() * 400, // fall phase에서 burst 컨페티도 중앙 컨페티와 동일한 위치에서 떨어지게 함
      vx: Math.sin(i) * 0.3 + (Math.random() - 0.5) * 0.7,
      vy: 0.11 + Math.random() * 0.13, // 더 천천히 떨어지게
      gravity: 0.004 + Math.random() * 0.007, // 더 천천히 떨어지게
      swayPhase: Math.random() * Math.PI * 2,
      swayAmp: 0.7 + Math.random() * 1.2
    }));
  }

  // fall phase에서 화면 중앙 confetti도 사이드처럼 화면 밖 위쪽(y < -200)에서부터 자연스럽게 내려오게 생성
  function createCenterFallConfetti(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: W * 0.35 + Math.random() * W * 0.3, // 중앙 30% 영역
        y: -100 - Math.random() * 400, // 중앙 confetti도 더 낮은 곳에서 시작
        w: 6 + Math.random() * 14,
        h: 2 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 1.2,
        vy: 0.11 + Math.random() * 0.13, // 더 천천히 떨어지게
        gravity: 0.004 + Math.random() * 0.007, // 더 천천히 떨어지게
        rotate: Math.random() * Math.PI * 2,
        rotateSpeed: (Math.random() - 0.5) * 0.1,
        alpha: 1,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.7 + Math.random() * 1.2
      });
    }
    return arr;
  }
  confetti = createBurstConfetti();

  function drawConfetti() {
    ctx.clearRect(0, 0, W, H);
    confetti.forEach(c => {
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotate);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w/2, -c.h/2, c.w, c.h);
      ctx.restore();
    });
  }

  // burst phase가 끝나면 fall phase를 약간 딜레이 후 시작
  let burstEnd = false;
  let fallStartTimeout = null;
  function updateConfetti() {
    if (phase === 'burst') {
      confetti.forEach(c => {
        // burst phase에서는 vy가 0을 넘더라도 fall 속도로 전환하지 않음
        // 오직 burst 속도와 중력만 적용
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.rotate += c.rotateSpeed;
      });
      // burst phase가 끝났는지 체크: 모든 confetti가 화면 위(y < -200)로 나가면 다음 phase로
      if (!burstEnd && confetti.every(c => c.y < -200)) {
        burstEnd = true;
        // burst phase가 끝나면 confetti의 위치/회전/투명도 등은 그대로 두고 속도만 fall용으로 변환
        const burstConfettiSnapshot = confetti.map(c => ({...c}));
        fallStartTimeout = setTimeout(() => {
          phase = 'fall';
          // burst에서 변환된 confetti + 중앙 위쪽에서 추가 생성된 confetti를 합침
          const centerCount = Math.floor(confettiCount * 0.5); // 전체의 50%만큼 추가로 더 많이 생성
          confetti = convertBurstToFallConfetti(burstConfettiSnapshot).concat(createCenterFallConfetti(centerCount));
        }, 150); // 0.15초 후 fall phase 시작(간격을 더 짧게)
      }
    } else if (phase === 'fall') {
      confetti.forEach(c => {
        // 자연스러운 좌우 흔들림
        c.x += c.vx + Math.sin(Date.now() / 400 + c.swayPhase) * c.swayAmp * 0.2;
        c.y += c.vy;
        c.vy += c.gravity;
        c.rotate += c.rotateSpeed;
        if (c.y > H + 20) {
          c.alpha -= 0.02; // 더 천천히 사라지게
        }
      });
    }
  }

  function loop() {
    drawConfetti();
    updateConfetti();
    requestAnimationFrame(loop);
  }
  loop();

  setTimeout(() => {
    canvas.remove();
  }, 20000); // 애니메이션 유지 시간 10초로 증가
}

// 최종 합격자 섹션이 보일 때 막대 애니메이션 트리거
function setupResultPassBarAnimation() {
  const passSection = document.getElementById('result-pass-section');
  if (!passSection) return;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (passSection.style.display !== 'none') {
        animateResultPassBars();
      }
    });
  });
  observer.observe(passSection, { attributes: true, attributeFilter: ['style'] });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSnakeBorderInputFocus();
  setupResultPassBarAnimation();
});
