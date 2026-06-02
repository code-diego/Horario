// ==================================================================
// Constantes
// ==================================================================
const main_section = document.querySelector('main');
const list_data_div = document.querySelector('#list-data');
const list_selected_div = document.querySelector('.selected-box');
const generate_button = document.querySelector('#generate');

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
    var filer = normalizeStr(document.getElementById('search').value);
    var list = document.getElementById('list-data');
    var elements = list.getElementsByTagName('li');

    for (var i=0; i< elements.length; i++) {
        var textElement = normalizeStr(elements[i].textContent);
        if (textElement.includes(filer)){
            elements[i].style.display = 'flex';
        } else {
            elements[i].style.display = 'none';
        }
    }
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

// muestra los cursos de 'data'
function showCourses(codes_course) {
    var ul_element = document.createElement('ul');
    ul_element.classList.add('scrollable-list');

    codes_course.forEach(function(code) {
        var li_element = document.createElement('li');
        course_name = DATA[code]['curso']; // uso de DATA
        li_element.textContent = course_name;

        var div_code = document.createElement('div');
        div_code.textContent = code;
        li_element.appendChild(div_code);

        // Marcar como seleccionado si está en codes_selected
        if (codes_selected.includes(code)) {
            li_element.classList.add('selected');
        }
    
        // agregando evento
        li_element.addEventListener('click', function() {
            li_element.classList.toggle('selected');
            var value = li_element.querySelector('div').textContent;
            var index = codes_selected.indexOf(value);
            if (index !== -1) {
                codes_selected.splice(index, 1);
            } else {
                codes_selected.push(code);
            }
            updateSelectedList();
        });
    
        ul_element.appendChild(li_element);
    });
    list_data_div.appendChild(ul_element);
}

// actualiza la lista de cursos seleccionados
function updateSelectedList() {
    var div_title = document.createElement('div');
    div_title.textContent = 'Cursos:';
    
    var ul_element_sel = document.createElement('ul');
    ul_element_sel.classList.add('scrollable-list');

    // Limpiar lista
    list_selected_div.textContent = '';
    list_selected_div.appendChild(div_title);
    
    codes_selected.forEach(function(cs, index) {
        var li_element_sel = document.createElement('li');
        li_element_sel.style.display = 'flex';
        li_element_sel.style.justifyContent = 'space-between';
        li_element_sel.style.alignItems = 'center';
        li_element_sel.style.padding = '10px';
        li_element_sel.style.fontSize = '16px';
        li_element_sel.style.position = 'relative';
        
        var span_text = document.createElement('span');
        span_text.textContent = cs;
        
        var remove_button = document.createElement('button');
        remove_button.textContent = '✖';
        remove_button.style.position = 'absolute';
        remove_button.style.right = '10px';
        remove_button.style.top = '50%';
        remove_button.style.transform = 'translateY(-50%)';
        remove_button.style.cursor = 'pointer';
        remove_button.style.background = 'red';
        remove_button.style.color = 'white';
        remove_button.style.border = 'none';
        remove_button.style.padding = '5px 10px';
        remove_button.style.borderRadius = '5px';
        remove_button.style.fontSize = '16px';
        
        remove_button.addEventListener('click', function() {
            codes_selected.splice(index, 1);
            saveSelectedCourses(); // Guardar después de eliminar
            updateSelectedList(); // Actualizar la lista después de eliminar
            
            // Actualizar la lista de cursos mostrados
            var course_items = document.querySelectorAll('#list-data ul li');
            course_items.forEach(function(item) {
                var code = item.querySelector('div').textContent;
                if (!codes_selected.includes(code)) {
                    item.classList.remove('selected');
                }
            });
        });
        
        li_element_sel.appendChild(span_text);
        li_element_sel.appendChild(remove_button);
        ul_element_sel.appendChild(li_element_sel);
    });
    
    list_selected_div.appendChild(ul_element_sel);
    saveSelectedCourses(); // Guardar cuando se actualiza la lista
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
generate_button.addEventListener('click', function () {
    saveSelectedCourses();              // por seguridad
    window.location.href = 'horario.html';
});