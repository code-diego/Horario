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
// Muestra los cursos de 'data'
showCourses(Object.keys(DATA));

function showCourses(codes_course){
    var ul_element = document.createElement('ul');
    ul_element.classList.add('scrollable-list');

    codes_course.forEach(function(code) {
        var li_element = document.createElement('li');

        course_name = DATA[code]['curso'][0];
        li_element.textContent = course_name;

        var div_code = document.createElement('div');
        div_code.textContent = code;
        li_element.appendChild(div_code);
    
        // agregando evento
        li_element.addEventListener('click', function(){
            li_element.classList.toggle('selected');
            var value = li_element.querySelector('div').textContent;
            var index = codes_selected.indexOf(value);
            if(index !== -1) {
                codes_selected.splice(index,1)
            }else {
                codes_selected.push(code);
            }
            updateSelectedList();
        })
    
        ul_element.appendChild(li_element)
    })
    list_data_div.appendChild(ul_element)
}

// Actualiza la lista de cursos seleccionados
function updateSelectedList() {
    var div_title = document.createElement('div');
    div_title.textContent = 'cursos :';
    var ul_element_sel = document.createElement('ul');
    ul_element_sel.classList.add('scrollable-list');

    // limpiar lista
    list_selected_div.textContent = '';

    list_selected_div.appendChild(div_title);
    codes_selected.forEach(function(cs) {
        var li_element_sel = document.createElement('li');
        li_element_sel.textContent = cs;
        ul_element_sel.appendChild(li_element_sel);
    })
    list_selected_div.appendChild(ul_element_sel);
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
    time_cell.textContent = hour_n + period + ' - ' + (hour_n+1) + period;
    return time_cell;
}

// ------------------------------------------------------------------

// Retorna div con div-curso's en el div -> 'allcourses'
function makeCoursesWithSection(codes_s){
    var courses = document.createElement('div');
    courses.classList.add('allcourses')
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

            paintCourseSec(course_code, sec);

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
function paintCourseSec(course_code, section){
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
        for (var h = hourStar; h < hourEnd; h++){
            var cell = document.querySelector('#'+day+'-'+(h));

            if (Array.from(cell.classList).length == 0){
                // si la celda no tiene clases
                cell.classList.add(course_code);
                cell.textContent = course_code + '-' + section;
            } else {
                if (cell.className !== course_code){
                    // si la celda tiene una clase diferente a una clase()
                    cell.classList.add('conflict');
                    cell.classList.add(course_code);
                    cell.textContent = '*cruce*';
                }
            } 
        }   
    })
}

// Limpia todas las celdas del horario
function clearAllCells(){
    const cells = document.querySelectorAll('.calendar td');
    cells.forEach(cell => {
        cell.textContent = '';
    })
}

// Limpia las celdas(code) -> celdas que contienen la clase 'code' 
function clearCellCourse(code_c){
    const cells = document.querySelectorAll('.'+code_c);
    cells.forEach(cell => {
        
        if (cell.classList.length > 1){
            if (cell.classList.contains('conflict')){
                cell.classList.remove('conflict');
                cell.classList.remove(code_c);
                Array.from(cell.classList).forEach(function(c){
                    cell.classList.remove(c);
                    paintCourseSec(c,sections_selected_courses[c]);
                })
                if (cell.classList.length > 1){
                    cell.classList.add('conflict');
                }
            }
        } else {
            cell.textContent = '';
            cell.removeAttribute('class');
        }
    })
}