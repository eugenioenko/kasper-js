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
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _demo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./demo */ "./src/demo.ts");
/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parser */ "./src/parser.ts");


const kasper = {
    execute: (source) => {
        const parser = new _parser__WEBPACK_IMPORTED_MODULE_1__["Parser"]();
        const nodes = parser.parse(source);
        console.log(nodes);
        console.log(parser.errors);
        if (parser.errors.length) {
            return JSON.stringify(parser.errors);
        }
        return JSON.stringify(nodes);
    },
};
if (typeof window !== "undefined") {
    window.demoSourceCode = _demo__WEBPACK_IMPORTED_MODULE_0__["DemoSource"];
    window.kasper = kasper;
}
else {
    exports.kasper = kasper;
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
                this.synchronize();
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
    synchronize() {
        do {
            this.advance();
        } while (!this.eof());
    }
    node() {
        return this.comment();
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
            debugger;
            this.error("Unexpected closing tag");
        }
        if (!this.match("<")) {
            return this.text();
        }
        const name = this.identifier("/", ">");
        if (!name) {
            debugger;
            this.error("Expected tag name");
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
        if (this.match(`</`)) {
            this.whitespace();
        }
        else {
            children = this.children(name);
        }
        this.close(name);
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Element"](name, attributes, children, this.line);
    }
    close(name) {
        if (!this.match(`${name}`)) {
            debugger;
            this.error(`Expected </${name}>`);
        }
        this.whitespace();
        if (!this.match(">")) {
            debugger;
            this.error(`Expected </${name}>`);
        }
    }
    children(parent) {
        this.whitespace();
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
        } while (!this.match(`</`));
        this.whitespace();
        return children;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vycm9yLnRzIiwid2VicGFjazovLy8uL3NyYy9rYXNwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25vZGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQU8sTUFBTSxXQUFXLEdBQUc7Ozs7Ozs7Q0FPMUIsQ0FBQztBQUNLLE1BQU0sVUFBVSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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TixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxLQUFLO0NBQ04sQ0FBQyIsImZpbGUiOiJrYXNwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9rYXNwZXIudHNcIik7XG4iLCJleHBvcnQgY29uc3QgRGVtb1NvdXJjZTEgPSBgXHJcbjxib2R5ICAgID5cclxuPGRpdiAgICAgICAgIGNsYXNzPVwiYmxvY2sgdy1mdWxsIGZsZXhcIiBpZD1cImJsb2NrXCI+PC9kaXY+XHJcbjxpbWcgICAgICAgc3JjPVwiaHR0cDovL3VybC5pbWFnZS5jb21cIiBib3JkZXIgID0gIDAgLz5cclxuPGRpdiBjbGFzcz0nYi1uYW5hJz48L2Rpdj5cclxuPGlucHV0IHR5cGU9Y2hlY2tib3ggdmFsdWUgPSAgICBzb21ldGhpbmcgLz5cclxuPC9ib2R5PlxyXG5gO1xyXG5leHBvcnQgY29uc3QgRGVtb1NvdXJjZSA9IGBcclxuPCFkb2N0eXBlIGh0bWw+XHJcbjxodG1sIGxhbmc9XCJlblwiPlxyXG4gIDxoZWFkPlxyXG4gICAgPG1ldGEgY2hhcnNldD1cInV0Zi04XCI+XHJcbiAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiPlxyXG4gICAgPHRpdGxlPkhUTUw1IFRlc3QgUGFnZTwvdGl0bGU+XHJcbiAgPC9oZWFkPlxyXG4gIDxib2R5PlxyXG4gICAgPGRpdiBpZD1cInRvcFwiIHJvbGU9XCJkb2N1bWVudFwiPlxyXG4gICAgICA8aGVhZGVyPlxyXG4gICAgICAgIDxoMT5IVE1MNSBUZXN0IFBhZ2U8L2gxPlxyXG4gICAgICAgIDxwPlRoaXMgaXMgYSB0ZXN0IHBhZ2UgZmlsbGVkIHdpdGggY29tbW9uIEhUTUwgZWxlbWVudHMgdG8gYmUgdXNlZCB0byBwcm92aWRlIHZpc3VhbCBmZWVkYmFjayB3aGlsc3QgYnVpbGRpbmcgQ1NTIHN5c3RlbXMgYW5kIGZyYW1ld29ya3MuPC9wPlxyXG4gICAgICA8L2hlYWRlcj5cclxuICAgICAgPG5hdj5cclxuICAgICAgICA8dWw+XHJcbiAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjdGV4dFwiPlRleHQ8L2E+XHJcbiAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19oZWFkaW5nc1wiPkhlYWRpbmdzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fcGFyYWdyYXBoc1wiPlBhcmFncmFwaHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19saXN0c1wiPkxpc3RzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fYmxvY2txdW90ZXNcIj5CbG9ja3F1b3RlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2RldGFpbHNcIj5EZXRhaWxzIC8gU3VtbWFyeTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2FkZHJlc3NcIj5BZGRyZXNzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9faHJcIj5Ib3Jpem9udGFsIHJ1bGVzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fdGFibGVzXCI+VGFidWxhciBkYXRhPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fY29kZVwiPkNvZGU8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19pbmxpbmVcIj5JbmxpbmUgZWxlbWVudHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19jb21tZW50c1wiPkhUTUwgQ29tbWVudHM8L2E+PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjZW1iZWRkZWRcIj5FbWJlZGRlZCBjb250ZW50PC9hPlxyXG4gICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2ltYWdlc1wiPkltYWdlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19iZ2ltYWdlc1wiPkJhY2tncm91bmQgaW1hZ2VzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2F1ZGlvXCI+QXVkaW88L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fdmlkZW9cIj5WaWRlbzwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19jYW52YXNcIj5DYW52YXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fbWV0ZXJcIj5NZXRlcjwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19wcm9ncmVzc1wiPlByb2dyZXNzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX3N2Z1wiPklubGluZSBTVkc8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9faWZyYW1lXCI+SUZyYW1lczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19lbWJlZFwiPkVtYmVkPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX29iamVjdFwiPk9iamVjdDwvYT48L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNmb3Jtc1wiPkZvcm0gZWxlbWVudHM8L2E+XHJcbiAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19faW5wdXRcIj5JbnB1dCBmaWVsZHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19fc2VsZWN0XCI+U2VsZWN0IG1lbnVzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX2NoZWNrYm94XCI+Q2hlY2tib3hlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19yYWRpb1wiPlJhZGlvIGJ1dHRvbnM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19fdGV4dGFyZWFzXCI+VGV4dGFyZWFzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX2h0bWw1XCI+SFRNTDUgaW5wdXRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX2FjdGlvblwiPkFjdGlvbiBidXR0b25zPC9hPjwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICAgIDwvbmF2PlxyXG4gICAgICA8bWFpbj5cclxuICAgICAgICA8c2VjdGlvbiBpZD1cInRleHRcIj5cclxuICAgICAgICAgIDxoZWFkZXI+PGgxPlRleHQ8L2gxPjwvaGVhZGVyPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19oZWFkaW5nc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPlxyXG4gICAgICAgICAgICAgIDxoMj5IZWFkaW5nczwvaDI+XHJcbiAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMT5IZWFkaW5nIDE8L2gxPlxyXG4gICAgICAgICAgICAgIDxoMj5IZWFkaW5nIDI8L2gyPlxyXG4gICAgICAgICAgICAgIDxoMz5IZWFkaW5nIDM8L2gzPlxyXG4gICAgICAgICAgICAgIDxoND5IZWFkaW5nIDQ8L2g0PlxyXG4gICAgICAgICAgICAgIDxoNT5IZWFkaW5nIDU8L2g1PlxyXG4gICAgICAgICAgICAgIDxoNj5IZWFkaW5nIDY8L2g2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fcGFyYWdyYXBoc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5QYXJhZ3JhcGhzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8cD5BIHBhcmFncmFwaCAoZnJvbSB0aGUgR3JlZWsgcGFyYWdyYXBob3MsIOKAnHRvIHdyaXRlIGJlc2lkZeKAnSBvciDigJx3cml0dGVuIGJlc2lkZeKAnSkgaXMgYSBzZWxmLWNvbnRhaW5lZCB1bml0IG9mIGEgZGlzY291cnNlIGluIHdyaXRpbmcgZGVhbGluZyB3aXRoIGEgcGFydGljdWxhciBwb2ludCBvciBpZGVhLiBBIHBhcmFncmFwaCBjb25zaXN0cyBvZiBvbmUgb3IgbW9yZSBzZW50ZW5jZXMuIFRob3VnaCBub3QgcmVxdWlyZWQgYnkgdGhlIHN5bnRheCBvZiBhbnkgbGFuZ3VhZ2UsIHBhcmFncmFwaHMgYXJlIHVzdWFsbHkgYW4gZXhwZWN0ZWQgcGFydCBvZiBmb3JtYWwgd3JpdGluZywgdXNlZCB0byBvcmdhbml6ZSBsb25nZXIgcHJvc2UuPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fYmxvY2txdW90ZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+QmxvY2txdW90ZXM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgPHA+QSBibG9jayBxdW90YXRpb24gKGFsc28ga25vd24gYXMgYSBsb25nIHF1b3RhdGlvbiBvciBleHRyYWN0KSBpcyBhIHF1b3RhdGlvbiBpbiBhIHdyaXR0ZW4gZG9jdW1lbnQsIHRoYXQgaXMgc2V0IG9mZiBmcm9tIHRoZSBtYWluIHRleHQgYXMgYSBwYXJhZ3JhcGgsIG9yIGJsb2NrIG9mIHRleHQuPC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+SXQgaXMgdHlwaWNhbGx5IGRpc3Rpbmd1aXNoZWQgdmlzdWFsbHkgdXNpbmcgaW5kZW50YXRpb24gYW5kIGEgZGlmZmVyZW50IHR5cGVmYWNlIG9yIHNtYWxsZXIgc2l6ZSBxdW90YXRpb24uIEl0IG1heSBvciBtYXkgbm90IGluY2x1ZGUgYSBjaXRhdGlvbiwgdXN1YWxseSBwbGFjZWQgYXQgdGhlIGJvdHRvbS48L3A+XHJcbiAgICAgICAgICAgICAgICA8Y2l0ZT48YSBocmVmPVwiIyFcIj5TYWlkIG5vIG9uZSwgZXZlci48L2E+PC9jaXRlPlxyXG4gICAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2xpc3RzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkxpc3RzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDM+RGVmaW5pdGlvbiBsaXN0PC9oMz5cclxuICAgICAgICAgICAgICA8ZGw+XHJcbiAgICAgICAgICAgICAgICA8ZHQ+RGVmaW5pdGlvbiBMaXN0IFRpdGxlPC9kdD5cclxuICAgICAgICAgICAgICAgIDxkZD5UaGlzIGlzIGEgZGVmaW5pdGlvbiBsaXN0IGRpdmlzaW9uLjwvZGQ+XHJcbiAgICAgICAgICAgICAgPC9kbD5cclxuICAgICAgICAgICAgICA8aDM+T3JkZXJlZCBMaXN0PC9oMz5cclxuICAgICAgICAgICAgICA8b2wgdHlwZT1cIjFcIj5cclxuICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgIDxvbCB0eXBlPVwiQVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgIDxvbCB0eXBlPVwiYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8b2wgdHlwZT1cIklcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvbCB0eXBlPVwiaVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8L29sPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICA8aDM+VW5vcmRlcmVkIExpc3Q8L2gzPlxyXG4gICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19ibG9ja3F1b3Rlc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMT5CbG9ja3F1b3RlczwvaDE+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGJsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgICAgICA8cD5BIGJsb2NrIHF1b3RhdGlvbiAoYWxzbyBrbm93biBhcyBhIGxvbmcgcXVvdGF0aW9uIG9yIGV4dHJhY3QpIGlzIGEgcXVvdGF0aW9uIGluIGEgd3JpdHRlbiBkb2N1bWVudCwgdGhhdCBpcyBzZXQgb2ZmIGZyb20gdGhlIG1haW4gdGV4dCBhcyBhIHBhcmFncmFwaCwgb3IgYmxvY2sgb2YgdGV4dC48L3A+XHJcbiAgICAgICAgICAgICAgICA8cD5JdCBpcyB0eXBpY2FsbHkgZGlzdGluZ3Vpc2hlZCB2aXN1YWxseSB1c2luZyBpbmRlbnRhdGlvbiBhbmQgYSBkaWZmZXJlbnQgdHlwZWZhY2Ugb3Igc21hbGxlciBzaXplIHF1b3RhdGlvbi4gSXQgbWF5IG9yIG1heSBub3QgaW5jbHVkZSBhIGNpdGF0aW9uLCB1c3VhbGx5IHBsYWNlZCBhdCB0aGUgYm90dG9tLjwvcD5cclxuICAgICAgICAgICAgICAgIDxjaXRlPjxhIGhyZWY9XCIjIVwiPlNhaWQgbm8gb25lLCBldmVyLjwvYT48L2NpdGU+XHJcbiAgICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMT5EZXRhaWxzIC8gU3VtbWFyeTwvaDE+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkZXRhaWxzPlxyXG4gICAgICAgICAgICAgIDxzdW1tYXJ5PkV4cGFuZCBmb3IgZGV0YWlsczwvc3VtbWFyeT5cclxuICAgICAgICAgICAgICA8cD5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBDdW0sIG9kaW8hIE9kaW8gbmF0dXMgdWxsYW0gYWQgcXVhZXJhdCwgZWFxdWUgbmVjZXNzaXRhdGlidXMsIGFsaXF1aWQgZGlzdGluY3RpbyBzaW1pbGlxdWUgdm9sdXB0YXRpYnVzIGRpY3RhIGNvbnNlcXV1bnR1ciBhbmltaS4gUXVhZXJhdCBmYWNpbGlzIHF1aWRlbSB1bmRlIGVvcyEgSXBzYS48L3A+XHJcbiAgICAgICAgICAgIDwvZGV0YWlscz5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fYWRkcmVzc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMT5BZGRyZXNzPC9oMT48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGFkZHJlc3M+XHJcbiAgICAgICAgICAgICAgV3JpdHRlbiBieSA8YSBocmVmPVwibWFpbHRvOndlYm1hc3RlckBleGFtcGxlLmNvbVwiPkpvbiBEb2U8L2E+Ljxicj5cclxuICAgICAgICAgICAgICBWaXNpdCB1cyBhdDo8YnI+XHJcbiAgICAgICAgICAgICAgRXhhbXBsZS5jb208YnI+XHJcbiAgICAgICAgICAgICAgQm94IDU2NCwgRGlzbmV5bGFuZDxicj5cclxuICAgICAgICAgICAgICBVU0FcclxuICAgICAgICAgICAgPC9hZGRyZXNzPlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19oclwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5Ib3Jpem9udGFsIHJ1bGVzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aHI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X190YWJsZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+VGFidWxhciBkYXRhPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPHRhYmxlPlxyXG4gICAgICAgICAgICAgIDxjYXB0aW9uPlRhYmxlIENhcHRpb248L2NhcHRpb24+XHJcbiAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgSGVhZGluZyAxPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgMjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBIZWFkaW5nIDM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgSGVhZGluZyA0PC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgNTwvdGg+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgPHRmb290PlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDE8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDI8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDQ8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDU8L3RoPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICA8L3Rmb290PlxyXG4gICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAzPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDU8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAzPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDU8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAzPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDU8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAzPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDU8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19jb2RlXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkNvZGU8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+S2V5Ym9hcmQgaW5wdXQ6PC9zdHJvbmc+IDxrYmQ+Q21kPC9rYmQ+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+SW5saW5lIGNvZGU6PC9zdHJvbmc+IDxjb2RlPiZsdDtkaXYmZ3Q7Y29kZSZsdDsvZGl2Jmd0OzwvY29kZT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5TYW1wbGUgb3V0cHV0Ojwvc3Ryb25nPiA8c2FtcD5UaGlzIGlzIHNhbXBsZSBvdXRwdXQgZnJvbSBhIGNvbXB1dGVyIHByb2dyYW0uPC9zYW1wPjwvcD5cclxuICAgICAgICAgICAgICA8aDI+UHJlLWZvcm1hdHRlZCB0ZXh0PC9oMj5cclxuICAgICAgICAgICAgICA8cHJlPlAgUiBFIEYgTyBSIE0gQSBUIFQgRSBEIFQgRSBYIFRcclxuICAhIFwiICMgJCAlICZhbXA7ICcgKCApICogKyAsIC0gLiAvXHJcbiAgMCAxIDIgMyA0IDUgNiA3IDggOSA6IDsgJmx0OyA9ICZndDsgP1xyXG4gIEAgQSBCIEMgRCBFIEYgRyBIIEkgSiBLIEwgTSBOIE9cclxuICBQIFEgUiBTIFQgVSBWIFcgWCBZIFogWyBcXFxcIF0gXiBfXHJcbiAgXFxgIGEgYiBjIGQgZSBmIGcgaCBpIGogayBsIG0gbiBvXHJcbiAgcCBxIHIgcyB0IHUgdiB3IHggeSB6IHsgfCB9IH4gPC9wcmU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19pbmxpbmVcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SW5saW5lIGVsZW1lbnRzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8cD48YSBocmVmPVwiIyFcIj5UaGlzIGlzIGEgdGV4dCBsaW5rPC9hPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5TdHJvbmcgaXMgdXNlZCB0byBpbmRpY2F0ZSBzdHJvbmcgaW1wb3J0YW5jZS48L3N0cm9uZz48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PGVtPlRoaXMgdGV4dCBoYXMgYWRkZWQgZW1waGFzaXMuPC9lbT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDxiPmIgZWxlbWVudDwvYj4gaXMgc3R5bGlzdGljYWxseSBkaWZmZXJlbnQgdGV4dCBmcm9tIG5vcm1hbCB0ZXh0LCB3aXRob3V0IGFueSBzcGVjaWFsIGltcG9ydGFuY2UuPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8aT5pIGVsZW1lbnQ8L2k+IGlzIHRleHQgdGhhdCBpcyBvZmZzZXQgZnJvbSB0aGUgbm9ybWFsIHRleHQuPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8dT51IGVsZW1lbnQ8L3U+IGlzIHRleHQgd2l0aCBhbiB1bmFydGljdWxhdGVkLCB0aG91Z2ggZXhwbGljaXRseSByZW5kZXJlZCwgbm9uLXRleHR1YWwgYW5ub3RhdGlvbi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PGRlbD5UaGlzIHRleHQgaXMgZGVsZXRlZDwvZGVsPiBhbmQgPGlucz5UaGlzIHRleHQgaXMgaW5zZXJ0ZWQ8L2lucz4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzPlRoaXMgdGV4dCBoYXMgYSBzdHJpa2V0aHJvdWdoPC9zPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+U3VwZXJzY3JpcHQ8c3VwPsKuPC9zdXA+LjwvcD5cclxuICAgICAgICAgICAgICA8cD5TdWJzY3JpcHQgZm9yIHRoaW5ncyBsaWtlIEg8c3ViPjI8L3N1Yj5PLjwvcD5cclxuICAgICAgICAgICAgICA8cD48c21hbGw+VGhpcyBzbWFsbCB0ZXh0IGlzIHNtYWxsIGZvciBmaW5lIHByaW50LCBldGMuPC9zbWFsbD48L3A+XHJcbiAgICAgICAgICAgICAgPHA+QWJicmV2aWF0aW9uOiA8YWJiciB0aXRsZT1cIkh5cGVyVGV4dCBNYXJrdXAgTGFuZ3VhZ2VcIj5IVE1MPC9hYmJyPjwvcD5cclxuICAgICAgICAgICAgICA8cD48cSBjaXRlPVwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9IVE1ML0VsZW1lbnQvcVwiPlRoaXMgdGV4dCBpcyBhIHNob3J0IGlubGluZSBxdW90YXRpb24uPC9xPjwvcD5cclxuICAgICAgICAgICAgICA8cD48Y2l0ZT5UaGlzIGlzIGEgY2l0YXRpb24uPC9jaXRlPjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPGRmbj5kZm4gZWxlbWVudDwvZGZuPiBpbmRpY2F0ZXMgYSBkZWZpbml0aW9uLjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPG1hcms+bWFyayBlbGVtZW50PC9tYXJrPiBpbmRpY2F0ZXMgYSBoaWdobGlnaHQuPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8dmFyPnZhcmlhYmxlIGVsZW1lbnQ8L3Zhcj4sIHN1Y2ggYXMgPHZhcj54PC92YXI+ID0gPHZhcj55PC92YXI+LjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgdGltZSBlbGVtZW50OiA8dGltZSBkYXRldGltZT1cIjIwMTMtMDQtMDZUMTI6MzIrMDA6MDBcIj4yIHdlZWtzIGFnbzwvdGltZT48L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19jb21tZW50c1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5IVE1MIENvbW1lbnRzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8cD5UaGVyZSBpcyBjb21tZW50IGhlcmU6IDwhLS1UaGlzIGNvbW1lbnQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQtLT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlcmUgaXMgYSBjb21tZW50IHNwYW5uaW5nIG11bHRpcGxlIHRhZ3MgYW5kIGxpbmVzIGJlbG93IGhlcmUuPC9wPlxyXG4gICAgICAgICAgICAgIDwhLS08cD48YSBocmVmPVwiIyFcIj5UaGlzIGlzIGEgdGV4dCBsaW5rLiBCdXQgaXQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQgaW4gYSBjb21tZW50PC9hPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5TdHJvbmcgaXMgdXNlZCB0byBpbmRpY2F0ZSBzdHJvbmcgaW1wb3J0YW5jZS4gQnV0LCBpdCBzaG91bGQgbm90IGJlIGRpc3BsYXllZCBpbiBhIGNvbW1lbnQ8L3N0cm9uZz48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PGVtPlRoaXMgdGV4dCBoYXMgYWRkZWQgZW1waGFzaXMuIEJ1dCwgaXQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQgaW4gYSBjb21tZW50PC9lbT48L3A+LS0+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8c2VjdGlvbiBpZD1cImVtYmVkZGVkXCI+XHJcbiAgICAgICAgICA8aGVhZGVyPjxoMj5FbWJlZGRlZCBjb250ZW50PC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2ltYWdlc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5JbWFnZXM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMz5QbGFpbiA8Y29kZT4mbHQ7aW1nJmd0OzwvY29kZT4gZWxlbWVudDwvaDM+XHJcbiAgICAgICAgICAgICAgPHA+PGltZyBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80ODAvNDgwXCIgYWx0PVwiUGhvdG8gb2YgYSBraXR0ZW5cIj48L3A+XHJcbiAgICAgICAgICAgICAgPGgzPjxjb2RlPiZsdDtmaWd1cmUmZ3Q7PC9jb2RlPiBlbGVtZW50IHdpdGggPGNvZGU+Jmx0O2ltZyZndDs8L2NvZGU+IGVsZW1lbnQ8L2gzPlxyXG4gICAgICAgICAgICAgIDxmaWd1cmU+PGltZyBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80MjAvNDIwXCIgYWx0PVwiUGhvdG8gb2YgYSBraXR0ZW5cIj48L2ZpZ3VyZT5cclxuICAgICAgICAgICAgICA8aDM+PGNvZGU+Jmx0O2ZpZ3VyZSZndDs8L2NvZGU+IGVsZW1lbnQgd2l0aCA8Y29kZT4mbHQ7aW1nJmd0OzwvY29kZT4gYW5kIDxjb2RlPiZsdDtmaWdjYXB0aW9uJmd0OzwvY29kZT4gZWxlbWVudHM8L2gzPlxyXG4gICAgICAgICAgICAgIDxmaWd1cmU+XHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzQyMC80MjBcIiBhbHQ9XCJQaG90byBvZiBhIGtpdHRlblwiPlxyXG4gICAgICAgICAgICAgICAgPGZpZ2NhcHRpb24+SGVyZSBpcyBhIGNhcHRpb24gZm9yIHRoaXMgaW1hZ2UuPC9maWdjYXB0aW9uPlxyXG4gICAgICAgICAgICAgIDwvZmlndXJlPlxyXG4gICAgICAgICAgICAgIDxoMz48Y29kZT4mbHQ7ZmlndXJlJmd0OzwvY29kZT4gZWxlbWVudCB3aXRoIGEgPGNvZGU+Jmx0O3BpY3R1cmUmZ3Q7PC9jb2RlPiBlbGVtZW50PC9oMz5cclxuICAgICAgICAgICAgICA8ZmlndXJlPlxyXG4gICAgICAgICAgICAgICAgPHBpY3R1cmU+XHJcbiAgICAgICAgICAgICAgICAgIDxzb3VyY2Ugc3Jjc2V0PVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vODAwLzgwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWVkaWE9XCIobWluLXdpZHRoOiA4MDBweClcIj5cclxuICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80MjAvNDIwXCIgYWx0PVwiUGhvdG8gb2YgYSBraXR0ZW5cIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9waWN0dXJlPlxyXG4gICAgICAgICAgICAgIDwvZmlndXJlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2JnaW1hZ2VzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkJhY2tncm91bmQgaW1hZ2VzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6dXJsKCdodHRwczovL3BsYWNla2l0dGVuLmNvbS8zMDAvMzAwJyk7IHdpZHRoOjMwMHB4OyBoZWlnaHQ6IDMwMHB4O1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fYXVkaW9cIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+QXVkaW88L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxhdWRpbyBjb250cm9scz1cIlwiPmF1ZGlvPC9hdWRpbz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX3ZpZGVvXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPlZpZGVvPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48dmlkZW8gY29udHJvbHM9XCJcIj52aWRlbzwvdmlkZW8+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19jYW52YXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+Q2FudmFzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48Y2FudmFzPmNhbnZhczwvY2FudmFzPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fbWV0ZXJcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+TWV0ZXI8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxtZXRlciB2YWx1ZT1cIjJcIiBtaW49XCIwXCIgbWF4PVwiMTBcIj4yIG91dCBvZiAxMDwvbWV0ZXI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19wcm9ncmVzc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5Qcm9ncmVzczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PHByb2dyZXNzPnByb2dyZXNzPC9wcm9ncmVzcz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX3N2Z1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5JbmxpbmUgU1ZHPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48c3ZnIHdpZHRoPVwiMTAwcHhcIiBoZWlnaHQ9XCIxMDBweFwiPjxjaXJjbGUgY3g9XCIxMDBcIiBjeT1cIjEwMFwiIHI9XCIxMDBcIiBmaWxsPVwiIzFmYTNlY1wiPjwvY2lyY2xlPjwvc3ZnPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9faWZyYW1lXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPklGcmFtZTwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PGlmcmFtZSBzcmM9XCJpbmRleC5odG1sXCIgaGVpZ2h0PVwiMzAwXCI+PC9pZnJhbWU+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19lbWJlZFwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5FbWJlZDwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PGVtYmVkIHNyYz1cImluZGV4Lmh0bWxcIiBoZWlnaHQ9XCIzMDBcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX29iamVjdFwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5PYmplY3Q8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxvYmplY3QgZGF0YT1cImluZGV4Lmh0bWxcIiBoZWlnaHQ9XCIzMDBcIj48L29iamVjdD48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJmb3Jtc1wiPlxyXG4gICAgICAgICAgPGhlYWRlcj48aDI+Rm9ybSBlbGVtZW50czwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICA8Zm9ybT5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX2lucHV0XCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5JbnB1dCBmaWVsZHM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fdGV4dFwiPlRleHQgSW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3RleHRcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGV4dCBJbnB1dFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fcGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIlR5cGUgeW91ciBQYXNzd29yZFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fd2ViYWRkcmVzc1wiPldlYiBBZGRyZXNzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X193ZWJhZGRyZXNzXCIgdHlwZT1cInVybFwiIHBsYWNlaG9sZGVyPVwiaHR0cHM6Ly95b3Vyc2l0ZS5jb21cIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX2VtYWlsYWRkcmVzc1wiPkVtYWlsIEFkZHJlc3M8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX2VtYWlsYWRkcmVzc1wiIHR5cGU9XCJlbWFpbFwiIHBsYWNlaG9sZGVyPVwibmFtZUBlbWFpbC5jb21cIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3Bob25lXCI+UGhvbmUgTnVtYmVyPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19waG9uZVwiIHR5cGU9XCJ0ZWxcIiBwbGFjZWhvbGRlcj1cIig5OTkpIDk5OS05OTk5XCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X19zZWFyY2hcIj5TZWFyY2g8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3NlYXJjaFwiIHR5cGU9XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIkVudGVyIFNlYXJjaCBUZXJtXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X190ZXh0MlwiPk51bWJlciBJbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fdGV4dDJcIiB0eXBlPVwibnVtYmVyXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBhIE51bWJlclwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fZmlsZVwiPkZpbGUgSW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX2ZpbGVcIiB0eXBlPVwiZmlsZVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19zZWxlY3RcIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPlNlbGVjdCBtZW51czwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNlbGVjdFwiPlNlbGVjdDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwic2VsZWN0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIk9wdGlvbiBHcm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIE9uZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIFR3bzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIFRocmVlPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VsZWN0X211bHRpcGxlXCI+U2VsZWN0IChtdWx0aXBsZSk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNlbGVjdF9tdWx0aXBsZVwiIG11bHRpcGxlPVwibXVsdGlwbGVcIj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiT3B0aW9uIEdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gT25lPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gVHdvPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gVGhyZWU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgPC9vcHRncm91cD5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19jaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+Q2hlY2tib3hlczwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwiY2hlY2tib3gxXCI+PGlucHV0IGlkPVwiY2hlY2tib3gxXCIgbmFtZT1cImNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD1cImNoZWNrZWRcIj4gQ2hvaWNlIEE8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cImNoZWNrYm94MlwiPjxpbnB1dCBpZD1cImNoZWNrYm94MlwiIG5hbWU9XCJjaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiPiBDaG9pY2UgQjwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwiY2hlY2tib3gzXCI+PGlucHV0IGlkPVwiY2hlY2tib3gzXCIgbmFtZT1cImNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCI+IENob2ljZSBDPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fcmFkaW9cIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPlJhZGlvIGJ1dHRvbnM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cInJhZGlvMVwiPjxpbnB1dCBpZD1cInJhZGlvMVwiIG5hbWU9XCJyYWRpb1wiIHR5cGU9XCJyYWRpb1wiIGNoZWNrZWQ9XCJjaGVja2VkXCI+IE9wdGlvbiAxPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJyYWRpbzJcIj48aW5wdXQgaWQ9XCJyYWRpbzJcIiBuYW1lPVwicmFkaW9cIiB0eXBlPVwicmFkaW9cIj4gT3B0aW9uIDI8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cInJhZGlvM1wiPjxpbnB1dCBpZD1cInJhZGlvM1wiIG5hbWU9XCJyYWRpb1wiIHR5cGU9XCJyYWRpb1wiPiBPcHRpb24gMzwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX3RleHRhcmVhc1wiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+VGV4dGFyZWFzPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidGV4dGFyZWFcIj5UZXh0YXJlYTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJ0ZXh0YXJlYVwiIHJvd3M9XCI4XCIgY29scz1cIjQ4XCIgcGxhY2Vob2xkZXI9XCJFbnRlciB5b3VyIG1lc3NhZ2UgaGVyZVwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX2h0bWw1XCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5IVE1MNSBpbnB1dHM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpY1wiPkNvbG9yIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY29sb3JcIiBpZD1cImljXCIgdmFsdWU9XCIjMDAwMDAwXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImluXCI+TnVtYmVyIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJpblwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHZhbHVlPVwiNVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpclwiPlJhbmdlIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBpZD1cImlyXCIgdmFsdWU9XCIxMFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZGRcIj5EYXRlIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIGlkPVwiaWRkXCIgdmFsdWU9XCIxOTcwLTAxLTAxXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkbVwiPk1vbnRoIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibW9udGhcIiBpZD1cImlkbVwiIHZhbHVlPVwiMTk3MC0wMVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZHdcIj5XZWVrIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwid2Vla1wiIGlkPVwiaWR3XCIgdmFsdWU9XCIxOTcwLVcwMVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZHRcIj5EYXRldGltZSBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGV0aW1lXCIgaWQ9XCJpZHRcIiB2YWx1ZT1cIjE5NzAtMDEtMDFUMDA6MDA6MDBaXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkdGxcIj5EYXRldGltZS1sb2NhbCBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgaWQ9XCJpZHRsXCIgdmFsdWU9XCIxOTcwLTAxLTAxVDAwOjAwXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkbFwiPkRhdGFsaXN0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaWRsXCIgbGlzdD1cImV4YW1wbGUtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRhdGFsaXN0IGlkPVwiZXhhbXBsZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFeGFtcGxlICMxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkV4YW1wbGUgIzJcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRXhhbXBsZSAjM1wiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2RhdGFsaXN0PlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19hY3Rpb25cIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPkFjdGlvbiBidXR0b25zPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiPGlucHV0IHR5cGU9c3VibWl0PlwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxpbnB1dCB0eXBlPWJ1dHRvbj5cIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmVzZXRcIiB2YWx1ZT1cIjxpbnB1dCB0eXBlPXJlc2V0PlwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIjxpbnB1dCBkaXNhYmxlZD5cIiBkaXNhYmxlZD5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj4mbHQ7YnV0dG9uIHR5cGU9c3VibWl0Jmd0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCI+Jmx0O2J1dHRvbiB0eXBlPWJ1dHRvbiZndDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInJlc2V0XCI+Jmx0O2J1dHRvbiB0eXBlPXJlc2V0Jmd0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ+Jmx0O2J1dHRvbiBkaXNhYmxlZCZndDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgPC9tYWluPlxyXG4gICAgICA8Zm9vdGVyPlxyXG4gICAgICAgIDxwPk1hZGUgYnkgPGEgaHJlZj1cImh0dHA6Ly90d2l0dGVyLmNvbS9jYnJhY2NvXCI+QGNicmFjY288L2E+LiBDb2RlIG9uIDxhIGhyZWY9XCJodHRwOi8vZ2l0aHViLmNvbS9jYnJhY2NvL2h0bWw1LXRlc3QtcGFnZVwiPkdpdEh1YjwvYT4uPC9wPlxyXG4gICAgICA8L2Zvb3Rlcj5cclxuICAgIDwvZGl2PlxyXG4gIDwvYm9keT5cclxuPC9odG1sPlxyXG5gO1xyXG4iLCJleHBvcnQgY2xhc3MgS2FzcGVyRXJyb3Ige1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgdGhpcy5jb2wgPSBjb2w7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IERlbW9Tb3VyY2UgfSBmcm9tIFwiLi9kZW1vXCI7XHJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL3BhcnNlclwiO1xyXG5cclxuY29uc3Qga2FzcGVyID0ge1xyXG4gIGV4ZWN1dGU6IChzb3VyY2U6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xyXG4gICAgY29uc29sZS5sb2cobm9kZXMpO1xyXG4gICAgY29uc29sZS5sb2cocGFyc2VyLmVycm9ycyk7XHJcbiAgICBpZiAocGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBhcnNlci5lcnJvcnMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcclxuICB9LFxyXG59O1xyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAod2luZG93IGFzIGFueSkuZGVtb1NvdXJjZUNvZGUgPSBEZW1vU291cmNlO1xyXG4gICh3aW5kb3cgYXMgYW55KS5rYXNwZXIgPSBrYXNwZXI7XHJcbn0gZWxzZSB7XHJcbiAgZXhwb3J0cy5rYXNwZXIgPSBrYXNwZXI7XHJcbn1cclxuIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5vZGUge1xuICAgIHB1YmxpYyBsaW5lOiBudW1iZXI7XG4gICAgcHVibGljIHR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb2RlVmlzaXRvcjxSPiB7XG4gICAgdmlzaXRFbGVtZW50Tm9kZShub2RlOiBFbGVtZW50KTogUjtcbiAgICB2aXNpdEF0dHJpYnV0ZU5vZGUobm9kZTogQXR0cmlidXRlKTogUjtcbiAgICB2aXNpdFRleHROb2RlKG5vZGU6IFRleHQpOiBSO1xuICAgIHZpc2l0Q29tbWVudE5vZGUobm9kZTogQ29tbWVudCk6IFI7XG4gICAgdmlzaXREb2N0eXBlTm9kZShub2RlOiBEb2N0eXBlKTogUjtcbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBOb2RlW107XG4gICAgcHVibGljIGNoaWxkcmVuOiBOb2RlW107XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGF0dHJpYnV0ZXM6IE5vZGVbXSwgY2hpbGRyZW46IE5vZGVbXSwgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZWxlbWVudCc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RWxlbWVudE5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5FbGVtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdhdHRyaWJ1dGUnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEF0dHJpYnV0ZU5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5BdHRyaWJ1dGUnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ3RleHQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHROb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuVGV4dCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29tbWVudCBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnY29tbWVudCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudE5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5Db21tZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdkb2N0eXBlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXREb2N0eXBlTm9kZSh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdOb2RlLkRvY3R5cGUnO1xuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgS2FzcGVyRXJyb3IgfSBmcm9tIFwiLi9lcnJvclwiO1xyXG5pbXBvcnQgKiBhcyBOb2RlIGZyb20gXCIuL25vZGVzXCI7XHJcbmltcG9ydCB7IGlzQWxwaGFOdW1lcmljLCBTZWxmQ2xvc2luZ1RhZ3MsIFdoaXRlU3BhY2VzIH0gZnJvbSBcIi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xyXG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xyXG4gIHB1YmxpYyBub2RlczogTm9kZS5Ob2RlW107XHJcblxyXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuTm9kZVtdIHtcclxuICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB0aGlzLmxpbmUgPSAxO1xyXG4gICAgdGhpcy5jb2wgPSAxO1xyXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgdGhpcy5ub2RlcyA9IFtdO1xyXG5cclxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcclxuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgS2FzcGVyRXJyb3IpIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYFBhcnNlIEVycm9yICgke2UubGluZX06JHtlLmNvbH0pID0+ICR7ZS52YWx1ZX1gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xyXG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJQYXJzZSBFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3luY2hyb25pemUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xyXG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XHJcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkdmFuY2UoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcclxuICAgICAgICB0aGlzLmxpbmUgKz0gMTtcclxuICAgICAgICB0aGlzLmNvbCA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb2wgKz0gMTtcclxuICAgICAgdGhpcy5jdXJyZW50Kys7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZSh0aGlzLmN1cnJlbnQsIHRoaXMuY3VycmVudCArIGNoYXIubGVuZ3RoKSA9PT0gY2hhcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogYW55IHtcclxuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3luY2hyb25pemUoKTogdm9pZCB7XHJcbiAgICBkbyB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfSB3aGlsZSAoIXRoaXMuZW9mKCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub2RlKCk6IE5vZGUuTm9kZSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb21tZW50KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbW1lbnQoKTogTm9kZS5Ob2RlIHtcclxuICAgIGlmICh0aGlzLm1hdGNoKFwiPCEtLVwiKSkge1xyXG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgLS0+YCkpO1xyXG4gICAgICBjb25zdCBjb21tZW50ID0gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDMpO1xyXG4gICAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuZG9jdHlwZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuTm9kZSB7XHJcbiAgICBpZiAodGhpcy5tYXRjaChcIjwhZG9jdHlwZVwiKSkge1xyXG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcclxuICAgICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKTtcclxuICAgICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLk5vZGUge1xyXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8L1wiKSkge1xyXG4gICAgICBkZWJ1Z2dlcjtcclxuICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgY2xvc2luZyB0YWdcIik7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8XCIpKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiL1wiLCBcIj5cIik7XHJcbiAgICBpZiAoIW5hbWUpIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCB0YWcgbmFtZVwiKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMoKTtcclxuICAgIGlmIChcclxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XHJcbiAgICAgIChTZWxmQ2xvc2luZ1RhZ3MuaW5jbHVkZXMobmFtZSkgJiYgdGhpcy5tYXRjaChcIj5cIikpXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRoaXMubGluZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcclxuICAgIH1cclxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5Ob2RlW10gPSBbXTtcclxuICAgIGlmICh0aGlzLm1hdGNoKGA8L2ApKSB7XHJcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcclxuICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuLCB0aGlzLmxpbmUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XHJcbiAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcclxuICAgICAgZGVidWdnZXI7XHJcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLk5vZGVbXSB7XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIGNvbnN0IGNoaWxkcmVuOiBOb2RlLk5vZGVbXSA9IFtdO1xyXG4gICAgZG8ge1xyXG4gICAgICBpZiAodGhpcy5lb2YoKSkge1xyXG4gICAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtwYXJlbnR9PmApO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcclxuICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYDwvYCkpO1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRleHQoKTogTm9kZS5Ob2RlIHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI8XCIpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcclxuICAgIGlmICghdGV4dCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRleHQsIHRoaXMubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICB3aGlsZSAodGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzKSAmJiAhdGhpcy5lb2YoKSkge1xyXG4gICAgICBjb3VudCArPSAxO1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb3VudDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZW5kID0gdGhpcy5jdXJyZW50O1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdHJpbmcoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XHJcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goLi4uY2xvc2luZykgJiYgIXRoaXMuZW9mKCkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhdHRyaWJ1dGVzKCk6IE5vZGUuQXR0cmlidXRlW10ge1xyXG4gICAgY29uc3QgYXR0cmlidXRlczogTm9kZS5BdHRyaWJ1dGVbXSA9IFtdO1xyXG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI+XCIsIFwiLz5cIikgJiYgIXRoaXMuZW9mKCkpIHtcclxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmlkZW50aWZpZXIoXCI9XCIsIFwiPlwiLCBcIi8+XCIpO1xyXG4gICAgICBpZiAoIW5hbWUpIHtcclxuICAgICAgICBkZWJ1Z2dlcjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgICAgbGV0IHZhbHVlID0gXCJcIjtcclxuICAgICAgaWYgKHRoaXMubWF0Y2goXCI9XCIpKSB7XHJcbiAgICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goXCInXCIpKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuc3RyaW5nKFwiJ1wiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2goJ1wiJykpIHtcclxuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoJ1wiJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhbHVlID0gdGhpcy5pZGVudGlmaWVyKFwiPlwiLCBcIi8+XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBOb2RlLkF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgdGhpcy5saW5lKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXR0cmlidXRlcztcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYU51bWVyaWMoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXaGl0ZVNwYWNlcyA9IFtcIiBcIiwgXCJcXG5cIiwgXCJcXHRcIiwgXCJcXHJcIl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xyXG4gIFwiYXJlYVwiLFxyXG4gIFwiYmFzZVwiLFxyXG4gIFwiYnJcIixcclxuICBcImNvbFwiLFxyXG4gIFwiZW1iZWRcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImlucHV0XCIsXHJcbiAgXCJsaW5rXCIsXHJcbiAgXCJtZXRhXCIsXHJcbiAgXCJwYXJhbVwiLFxyXG4gIFwic291cmNlXCIsXHJcbiAgXCJ0cmFja1wiLFxyXG4gIFwid2JyXCIsXHJcbl07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=