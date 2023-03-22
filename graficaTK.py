import tkinter as tk

#creamos una ventana
root = tk.Tk()
root.title("Generador de Horarios")

# Obtiene las dimensiones de la pantalla
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()

# Establece las dimensiones de la ventana para que ocupe toda la pantalla
root.geometry(f"{screen_width}x{screen_height}+0+0")

#'label' para mostrar una etiqueta
title_label = tk.Label(root, text="Generador de Horarios")
title_label.pack()

#'Listbox' para mostrar los cursos disponibles
courses = ['Curso 1', 'Curso 2', 'Curso 3']
course_listbox = tk.Listbox(root, selectmode=tk.SINGLE)
for course in courses:
    course_listbox.insert(tk.END, course)
course_listbox.pack()

#'Button' para que el usuario pueda generar el horario:
generate_button = tk.Button(root, text="Generar Horario")
generate_button.pack()

#usomos nuestra data
def generate_schedule():
    selected_course = course_listbox.get(course_listbox.curselection())
    # Utiliza los datos de Excel para generar el horario

#asocia la función generate_schedule con el botón Generar Horario
generate_button.config(command=generate_schedule)

#finalmente, inicia el bucle principal de la aplicacion
root.mainloop()