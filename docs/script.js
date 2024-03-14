// Mientras no encuentro una solucion para CORS

// fetch('https://github.com/code-diego/Horario/blob/main/web/data.json')
//     .then(response => response.json())
//     .then(data => {
//         //recorriendo todo la data
//         for (let key in data) {
//             if (data.hasOwnProperty(key)) {
//                 console.log("Key : ", key)
//                 let seccion = data[key].seccion;
//                 for (let subKey in seccion) {
//                     if (seccion.hasOwnProperty(subKey)) {
//                         console.log("subKey : ", subKey);
//                         console.log("Horario:", seccion[subKey].horario);
//                         console.log("Aula:", seccion[subKey].aula);
//                         console.log("Docente:", seccion[subKey].docente);
//                     }
//                 }
//             }
//         }
//     })
//     .catch(error => {
//         console.error("error!! : ", error);
//     })