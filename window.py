import pandas as pd
from IPython.display import display
import ipywidgets as widgets

time_range = pd.date_range('07:00:00', '22:00:00', freq='H')

weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
df = pd.DataFrame(columns=['Hora'] + weekdays)

# Agrega el rango de tiempo al DataFrame
df['Hora'] = time_range

# Establece la columna "Hora" como índice del DataFrame
df.set_index('Hora', inplace=True)

# Define una función para actualizar la tabla del horario
def update_table():
    display(df)

# Crea un botón para actualizar la tabla del horario
button = widgets.Button(description='Actualizar horario')

# Define la acción que se debe llevar a cabo al hacer clic en
button.on_click(update_table)

# Muestra la tabla del horario y el botón para actualizarla
display(df)
display(button)
