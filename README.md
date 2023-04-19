# Horario

# Activando el entorno

```sh
git clone "-.git"
cd Horario
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
python3 main.py

# Para ver el diccionario
```py
import json 
import DataBase from CargaHorario

database = DataBase()
dict = database.get_diccionario()
print(json.dumbs(dict, indent=4)