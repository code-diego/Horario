import pandas as pd

def delete_extra_titles(df, condition):
    iters = [ index for index,row in df.iterrows() if row[0] == condition[0] ]
    df = df.drop(i for i in iters)
    df = df.reset_index(drop=True)
    return df

def delete_data_with(df,txt):
    iters = [ index for index,row in df.iterrows() if row[0] == txt ]
    df = df.drop(i for i in iters)
    df = df.reset_index(drop=True)
    return df

def delete_data_starts_with(df,txt):
    iters = [ index for index,row in df.iterrows() if not pd.isna(row[0]) and str(row[0]).startswith(txt) ]
    df = df.drop(i for i in iters)
    df = df.reset_index(drop=True)
    return df

def delete_nan(list):
    newList, last, = [], ''
    for l in list :
        if pd.isna(l) : l = last
        last = l
        newList.append(l)
    return newList      

def split_list(list,condition):
    return [ l.split(condition) for l in list]

def read_data(): 
    dfc = pd.read_excel('./data/Horarios2023-1.xlsx') # Data Frame
    pd.set_option('display.max_rows', None) # Confi para mostrar todas las filas
    titles = dfc.columns.tolist() #['CURSOS'(0), 'CÓDIGO'(1), 'HORARIO'(2), 'AULA'(3), 'DOCENTE'(4), 'N'(5)] 
    
    # Eliminamos los titulos extras, y datos inecesaria en la data
    txt1 = 'CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO'
    txt2 = 'CURSOS ELECTIVOS'

    txt3 = 'ESCUELA PROFESIONAL DE ' ##IMPORTANTE PARA SEPARAR

    dfc = delete_extra_titles(dfc, titles)
    dfc = delete_data_starts_with(dfc,txt1)
    dfc = delete_data_with(dfc,txt2)
    dfc = delete_data_starts_with(dfc,txt3)
    
    # Creando una lista para cada columna del Data Frame
    cursos, codigos, horarios, aulas, docentes, ns = [dfc[title].tolist() for title in titles]

    # Limpiamos los "nan" de Data Frame
    dfc[titles[0]] = delete_nan(cursos)
    dfc[titles[1]] = delete_nan(codigos)
    dfc[titles[5]] = delete_nan(ns)

    # Para 'ns' cambiamos los datos float -> int
    dfc[titles[5]] = dfc[titles[5]].astype(int)

    # Renombrando 'nan' por falda de datos (N.D.)
    dfc[titles[2]] = dfc[titles[2]].fillna('n.d.')
    dfc[titles[3]] = dfc[titles[3]].fillna('n.d.')
    dfc[titles[4]] = dfc[titles[4]].fillna('n.d.')

    # Actualizando xd
    cursos, codigos, horarios, aulas, docentes, ns = [dfc[title].tolist() for title in titles]

    # Separando en sublistas las sig listas
    dfc[titles[1]] = split_list(codigos,'\n')
    dfc[titles[2]] = split_list(horarios,'\n')
    dfc[titles[4]] = split_list(docentes,'\n')
    dfc[titles[3]] = split_list(aulas,'/') #Data split : bad split for the formant in main data excel

    # Actulizacion again xd
    cursos, codigos, horarios, aulas, docentes, ns = [dfc[title].tolist() for title in titles]
    
    return dfc    

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

class DataBase :
    def __init__(self,data= read_data()):
        self.data = data

    def get_data(self): 
        return self.data
    
    def get_cursos_names(self):
        return cursos_of(self.data)
    
    def get_codigos_names(self):
        return codigos_of(self.data)
    
#Structure
c = {
        'bf01': {
            'curso': 'fisica',
            'codigo' : 'bf01',
            'seccion': {
                'A': {
                    'aula': 'A-101',
                    'docente': 'Juan Perez',
                    'horario': 'LU 8:00-10:00'
                },
                'B': {
                    'aula': 'A-101',
                    'docente': 'Juan Perez',
                    'horario': 'MA 8:00-10:00'
                }
            }
        }
    }
  
#Creando un diccionrio con los datos de la data
def dataframe_to_dict():
    df = read_data()
    dictionary = { codigo:{} for codigo in codigos_of(df) }
    for row in df.iterrows():
        dictionary[row[1][1][0]].update({'curso':row[1][0]})
        dictionary[row[1][1][0]].update({'codigo':row[1][1][0]})
        dictionary[row[1][1][0]].update({'seccion':{}})
    for row in df.iterrows():   
        dictionary[row[1][1][0]]['seccion'].update({row[1][1][1]:{}})
        dictionary[row[1][1][0]]['seccion'][row[1][1][1]].update({'aula':row[1][3][0]})
        dictionary[row[1][1][0]]['seccion'][row[1][1][1]].update({'docente':row[1][4][0]})
        dictionary[row[1][1][0]]['seccion'][row[1][1][1]].update({'horario':row[1][2][0]})
        
    return dictionary
        

if __name__ == '__main__':
    dataframe_to_dict()