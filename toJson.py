from CargaHoraria import DataBase
from scraping import url_to_df 
import json
import os

# diccionario (python) to json (para javascript)

def run():
    
    data = DataBase(url_to_df())
    diccionario = data.get_diccionario()

    # asegura que exista la carpeta 'docs'
    if not os.path.exists('docs'):
        os.makedirs('docs')
    
    # guarda el diccionario en un archivo json
    ruta = os.path.join('docs','data.json')
    with open(ruta, 'w') as archivo:
        json.dump(diccionario, archivo)
        
    print('Guardado datos en : ', 'data.json')

if __name__ == "__main__":
    run()