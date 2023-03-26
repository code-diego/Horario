import tkinter as tk
from CargaHoraria import DataBase

'''
database = DataBase()
#courses = database.get_cursos_names()
data_in_dict = database.get_diccionario()

# creamos una ventana
root = tk.Tk()
root.title("Generador de Horarios")

# Resolucion de la pantalla
screen_width, screen_height = 1200, 800
root.geometry(f'{screen_width}x{screen_height}')

# rows y columns
root.rowconfigure(0, weight=1)
root.rowconfigure(1, weight=3)
root.rowconfigure(2, weight=1)
root.columnconfigure(0, weight=3)
root.columnconfigure(1, weight=2)

# Filtro
def search_courses():
    return None # Return in live :)
    search_term = search_entry.get().lower()  # Obtener el término de búsqueda y convertirlo a minúsculas
    courses_listbox.delete(0, tk.END)  # Eliminar los cursos actuales en el Listbox
    # Agregar los cursos que coinciden con el término de búsqueda al Listbox
    for course in courses:
        if search_term in course.lower():
            courses_listbox.insert(tk.END, course)

# Widgets :
search_entry = tk.Entry(root, width=30)
courses_listbox = tk.Listbox(root, selectmode=tk.MULTIPLE)
for key, value in data_in_dict.items():
    courses_listbox.insert(tk.END, value['curso'])
#for course in courses:
#    courses_listbox.insert(tk.END, course)
scrolbar_courses = tk.Scrollbar(root, command=courses_listbox.yview)
courses_listbox.config(yscrollcommand=scrolbar_courses.set)
course_selected= tk.Listbox(root)
button_search = tk.Button(root, text="Buscar", command=search_courses)


# Grid :
search_entry.grid    (row=0, column=0, sticky='ew', ipadx=10, ipady=10 , padx=(50,120), pady=(80,5))
button_search.grid   (row=0, column=0, sticky='e', ipadx=10, ipady=10, padx=50, pady=(80,5))
courses_listbox.grid (row=1, column=0, sticky='nsew', padx=5, pady=(5,5))
scrolbar_courses.grid(row=1, column=0, sticky='nse', padx=(5,5), pady=(5,5))
course_selected.grid (row=0, column=1, sticky='nsew', padx=50, pady=(120,5), rowspan=2)


# Generar el horario
def generate_schedule():
    dict_index_code = { key:value for key, value in enumerate(database.get_codigos_names()) }
    selected_course = [ courses_listbox.get(i) for i in courses_listbox.curselection()]
    codes_selected = [ dict_index_code[index] for index in courses_listbox.curselection() ]
    
    for widget in root.winfo_children():
        widget.destroy()

    # Utiliza los datos de Excel para generar el horario

button_generate = tk.Button(root, text="Generar Horario",command=generate_schedule)
button_generate.grid(row=2, column=0, sticky='', ipadx=40, ipady=20, padx=5, pady=5, columnspan=2)

# start GUI
root.mainloop()
'''