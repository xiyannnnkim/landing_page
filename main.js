(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTRO_KEY = 'autumn-meetup:intro-seen';
  const MEETUP_DATE = new Date(2026, 10, 11); // 11/11(수) — 후보 첫날
  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  const restaurants = Array.isArray(window.RESTAURANTS) ? window.RESTAURANTS : [];

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  initIntro();
  initDday();
  initCalendar();
  initLeaves();
  renderRestaurants();
  initForm();

  /* ---------------- 결재판 인트로 ---------------- */
  function initIntro() {
    const intro = $('#intro');
    if (!intro) return;
    if (root.classList.contains('intro-skip')) { intro.hidden = true; return; }

    const cover = $('#folder-cover');
    const enter = $('#intro-enter');
    const stamps = $$('[data-stamp]', intro);
    const bigStamp = $('#stamp-big');
    let opened = false;
    let left = false;

    document.body.classList.add('intro-lock');
    intro.tabIndex = -1;
    intro.focus({ preventScroll: true });

    cover.addEventListener('click', open);
    enter.addEventListener('click', leave);
    $('[data-intro-skip]', intro).addEventListener('click', leave);
    document.addEventListener('keydown', onKey);

    function onKey(e) {
      if (e.key === 'Escape') leave();
    }

    async function open() {
      if (opened) return;
      opened = true;
      intro.classList.add('is-open');
      cover.tabIndex = -1;
      cover.setAttribute('aria-hidden', 'true');

      await wait(1100);
      intro.classList.add('is-doc');
      await wait(450);
      for (const s of stamps) {
        if (left) return;
        s.classList.add('is-stamped');
        thump();
        await wait(380);
      }
      await wait(150);
      bigStamp.classList.add('is-stamped');
      thump();
      await wait(450);
      intro.classList.add('is-ready');
      enter.focus({ preventScroll: true });
    }

    function thump() {
      if (reduceMotion) return;
      intro.classList.remove('is-thump');
      void intro.offsetWidth; // 애니메이션 재시작
      intro.classList.add('is-thump');
    }

    function leave() {
      if (left) return;
      left = true;
      try { sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* 저장 불가해도 무시 */ }
      document.removeEventListener('keydown', onKey);
      intro.classList.add('is-leaving');
      setTimeout(() => {
        intro.hidden = true;
        document.body.classList.remove('intro-lock');
        $('#top').focus({ preventScroll: true });
      }, reduceMotion ? 0 : 700);
    }
  }

  /* ---------------- D-day ---------------- */
  function initDday() {
    const el = $('#dday');
    if (!el) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((MEETUP_DATE - today) / 86400000);
    if (diff > 0) el.textContent = `D-${diff}`;
    else if (diff === 0) el.textContent = 'D-DAY';
    else if (diff >= -2) el.textContent = '모임 주간';
    else el.textContent = '종료';
  }

  /* ---------------- 11월 달력 ---------------- */
  function initCalendar() {
    const el = $('#calendar');
    if (!el) return;
    const candidates = [11, 12, 13];
    const blocked = [4, 5, 6, 18];
    const trip = [16, 17, 18, 19, 20];
    const firstDow = new Date(2026, 10, 1).getDay();
    const lastDay = new Date(2026, 11, 0).getDate();

    let html = ['일', '월', '화', '수', '목', '금', '토']
      .map((d, i) => `<span class="cal-dow${i === 0 ? ' is-sun' : ''}${i === 6 ? ' is-sat' : ''}" aria-hidden="true">${d}</span>`)
      .join('');
    for (let i = 0; i < firstDow; i++) html += '<span aria-hidden="true"></span>';
    for (let d = 1; d <= lastDay; d++) {
      const dow = (firstDow + d - 1) % 7;
      const cls = ['cal-day'];
      if (candidates.includes(d)) cls.push('is-candidate');
      else if (blocked.includes(d)) cls.push('is-blocked');
      if (trip.includes(d)) cls.push('is-trip');
      if (![3, 4, 5].includes(dow)) cls.push('is-off'); // 수·목·금 외 요일은 대상 외
      if (dow === 0) cls.push('is-sun');
      if (dow === 6) cls.push('is-sat');
      html += `<span class="${cls.join(' ')}" aria-hidden="true">${d}</span>`;
    }
    el.innerHTML = html;
  }

  /* ---------------- 떨어지는 낙엽 ---------------- */
  function initLeaves() {
    const box = $('.hero-leaves');
    if (!box || reduceMotion) return;
    const shapes = ['leaf-maple', 'leaf-ginkgo', 'leaf-oval'];
    const colors = ['#B4532F', '#C99A3B', '#8E3B26', '#B7773A'];
    const count = window.innerWidth < 640 ? 5 : 9;
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('span');
      const size = 14 + Math.random() * 18;
      leaf.className = 'falling-leaf';
      leaf.style.cssText = [
        `left:${Math.random() * 100}%`,
        `width:${size}px`, `height:${size}px`,
        `color:${pick(colors)}`,
        `animation-duration:${16 + Math.random() * 12}s`,
        `animation-delay:${-Math.random() * 20}s`,
        `--drift:${Math.round((Math.random() * 2 - 1) * 140)}px`,
        `--spin:${Math.round((Math.random() * 2 - 1) * 540)}deg`,
      ].join(';');
      leaf.innerHTML = `<svg viewBox="0 0 24 24"><use href="#${pick(shapes)}"/></svg>`;
      box.appendChild(leaf);
    }
  }

  /* ---------------- 후보 식당 카드 ---------------- */
  function renderRestaurants() {
    const grid = $('#restaurant-grid');
    if (!grid) return;
    if (!restaurants.length) {
      grid.innerHTML = '<p class="empty">후보 식당을 조사하고 있습니다.</p>';
      return;
    }
    grid.innerHTML = restaurants.map(cardHtml).join('');
  }

  function cardHtml(r, i) {
    const pending = r.status !== 'ready';
    const tbd = '<span class="tbd">조사 중…</span>';
    const location = r.address
      ? `${esc(r.address)}${r.walkMinutes ? ` <span class="walk">· 도보 약 ${esc(r.walkMinutes)}분</span>` : ''}`
      : tbd;
    const menus = r.menus && r.menus.length
      ? `<ul class="r-menu">${r.menus.map((m) => `<li><span>${esc(m.name)}</span>${m.price ? `<span class="price">${esc(m.price)}</span>` : ''}</li>`).join('')}</ul>`
      : tbd;
    const hasMap = /^https:\/\//.test(r.naverUrl || '');
    const mapUrl = hasMap
      ? r.naverUrl
      : `https://map.naver.com/p/search/${encodeURIComponent(`소공동 ${r.category || '맛집'}`)}`;
    const mapLabel = hasMap ? '네이버 지도에서 보기' : `근처 ${r.category || '맛집'} 둘러보기`;
    const photo = r.photo
      ? `<img src="${esc(r.photo)}" alt="${esc(r.name)} 대표 사진" loading="lazy">`
      : '<svg class="r-photo-leaf" viewBox="0 0 24 24" aria-hidden="true"><use href="#leaf-maple"/></svg><span class="r-photo-text">사진 준비 중</span>';

    return `
      <article class="r-card${pending ? ' is-pending' : ''}">
        <div class="r-top"><span>붙임 1-${String.fromCharCode(65 + i)}</span><span class="r-tab">${esc(r.category || '기타')}</span></div>
        ${pending ? '<span class="r-stamp">검토 중</span>' : ''}
          <div class="r-photo">${photo}</div>
          <h3 class="r-name">${esc(r.name)}</h3>
          ${r.description ? `<p class="r-desc">${esc(r.description)}</p>` : ''}
          <dl class="r-info">
            <div><dt>위치</dt><dd>${location}</dd></div>
            <div><dt>영업시간</dt><dd>${r.hours ? esc(r.hours) : tbd}</dd></div>
            <div><dt>대표메뉴</dt><dd>${menus}</dd></div>
            ${r.note ? `<div><dt>참고</dt><dd>${esc(r.note)}</dd></div>` : ''}
          </dl>
          <a class="btn btn-map" href="${esc(mapUrl)}" target="_blank" rel="noopener">
            ${esc(mapLabel)} <span aria-hidden="true">↗</span><span class="sr-only">(새 창)</span>
          </a>
      </article>`;
  }

  /* ---------------- 회신서 ---------------- */
  function initForm() {
    const form = $('#reply-form');
    if (!form) return;
    const done = $('#reply-done');
    const status = $('#form-status');
    const submitBtn = $('#submit-btn');

    // 희망 식당 선택지
    const options = restaurants.map((r) => ({
      value: r.name,
      label: `${r.name}${r.category ? ` · ${r.category}` : ''}${r.status !== 'ready' ? ' (조사 중)' : ''}`,
    }));
    options.push({ value: '어디든 좋아요', label: '어디든 좋아요 (위임)' }, { value: '__other', label: '기타 추천' });
    $('#restaurant-options').innerHTML = options
      .map((o) => `<label class="chip"><input type="radio" name="restaurant" value="${esc(o.value)}"><span>${esc(o.label)}</span></label>`)
      .join('');

    // '기타' 선택 시 직접 입력란 표시
    $$('[data-other-for]', form).forEach((box) => {
      const group = box.dataset.otherFor;
      form.addEventListener('change', (e) => {
        if (e.target.name !== group) return;
        const show = e.target.value === '__other';
        box.hidden = !show;
        if (show) $('input', box).focus();
      });
    });

    // 가능한 날짜 → 가장 희망하는 날짜 연동
    const dateBoxes = $$('input[name="dates"]', form);
    const bestRadios = $$('input[name="best_date"]', form);
    const syncBest = () => {
      const chosen = dateBoxes.filter((b) => b.checked).map((b) => b.value);
      bestRadios.forEach((r) => {
        if (r.value === '상관없음') return;
        r.disabled = !chosen.includes(r.value);
        if (r.disabled && r.checked) {
          r.checked = false;
          bestRadios[0].checked = true;
        }
      });
    };
    dateBoxes.forEach((b) => b.addEventListener('change', syncBest));
    $('#all-dates').addEventListener('click', () => {
      dateBoxes.forEach((b) => { b.checked = true; });
      syncBest();
      clearError('dates');
    });

    // 입력하면 해당 오류 지우기
    form.addEventListener('input', (e) => {
      const field = e.target.closest('[data-field]');
      if (field) clearError(field.dataset.field);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.classList.remove('is-error');

      const data = collect();
      const errors = validate(data);
      ['name', 'dates', 'restaurant'].forEach(clearError);
      const keys = Object.keys(errors);
      if (keys.length) {
        keys.forEach((k) => showError(k, errors[k]));
        const first = $(`[data-field="${keys[0]}"]`, form);
        const target = $('.other-input:not([hidden]) input', first) || $('input', first);
        target.focus();
        status.textContent = '빠진 항목을 확인해 주세요.';
        status.classList.add('is-error');
        return;
      }

      // 스팸 봇이 숨김 칸을 채운 경우 조용히 종료
      if (form.elements.botcheck.checked) { showDone(data); return; }

      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      status.textContent = '제출하는 중…';
      try {
        const res = await fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload(data)),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
        showDone(data);
      } catch (err) {
        console.error('[회신서] 전송 실패:', err);
        status.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주시고, 계속 안 되면 메일로 회신 부탁드립니다.';
        status.classList.add('is-error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
      }
    });

    $('#reply-again').addEventListener('click', () => {
      done.hidden = true;
      form.hidden = false;
      status.textContent = '';
      $('input[name="name"]', form).focus();
    });

    function collect() {
      const val = (name) => (form.querySelector(`input[name="${name}"]:checked`) || {}).value || '';
      const restChoice = val('restaurant');
      return {
        name: val('name'),
        dates: dateBoxes.filter((b) => b.checked).map((b) => b.value),
        bestDate: val('best_date') || '상관없음',
        restaurantChoice: restChoice,
        restaurant: restChoice === '__other' ? form.elements.restaurant_other.value.trim() : restChoice,
        grievance: form.elements.grievance.value.trim(),
        message: form.elements.message.value.trim(),
      };
    }

    function validate(d) {
      const errors = {};
      if (!d.name) errors.name = '성함을 선택해 주세요.';
      if (!d.dates.length) errors.dates = '가능한 날짜를 하나 이상 선택해 주세요.';
      if (!d.restaurantChoice) errors.restaurant = '희망 식당을 선택해 주세요.';
      else if (!d.restaurant) errors.restaurant = '추천 식당을 입력해 주세요.';
      return errors;
    }

    function payload(d) {
      const when = d.bestDate !== '상관없음' ? d.bestDate : d.dates.join('·');
      return {
        access_key: form.elements.access_key.value,
        subject: `[모임회신] ${d.name} — ${when}, ${d.restaurant}`,
        from_name: '가을모임 회신서',
        '이름': d.name,
        '가능한 날짜': d.dates.join(', '),
        '가장 희망하는 날짜': d.bestDate,
        '희망 식당': d.restaurant,
        '미리 보는 고충': d.grievance || '-',
        '하고 싶은 말': d.message || '-',
        '제출 시각': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      };
    }

    function showDone(d) {
      const rows = [
        ['성함', d.name],
        ['가능한 날짜', d.dates.join(', ')],
        ['가장 희망', d.bestDate],
        ['희망 식당', d.restaurant],
      ];
      if (d.grievance) rows.push(['미리 보는 고충', d.grievance]);
      $('#done-summary').innerHTML = rows
        .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
        .join('');
      $('#done-sign').textContent = `${d.name.replace(/\s*(대리|사원|과장)$/, '')} 배상`;
      form.hidden = true;
      done.hidden = false;
      done.focus();
      done.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    function showError(field, msg) {
      const fs = $(`[data-field="${field}"]`, form);
      const el = $(`#err-${field}`, form);
      if (!fs || !el) return;
      fs.classList.add('has-error');
      el.textContent = msg;
      el.hidden = false;
    }

    function clearError(field) {
      const fs = $(`[data-field="${field}"]`, form);
      const el = $(`#err-${field}`, form);
      if (fs) fs.classList.remove('has-error');
      if (el) { el.hidden = true; el.textContent = ''; }
    }
  }
})();
