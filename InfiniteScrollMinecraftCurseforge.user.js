// ==UserScript==
// @name         Infinite Scroll CurseForge Mods
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable infinite scrolling on CurseForge mod pages
// @copyright    Gnu GPL V2
// @icon         https://www.google.com/s2/favicons?domain=curseforge.com
// @match        https://www.curseforge.com/minecraft/mc-mods*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to load the infinite-scroll.js library dynamically
    function loadScript(url, callback) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) { // IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { // Others
            script.onload = function() {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    // Initialize the variable for counting the number of pages loaded
    let pageCount = 0;

    const pageCounterDisplay = document.createElement('div');
    pageCounterDisplay.id = 'pageCounterDisplay';
    pageCounterDisplay.style.position = 'fixed';
    pageCounterDisplay.style.bottom = '10px';
    pageCounterDisplay.style.right = '10px';
    pageCounterDisplay.style.zIndex = '9999';
    pageCounterDisplay.style.padding = '5px';
    pageCounterDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    pageCounterDisplay.style.color = 'white';
    pageCounterDisplay.style.fontFamily = 'Arial, sans-serif';
    pageCounterDisplay.style.fontSize = '14px';
    document.body.appendChild(pageCounterDisplay);

    // Function to increment pageCount and print it to the console
    function incrementPageCount() {
        pageCount++;
        updatePageCounterDisplay();
    }

    function updatePageCounterDisplay() {
        const counterDisplay = document.getElementById('pageCounterDisplay');
        if (counterDisplay) {
            counterDisplay.textContent = `${pageCount}`;
        }
    }



    // Wrap the original console.log function to watch for a specific string
    const originalConsoleLog = console.log;
    const stringToWatch = "[InfiniteScroll] scrollThreshold"; // Replace with the string you want to watch for

    console.log = function(...args) {
        originalConsoleLog.apply(console, args);

        if (args.some(arg => arg.includes(stringToWatch))) {
            incrementPageCount();
        }
    };

    // Load the infinite-scroll.js library and initialize it
    loadScript('https://unpkg.com/infinite-scroll@4/dist/infinite-scroll.pkgd.min.js', function() {
        // Insert the following CSS to hide the pagination controls
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.pagination {}';
        document.head.appendChild(style);

        // Initialize infinite-scroll.js
        const modListContainer = document.querySelector('body > div.flex.flex-col.min-h-full.min-h-screen > main > div.z-0 > div:nth-child(3) > section > div.px-2.flex-1 > div > div:nth-child(3)');
        if (modListContainer) {
            const infScroll = new InfiniteScroll(modListContainer, {
                path: '.pagination-next a',
                append: 'body > div.flex.flex-col.min-h-full.min-h-screen > main > div.z-0 > div:nth-child(3) > section > div.px-2.flex-1 > div > div:nth-child(3) > div',
                history: true,
                checkLastPage: true,
                status: '',
                debug: true
            });
        }
    });
})();
