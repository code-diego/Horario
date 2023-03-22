import pandas as pd

def deleteExtraTitles(df, condition):
    iters = [ index for index,row in df.iterrows() if row[0] == condition[0] ]
    df = df.drop(i for i in iters)
    df = df.reset_index(drop=True)
    return df

def deleteNoDataWithText(df,txt):
    iters = [ index for index,row in df.iterrows() if row[0] == txt ]
    df = df.drop(i for i in iters)
    df = df.reset_index(drop=True)
    return df

def deleteNoDataWithTextStart(df,txt):
    iters = [ index for index,row in df.iterrows() if not pd.isna(row[0]) and str(row[0]).startswith(txt) ]
    df = df.drop(i for i in iters)
    df = df.reset_index(drop=True)
    return df

def deleteNan(list):
    newList, last, = [], ''
    for l in list :
        if pd.isna(l) : l = last
        last = l
        newList.append(l)
    return newList      

def renameNan(list):
    return [ 'N.D' if pd.isna(l) else l for l in list]

def splitList(list,condition):
    return [ l.split(condition) for l in list]

def data(): 
    # Creamos un Data Frame como BD
    dfc = pd.read_excel('./data/Horarios2023-1.xlsx')
    # Configuracion a 'pd' para mostrar todas las filas de la data
    pd.set_option('display.max_rows', None)
    # Titulos de Data Frame
    names = dfc.columns.tolist() #['CURSOS'(0), 'CÓDIGO'(1), 'HORARIO'(2), 'AULA'(3), 'DOCENTE'(4), 'N'(5)] 
    # Eliminamos los titulos extras, y datos inecesaria en la data
    dfc = deleteExtraTitles(dfc, names)
    txt1 = 'CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO'
    txt2 = 'CURSOS ELECTIVOS'
    txt3 = 'ESCUELA PROFESIONAL DE '
    dfc = deleteNoDataWithTextStart(dfc,txt1)
    dfc = deleteNoDataWithText(dfc,txt2)
    dfc = deleteNoDataWithTextStart(dfc,txt3)
    
    # Creando una lista para cada columna del Data Frame
    cursos, codigos, horarios, aulas, docentes, ns = [dfc[name].tolist() for name in names]

    # Limpiamos los "nan" de Data Frame
    dfc[names[0]] = deleteNan(cursos)
    dfc[names[1]] = deleteNan(codigos)
    dfc[names[5]] = deleteNan(ns)

    # Para 'ns' cambiamos los datos float -> int
    dfc[names[5]] = dfc[names[5]].astype(int)

    # Renombrando 'nan' por falda de datos (N.D.)
    dfc[names[2]] = dfc[names[2]].fillna('n.d.')
    dfc[names[3]] = dfc[names[3]].fillna('n.d.')
    dfc[names[4]] = dfc[names[4]].fillna('n.d.')

    # Actualizando xd
    cursos, codigos, horarios, aulas, docentes, ns = [dfc[name].tolist() for name in names]

    # Separando en sublistas las sig listas
    dfc[names[1]] = splitList(codigos,'\n')
    dfc[names[2]] = splitList(horarios,'\n')
    dfc[names[4]] = splitList(docentes,'\n')
    dfc[names[3]] = splitList(aulas,'/') #Data split : bad split for the formant in main data excel

    # Actulizacion again xd
    cursos, codigos, horarios, aulas, docentes, ns = [dfc[name].tolist() for name in names]
    
    return dfc    

def cursos_sec():
    df = data()
    cursos, codigos = [], []
    for index,row in df.iterrows():
        if (row[0] not in cursos) or (row[1][0] not in codigos) : 
            cursos.append( row[0] )
            codigos.append( row[1][0] )
    return cursos
    
def codigos_sec():
    df = data()
    codigos = [ codigo for codigo,seccion in df[df.columns.tolist()[1]] ]
    secciones = [ seccion for codigo,seccion in df[df.columns.tolist()[1]] ]

    newCodigos =  []
    for codigo in codigos :
        if codigo not in newCodigos:
            newCodigos.append(codigo)
    return newCodigos

def diccionario():
    cursos = cursos_sec()
    codigos = codigos_sec()
    diccionario = {codigos[i]:cursos[i] for i in range(len(codigos))}
    return diccionario
    

