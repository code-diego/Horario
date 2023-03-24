import tkinter as tk
import CargaHoraria as ch

# creamos una ventana
root = tk.Tk()
root.title("Generador de Horarios")

# Resolucion de la pantalla
screen_width = 1200
screen_height = 800
root.geometry(f'{screen_width}x{screen_height}')

# rows y columns
root.rowconfigure(0, weight=1)
root.rowconfigure(1, weight=3)
root.rowconfigure(2, weight=1)
root.columnconfigure(0, weight=3)
root.columnconfigure(1, weight=2)

# After functions 
def search_courses():
    search_term = search_entry.get().lower()  # Obtener el término de búsqueda y convertirlo a minúsculas
    course_listbox.delete(0, tk.END)  # Eliminar los cursos actuales en el Listbox
    
    # Agregar los cursos que coinciden con el término de búsqueda al Listbox
    for course in courses:
        if search_term in course.lower():
            course_listbox.insert(tk.END, course)

# Widgets :
search_entry = tk.Entry(root, width=30)
courses = ch.cursos_sec()
course_listbox = tk.Listbox(root, selectmode=tk.MULTIPLE)
for course in courses:
    course_listbox.insert(tk.END, course)
course_selected= tk.Listbox(root)
button_search = tk.Button(root, text="Buscar", command=search_courses)
button_generate = tk.Button(root, text="Generar Horario")

# Grid :
search_entry.grid   (row=0, column=0, sticky='ew', ipadx=10, ipady=10 , padx=(50,120), pady=(80,5))
button_search.grid  (row=0, column=0, sticky='e', ipadx=10, ipady=10, padx=50, pady=(80,5))
course_listbox.grid (row=1, column=0, sticky='nsew', padx=50, pady=(5,5))
course_selected.grid(row=0, column=1, sticky='nsew', padx=50, pady=(120,5), rowspan=2)
button_generate.grid(row=2, column=0, sticky='', ipadx=40, ipady=20, padx=5, pady=5, columnspan=2)

# Before functions
def generate_schedule():
    selected_course = course_listbox.get(course_listbox.curselection())
    # Utiliza los datos de Excel para generar el horario

# asocia la función generate_schedule con el botón Generar Horario
button_generate.config(command=generate_schedule)

# finalmente, inicia el bucle principal de la aplicacion
root.mainloop()