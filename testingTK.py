import tkinter as tk

win = tk.Tk()
win.geometry("1200x600")
win.title('Testing TK')
#win.resizable(0, 0)

win.rowconfigure(0, weight=1)
win.rowconfigure(1, weight=3)
win.rowconfigure(2, weight=1)

win.columnconfigure(0, weight=3)
win.columnconfigure(1, weight=2)

label1 = tk.Label(win, text="label1", bg="green")
label2 = tk.Label(win, text="label2", bg="red")
label3 = tk.Label(win, text="label3", bg="blue")
label4 = tk.Label(win, text="label4", bg="yellow")
label5 = tk.Label(win, text="label5", bg="yellow")

label1.grid(row=0, column=0, sticky='ew', ipadx=10, ipady=10 , padx=(50,120), pady=(80,5))
label5.grid(row=0, column=0, sticky='e', ipadx=10, ipady=10, padx=50, pady=(80,5))
label2.grid(row=1, column=0, sticky='nsew', padx=50, pady=(5,5))
label3.grid(row=0, column=1, sticky='nsew', padx=50, pady=(120,5), rowspan=2)
label4.grid(row=2, column=0, sticky='', ipadx=40, ipady=20, padx=5, pady=5, columnspan=2)



win.mainloop()