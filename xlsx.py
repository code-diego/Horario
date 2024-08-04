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

def split_list(lst,condition):
    return [ l.split(condition) for l in lst]

#---------------------------------------------------------------------------------------------

def read_data_xlsx(): 
    
    # actualizar el archivo de excel 
    # ACTUAL -> 2024-1
    archivo = './data/Horarios2024-1.xlsx'
    dfc = pd.read_excel(archivo) 
    
    titles = dfc.columns.tolist() #['CURSOS'(0), 'CÓDIGO'(1), 'HORARIO'(2), 'AULA'(3), 'DOCENTE'(4), 'N'(5)] 
    
    pd.set_option('display.max_rows', None) # Confi para mostrar todas las filas
    
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

    # Para 'ns' cambiamos los tipos de datos (float -> int)
    dfc[titles[5]] = dfc[titles[5]].astype(int)
    
    # Renombrando 'nan' por falda de datos (N.D.)
    dfc[titles[2]] = dfc[titles[2]].fillna('n.d.')
    dfc[titles[3]] = dfc[titles[3]].fillna('n.d.')
    dfc[titles[4]] = dfc[titles[4]].fillna('n.d.')

    # Actualizando xd
    cursos, codigos, horarios, aulas, docentes, ns = [dfc[title].tolist() for title in titles]

    # Separando en sublistas las sig listas
    dfc[titles[1]] = split_list(codigos,'\n')
    dfc[titles[1]] = split_list(codigos, ' ')
    dfc[titles[2]] = split_list(horarios,'\n')
    dfc[titles[4]] = split_list(docentes,'\n')
    dfc[titles[3]] = split_list(aulas,'\n') # no necessario
    #dfc[titles[3]] = split_list(aulas,'/') # no necessario
    

    # Actulizacion again xd
    cursos, codigos, horarios, aulas, docentes, ns = [dfc[title].tolist() for title in titles]
    
    return dfc    
