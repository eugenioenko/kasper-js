/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/kasper.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/demo.ts":
/*!*********************!*\
  !*** ./src/demo.ts ***!
  \*********************/
/*! exports provided: DemoSource1, DemoSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemoSource1", function() { return DemoSource1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DemoSource", function() { return DemoSource; });
const DemoSource1 = `
<body    >
<div         class="block w-full flex" id="block"></div>
<img       src="http://url.image.com" border  =  0 />
<div class='b-nana'></div>
<input type=checkbox value =    something />
</body>
`;
const DemoSource = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML5 Test Page</title>
  </head>
  <body>
    <div id="top" role="document">
      <header>
        <h1>HTML5 Test Page</h1>
        <p>This is a test page filled with common HTML elements to be used to provide visual feedback whilst building CSS systems and frameworks.</p>
      </header>
      <nav>
        <ul>
          <li>
            <a href="#text">Text</a>
            <ul>
              <li><a href="#text__headings">Headings</a></li>
              <li><a href="#text__paragraphs">Paragraphs</a></li>
              <li><a href="#text__lists">Lists</a></li>
              <li><a href="#text__blockquotes">Blockquotes</a></li>
              <li><a href="#text__details">Details / Summary</a></li>
              <li><a href="#text__address">Address</a></li>
              <li><a href="#text__hr">Horizontal rules</a></li>
              <li><a href="#text__tables">Tabular data</a></li>
              <li><a href="#text__code">Code</a></li>
              <li><a href="#text__inline">Inline elements</a></li>
              <li><a href="#text__comments">HTML Comments</a></li>
            </ul>
          </li>
          <li>
            <a href="#embedded">Embedded content</a>
            <ul>
              <li><a href="#embedded__images">Images</a></li>
              <li><a href="#embedded__bgimages">Background images</a></li>
              <li><a href="#embedded__audio">Audio</a></li>
              <li><a href="#embedded__video">Video</a></li>
              <li><a href="#embedded__canvas">Canvas</a></li>
              <li><a href="#embedded__meter">Meter</a></li>
              <li><a href="#embedded__progress">Progress</a></li>
              <li><a href="#embedded__svg">Inline SVG</a></li>
              <li><a href="#embedded__iframe">IFrames</a></li>
              <li><a href="#embedded__embed">Embed</a></li>
              <li><a href="#embedded__object">Object</a></li>
            </ul>
          </li>
          <li>
            <a href="#forms">Form elements</a>
            <ul>
              <li><a href="#forms__input">Input fields</a></li>
              <li><a href="#forms__select">Select menus</a></li>
              <li><a href="#forms__checkbox">Checkboxes</a></li>
              <li><a href="#forms__radio">Radio buttons</a></li>
              <li><a href="#forms__textareas">Textareas</a></li>
              <li><a href="#forms__html5">HTML5 inputs</a></li>
              <li><a href="#forms__action">Action buttons</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      <main>
        <section id="text">
          <header><h1>Text</h1></header>
          <article id="text__headings">
            <header>
              <h2>Headings</h2>
            </header>
            <div>
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <h4>Heading 4</h4>
              <h5>Heading 5</h5>
              <h6>Heading 6</h6>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__paragraphs">
            <header><h2>Paragraphs</h2></header>
            <div>
              <p>A paragraph (from the Greek paragraphos, “to write beside” or “written beside”) is a self-contained unit of a discourse in writing dealing with a particular point or idea. A paragraph consists of one or more sentences. Though not required by the syntax of any language, paragraphs are usually an expected part of formal writing, used to organize longer prose.</p>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__blockquotes">
            <header><h2>Blockquotes</h2></header>
            <div>
              <blockquote>
                <p>A block quotation (also known as a long quotation or extract) is a quotation in a written document, that is set off from the main text as a paragraph, or block of text.</p>
                <p>It is typically distinguished visually using indentation and a different typeface or smaller size quotation. It may or may not include a citation, usually placed at the bottom.</p>
                <cite><a href="#!">Said no one, ever.</a></cite>
              </blockquote>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__lists">
            <header><h2>Lists</h2></header>
            <div>
              <h3>Definition list</h3>
              <dl>
                <dt>Definition List Title</dt>
                <dd>This is a definition list division.</dd>
              </dl>
              <h3>Ordered List</h3>
              <ol type="1">
                <li>List Item 1</li>
                <li>
                  List Item 2
                  <ol type="A">
                    <li>List Item 1</li>
                    <li>
                      List Item 2
                      <ol type="a">
                        <li>List Item 1</li>
                        <li>
                          List Item 2
                          <ol type="I">
                            <li>List Item 1</li>
                            <li>
                              List Item 2
                              <ol type="i">
                                <li>List Item 1</li>
                                <li>List Item 2</li>
                                <li>List Item 3</li>
                              </ol>
                            </li>
                            <li>List Item 3</li>
                          </ol>
                        </li>
                        <li>List Item 3</li>
                      </ol>
                    </li>
                    <li>List Item 3</li>
                  </ol>
                </li>
                <li>List Item 3</li>
              </ol>
              <h3>Unordered List</h3>
              <ul>
                <li>List Item 1</li>
                <li>
                  List Item 2
                  <ul>
                    <li>List Item 1</li>
                    <li>
                      List Item 2
                      <ul>
                        <li>List Item 1</li>
                        <li>
                          List Item 2
                          <ul>
                            <li>List Item 1</li>
                            <li>
                              List Item 2
                              <ul>
                                <li>List Item 1</li>
                                <li>List Item 2</li>
                                <li>List Item 3</li>
                              </ul>
                            </li>
                            <li>List Item 3</li>
                          </ul>
                        </li>
                        <li>List Item 3</li>
                      </ul>
                    </li>
                    <li>List Item 3</li>
                  </ul>
                </li>
                <li>List Item 3</li>
              </ul>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__blockquotes">
            <header><h1>Blockquotes</h1></header>
            <div>
              <blockquote>
                <p>A block quotation (also known as a long quotation or extract) is a quotation in a written document, that is set off from the main text as a paragraph, or block of text.</p>
                <p>It is typically distinguished visually using indentation and a different typeface or smaller size quotation. It may or may not include a citation, usually placed at the bottom.</p>
                <cite><a href="#!">Said no one, ever.</a></cite>
              </blockquote>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__details">
            <header><h1>Details / Summary</h1></header>
            <details>
              <summary>Expand for details</summary>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, odio! Odio natus ullam ad quaerat, eaque necessitatibus, aliquid distinctio similique voluptatibus dicta consequuntur animi. Quaerat facilis quidem unde eos! Ipsa.</p>
            </details>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__address">
            <header><h1>Address</h1></header>
            <address>
              Written by <a href="mailto:webmaster@example.com">Jon Doe</a>.<br>
              Visit us at:<br>
              Example.com<br>
              Box 564, Disneyland<br>
              USA
            </address>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__hr">
            <header><h2>Horizontal rules</h2></header>
            <div>
              <hr>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__tables">
            <header><h2>Tabular data</h2></header>
            <table>
              <caption>Table Caption</caption>
              <thead>
                <tr>
                  <th>Table Heading 1</th>
                  <th>Table Heading 2</th>
                  <th>Table Heading 3</th>
                  <th>Table Heading 4</th>
                  <th>Table Heading 5</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Table Footer 1</th>
                  <th>Table Footer 2</th>
                  <th>Table Footer 3</th>
                  <th>Table Footer 4</th>
                  <th>Table Footer 5</th>
                </tr>
              </tfoot>
              <tbody>
                <tr>
                  <td>Table Cell 1</td>
                  <td>Table Cell 2</td>
                  <td>Table Cell 3</td>
                  <td>Table Cell 4</td>
                  <td>Table Cell 5</td>
                </tr>
                <tr>
                  <td>Table Cell 1</td>
                  <td>Table Cell 2</td>
                  <td>Table Cell 3</td>
                  <td>Table Cell 4</td>
                  <td>Table Cell 5</td>
                </tr>
                <tr>
                  <td>Table Cell 1</td>
                  <td>Table Cell 2</td>
                  <td>Table Cell 3</td>
                  <td>Table Cell 4</td>
                  <td>Table Cell 5</td>
                </tr>
                <tr>
                  <td>Table Cell 1</td>
                  <td>Table Cell 2</td>
                  <td>Table Cell 3</td>
                  <td>Table Cell 4</td>
                  <td>Table Cell 5</td>
                </tr>
              </tbody>
            </table>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__code">
            <header><h2>Code</h2></header>
            <div>
              <p><strong>Keyboard input:</strong> <kbd>Cmd</kbd></p>
              <p><strong>Inline code:</strong> <code>&lt;div&gt;code&lt;/div&gt;</code></p>
              <p><strong>Sample output:</strong> <samp>This is sample output from a computer program.</samp></p>
              <h2>Pre-formatted text</h2>
              <pre>P R E F O R M A T T E D T E X T
  ! " # $ % &amp; ' ( ) * + , - . /
  0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ?
  @ A B C D E F G H I J K L M N O
  P Q R S T U V W X Y Z [ \\ ] ^ _
  \` a b c d e f g h i j k l m n o
  p q r s t u v w x y z { | } ~ </pre>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__inline">
            <header><h2>Inline elements</h2></header>
            <div>
              <p><a href="#!">This is a text link</a>.</p>
              <p><strong>Strong is used to indicate strong importance.</strong></p>
              <p><em>This text has added emphasis.</em></p>
              <p>The <b>b element</b> is stylistically different text from normal text, without any special importance.</p>
              <p>The <i>i element</i> is text that is offset from the normal text.</p>
              <p>The <u>u element</u> is text with an unarticulated, though explicitly rendered, non-textual annotation.</p>
              <p><del>This text is deleted</del> and <ins>This text is inserted</ins>.</p>
              <p><s>This text has a strikethrough</s>.</p>
              <p>Superscript<sup>®</sup>.</p>
              <p>Subscript for things like H<sub>2</sub>O.</p>
              <p><small>This small text is small for fine print, etc.</small></p>
              <p>Abbreviation: <abbr title="HyperText Markup Language">HTML</abbr></p>
              <p><q cite="https://developer.mozilla.org/en-US/docs/HTML/Element/q">This text is a short inline quotation.</q></p>
              <p><cite>This is a citation.</cite></p>
              <p>The <dfn>dfn element</dfn> indicates a definition.</p>
              <p>The <mark>mark element</mark> indicates a highlight.</p>
              <p>The <var>variable element</var>, such as <var>x</var> = <var>y</var>.</p>
              <p>The time element: <time datetime="2013-04-06T12:32+00:00">2 weeks ago</time></p>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="text__comments">
            <header><h2>HTML Comments</h2></header>
            <div>
              <p>There is comment here: <!--This comment should not be displayed--></p>
              <p>There is a comment spanning multiple tags and lines below here.</p>
              <!--<p><a href="#!">This is a text link. But it should not be displayed in a comment</a>.</p>
              <p><strong>Strong is used to indicate strong importance. But, it should not be displayed in a comment</strong></p>
              <p><em>This text has added emphasis. But, it should not be displayed in a comment</em></p>-->
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
        </section>
        <section id="embedded">
          <header><h2>Embedded content</h2></header>
          <article id="embedded__images">
            <header><h2>Images</h2></header>
            <div>
              <h3>Plain <code>&lt;img&gt;</code> element</h3>
              <p><img src="https://placekitten.com/480/480" alt="Photo of a kitten"></p>
              <h3><code>&lt;figure&gt;</code> element with <code>&lt;img&gt;</code> element</h3>
              <figure><img src="https://placekitten.com/420/420" alt="Photo of a kitten"></figure>
              <h3><code>&lt;figure&gt;</code> element with <code>&lt;img&gt;</code> and <code>&lt;figcaption&gt;</code> elements</h3>
              <figure>
                <img src="https://placekitten.com/420/420" alt="Photo of a kitten">
                <figcaption>Here is a caption for this image.</figcaption>
              </figure>
              <h3><code>&lt;figure&gt;</code> element with a <code>&lt;picture&gt;</code> element</h3>
              <figure>
                <picture>
                  <source srcset="https://placekitten.com/800/800"
                    media="(min-width: 800px)">
                  <img src="https://placekitten.com/420/420" alt="Photo of a kitten" />
                </picture>
              </figure>
            </div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__bgimages">
            <header><h2>Background images</h2></header>
            <div style="background-image:url('https://placekitten.com/300/300'); width:300px; height: 300px;"></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__audio">
            <header><h2>Audio</h2></header>
            <div><audio controls="">audio</audio></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__video">
            <header><h2>Video</h2></header>
            <div><video controls="">video</video></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__canvas">
            <header><h2>Canvas</h2></header>
            <div><canvas>canvas</canvas></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__meter">
            <header><h2>Meter</h2></header>
            <div><meter value="2" min="0" max="10">2 out of 10</meter></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__progress">
            <header><h2>Progress</h2></header>
            <div><progress>progress</progress></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__svg">
            <header><h2>Inline SVG</h2></header>
            <div><svg width="100px" height="100px"><circle cx="100" cy="100" r="100" fill="#1fa3ec"></circle></svg></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__iframe">
            <header><h2>IFrame</h2></header>
            <div><iframe src="index.html" height="300"></iframe></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__embed">
            <header><h2>Embed</h2></header>
            <div><embed src="index.html" height="300"></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
          <article id="embedded__object">
            <header><h2>Object</h2></header>
            <div><object data="index.html" height="300"></object></div>
            <footer><p><a href="#top">[Top]</a></p></footer>
          </article>
        </section>
        <section id="forms">
          <header><h2>Form elements</h2></header>
          <form>
            <fieldset id="forms__input">
              <legend>Input fields</legend>
              <p>
                <label for="input__text">Text Input</label>
                <input id="input__text" type="text" placeholder="Text Input">
              </p>
              <p>
                <label for="input__password">Password</label>
                <input id="input__password" type="password" placeholder="Type your Password">
              </p>
              <p>
                <label for="input__webaddress">Web Address</label>
                <input id="input__webaddress" type="url" placeholder="https://yoursite.com">
              </p>
              <p>
                <label for="input__emailaddress">Email Address</label>
                <input id="input__emailaddress" type="email" placeholder="name@email.com">
              </p>
              <p>
                <label for="input__phone">Phone Number</label>
                <input id="input__phone" type="tel" placeholder="(999) 999-9999">
              </p>
              <p>
                <label for="input__search">Search</label>
                <input id="input__search" type="search" placeholder="Enter Search Term">
              </p>
              <p>
                <label for="input__text2">Number Input</label>
                <input id="input__text2" type="number" placeholder="Enter a Number">
              </p>
              <p>
                <label for="input__file">File Input</label>
                <input id="input__file" type="file">
              </p>
            </fieldset>
            <p><a href="#top">[Top]</a></p>
            <fieldset id="forms__select">
              <legend>Select menus</legend>
              <p>
                <label for="select">Select</label>
                <select id="select">
                  <optgroup label="Option Group">
                    <option>Option One</option>
                    <option>Option Two</option>
                    <option>Option Three</option>
                  </optgroup>
                </select>
              </p>
              <p>
                <label for="select_multiple">Select (multiple)</label>
                <select id="select_multiple" multiple="multiple">
                  <optgroup label="Option Group">
                    <option>Option One</option>
                    <option>Option Two</option>
                    <option>Option Three</option>
                  </optgroup>
                </select>
              </p>
            </fieldset>
            <p><a href="#top">[Top]</a></p>
            <fieldset id="forms__checkbox">
              <legend>Checkboxes</legend>
              <ul>
                <li><label for="checkbox1"><input id="checkbox1" name="checkbox" type="checkbox" checked="checked"> Choice A</label></li>
                <li><label for="checkbox2"><input id="checkbox2" name="checkbox" type="checkbox"> Choice B</label></li>
                <li><label for="checkbox3"><input id="checkbox3" name="checkbox" type="checkbox"> Choice C</label></li>
              </ul>
            </fieldset>
            <p><a href="#top">[Top]</a></p>
            <fieldset id="forms__radio">
              <legend>Radio buttons</legend>
              <ul>
                <li><label for="radio1"><input id="radio1" name="radio" type="radio" checked="checked"> Option 1</label></li>
                <li><label for="radio2"><input id="radio2" name="radio" type="radio"> Option 2</label></li>
                <li><label for="radio3"><input id="radio3" name="radio" type="radio"> Option 3</label></li>
              </ul>
            </fieldset>
            <p><a href="#top">[Top]</a></p>
            <fieldset id="forms__textareas">
              <legend>Textareas</legend>
              <p>
                <label for="textarea">Textarea</label>
                <textarea id="textarea" rows="8" cols="48" placeholder="Enter your message here"></textarea>
              </p>
            </fieldset>
            <p><a href="#top">[Top]</a></p>
            <fieldset id="forms__html5">
              <legend>HTML5 inputs</legend>
              <p>
                <label for="ic">Color input</label>
                <input type="color" id="ic" value="#000000">
              </p>
              <p>
                <label for="in">Number input</label>
                <input type="number" id="in" min="0" max="10" value="5">
              </p>
              <p>
                <label for="ir">Range input</label>
                <input type="range" id="ir" value="10">
              </p>
              <p>
                <label for="idd">Date input</label>
                <input type="date" id="idd" value="1970-01-01">
              </p>
              <p>
                <label for="idm">Month input</label>
                <input type="month" id="idm" value="1970-01">
              </p>
              <p>
                <label for="idw">Week input</label>
                <input type="week" id="idw" value="1970-W01">
              </p>
              <p>
                <label for="idt">Datetime input</label>
                <input type="datetime" id="idt" value="1970-01-01T00:00:00Z">
              </p>
              <p>
                <label for="idtl">Datetime-local input</label>
                <input type="datetime-local" id="idtl" value="1970-01-01T00:00">
              </p>
              <p>
                <label for="idl">Datalist</label>
                <input type="text" id="idl" list="example-list">
                <datalist id="example-list">
                  <option value="Example #1" />
                  <option value="Example #2" />
                  <option value="Example #3" />
                </datalist>
              </p>
            </fieldset>
            <p><a href="#top">[Top]</a></p>
            <fieldset id="forms__action">
              <legend>Action buttons</legend>
              <p>
                <input type="submit" value="<input type=submit>">
                <input type="button" value="<input type=button>">
                <input type="reset" value="<input type=reset>">
                <input type="submit" value="<input disabled>" disabled>
              </p>
              <p>
                <button type="submit">&lt;button type=submit&gt;</button>
                <button type="button">&lt;button type=button&gt;</button>
                <button type="reset">&lt;button type=reset&gt;</button>
                <button type="button" disabled>&lt;button disabled&gt;</button>
              </p>
            </fieldset>
            <p><a href="#top">[Top]</a></p>
          </form>
        </section>
      </main>
      <footer>
        <p>Made by <a href="http://twitter.com/cbracco">@cbracco</a>. Code on <a href="http://github.com/cbracco/html5-test-page">GitHub</a>.</p>
      </footer>
    </div>
  </body>
</html>
`;


/***/ }),

