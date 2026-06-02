// ==================================================================
// Constantes
// ==================================================================
const list_data_div   = document.querySelector('#courseList');
const list_selected_div = document.querySelector('#mine');
const generate_button = document.querySelector('#generar');
const searchCountEl   = document.getElementById('searchCount');
const countPillEl     = document.getElementById('countPill');
const creditsEl       = document.getElementById('credits');
// ==================================================================
// Estados
// ==================================================================
var codes_selected = [];
var codes_data = Object.keys(DATA);
var names_courses = codes_data.map(code => DATA[code]['curso']);

// ==================================================================
// Funciones
// ==================================================================

// normaliza el texto a Unicode NFD
function normalizeStr(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// funcion para el input  -> 'search'
function searchInList(){
    var filter = normalizeStr(document.getElementById('search').value);
    var elements = document.querySelectorAll('#courseList .course');
    var visible = 0;

    elements.forEach(function(el) {
        var text = normalizeStr(el.textContent);
        if (text.includes(filter)) {
            el.style.display = '';
            visible++;
        } else {
            el.style.display = 'none';
        }
    });
    searchCountEl.textContent = visible + (visible === 1 ? ' curso' : ' cursos');
}

// guarda los cursos seleccionados en localStorage
function saveSelectedCourses() {
    localStorage.setItem('selectedCourses', JSON.stringify(codes_selected));
}

// carga los cursos seleccionados desde localStorage
function loadSelectedCourses() {
    var storedCourses = localStorage.getItem('selectedCourses');
    if (storedCourses) {
        codes_selected = JSON.parse(storedCourses);
    } else {
        codes_selected = [];
    }
    updateSelectedList();
}

// asigna un color CSS por prefijo de código de curso
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
    return 'eco'; // fallback
}

// muestra los cursos de 'data'
function showCourses(codes_course) {
    list_data_div.innerHTML = '';
    var count = 0;

    codes_course.forEach(function(code) {
        var course_name = DATA[code]['curso'];
        var key = colorKeyFor(code);
        var isAdded = codes_selected.includes(code);
        count++;

        var div = document.createElement('div');
        div.classList.add('course');
        if (isAdded) div.classList.add('added');
        div.setAttribute('data-code', code);

        div.innerHTML = `
            <span class="accent" style="background:var(--c-${key})"></span>
            <div class="meta">
                <div class="name">${course_name}</div>
                <div class="tags">
                    <span class="code-chip">${code}</span>
                </div>
            </div>
            <button class="add-btn" data-code="${code}">
                ${isAdded ? '✔ Agregado' : '+ Agregar'}
            </button>
        `;

        div.querySelector('.add-btn').addEventListener('click', function() {
            toggle(code);
        });

        list_data_div.appendChild(div);
    });

    searchCountEl.textContent = count + (count === 1 ? ' curso' : ' cursos');
}

function toggle(code) {
    var index = codes_selected.indexOf(code);
    if (index !== -1) {
        codes_selected.splice(index, 1);
    } else {
        codes_selected.push(code);
    }
    showCourses(Object.keys(DATA));
    updateSelectedList();
    saveSelectedCourses();
}

// actualiza la lista de cursos seleccionados
function updateSelectedList() {
    list_selected_div.innerHTML = '';
    countPillEl.textContent = codes_selected.length;

    // creditsEl: data.json no tiene créditos, dejamos en 0
    // Si añades 'creditos' a data.json, calcular aquí
    creditsEl.textContent = '0';

    if (codes_selected.length === 0) {
        list_selected_div.innerHTML = `
            <div class="empty-mine">
                <p>Aún no agregas cursos.</p>
            </div>`;
        return;
    }

    codes_selected.forEach(function(code) {
        var course_name = DATA[code]['curso'];
        var key = colorKeyFor(code);

        var item = document.createElement('div');
        item.classList.add('mine-item');
        item.setAttribute('data-code', code);

        item.innerHTML = `
            <span class="swatch" style="background:var(--c-${key})"></span>
            <div>
                <div class="mi-name">${course_name}</div>
                <div class="mi-code">${code}</div>
            </div>
            <button class="remove" data-code="${code}" aria-label="Quitar">✖</button>
        `;

        item.querySelector('.remove').addEventListener('click', function() {
            toggle(code);
        });

        list_selected_div.appendChild(item);
    });
}

// ==================================================================
// Inicializacion
// ==================================================================

// carga los cursos guardados
loadSelectedCourses();
showCourses(Object.keys(DATA));

// ==================================================================
// Navegacion
// ==================================================================
document.getElementById('search').addEventListener('input', searchInList);
generate_button.addEventListener('click', function () {
    saveSelectedCourses();              // por seguridad
    window.location.href = 'horario.html';
});