import pandas as pd

def deleteExtraTitles(df, condition):
    iters = [ index for index,row in df.iterrows() if row[0] == condition[0] ]
    df = df.drop(i for i in iters)
    df = df.reset_index(drop=True)
    return df

def deleteNam(list):
    newList = []
    last = ''
    for l in list :
        if pd.isna(l) : l = last
        last = l
        newList.append(l)
    return newList         

df_FC = pd.read_excel('./Horarios2021-2.xlsx')

#Titulos de Data Frame
names = df_FC.columns.tolist() #['CURSOS', 'CÓDIGO', 'HORARIO', 'AULA', 'DOCENTE', 'N'] 

cursos     = df_FC[names[0]].tolist()
codigos    = df_FC[names[1]].tolist()
horarios   = df_FC[names[2]].tolist()
aulas      = df_FC[names[3]].tolist()
docentes   = df_FC[names[4]].tolist()
ns         = df_FC[names[5]].tolist()

df_FC[names[0]] = deleteNam(cursos)
df_FC[names[1]] = deleteNam(codigos)
df_FC[names[5]] = deleteNam(ns)

df_FC = deleteExtraTitles(df_FC, names)

#Mostrar DataFrame
print(df_FC)


