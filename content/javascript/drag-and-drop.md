---
title: Drag&Drop In JavaScript
date: "2022-05-02"
description: "Drag and drop elements behavior in JavaScript"
---

## Events

In `JavaScript` dragging of elements is based on handling special dragging events.
Some of them are fired on dragging element itself and some are fired, when draggable elements is moved on
top of other elements.

For dragging event handlers will receive [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) which inherits from 
[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent).

### Draggable Element Events

When you start to drag an element will be fired `dragstart` event. Then while dragging will be sequentially fired
`drag` event. And finally, when you release element `dragend` event happens.

**Summary:**

- `dragstart` - on drag start
- `drag` - while dragging
- `dragend` - on drag stop

## Drop Target

Drop target for draggable element is a such element, which will have certain events fired while interacting with this
draggable element.
Most of the `html` elements may be valid drop target. But to activate this possibility need to disable default
handling of drop target events with `event.preventDefault()` on these events.

### Event On Drop Elements

There are also events on possible targets to drop draggable element are fired.
When draggable element crosses target drop element raises `dragenter` event. After that `dragover` event will be risen
sequentially until draggable element will be in the borders of drag target. When draggable element moves outside of
drag target borders `dragleave` will be fired and `dragover` event stops to raise. There is another possible scenario.
If user stops dragging element while remaining in the borders of drag target `dragleave` event will never happen, but
instead `drop` event will be fired.

**Summary:**

- `dragenter` - when draggable element crosses drop target border from outside
- `dragover` - while draggable element is in borders of drop target element
- `dragleave` - when draggable element crosses drop target border from the inside
- `drop` - when dropping draggable element while it is inside drop target element borders

## Data Transfer Between Drag Events

To implement certain behavior it is often required to transfer some data between draggable item events to drop target events.
To achieve this there is a `event.dataTransfer` object on dragging events.

It has methods to set and get data:

- `event.dataTransfer.setData(<format>, <data>)` - puts some data in defined format
- `event.dataTransfer(<format>)` - retrieves data from data transfer object by specified format

`<format>` could possibly be:
  - `text/plain` 
  - `text/uri-list`

References

- [JavaScript Drag and Drop](https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/)