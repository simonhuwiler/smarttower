import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from math import pi

def plot_dataframe(df, legend = [], print_dataframe = False, title = ""):
    
    categories = ['restriktive_finanzpolitik', 'liberale_wirtschaftspolitik', 'offene_aussenpolitik', 'liberale_gesellschaft',
                  'ausgebauter_sozialstaat', 'ausgebauter_umweltschutz', 'restriktive_migrationspolitik', 'law_order']
    
    N = len(categories)

    # What will be the angle of each axis in the plot? (we divide the plot / number of variable)
    angles = [n / float(N) * 2 * pi for n in range(N)]
    angles += angles[:1]
    
    #Size
    plt.figure(figsize=(10, 10))
    
    ax = plt.subplot(111, polar=True)
    # Draw one axe per variable + add labels labels yet
    plt.xticks(angles[:-1], categories, color='grey', size=11)

    # Draw ylabels
    ax.set_rlabel_position(0)
    plt.yticks([25,50,75], ["25","50","75"], color="grey", size=8)
    plt.ylim(0,100)
    
    counter = 0
    for index, row in df.iterrows():
        #Prepare Values
        values = list(row[categories])
        values += values[:1]

        # Plot data
        if len(legend) > counter:
            lbl = legend[counter]
        else:
            lbl = None

        ax.plot(angles, values, linewidth=1, linestyle='solid', label=lbl)
        ax.fill(angles, values, 'b', alpha=0.1)
        
        #for idx, an in enumerate(angles):
        #    plt.text(an, round(values[idx]), str(values[idx]), color="grey", size=8)
        
        counter += 1

    #ax.plot(angles, values2, linewidth=1, linestyle='solid', label='V')
    #ax.fill(angles, values2, 'b', alpha=0.1)

    #Add title
    if title != "":
        plt.title(label=title, fontdict={'fontsize': 22})

    # Add legend
    if len(legend) > 0:
        plt.legend(bbox_to_anchor=(0.1, 0.1))

    if print_dataframe:
        from IPython.core.display import HTML
        display(HTML("<h3>Data</h3>"))
        display(df[categories])
        display(HTML("<h3>Smartspider</h3>"))