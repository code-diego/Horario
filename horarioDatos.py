import bs4

import requests
from bs4 import BeautifulSoup

# Hacer una solicitud a la página web
url = 'https://matricula.uni.edu.pe/horarios'
response = requests.get(url)

# Analizar la página con BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')

# Encontrar todas las tablas en la página
tables = soup.find_all('table')

# Iterar a través de las tablas e imprimir su contenido
for index, table in enumerate(tables):
    print(f"Tabla {index + 1}:")
    rows = table.find_all('tr')
    for row in rows:
        columns = row.find_all(['th', 'td'])
        row_data = [column.get_text(strip=True) for column in columns]
        print(row_data)
    print("\n")

