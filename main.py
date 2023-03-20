import pandas as pd

df = pd.read_excel('./Horarios2021-2.xlsx')

#Titulos de Data Frame
names = df.columns.tolist() #['CURSOS', 'CÓDIGO', 'HORARIO', 'AULA', 'DOCENTE', 'N'] 

print(df)


