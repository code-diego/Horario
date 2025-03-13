import requests
from bs4 import BeautifulSoup
import pandas as pd


def url_to_df():
    
    # URL del Google Sheet 
    # #2025-1
    url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz5izSseufs6Vbro3Z2asV9hKDCjGWatgTo1bCYrtnX1n-4hPQeWtPp4h0gTBxwhTVhXQL1nW5s72N/pubhtml?gid=2053301174&single=true&urp=gmail_link"
    # Haciendo la petición GET
    response = requests.get(url)
    # Parseando el HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table')
    
    if table:
        df = tablehtml_to_df(table)
        return df
    else:
        return None
        

def tablehtml_to_df(table):
    data = []
    rows = table.find_all('tr')
    
    TITLES = ['CURSOS', 'CÓDIGO-SEC', 'HORARIO', 'AULA', 'DOCENTE', 'N']
    
    for row in rows:
        cell = row.find_all('td')
        if len(cell) == 6 : # Fila con datos
            roww = [[txt.strip() for txt in cc.stripped_strings] for cc in cell ]
            curso = roww[0]
            cod_sec = roww[1]
            nn = roww[5]
            data.append(roww)
        if len(cell) == 5: # Fila con datos - ['CURSO'(0)]
            roww = [curso]
            for cc in cell :
                rr = [text.strip() for text in cc.stripped_strings]
                roww.append(rr)    
            cod_sec = roww[1]
            nn = roww[5]
            data.append(roww)
        if len(cell) == 3: # Fila con datos - ['CURSO'(0), 'CÓDIGO-SEC'(1), 'N'(5)])
            roww = [curso, cod_sec]
            for cc in cell :
                rr = [text.strip() for text in cc.stripped_strings]
                roww.append(rr)
            roww.append(nn)
            data.append(roww)
        if len(cell) == 1: # Separador (no agregar -> momentaneamente)
            pass
        if len(cell) == 0: # Fila vacía (no agregar) 
            pass
        
    # Data
    df = pd.DataFrame(data)
    
    # Ajustes
    pd.set_option('display.max_rows', None)  # Muestra todas las filas
    df.columns = TITLES
    
    # Devolver el DataFrame
    return df
    
if __name__ == '__main__':
    print('Estas en el archivo scraping.py')

