fetch('data.json')
    .then(response => response.json())
    .then(data => {
        //recorriendo todo la data
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                console.log("Key : ", key)
                let seccion = data[key].seccion;
                for (let subKey in seccion) {
                    if (seccion.hasOwnProperty(subKey)) {
                        console.log("subKey : ", subKey);
                        console.log("Horario:", seccion[subclave].horario);
                        console.log("Aula:", seccion[subclave].aula);
                        console.log("Docente:", seccion[subclave].docente);
                    }
                }
            }
        }
    })
    .catch(error => {
        console.error("error!! : ", error);
    })