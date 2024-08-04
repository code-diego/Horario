from CargaHoraria import DataBase 
from CargaHoraria import dataframe_to_dict
from scraping import url_to_df
import json

def main():
    database = DataBase()
    dataframe = url_to_df()
    dict_data = dataframe_to_dict(dataframe)
    
    print(json.dumps(dict_data, indent=4))

if __name__ == "__main__":
    main()