//UMD, AMD, CJS
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.VanillaBox = factory(root);
    }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

    'use strict';

    // Default settings
    var defaults = {
        animation: "",

    };

    /**
     * Merge two or more objects. Returns a new object.
     * @private
     * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param {Object}   objects  The objects to merge together
     * @returns {Object}          Merged values of defaults and options
     */
    var extend = function () {

        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    // If deep merge and property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    };

    /**
     * A private method
     * @private
     */
    var buildOverlay = function () {
        //Build black overlay
        var overlay = document.createElement('div');
        overlay.className = "vb-overlay";

        //Build image container
        var imageContainer = document.createElement('div');
        imageContainer.className = "vb-image-container";

        overlay.appendChild(imageContainer);

        var descContainer = document.createElement("div");
        descContainer.className = "vb-desc-container";

        var descText = document.createElement("span");
        descText.className = "vb-desc-text";
        descContainer.appendChild(descText);

        overlay.appendChild(descContainer);

        //Build controls
        var previousArrow =
            '<div class="vb-previous-area">' +
            '<svg class ="vb-previous" width="35px" height="90px"> ' +
            '<polyline class="vb-arrow"  points="30,1 2.5,41 30,81" stroke="rgba(200,200,200,0.7)" stroke-width="5" fill="none" stroke-linejoin="round"/> ' +
            '</svg>' +
            '</div>';
        var nextArrow =
            '<div class="vb-next-area">' +
            '<svg class ="vb-next" width="35px" height="90px">' +
            '<polyline class="vb-arrow" points="1,1 31,41 1,81" stroke="rgba(200,200,200,0.7)" stroke-width="5" fill="none" stroke-linejoin="round"/>' +
            '</svg>' +
            '</div>';
        var closeButton =
            '<div class="vb-close-area">' +
            '<svg class ="vb-close" width="35px" height="35px">' +
            '<polyline class="vb-x" points="1,1 34,34" stroke="rgba(200,200,200,0.9)" stroke-width="4" fill="none" stroke-linejoin="round"/>' +
            '<polyline class="vb-x" points="34,1 1,34" stroke="rgba(200,200,200,0.9)" stroke-width="4" fill="none" stroke-linejoin="round"/>' +
            '</svg>' +
            '</div>';

        overlay.innerHTML += previousArrow;
        overlay.innerHTML += nextArrow;
        overlay.innerHTML += closeButton;

        return overlay;
    };


    var setImageInContainer = function (container, img) {
        container.innerHTML = "";

        img.classList.add('fadeIn');
        container.appendChild(img);
        console.log(container);
    };

    var removeOverlay = function (overlay) {
        overlay.classList.remove("fadeIn");
        overlay.classList.toggle("fadeOut");
        setTimeout(function () {
            document.body.removeChild(overlay);
        }, 250);

    };

    var setControlsHidden = function (overlay, controlsHidden) {
        overlay.classList.remove("fadeIn");
        for (var i = 0; i < overlay.children.length; i++) {
            var el = overlay.children[i];
            if (el.classList.contains("vb-image-container") || el.classList.contains("vb-desc-container")) {

            } else {
                if (controlsHidden) {
                    el.classList.remove("fadeIn");
                    el.classList.add("fadeOut");
                } else{
                    el.classList.remove("fadeOut");
                    el.classList.add("fadeIn");
                }
            }
        }
        return controlsHidden;
    };

    var hideDescription = function (descContainer) {
        descContainer.classList.remove("fadeIn");
        descContainer.classList.add("fadeOut");

    };

    var showDescription = function (descContainer) {
        descContainer.classList.remove("fadeOut");
        descContainer.classList.add("fadeIn");
    };

    var handleTouchGesture = function (startX, endX, ref) {
        var diff = endX - startX;
        var tolerance = 100;
        if (diff > tolerance) {
            ref.previousItem();
        } else if (diff < -tolerance) {
            ref.nextItem();
        }
    };

    var handleKeyPress = function (key, ref) {
        switch (key) {
            case 37:
                ref.previousItem();
                break;
            case 39:
                ref.previousItem();
                break;
            default:
                return false;
        }
        return true;
    };


    /**
     * Constructor
     */
    var VanillaBox = function (element, options) {

        var vanillaBox = {}; // Placeholder for public methods
        var isOpened = false;
        //Reference vars
        var overlay, imageContainer, descContainer, descText, nextButton, previousButton, settings;

        var images = [];
        var captions = [];
        var currentIndex = 0;
        var controlsHidden = false;

        vanillaBox.init = function (element, options) {

            // Merge user options with defaults
            settings = extend(defaults, options || {});

            let imgElements = element.getElementsByTagName("img");

            let ref = this;
            for (let i = 0; i < imgElements.length; i++) {
                let src = imgElements[i].dataset.vbHighRes || imgElements[i].src
                images.push(src);
                captions.push(imgElements[i].dataset.vbCaption);

                imgElements[i].dataset.vbIndex = i;

                imgElements[i].addEventListener("click", function () {
                    ref.open(this.dataset.vbIndex);
                })
            }

            overlay = buildOverlay();

            //Get references to elements
            imageContainer = overlay.getElementsByClassName("vb-image-container")[0];
            descContainer = overlay.getElementsByClassName("vb-desc-container")[0];
            descText = overlay.getElementsByClassName("vb-desc-text")[0];
            nextButton = overlay.getElementsByClassName("vb-next-area")[0];
            previousButton = overlay.getElementsByClassName("vb-previous-area")[0];

            var startX, endX;

            imageContainer.addEventListener("touchstart", function (e) {
                startX = e.touches[0].clientX;
            });

            imageContainer.addEventListener("touchend", function (e) {
                endX = e.changedTouches[0].clientX;
                handleTouchGesture(startX, endX, ref);
            });

            imageContainer.addEventListener("keyup", function (e) {
                var key = e.key;
                console.log(e)
                handleKeyPress(key, this);
            });

            overlay.addEventListener("click", function (e) {
                if (e.target.tagName.toLowerCase() != "img") {
                    ref.close();
                } else {
                    ref.toggleControls();

                }
            });

            nextButton.addEventListener("click", function (e) {
                if(!controlsHidden){
                    e.cancelBubble = true;
                    ref.nextItem();
                } 
            })

            previousButton.addEventListener("click", function (e) {
                if(!controlsHidden){
                    e.cancelBubble = true;
                    ref.previousItem();
                } 
            })

            return vanillaBox;
        };


        //
        // Public APIs
        //

        vanillaBox.showItem = function (index) {
            if (!index) index = 0; //IE11 default parameter workaround
            let imageElement = document.createElement('img')
            imageElement.src = images[index];
            currentIndex = index;
            if(captions[index]){
                if (descContainer.classList.contains("fadeOut") && !controlsHidden){
                    showDescription(descContainer);
                } 
                descText.innerHTML = captions[index];
            }
            else if(!captions[index] && !isOpened){
                hideDescription(descContainer);
                descText.innerHTML = "";
            }
            else{
                hideDescription(descContainer);
            }
            setImageInContainer(imageContainer, imageElement);
        };

        vanillaBox.open = function (index) {
            if (!index) index = 0; //IE11 default parameter workaround 
            controlsHidden = setControlsHidden(overlay, false);
            overlay.classList.remove("fadeOut");
            imageContainer.innerHTML = "";
            this.showItem(index);
            
            overlay = document.body.appendChild(overlay);
            overlay.classList.toggle("fadeIn");
            isOpened = true;
        };

        vanillaBox.close = function () {
            removeOverlay(overlay);
            isOpened = false;
        };

        vanillaBox.hideControls = function () {
            controlsHidden = setControlsHidden(overlay,true);
            hideDescription(descContainer);
        };

        vanillaBox.toggleControls = function () {
            controlsHidden = setControlsHidden(overlay,!controlsHidden);
            if(controlsHidden){
                hideDescription(descContainer)
            } else if(captions[currentIndex]){
                showDescription(descContainer);
            } 
        };

        vanillaBox.nextItem = function () {
            currentIndex++;
            console.log(currentIndex);
            if (currentIndex == images.length) {
                currentIndex = 0;
            }
            this.showItem(currentIndex);
        };

        vanillaBox.previousItem = function () {
            currentIndex--;
            console.log(currentIndex);
            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }
            this.showItem(currentIndex);
        };

        vanillaBox.init(element, options);
        return vanillaBox;
    }


    return VanillaBox;

});