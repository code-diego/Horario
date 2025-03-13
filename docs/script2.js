//constantes
const main_section = document.querySelector('main');
const list_data_div = document.querySelector('#list-data');
const list_selected_div = document.querySelector('.selected-box');
//boton
const generate_button = document.querySelector('#generate');

//calendario
var calendar_div = document.createElement('div');
calendar_div.classList.add('calendar');
//lista de cursos - calendario
var allcourses_div = document.createElement('div');
var sections_selected_courses = {};
// Lista de los codigos de los cursos
var codes_data = Object.keys(DATA);
// Lista de los codigos de los cursos seleccionados
var codes_selected = [];
// Lista de los nombres de los cursos (esta como 'curso' en data )
var names_courses = [];
codes_data.forEach(function(code){
    names_courses.push(DATA[code]['curso'][0]);
})

// ==================================================================
// Funcion para el input  -> 'search'
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

function normalizeStr(str) {
    // Normaliza el texto a Unicode NFD y elimina los caracteres diacríticos
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// ==================================================================

// Cargar los cursos guardados al inicio
loadSelectedCourses();
// Muestra los cursos de 'data'
showCourses(Object.keys(DATA));


// Guarda los cursos seleccionados en localStorage
function saveSelectedCourses() {
    localStorage.setItem('selectedCourses', JSON.stringify(codes_selected));
}

// Carga los cursos seleccionados desde localStorage
function loadSelectedCourses() {
    var storedCourses = localStorage.getItem('selectedCourses');
    if (storedCourses) {
        codes_selected = JSON.parse(storedCourses);
    } else {
        codes_selected = [];
    }
    updateSelectedList();
}

// Muestra los cursos de 'data'
function showCourses(codes_course) {
    var ul_element = document.createElement('ul');
    ul_element.classList.add('scrollable-list');

    codes_course.forEach(function(code) {
        var li_element = document.createElement('li');
        course_name = DATA[code]['curso'][0]; // uso de DATA
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

// Actualiza la lista de cursos seleccionados
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
// Agregando evento al boton (generar)
generate_button.addEventListener('click',function () {
    // limpia toda la pagina
    main_section.textContent = '';
    // agregamos nuevos divs a la pagina (actulaizamos)
    calendar_div.appendChild(makeTableCalendar());
    main_section.appendChild(calendar_div);
    allcourses_div = makeCoursesWithSection(codes_selected);
    main_section.appendChild(allcourses_div);
})

// Retorna una tabla(html) de horarios
function makeTableCalendar(){
    var table = document.createElement('table');
    var days = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
    var hourStart = 7;
    var hourEnd = 22;

    var header = document.createElement('tr');
    header.appendChild(document.createElement('th'));
    days.forEach(function(day){
        var day_th = document.createElement('th');
        day_th.textContent = day;
        header.appendChild(day_th);
    })
    table.appendChild(header);

    for (var hour = hourStart; hour < hourEnd; hour++){
        var row = createRow(hour);
        table.appendChild(row);
    }
    return table
}

// Retorna una fila de la tabla
function createRow(hour) {
    var prefix_days = ['LU','MA','MI','JU','VI','SA'];
    var row = document.createElement('tr');
    row.appendChild(createTimeHeader(hour));
    for (var i = 0; i < 6; i++){
        var cell = document.createElement('td');
        cell.setAttribute('id',prefix_days[i]+'-'+hour);
        row.appendChild(cell);
    }
    return row;
}

// Retorna el encabezado en una fila de la tabla
function createTimeHeader(hour){
    var hour_n = (hour%12 == 0) ? 12 : hour%12;
    var period = (hour < 12) ? 'am' : 'pm';
    var time_cell = document.createElement('th');
    time_cell.textContent = hour_n + period + ' - ' + ((hour_n+1 === 13)?1:(hour_n+1)) + period;
    return time_cell;
}

// ------------------------------------------------------------------

// Retorna div con div-curso's en el div -> 'allcourses'
function makeCoursesWithSection(codes_s){
    var courses = document.createElement('div');
    courses.classList.add('allcourses')

    var title = document.createElement('h3');
    title.textContent = "*eliga la sección de los cursos"; 
    title.style.fontWeight = "normal"; 
    courses.appendChild(title);

    codes_s.forEach(function(code){
        var course = document.createElement('div');
        course.innerHTML = code;
        course.appendChild(addCourseSection(code));
        courses.appendChild(course);
    })
    return courses;
}

// Agrega las secciones al div-curso
function addCourseSection(course_code){
    var course_sections = document.createElement('div');
    var sections = DATA[course_code]['seccion'];
    var name_sections = Object.keys(sections);
    
    var old_cd_crs_select = '';

    name_sections.forEach(function(sec){
        var section_div = document.createElement('div');
        section_div.classList.add(course_code+'-'+sec);
        section_div.textContent = sec;

        section_div.addEventListener('click', function(){
            var sec_select = section_div.textContent;
            var old_sec = sections_selected_courses[course_code];
            
            if (old_cd_crs_select && course_code === old_cd_crs_select ){
                // si se selecciona el mismo curso -> cambio de seccion

                if (sec !== old_sec){
                    // si se selecciona una nueva seccion (del mismo curso)   
                    var old_sec_div = document.querySelector('.'+course_code+'-'+old_sec);
                    if (old_sec_div){
                        old_sec_div.classList.remove('select-one');
                    }
                }else {
                    // si se selecciona la misma seccion
                    var old_sec_div = document.querySelector('.'+course_code+'-'+old_sec+'.select-one');
                    if (old_sec_div){
                        old_sec_div.classList.remove('select-one');
                        delete sections_selected_courses[course_code];
                        clearCellCourse(course_code);
                        return;
                    }
                }
                clearCellCourse(course_code);
            }

            makeDivCourse(course_code, sec);

            section_div.classList.toggle('select-one');
            sections_selected_courses[course_code] = sec_select;
            old_cd_crs_select = course_code;

        })
        course_sections.appendChild(section_div);
    })
    return course_sections
}

// ------------------------------------------------------------------

// Pinta el curso-secc seleccionado(clickeado) 
function makeDivCourse(course_code, section){
    var schedules_data = DATA[course_code]['seccion'][section]['horario'];
    if (schedules_data.includes('n.d.')) {
        alert('No hay horarios para este curso :C');
        return;
    }

    // schedules_data (ejemplo) -> ['MI 10-12','VI 10-12']
    schedules_data.forEach(function(hour_data){
        var day = hour_data.split(' ')[0];
        var hourStar = parseInt(hour_data.split(' ')[1].split('-')[0]);
        var hourEnd = parseInt(hour_data.split(' ')[1].split('-')[1]);
        var course_name = DATA[course_code]['curso'][0];

        for (var h = hourStar; h < hourEnd; h++){
            var cell = document.querySelector('#'+day+'-'+(h));
            var divs_cell = cell.querySelectorAll('div');

            var div_course = document.createElement('div');
            if (divs_cell.length == 0){
                // si la celda no tiene cursos(divs)
                cell.classList.add(course_code); // old
                div_course.textContent = course_name + ' - ' + section;
                div_course.classList.add(course_code);
                cell.appendChild(div_course);
            } else {
                if (divs_cell[0].id !== course_code){
                    // si la celda solo tiene un curso(diferente al actual)
                    cell.classList.add('conflict');
                    cell.classList.add(course_code); // old
                    div_course.textContent = course_name + ' - ' + section;
                    div_course.classList.add(course_code);
                    cell.appendChild(div_course);
                }
            } 
        }   
    })
}

// limpia el div(course) de la celda
function clearCellCourse(code_c){
    var divs_cell = document.querySelectorAll('div.'+code_c);

    divs_cell.forEach(div_c => {
        var cell = div_c.parentElement;
        cell.classList.remove(code_c);
        // si la celda tiene solo un curso
        if (cell.querySelectorAll('div').length <= 1){
            cell.classList.remove('conflict');
            cell.removeAttribute('class'); 
        } else {
            cell.classList.remove('conflict');
        }

        div_c.remove();
    })
}

// Limpia todas las celdas del horario
function clearAllCells(){
    const cells = document.querySelectorAll('.calendar td');
    cells.forEach(cell => {
        cell.textContent = '';
    })
}