import tkinter as tk
import CargaHoraria as ch

# creamos una ventana
root = tk.Tk()
root.title("Generador de Horarios")

# Dimensiones
screen_width = 1500
screen_height = 800

# establece las dimensiones de la ventana para que ocupe toda la pantalla
#root.geometry(f"{screen_width}x{screen_height}+0+0")

# Crear la función de búsqueda
def search_courses():
    search_term = search_entry.get().lower()  # Obtener el término de búsqueda y convertirlo a minúsculas
    course_listbox.delete(0, tk.END)  # Eliminar los cursos actuales en el Listbox
    
    # Agregar los cursos que coinciden con el término de búsqueda al Listbox
    for course in courses:
        if search_term in course.lower():
            course_listbox.insert(tk.END, course)

# Widgets :
title_label = tk.Label(root, text="Generador Horario de la U :D")
search_entry = tk.Entry(root, width=30)
# Listbox :
courses = ch.cursos_sec()
course_listbox = tk.Listbox(root, selectmode=tk.MULTIPLE, width=int(800/10), height=int(100/10))
for course in courses:
    course_listbox.insert(tk.END, course)
# Botones :
button_search = tk.Button(root, text="Buscar", command=search_courses)
button_generate = tk.Button(root, text="Generar Horario")

# Grid :
title_label.grid(row=0, column=0, columnspan=2, padx=10, pady=10)
search_entry.grid(row=1, column=0, padx=10, pady=10)
course_listbox.grid(row=2, column=0, columnspan=2, padx=10, pady=10, sticky="nesw")
button_search.grid(row=1, column=1, padx=10, pady=10)
button_generate.grid(row=3, column=0, columnspan=2, padx=10, pady=10)



# Usamos nuestra data
def generate_schedule():
    selected_course = course_listbox.get(course_listbox.curselection())
    # Utiliza los datos de Excel para generar el horario

# asocia la función generate_schedule con el botón Generar Horario
button_generate.config(command=generate_schedule)

# finalmente, inicia el bucle principal de la aplicacion
root.mainloop()