// ===== 동아리 신청 기간 설정 =====
const isRecruitmentPeriod = false; // true: 모집 기간, false: 모집 마감

// ===== 홈 스크롤 페이드 설정 =====
const HOME_SCROLL_START = 80;   // px: 이 높이부터 효과 시작
const HOME_SCROLL_END = 320;    // px: 이 높이에 도달하면 완전 페이드아웃
// 홈 섹션 스크롤 페이드 효과의 활성 상태를 추적하는 플래그입니다.
// true일 때만 스크롤 리스너를 유지하며, 중복 등록을 방지합니다.
// 다른 탭으로 전환되면 false로 바꿔 리스너를 제거하고 스타일을 초기화합니다.
let homeScrollEnabled = false;

// Lenis 싱글톤 참조 (중복 초기화 방지)
let __lenisInstance = null;
let __lenisTickerBound = false;

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
  // 항상 최상단으로 이동하여 탭 전환 시 스크롤을 초기화
  const y = 0;
  if (__lenisInstance && typeof __lenisInstance.scrollTo === 'function') {
    __lenisInstance.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo(0, y);
  }
}

function applyHomeScrollEffects() {
  const homeActive = document.getElementById('home-section').classList.contains('active-home');
  if (!homeActive) return;

  const y = window.scrollY || window.pageYOffset || 0;
  const range = HOME_SCROLL_END - HOME_SCROLL_START;
  const t = Math.min(Math.max((y - HOME_SCROLL_START) / range, 0), 1);
  const translateY = -t * 50; // 최대 50px 위로 이동
  const opacity = 1 - t;      // 서서히 0으로 감소 

  const logo = document.querySelector('.center-logo');
  const subtitle = document.querySelector('.subtitle');
  if (logo) {
    logo.style.transform = `translateY(${translateY}px)`;
    logo.style.opacity = opacity;
  }
  if (subtitle) {
    subtitle.style.transform = `translateY(${translateY}px)`;
    subtitle.style.opacity = opacity;
  }
}

function resetHomeScrollEffects() {
  const logo = document.querySelector('.center-logo');
  const subtitle = document.querySelector('.subtitle');
  if (logo) {
    logo.style.transform = '';
    logo.style.opacity = '';
  }
  if (subtitle) {
    subtitle.style.transform = '';
    subtitle.style.opacity = '';
  }
}

function enableHomeScroll() {
  // 홈 탭 스크롤 애니메이션 활성화
  if (homeScrollEnabled) return;
  homeScrollEnabled = true;
  window.addEventListener('scroll', applyHomeScrollEffects);
  // 초기 상태 적용
  applyHomeScrollEffects();
}

function disableHomeScroll() {
  if (!homeScrollEnabled) return;
  homeScrollEnabled = false;
  window.removeEventListener('scroll', applyHomeScrollEffects);
  resetHomeScrollEffects();
}

// 홈 섹션 로고/서브타이틀 초기 등장 애니메이션
function initHomeIntroAnimation() {
  if (typeof gsap === 'undefined') return;
  const home = document.getElementById('home-section');
  if (!home || !home.classList.contains('active-home')) return;

  const logo = home.querySelector('.center-logo');
  const subtitle = home.querySelector('.subtitle');
  if (!logo && !subtitle) return;

  // 초기 상태를 살짝 아래/투명으로 설정 후 부드럽게 등장
  gsap.set([logo, subtitle].filter(Boolean), { opacity: 0, y: 20 });

  const tl = gsap.timeline();
  if (logo) {
    tl.to(logo, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out'
    }, 0);
  }
  if (subtitle) {
    tl.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power2.out'
    }, '-=0.6');
  }
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
    ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: 'bottom top', // 섹션의 하단이 뷰포트 상단에 닿을 때 pin 해제
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // 경계에 부드럽게 스냅하여 체감 속도 완화
      snap: { snapTo: 1, duration: 0.6, ease: 'power1.out' },
    });

    // 다음 섹션 참조 (없으면 마지막 섹션)
    const next = sections[i + 1];

    // 1~4번째 섹션: pin 해제 직후 위로 올라가며 페이드 아웃, 다음 섹션 pin 시작까지 지속
    if (i < 4) {
      gsap.to(sec, {
        opacity: 0,
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'bottom top', // pin 해제와 동시에 시작
          endTrigger: next,
          end: 'top top',      // 다음 섹션 pin 시작 시점까지 페이드 아웃 지속
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    // 다음 섹션(2~5): 화면에 들어오는 순간부터 pin 시작까지 페이드 인
    if (next && i < 4) {
      gsap.fromTo(next, { opacity: 0 }, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom', // 다음 섹션 상단이 뷰포트 하단에 닿으면 시작
          end: 'top top',      // 다음 섹션 상단이 뷰포트 상단에 닿아 pin 시작될 때 종료
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
    setTimeout(() => {
      const activeClass = `active-${sectionName}`;
      targetSection.classList.add(activeClass);
      // 홈 전환 시 스크롤 효과 활성화, 그 외는 비활성화
      if (sectionName === 'home') {
        document.body.classList.add('home-mode');
        // QnA 모드 해제 및 인라인 높이 초기화
        document.body.classList.remove('qna-mode');
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
        // QnA 탭은 자체 스크롤 여유 제공 (한 화면 높이 추가)
        if (sectionName === 'qna') {
          document.body.classList.add('qna-mode');
          document.body.style.minHeight = '200vh';
          // QnA 아코디언 초기화
          if (typeof initQnaAccordion === 'function') {
            initQnaAccordion();
          }
        } else {
          document.body.classList.remove('qna-mode');
          document.body.style.minHeight = '';
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

      // 1단계: display 변경 (하지만 opacity는 0)
      document.querySelector('.top-left-logo').style.display = 'block';
      document.querySelector('.top-right-nav').style.display = 'flex';
      document.getElementById('home-section').style.display = 'flex';
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

        // 버튼 표시
        if (isRecruitmentPeriod) {
          setTimeout(() => {
            document.getElementById('recruitButtons').style.display = 'flex';
          }, 1500);
        }

        // 홈 활성화 상태이므로 스크롤 효과를 켭니다
        enableHomeScroll();
        // 부드러운 스크롤 초기화
        initSmoothScrolling();
        // 섹션 핀 초기화 (로더 완료 후 표시된 상태에서)
        initSectionPins();
        // 4번째 섹션 카드 슬라이드 인 초기화
        initInformCards();
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
