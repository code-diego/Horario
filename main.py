from CargaHoraria import DataBase
from scraping import url_to_df
import json

def main():
    data = DataBase(url_to_df())
    dicty = data.get_diccionario()
    print(dicty)

if __name__ == "__main__":
    main()