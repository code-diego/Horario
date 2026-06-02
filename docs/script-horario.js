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
    const c = code.toLowerCase();
    if (c.startsWith('bfi')) return 'fis';
    if (c.startsWith('beg')) return 'eco';
    if (c.startsWith('bef')) return 'eti';
    if (c.startsWith('bic')) return 'com';
    if (c === 'bma01') return 'cdi';
    if (c === 'bma02') return 'cin';
    if (c === 'bma03') return 'alg';
    if (c.startsWith('bqu')) return 'qui';
    return 'eco';
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
    // quitar bloques anteriores
    tt.querySelectorAll('.block').forEach(b => b.remove());

    var placed = []; // para detección de conflictos

    Object.keys(sections_selected_courses).forEach(function(code) {
        var sec = sections_selected_courses[code];
        var horarios = DATA[code]['seccion'][sec]['horario'];
        if (!horarios || horarios.includes('n.d.')) return;

        var key = colorKeyFor(code);
        var course_name = DATA[code]['curso'];
        var aulas = DATA[code]['seccion'][sec]['aula'] || [];

        horarios.forEach(function(h, i) {
            var parts = h.split(' ');
            var day   = parts[0];
            var range = parts[1].split('-');
            var start = parseInt(range[0]);
            var end   = parseInt(range[1]);
            var col   = DAY_COL[day];
            if (!col) return;

            var rowStart = start - 7 + 2;
            var rowEnd   = end   - 7 + 2;
            var room     = aulas[i] || '';

            // crear bloque
            var block = document.createElement('div');
            block.className = 'block';
            block.style.setProperty('--bd',   `var(--c-${key})`);
            block.style.setProperty('--bg-c', `var(--c-${key}-bg)`);
            block.style.gridColumn = col;
            block.style.gridRow    = `${rowStart} / ${rowEnd}`;
            block.innerHTML = `
                <div class="b-name">${course_name}</div>
                <div class="b-row">
                    <span class="b-sec">Sec ${sec}</span>
                    <span class="b-room">${room}</span>
                </div>`;

            // detección de conflicto
            placed.forEach(function(p) {
                if (p.col === col && p.start < rowEnd && rowStart < p.end) {
                    block.classList.add('conflict');
                    p.el.classList.add('conflict');
                }
            });

            placed.push({ col, start: rowStart, end: rowEnd, el: block });
            tt.appendChild(block);
        });
    });
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