/***/ "./src/error.ts":
/*!**********************!*\
  !*** ./src/error.ts ***!
  \**********************/
/*! exports provided: KasperError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KasperError", function() { return KasperError; });
class KasperError {
    constructor(value, line, col) {
        this.line = line;
        this.col = col;
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
}


/***/ }),

/***/ "./src/kasper.ts":
/*!***********************!*\
  !*** ./src/kasper.ts ***!
  \***********************/
/*! exports provided: execute, parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "execute", function() { return execute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
/* harmony import */ var _demo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./demo */ "./src/demo.ts");
/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parser */ "./src/parser.ts");


function execute(source) {
    const parser = new _parser__WEBPACK_IMPORTED_MODULE_1__["Parser"]();
    const nodes = parser.parse(source);
    if (parser.errors.length) {
        return JSON.stringify(parser.errors);
    }
    const result = JSON.stringify(nodes);
    return result;
}
function parse(source) {
    const parser = new _parser__WEBPACK_IMPORTED_MODULE_1__["Parser"]();
    const nodes = parser.parse(source);
    if (parser.errors.length) {
        return JSON.stringify(parser.errors);
    }
    return JSON.stringify(nodes);
}
if (typeof window !== "undefined") {
    window.kasper = {
        demoSourceCode: _demo__WEBPACK_IMPORTED_MODULE_0__["DemoSource"],
        execute,
        parse,
    };
}
else {
    exports.kasper = {
        execute,
        parse,
    };
}


