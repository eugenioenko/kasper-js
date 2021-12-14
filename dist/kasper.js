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
const DemoSource = `
<!doctype html>
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
    return JSON.stringify(nodes);
}
if (typeof window !== "undefined") {
    window.demoSourceCode = _demo__WEBPACK_IMPORTED_MODULE_0__["DemoSource"];
    window.kasper = {
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
    advance() {
        if (!this.eof()) {
            if (this.check("\n")) {
                this.line += 1;
                this.col = 0;
            }
            this.col += 1;
            this.current++;
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
        const node = this.comment();
        this.whitespace();
        return node;
    }
    comment() {
        if (this.match("<!--")) {
            const start = this.current;
            do {
                this.advance();
            } while (!this.match(`-->`));
            const comment = this.source.slice(start, this.current - 3);
            return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Comment"](comment, this.line);
        }
        return this.doctype();
    }
    doctype() {
        if (this.match("<!doctype")) {
            const start = this.current;
            do {
                this.advance();
            } while (!this.match(`>`));
            const doctype = this.source.slice(start, this.current - 1);
            return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Doctype"](doctype, this.line);
        }
        return this.element();
    }
    element() {
        if (this.match("</")) {
            this.error("Unexpected closing tag");
        }
        if (!this.match("<")) {
            return this.text();
        }
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
        if (!this.peek("</")) {
            children = this.children(name);
        }
        this.close(name);
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Element"](name, attributes, children, this.line);
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
            const name = this.identifier("=", ">", "/>");
            if (!name) {
                debugger;
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
            attributes.push(new _nodes__WEBPACK_IMPORTED_MODULE_1__["Attribute"](name, value, this.line));
        }
        return attributes;
    }
    text() {
        const start = this.current;
        while (!this.peek("<") && !this.eof()) {
            this.advance();
        }
        const text = this.source.slice(start, this.current).trim();
        if (!text) {
            return null;
        }
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Text"](text, this.line);
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
        while (!this.peek(..._utils__WEBPACK_IMPORTED_MODULE_2__["WhiteSpaces"], ...closing) && !this.eof()) {
            this.advance();
        }
        const end = this.current;
        this.whitespace();
        return this.source.slice(start, end).trim();
    }
    string(...closing) {
        const start = this.current;
        while (!this.match(...closing) && !this.eof()) {
            this.advance();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vycm9yLnRzIiwid2VicGFjazovLy8uL3NyYy9rYXNwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25vZGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQU8sTUFBTSxXQUFXLEdBQUc7Ozs7Ozs7Q0FPMUIsQ0FBQztBQUNLLE1BQU0sVUFBVSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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O0lBQ0wsT0FBTztJQUNQLE1BQU07SUFDTixNQUFNO0lBQ04sT0FBTztJQUNQLFFBQVE7SUFDUixPQUFPO0lBQ1AsS0FBSztDQUNOLENBQUMiLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMva2FzcGVyLnRzXCIpO1xuIiwiZXhwb3J0IGNvbnN0IERlbW9Tb3VyY2UxID0gYFxyXG48Ym9keSAgICA+XHJcbjxkaXYgICAgICAgICBjbGFzcz1cImJsb2NrIHctZnVsbCBmbGV4XCIgaWQ9XCJibG9ja1wiPjwvZGl2PlxyXG48aW1nICAgICAgIHNyYz1cImh0dHA6Ly91cmwuaW1hZ2UuY29tXCIgYm9yZGVyICA9ICAwIC8+XHJcbjxkaXYgY2xhc3M9J2ItbmFuYSc+PC9kaXY+XHJcbjxpbnB1dCB0eXBlPWNoZWNrYm94IHZhbHVlID0gICAgc29tZXRoaW5nIC8+XHJcbjwvYm9keT5cclxuYDtcclxuZXhwb3J0IGNvbnN0IERlbW9Tb3VyY2UgPSBgXHJcbjwhZG9jdHlwZSBodG1sPlxyXG48aHRtbCBsYW5nPVwiZW5cIj5cclxuICA8aGVhZD5cclxuICAgIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPlxyXG4gICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjBcIj5cclxuICAgIDx0aXRsZT5IVE1MNSBUZXN0IFBhZ2U8L3RpdGxlPlxyXG4gIDwvaGVhZD5cclxuICA8Ym9keT5cclxuICAgIDxkaXYgaWQ9XCJ0b3BcIiByb2xlPVwiZG9jdW1lbnRcIj5cclxuICAgICAgPGhlYWRlcj5cclxuICAgICAgICA8aDE+SFRNTDUgVGVzdCBQYWdlPC9oMT5cclxuICAgICAgICA8cD5UaGlzIGlzIGEgdGVzdCBwYWdlIGZpbGxlZCB3aXRoIGNvbW1vbiBIVE1MIGVsZW1lbnRzIHRvIGJlIHVzZWQgdG8gcHJvdmlkZSB2aXN1YWwgZmVlZGJhY2sgd2hpbHN0IGJ1aWxkaW5nIENTUyBzeXN0ZW1zIGFuZCBmcmFtZXdvcmtzLjwvcD5cclxuICAgICAgPC9oZWFkZXI+XHJcbiAgICAgIDxuYXY+XHJcbiAgICAgICAgPHVsPlxyXG4gICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI3RleHRcIj5UZXh0PC9hPlxyXG4gICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9faGVhZGluZ3NcIj5IZWFkaW5nczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX3BhcmFncmFwaHNcIj5QYXJhZ3JhcGhzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fbGlzdHNcIj5MaXN0czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2Jsb2NrcXVvdGVzXCI+QmxvY2txdW90ZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19kZXRhaWxzXCI+RGV0YWlscyAvIFN1bW1hcnk8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19hZGRyZXNzXCI+QWRkcmVzczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2hyXCI+SG9yaXpvbnRhbCBydWxlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX3RhYmxlc1wiPlRhYnVsYXIgZGF0YTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2NvZGVcIj5Db2RlPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9faW5saW5lXCI+SW5saW5lIGVsZW1lbnRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fY29tbWVudHNcIj5IVE1MIENvbW1lbnRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI2VtYmVkZGVkXCI+RW1iZWRkZWQgY29udGVudDwvYT5cclxuICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19pbWFnZXNcIj5JbWFnZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fYmdpbWFnZXNcIj5CYWNrZ3JvdW5kIGltYWdlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19hdWRpb1wiPkF1ZGlvPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX3ZpZGVvXCI+VmlkZW88L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fY2FudmFzXCI+Q2FudmFzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX21ldGVyXCI+TWV0ZXI8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fcHJvZ3Jlc3NcIj5Qcm9ncmVzczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19zdmdcIj5JbmxpbmUgU1ZHPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2lmcmFtZVwiPklGcmFtZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fZW1iZWRcIj5FbWJlZDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19vYmplY3RcIj5PYmplY3Q8L2E+PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjZm9ybXNcIj5Gb3JtIGVsZW1lbnRzPC9hPlxyXG4gICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX2lucHV0XCI+SW5wdXQgZmllbGRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX3NlbGVjdFwiPlNlbGVjdCBtZW51czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19jaGVja2JveFwiPkNoZWNrYm94ZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19fcmFkaW9cIj5SYWRpbyBidXR0b25zPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX3RleHRhcmVhc1wiPlRleHRhcmVhczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19odG1sNVwiPkhUTUw1IGlucHV0czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19hY3Rpb25cIj5BY3Rpb24gYnV0dG9uczwvYT48L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICA8L25hdj5cclxuICAgICAgPG1haW4+XHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJ0ZXh0XCI+XHJcbiAgICAgICAgICA8aGVhZGVyPjxoMT5UZXh0PC9oMT48L2hlYWRlcj5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9faGVhZGluZ3NcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj5cclxuICAgICAgICAgICAgICA8aDI+SGVhZGluZ3M8L2gyPlxyXG4gICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDE+SGVhZGluZyAxPC9oMT5cclxuICAgICAgICAgICAgICA8aDI+SGVhZGluZyAyPC9oMj5cclxuICAgICAgICAgICAgICA8aDM+SGVhZGluZyAzPC9oMz5cclxuICAgICAgICAgICAgICA8aDQ+SGVhZGluZyA0PC9oND5cclxuICAgICAgICAgICAgICA8aDU+SGVhZGluZyA1PC9oNT5cclxuICAgICAgICAgICAgICA8aDY+SGVhZGluZyA2PC9oNj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX3BhcmFncmFwaHNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+UGFyYWdyYXBoczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPHA+QSBwYXJhZ3JhcGggKGZyb20gdGhlIEdyZWVrIHBhcmFncmFwaG9zLCDigJx0byB3cml0ZSBiZXNpZGXigJ0gb3Ig4oCcd3JpdHRlbiBiZXNpZGXigJ0pIGlzIGEgc2VsZi1jb250YWluZWQgdW5pdCBvZiBhIGRpc2NvdXJzZSBpbiB3cml0aW5nIGRlYWxpbmcgd2l0aCBhIHBhcnRpY3VsYXIgcG9pbnQgb3IgaWRlYS4gQSBwYXJhZ3JhcGggY29uc2lzdHMgb2Ygb25lIG9yIG1vcmUgc2VudGVuY2VzLiBUaG91Z2ggbm90IHJlcXVpcmVkIGJ5IHRoZSBzeW50YXggb2YgYW55IGxhbmd1YWdlLCBwYXJhZ3JhcGhzIGFyZSB1c3VhbGx5IGFuIGV4cGVjdGVkIHBhcnQgb2YgZm9ybWFsIHdyaXRpbmcsIHVzZWQgdG8gb3JnYW5pemUgbG9uZ2VyIHByb3NlLjwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2Jsb2NrcXVvdGVzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkJsb2NrcXVvdGVzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8YmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgIDxwPkEgYmxvY2sgcXVvdGF0aW9uIChhbHNvIGtub3duIGFzIGEgbG9uZyBxdW90YXRpb24gb3IgZXh0cmFjdCkgaXMgYSBxdW90YXRpb24gaW4gYSB3cml0dGVuIGRvY3VtZW50LCB0aGF0IGlzIHNldCBvZmYgZnJvbSB0aGUgbWFpbiB0ZXh0IGFzIGEgcGFyYWdyYXBoLCBvciBibG9jayBvZiB0ZXh0LjwvcD5cclxuICAgICAgICAgICAgICAgIDxwPkl0IGlzIHR5cGljYWxseSBkaXN0aW5ndWlzaGVkIHZpc3VhbGx5IHVzaW5nIGluZGVudGF0aW9uIGFuZCBhIGRpZmZlcmVudCB0eXBlZmFjZSBvciBzbWFsbGVyIHNpemUgcXVvdGF0aW9uLiBJdCBtYXkgb3IgbWF5IG5vdCBpbmNsdWRlIGEgY2l0YXRpb24sIHVzdWFsbHkgcGxhY2VkIGF0IHRoZSBib3R0b20uPC9wPlxyXG4gICAgICAgICAgICAgICAgPGNpdGU+PGEgaHJlZj1cIiMhXCI+U2FpZCBubyBvbmUsIGV2ZXIuPC9hPjwvY2l0ZT5cclxuICAgICAgICAgICAgICA8L2Jsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19saXN0c1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5MaXN0czwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgzPkRlZmluaXRpb24gbGlzdDwvaDM+XHJcbiAgICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgPGR0PkRlZmluaXRpb24gTGlzdCBUaXRsZTwvZHQ+XHJcbiAgICAgICAgICAgICAgICA8ZGQ+VGhpcyBpcyBhIGRlZmluaXRpb24gbGlzdCBkaXZpc2lvbi48L2RkPlxyXG4gICAgICAgICAgICAgIDwvZGw+XHJcbiAgICAgICAgICAgICAgPGgzPk9yZGVyZWQgTGlzdDwvaDM+XHJcbiAgICAgICAgICAgICAgPG9sIHR5cGU9XCIxXCI+XHJcbiAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICA8b2wgdHlwZT1cIkFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICA8b2wgdHlwZT1cImFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPG9sIHR5cGU9XCJJXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b2wgdHlwZT1cImlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgICAgICAgPGgzPlVub3JkZXJlZCBMaXN0PC9oMz5cclxuICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fYmxvY2txdW90ZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDE+QmxvY2txdW90ZXM8L2gxPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgPHA+QSBibG9jayBxdW90YXRpb24gKGFsc28ga25vd24gYXMgYSBsb25nIHF1b3RhdGlvbiBvciBleHRyYWN0KSBpcyBhIHF1b3RhdGlvbiBpbiBhIHdyaXR0ZW4gZG9jdW1lbnQsIHRoYXQgaXMgc2V0IG9mZiBmcm9tIHRoZSBtYWluIHRleHQgYXMgYSBwYXJhZ3JhcGgsIG9yIGJsb2NrIG9mIHRleHQuPC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+SXQgaXMgdHlwaWNhbGx5IGRpc3Rpbmd1aXNoZWQgdmlzdWFsbHkgdXNpbmcgaW5kZW50YXRpb24gYW5kIGEgZGlmZmVyZW50IHR5cGVmYWNlIG9yIHNtYWxsZXIgc2l6ZSBxdW90YXRpb24uIEl0IG1heSBvciBtYXkgbm90IGluY2x1ZGUgYSBjaXRhdGlvbiwgdXN1YWxseSBwbGFjZWQgYXQgdGhlIGJvdHRvbS48L3A+XHJcbiAgICAgICAgICAgICAgICA8Y2l0ZT48YSBocmVmPVwiIyFcIj5TYWlkIG5vIG9uZSwgZXZlci48L2E+PC9jaXRlPlxyXG4gICAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2RldGFpbHNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDE+RGV0YWlscyAvIFN1bW1hcnk8L2gxPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGV0YWlscz5cclxuICAgICAgICAgICAgICA8c3VtbWFyeT5FeHBhbmQgZm9yIGRldGFpbHM8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgICAgPHA+TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gQ3VtLCBvZGlvISBPZGlvIG5hdHVzIHVsbGFtIGFkIHF1YWVyYXQsIGVhcXVlIG5lY2Vzc2l0YXRpYnVzLCBhbGlxdWlkIGRpc3RpbmN0aW8gc2ltaWxpcXVlIHZvbHVwdGF0aWJ1cyBkaWN0YSBjb25zZXF1dW50dXIgYW5pbWkuIFF1YWVyYXQgZmFjaWxpcyBxdWlkZW0gdW5kZSBlb3MhIElwc2EuPC9wPlxyXG4gICAgICAgICAgICA8L2RldGFpbHM+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2FkZHJlc3NcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDE+QWRkcmVzczwvaDE+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxhZGRyZXNzPlxyXG4gICAgICAgICAgICAgIFdyaXR0ZW4gYnkgPGEgaHJlZj1cIm1haWx0bzp3ZWJtYXN0ZXJAZXhhbXBsZS5jb21cIj5Kb24gRG9lPC9hPi48YnI+XHJcbiAgICAgICAgICAgICAgVmlzaXQgdXMgYXQ6PGJyPlxyXG4gICAgICAgICAgICAgIEV4YW1wbGUuY29tPGJyPlxyXG4gICAgICAgICAgICAgIEJveCA1NjQsIERpc25leWxhbmQ8YnI+XHJcbiAgICAgICAgICAgICAgVVNBXHJcbiAgICAgICAgICAgIDwvYWRkcmVzcz5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9faHJcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SG9yaXpvbnRhbCBydWxlczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGhyPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fdGFibGVzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPlRhYnVsYXIgZGF0YTwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDx0YWJsZT5cclxuICAgICAgICAgICAgICA8Y2FwdGlvbj5UYWJsZSBDYXB0aW9uPC9jYXB0aW9uPlxyXG4gICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgMTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBIZWFkaW5nIDI8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgSGVhZGluZyAzPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgNDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBIZWFkaW5nIDU8L3RoPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgIDx0Zm9vdD5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciAxPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciAyPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciAzPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciA0PC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciA1PC90aD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgPC90Zm9vdD5cclxuICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDE8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAyPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDQ8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA1PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDE8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAyPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDQ8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA1PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDE8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAyPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDQ8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA1PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDE8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAyPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDQ8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA1PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fY29kZVwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5Db2RlPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8cD48c3Ryb25nPktleWJvYXJkIGlucHV0Ojwvc3Ryb25nPiA8a2JkPkNtZDwva2JkPjwvcD5cclxuICAgICAgICAgICAgICA8cD48c3Ryb25nPklubGluZSBjb2RlOjwvc3Ryb25nPiA8Y29kZT4mbHQ7ZGl2Jmd0O2NvZGUmbHQ7L2RpdiZndDs8L2NvZGU+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+U2FtcGxlIG91dHB1dDo8L3N0cm9uZz4gPHNhbXA+VGhpcyBpcyBzYW1wbGUgb3V0cHV0IGZyb20gYSBjb21wdXRlciBwcm9ncmFtLjwvc2FtcD48L3A+XHJcbiAgICAgICAgICAgICAgPGgyPlByZS1mb3JtYXR0ZWQgdGV4dDwvaDI+XHJcbiAgICAgICAgICAgICAgPHByZT5QIFIgRSBGIE8gUiBNIEEgVCBUIEUgRCBUIEUgWCBUXHJcbiAgISBcIiAjICQgJSAmYW1wOyAnICggKSAqICsgLCAtIC4gL1xyXG4gIDAgMSAyIDMgNCA1IDYgNyA4IDkgOiA7ICZsdDsgPSAmZ3Q7ID9cclxuICBAIEEgQiBDIEQgRSBGIEcgSCBJIEogSyBMIE0gTiBPXHJcbiAgUCBRIFIgUyBUIFUgViBXIFggWSBaIFsgXFxcXCBdIF4gX1xyXG4gIFxcYCBhIGIgYyBkIGUgZiBnIGggaSBqIGsgbCBtIG4gb1xyXG4gIHAgcSByIHMgdCB1IHYgdyB4IHkgeiB7IHwgfSB+IDwvcHJlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9faW5saW5lXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPklubGluZSBlbGVtZW50czwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiMhXCI+VGhpcyBpcyBhIHRleHQgbGluazwvYT4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+U3Ryb25nIGlzIHVzZWQgdG8gaW5kaWNhdGUgc3Ryb25nIGltcG9ydGFuY2UuPC9zdHJvbmc+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxlbT5UaGlzIHRleHQgaGFzIGFkZGVkIGVtcGhhc2lzLjwvZW0+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8Yj5iIGVsZW1lbnQ8L2I+IGlzIHN0eWxpc3RpY2FsbHkgZGlmZmVyZW50IHRleHQgZnJvbSBub3JtYWwgdGV4dCwgd2l0aG91dCBhbnkgc3BlY2lhbCBpbXBvcnRhbmNlLjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPGk+aSBlbGVtZW50PC9pPiBpcyB0ZXh0IHRoYXQgaXMgb2Zmc2V0IGZyb20gdGhlIG5vcm1hbCB0ZXh0LjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPHU+dSBlbGVtZW50PC91PiBpcyB0ZXh0IHdpdGggYW4gdW5hcnRpY3VsYXRlZCwgdGhvdWdoIGV4cGxpY2l0bHkgcmVuZGVyZWQsIG5vbi10ZXh0dWFsIGFubm90YXRpb24uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxkZWw+VGhpcyB0ZXh0IGlzIGRlbGV0ZWQ8L2RlbD4gYW5kIDxpbnM+VGhpcyB0ZXh0IGlzIGluc2VydGVkPC9pbnM+LjwvcD5cclxuICAgICAgICAgICAgICA8cD48cz5UaGlzIHRleHQgaGFzIGEgc3RyaWtldGhyb3VnaDwvcz4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlN1cGVyc2NyaXB0PHN1cD7Crjwvc3VwPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+U3Vic2NyaXB0IGZvciB0aGluZ3MgbGlrZSBIPHN1Yj4yPC9zdWI+Ty48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHNtYWxsPlRoaXMgc21hbGwgdGV4dCBpcyBzbWFsbCBmb3IgZmluZSBwcmludCwgZXRjLjwvc21hbGw+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPkFiYnJldmlhdGlvbjogPGFiYnIgdGl0bGU9XCJIeXBlclRleHQgTWFya3VwIExhbmd1YWdlXCI+SFRNTDwvYWJicj48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHEgY2l0ZT1cImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvSFRNTC9FbGVtZW50L3FcIj5UaGlzIHRleHQgaXMgYSBzaG9ydCBpbmxpbmUgcXVvdGF0aW9uLjwvcT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PGNpdGU+VGhpcyBpcyBhIGNpdGF0aW9uLjwvY2l0ZT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDxkZm4+ZGZuIGVsZW1lbnQ8L2Rmbj4gaW5kaWNhdGVzIGEgZGVmaW5pdGlvbi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDxtYXJrPm1hcmsgZWxlbWVudDwvbWFyaz4gaW5kaWNhdGVzIGEgaGlnaGxpZ2h0LjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPHZhcj52YXJpYWJsZSBlbGVtZW50PC92YXI+LCBzdWNoIGFzIDx2YXI+eDwvdmFyPiA9IDx2YXI+eTwvdmFyPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIHRpbWUgZWxlbWVudDogPHRpbWUgZGF0ZXRpbWU9XCIyMDEzLTA0LTA2VDEyOjMyKzAwOjAwXCI+MiB3ZWVrcyBhZ288L3RpbWU+PC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fY29tbWVudHNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SFRNTCBDb21tZW50czwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPHA+VGhlcmUgaXMgY29tbWVudCBoZXJlOiA8IS0tVGhpcyBjb21tZW50IHNob3VsZCBub3QgYmUgZGlzcGxheWVkLS0+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZXJlIGlzIGEgY29tbWVudCBzcGFubmluZyBtdWx0aXBsZSB0YWdzIGFuZCBsaW5lcyBiZWxvdyBoZXJlLjwvcD5cclxuICAgICAgICAgICAgICA8IS0tPHA+PGEgaHJlZj1cIiMhXCI+VGhpcyBpcyBhIHRleHQgbGluay4gQnV0IGl0IHNob3VsZCBub3QgYmUgZGlzcGxheWVkIGluIGEgY29tbWVudDwvYT4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+U3Ryb25nIGlzIHVzZWQgdG8gaW5kaWNhdGUgc3Ryb25nIGltcG9ydGFuY2UuIEJ1dCwgaXQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQgaW4gYSBjb21tZW50PC9zdHJvbmc+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxlbT5UaGlzIHRleHQgaGFzIGFkZGVkIGVtcGhhc2lzLiBCdXQsIGl0IHNob3VsZCBub3QgYmUgZGlzcGxheWVkIGluIGEgY29tbWVudDwvZW0+PC9wPi0tPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJlbWJlZGRlZFwiPlxyXG4gICAgICAgICAgPGhlYWRlcj48aDI+RW1iZWRkZWQgY29udGVudDwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19pbWFnZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SW1hZ2VzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDM+UGxhaW4gPGNvZGU+Jmx0O2ltZyZndDs8L2NvZGU+IGVsZW1lbnQ8L2gzPlxyXG4gICAgICAgICAgICAgIDxwPjxpbWcgc3JjPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNDgwLzQ4MFwiIGFsdD1cIlBob3RvIG9mIGEga2l0dGVuXCI+PC9wPlxyXG4gICAgICAgICAgICAgIDxoMz48Y29kZT4mbHQ7ZmlndXJlJmd0OzwvY29kZT4gZWxlbWVudCB3aXRoIDxjb2RlPiZsdDtpbWcmZ3Q7PC9jb2RlPiBlbGVtZW50PC9oMz5cclxuICAgICAgICAgICAgICA8ZmlndXJlPjxpbWcgc3JjPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNDIwLzQyMFwiIGFsdD1cIlBob3RvIG9mIGEga2l0dGVuXCI+PC9maWd1cmU+XHJcbiAgICAgICAgICAgICAgPGgzPjxjb2RlPiZsdDtmaWd1cmUmZ3Q7PC9jb2RlPiBlbGVtZW50IHdpdGggPGNvZGU+Jmx0O2ltZyZndDs8L2NvZGU+IGFuZCA8Y29kZT4mbHQ7ZmlnY2FwdGlvbiZndDs8L2NvZGU+IGVsZW1lbnRzPC9oMz5cclxuICAgICAgICAgICAgICA8ZmlndXJlPlxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80MjAvNDIwXCIgYWx0PVwiUGhvdG8gb2YgYSBraXR0ZW5cIj5cclxuICAgICAgICAgICAgICAgIDxmaWdjYXB0aW9uPkhlcmUgaXMgYSBjYXB0aW9uIGZvciB0aGlzIGltYWdlLjwvZmlnY2FwdGlvbj5cclxuICAgICAgICAgICAgICA8L2ZpZ3VyZT5cclxuICAgICAgICAgICAgICA8aDM+PGNvZGU+Jmx0O2ZpZ3VyZSZndDs8L2NvZGU+IGVsZW1lbnQgd2l0aCBhIDxjb2RlPiZsdDtwaWN0dXJlJmd0OzwvY29kZT4gZWxlbWVudDwvaDM+XHJcbiAgICAgICAgICAgICAgPGZpZ3VyZT5cclxuICAgICAgICAgICAgICAgIDxwaWN0dXJlPlxyXG4gICAgICAgICAgICAgICAgICA8c291cmNlIHNyY3NldD1cImh0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzgwMC84MDBcIlxyXG4gICAgICAgICAgICAgICAgICAgIG1lZGlhPVwiKG1pbi13aWR0aDogODAwcHgpXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNDIwLzQyMFwiIGFsdD1cIlBob3RvIG9mIGEga2l0dGVuXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvcGljdHVyZT5cclxuICAgICAgICAgICAgICA8L2ZpZ3VyZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19iZ2ltYWdlc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5CYWNrZ3JvdW5kIGltYWdlczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOnVybCgnaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vMzAwLzMwMCcpOyB3aWR0aDozMDBweDsgaGVpZ2h0OiAzMDBweDtcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2F1ZGlvXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkF1ZGlvPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48YXVkaW8gY29udHJvbHM9XCJcIj5hdWRpbzwvYXVkaW8+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX192aWRlb1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5WaWRlbzwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PHZpZGVvIGNvbnRyb2xzPVwiXCI+dmlkZW88L3ZpZGVvPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fY2FudmFzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkNhbnZhczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PGNhbnZhcz5jYW52YXM8L2NhbnZhcz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX21ldGVyXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPk1ldGVyPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48bWV0ZXIgdmFsdWU9XCIyXCIgbWluPVwiMFwiIG1heD1cIjEwXCI+MiBvdXQgb2YgMTA8L21ldGVyPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fcHJvZ3Jlc3NcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+UHJvZ3Jlc3M8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2Pjxwcm9ncmVzcz5wcm9ncmVzczwvcHJvZ3Jlc3M+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19zdmdcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SW5saW5lIFNWRzwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PHN2ZyB3aWR0aD1cIjEwMHB4XCIgaGVpZ2h0PVwiMTAwcHhcIj48Y2lyY2xlIGN4PVwiMTAwXCIgY3k9XCIxMDBcIiByPVwiMTAwXCIgZmlsbD1cIiMxZmEzZWNcIj48L2NpcmNsZT48L3N2Zz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2lmcmFtZVwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5JRnJhbWU8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxpZnJhbWUgc3JjPVwiaW5kZXguaHRtbFwiIGhlaWdodD1cIjMwMFwiPjwvaWZyYW1lPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fZW1iZWRcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+RW1iZWQ8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxlbWJlZCBzcmM9XCJpbmRleC5odG1sXCIgaGVpZ2h0PVwiMzAwXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19vYmplY3RcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+T2JqZWN0PC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48b2JqZWN0IGRhdGE9XCJpbmRleC5odG1sXCIgaGVpZ2h0PVwiMzAwXCI+PC9vYmplY3Q+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgIDxzZWN0aW9uIGlkPVwiZm9ybXNcIj5cclxuICAgICAgICAgIDxoZWFkZXI+PGgyPkZvcm0gZWxlbWVudHM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgPGZvcm0+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19pbnB1dFwiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+SW5wdXQgZmllbGRzPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3RleHRcIj5UZXh0IElucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X190ZXh0XCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRleHQgSW5wdXRcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3Bhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJUeXBlIHlvdXIgUGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3dlYmFkZHJlc3NcIj5XZWIgQWRkcmVzczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fd2ViYWRkcmVzc1wiIHR5cGU9XCJ1cmxcIiBwbGFjZWhvbGRlcj1cImh0dHBzOi8veW91cnNpdGUuY29tXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X19lbWFpbGFkZHJlc3NcIj5FbWFpbCBBZGRyZXNzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19lbWFpbGFkZHJlc3NcIiB0eXBlPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cIm5hbWVAZW1haWwuY29tXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X19waG9uZVwiPlBob25lIE51bWJlcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fcGhvbmVcIiB0eXBlPVwidGVsXCIgcGxhY2Vob2xkZXI9XCIoOTk5KSA5OTktOTk5OVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fc2VhcmNoXCI+U2VhcmNoPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19zZWFyY2hcIiB0eXBlPVwic2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBTZWFyY2ggVGVybVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fdGV4dDJcIj5OdW1iZXIgSW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3RleHQyXCIgdHlwZT1cIm51bWJlclwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgYSBOdW1iZXJcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX2ZpbGVcIj5GaWxlIElucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19maWxlXCIgdHlwZT1cImZpbGVcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fc2VsZWN0XCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5TZWxlY3QgbWVudXM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzZWxlY3RcIj5TZWxlY3Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNlbGVjdFwiPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJPcHRpb24gR3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBPbmU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBUd288L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBUaHJlZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8L29wdGdyb3VwPlxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNlbGVjdF9tdWx0aXBsZVwiPlNlbGVjdCAobXVsdGlwbGUpPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJzZWxlY3RfbXVsdGlwbGVcIiBtdWx0aXBsZT1cIm11bHRpcGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIk9wdGlvbiBHcm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIE9uZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIFR3bzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIFRocmVlPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fY2hlY2tib3hcIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPkNoZWNrYm94ZXM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cImNoZWNrYm94MVwiPjxpbnB1dCBpZD1cImNoZWNrYm94MVwiIG5hbWU9XCJjaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9XCJjaGVja2VkXCI+IENob2ljZSBBPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJjaGVja2JveDJcIj48aW5wdXQgaWQ9XCJjaGVja2JveDJcIiBuYW1lPVwiY2hlY2tib3hcIiB0eXBlPVwiY2hlY2tib3hcIj4gQ2hvaWNlIEI8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cImNoZWNrYm94M1wiPjxpbnB1dCBpZD1cImNoZWNrYm94M1wiIG5hbWU9XCJjaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiPiBDaG9pY2UgQzwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX3JhZGlvXCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5SYWRpbyBidXR0b25zPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJyYWRpbzFcIj48aW5wdXQgaWQ9XCJyYWRpbzFcIiBuYW1lPVwicmFkaW9cIiB0eXBlPVwicmFkaW9cIiBjaGVja2VkPVwiY2hlY2tlZFwiPiBPcHRpb24gMTwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwicmFkaW8yXCI+PGlucHV0IGlkPVwicmFkaW8yXCIgbmFtZT1cInJhZGlvXCIgdHlwZT1cInJhZGlvXCI+IE9wdGlvbiAyPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJyYWRpbzNcIj48aW5wdXQgaWQ9XCJyYWRpbzNcIiBuYW1lPVwicmFkaW9cIiB0eXBlPVwicmFkaW9cIj4gT3B0aW9uIDM8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX190ZXh0YXJlYXNcIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPlRleHRhcmVhczwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInRleHRhcmVhXCI+VGV4dGFyZWE8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwidGV4dGFyZWFcIiByb3dzPVwiOFwiIGNvbHM9XCI0OFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgeW91ciBtZXNzYWdlIGhlcmVcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19odG1sNVwiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+SFRNTDUgaW5wdXRzPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWNcIj5Db2xvciBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNvbG9yXCIgaWQ9XCJpY1wiIHZhbHVlPVwiIzAwMDAwMFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpblwiPk51bWJlciBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwiaW5cIiBtaW49XCIwXCIgbWF4PVwiMTBcIiB2YWx1ZT1cIjVcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaXJcIj5SYW5nZSBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgaWQ9XCJpclwiIHZhbHVlPVwiMTBcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWRkXCI+RGF0ZSBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBpZD1cImlkZFwiIHZhbHVlPVwiMTk3MC0wMS0wMVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZG1cIj5Nb250aCBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm1vbnRoXCIgaWQ9XCJpZG1cIiB2YWx1ZT1cIjE5NzAtMDFcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWR3XCI+V2VlayBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIndlZWtcIiBpZD1cImlkd1wiIHZhbHVlPVwiMTk3MC1XMDFcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWR0XCI+RGF0ZXRpbWUgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRldGltZVwiIGlkPVwiaWR0XCIgdmFsdWU9XCIxOTcwLTAxLTAxVDAwOjAwOjAwWlwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZHRsXCI+RGF0ZXRpbWUtbG9jYWwgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIGlkPVwiaWR0bFwiIHZhbHVlPVwiMTk3MC0wMS0wMVQwMDowMFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZGxcIj5EYXRhbGlzdDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlkbFwiIGxpc3Q9XCJleGFtcGxlLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgIDxkYXRhbGlzdCBpZD1cImV4YW1wbGUtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRXhhbXBsZSAjMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFeGFtcGxlICMyXCIgLz5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkV4YW1wbGUgIzNcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kYXRhbGlzdD5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fYWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5BY3Rpb24gYnV0dG9uczwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIjxpbnB1dCB0eXBlPXN1Ym1pdD5cIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI8aW5wdXQgdHlwZT1idXR0b24+XCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJlc2V0XCIgdmFsdWU9XCI8aW5wdXQgdHlwZT1yZXNldD5cIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCI8aW5wdXQgZGlzYWJsZWQ+XCIgZGlzYWJsZWQ+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+Jmx0O2J1dHRvbiB0eXBlPXN1Ym1pdCZndDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPiZsdDtidXR0b24gdHlwZT1idXR0b24mZ3Q7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJyZXNldFwiPiZsdDtidXR0b24gdHlwZT1yZXNldCZndDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPiZsdDtidXR0b24gZGlzYWJsZWQmZ3Q7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgIDwvbWFpbj5cclxuICAgICAgPGZvb3Rlcj5cclxuICAgICAgICA8cD5NYWRlIGJ5IDxhIGhyZWY9XCJodHRwOi8vdHdpdHRlci5jb20vY2JyYWNjb1wiPkBjYnJhY2NvPC9hPi4gQ29kZSBvbiA8YSBocmVmPVwiaHR0cDovL2dpdGh1Yi5jb20vY2JyYWNjby9odG1sNS10ZXN0LXBhZ2VcIj5HaXRIdWI8L2E+LjwvcD5cclxuICAgICAgPC9mb290ZXI+XHJcbiAgICA8L2Rpdj5cclxuICA8L2JvZHk+XHJcbjwvaHRtbD5cclxuYDtcclxuIiwiZXhwb3J0IGNsYXNzIEthc3BlckVycm9yIHtcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBwdWJsaWMgbGluZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2w6IG51bWJlcikge1xyXG4gICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIHRoaXMuY29sID0gY29sO1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBEZW1vU291cmNlIH0gZnJvbSBcIi4vZGVtb1wiO1xyXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9wYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcclxuICBpZiAocGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJzZXIuZXJyb3JzKTtcclxuICB9XHJcbiAgY29uc3QgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xyXG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAod2luZG93IGFzIGFueSkuZGVtb1NvdXJjZUNvZGUgPSBEZW1vU291cmNlO1xyXG4gICh3aW5kb3cgYXMgYW55KS5rYXNwZXIgPSB7XHJcbiAgICBleGVjdXRlLFxyXG4gICAgcGFyc2UsXHJcbiAgfTtcclxufSBlbHNlIHtcclxuICBleHBvcnRzLmthc3BlciA9IHtcclxuICAgIGV4ZWN1dGUsXHJcbiAgICBwYXJzZSxcclxuICB9O1xyXG59XHJcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOb2RlIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudE5vZGUobm9kZTogRWxlbWVudCk6IFI7XG4gICAgdmlzaXRBdHRyaWJ1dGVOb2RlKG5vZGU6IEF0dHJpYnV0ZSk6IFI7XG4gICAgdmlzaXRUZXh0Tm9kZShub2RlOiBUZXh0KTogUjtcbiAgICB2aXNpdENvbW1lbnROb2RlKG5vZGU6IENvbW1lbnQpOiBSO1xuICAgIHZpc2l0RG9jdHlwZU5vZGUobm9kZTogRG9jdHlwZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYXR0cmlidXRlczogTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogTm9kZVtdO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBOb2RlW10sIGNoaWxkcmVuOiBOb2RlW10sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnROb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuRWxlbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlIGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVOb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuQXR0cmlidXRlJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0Tm9kZSh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdOb2RlLlRleHQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnROb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuQ29tbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9jdHlwZSBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZU5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5Eb2N0eXBlJztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vZXJyb3JcIjtcclxuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi9ub2Rlc1wiO1xyXG5pbXBvcnQgeyBTZWxmQ2xvc2luZ1RhZ3MsIFdoaXRlU3BhY2VzIH0gZnJvbSBcIi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xyXG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xyXG4gIHB1YmxpYyBub2RlczogTm9kZS5Ob2RlW107XHJcblxyXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuTm9kZVtdIHtcclxuICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB0aGlzLmxpbmUgPSAxO1xyXG4gICAgdGhpcy5jb2wgPSAxO1xyXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgdGhpcy5ub2RlcyA9IFtdO1xyXG5cclxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcclxuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgS2FzcGVyRXJyb3IpIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYFBhcnNlIEVycm9yICgke2UubGluZX06JHtlLmNvbH0pID0+ICR7ZS52YWx1ZX1gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xyXG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJQYXJzZSBFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWF0Y2goLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gY2hhci5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWR2YW5jZSgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5lb2YoKSkge1xyXG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xyXG4gICAgICAgIHRoaXMubGluZSArPSAxO1xyXG4gICAgICAgIHRoaXMuY29sID0gMDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNvbCArPSAxO1xyXG4gICAgICB0aGlzLmN1cnJlbnQrKztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGVlayguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcclxuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xyXG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHRoaXMuY3VycmVudCwgdGhpcy5jdXJyZW50ICsgY2hhci5sZW5ndGgpID09PSBjaGFyO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRoaXMubGluZSwgdGhpcy5jb2wpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub2RlKCk6IE5vZGUuTm9kZSB7XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLmNvbW1lbnQoKTtcclxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgcmV0dXJuIG5vZGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5Ob2RlIHtcclxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xyXG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xyXG4gICAgICBjb25zdCBjb21tZW50ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDMpO1xyXG4gICAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuZG9jdHlwZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuTm9kZSB7XHJcbiAgICBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSkge1xyXG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcclxuICAgICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKTtcclxuICAgICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLk5vZGUge1xyXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8L1wiKSkge1xyXG4gICAgICB0aGlzLmVycm9yKFwiVW5leHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5tYXRjaChcIjxcIikpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCIvXCIsIFwiPlwiKTtcclxuICAgIGlmICghbmFtZSkge1xyXG4gICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgYSB0YWcgbmFtZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzKCk7XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLm1hdGNoKFwiLz5cIikgfHxcclxuICAgICAgKFNlbGZDbG9zaW5nVGFncy5pbmNsdWRlcyhuYW1lKSAmJiB0aGlzLm1hdGNoKFwiPlwiKSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gbmV3IE5vZGUuRWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzLCBbXSwgdGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2hpbGRyZW46IE5vZGUuTm9kZVtdID0gW107XHJcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XHJcbiAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbihuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNsb3NlKG5hbWUpO1xyXG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIHRoaXMubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNsb3NlKG5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcclxuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcclxuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xyXG4gICAgfVxyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLk5vZGVbXSB7XHJcbiAgICBjb25zdCBjaGlsZHJlbjogTm9kZS5Ob2RlW10gPSBbXTtcclxuICAgIGRvIHtcclxuICAgICAgaWYgKHRoaXMuZW9mKCkpIHtcclxuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XHJcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcclxuICAgIH0gd2hpbGUgKCF0aGlzLnBlZWsoYDwvYCkpO1xyXG5cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE5vZGUuQXR0cmlidXRlW10gPSBbXTtcclxuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcclxuICAgICAgaWYgKCFuYW1lKSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICAgIGxldCB2YWx1ZSA9IFwiXCI7XHJcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xyXG4gICAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiJ1wiKSkge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZyhcIidcIik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKCdcIicpKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuc3RyaW5nKCdcIicpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuaWRlbnRpZmllcihcIj5cIiwgXCIvPlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICAgIGF0dHJpYnV0ZXMucHVzaChuZXcgTm9kZS5BdHRyaWJ1dGUobmFtZSwgdmFsdWUsIHRoaXMubGluZSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF0dHJpYnV0ZXM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRleHQoKTogTm9kZS5Ob2RlIHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI8XCIpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcclxuICAgIGlmICghdGV4dCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRleHQsIHRoaXMubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICB3aGlsZSAodGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzKSAmJiAhdGhpcy5lb2YoKSkge1xyXG4gICAgICBjb3VudCArPSAxO1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb3VudDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZW5kID0gdGhpcy5jdXJyZW50O1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdHJpbmcoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XHJcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goLi4uY2xvc2luZykgJiYgIXRoaXMuZW9mKCkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gY2hhciA+PSBcIjBcIiAmJiBjaGFyIDw9IFwiOVwiO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYShjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==