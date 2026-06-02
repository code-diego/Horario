# Horario 

Te ha pasado que al hacer tu horario, lo haces en un excel o papel? debido a que no hay una mejor manera para evitar tener cruces o armar un horario plan b por si acaban las vacantes en la sección que querias?

Esta proyecto tiene como fin, resolver esto. Implemente un script para pasar los horarios de CargaHoraria enviadas a nuestro correo que aveces son en formatos diferentes (excel/pdf/url). Implemente una forma de llevarlos a un JSON.

En este pagina, puedes seleccionar los cursos que piensas llevar y seleeccionar las seccionas para que veas como quedaría tu horario para este ciclo

Ciclo actual -> *2026-1*

## Link de la pagina 

https://code-diego.github.io/Horario/


#

Si quieres agregar algo más a los scripts hechos para pasar los datos a JSON

### Activando el entorno 
Para correr los archivos py

```sh
git clone "https://github.com/code-diego/Horario.git"
cd Horario
python3 -m venv env
source env/bin/activate # Unix
env\Scripts\activate # Windows
pip3 install -r requirements.txt
python3 main.py
```
