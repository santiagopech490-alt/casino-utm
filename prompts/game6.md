# Especificación de Sistema: Simulador de Cartas Gacha (Versión Educativa)

## 1. Descripción General
Simulador interactivo diseñado para dispositivos web que utiliza mecánicas de apertura de "Cajas de Botín" (Loot Boxes) para enseñar conceptos avanzados de estadística. El objetivo principal es desmitificar la "suerte" mediante la exposición de la independencia de eventos y la probabilidad acumulada. **Toda la interfaz y los mensajes deben estar estrictamente en español.**

## 2. Parámetros de Simulación
- **Sistema de Costos:**
  - 1 Sobre (10 cartas): 160 fichas.
  - 10 Sobres (100 cartas): 1400 fichas (Descuento).
- **Tabla de Probabilidades (Tasas de Obtención):**
  - **Legendario (L):** 5%
  - **Épico (E):** 20%
  - **Raro (R):** 50%
  - **Común (C):** 100% (Basado en lógica de umbral: `rng <= 5` L, `rng <= 20` E, etc.)

## 3. Lógica Técnica y Algoritmos
- **Independencia de Eventos:** Cada carta debe generarse mediante una función de aleatoriedad pura (`Math.random() * 100`). No se permiten sistemas de "Garantía" (Pity) para mantener el rigor educativo.
- **Cálculo de Fracaso Acumulado:** Implementar la fórmula $P(\text{fallar})^n$ donde $P$ es 0.95 y $n$ es el número de intentos fallidos consecutivos.
- **Frecuencia Esperada:** Cálculo de la media estadística mediante $E = n \times p$ (Intentos × 0.05).

## 4. Interfaz de Usuario (UI) y Experiencia (UX)
- **Cabecera:** Título del juego y el mito: *"Mito: 'Si compras muchas cajas, seguro obtendrás el objeto legendario.'"*. Justo debajo, la breve explicación de cómo se rompió este mito mediante la demostración de la independencia de eventos y la probabilidad acumulada.
- **Visualización de Cartas:** 
  - Las cartas deben presentarse físicamente con dimensiones de `140x200px`.
  - Animación de entrada: `flipIn` (rotación en el eje Y) con suspenso de 60ms entre cada carta.
- **Sistema de Pantallas CRT (Feedback de Rareza):**
  - **Pantalla Central (Grande):** Muestra el estado del sistema y mensajes críticos. Al obtener una carta **Legendaria**, muestra "¡LEGENDARIA DETECTADA!" con brillo dorado.
  - **Pantalla Derecha (Pequeña):** Dedicada a cartas **Épicas**. Al obtener una, muestra "¡EPICA ENCONTRADA!" con brillo púrpura.
  - **Pantalla Izquierda (Pequeña):** Dedicada a cartas **Raras**. Al obtener una, muestra "¡RARA DETECTADA!" con brillo azul.
- **Mensaje de Victoria Legendaria:** Al obtener una carta legendaria, **DEBE aparecer un modal de sistema impactante de forma inmediata** (estilo Cyberpunk/Terminal, bordes dorados neon, desenfoque de fondo). Este modal se activa en el instante en que se descubre la primera carta legendaria durante la animación de apertura del mazo (con un ligero retraso de 300ms para permitir ver la carta), interrumpiendo visualmente el proceso para celebrar el hallazgo (ej: "SIMULADOR GACHA: ¡LEGENDARIA!"). Debe celebrar que se obtuvo una carta en el "Simulador de Cartas Gacha" e integrar obligatoriamente el recordatorio educativo: "Recuerda: el azar no tiene memoria y la probabilidad para tu siguiente sobre sigue siendo exactamente del 5%".
- **Notificación Emergente (Toast):** Además del modal, cada vez que se obtenga una carta legendaria, debe aparecer una notificación emergente (Toast) rápida en la esquina de la pantalla confirmando el hallazgo ("¡LEGENDARIA DETECTADA!"), la cual desaparece automáticamente sin bloquear el flujo del juego.
- **Traducción y Localización:** Toda la interfaz, etiquetas de datos (Dashboard), mensajes de error, estados del sistema y lecciones educativas deben estar estrictamente en español neutro, utilizando un tono técnico y futurista.

## 5. Protocolo de Intervención Educativa
El sistema debe activar un **Módulo de Realidad Estadística** bajo la siguiente condición:
- **Disparador:** Cada 150 intentos fallidos consecutivos.
- **Contenido del Mensaje:**
  1. Mostrar el % de probabilidad acumulada de haber fallado $n$ veces.
  2. Mostrar la frecuencia esperada frente a los resultados reales.
  3. Reforzar el concepto de que el siguiente intento no tiene probabilidades alteradas por el historial previo.

## 6. Flujo de Control (Scripts)
- `rollRarity()`: Determina la rareza de la carta.
- `buyPack(amount)`: Gestiona la deducción de fichas, el bucle de generación de cartas y la actualización de la interfaz.
- `showEducation()`: Renderiza el panel informativo con los cálculos de probabilidad actuales.
