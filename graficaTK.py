import tkinter as tk
import CargaHoraria as ch

# creamos una ventana
root = tk.Tk()
root.title("Generador de Horarios")

# Dimensiones
screen_width = 1500
screen_height = 800

# establece las dimensiones de la ventana para que ocupe toda la pantalla
root.geometry(f"{screen_width}x{screen_height}+0+0")

# 'label' para mostrar una etiqueta
title_label = tk.Label(root, text="Generador Horario de la U :D")
title_label.pack()

# 'Listbox' para mostrar los cursos disponibles
courses = ch.cursos_sec()
course_listbox = tk.Listbox(root, selectmode=tk.MULTIPLE)
for course in courses:
    course_listbox.insert(tk.END, course)
course_listbox.pack(side=tk.LEFT, padx=10, pady=10, fill=tk.BOTH, expand=True)

# 'Button' para que el usuario pueda generar el horario:
generate_button = tk.Button(root, text="Generar Horario")
generate_button.pack()

# usomos nuestra data
def generate_schedule():
    selected_course = course_listbox.get(course_listbox.curselection())
    # Utiliza los datos de Excel para generar el horario

# asocia la función generate_schedule con el botón Generar Horario
generate_button.config(command=generate_schedule)

# finalmente, inicia el bucle principal de la aplicacion
root.mainloop()