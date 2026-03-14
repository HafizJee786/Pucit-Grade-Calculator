const GRADE_SCALE = [
  { min:85, max:100, letter:'A',  points:4.00, color:'#4ade80', bg:'rgba(74,222,128,0.15)',  border:'rgba(74,222,128,0.35)',  text:'Excellent',     tw:'text-green-400' },
  { min:80, max:84,  letter:'A-', points:3.70, color:'#86efac', bg:'rgba(134,239,172,0.12)', border:'rgba(134,239,172,0.3)',  text:'Very Good',     tw:'text-green-300' },
  { min:75, max:79,  letter:'B+', points:3.30, color:'#38bdf8', bg:'rgba(56,189,248,0.15)',  border:'rgba(56,189,248,0.35)',  text:'Good',          tw:'text-sky-400' },
  { min:70, max:74,  letter:'B',  points:3.00, color:'#7dd3fc', bg:'rgba(125,211,252,0.12)', border:'rgba(125,211,252,0.3)',  text:'Above Average', tw:'text-sky-300' },
  { min:65, max:69,  letter:'B-', points:2.70, color:'#67e8f9', bg:'rgba(103,232,249,0.12)', border:'rgba(103,232,249,0.3)',  text:'Average',       tw:'text-cyan-300' },
  { min:61, max:64,  letter:'C+', points:2.30, color:'#fbbf24', bg:'rgba(251,191,36,0.12)',  border:'rgba(251,191,36,0.3)',   text:'Satisfactory',  tw:'text-amber-400' },
  { min:58, max:60,  letter:'C',  points:2.00, color:'#fcd34d', bg:'rgba(252,211,77,0.10)',  border:'rgba(252,211,77,0.25)',  text:'Acceptable',    tw:'text-amber-300' },
  { min:55, max:57,  letter:'C-', points:1.70, color:'#fb923c', bg:'rgba(251,146,60,0.12)',  border:'rgba(251,146,60,0.3)',   text:'Below Average', tw:'text-orange-400' },
  { min:50, max:54,  letter:'D',  points:1.00, color:'#f87171', bg:'rgba(248,113,113,0.10)', border:'rgba(248,113,113,0.25)', text:'Passing',       tw:'text-red-400' },
  { min:0,  max:49,  letter:'F',  points:0.00, color:'#ef4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.35)',   text:'Fail',          tw:'text-red-500' },
];

let courseCount = 0;

function getGrade(marks) {
  const m = parseFloat(marks);
  if (isNaN(m) || m < 0 || m > 100) return null;
  return GRADE_SCALE.find(g => m >= g.min && m <= g.max) || GRADE_SCALE[GRADE_SCALE.length-1];
}

function addCourse(name='', credits=3, marks='') {
  courseCount++;
  const id = courseCount;
  const div = document.createElement('div');
  div.id = `course_${id}`;
  div.className = 'course-row grid grid-cols-12 gap-2 sm:gap-3 items-center p-3 rounded-2xl border border-white/8 glass-card';
  div.innerHTML = `
    <div class="col-span-12 sm:col-span-4">
      <input type="text" id="cname_${id}" placeholder="Course Name" value="${name}"
        class="dark-input w-full px-3 py-2 rounded-xl text-sm" />
    </div>
    <div class="col-span-4 sm:col-span-2">
      <select id="ccred_${id}" class="dark-input w-full px-3 py-2 rounded-xl text-sm cursor-pointer">
        ${[1,2,3,4,5].map(n=>`<option value="${n}" ${n==credits?'selected':''}>${n} hr${n>1?'s':''}</option>`).join('')}
      </select>
    </div>
    <div class="col-span-5 sm:col-span-3">
      <input type="number" id="cmarks_${id}" placeholder="0 – 100" min="0" max="100" step="0.1" value="${marks}"
        oninput="updateGrade(${id})"
        class="dark-input w-full px-3 py-2 rounded-xl text-sm" />
    </div>
    <div class="col-span-2 sm:col-span-2 flex justify-center">
      <div id="cbadge_${id}" class="grade-pill px-3 py-1.5 rounded-xl text-xs font-display font-bold text-center min-w-[44px]
        bg-white/5 border border-white/10 text-slate-500">—</div>
    </div>
    <div class="col-span-1 flex justify-center">
      <button onclick="removeCourse(${id})"
        class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600
        hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all text-lg leading-none">
        &times;
      </button>
    </div>
  `;
  document.getElementById('coursesList').appendChild(div);
  if (marks !== '') updateGrade(id);
  updateCourseCount();
}

