(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
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


    //
    // Methods
    //

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
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
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
        let overlay = document.createElement('div');
         overlay.className ="vb-overlay";
 
         //Build image container
        let imageContainer = document.createElement('div');
         imageContainer.className = "vb-image-container";
         
         overlay.appendChild(imageContainer);
         
         //Build controls
         let previousArrow = `
         <div class="vb-previousArea">
             <svg class ="vb-previous"> 
                 <polyline class="vb-arrow"  points="30,1 2.5,41 30,81" stroke="rgba(200,200,200,0.7)" stroke-width="4" 
                 fill="none" stroke-linejoin="round"/> 
             </svg>
         </div>`;
         let nextArrow = `
         <div class="vb-nextArea">
             <svg class ="vb-next"> 
                 <polyline class="vb-arrow" points="1,1 31,41 1,81" stroke="rgba(200,200,200,0.7)" stroke-width="4" 
                 fill="none" stroke-linejoin="round"/>
             </svg>
         </div>`;
         overlay.innerHTML += previousArrow;
         overlay.innerHTML += nextArrow;

         return overlay;
    };

   
    var setImageInContainer = function(container,img){
        container.innerHTML = "";

        img.classList.add('fadeIn');
        container.appendChild(img);
        console.log(container);
    };

    var removeOverlay = function(overlay){
        overlay.classList.remove("fadeIn");
        overlay.classList.toggle("fadeOut");
        console.log("timeout")
        setTimeout(function(){document.body.removeChild(overlay);}, 250);
        
    };


    /**
     * Another public method
     */
    var VanillaBox = function(element,options){

        var vanillaBox = {}; // Placeholder for public methods

        var overlay;
        var imageContainer;
        var nextButton;
        var previousButton;
        var settings;
        var images = [];
        var captions = [];
        var currentIndex = 0;

        vanillaBox.init = function (element, options ) {

            // Merge user options with defaults
            settings = extend( defaults, options || {} );
            
            let imgElements = element.getElementsByTagName("img");
            
            var count = 0;
            let ref = this;
            for (let img of imgElements) {
                images.push(img.src);
                captions.push(img.alt);
                img.dataset.vbIndex = count;
                img.addEventListener("click",function(){
                    ref.open(this.dataset.vbIndex);
                })
                count += 1;
            }
            
            overlay = buildOverlay();
            imageContainer = overlay.getElementsByClassName("vb-image-container")[0]
            nextButton = overlay.getElementsByClassName("vb-nextArea")[0]
            previousButton = overlay.getElementsByClassName("vb-previousArea")[0]

            overlay.addEventListener("click",function(){               
                ref.close();
            })

            nextButton.addEventListener("click",function(e){   
                e.cancelBubble = true;            
                ref.nextItem();
            })

            previousButton.addEventListener("click",function(e){   
                e.cancelBubble = true;            
                ref.previousItem();
            })

            return vanillaBox;
        };
    
    
        //
        // Public APIs
        //
        vanillaBox.showImage = function(index=0){
            let imageElement = document.createElement('img')
            imageElement.src = images[index];
            currentIndex = index;

            setImageInContainer(imageContainer, imageElement);
        }
    
        vanillaBox.open = function(index = 0){
            overlay = document.body.appendChild(overlay);
            overlay.classList.remove("fadeOut");            
            overlay.classList.toggle("fadeIn");
            imageContainer.innerHTML = "";
            this.showImage(index);

        };

        vanillaBox.close = function(){
            removeOverlay(overlay);
        };

        vanillaBox.nextItem = function(){
            currentIndex++;
            console.log(currentIndex);
            if(currentIndex == images.length){
                currentIndex = 0;
            }
            this.showImage(currentIndex);
        };

        vanillaBox.previousItem = function(){
            currentIndex--;
            console.log(currentIndex);
            if(currentIndex < 0){
                currentIndex = images.length -1;
            }
            this.showImage(currentIndex);
        };

        vanillaBox.init(element, options);
        return vanillaBox;
    }
    

    return VanillaBox;

});