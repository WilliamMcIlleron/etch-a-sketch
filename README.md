# Etch A Sketch

Move across the grid to draw. Go over the same square twice and the colour deepens. Hold
the mouse button down to lighten it again.

**[Live demo](https://williammcilleron.github.io/etch-a-sketch/)**

## How it works

Every cell tracks a shade from 0 to 10. Painting a fresh cell picks a colour and starts it
at 10% opacity; each pass after that adds another 10% until it's solid. The colour is
stored on the cell, so a second pass deepens what's already there instead of picking a new
hue, and lightening walks the same number back down without changing it.

Holding the mouse button lightens rather than darkens, which is the quickest way to pull a
highlight back out of something you overworked. It only overrides the Rainbow and Colour
brushes: if you have deliberately picked Eraser or Lighten, holding does what you asked.
Touch cannot hover, so the Lighten brush exists to make the same thing reachable there and
from the keyboard.

## Saving

**Save PNG** exports a 1024 × 1024 image. The drawing lives in the DOM, so the export
repaints each cell onto a canvas, reading inline styles rather than computed ones: the
values are the ones we set ourselves, and 10,000 `getComputedStyle` calls would force a
layout pass each time. Cells are drawn a fraction of a pixel oversized so no seams show
through at awkward grid sizes.

Rainbow mode generates colours in HSL with a fixed saturation and lightness band, which
avoids the muddy greys you get from picking three raw RGB channels at random.

## Notes

- Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.
- Works with touch. Mouse draws on hover the way the physical toy does; touch needs a
  deliberate drag, otherwise the first tap would scribble on the way in.
- The grid is built from a single string rather than thousands of `appendChild` calls. At
  100 × 100 that's 10,000 nodes and the difference is easy to see.
- Respects `prefers-reduced-motion`.

## Running it

No build step. Open `index.html`, or serve the folder:

```bash
python -m http.server
```

Built by [William McIlleron](https://williammcilleron.netlify.app).
