import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib.animation as animation

# Configurações do Seaborn para o estilo escuro
sns.set(style='darkgrid')

# Parâmetros
L = 10.0  # Comprimento do domínio
N = 100  # Número de pontos no espaço
dx = L / N  # Passo no espaço
D = 1.0  # Coeficiente de difusão
dt = 0.01  # Passo no tempo
T = 2.0  # Tempo total de simulação
n_steps = int(T / dt)  # Número de passos no tempo

# Criação do domínio espacial
x = np.linspace(0, L, N)

# Condição inicial: distribuição concentrada no centro
u = np.zeros(N)
u[N//2] = 1.0 / dx  # Pico no centro

# Função para atualizar a distribuição no tempo
def update(u, D, dx, dt):
    u_new = u.copy()
    for i in range(1, N-1):
        u_new[i] = u[i] + D * dt / dx**2 * (u[i+1] - 2*u[i] + u[i-1])
    return u_new

# Configuração da figura para animação
fig, ax = plt.subplots()
line, = ax.plot(x, u, lw=2)
ax.set_ylim(0, 1.5)
ax.set_xlabel('Posição')
ax.set_ylabel('Concentração')
ax.set_title('Evolução da Difusão ao Longo do Tempo')

# Função de animação
def animate(frame):
    global u
    u = update(u, D, dx, dt)
    line.set_ydata(u)
    return line,

# Criação da animação
ani = animation.FuncAnimation(fig, animate, frames=n_steps, interval=50, blit=True)

# Exibição da animação
plt.show()
