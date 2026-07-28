/* ==========================================================================
   Etch A Sketch

   Each cell tracks a shade from 0 to 10. Painting a fresh cell picks a colour
   and starts at 10% opacity; every pass after that adds another 10% until it
   is solid. That is the whole trick.
   ========================================================================== */

(function () {
    'use strict';

    var grid = document.getElementById('grid');
    var sizeInput = document.getElementById('size');
    var sizeValue = document.getElementById('sizeValue');
    var colourInput = document.getElementById('colour');
    var linesInput = document.getElementById('lines');
    var clearBtn = document.getElementById('clear');
    var modeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-mode]'));

    var STEPS = 10;
    var mode = 'rainbow';
    var drawing = false;

    /* --- Grid ------------------------------------------------------------- */

    function buildGrid(size) {
        // One string beats `size * size` appendChild calls; at 100x100 that is
        // 10,000 nodes and the difference is very visible.
        grid.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';
        grid.innerHTML = new Array(size * size + 1).join('<div class="cell"></div>');
        sizeValue.textContent = size + ' × ' + size;
    }

    function clearGrid() {
        Array.prototype.forEach.call(grid.children, function (cell) {
            cell.style.backgroundColor = '';
            delete cell.dataset.shade;
        });
    }

    /* --- Painting --------------------------------------------------------- */

    function paint(cell) {
        if (!cell || !cell.classList.contains('cell')) return;

        if (mode === 'eraser') {
            cell.style.backgroundColor = '';
            delete cell.dataset.shade;
            return;
        }

        var shade = Number(cell.dataset.shade || 0);

        // A fresh cell gets a colour; an already-painted one just deepens, so a
        // second pass never changes the hue underneath.
        if (!shade) {
            cell.dataset.colour = mode === 'rainbow' ? randomColour() : hexToRgb(colourInput.value);
        }

        shade = Math.min(shade + 1, STEPS);
        cell.dataset.shade = shade;
        cell.style.backgroundColor = 'rgba(' + cell.dataset.colour + ', ' + (shade / STEPS) + ')';
    }

    function randomColour() {
        // HSL with a fixed saturation and lightness band avoids the muddy greys
        // that picking three raw RGB channels tends to produce.
        var h = Math.floor(Math.random() * 360);
        return hslToRgb(h, 65, 55);
    }

    function hexToRgb(hex) {
        var n = parseInt(hex.slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(', ');
    }

    function hslToRgb(h, s, l) {
        s /= 100; l /= 100;
        var k = function (n) { return (n + h / 30) % 12; };
        var a = s * Math.min(l, 1 - l);
        var f = function (n) {
            return Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
        };
        return [f(0), f(8), f(4)].join(', ');
    }

    /* --- Input ------------------------------------------------------------ */

    // Mouse hovers to draw, the way the original toy behaves. Touch needs a
    // deliberate drag, otherwise the first tap would scribble on the way in.
    grid.addEventListener('pointerover', function (event) {
        if (event.pointerType === 'mouse' || drawing) paint(event.target);
    });

    grid.addEventListener('pointerdown', function (event) {
        drawing = true;
        paint(event.target);
        event.preventDefault();
    });

    // Touch doesn't fire pointerover on the element under a moving finger, so
    // resolve it by coordinates instead.
    grid.addEventListener('pointermove', function (event) {
        if (!drawing || event.pointerType === 'mouse') return;
        paint(document.elementFromPoint(event.clientX, event.clientY));
    });

    window.addEventListener('pointerup', function () { drawing = false; });
    window.addEventListener('pointercancel', function () { drawing = false; });

    /* --- Controls --------------------------------------------------------- */

    // A radiogroup is expected to behave like one: arrow keys move between the
    // options, and only the selected option is in the tab order.
    function selectMode(button, moveFocus) {
        mode = button.dataset.mode;
        modeButtons.forEach(function (other) {
            var on = other === button;
            other.setAttribute('aria-checked', String(on));
            other.tabIndex = on ? 0 : -1;
        });
        if (moveFocus) button.focus();
    }

    modeButtons.forEach(function (button, i) {
        button.addEventListener('click', function () { selectMode(button); });

        button.addEventListener('keydown', function (event) {
            var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
            if (!step) return;
            event.preventDefault();
            selectMode(modeButtons[(i + step + modeButtons.length) % modeButtons.length], true);
        });
    });

    // Resize while you drag rather than only on release, throttled to one
    // rebuild per frame so dragging near 100 doesn't queue up dozens of them.
    var pendingResize = null;

    sizeInput.addEventListener('input', function () {
        sizeValue.textContent = sizeInput.value + ' × ' + sizeInput.value;
        if (pendingResize) return;
        pendingResize = requestAnimationFrame(function () {
            pendingResize = null;
            buildGrid(Number(sizeInput.value));
        });
    });

    // Catches the final value if the last frame landed mid-drag.
    sizeInput.addEventListener('change', function () {
        buildGrid(Number(sizeInput.value));
    });

    linesInput.addEventListener('change', function () {
        grid.classList.toggle('show-lines', linesInput.checked);
    });

    clearBtn.addEventListener('click', clearGrid);

    // Picking a colour should switch you to the colour brush; having to press
    // two things to use it is the sort of small friction nobody reports.
    colourInput.addEventListener('input', function () {
        if (mode !== 'solid') document.querySelector('[data-mode="solid"]').click();
    });

    /* --- Start ------------------------------------------------------------ */

    grid.classList.toggle('show-lines', linesInput.checked);
    selectMode(document.querySelector('[data-mode="' + mode + '"]'));
    buildGrid(Number(sizeInput.value));
})();
