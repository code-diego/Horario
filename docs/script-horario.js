// ==================================================================
// Estado
// ==================================================================
var codes_selected = JSON.parse(localStorage.getItem('selectedCourses') || '[]');
var sections_selected_courses = JSON.parse(localStorage.getItem('sectionsSelected') || '{}');

// ==================================================================
// Referncias DOM
// ==================================================================
const main_section = document.querySelector('main');

// ==================================================================
// Funciones
// ==================================================================

// retorna una tabla de horarios
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

// retorna una fila de la tabla
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

// retorna el encabezado en una fila de la tabla
function createTimeHeader(hour){
    var hour_n = (hour%12 == 0) ? 12 : hour%12;
    var period = (hour < 12) ? 'am' : 'pm';
    var time_cell = document.createElement('th');
    time_cell.textContent = hour_n + period + ' - ' + ((hour_n+1 === 13)?1:(hour_n+1)) + period;
    return time_cell;
}

// ------------------------------------------------------------------

// retorna div con div-curso's en el div -> 'allcourses'
function makeCoursesWithSection(codes_s){
    var courses = document.createElement('div');
    courses.classList.add('allcourses')

    var title = document.createElement('h3');
    title.textContent = "*seleccione la sección de los cursos"; 
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

// agrega las secciones al div-curso
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

// pinta el curso-sec seleccionado(clickeado) 
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
        var course_name = DATA[course_code]['curso'];

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

// limpia todas las celdas del horario
function clearAllCells(){
    const cells = document.querySelectorAll('.calendar td');
    cells.forEach(cell => {
        cell.textContent = '';
    })
}

// ==================================================================
// Inicializacion
// ==================================================================
var calendar_div = document.createElement('div');
calendar_div.classList.add('calendar');
calendar_div.appendChild(makeTableCalendar());
main_section.appendChild(calendar_div);

var allcourses_div = makeCoursesWithSection(codes_selected);
main_section.appendChild(allcourses_div);