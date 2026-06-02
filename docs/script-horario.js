// ==================================================================
// Estado
// ==================================================================
var codes_selected = JSON.parse(localStorage.getItem('selectedCourses') || '[]');
var sections_selected_courses = JSON.parse(localStorage.getItem('sectionsSelected') || '{}');

const DAY_COL = { LU: 2, MA: 3, MI: 4, JU: 5, VI: 6, SA: 7 };
const TIMES   = ['7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm'];
const DAYS    = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

// ==================================================================
// Funciones
// ==================================================================
// color por código de curso 
function colorKeyFor(code) {
    const p = code.slice(0, 2).toLowerCase();
    if (p[0] === 'b')          return 'basic'; // todos los b* son básicos
    if (p === 'cm')            return 'mat';
    if (p === 'cf')            return 'fis';
    if (p === 'cq' || p === 'ch') return 'qui';
    if (p === 'cc' || p === 'cl') return 'com';
    if (p === 'if')            return 'inf';
    return 'basic';            // fallback
}
// -------------------------------------------------------------------
// construir grid del calendario
function buildGrid() {
    const tt = document.getElementById('timetable');
    let html = '<div class="th corner">Hora</div>';
    DAYS.forEach(d => html += `<div class="th">${d}</div>`);

    for (let r = 0; r < TIMES.length; r++) {
        html += `<div class="time-lbl" style="grid-column:1;grid-row:${r+2}">${TIMES[r]}</div>`;
        for (let c = 0; c < 6; c++) {
            html += `<div class="cell ${r%2?'alt':''}" style="grid-column:${c+2};grid-row:${r+2}"></div>`;
        }
    }
    tt.innerHTML = html;
}
// -------------------------------------------------------------------
// pintar bloques de cursos
function placeBlocks() {
    const tt = document.getElementById('timetable');
    tt.querySelectorAll('.block').forEach(b => b.remove());

    const blocks = [];
    Object.keys(sections_selected_courses).forEach(function(code) {
        const sec = sections_selected_courses[code];
        const horarios = DATA[code]['seccion'][sec]['horario'];
        if (!horarios || horarios.includes('n.d.')) return;

        const aulas = DATA[code]['seccion'][sec]['aula'] || [];
        const key   = colorKeyFor(code);
        const name  = DATA[code]['curso'];

        horarios.forEach(function(h, i) {
            const parts = h.split(' ');
            const day = parts[0];
            const range = parts[1].split('-');
            const start = parseInt(range[0]);
            const end   = parseInt(range[1]);
            const col   = DAY_COL[day];
            if (!col) return;

            blocks.push({
                code, sec, name, key,
                day, col,
                start, end,
                rowStart: start - 7 + 2,
                rowEnd:   end   - 7 + 2,
                room: aulas[i] || ''
            });
        });
    });

    assignLanes(blocks);
    // contar cruces
    const conflictCount = countConflictGroups(blocks);

    // pintar
    blocks.forEach(function(b) {
        const el = document.createElement('div');
        el.className = 'block';
        if (b.total > 1) el.classList.add('lane', 'conflict');
        el.style.setProperty('--bd',    `var(--c-${b.key})`);
        el.style.setProperty('--bg-c',  `var(--c-${b.key}-bg)`);
        el.style.setProperty('--lane',  b.lane);
        el.style.setProperty('--total', b.total);
        el.style.gridColumn = b.col;
        el.style.gridRow    = `${b.rowStart} / ${b.rowEnd}`;
        el.innerHTML = `
            <div class="b-name">${b.name}</div>
            <div class="b-row">
                <span class="b-sec">Sec ${b.sec}</span>
                <span class="b-room">${b.room}</span>
            </div>`;
        tt.appendChild(el);
    });

    updateConflictChip(conflictCount);
}

