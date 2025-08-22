from CargaHoraria import DataBase
from scraping import url_to_df
from xlsx import read_data_xlsx
import json

def main():
    #data = DataBase(url_to_df())
    data = DataBase(read_data_xlsx())
    dicty = data.get_diccionario()
    print(dicty)

if __name__ == "__main__":
    main()