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
    return DATA; // Retornamos DATA para poder esperar su carga
}

// Asegurar que `script2.js` solo se ejecute después de cargar DATA
getData().then(() => {
    const script2 = document.createElement("script");
    script2.src = "script2.js";
    document.body.appendChild(script2);
});