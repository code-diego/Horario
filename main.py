from CargaHoraria import dataframe_to_dict
from scraping import url_to_df
import json

def main():
    dataframe = url_to_df()
    dict_data = dataframe_to_dict(dataframe)
    
    print(dict_data)

if __name__ == "__main__":
    main()