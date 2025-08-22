from CargaHoraria import DataBase
from scraping import url_to_df 
from xlsx import read_data_xlsx
import json
import os

# diccionario (python) to json (para javascript)

# def run():
    
#     data = DataBase(url_to_df())
#     diccionario = data.get_diccionario()

#     # asegura que exista la carpeta 'docs'
#     if not os.path.exists('docs'):
#         os.makedirs('docs')
    
#     # guarda el diccionario en un archivo json
#     ruta = os.path.join('docs','data.json')
#     with open(ruta, 'w') as archivo:
#         json.dump(diccionario, archivo)
        
#     print('Guardado datos en : ', 'data.json')

def _load_df():
    # 1) intenta web
    df = None
    try:
        df = url_to_df()
    except Exception as e:
        print("[WARN] url_to_df() lanzó excepción:", repr(e))

    # 2) si no hay DF válido, usa Excel local
    if df is None or not hasattr(df, "shape") or df.shape[0] == 0:
        print("[INFO] url_to_df() no devolvió DataFrame válido. Intentando leer Excel local…")
        try:
            df = read_data_xlsx()
        except Exception as e:
            raise RuntimeError(
                "No se pudo obtener datos ni por web scraping ni desde el Excel local."
            ) from e

    # 3) última validación
    if df is None or not hasattr(df, "iloc"):
        raise TypeError(f"Se esperaba un pandas.DataFrame, se recibió: {type(df)}")

    return df

def run():
    df = _load_df()
    print(f"[OK] DataFrame cargado: shape={df.shape} cols={list(df.columns)}")

    data = DataBase(df)
    diccionario = data.get_diccionario()

    os.makedirs('docs', exist_ok=True)
    ruta = os.path.join('docs', 'data.json')
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(diccionario, f, ensure_ascii=False, indent=2)

    print('Guardado datos en:', ruta)

if __name__ == "__main__":
    run()