var DATA;  
const url = "https://raw.githubusercontent.com/code-diego/Horario/main/docs/data.json";

async function getData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        DATA = await response.json();
        console.log("Datos cargados:", DATA);
    } catch (error) {
        console.error('Error en la petición:', error);
    }
    return DATA;
}

function pickPageScript() {
    if (document.querySelector('#list-data') || document.querySelector('#courseList')) {
        return 'script-seleccionar.js';
    }
    if (document.querySelector('main')) {
        return 'script-horario.js';
    }
    return null;
}

// getData().then(() => {
//     document.dispatchEvent(new Event('data-ready')); 
// });

// getData().then(() => {
//     const script2 = document.createElement("script");
//     script2.src = "script-seleccionar.js";
//     document.body.appendChild(script2);
// });

getData().then(() => {
    const src = pickPageScript();
    if (!src) {
        console.warn('No se detectó página conocida; no se cargó script de página.');
        return;
    }
    const tag = document.createElement('script');
    tag.src = src;
    document.body.appendChild(tag);
});