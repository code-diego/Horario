from CargaHoraria import DataBase 
import json
import os

def run():
    # diccionario (python) to json (for javascript)
    data = DataBase()
    diccionario = data.get_diccionario()

    if not os.path.exists('web'):
        os.makedirs('web')
    
    ruta = os.path.join('web','data.json')
    with open(ruta, 'w') as archivo:
        json.dump(diccionario, archivo)
        
    print('Guardado datos en : ', 'data.json')
    pass

if __name__ == "__main__":
    run()