// asigna lane (0, 1, 2...) y total por bloque, agrupado por día
function assignLanes(blocks) {
    const byDay = {};
    blocks.forEach(b => {
        if (!byDay[b.day]) byDay[b.day] = [];
        byDay[b.day].push(b);
    });

    Object.values(byDay).forEach(group => {
        group.sort((a, b) => a.start - b.start);

        // greedy: lane mas bajo que este libre
        // lanesEnd[i] = end del último bloque en lane i
        const lanesEnd = []; 
        group.forEach(b => {
            let lane = 0;
            while (lane < lanesEnd.length && lanesEnd[lane] > b.start) lane++;
            b.lane = lane;
            lanesEnd[lane] = b.end;
        });

        // total por bloque = max lane entre bloques que se solapan con el 
        group.forEach(b => {
            let maxLane = b.lane;
            group.forEach(o => {
                if (o === b) return;
                if (o.start < b.end && b.start < o.end) {
                    maxLane = Math.max(maxLane, o.lane);
                }
            });
            b.total = maxLane + 1;
        });
    });
}

// cuenta cuantos pares (día, rango) tienen al menos 2 cursos solapados
function countConflictGroups(blocks) {
    const byDay = {};
    blocks.forEach(b => {
        if (!byDay[b.day]) byDay[b.day] = [];
        byDay[b.day].push(b);
    });

    let count = 0;
    Object.values(byDay).forEach(group => {
        // detectar componentes conectados de solape
        const visited = new Set();
        group.forEach(b => {
            if (visited.has(b)) return;
            // BFS de bloques que se solapan con 'b'
            const stack = [b];
            const comp = [];
            while (stack.length) {
                const x = stack.pop();
                if (visited.has(x)) continue;
                visited.add(x);
                comp.push(x);
                group.forEach(y => {
                    if (visited.has(y)) return;
                    if (y.start < x.end && x.start < y.end) stack.push(y);
                });
            }
            if (comp.length > 1) count++;
        });
    });
    return count;
}

function updateConflictChip(n) {
    const chip = document.getElementById('conflictChip');
    if (!chip) return;
    if (n === 0) {
        chip.hidden = true;
    } else {
        chip.hidden = false;
        chip.textContent = n + (n === 1 ? ' cruce' : ' cruces');
    }
}
// -------------------------------------------------------------------
// panel de secciones
function buildSecList() {
    var wrap = document.getElementById('secList');
    wrap.innerHTML = '';

    if (codes_selected.length === 0) {
        wrap.innerHTML = '<p style="color:var(--muted);padding:12px">No hay cursos seleccionados.</p>';
        return;
    }

    codes_selected.forEach(function(code) {
        var course_name = DATA[code]['curso'];
        var key = colorKeyFor(code);
        var secciones = Object.keys(DATA[code]['seccion']);
        var secActiva = sections_selected_courses[code] || '';

        var card = document.createElement('div');
        card.className = 'sec-card';
        card.style.setProperty('--bd', `var(--c-${key})`);

        var pills = secciones.map(function(s) {
            var on = s === secActiva ? 'on' : '';
            return `<button class="pill ${on}" data-code="${code}" data-sec="${s}">${s}</button>`;
        }).join('');

        card.innerHTML = `
            <div class="sec-top">
                <span class="sec-dot"></span>
                <div>
                    <div class="sec-name">${course_name}</div>
                    <div class="sec-code">${code}</div>
                </div>
            </div>
            <div class="sec-label">Sección</div>
            <div class="pills">${pills}</div>
        `;

        card.querySelectorAll('.pill').forEach(function(pill) {
            pill.addEventListener('click', function() {
                var c   = pill.dataset.code;
                var sec = pill.dataset.sec;

                if (sections_selected_courses[c] === sec) {
                    // clic en la misma sección → deseleccionar
                    delete sections_selected_courses[c];
                } else {
                    sections_selected_courses[c] = sec;
                }
                localStorage.setItem('sectionsSelected', JSON.stringify(sections_selected_courses));
                buildSecList();
                placeBlocks();
            });
        });

        wrap.appendChild(card);
    });
}

// ==================================================================
// Inicialización
// ==================================================================
buildGrid();
buildSecList();
placeBlocks();