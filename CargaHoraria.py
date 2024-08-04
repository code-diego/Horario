from xlsx import read_data_xlsx

def cursos_of(df):
        cursos, codigos = [], []
        for index,row in df.iterrows():
            if (row[0] not in cursos) or (row[1][0] not in codigos) : 
                cursos.append( row[0] )
                codigos.append( row[1][0] )
        return cursos
    
def codigos_of(df):
        codigos = [ codigo for codigo,seccion in df[df.columns.tolist()[1]] ]
        secciones = [ seccion for codigo,seccion in df[df.columns.tolist()[1]] ]

        newCodigos =  []
        for codigo in codigos :
            if codigo not in newCodigos:
                newCodigos.append(codigo)
        return newCodigos

def dataframe_to_dict(df):
    dictionary = {codigo: {} for codigo in codigos_of(df)}

    for i, row in df.iterrows():
        icurso = row[0]
        icodigo = row[1][0]
        iseccion = row[1][1]
        ihorarios = row[2]
        iaulas = row[3]
        idocentes = row[4]
        inn = row[5]

        if icodigo not in dictionary:
            dictionary[icodigo] = {'curso': icurso, 'codigo': icodigo, 'seccion': {}}

        if 'seccion' not in dictionary[icodigo]:
            dictionary[icodigo]['seccion'] = {}
        
        if iseccion not in dictionary[icodigo]['seccion']:
            dictionary[icodigo]['seccion'][iseccion] = {'horario': [], 'aula': [], 'docente': []}

        # dictionary[icodigo].update({'curso' : icurso, 'codigo' : icodigo})
        # dictionary[icodigo].setdefault('seccion', {}).setdefault(iseccion, {})
        # dictionary[icodigo]['seccion'].update({iseccion : {}})
        # dictionary[icodigo]['seccion'][iseccion] = {
        #     'horario': [],
        #     'aula': [],
        #     'docente': []
        # }
        
        dictionary[icodigo]['seccion'][iseccion]['horario'].extend(ihorarios)
        dictionary[icodigo]['seccion'][iseccion]['aula'].extend(iaulas)
        dictionary[icodigo]['seccion'][iseccion]['docente'].extend(idocentes)

    return dictionary

# Test Data
#database = read_data_xlsx()
#print(json.dumps(dataframe_to_dict(database)['BFI01'], indent=4))
#print(read_data_xlsx())

#********************************************************************
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

#********************************************************************

class DataBase :
    def __init__(self,data):
        self.data = data

    def get_data(self): 
        return self.data
    
    def get_diccionario(self):
        return dataframe_to_dict(self.data)
    
    def get_cursos_names(self):
        return cursos_of(self.data)
    
    def get_codigos_names(self):
        return codigos_of(self.data)
    

      
if __name__ == '__main__':
    print('you are in DataBase :0 \n-> CargaHoraria.py')
    
    
    
