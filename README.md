<h1 align="center">

![vanillaBox logo](https://rradosic.github.io/vanillaBox.js/img/logo_alt.png)
</h1>

> Simple lightbox plugin written in pure javascript with no dependencies

## Features

* Pure JavaScript, no dependencies
* Swipe gestures
* Minimalistic look
* Image captions
* Multiple galleries per page, each with custom options
* Responsive design 
  * Looks great on mobile and desktop

## Installation

### Manual

1. Download `vanillaBox.min.css` and `vanillaBox.min.js` files from the `dist` folder.
2. Include them somewhere in your project:


```html
<link rel="stylesheet" href="css/vanillaBox.min.css">
<script src="js/vanillaBox.min.js" async></script>
```

## Usage

Initialize the script by running:

```js
let el = document.getElementById("gallery");
let gallery = new VanillaBox(el);
```

where the first argument is an element on which the gallery will be initialized. This will initialize the gallery and by default add an event listener to all thumbnails that will open the gallery with the corresponding image. The HTML code may look like this:

```html
<div id="gallery">
  <img class="thismage" src="img/img1.jpeg" alt="Camera">
  <img class="thismage" src="img/img4.jpeg" vb-data-caption="Best picture ever!">
  <img class="thismage" src="img/img2.jpeg" alt="Whale">
  ...
</div>
```

To use captions put `vb-data-caption` attribute on the `img` tag.

## Customization

You can pass an object with custom options as the second parameter.

```js
let gallery = new VanillaBox(el, {
  // User options
});
```

## API

### `VanillaBox(element, options)`

Initialize vanillaBox.js

* @param `element` {HTMLElement} - HTML element containing \<img> tags
* @param `options` {object} - custom options (see [#Customization](#customization))
* @return {object} - instance of the vanillaBox.js gallery

### `open(index)`

Show the gallery and move the gallery to a specific image

* @param `index` {number} - the position of the image, default is [0]
* @return {boolean} - true on success or false if the index is invalid

Usage:

```js
let gallery =  = VanillaBox(el);
baguetteBox.open(2); //Opens gallery and shows third image
```

### `nextItem()`

Switch to the next item in the gallery

* @return {boolean} - true on success or false if there are no more images to be loaded

### `previousItem()`

Switch to the next item in the gallery

* @return {boolean} - true on success or false if there are no more images to be loaded

### `showItem(index)`

Sets the current item in the gallery to index.

* @return {boolean} - true on success and false if invalid index

### `toggleControls()`

Hides on screen controls

* @return {boolean} - toggle status, true if shown and false if hidden

### `close()`

Closes the gallery

### `destroy`

Remove the plugin with any event bindings

## Compatibility

Desktop:

* IE 11
* Chrome
* Safari
* Firefox
* Opera

Mobile:

* Chrome
* Safari

## License

This content is released under the [MIT License](https://opensource.org/licenses/MIT).

Copyright (c) 2018 [rradosic](https://github.com/rradosic/)
