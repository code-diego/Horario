# Horario

# Activando el entorno

```sh
git clone "-.git"
cd Horario
python3 -m venv env
source env/bin/
# Para windows: 
env\Scripts\activate
# 
pip3 install -r requirements.txt

# Ejecutar programa

python3 main.py
```

# Para ver el diccionario
```py
import json 
from CargaHoraria import DataBase 

database = DataBase()
print(json.dumps(database.get_diccionario(), indent=4))
```

