import CargaHoraria

def run():
    db = CargaHoraria.data()
    cursos = CargaHoraria.cursos_sec()
    codigos = CargaHoraria.codigos_sec()
    [ print(codigo) for codigo in codigos ]
    diccionario = CargaHoraria.diccionario()

if __name__ == "__main__":
    run()