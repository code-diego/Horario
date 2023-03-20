import pandas as pd

def deleteExtraTitles(df, condition):
    iters = [ index for index,row in df.iterrows() if row[0] == condition[0] ]
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
    #return [ list[i] if not pd.isna(list[i]) else list[i-1] for i in range(len(list))]        

def renameNan(list):
    return [ 'N.D' if pd.isna(l) else l for l in list]

def splitList(list,condition):
    return [ l.split(condition) for l in list]

def data(): 
    #Creamos un Data Frame como BD
    df_FC = pd.read_excel('./Horarios2021-2.xlsx')
    #Titulos de Data Frame
    names = df_FC.columns.tolist() #['CURSOS'(0), 'CÓDIGO'(1), 'HORARIO'(2), 'AULA'(3), 'DOCENTE'(4), 'N'(5)] 
    #Eliminamos los titulos extras en la data
    df_FC = deleteExtraTitles(df_FC, names)
    #Creando una lista para cada columna del Data Frame
    cursos, codigos, horarios, aulas, docentes, ns = [df_FC[name].tolist() for name in names]

    #Limpiamos los "nan" de Data Frame
    df_FC[names[0]] = deleteNan(cursos)
    df_FC[names[1]] = deleteNan(codigos)
    df_FC[names[5]] = deleteNan(ns)
    #Renombrando 'nan' por falda de datos (N.D.)
    df_FC[names[4]] = renameNan(docentes)
    df_FC[names[3]] = renameNan(aulas)

    #Actualizando xd
    cursos, codigos, horarios, aulas, docentes, ns = [df_FC[name].tolist() for name in names]

    #Separando en sublistas las sig listas
    df_FC[names[1]] = splitList(codigos,' ')
    df_FC[names[2]] = splitList(horarios,'\n')
    df_FC[names[4]] = splitList(docentes,'\n')
    df_FC[names[3]] = splitList(aulas,' ')

    #Retornando DataFrame
    return df_FC

def cursos():
    df = data()
    cursos = list(set(df[df.columns.tolist()[0]]))
    [print(curso) for curso in cursos]