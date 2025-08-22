from xlsx import read_data_xlsx
from scraping import url_to_df
import json
import pandas as pd

def _parse_codigo_seccion(value):
    """
    Devuelve (codigo, seccion) desde value que puede ser:
    - lista/tupla: [codigo, seccion, ...]
    - string: 'BFI01 A' o solo 'BFI01'
    - NaN/None: (None, None)
    """
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None, None

    # lista/tupla
    if isinstance(value, (list, tuple)):
        codigo  = value[0] if len(value) > 0 else None
        seccion = value[1] if len(value) > 1 else None
        return codigo, seccion

    # string u otros -> a string
    s = str(value).strip()
    if not s:
        return None, None
    parts = s.split()
    codigo  = parts[0] if len(parts) >= 1 else None
    seccion = parts[1] if len(parts) >= 2 else None
    return codigo, seccion


def cursos_of(df):
    cursos, codigos = [], []
    for _, row in df.iterrows():
        curso = row.iat[0]
        codigo, _ = _parse_codigo_seccion(row.iat[1])
        if (curso not in cursos) or (codigo and codigo not in codigos):
            cursos.append(curso)
            if codigo:
                codigos.append(codigo)
    return cursos


def codigos_of(df):
    col = df.iloc[:, 1]  # segunda columna
    uniques = []
    seen = set()
    for v in col:
        codigo, _ = _parse_codigo_seccion(v)
        if codigo and codigo not in seen:
            seen.add(codigo)
            uniques.append(codigo)
    return uniques


def _to_list(x):
    """Asegura lista: NaN->[], str->[str] si no está vacía, lista/tupla->list(x)."""
    if x is None or (isinstance(x, float) and pd.isna(x)):
        return []
    if isinstance(x, list):
        return x
    if isinstance(x, tuple):
        return list(x)
    s = str(x).strip()
    return [s] if s else []


def dataframe_to_dict(df):
    dictionary = {codigo: {} for codigo in codigos_of(df)}

    for _, row in df.iterrows():
        icurso = row.iat[0]
        icodigo, iseccion = _parse_codigo_seccion(row.iat[1])
        if not icodigo or not iseccion:
            # Si falta info clave, saltar fila
            continue

        ihorarios = _to_list(row.iat[2])
        iaulas    = _to_list(row.iat[3])
        idocentes = _to_list(row.iat[4])
        inn       = row.iat[5]  # por si luego lo quieres guardar

        # Inicializaciones seguras
        if 'curso' not in dictionary.get(icodigo, {}):
            dictionary[icodigo] = {
                'curso': icurso,
                'codigo': icodigo,
                'seccion': {}
            }

        if 'seccion' not in dictionary[icodigo]:
            dictionary[icodigo]['seccion'] = {}

        if iseccion not in dictionary[icodigo]['seccion']:
            dictionary[icodigo]['seccion'][iseccion] = {
                'horario': [],
                'aula': [],
                'docente': []
                # 'n': inn  # si lo quieres, descomenta
            }

        dictionary[icodigo]['seccion'][iseccion]['horario'].extend(ihorarios)
        dictionary[icodigo]['seccion'][iseccion]['aula'].extend(iaulas)
        dictionary[icodigo]['seccion'][iseccion]['docente'].extend(idocentes)

    return dictionary


# def cursos_of(df):
#     cursos, codigos = [], []
#     for _, row in df.iterrows():
#         curso = row.iat[0]
#         cod   = row.iat[1][0] if isinstance(row.iat[1], list) and row.iat[1] else None
#         if (curso not in cursos) or (cod and cod not in codigos):
#             cursos.append(curso)
#             if cod:
#                 codigos.append(cod)
#     return cursos

# def codigos_of(df):
#         codigos = [ codigo for codigo,seccion in df[df.columns.tolist()[1]] ]
#         secciones = [ seccion for codigo,seccion in df[df.columns.tolist()[1]] ]

#         newCodigos =  []
#         for codigo in codigos :
#             if codigo not in newCodigos:
#                 newCodigos.append(codigo)
#         return newCodigos

# def dataframe_to_dict(df):
#     dictionary = {codigo: {} for codigo in codigos_of(df)}

#     for i, row in df.iterrows():
#         icurso   = row.iat[0]          # antes: row[0]
#         # row.iat[1] es la lista [codigo, seccion, ...]
#         cod_sec  = row.iat[1]          # antes: row[1]
#         icodigo  = cod_sec[0] if isinstance(cod_sec, list) and len(cod_sec) > 0 else None
#         iseccion = cod_sec[1] if isinstance(cod_sec, list) and len(cod_sec) > 1 else None

#         ihorarios = row.iat[2]         # antes: row[2]
#         iaulas    = row.iat[3]         # antes: row[3]
#         idocentes = row.iat[4]         # antes: row[4]
#         inn       = row.iat[5]         # antes: row[5]

#         if 'curso' not in dictionary[icodigo]:
#             dictionary[icodigo] = {'curso': icurso, 'codigo': icodigo, 'seccion': {}}

#         if 'seccion' not in dictionary[icodigo]:
#             dictionary[icodigo]['seccion'] = {}
        
#         if iseccion not in dictionary[icodigo]['seccion']:
#             dictionary[icodigo]['seccion'][iseccion] = {'horario': [], 'aula': [], 'docente': []}
#             # aquí se puede agregar el dato {'n' : inn}
        
#         dictionary[icodigo]['seccion'][iseccion]['horario'].extend(ihorarios)
#         dictionary[icodigo]['seccion'][iseccion]['aula'].extend(iaulas)
#         dictionary[icodigo]['seccion'][iseccion]['docente'].extend(idocentes)

#     return dictionary

#***************************************************************************************************
#Structure example of data
c = {
        'bf01': {
            'curso': 'fisica 1',
            'codigo' : 'bf01',
            'seccion': {
                'A': {
                    'horario': ['LU 8-10' , 'MA 8-10' , 'MI 8-10', 'VI 13-15'],
                    'aula': ['A-101', 'A-102', 'A-103','lab f'],    
                    'docente': ['Juan Perez', 'Juana', 'Juana']
                    # 'nn' : 30 (no necesario-omitir)
                },
                'B': {
                    'horario': ['LU 8-10:' , 'MA 8-10' , 'MI 8-10', 'VI 13-15'],
                    'aula': ['A-101', 'A-102', 'A-103' ,'lab f'],    
                    'docente': ['Juan Perez', 'Juana', 'Juana']
                }
            }
        }
    }

c['bf01']['curso'] # >fisica
c['bf01']['seccion']['A']['horario'] # >"LU 10-12", "MI 10-12", "VI 08-10", "VI 13-15"

#***************************************************************************************************

class DataBase :
    def __init__(self,data):
        if data is None or not hasattr(data, "iloc"):
            raise TypeError(f"DataBase esperaba un pandas.DataFrame; recibió: {type(data)}")
        self.data = data

    def get_data(self): 
        return self.data
    
    def get_diccionario(self):
        return dataframe_to_dict(self.data)
    
    def get_cursos_names(self):
        return cursos_of(self.data)
    
    def get_codigos_names(self):
        return codigos_of(self.data)
    
# Test Data
def test():
    # Para xlsx :
    data = DataBase(read_data_xlsx())
    # Para web :
    #data = DataBase(url_to_df())
    dicty = data.get_diccionario()
    print(json.dumps(dicty['BFI01'], indent=4))

      
if __name__ == '__main__':
    test()
    print('you are in DataBase :0 \n-> CargaHoraria.py')
    
    
    
