import tkinter as tk
from CargaHoraria import DataBase

class WinMain:
    def __init__(self):
        self.database = DataBase()
        self.data_in_dict = self.database.get_diccionario()

    def star(self):
        # creamos una ventana
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
        self.courses_listbox = tk.Listbox(self.root, selectmode=tk.MULTIPLE)
        for value in self.data_in_dict.values():
            self.courses_listbox.insert(tk.END, value['curso'])
        self.scrolbar_courses = tk.Scrollbar(self.root, command=self.courses_listbox.yview)
        self.courses_listbox.config(yscrollcommand=self.scrolbar_courses.set)
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
        return None # Return in live :)

    # Generar el horario
    def generate_schedule(self):
        dict_index_code = { key:value for key, value in enumerate(self.database.get_codigos_names()) }
        selected_course = [ self.courses_listbox.get(i) for i in self.courses_listbox.curselection()]
        codes_selected = [ dict_index_code[index] for index in self.courses_listbox.curselection() ]
        
        #Elimina los widgets de la ventana
        for widget in self.root.winfo_children():
            widget.destroy(codes_selected)

        

        # Utiliza los datos de Excel para generar el horario

class WInHorario:
    def __init__(self, codes_selected):
        self.codes_selected = codes_selected


if __name__ == '__main__':
    win = WinMain()
    win.star()


