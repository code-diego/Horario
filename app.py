import tkinter as tk
from CargaHoraria import DataBase

class WinMain:
    def __init__(self):
        self.database = DataBase()
        self.data_in_dict = self.database.get_diccionario()

    def start(self):
        # creamos una ventana ()
        self.root = tk.Tk()
        self.root.title("Generador de Horarios")

        # Resolucion de la pantalla
        screen_width, screen_height = 1200, 800
        self.root.geometry(f'{screen_width}x{screen_height}')

        # rows y columns
        self.root.rowconfigure(0, weight=1)
        self.root.rowconfigure(1, weight=3)
        self.root.rowconfigure(2, weight=1)
        self.root.columnconfigure(0, weight=3)
        self.root.columnconfigure(1, weight=2)

        # Widgets :
        self.search_entry = tk.Entry(self.root, width=30)
        self.courses_listbox = tk.Listbox(self.root, selectmode=tk.MULTIPLE)#
        for value in self.data_in_dict.values():
            self.courses_listbox.insert(tk.END, value['curso'])
        self.scrolbar_courses = tk.Scrollbar(self.root, command=self.courses_listbox.yview)
        self.courses_listbox.config(yscrollcommand=self.scrolbar_courses.set)#
        self.course_selected= tk.Listbox(self.root)
        self.button_search = tk.Button(self.root, text="Buscar", command=self.search_courses)
        
        # Grid :
        self.search_entry.grid    (row=0, column=0, sticky='ew', ipadx=10, ipady=10 , padx=(50,120), pady=(80,5))
        self.button_search.grid   (row=0, column=0, sticky='e', ipadx=10, ipady=10, padx=50, pady=(80,5))
        self.courses_listbox.grid (row=1, column=0, sticky='nsew', padx=5, pady=(5,5))
        self.scrolbar_courses.grid(row=1, column=0, sticky='nse', padx=(5,5), pady=(5,5))
        self.course_selected.grid (row=0, column=1, sticky='nsew', padx=50, pady=(120,5), rowspan=2)

        # Next
        self.button_generate = tk.Button(self.root, text="Generar Horario",command=self.generate_schedule)
        self.button_generate.grid(row=2, column=0, sticky='', ipadx=40, ipady=20, padx=5, pady=5, columnspan=2)

        # Show GUI
        self.root.mainloop()

    # Filtro
    def search_courses(self):
        return None # (in progres please dont remenber this :))

    # Generar el horario
    def generate_schedule(self):
        dict_index_code = { key:value for key, value in enumerate(self.database.get_codigos_names()) }
        selected_course = [ self.courses_listbox.get(i) for i in self.courses_listbox.curselection()]
        codes_selected = [ dict_index_code[index] for index in self.courses_listbox.curselection() ]
        
        # Elimina los widgets de la ventana
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Crea una nueva ventana
        win = WInHorario(codes_selected,self.root)
        win.start()
        win.root.mainloop()


        # Utiliza los datos de Excel para generar el horario

class WInHorario:
    def __init__(self, codes_selected,root):
        self.codes_selected = codes_selected
        self.root = root       
        self.root.title("Horario")
    def start(self):

        # NUEVAS CONFIGURACION PARA GRID
        self.root.rowconfigure(0, weight=1)
        self.root.rowconfigure(1, weight=0) # clear
        self.root.rowconfigure(2, weight=0) # clear
        self.root.columnconfigure(0, weight=5)
        self.root.columnconfigure(1, weight=2)

        # n_filas, n_column = self.root.grid_size()
        # print(f"La ventana tiene {n_filas} filas y {n_column} columnas")


        # Widgets :
        self.canvas = tk.Canvas(self.root, bg= "pink")
        self.course_selected = tk.Label(self.root, text="\n".join(self.codes_selected), bg="green")

        # Canvas :
        self.canvas.pack()
        cell_width = 100
        cell_height = 40
        days_week = ['Hora','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
        hours = [ str(hour) + ' - ' + str(hour+1) for hour in range(6,24) ]
        
        # Dibujar etiquetas de días
        for i, dia in enumerate(days_week):
            x = (i + 1) * cell_width
            y = cell_height
            self.canvas.create_text(x, y, text=dia, anchor='nw')

        # Dibujar etiquetas de horas
        for i, hora in enumerate(hours):
            x = cell_width
            y = (i + 2) * cell_height
            self.canvas.create_text(x, y, text=hora, anchor='nw')

        # Dibujar líneas horizontales
        for i in range(len(hours) + 2):
            y = (i + 1) * cell_height
            self.canvas.create_line(cell_width, y, cell_width * (len(days_week) + 1), y)

        # Dibujar líneas verticales
        for i in range(len(days_week) + 1):
            x = (i + 1) * cell_width
            self.canvas.create_line(x, cell_height, x, cell_height * (len(hours) + 2))

        # Grid :
        self.canvas.grid(row=0, column=0, sticky='nsew')
        self.course_selected.grid (row=0, column=1, sticky='nsew', padx=50, pady=(120,5), rowspan=2)

        

if __name__ == '__main__':
    WinMain().start()
    