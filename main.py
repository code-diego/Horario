import CargaHoraria

def run():
    #I think, we have to declarate a object with class "DataBase"
    db = CargaHoraria.data()
    cursos = CargaHoraria.cursos_sec()
    codigos = CargaHoraria.codigos_sec()
    diccionario = CargaHoraria.diccionario()

if __name__ == "__main__":
    run()