/***/ }),

/***/ "./src/nodes.ts":
/*!**********************!*\
  !*** ./src/nodes.ts ***!
  \**********************/
/*! exports provided: Node, Element, Attribute, Text, Comment, Doctype */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Node", function() { return Node; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Element", function() { return Element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Attribute", function() { return Attribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Comment", function() { return Comment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Doctype", function() { return Doctype; });
class Node {
}
class Element extends Node {
    constructor(name, attributes, children, line = 0) {
        super();
        this.type = 'element';
        this.name = name;
        this.attributes = attributes;
        this.children = children;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitElementNode(this);
    }
    toString() {
        return 'Node.Element';
    }
}
class Attribute extends Node {
    constructor(name, value, line = 0) {
        super();
        this.type = 'attribute';
        this.name = name;
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitAttributeNode(this);
    }
    toString() {
        return 'Node.Attribute';
    }
}
class Text extends Node {
    constructor(value, line = 0) {
        super();
        this.type = 'text';
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitTextNode(this);
    }
    toString() {
        return 'Node.Text';
    }
}
class Comment extends Node {
    constructor(value, line = 0) {
        super();
        this.type = 'comment';
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitCommentNode(this);
    }
    toString() {
        return 'Node.Comment';
    }
}
class Doctype extends Node {
    constructor(value, line = 0) {
        super();
        this.type = 'doctype';
        this.value = value;
        this.line = line;
    }
    accept(visitor) {
        return visitor.visitDoctypeNode(this);
    }
    toString() {
        return 'Node.Doctype';
    }
}


/***/ }),

/***/ "./src/parser.ts":
/*!***********************!*\
  !*** ./src/parser.ts ***!
  \***********************/
/*! exports provided: Parser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return Parser; });
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error */ "./src/error.ts");
/* harmony import */ var _nodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nodes */ "./src/nodes.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



