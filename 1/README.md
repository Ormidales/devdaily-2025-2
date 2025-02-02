# Advanced Calculator Web App

## Overview
This project is a micro-application developed as part of the Daily Dev 2025-2 challenge. It is a web-based advanced calculator designed to perform not only basic arithmetic operations but also a range of scientific and advanced mathematical functions. The application demonstrates a practical integration of modern web development techniques and libraries, including responsive design with TailwindCSS, secure expression evaluation with math.js, and symbolic computation using Algebrite.

## Features
- **Basic Arithmetic:** Perform standard operations such as addition, subtraction, multiplication, and division.
- **Scientific Functions:** Supports trigonometric functions (sin, cos, tan), logarithms (log, ln), exponentials, factorials, and more.
- **Advanced Mathematics:** 
    - Calculus: Calculate derivatives and perform symbolic integration.
    - Equation Solving: Solve linear, quadratic, and non-linear equations.
    - Complex Numbers & Matrices: Input and compute with complex numbers and matrices.
- **Memory Functions:** Save and recall values with memory buttons (M+, M-, MR, MC).
- **Undo/Redo Functionality:** Easily revert or reapply changes.
- **User-Friendly & Responsive:** Clean interface with error handling and adaptive layout for multiple devices.

## Technologies
- **HTML5:** Structure of the application.
- **CSS3 / Tailwind CSS:** For styling and responsive design.
- **JavaScript (ES6):** Core language for implementing the calculator logic and interactivity.
- **Math.js:** Secure evaluation of mathematical expressions.
- **Algebrite:** Symbolic computation for calculus operations and equation solving.

## Usage
- **Input Expressions:** Use the on-screen buttons or your keyboard to enter mathematical expressions.
- **Advanced Operations:**
    - Click d/dx to differentiate an expression with respect to x.
    - Click ∫ to integrate an expression symbolically.
    - Click Résoudre to solve equations (ensure your equation includes an "=" sign).
- **Memory & Navigation:** Use memory buttons for storing numbers, and undo/redo to manage your input history.
- **Responsive Design:** The application adjusts its layout for optimal viewing on both desktop and mobile devices.

## Project Structure
- **index.html:** Main HTML file containing the calculator interface and layout.
- **index.js:** JavaScript file handling functionality such as expression evaluation, advanced mathematical operations, and UI interactions.
- **Assets:** External libraries (TailwindCSS, math.js, Algebrite) are integrated via CDN links for ease of setup.

## License
This project is licensed under the MIT License. See the LICENSE file for full details.