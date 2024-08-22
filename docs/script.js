const url = "https://raw.githubusercontent.com/code-diego/Horario/main/docs/data.json";

async function getData(){
  try {
    const response = await fetch(url);
    
    if(!response.ok){
      throw new Error('Error al cargar los datos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la petición: ', error);
  }
}  

getData().then(data => {
  console.log(data);
});