class Parser {
    parse(source) {
        this.current = 0;
        this.line = 1;
        this.col = 1;
        this.source = source;
        this.errors = [];
        this.nodes = [];
        while (!this.eof()) {
            try {
                const node = this.node();
                if (node === null) {
                    continue;
                }
                this.nodes.push(node);
            }
            catch (e) {
                if (e instanceof _error__WEBPACK_IMPORTED_MODULE_0__["KasperError"]) {
                    this.errors.push(`Parse Error (${e.line}:${e.col}) => ${e.value}`);
                }
                else {
                    this.errors.push(`${e}`);
                    if (this.errors.length > 10) {
                        this.errors.push("Parse Error limit exceeded");
                        return this.nodes;
                    }
                }
                break;
            }
        }
        this.source = "";
        return this.nodes;
    }
    match(...chars) {
        for (const char of chars) {
            if (this.check(char)) {
                this.current += char.length;
                return true;
            }
        }
        return false;
    }
    advance(eofError = "") {
        if (!this.eof()) {
            if (this.check("\n")) {
                this.line += 1;
                this.col = 0;
            }
            this.col += 1;
            this.current++;
        }
        else {
            this.error(`Unexpected end of file. ${eofError}`);
        }
    }
    peek(...chars) {
        for (const char of chars) {
            if (this.check(char)) {
                return true;
            }
        }
        return false;
    }
    check(char) {
        return this.source.slice(this.current, this.current + char.length) === char;
    }
    eof() {
        return this.current > this.source.length;
    }
    error(message) {
        throw new _error__WEBPACK_IMPORTED_MODULE_0__["KasperError"](message, this.line, this.col);
    }
    node() {
        this.whitespace();
        let node;
        if (this.match("</")) {
            this.error("Unexpected closing tag");
        }
        if (this.match("<!--")) {
            node = this.comment();
        }
        else if (this.match("<!doctype") || this.match("<!DOCTYPE")) {
            node = this.doctype();
        }
        else if (this.match("<")) {
            node = this.element();
        }
        else {
            node = this.text();
        }
        this.whitespace();
        return node;
    }
    comment() {
        const start = this.current;
        do {
            this.advance("Expected comment closing '-->'");
        } while (!this.match(`-->`));
        const comment = this.source.slice(start, this.current - 3);
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Comment"](comment, this.line);
    }
    doctype() {
        const start = this.current;
        do {
            this.advance("Expected closing doctype");
        } while (!this.match(`>`));
        const doctype = this.source.slice(start, this.current - 1).trim();
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Doctype"](doctype, this.line);
    }
    element() {
        const line = this.line;
        const name = this.identifier("/", ">");
        if (!name) {
            this.error("Expected a tag name");
        }
        const attributes = this.attributes();
        if (this.match("/>") ||
            (_utils__WEBPACK_IMPORTED_MODULE_2__["SelfClosingTags"].includes(name) && this.match(">"))) {
            return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Element"](name, attributes, [], this.line);
        }
        if (!this.match(">")) {
            this.error("Expected closing tag");
        }
        let children = [];
        this.whitespace();
        if (!this.peek("</")) {
            children = this.children(name);
        }
        this.close(name);
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Element"](name, attributes, children, line);
    }
    close(name) {
        if (!this.match("</")) {
            this.error(`Expected </${name}>`);
        }
        if (!this.match(`${name}`)) {
            this.error(`Expected </${name}>`);
        }
        this.whitespace();
        if (!this.match(">")) {
            this.error(`Expected </${name}>`);
        }
    }
    children(parent) {
        const children = [];
        do {
            if (this.eof()) {
                this.error(`Expected </${parent}>`);
            }
            const node = this.node();
            if (node === null) {
                continue;
            }
            children.push(node);
        } while (!this.peek(`</`));
        return children;
    }
    attributes() {
        const attributes = [];
        while (!this.peek(">", "/>") && !this.eof()) {
            this.whitespace();
            const line = this.line;
            const name = this.identifier("=", ">", "/>");
            if (!name) {
                this.error("Blank attribute name");
            }
            this.whitespace();
            let value = "";
            if (this.match("=")) {
                this.whitespace();
                if (this.match("'")) {
                    value = this.string("'");
                }
                else if (this.match('"')) {
                    value = this.string('"');
                }
                else {
                    value = this.identifier(">", "/>");
                }
            }
            this.whitespace();
            attributes.push(new _nodes__WEBPACK_IMPORTED_MODULE_1__["Attribute"](name, value, line));
        }
        return attributes;
    }
    text() {
        const start = this.current;
        const line = this.line;
        while (!this.peek("<") && !this.eof()) {
            this.advance();
        }
        const text = this.source.slice(start, this.current).trim();
        if (!text) {
            return null;
        }
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Text"](text, line);
    }
    whitespace() {
        let count = 0;
        while (this.peek(..._utils__WEBPACK_IMPORTED_MODULE_2__["WhiteSpaces"]) && !this.eof()) {
            count += 1;
            this.advance();
        }
        return count;
    }
    identifier(...closing) {
        this.whitespace();
        const start = this.current;
        while (!this.peek(..._utils__WEBPACK_IMPORTED_MODULE_2__["WhiteSpaces"], ...closing)) {
            this.advance(`Expected closing ${closing}`);
        }
        const end = this.current;
        this.whitespace();
        return this.source.slice(start, end).trim();
    }
    string(closing) {
        const start = this.current;
        while (!this.match(closing)) {
            this.advance(`Expected closing ${closing}`);
        }
        return this.source.slice(start, this.current - 1);
    }
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: isDigit, isAlpha, isAlphaNumeric, capitalize, WhiteSpaces, SelfClosingTags */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDigit", function() { return isDigit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAlpha", function() { return isAlpha; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAlphaNumeric", function() { return isAlphaNumeric; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhiteSpaces", function() { return WhiteSpaces; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelfClosingTags", function() { return SelfClosingTags; });
function isDigit(char) {
    return char >= "0" && char <= "9";
}
function isAlpha(char) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}
function isAlphaNumeric(char) {
    return isAlpha(char) || isDigit(char);
}
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}
const WhiteSpaces = [" ", "\n", "\t", "\r"];
const SelfClosingTags = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vycm9yLnRzIiwid2VicGFjazovLy8uL3NyYy9rYXNwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25vZGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQU8sTUFBTSxXQUFXLEdBQUc7Ozs7Ozs7Q0FPMUIsQ0FBQztBQUNLLE1BQU0sVUFBVSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q0FBQztBQUVNLFNBQVMsY0FBYyxDQUFDLElBQVk7SUFDekMsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFTSxTQUFTLFVBQVUsQ0FBQyxJQUFZO0lBQ3JDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3JFLENBQUM7QUFFTSxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBVSxDQUFDO0FBRXJELE1BQU0sZUFBZSxHQUFHO0lBQzdCLE1BQU07SUFDTixNQUFNO0lBQ04sSUFBSTtJQUNKLEtBQUs7SUFDTCxPQUFPO0lBQ1AsSUFBSTtJQUNKLEtBQUs7SUFDTCxPQUFPO0lBQ1AsTUFBTTtJQUNOLE1BQU07SUFDTixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxLQUFLO0NBQ04sQ0FBQyIsImZpbGUiOiJrYXNwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9rYXNwZXIudHNcIik7XG4iLCJleHBvcnQgY29uc3QgRGVtb1NvdXJjZTEgPSBgXHJcbjxib2R5ICAgID5cclxuPGRpdiAgICAgICAgIGNsYXNzPVwiYmxvY2sgdy1mdWxsIGZsZXhcIiBpZD1cImJsb2NrXCI+PC9kaXY+XHJcbjxpbWcgICAgICAgc3JjPVwiaHR0cDovL3VybC5pbWFnZS5jb21cIiBib3JkZXIgID0gIDAgLz5cclxuPGRpdiBjbGFzcz0nYi1uYW5hJz48L2Rpdj5cclxuPGlucHV0IHR5cGU9Y2hlY2tib3ggdmFsdWUgPSAgICBzb21ldGhpbmcgLz5cclxuPC9ib2R5PlxyXG5gO1xyXG5leHBvcnQgY29uc3QgRGVtb1NvdXJjZSA9IGA8IURPQ1RZUEUgaHRtbD5cclxuPGh0bWwgbGFuZz1cImVuXCI+XHJcbiAgPGhlYWQ+XHJcbiAgICA8bWV0YSBjaGFyc2V0PVwidXRmLThcIj5cclxuICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCI+XHJcbiAgICA8dGl0bGU+SFRNTDUgVGVzdCBQYWdlPC90aXRsZT5cclxuICA8L2hlYWQ+XHJcbiAgPGJvZHk+XHJcbiAgICA8ZGl2IGlkPVwidG9wXCIgcm9sZT1cImRvY3VtZW50XCI+XHJcbiAgICAgIDxoZWFkZXI+XHJcbiAgICAgICAgPGgxPkhUTUw1IFRlc3QgUGFnZTwvaDE+XHJcbiAgICAgICAgPHA+VGhpcyBpcyBhIHRlc3QgcGFnZSBmaWxsZWQgd2l0aCBjb21tb24gSFRNTCBlbGVtZW50cyB0byBiZSB1c2VkIHRvIHByb3ZpZGUgdmlzdWFsIGZlZWRiYWNrIHdoaWxzdCBidWlsZGluZyBDU1Mgc3lzdGVtcyBhbmQgZnJhbWV3b3Jrcy48L3A+XHJcbiAgICAgIDwvaGVhZGVyPlxyXG4gICAgICA8bmF2PlxyXG4gICAgICAgIDx1bD5cclxuICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiN0ZXh0XCI+VGV4dDwvYT5cclxuICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2hlYWRpbmdzXCI+SGVhZGluZ3M8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19wYXJhZ3JhcGhzXCI+UGFyYWdyYXBoczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2xpc3RzXCI+TGlzdHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19ibG9ja3F1b3Rlc1wiPkJsb2NrcXVvdGVzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fZGV0YWlsc1wiPkRldGFpbHMgLyBTdW1tYXJ5PC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fYWRkcmVzc1wiPkFkZHJlc3M8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19oclwiPkhvcml6b250YWwgcnVsZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X190YWJsZXNcIj5UYWJ1bGFyIGRhdGE8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19jb2RlXCI+Q29kZTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2lubGluZVwiPklubGluZSBlbGVtZW50czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2NvbW1lbnRzXCI+SFRNTCBDb21tZW50czwvYT48L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNlbWJlZGRlZFwiPkVtYmVkZGVkIGNvbnRlbnQ8L2E+XHJcbiAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9faW1hZ2VzXCI+SW1hZ2VzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2JnaW1hZ2VzXCI+QmFja2dyb3VuZCBpbWFnZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fYXVkaW9cIj5BdWRpbzwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX192aWRlb1wiPlZpZGVvPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2NhbnZhc1wiPkNhbnZhczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19tZXRlclwiPk1ldGVyPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX3Byb2dyZXNzXCI+UHJvZ3Jlc3M8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fc3ZnXCI+SW5saW5lIFNWRzwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19pZnJhbWVcIj5JRnJhbWVzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2VtYmVkXCI+RW1iZWQ8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fb2JqZWN0XCI+T2JqZWN0PC9hPjwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI2Zvcm1zXCI+Rm9ybSBlbGVtZW50czwvYT5cclxuICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19pbnB1dFwiPklucHV0IGZpZWxkczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19zZWxlY3RcIj5TZWxlY3QgbWVudXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19fY2hlY2tib3hcIj5DaGVja2JveGVzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX3JhZGlvXCI+UmFkaW8gYnV0dG9uczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX190ZXh0YXJlYXNcIj5UZXh0YXJlYXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19faHRtbDVcIj5IVE1MNSBpbnB1dHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19fYWN0aW9uXCI+QWN0aW9uIGJ1dHRvbnM8L2E+PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgPC9uYXY+XHJcbiAgICAgIDxtYWluPlxyXG4gICAgICAgIDxzZWN0aW9uIGlkPVwidGV4dFwiPlxyXG4gICAgICAgICAgPGhlYWRlcj48aDE+VGV4dDwvaDE+PC9oZWFkZXI+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2hlYWRpbmdzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+XHJcbiAgICAgICAgICAgICAgPGgyPkhlYWRpbmdzPC9oMj5cclxuICAgICAgICAgICAgPC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgxPkhlYWRpbmcgMTwvaDE+XHJcbiAgICAgICAgICAgICAgPGgyPkhlYWRpbmcgMjwvaDI+XHJcbiAgICAgICAgICAgICAgPGgzPkhlYWRpbmcgMzwvaDM+XHJcbiAgICAgICAgICAgICAgPGg0PkhlYWRpbmcgNDwvaDQ+XHJcbiAgICAgICAgICAgICAgPGg1PkhlYWRpbmcgNTwvaDU+XHJcbiAgICAgICAgICAgICAgPGg2PkhlYWRpbmcgNjwvaDY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19wYXJhZ3JhcGhzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPlBhcmFncmFwaHM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxwPkEgcGFyYWdyYXBoIChmcm9tIHRoZSBHcmVlayBwYXJhZ3JhcGhvcywg4oCcdG8gd3JpdGUgYmVzaWRl4oCdIG9yIOKAnHdyaXR0ZW4gYmVzaWRl4oCdKSBpcyBhIHNlbGYtY29udGFpbmVkIHVuaXQgb2YgYSBkaXNjb3Vyc2UgaW4gd3JpdGluZyBkZWFsaW5nIHdpdGggYSBwYXJ0aWN1bGFyIHBvaW50IG9yIGlkZWEuIEEgcGFyYWdyYXBoIGNvbnNpc3RzIG9mIG9uZSBvciBtb3JlIHNlbnRlbmNlcy4gVGhvdWdoIG5vdCByZXF1aXJlZCBieSB0aGUgc3ludGF4IG9mIGFueSBsYW5ndWFnZSwgcGFyYWdyYXBocyBhcmUgdXN1YWxseSBhbiBleHBlY3RlZCBwYXJ0IG9mIGZvcm1hbCB3cml0aW5nLCB1c2VkIHRvIG9yZ2FuaXplIGxvbmdlciBwcm9zZS48L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19ibG9ja3F1b3Rlc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5CbG9ja3F1b3RlczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGJsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgICAgICA8cD5BIGJsb2NrIHF1b3RhdGlvbiAoYWxzbyBrbm93biBhcyBhIGxvbmcgcXVvdGF0aW9uIG9yIGV4dHJhY3QpIGlzIGEgcXVvdGF0aW9uIGluIGEgd3JpdHRlbiBkb2N1bWVudCwgdGhhdCBpcyBzZXQgb2ZmIGZyb20gdGhlIG1haW4gdGV4dCBhcyBhIHBhcmFncmFwaCwgb3IgYmxvY2sgb2YgdGV4dC48L3A+XHJcbiAgICAgICAgICAgICAgICA8cD5JdCBpcyB0eXBpY2FsbHkgZGlzdGluZ3Vpc2hlZCB2aXN1YWxseSB1c2luZyBpbmRlbnRhdGlvbiBhbmQgYSBkaWZmZXJlbnQgdHlwZWZhY2Ugb3Igc21hbGxlciBzaXplIHF1b3RhdGlvbi4gSXQgbWF5IG9yIG1heSBub3QgaW5jbHVkZSBhIGNpdGF0aW9uLCB1c3VhbGx5IHBsYWNlZCBhdCB0aGUgYm90dG9tLjwvcD5cclxuICAgICAgICAgICAgICAgIDxjaXRlPjxhIGhyZWY9XCIjIVwiPlNhaWQgbm8gb25lLCBldmVyLjwvYT48L2NpdGU+XHJcbiAgICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fbGlzdHNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+TGlzdHM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMz5EZWZpbml0aW9uIGxpc3Q8L2gzPlxyXG4gICAgICAgICAgICAgIDxkbD5cclxuICAgICAgICAgICAgICAgIDxkdD5EZWZpbml0aW9uIExpc3QgVGl0bGU8L2R0PlxyXG4gICAgICAgICAgICAgICAgPGRkPlRoaXMgaXMgYSBkZWZpbml0aW9uIGxpc3QgZGl2aXNpb24uPC9kZD5cclxuICAgICAgICAgICAgICA8L2RsPlxyXG4gICAgICAgICAgICAgIDxoMz5PcmRlcmVkIExpc3Q8L2gzPlxyXG4gICAgICAgICAgICAgIDxvbCB0eXBlPVwiMVwiPlxyXG4gICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgPG9sIHR5cGU9XCJBXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgPG9sIHR5cGU9XCJhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxvbCB0eXBlPVwiSVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9sIHR5cGU9XCJpXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICA8L29sPlxyXG4gICAgICAgICAgICAgIDxoMz5Vbm9yZGVyZWQgTGlzdDwvaDM+XHJcbiAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2Jsb2NrcXVvdGVzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgxPkJsb2NrcXVvdGVzPC9oMT48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8YmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgIDxwPkEgYmxvY2sgcXVvdGF0aW9uIChhbHNvIGtub3duIGFzIGEgbG9uZyBxdW90YXRpb24gb3IgZXh0cmFjdCkgaXMgYSBxdW90YXRpb24gaW4gYSB3cml0dGVuIGRvY3VtZW50LCB0aGF0IGlzIHNldCBvZmYgZnJvbSB0aGUgbWFpbiB0ZXh0IGFzIGEgcGFyYWdyYXBoLCBvciBibG9jayBvZiB0ZXh0LjwvcD5cclxuICAgICAgICAgICAgICAgIDxwPkl0IGlzIHR5cGljYWxseSBkaXN0aW5ndWlzaGVkIHZpc3VhbGx5IHVzaW5nIGluZGVudGF0aW9uIGFuZCBhIGRpZmZlcmVudCB0eXBlZmFjZSBvciBzbWFsbGVyIHNpemUgcXVvdGF0aW9uLiBJdCBtYXkgb3IgbWF5IG5vdCBpbmNsdWRlIGEgY2l0YXRpb24sIHVzdWFsbHkgcGxhY2VkIGF0IHRoZSBib3R0b20uPC9wPlxyXG4gICAgICAgICAgICAgICAgPGNpdGU+PGEgaHJlZj1cIiMhXCI+U2FpZCBubyBvbmUsIGV2ZXIuPC9hPjwvY2l0ZT5cclxuICAgICAgICAgICAgICA8L2Jsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19kZXRhaWxzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgxPkRldGFpbHMgLyBTdW1tYXJ5PC9oMT48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRldGFpbHM+XHJcbiAgICAgICAgICAgICAgPHN1bW1hcnk+RXhwYW5kIGZvciBkZXRhaWxzPC9zdW1tYXJ5PlxyXG4gICAgICAgICAgICAgIDxwPkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIEN1bSwgb2RpbyEgT2RpbyBuYXR1cyB1bGxhbSBhZCBxdWFlcmF0LCBlYXF1ZSBuZWNlc3NpdGF0aWJ1cywgYWxpcXVpZCBkaXN0aW5jdGlvIHNpbWlsaXF1ZSB2b2x1cHRhdGlidXMgZGljdGEgY29uc2VxdXVudHVyIGFuaW1pLiBRdWFlcmF0IGZhY2lsaXMgcXVpZGVtIHVuZGUgZW9zISBJcHNhLjwvcD5cclxuICAgICAgICAgICAgPC9kZXRhaWxzPlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19hZGRyZXNzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgxPkFkZHJlc3M8L2gxPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8YWRkcmVzcz5cclxuICAgICAgICAgICAgICBXcml0dGVuIGJ5IDxhIGhyZWY9XCJtYWlsdG86d2VibWFzdGVyQGV4YW1wbGUuY29tXCI+Sm9uIERvZTwvYT4uPGJyPlxyXG4gICAgICAgICAgICAgIFZpc2l0IHVzIGF0Ojxicj5cclxuICAgICAgICAgICAgICBFeGFtcGxlLmNvbTxicj5cclxuICAgICAgICAgICAgICBCb3ggNTY0LCBEaXNuZXlsYW5kPGJyPlxyXG4gICAgICAgICAgICAgIFVTQVxyXG4gICAgICAgICAgICA8L2FkZHJlc3M+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2hyXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkhvcml6b250YWwgcnVsZXM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxocj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX3RhYmxlc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5UYWJ1bGFyIGRhdGE8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8dGFibGU+XHJcbiAgICAgICAgICAgICAgPGNhcHRpb24+VGFibGUgQ2FwdGlvbjwvY2FwdGlvbj5cclxuICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBIZWFkaW5nIDE8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgSGVhZGluZyAyPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgMzwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBIZWFkaW5nIDQ8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgSGVhZGluZyA1PC90aD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICA8dGZvb3Q+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBGb290ZXIgMTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBGb290ZXIgMjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBGb290ZXIgMzwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBGb290ZXIgNDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBGb290ZXIgNTwvdGg+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgIDwvdGZvb3Q+XHJcbiAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAxPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDM8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA0PC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAxPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDM8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA0PC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAxPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDM8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA0PC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAxPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDM8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA0PC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNTwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2NvZGVcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+Q29kZTwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5LZXlib2FyZCBpbnB1dDo8L3N0cm9uZz4gPGtiZD5DbWQ8L2tiZD48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5JbmxpbmUgY29kZTo8L3N0cm9uZz4gPGNvZGU+Jmx0O2RpdiZndDtjb2RlJmx0Oy9kaXYmZ3Q7PC9jb2RlPjwvcD5cclxuICAgICAgICAgICAgICA8cD48c3Ryb25nPlNhbXBsZSBvdXRwdXQ6PC9zdHJvbmc+IDxzYW1wPlRoaXMgaXMgc2FtcGxlIG91dHB1dCBmcm9tIGEgY29tcHV0ZXIgcHJvZ3JhbS48L3NhbXA+PC9wPlxyXG4gICAgICAgICAgICAgIDxoMj5QcmUtZm9ybWF0dGVkIHRleHQ8L2gyPlxyXG4gICAgICAgICAgICAgIDxwcmU+UCBSIEUgRiBPIFIgTSBBIFQgVCBFIEQgVCBFIFggVFxyXG4gICEgXCIgIyAkICUgJmFtcDsgJyAoICkgKiArICwgLSAuIC9cclxuICAwIDEgMiAzIDQgNSA2IDcgOCA5IDogOyAmbHQ7ID0gJmd0OyA/XHJcbiAgQCBBIEIgQyBEIEUgRiBHIEggSSBKIEsgTCBNIE4gT1xyXG4gIFAgUSBSIFMgVCBVIFYgVyBYIFkgWiBbIFxcXFwgXSBeIF9cclxuICBcXGAgYSBiIGMgZCBlIGYgZyBoIGkgaiBrIGwgbSBuIG9cclxuICBwIHEgciBzIHQgdSB2IHcgeCB5IHogeyB8IH0gfiA8L3ByZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2lubGluZVwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5JbmxpbmUgZWxlbWVudHM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjIVwiPlRoaXMgaXMgYSB0ZXh0IGxpbms8L2E+LjwvcD5cclxuICAgICAgICAgICAgICA8cD48c3Ryb25nPlN0cm9uZyBpcyB1c2VkIHRvIGluZGljYXRlIHN0cm9uZyBpbXBvcnRhbmNlLjwvc3Ryb25nPjwvcD5cclxuICAgICAgICAgICAgICA8cD48ZW0+VGhpcyB0ZXh0IGhhcyBhZGRlZCBlbXBoYXNpcy48L2VtPjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPGI+YiBlbGVtZW50PC9iPiBpcyBzdHlsaXN0aWNhbGx5IGRpZmZlcmVudCB0ZXh0IGZyb20gbm9ybWFsIHRleHQsIHdpdGhvdXQgYW55IHNwZWNpYWwgaW1wb3J0YW5jZS48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDxpPmkgZWxlbWVudDwvaT4gaXMgdGV4dCB0aGF0IGlzIG9mZnNldCBmcm9tIHRoZSBub3JtYWwgdGV4dC48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDx1PnUgZWxlbWVudDwvdT4gaXMgdGV4dCB3aXRoIGFuIHVuYXJ0aWN1bGF0ZWQsIHRob3VnaCBleHBsaWNpdGx5IHJlbmRlcmVkLCBub24tdGV4dHVhbCBhbm5vdGF0aW9uLjwvcD5cclxuICAgICAgICAgICAgICA8cD48ZGVsPlRoaXMgdGV4dCBpcyBkZWxldGVkPC9kZWw+IGFuZCA8aW5zPlRoaXMgdGV4dCBpcyBpbnNlcnRlZDwvaW5zPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHM+VGhpcyB0ZXh0IGhhcyBhIHN0cmlrZXRocm91Z2g8L3M+LjwvcD5cclxuICAgICAgICAgICAgICA8cD5TdXBlcnNjcmlwdDxzdXA+wq48L3N1cD4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlN1YnNjcmlwdCBmb3IgdGhpbmdzIGxpa2UgSDxzdWI+Mjwvc3ViPk8uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzbWFsbD5UaGlzIHNtYWxsIHRleHQgaXMgc21hbGwgZm9yIGZpbmUgcHJpbnQsIGV0Yy48L3NtYWxsPjwvcD5cclxuICAgICAgICAgICAgICA8cD5BYmJyZXZpYXRpb246IDxhYmJyIHRpdGxlPVwiSHlwZXJUZXh0IE1hcmt1cCBMYW5ndWFnZVwiPkhUTUw8L2FiYnI+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxxIGNpdGU9XCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0hUTUwvRWxlbWVudC9xXCI+VGhpcyB0ZXh0IGlzIGEgc2hvcnQgaW5saW5lIHF1b3RhdGlvbi48L3E+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxjaXRlPlRoaXMgaXMgYSBjaXRhdGlvbi48L2NpdGU+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8ZGZuPmRmbiBlbGVtZW50PC9kZm4+IGluZGljYXRlcyBhIGRlZmluaXRpb24uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8bWFyaz5tYXJrIGVsZW1lbnQ8L21hcms+IGluZGljYXRlcyBhIGhpZ2hsaWdodC48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDx2YXI+dmFyaWFibGUgZWxlbWVudDwvdmFyPiwgc3VjaCBhcyA8dmFyPng8L3Zhcj4gPSA8dmFyPnk8L3Zhcj4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSB0aW1lIGVsZW1lbnQ6IDx0aW1lIGRhdGV0aW1lPVwiMjAxMy0wNC0wNlQxMjozMiswMDowMFwiPjIgd2Vla3MgYWdvPC90aW1lPjwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2NvbW1lbnRzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkhUTUwgQ29tbWVudHM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxwPlRoZXJlIGlzIGNvbW1lbnQgaGVyZTogPCEtLVRoaXMgY29tbWVudCBzaG91bGQgbm90IGJlIGRpc3BsYXllZC0tPjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGVyZSBpcyBhIGNvbW1lbnQgc3Bhbm5pbmcgbXVsdGlwbGUgdGFncyBhbmQgbGluZXMgYmVsb3cgaGVyZS48L3A+XHJcbiAgICAgICAgICAgICAgPCEtLTxwPjxhIGhyZWY9XCIjIVwiPlRoaXMgaXMgYSB0ZXh0IGxpbmsuIEJ1dCBpdCBzaG91bGQgbm90IGJlIGRpc3BsYXllZCBpbiBhIGNvbW1lbnQ8L2E+LjwvcD5cclxuICAgICAgICAgICAgICA8cD48c3Ryb25nPlN0cm9uZyBpcyB1c2VkIHRvIGluZGljYXRlIHN0cm9uZyBpbXBvcnRhbmNlLiBCdXQsIGl0IHNob3VsZCBub3QgYmUgZGlzcGxheWVkIGluIGEgY29tbWVudDwvc3Ryb25nPjwvcD5cclxuICAgICAgICAgICAgICA8cD48ZW0+VGhpcyB0ZXh0IGhhcyBhZGRlZCBlbXBoYXNpcy4gQnV0LCBpdCBzaG91bGQgbm90IGJlIGRpc3BsYXllZCBpbiBhIGNvbW1lbnQ8L2VtPjwvcD4tLT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgIDxzZWN0aW9uIGlkPVwiZW1iZWRkZWRcIj5cclxuICAgICAgICAgIDxoZWFkZXI+PGgyPkVtYmVkZGVkIGNvbnRlbnQ8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9faW1hZ2VzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkltYWdlczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgzPlBsYWluIDxjb2RlPiZsdDtpbWcmZ3Q7PC9jb2RlPiBlbGVtZW50PC9oMz5cclxuICAgICAgICAgICAgICA8cD48aW1nIHNyYz1cImh0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzQ4MC80ODBcIiBhbHQ9XCJQaG90byBvZiBhIGtpdHRlblwiPjwvcD5cclxuICAgICAgICAgICAgICA8aDM+PGNvZGU+Jmx0O2ZpZ3VyZSZndDs8L2NvZGU+IGVsZW1lbnQgd2l0aCA8Y29kZT4mbHQ7aW1nJmd0OzwvY29kZT4gZWxlbWVudDwvaDM+XHJcbiAgICAgICAgICAgICAgPGZpZ3VyZT48aW1nIHNyYz1cImh0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzQyMC80MjBcIiBhbHQ9XCJQaG90byBvZiBhIGtpdHRlblwiPjwvZmlndXJlPlxyXG4gICAgICAgICAgICAgIDxoMz48Y29kZT4mbHQ7ZmlndXJlJmd0OzwvY29kZT4gZWxlbWVudCB3aXRoIDxjb2RlPiZsdDtpbWcmZ3Q7PC9jb2RlPiBhbmQgPGNvZGU+Jmx0O2ZpZ2NhcHRpb24mZ3Q7PC9jb2RlPiBlbGVtZW50czwvaDM+XHJcbiAgICAgICAgICAgICAgPGZpZ3VyZT5cclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNDIwLzQyMFwiIGFsdD1cIlBob3RvIG9mIGEga2l0dGVuXCI+XHJcbiAgICAgICAgICAgICAgICA8ZmlnY2FwdGlvbj5IZXJlIGlzIGEgY2FwdGlvbiBmb3IgdGhpcyBpbWFnZS48L2ZpZ2NhcHRpb24+XHJcbiAgICAgICAgICAgICAgPC9maWd1cmU+XHJcbiAgICAgICAgICAgICAgPGgzPjxjb2RlPiZsdDtmaWd1cmUmZ3Q7PC9jb2RlPiBlbGVtZW50IHdpdGggYSA8Y29kZT4mbHQ7cGljdHVyZSZndDs8L2NvZGU+IGVsZW1lbnQ8L2gzPlxyXG4gICAgICAgICAgICAgIDxmaWd1cmU+XHJcbiAgICAgICAgICAgICAgICA8cGljdHVyZT5cclxuICAgICAgICAgICAgICAgICAgPHNvdXJjZSBzcmNzZXQ9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS84MDAvODAwXCJcclxuICAgICAgICAgICAgICAgICAgICBtZWRpYT1cIihtaW4td2lkdGg6IDgwMHB4KVwiPlxyXG4gICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzQyMC80MjBcIiBhbHQ9XCJQaG90byBvZiBhIGtpdHRlblwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L3BpY3R1cmU+XHJcbiAgICAgICAgICAgICAgPC9maWd1cmU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fYmdpbWFnZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+QmFja2dyb3VuZCBpbWFnZXM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiYmFja2dyb3VuZC1pbWFnZTp1cmwoJ2h0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzMwMC8zMDAnKTsgd2lkdGg6MzAwcHg7IGhlaWdodDogMzAwcHg7XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19hdWRpb1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5BdWRpbzwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PGF1ZGlvIGNvbnRyb2xzPVwiXCI+YXVkaW88L2F1ZGlvPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fdmlkZW9cIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+VmlkZW88L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2Pjx2aWRlbyBjb250cm9scz1cIlwiPnZpZGVvPC92aWRlbz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2NhbnZhc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5DYW52YXM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxjYW52YXM+Y2FudmFzPC9jYW52YXM+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19tZXRlclwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5NZXRlcjwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PG1ldGVyIHZhbHVlPVwiMlwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiPjIgb3V0IG9mIDEwPC9tZXRlcj48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX3Byb2dyZXNzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPlByb2dyZXNzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48cHJvZ3Jlc3M+cHJvZ3Jlc3M8L3Byb2dyZXNzPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fc3ZnXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPklubGluZSBTVkc8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2Pjxzdmcgd2lkdGg9XCIxMDBweFwiIGhlaWdodD1cIjEwMHB4XCI+PGNpcmNsZSBjeD1cIjEwMFwiIGN5PVwiMTAwXCIgcj1cIjEwMFwiIGZpbGw9XCIjMWZhM2VjXCI+PC9jaXJjbGU+PC9zdmc+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19pZnJhbWVcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SUZyYW1lPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48aWZyYW1lIHNyYz1cImluZGV4Lmh0bWxcIiBoZWlnaHQ9XCIzMDBcIj48L2lmcmFtZT48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2VtYmVkXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkVtYmVkPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48ZW1iZWQgc3JjPVwiaW5kZXguaHRtbFwiIGhlaWdodD1cIjMwMFwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fb2JqZWN0XCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPk9iamVjdDwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PG9iamVjdCBkYXRhPVwiaW5kZXguaHRtbFwiIGhlaWdodD1cIjMwMFwiPjwvb2JqZWN0PjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8c2VjdGlvbiBpZD1cImZvcm1zXCI+XHJcbiAgICAgICAgICA8aGVhZGVyPjxoMj5Gb3JtIGVsZW1lbnRzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgIDxmb3JtPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19faW5wdXRcIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPklucHV0IGZpZWxkczwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X190ZXh0XCI+VGV4dCBJbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fdGV4dFwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJUZXh0IElucHV0XCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X19wYXNzd29yZFwiPlBhc3N3b3JkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiVHlwZSB5b3VyIFBhc3N3b3JkXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X193ZWJhZGRyZXNzXCI+V2ViIEFkZHJlc3M8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3dlYmFkZHJlc3NcIiB0eXBlPVwidXJsXCIgcGxhY2Vob2xkZXI9XCJodHRwczovL3lvdXJzaXRlLmNvbVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fZW1haWxhZGRyZXNzXCI+RW1haWwgQWRkcmVzczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fZW1haWxhZGRyZXNzXCIgdHlwZT1cImVtYWlsXCIgcGxhY2Vob2xkZXI9XCJuYW1lQGVtYWlsLmNvbVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fcGhvbmVcIj5QaG9uZSBOdW1iZXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3Bob25lXCIgdHlwZT1cInRlbFwiIHBsYWNlaG9sZGVyPVwiKDk5OSkgOTk5LTk5OTlcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3NlYXJjaFwiPlNlYXJjaDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fc2VhcmNoXCIgdHlwZT1cInNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgU2VhcmNoIFRlcm1cIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3RleHQyXCI+TnVtYmVyIElucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X190ZXh0MlwiIHR5cGU9XCJudW1iZXJcIiBwbGFjZWhvbGRlcj1cIkVudGVyIGEgTnVtYmVyXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X19maWxlXCI+RmlsZSBJbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fZmlsZVwiIHR5cGU9XCJmaWxlXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX3NlbGVjdFwiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+U2VsZWN0IG1lbnVzPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VsZWN0XCI+U2VsZWN0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJzZWxlY3RcIj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiT3B0aW9uIEdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gT25lPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gVHdvPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gVGhyZWU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgPC9vcHRncm91cD5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzZWxlY3RfbXVsdGlwbGVcIj5TZWxlY3QgKG11bHRpcGxlKTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwic2VsZWN0X211bHRpcGxlXCIgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJPcHRpb24gR3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBPbmU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBUd288L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBUaHJlZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8L29wdGdyb3VwPlxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX2NoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5DaGVja2JveGVzPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJjaGVja2JveDFcIj48aW5wdXQgaWQ9XCJjaGVja2JveDFcIiBuYW1lPVwiY2hlY2tib3hcIiB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPVwiY2hlY2tlZFwiPiBDaG9pY2UgQTwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwiY2hlY2tib3gyXCI+PGlucHV0IGlkPVwiY2hlY2tib3gyXCIgbmFtZT1cImNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCI+IENob2ljZSBCPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJjaGVja2JveDNcIj48aW5wdXQgaWQ9XCJjaGVja2JveDNcIiBuYW1lPVwiY2hlY2tib3hcIiB0eXBlPVwiY2hlY2tib3hcIj4gQ2hvaWNlIEM8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19yYWRpb1wiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+UmFkaW8gYnV0dG9uczwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwicmFkaW8xXCI+PGlucHV0IGlkPVwicmFkaW8xXCIgbmFtZT1cInJhZGlvXCIgdHlwZT1cInJhZGlvXCIgY2hlY2tlZD1cImNoZWNrZWRcIj4gT3B0aW9uIDE8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cInJhZGlvMlwiPjxpbnB1dCBpZD1cInJhZGlvMlwiIG5hbWU9XCJyYWRpb1wiIHR5cGU9XCJyYWRpb1wiPiBPcHRpb24gMjwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwicmFkaW8zXCI+PGlucHV0IGlkPVwicmFkaW8zXCIgbmFtZT1cInJhZGlvXCIgdHlwZT1cInJhZGlvXCI+IE9wdGlvbiAzPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fdGV4dGFyZWFzXCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5UZXh0YXJlYXM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ0ZXh0YXJlYVwiPlRleHRhcmVhPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cInRleHRhcmVhXCIgcm93cz1cIjhcIiBjb2xzPVwiNDhcIiBwbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgbWVzc2FnZSBoZXJlXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19faHRtbDVcIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPkhUTUw1IGlucHV0czwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImljXCI+Q29sb3IgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjb2xvclwiIGlkPVwiaWNcIiB2YWx1ZT1cIiMwMDAwMDBcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5cIj5OdW1iZXIgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cImluXCIgbWluPVwiMFwiIG1heD1cIjEwXCIgdmFsdWU9XCI1XCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlyXCI+UmFuZ2UgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYW5nZVwiIGlkPVwiaXJcIiB2YWx1ZT1cIjEwXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkZFwiPkRhdGUgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgaWQ9XCJpZGRcIiB2YWx1ZT1cIjE5NzAtMDEtMDFcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWRtXCI+TW9udGggaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJtb250aFwiIGlkPVwiaWRtXCIgdmFsdWU9XCIxOTcwLTAxXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkd1wiPldlZWsgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ3ZWVrXCIgaWQ9XCJpZHdcIiB2YWx1ZT1cIjE5NzAtVzAxXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkdFwiPkRhdGV0aW1lIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWVcIiBpZD1cImlkdFwiIHZhbHVlPVwiMTk3MC0wMS0wMVQwMDowMDowMFpcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWR0bFwiPkRhdGV0aW1lLWxvY2FsIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZXRpbWUtbG9jYWxcIiBpZD1cImlkdGxcIiB2YWx1ZT1cIjE5NzAtMDEtMDFUMDA6MDBcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWRsXCI+RGF0YWxpc3Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJpZGxcIiBsaXN0PVwiZXhhbXBsZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGF0YWxpc3QgaWQ9XCJleGFtcGxlLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkV4YW1wbGUgIzFcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRXhhbXBsZSAjMlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFeGFtcGxlICMzXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGF0YWxpc3Q+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX2FjdGlvblwiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+QWN0aW9uIGJ1dHRvbnM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCI8aW5wdXQgdHlwZT1zdWJtaXQ+XCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPGlucHV0IHR5cGU9YnV0dG9uPlwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyZXNldFwiIHZhbHVlPVwiPGlucHV0IHR5cGU9cmVzZXQ+XCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiPGlucHV0IGRpc2FibGVkPlwiIGRpc2FibGVkPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPiZsdDtidXR0b24gdHlwZT1zdWJtaXQmZ3Q7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIj4mbHQ7YnV0dG9uIHR5cGU9YnV0dG9uJmd0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwicmVzZXRcIj4mbHQ7YnV0dG9uIHR5cGU9cmVzZXQmZ3Q7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkaXNhYmxlZD4mbHQ7YnV0dG9uIGRpc2FibGVkJmd0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICA8L21haW4+XHJcbiAgICAgIDxmb290ZXI+XHJcbiAgICAgICAgPHA+TWFkZSBieSA8YSBocmVmPVwiaHR0cDovL3R3aXR0ZXIuY29tL2NicmFjY29cIj5AY2JyYWNjbzwvYT4uIENvZGUgb24gPGEgaHJlZj1cImh0dHA6Ly9naXRodWIuY29tL2NicmFjY28vaHRtbDUtdGVzdC1wYWdlXCI+R2l0SHViPC9hPi48L3A+XHJcbiAgICAgIDwvZm9vdGVyPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9ib2R5PlxyXG48L2h0bWw+XHJcbmA7XHJcbiIsImV4cG9ydCBjbGFzcyBLYXNwZXJFcnJvciB7XHJcbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sOiBudW1iZXIpIHtcclxuICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB0aGlzLmNvbCA9IGNvbDtcclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGVtb1NvdXJjZSB9IGZyb20gXCIuL2RlbW9cIjtcclxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vcGFyc2VyXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xyXG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XHJcbiAgaWYgKHBhcnNlci5lcnJvcnMubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGFyc2VyLmVycm9ycyk7XHJcbiAgfVxyXG4gIGNvbnN0IHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcclxuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xyXG4gIGlmIChwYXJzZXIuZXJyb3JzLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBhcnNlci5lcnJvcnMpO1xyXG4gIH1cclxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xyXG59XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICh3aW5kb3cgYXMgYW55KS5rYXNwZXIgPSB7XHJcbiAgICBkZW1vU291cmNlQ29kZTogRGVtb1NvdXJjZSxcclxuICAgIGV4ZWN1dGUsXHJcbiAgICBwYXJzZSxcclxuICB9O1xyXG59IGVsc2Uge1xyXG4gIGV4cG9ydHMua2FzcGVyID0ge1xyXG4gICAgZXhlY3V0ZSxcclxuICAgIHBhcnNlLFxyXG4gIH07XHJcbn1cclxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5vZGUge1xyXG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOb2RlVmlzaXRvcjxSPiB7XHJcbiAgICB2aXNpdEVsZW1lbnROb2RlKG5vZGU6IEVsZW1lbnQpOiBSO1xyXG4gICAgdmlzaXRBdHRyaWJ1dGVOb2RlKG5vZGU6IEF0dHJpYnV0ZSk6IFI7XHJcbiAgICB2aXNpdFRleHROb2RlKG5vZGU6IFRleHQpOiBSO1xyXG4gICAgdmlzaXRDb21tZW50Tm9kZShub2RlOiBDb21tZW50KTogUjtcclxuICAgIHZpc2l0RG9jdHlwZU5vZGUobm9kZTogRG9jdHlwZSk6IFI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgTm9kZSB7XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGF0dHJpYnV0ZXM6IE5vZGVbXTtcclxuICAgIHB1YmxpYyBjaGlsZHJlbjogTm9kZVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogTm9kZVtdLCBjaGlsZHJlbjogTm9kZVtdLCBsaW5lOiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcclxuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcclxuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnROb2RlKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnTm9kZS5FbGVtZW50JztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBleHRlbmRzIE5vZGUge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gJ2F0dHJpYnV0ZSc7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XHJcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVOb2RlKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnTm9kZS5BdHRyaWJ1dGUnO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIE5vZGUge1xyXG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcclxuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHROb2RlKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnTm9kZS5UZXh0JztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBOb2RlIHtcclxuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudHlwZSA9ICdjb21tZW50JztcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XHJcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50Tm9kZSh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ05vZGUuQ29tbWVudCc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgTm9kZSB7XHJcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xyXG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZU5vZGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdOb2RlLkRvY3R5cGUnO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciB9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCAqIGFzIE5vZGUgZnJvbSBcIi4vbm9kZXNcIjtcclxuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcclxuICBwdWJsaWMgY3VycmVudDogbnVtYmVyO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcclxuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXTtcclxuICBwdWJsaWMgbm9kZXM6IE5vZGUuTm9kZVtdO1xyXG5cclxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLk5vZGVbXSB7XHJcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xyXG4gICAgdGhpcy5saW5lID0gMTtcclxuICAgIHRoaXMuY29sID0gMTtcclxuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgIHRoaXMubm9kZXMgPSBbXTtcclxuXHJcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGBQYXJzZSBFcnJvciAoJHtlLmxpbmV9OiR7ZS5jb2x9KSA9PiAke2UudmFsdWV9YCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcclxuICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAxMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiUGFyc2UgRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xyXG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XHJcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkdmFuY2UoZW9mRXJyb3I6IHN0cmluZyA9IFwiXCIpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5lb2YoKSkge1xyXG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xyXG4gICAgICAgIHRoaXMubGluZSArPSAxO1xyXG4gICAgICAgIHRoaXMuY29sID0gMDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNvbCArPSAxO1xyXG4gICAgICB0aGlzLmN1cnJlbnQrKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuICR7ZW9mRXJyb3J9YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZSh0aGlzLmN1cnJlbnQsIHRoaXMuY3VycmVudCArIGNoYXIubGVuZ3RoKSA9PT0gY2hhcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogYW55IHtcclxuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLk5vZGUge1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICBsZXQgbm9kZTogTm9kZS5Ob2RlO1xyXG5cclxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcclxuICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgY2xvc2luZyB0YWdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8IS0tXCIpKSB7XHJcbiAgICAgIG5vZGUgPSB0aGlzLmNvbW1lbnQoKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSB8fCB0aGlzLm1hdGNoKFwiPCFET0NUWVBFXCIpKSB7XHJcbiAgICAgIG5vZGUgPSB0aGlzLmRvY3R5cGUoKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaChcIjxcIikpIHtcclxuICAgICAgbm9kZSA9IHRoaXMuZWxlbWVudCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZSA9IHRoaXMudGV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgcmV0dXJuIG5vZGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5Ob2RlIHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgZG8ge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjb21tZW50IGNsb3NpbmcgJy0tPidcIik7XHJcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xyXG4gICAgY29uc3QgY29tbWVudCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAzKTtcclxuICAgIHJldHVybiBuZXcgTm9kZS5Db21tZW50KGNvbW1lbnQsIHRoaXMubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRvY3R5cGUoKTogTm9kZS5Ob2RlIHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgZG8ge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoXCJFeHBlY3RlZCBjbG9zaW5nIGRvY3R5cGVcIik7XHJcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcclxuICAgIGNvbnN0IGRvY3R5cGUgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSkudHJpbSgpO1xyXG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLk5vZGUge1xyXG4gICAgY29uc3QgbGluZSA9IHRoaXMubGluZTtcclxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcclxuICAgIGlmICghbmFtZSkge1xyXG4gICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgYSB0YWcgbmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzKCk7XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLm1hdGNoKFwiLz5cIikgfHxcclxuICAgICAgKFNlbGZDbG9zaW5nVGFncy5pbmNsdWRlcyhuYW1lKSAmJiB0aGlzLm1hdGNoKFwiPlwiKSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBbXSwgdGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2hpbGRyZW46IE5vZGUuTm9kZVtdID0gW107XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIGlmICghdGhpcy5wZWVrKFwiPC9cIikpIHtcclxuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2xvc2UobmFtZSk7XHJcbiAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiwgbGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNsb3NlKG5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcclxuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcclxuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xyXG4gICAgfVxyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLk5vZGVbXSB7XHJcbiAgICBjb25zdCBjaGlsZHJlbjogTm9kZS5Ob2RlW10gPSBbXTtcclxuICAgIGRvIHtcclxuICAgICAgaWYgKHRoaXMuZW9mKCkpIHtcclxuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XHJcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcclxuICAgIH0gd2hpbGUgKCF0aGlzLnBlZWsoYDwvYCkpO1xyXG5cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE5vZGUuQXR0cmlidXRlW10gPSBbXTtcclxuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xyXG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcclxuICAgICAgaWYgKCFuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvcihcIkJsYW5rIGF0dHJpYnV0ZSBuYW1lXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICBsZXQgdmFsdWUgPSBcIlwiO1xyXG4gICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcclxuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIidcIikpIHtcclxuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoXCInXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZygnXCInKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmlkZW50aWZpZXIoXCI+XCIsIFwiLz5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICBhdHRyaWJ1dGVzLnB1c2gobmV3IE5vZGUuQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBsaW5lKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXR0cmlidXRlcztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdGV4dCgpOiBOb2RlLk5vZGUge1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XHJcbiAgICBjb25zdCBsaW5lID0gdGhpcy5saW5lO1xyXG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI8XCIpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcclxuICAgIGlmICghdGV4dCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRleHQsIGxpbmUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB3aGl0ZXNwYWNlKCk6IG51bWJlciB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcclxuICAgICAgY291bnQgKz0gMTtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY291bnQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlkZW50aWZpZXIoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgIHdoaWxlICghdGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzLCAuLi5jbG9zaW5nKSkge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoYEV4cGVjdGVkIGNsb3NpbmcgJHtjbG9zaW5nfWApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZW5kID0gdGhpcy5jdXJyZW50O1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdHJpbmcoY2xvc2luZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKGNsb3NpbmcpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZShgRXhwZWN0ZWQgY2xvc2luZyAke2Nsb3Npbmd9YCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gY2hhciA+PSBcIjBcIiAmJiBjaGFyIDw9IFwiOVwiO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYShjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==