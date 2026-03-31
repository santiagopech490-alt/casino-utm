# Especificación de Sistema: Gacha Card Simulator (Educational Version)

## 1. Descripción General
Simulador interactivo diseñado para dispositivos web que utiliza mecánicas de apertura de "Loot Boxes" para enseñar conceptos avanzados de estadística. El objetivo principal es desmitificar la "suerte" mediante la exposición de la independencia de eventos y la probabilidad acumulada.

## 2. Parámetros de Simulación
- **Sistema de Costos:**
  - 1 Mazo (10 cartas): 160 fichas.
  - 10 Mazos (100 cartas): 1400 fichas (Descuento).
- **Tabla de Probabilidades (Drop Rates):**
  - **Legendario (L):** 5%
  - **Épico (E):** 20%
  - **Raro (R):** 50%
  - **Común (C):** 100% (Basado en lógica de umbral: `rng <= 5` L, `rng <= 20` E, etc.)

## 3. Lógica Técnica y Algoritmos
- **Independencia de Eventos:** Cada carta debe generarse mediante una función de aleatoriedad pura (`Math.random() * 100`). No se permiten sistemas de "Pity" (garantías de drop) para mantener el rigor educativo.
- **Cálculo de Fracaso Acumulado:** Implementar la fórmula $P(\text{fallar})^n$ donde $P$ es 0.95 y $n$ es el número de intentos fallidos consecutivos.
- **Frecuencia Esperada:** Cálculo de la media estadística mediante $E = n \times p$ (Intentos × 0.05).

## 4. Interfaz de Usuario (UI) y Experiencia (UX)
- **Cabecera:** Título del juego y el mito: *"Si compras muchas cajas, seguro obtendrás el objeto legendario."*. Justo debajo, la breve explicación de cómo se rompió este mito mediante la demostración de la independencia de eventos y la probabilidad acumulada (el hecho de que cada caja es un evento nuevo y no garantiza el éxito previo).
- **Visualización de Cartas:** - Las cartas deben presentarse físicamente con dimensiones de `140x200px`.
  - Animación de entrada: `flipIn` (rotación en el eje Y) con suspense de 60ms entre cada carta.
  - Código de colores:
    - Legendario: Dorado (`#f59e0b`) con animación `glow`.
    - Épico: Púrpura (`#a855f7`).
    - Raro: Azul (`#3b82f6`).
    - Común: Gris (`#94a3b8`).
- **Dashboard en Tiempo Real:** Barra superior fija que muestra Saldo, Intentos Totales y Contador de Legendarias.

## 5. Protocolo de Intervención Educativa
El sistema debe activar un **Módulo de Realidad Estadística** bajo la siguiente condición:
- **Disparador:** Cada 150 intentos fallidos consecutivos.
- **Contenido del Mensaje:**
  1. Mostrar el % de probabilidad acumulada de haber fallado $n$ veces.
  2. Mostrar la frecuencia esperada frente a los resultados reales.
  3. Reforzar el concepto de que el siguiente intento no tiene probabilidades alteradas por el historial previo.

## 6. Flujo de Control (Scripts)
- `rollRarity()`: Determina la rareza de la carta.
- `buyPack(amount)`: Gestiona la deducción de fichas, el bucle de generación de cartas y la actualización de la UI.
- `showEducation()`: Renderiza el modal informativo con los cálculos de probabilidad actuales.
-