//constantes
const list_data_div = document.querySelector('#list-data');
const list_selected_div = document.querySelector('.selected-box');
//codes
var codes_data = Object.keys(data);
var codes_selected = [];
//list to select (ul-li)
var ul_element = document.createElement('ul');
ul_element.classList.add('scrollable-list');

codes_data.forEach(function(key) {
    var li_element = document.createElement('li');
    li_element.textContent = key;

    // agregando evento de click a c/u de la lista
    li_element.addEventListener('click', function(){
        li_element.classList.toggle('selected');
        var value = li_element.textContent;
        var index = codes_selected.indexOf(value);
        if(index !== -1) {
            codes_selected.splice(index,1)
        }else {
            codes_selected.push(key);
        }
        updateSelectedList();
    })

    ul_element.appendChild(li_element)
})
list_data_div.appendChild(ul_element)

function updateSelectedList() {
    var ul_element_sel = document.createElement('ul');
    ul_element_sel.classList.add('scrollable-list');
    list_selected_div.textContent = 'cursos :';
    codes_selected.forEach(function(key) {
        var li_element_sel = document.createElement('li');
        li_element_sel.textContent = key;
        ul_element_sel.appendChild(li_element_sel);
    })
    list_selected_div.appendChild(ul_element_sel);
}


const main_section = document.querySelector('main');
const generate_button = document.querySelector('#generate');

var courses = codes_selected; //from script2.js

var calendar_div = document.createElement('div');
calendar_div.classList.add('calendar');

generate_button.addEventListener('click',function () {
    main_section.textContent = '';
    calendar_div.appendChild(makeTableCalendar());
    main_section.appendChild(calendar_div);
})

function makeTableCalendar(){
    var table = document.createElement('table');
    var days = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
    var hourStart = 8;
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
        var hour_noon = (hour%12 == 0) ? 12 : hour%12;
        var period = (hour < 12) ? 'am' : 'pm';
        var row = createRow(hour_noon, period);
        table.appendChild(row);
    }
    return table
}

function createRow(hour, period) {
    var row = document.createElement('tr');
    row.appendChild(createTimeHeader(hour, period));
    for (var i = 0; i < 6; i++){
        var cell = document.createElement('td');
        row.appendChild(cell);
    }
    return row;
}

function createTimeHeader(hour, period){
    var time_cell = document.createElement('td');
    time_cell.textContent = hour + period + ' - ' + (hour+1) + period;
    return time_cell;
}