function updateGrade(id) {
  const marks = document.getElementById(`cmarks_${id}`)?.value;
  const badge = document.getElementById(`cbadge_${id}`);
  if (!badge) return;
  const g = getGrade(marks);
  if (g) {
    badge.textContent = g.letter;
    badge.style.background = g.bg;
    badge.style.borderColor = g.border;
    badge.style.color = g.color;
  } else {
    badge.textContent = '—';
    badge.style.background = 'rgba(255,255,255,0.05)';
    badge.style.borderColor = 'rgba(255,255,255,0.1)';
    badge.style.color = '#64748b';
  }
}

function removeCourse(id) {
  document.getElementById(`course_${id}`)?.remove();
  updateCourseCount();
}

function updateCourseCount() {
  const n = document.querySelectorAll('.course-row').length;
  document.getElementById('courseCount').textContent = `${n} Course${n !== 1 ? 's' : ''}`;
}

function calculate() {
  const rows = document.querySelectorAll('.course-row');
  if (!rows.length) { alert('Please add at least one course.'); return; }

  let totalCredits = 0, totalQP = 0, anyInvalid = false;
  const courseData = [];

  rows.forEach(row => {
    const id = row.id.replace('course_', '');
    const name = document.getElementById(`cname_${id}`)?.value || 'Unnamed Course';
    const cr   = parseInt(document.getElementById(`ccred_${id}`)?.value || 3);
    const mk   = parseFloat(document.getElementById(`cmarks_${id}`)?.value);
    if (isNaN(mk) || mk < 0 || mk > 100) { anyInvalid = true; return; }
    const g = getGrade(mk);
    if (g) {
      totalCredits += cr;
      totalQP      += g.points * cr;
      courseData.push({ name, cr, mk, g });
    }
  });

  if (anyInvalid) { alert('Please enter valid marks (0–100) for all courses.'); return; }
  if (!totalCredits) { alert('No valid course data to calculate.'); return; }

  const sgpa = totalQP / totalCredits;

  document.getElementById('sgpaVal').textContent      = sgpa.toFixed(2);
  document.getElementById('totalCredits').textContent = totalCredits;
  document.getElementById('qualityPts').textContent   = totalQP.toFixed(2);

  const pct = ((sgpa / 4) * 100).toFixed(1);
  document.getElementById('gpaBar').style.width     = pct + '%';
  document.getElementById('gpaPercent').textContent = pct + '%';

  // Student name
  const sname = document.getElementById('studentName').value;
  const sroll = document.getElementById('rollNo').value;
  const nameEl = document.getElementById('resultStudentName');
  if (sname || sroll) {
    nameEl.textContent = [sname, sroll].filter(Boolean).join(' · ');
    nameEl.classList.remove('hidden');
  } else {
    nameEl.classList.add('hidden');
  }

  // Standing
  const banner = document.getElementById('standingBanner');
  if (sgpa >= 3.5) {
    banner.textContent = '★ Dean\'s Honor Roll';
    banner.className   = 'text-center py-2.5 rounded-2xl font-display font-bold text-sm tracking-wide bg-green-500/10 border border-green-500/20 text-green-400';
  } else if (sgpa >= 3.0) {
    banner.textContent = '✓ Good Academic Standing';
    banner.className   = 'text-center py-2.5 rounded-2xl font-display font-bold text-sm tracking-wide bg-sky-500/10 border border-sky-500/20 text-sky-400';
  } else if (sgpa >= 2.0) {
    banner.textContent = '■ Satisfactory Standing';
    banner.className   = 'text-center py-2.5 rounded-2xl font-display font-bold text-sm tracking-wide bg-amber-500/10 border border-amber-500/20 text-amber-400';
  } else {
    banner.textContent = '⚠ Academic Probation';
    banner.className   = 'text-center py-2.5 rounded-2xl font-display font-bold text-sm tracking-wide bg-red-500/10 border border-red-500/20 text-red-400';
  }

  // Course results
  const cr = document.getElementById('courseResults');
  cr.innerHTML = courseData.map(c => `
    <div class="flex items-center gap-3 p-3 rounded-2xl glass-card border border-white/6">
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-slate-200 truncate">${c.name}</div>
        <div class="text-xs text-slate-500">${c.cr} credit hrs &middot; ${c.mk}%</div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <div class="text-xs text-slate-500">${(c.g.points * c.cr).toFixed(2)} pts</div>
        <div class="grade-pill px-3 py-1 rounded-xl text-xs font-display font-bold"
          style="background:${c.g.bg};border:1px solid ${c.g.border};color:${c.g.color}">
          ${c.g.letter}
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('resultsSection').classList.remove('hidden');
  document.getElementById('resultsSection').scrollIntoView({ behavior:'smooth', block:'start' });
}

function resetAll() {
  document.getElementById('coursesList').innerHTML = '';
  document.getElementById('resultsSection').classList.add('hidden');
  document.getElementById('studentName').value = '';
  document.getElementById('rollNo').value = '';
  document.getElementById('program').value = '';
  document.getElementById('semester').value = '';
  courseCount = 0;
  addCourse('Programming Fundamentals', 3);
  addCourse('Calculus & Analytical Geometry', 3);
  addCourse('English Communication', 2);
}

// Build grade pills grid + table
(function() {
  const pillsGrid = document.getElementById('gradePillsGrid');
  const tb = document.getElementById('gradeTableBody');

  GRADE_SCALE.forEach((g, i) => {
    // Pill
    pillsGrid.innerHTML += `
      <div class="flex flex-col items-center gap-1 p-2 rounded-2xl border"
        style="background:${g.bg};border-color:${g.border}">
        <div class="font-display font-bold text-base" style="color:${g.color}">${g.letter}</div>
        <div class="text-xs font-semibold" style="color:${g.color}">${g.points.toFixed(2)}</div>
        <div class="text-xs text-slate-500">${g.min === 0 ? '<50' : g.min+'+'}</div>
      </div>`;

    // Table row
    const range = g.min === 0 ? 'Below 50' : `${g.min} – ${g.max}`;
    tb.innerHTML += `
      <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
        <td class="px-4 py-2.5 text-slate-400 text-sm">${range}</td>
        <td class="px-4 py-2.5 text-center">
          <span class="inline-block px-3 py-1 rounded-xl text-xs font-display font-bold"
            style="background:${g.bg};border:1px solid ${g.border};color:${g.color}">
            ${g.letter}
          </span>
        </td>
        <td class="px-4 py-2.5 text-center text-white font-semibold text-sm">${g.points.toFixed(2)}</td>
        <td class="px-4 py-2.5 text-right text-slate-500 text-xs">${g.text}</td>
      </tr>`;
  });

  // W and I rows
  ['Withdrawal — W', 'Incomplete — I'].forEach(row => {
    const [label, letter] = row.split(' — ');
    tb.innerHTML += `
      <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">
        <td class="px-4 py-2.5 text-slate-500 text-sm">${label}</td>
        <td class="px-4 py-2.5 text-center">
          <span class="inline-block px-3 py-1 rounded-xl text-xs font-display font-bold
            bg-white/5 border border-white/10 text-slate-400">${letter}</span>
        </td>
        <td class="px-4 py-2.5 text-center text-slate-600 text-sm">—</td>
        <td class="px-4 py-2.5 text-right text-slate-600 text-xs">${label}</td>
      </tr>`;
  });
})();

// Initialize with default courses
addCourse('Programming Fundamentals', 3);
addCourse('Calculus & Analytical Geometry', 3);
addCourse('English Communication', 2);
