from CargaHoraria import DataBase
from CargaHoraria import dataframe_to_dict
from scraping import url_to_df 
import json
import os

# diccionario (python) to json (para javascript)

def run():
    # creamos una varaible data con dataframe de la url (scraping.py)
    data = url_to_df()
    # Lo pasamos a un diccionario (CargaHoraria.py)
    diccionario = dataframe_to_dict(data)

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