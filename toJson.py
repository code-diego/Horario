from CargaHoraria import DataBase 
import json
import os

def run():
    # diccionario (python) to json (for javascript)
    data = DataBase()
    diccionario = data.get_diccionario()

    if not os.path.exists('docs'):
        os.makedirs('docs')
    
    ruta = os.path.join('docs','data.json')
    with open(ruta, 'w') as archivo:
        json.dump(diccionario, archivo)
        
    print('Guardado datos en : ', 'data.json')
    pass

if __name__ == "__main__":
    run()