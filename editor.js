/* =========================================================
   문구 편집 모드
   ---------------------------------------------------------
   claude.ai 미리보기에서만 "문구 편집" 버튼이 나타납니다.
   고친 문구는 copy.json 에 저장되고, 페이지를 열 때 덮어씌워집니다.
   (copy.json 이 없으면 index.html 의 원래 문구 그대로)
   ========================================================= */
(() => {
  'use strict';

  const COPY_URL = 'copy.json';
  const DRAFT_KEY = 'autumn-meetup:copy-draft';

  // 편집 가능한 문구 (글자와 줄바꿈만 있는 요소)
  const SELECTORS = [
    '.gd-slogan', '.gd-org', '.gd-head dd', '.gd-p > span:last-child', '.gd-items dd',
    '.gd-attach li', '.gd-recipients dd', '.gd-foot dd',
    '.memo',
    '.doc-no', '.hero-title', '.hero-lead', '.hero-meta .v', '.hero-note',
    '.board-label', '.dday-label', '.facts dd', '.calendar-title',
    '.eyebrow', '.section-head h2', '.section-sub', '.section-foot',
    '.person-info dd', '.person-note',
    '.form-pledge', '.field-help', '.done-sub',
    '.footer-inner p',
  ];

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const textOnly = (el) => [...el.children].every((c) => c.tagName === 'BR');
  const getText = (el) => {
    let s = '';
    el.childNodes.forEach((n) => { s += n.nodeName === 'BR' ? '\n' : n.textContent; });
    return s.replace(/ /g, ' ');
  };
  const setText = (el, s) => {
    el.textContent = '';
    String(s).split('\n').forEach((line, i) => {
      if (i) el.appendChild(document.createElement('br'));
      el.appendChild(document.createTextNode(line));
    });
  };

  // 키 붙이기 + 원래 문구 기억
  const fields = new Map(); // key -> { el, original }
  SELECTORS.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!textOnly(el)) return;
      const key = `${sel}#${i}`;
      el.dataset.copyKey = key;
      fields.set(key, { el, original: getText(el) });
    });
  });

  let saved = {};
  const apply = (copy) => {
    Object.entries(copy || {}).forEach(([k, v]) => {
      const f = fields.get(k);
      if (f && typeof v === 'string') setText(f.el, v);
    });
  };

  fetch(COPY_URL, { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}))
    .then((copy) => {
      saved = copy && typeof copy === 'object' ? copy : {};
      apply(saved);
      let draft = null;
      try { draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { /* 무시 */ }
      if (draft) apply(draft);
    });

  // 편집 버튼은 claude.ai 에서 저장이 가능한 경우에만
  if (!window.claude || typeof window.claude.use !== 'function') return;
  window.claude.use('artifact').then((artifact) => {
    if (!artifact) return;
    buildUi(artifact);
  });

  function buildUi(artifact) {
    const bar = document.createElement('div');
    bar.className = 'editbar';
    bar.innerHTML = `
      <button type="button" class="editbar-toggle" data-act="toggle">✎ 문구 편집</button>
      <div class="editbar-tools" hidden>
        <button type="button" data-act="intro">결재판 보기</button>
        <button type="button" data-act="cancel">취소</button>
        <button type="button" class="is-primary" data-act="save">저장</button>
      </div>
      <p class="editbar-msg" role="status" aria-live="polite"></p>`;
    document.body.appendChild(bar);

    const tools = $('.editbar-tools', bar);
    const toggle = $('.editbar-toggle', bar);
    const msg = $('.editbar-msg', bar);
    const introBtn = $('[data-act="intro"]', bar);
    let editing = false;
    let introShown = false;

    const say = (t) => { msg.textContent = t; };

    bar.addEventListener('click', async (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'toggle') setEditing(true);
      if (act === 'cancel') { apply(saved); revertUnsaved(); setEditing(false); say(''); }
      if (act === 'intro') toggleIntro();
      if (act === 'save') await save();
    });

    // 편집 중에는 링크·버튼이 동작하지 않게
    document.addEventListener('click', (e) => {
      if (editing && e.target.closest('[data-copy-key]')) e.preventDefault();
    }, true);
    // 붙여넣기는 글자만
    document.addEventListener('paste', (e) => {
      if (!editing || !e.target.closest('[data-copy-key]')) return;
      e.preventDefault();
      document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text'));
    });

    function setEditing(on) {
      editing = on;
      document.documentElement.classList.toggle('is-editing', on);
      toggle.hidden = on;
      tools.hidden = !on;
      fields.forEach(({ el }) => {
        if (on) {
          el.setAttribute('contenteditable', 'plaintext-only');
          if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
        } else {
          el.removeAttribute('contenteditable');
        }
      });
      if (on) say('바꾸고 싶은 문구를 눌러 고친 뒤 [저장]을 눌러 주세요.');
      if (!on && introShown) toggleIntro();
    }

    function revertUnsaved() {
      fields.forEach((f, k) => setText(f.el, k in saved ? saved[k] : f.original));
      try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) { /* 무시 */ }
    }

    function collect() {
      const out = {};
      fields.forEach((f, k) => {
        const now = getText(f.el).replace(/\s+$/, '');
        if (now !== f.original) out[k] = now;
      });
      return out;
    }

    async function save() {
      const copy = collect();
      const btns = tools.querySelectorAll('button');
      btns.forEach((b) => { b.disabled = true; });
      say('저장하는 중…');
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(copy)); } catch (e) { /* 무시 */ }
      try {
        await artifact.publish({
          [COPY_URL]: { content: JSON.stringify(copy, null, 2) + '\n', contentType: 'application/json' },
        });
        saved = copy;
        try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) { /* 무시 */ }
        setEditing(false);
        say(`저장했습니다 (고친 문구 ${Object.keys(copy).length}개).`);
        setTimeout(() => say(''), 4000);
      } catch (err) {
        const code = err && err.code;
        if (code === 'conflict') say('다른 곳에서 먼저 저장되어 새로고침합니다. 고친 내용은 유지됩니다.');
        else if (code === 'not_writer' || code === 'not_granted' || code === 'capability_disabled' || code === 'not_declared') {
          say('이 화면에서는 저장할 수 없어요 (보기 전용).');
          try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) { /* 무시 */ }
        } else if (code === 'rate_limited') say('저장이 너무 잦아요. 잠시 후 다시 눌러 주세요.');
        else say('저장에 실패했어요. 잠시 후 다시 눌러 주세요.');
      } finally {
        btns.forEach((b) => { b.disabled = false; });
      }
    }

    // 결재판(인트로)을 펼친 상태로 보여 주기
    function toggleIntro() {
      const intro = $('#intro');
      if (!intro) return;
      introShown = !introShown;
      introBtn.textContent = introShown ? '본문 보기' : '결재판 보기';
      if (introShown) {
        document.documentElement.classList.remove('intro-skip');
        intro.hidden = false;
        intro.classList.remove('is-leaving');
        intro.classList.add('is-open', 'is-doc', 'is-ready', 'is-editing-intro');
        intro.querySelectorAll('[data-stamp], #stamp-big').forEach((s) => s.classList.add('is-stamped'));
        document.body.classList.add('intro-lock');
      } else {
        intro.hidden = true;
        intro.classList.remove('is-editing-intro');
        document.body.classList.remove('intro-lock');
      }
    }
  }
})();
