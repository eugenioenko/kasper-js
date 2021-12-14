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
const DemoSource = `<!DOCTYPE html>\n
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
            this.advance();
        } while (!this.match(`-->`));
        const comment = this.source.slice(start, this.current - 3);
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Comment"](comment, this.line);
    }
    doctype() {
        const start = this.current;
        do {
            this.advance();
        } while (!this.match(`>`));
        const doctype = this.source.slice(start, this.current - 1).trim();
        return new _nodes__WEBPACK_IMPORTED_MODULE_1__["Doctype"](doctype, this.line);
    }
    element() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vycm9yLnRzIiwid2VicGFjazovLy8uL3NyYy9rYXNwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25vZGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQU8sTUFBTSxXQUFXLEdBQUc7Ozs7Ozs7Q0FPMUIsQ0FBQztBQUNLLE1BQU0sVUFBVSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNyRSxDQUFDO0FBRU0sTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQVUsQ0FBQztBQUVyRCxNQUFNLGVBQWUsR0FBRztJQUM3QixNQUFNO0lBQ04sTUFBTTtJQUNOLElBQUk7SUFDSixLQUFLO0lBQ0wsT0FBTztJQUNQLElBQUk7SUFDSixLQUFLO0lBQ0wsT0FBTztJQUNQLE1BQU07SUFDTixNQUFNO0lBQ04sT0FBTztJQUNQLFFBQVE7SUFDUixPQUFPO0lBQ1AsS0FBSztDQUNOLENBQUMiLCJmaWxlIjoia2FzcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMva2FzcGVyLnRzXCIpO1xuIiwiZXhwb3J0IGNvbnN0IERlbW9Tb3VyY2UxID0gYFxyXG48Ym9keSAgICA+XHJcbjxkaXYgICAgICAgICBjbGFzcz1cImJsb2NrIHctZnVsbCBmbGV4XCIgaWQ9XCJibG9ja1wiPjwvZGl2PlxyXG48aW1nICAgICAgIHNyYz1cImh0dHA6Ly91cmwuaW1hZ2UuY29tXCIgYm9yZGVyICA9ICAwIC8+XHJcbjxkaXYgY2xhc3M9J2ItbmFuYSc+PC9kaXY+XHJcbjxpbnB1dCB0eXBlPWNoZWNrYm94IHZhbHVlID0gICAgc29tZXRoaW5nIC8+XHJcbjwvYm9keT5cclxuYDtcclxuZXhwb3J0IGNvbnN0IERlbW9Tb3VyY2UgPSBgPCFET0NUWVBFIGh0bWw+XFxuXHJcbjxodG1sIGxhbmc9XCJlblwiPlxyXG4gIDxoZWFkPlxyXG4gICAgPG1ldGEgY2hhcnNldD1cInV0Zi04XCI+XHJcbiAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiPlxyXG4gICAgPHRpdGxlPkhUTUw1IFRlc3QgUGFnZTwvdGl0bGU+XHJcbiAgPC9oZWFkPlxyXG4gIDxib2R5PlxyXG4gICAgPGRpdiBpZD1cInRvcFwiIHJvbGU9XCJkb2N1bWVudFwiPlxyXG4gICAgICA8aGVhZGVyPlxyXG4gICAgICAgIDxoMT5IVE1MNSBUZXN0IFBhZ2U8L2gxPlxyXG4gICAgICAgIDxwPlRoaXMgaXMgYSB0ZXN0IHBhZ2UgZmlsbGVkIHdpdGggY29tbW9uIEhUTUwgZWxlbWVudHMgdG8gYmUgdXNlZCB0byBwcm92aWRlIHZpc3VhbCBmZWVkYmFjayB3aGlsc3QgYnVpbGRpbmcgQ1NTIHN5c3RlbXMgYW5kIGZyYW1ld29ya3MuPC9wPlxyXG4gICAgICA8L2hlYWRlcj5cclxuICAgICAgPG5hdj5cclxuICAgICAgICA8dWw+XHJcbiAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjdGV4dFwiPlRleHQ8L2E+XHJcbiAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19oZWFkaW5nc1wiPkhlYWRpbmdzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fcGFyYWdyYXBoc1wiPlBhcmFncmFwaHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19saXN0c1wiPkxpc3RzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fYmxvY2txdW90ZXNcIj5CbG9ja3F1b3RlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2RldGFpbHNcIj5EZXRhaWxzIC8gU3VtbWFyeTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2FkZHJlc3NcIj5BZGRyZXNzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9faHJcIj5Ib3Jpem9udGFsIHJ1bGVzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fdGFibGVzXCI+VGFidWxhciBkYXRhPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fY29kZVwiPkNvZGU8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19pbmxpbmVcIj5JbmxpbmUgZWxlbWVudHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19jb21tZW50c1wiPkhUTUwgQ29tbWVudHM8L2E+PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjZW1iZWRkZWRcIj5FbWJlZGRlZCBjb250ZW50PC9hPlxyXG4gICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2ltYWdlc1wiPkltYWdlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19iZ2ltYWdlc1wiPkJhY2tncm91bmQgaW1hZ2VzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2F1ZGlvXCI+QXVkaW88L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fdmlkZW9cIj5WaWRlbzwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19jYW52YXNcIj5DYW52YXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fbWV0ZXJcIj5NZXRlcjwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19wcm9ncmVzc1wiPlByb2dyZXNzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX3N2Z1wiPklubGluZSBTVkc8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9faWZyYW1lXCI+SUZyYW1lczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19lbWJlZFwiPkVtYmVkPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX29iamVjdFwiPk9iamVjdDwvYT48L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNmb3Jtc1wiPkZvcm0gZWxlbWVudHM8L2E+XHJcbiAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19faW5wdXRcIj5JbnB1dCBmaWVsZHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19fc2VsZWN0XCI+U2VsZWN0IG1lbnVzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX2NoZWNrYm94XCI+Q2hlY2tib3hlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19yYWRpb1wiPlJhZGlvIGJ1dHRvbnM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19fdGV4dGFyZWFzXCI+VGV4dGFyZWFzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX2h0bWw1XCI+SFRNTDUgaW5wdXRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX2FjdGlvblwiPkFjdGlvbiBidXR0b25zPC9hPjwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICAgIDwvbmF2PlxyXG4gICAgICA8bWFpbj5cclxuICAgICAgICA8c2VjdGlvbiBpZD1cInRleHRcIj5cclxuICAgICAgICAgIDxoZWFkZXI+PGgxPlRleHQ8L2gxPjwvaGVhZGVyPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19oZWFkaW5nc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPlxyXG4gICAgICAgICAgICAgIDxoMj5IZWFkaW5nczwvaDI+XHJcbiAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMT5IZWFkaW5nIDE8L2gxPlxyXG4gICAgICAgICAgICAgIDxoMj5IZWFkaW5nIDI8L2gyPlxyXG4gICAgICAgICAgICAgIDxoMz5IZWFkaW5nIDM8L2gzPlxyXG4gICAgICAgICAgICAgIDxoND5IZWFkaW5nIDQ8L2g0PlxyXG4gICAgICAgICAgICAgIDxoNT5IZWFkaW5nIDU8L2g1PlxyXG4gICAgICAgICAgICAgIDxoNj5IZWFkaW5nIDY8L2g2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fcGFyYWdyYXBoc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5QYXJhZ3JhcGhzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8cD5BIHBhcmFncmFwaCAoZnJvbSB0aGUgR3JlZWsgcGFyYWdyYXBob3MsIOKAnHRvIHdyaXRlIGJlc2lkZeKAnSBvciDigJx3cml0dGVuIGJlc2lkZeKAnSkgaXMgYSBzZWxmLWNvbnRhaW5lZCB1bml0IG9mIGEgZGlzY291cnNlIGluIHdyaXRpbmcgZGVhbGluZyB3aXRoIGEgcGFydGljdWxhciBwb2ludCBvciBpZGVhLiBBIHBhcmFncmFwaCBjb25zaXN0cyBvZiBvbmUgb3IgbW9yZSBzZW50ZW5jZXMuIFRob3VnaCBub3QgcmVxdWlyZWQgYnkgdGhlIHN5bnRheCBvZiBhbnkgbGFuZ3VhZ2UsIHBhcmFncmFwaHMgYXJlIHVzdWFsbHkgYW4gZXhwZWN0ZWQgcGFydCBvZiBmb3JtYWwgd3JpdGluZywgdXNlZCB0byBvcmdhbml6ZSBsb25nZXIgcHJvc2UuPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fYmxvY2txdW90ZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+QmxvY2txdW90ZXM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgPHA+QSBibG9jayBxdW90YXRpb24gKGFsc28ga25vd24gYXMgYSBsb25nIHF1b3RhdGlvbiBvciBleHRyYWN0KSBpcyBhIHF1b3RhdGlvbiBpbiBhIHdyaXR0ZW4gZG9jdW1lbnQsIHRoYXQgaXMgc2V0IG9mZiBmcm9tIHRoZSBtYWluIHRleHQgYXMgYSBwYXJhZ3JhcGgsIG9yIGJsb2NrIG9mIHRleHQuPC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+SXQgaXMgdHlwaWNhbGx5IGRpc3Rpbmd1aXNoZWQgdmlzdWFsbHkgdXNpbmcgaW5kZW50YXRpb24gYW5kIGEgZGlmZmVyZW50IHR5cGVmYWNlIG9yIHNtYWxsZXIgc2l6ZSBxdW90YXRpb24uIEl0IG1heSBvciBtYXkgbm90IGluY2x1ZGUgYSBjaXRhdGlvbiwgdXN1YWxseSBwbGFjZWQgYXQgdGhlIGJvdHRvbS48L3A+XHJcbiAgICAgICAgICAgICAgICA8Y2l0ZT48YSBocmVmPVwiIyFcIj5TYWlkIG5vIG9uZSwgZXZlci48L2E+PC9jaXRlPlxyXG4gICAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2xpc3RzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkxpc3RzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDM+RGVmaW5pdGlvbiBsaXN0PC9oMz5cclxuICAgICAgICAgICAgICA8ZGw+XHJcbiAgICAgICAgICAgICAgICA8ZHQ+RGVmaW5pdGlvbiBMaXN0IFRpdGxlPC9kdD5cclxuICAgICAgICAgICAgICAgIDxkZD5UaGlzIGlzIGEgZGVmaW5pdGlvbiBsaXN0IGRpdmlzaW9uLjwvZGQ+XHJcbiAgICAgICAgICAgICAgPC9kbD5cclxuICAgICAgICAgICAgICA8aDM+T3JkZXJlZCBMaXN0PC9oMz5cclxuICAgICAgICAgICAgICA8b2wgdHlwZT1cIjFcIj5cclxuICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgIDxvbCB0eXBlPVwiQVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgIDxvbCB0eXBlPVwiYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8b2wgdHlwZT1cIklcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvbCB0eXBlPVwiaVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAyPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8L29sPlxyXG4gICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICA8aDM+VW5vcmRlcmVkIExpc3Q8L2gzPlxyXG4gICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19ibG9ja3F1b3Rlc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMT5CbG9ja3F1b3RlczwvaDE+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGJsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgICAgICA8cD5BIGJsb2NrIHF1b3RhdGlvbiAoYWxzbyBrbm93biBhcyBhIGxvbmcgcXVvdGF0aW9uIG9yIGV4dHJhY3QpIGlzIGEgcXVvdGF0aW9uIGluIGEgd3JpdHRlbiBkb2N1bWVudCwgdGhhdCBpcyBzZXQgb2ZmIGZyb20gdGhlIG1haW4gdGV4dCBhcyBhIHBhcmFncmFwaCwgb3IgYmxvY2sgb2YgdGV4dC48L3A+XHJcbiAgICAgICAgICAgICAgICA8cD5JdCBpcyB0eXBpY2FsbHkgZGlzdGluZ3Vpc2hlZCB2aXN1YWxseSB1c2luZyBpbmRlbnRhdGlvbiBhbmQgYSBkaWZmZXJlbnQgdHlwZWZhY2Ugb3Igc21hbGxlciBzaXplIHF1b3RhdGlvbi4gSXQgbWF5IG9yIG1heSBub3QgaW5jbHVkZSBhIGNpdGF0aW9uLCB1c3VhbGx5IHBsYWNlZCBhdCB0aGUgYm90dG9tLjwvcD5cclxuICAgICAgICAgICAgICAgIDxjaXRlPjxhIGhyZWY9XCIjIVwiPlNhaWQgbm8gb25lLCBldmVyLjwvYT48L2NpdGU+XHJcbiAgICAgICAgICAgICAgPC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMT5EZXRhaWxzIC8gU3VtbWFyeTwvaDE+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkZXRhaWxzPlxyXG4gICAgICAgICAgICAgIDxzdW1tYXJ5PkV4cGFuZCBmb3IgZGV0YWlsczwvc3VtbWFyeT5cclxuICAgICAgICAgICAgICA8cD5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCBjb25zZWN0ZXR1ciBhZGlwaXNpY2luZyBlbGl0LiBDdW0sIG9kaW8hIE9kaW8gbmF0dXMgdWxsYW0gYWQgcXVhZXJhdCwgZWFxdWUgbmVjZXNzaXRhdGlidXMsIGFsaXF1aWQgZGlzdGluY3RpbyBzaW1pbGlxdWUgdm9sdXB0YXRpYnVzIGRpY3RhIGNvbnNlcXV1bnR1ciBhbmltaS4gUXVhZXJhdCBmYWNpbGlzIHF1aWRlbSB1bmRlIGVvcyEgSXBzYS48L3A+XHJcbiAgICAgICAgICAgIDwvZGV0YWlscz5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fYWRkcmVzc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMT5BZGRyZXNzPC9oMT48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGFkZHJlc3M+XHJcbiAgICAgICAgICAgICAgV3JpdHRlbiBieSA8YSBocmVmPVwibWFpbHRvOndlYm1hc3RlckBleGFtcGxlLmNvbVwiPkpvbiBEb2U8L2E+Ljxicj5cclxuICAgICAgICAgICAgICBWaXNpdCB1cyBhdDo8YnI+XHJcbiAgICAgICAgICAgICAgRXhhbXBsZS5jb208YnI+XHJcbiAgICAgICAgICAgICAgQm94IDU2NCwgRGlzbmV5bGFuZDxicj5cclxuICAgICAgICAgICAgICBVU0FcclxuICAgICAgICAgICAgPC9hZGRyZXNzPlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19oclwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5Ib3Jpem9udGFsIHJ1bGVzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aHI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X190YWJsZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+VGFidWxhciBkYXRhPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPHRhYmxlPlxyXG4gICAgICAgICAgICAgIDxjYXB0aW9uPlRhYmxlIENhcHRpb248L2NhcHRpb24+XHJcbiAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgSGVhZGluZyAxPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgMjwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBIZWFkaW5nIDM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgSGVhZGluZyA0PC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgNTwvdGg+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgPHRmb290PlxyXG4gICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDE8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDI8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDM8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDQ8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgRm9vdGVyIDU8L3RoPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICA8L3Rmb290PlxyXG4gICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAzPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDU8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAzPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDU8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAzPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDU8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAzPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgNDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDU8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19jb2RlXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkNvZGU8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+S2V5Ym9hcmQgaW5wdXQ6PC9zdHJvbmc+IDxrYmQ+Q21kPC9rYmQ+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+SW5saW5lIGNvZGU6PC9zdHJvbmc+IDxjb2RlPiZsdDtkaXYmZ3Q7Y29kZSZsdDsvZGl2Jmd0OzwvY29kZT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5TYW1wbGUgb3V0cHV0Ojwvc3Ryb25nPiA8c2FtcD5UaGlzIGlzIHNhbXBsZSBvdXRwdXQgZnJvbSBhIGNvbXB1dGVyIHByb2dyYW0uPC9zYW1wPjwvcD5cclxuICAgICAgICAgICAgICA8aDI+UHJlLWZvcm1hdHRlZCB0ZXh0PC9oMj5cclxuICAgICAgICAgICAgICA8cHJlPlAgUiBFIEYgTyBSIE0gQSBUIFQgRSBEIFQgRSBYIFRcclxuICAhIFwiICMgJCAlICZhbXA7ICcgKCApICogKyAsIC0gLiAvXHJcbiAgMCAxIDIgMyA0IDUgNiA3IDggOSA6IDsgJmx0OyA9ICZndDsgP1xyXG4gIEAgQSBCIEMgRCBFIEYgRyBIIEkgSiBLIEwgTSBOIE9cclxuICBQIFEgUiBTIFQgVSBWIFcgWCBZIFogWyBcXFxcIF0gXiBfXHJcbiAgXFxgIGEgYiBjIGQgZSBmIGcgaCBpIGogayBsIG0gbiBvXHJcbiAgcCBxIHIgcyB0IHUgdiB3IHggeSB6IHsgfCB9IH4gPC9wcmU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19pbmxpbmVcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SW5saW5lIGVsZW1lbnRzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8cD48YSBocmVmPVwiIyFcIj5UaGlzIGlzIGEgdGV4dCBsaW5rPC9hPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5TdHJvbmcgaXMgdXNlZCB0byBpbmRpY2F0ZSBzdHJvbmcgaW1wb3J0YW5jZS48L3N0cm9uZz48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PGVtPlRoaXMgdGV4dCBoYXMgYWRkZWQgZW1waGFzaXMuPC9lbT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDxiPmIgZWxlbWVudDwvYj4gaXMgc3R5bGlzdGljYWxseSBkaWZmZXJlbnQgdGV4dCBmcm9tIG5vcm1hbCB0ZXh0LCB3aXRob3V0IGFueSBzcGVjaWFsIGltcG9ydGFuY2UuPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8aT5pIGVsZW1lbnQ8L2k+IGlzIHRleHQgdGhhdCBpcyBvZmZzZXQgZnJvbSB0aGUgbm9ybWFsIHRleHQuPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8dT51IGVsZW1lbnQ8L3U+IGlzIHRleHQgd2l0aCBhbiB1bmFydGljdWxhdGVkLCB0aG91Z2ggZXhwbGljaXRseSByZW5kZXJlZCwgbm9uLXRleHR1YWwgYW5ub3RhdGlvbi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PGRlbD5UaGlzIHRleHQgaXMgZGVsZXRlZDwvZGVsPiBhbmQgPGlucz5UaGlzIHRleHQgaXMgaW5zZXJ0ZWQ8L2lucz4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzPlRoaXMgdGV4dCBoYXMgYSBzdHJpa2V0aHJvdWdoPC9zPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+U3VwZXJzY3JpcHQ8c3VwPsKuPC9zdXA+LjwvcD5cclxuICAgICAgICAgICAgICA8cD5TdWJzY3JpcHQgZm9yIHRoaW5ncyBsaWtlIEg8c3ViPjI8L3N1Yj5PLjwvcD5cclxuICAgICAgICAgICAgICA8cD48c21hbGw+VGhpcyBzbWFsbCB0ZXh0IGlzIHNtYWxsIGZvciBmaW5lIHByaW50LCBldGMuPC9zbWFsbD48L3A+XHJcbiAgICAgICAgICAgICAgPHA+QWJicmV2aWF0aW9uOiA8YWJiciB0aXRsZT1cIkh5cGVyVGV4dCBNYXJrdXAgTGFuZ3VhZ2VcIj5IVE1MPC9hYmJyPjwvcD5cclxuICAgICAgICAgICAgICA8cD48cSBjaXRlPVwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9IVE1ML0VsZW1lbnQvcVwiPlRoaXMgdGV4dCBpcyBhIHNob3J0IGlubGluZSBxdW90YXRpb24uPC9xPjwvcD5cclxuICAgICAgICAgICAgICA8cD48Y2l0ZT5UaGlzIGlzIGEgY2l0YXRpb24uPC9jaXRlPjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPGRmbj5kZm4gZWxlbWVudDwvZGZuPiBpbmRpY2F0ZXMgYSBkZWZpbml0aW9uLjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPG1hcms+bWFyayBlbGVtZW50PC9tYXJrPiBpbmRpY2F0ZXMgYSBoaWdobGlnaHQuPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8dmFyPnZhcmlhYmxlIGVsZW1lbnQ8L3Zhcj4sIHN1Y2ggYXMgPHZhcj54PC92YXI+ID0gPHZhcj55PC92YXI+LjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgdGltZSBlbGVtZW50OiA8dGltZSBkYXRldGltZT1cIjIwMTMtMDQtMDZUMTI6MzIrMDA6MDBcIj4yIHdlZWtzIGFnbzwvdGltZT48L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19jb21tZW50c1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5IVE1MIENvbW1lbnRzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8cD5UaGVyZSBpcyBjb21tZW50IGhlcmU6IDwhLS1UaGlzIGNvbW1lbnQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQtLT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlcmUgaXMgYSBjb21tZW50IHNwYW5uaW5nIG11bHRpcGxlIHRhZ3MgYW5kIGxpbmVzIGJlbG93IGhlcmUuPC9wPlxyXG4gICAgICAgICAgICAgIDwhLS08cD48YSBocmVmPVwiIyFcIj5UaGlzIGlzIGEgdGV4dCBsaW5rLiBCdXQgaXQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQgaW4gYSBjb21tZW50PC9hPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5TdHJvbmcgaXMgdXNlZCB0byBpbmRpY2F0ZSBzdHJvbmcgaW1wb3J0YW5jZS4gQnV0LCBpdCBzaG91bGQgbm90IGJlIGRpc3BsYXllZCBpbiBhIGNvbW1lbnQ8L3N0cm9uZz48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PGVtPlRoaXMgdGV4dCBoYXMgYWRkZWQgZW1waGFzaXMuIEJ1dCwgaXQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQgaW4gYSBjb21tZW50PC9lbT48L3A+LS0+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICA8c2VjdGlvbiBpZD1cImVtYmVkZGVkXCI+XHJcbiAgICAgICAgICA8aGVhZGVyPjxoMj5FbWJlZGRlZCBjb250ZW50PC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2ltYWdlc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5JbWFnZXM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoMz5QbGFpbiA8Y29kZT4mbHQ7aW1nJmd0OzwvY29kZT4gZWxlbWVudDwvaDM+XHJcbiAgICAgICAgICAgICAgPHA+PGltZyBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80ODAvNDgwXCIgYWx0PVwiUGhvdG8gb2YgYSBraXR0ZW5cIj48L3A+XHJcbiAgICAgICAgICAgICAgPGgzPjxjb2RlPiZsdDtmaWd1cmUmZ3Q7PC9jb2RlPiBlbGVtZW50IHdpdGggPGNvZGU+Jmx0O2ltZyZndDs8L2NvZGU+IGVsZW1lbnQ8L2gzPlxyXG4gICAgICAgICAgICAgIDxmaWd1cmU+PGltZyBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80MjAvNDIwXCIgYWx0PVwiUGhvdG8gb2YgYSBraXR0ZW5cIj48L2ZpZ3VyZT5cclxuICAgICAgICAgICAgICA8aDM+PGNvZGU+Jmx0O2ZpZ3VyZSZndDs8L2NvZGU+IGVsZW1lbnQgd2l0aCA8Y29kZT4mbHQ7aW1nJmd0OzwvY29kZT4gYW5kIDxjb2RlPiZsdDtmaWdjYXB0aW9uJmd0OzwvY29kZT4gZWxlbWVudHM8L2gzPlxyXG4gICAgICAgICAgICAgIDxmaWd1cmU+XHJcbiAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzQyMC80MjBcIiBhbHQ9XCJQaG90byBvZiBhIGtpdHRlblwiPlxyXG4gICAgICAgICAgICAgICAgPGZpZ2NhcHRpb24+SGVyZSBpcyBhIGNhcHRpb24gZm9yIHRoaXMgaW1hZ2UuPC9maWdjYXB0aW9uPlxyXG4gICAgICAgICAgICAgIDwvZmlndXJlPlxyXG4gICAgICAgICAgICAgIDxoMz48Y29kZT4mbHQ7ZmlndXJlJmd0OzwvY29kZT4gZWxlbWVudCB3aXRoIGEgPGNvZGU+Jmx0O3BpY3R1cmUmZ3Q7PC9jb2RlPiBlbGVtZW50PC9oMz5cclxuICAgICAgICAgICAgICA8ZmlndXJlPlxyXG4gICAgICAgICAgICAgICAgPHBpY3R1cmU+XHJcbiAgICAgICAgICAgICAgICAgIDxzb3VyY2Ugc3Jjc2V0PVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vODAwLzgwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgbWVkaWE9XCIobWluLXdpZHRoOiA4MDBweClcIj5cclxuICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80MjAvNDIwXCIgYWx0PVwiUGhvdG8gb2YgYSBraXR0ZW5cIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9waWN0dXJlPlxyXG4gICAgICAgICAgICAgIDwvZmlndXJlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2JnaW1hZ2VzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkJhY2tncm91bmQgaW1hZ2VzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImJhY2tncm91bmQtaW1hZ2U6dXJsKCdodHRwczovL3BsYWNla2l0dGVuLmNvbS8zMDAvMzAwJyk7IHdpZHRoOjMwMHB4OyBoZWlnaHQ6IDMwMHB4O1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fYXVkaW9cIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+QXVkaW88L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxhdWRpbyBjb250cm9scz1cIlwiPmF1ZGlvPC9hdWRpbz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX3ZpZGVvXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPlZpZGVvPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48dmlkZW8gY29udHJvbHM9XCJcIj52aWRlbzwvdmlkZW8+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19jYW52YXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+Q2FudmFzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48Y2FudmFzPmNhbnZhczwvY2FudmFzPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fbWV0ZXJcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+TWV0ZXI8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxtZXRlciB2YWx1ZT1cIjJcIiBtaW49XCIwXCIgbWF4PVwiMTBcIj4yIG91dCBvZiAxMDwvbWV0ZXI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19wcm9ncmVzc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5Qcm9ncmVzczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PHByb2dyZXNzPnByb2dyZXNzPC9wcm9ncmVzcz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX3N2Z1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5JbmxpbmUgU1ZHPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48c3ZnIHdpZHRoPVwiMTAwcHhcIiBoZWlnaHQ9XCIxMDBweFwiPjxjaXJjbGUgY3g9XCIxMDBcIiBjeT1cIjEwMFwiIHI9XCIxMDBcIiBmaWxsPVwiIzFmYTNlY1wiPjwvY2lyY2xlPjwvc3ZnPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9faWZyYW1lXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPklGcmFtZTwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PGlmcmFtZSBzcmM9XCJpbmRleC5odG1sXCIgaGVpZ2h0PVwiMzAwXCI+PC9pZnJhbWU+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19lbWJlZFwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5FbWJlZDwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PGVtYmVkIHNyYz1cImluZGV4Lmh0bWxcIiBoZWlnaHQ9XCIzMDBcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX29iamVjdFwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5PYmplY3Q8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxvYmplY3QgZGF0YT1cImluZGV4Lmh0bWxcIiBoZWlnaHQ9XCIzMDBcIj48L29iamVjdD48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJmb3Jtc1wiPlxyXG4gICAgICAgICAgPGhlYWRlcj48aDI+Rm9ybSBlbGVtZW50czwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICA8Zm9ybT5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX2lucHV0XCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5JbnB1dCBmaWVsZHM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fdGV4dFwiPlRleHQgSW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3RleHRcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiVGV4dCBJbnB1dFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fcGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiBwbGFjZWhvbGRlcj1cIlR5cGUgeW91ciBQYXNzd29yZFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fd2ViYWRkcmVzc1wiPldlYiBBZGRyZXNzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X193ZWJhZGRyZXNzXCIgdHlwZT1cInVybFwiIHBsYWNlaG9sZGVyPVwiaHR0cHM6Ly95b3Vyc2l0ZS5jb21cIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX2VtYWlsYWRkcmVzc1wiPkVtYWlsIEFkZHJlc3M8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX2VtYWlsYWRkcmVzc1wiIHR5cGU9XCJlbWFpbFwiIHBsYWNlaG9sZGVyPVwibmFtZUBlbWFpbC5jb21cIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3Bob25lXCI+UGhvbmUgTnVtYmVyPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19waG9uZVwiIHR5cGU9XCJ0ZWxcIiBwbGFjZWhvbGRlcj1cIig5OTkpIDk5OS05OTk5XCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X19zZWFyY2hcIj5TZWFyY2g8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3NlYXJjaFwiIHR5cGU9XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIkVudGVyIFNlYXJjaCBUZXJtXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X190ZXh0MlwiPk51bWJlciBJbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fdGV4dDJcIiB0eXBlPVwibnVtYmVyXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBhIE51bWJlclwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fZmlsZVwiPkZpbGUgSW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX2ZpbGVcIiB0eXBlPVwiZmlsZVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19zZWxlY3RcIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPlNlbGVjdCBtZW51czwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNlbGVjdFwiPlNlbGVjdDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwic2VsZWN0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIk9wdGlvbiBHcm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIE9uZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIFR3bzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIFRocmVlPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwic2VsZWN0X211bHRpcGxlXCI+U2VsZWN0IChtdWx0aXBsZSk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNlbGVjdF9tdWx0aXBsZVwiIG11bHRpcGxlPVwibXVsdGlwbGVcIj5cclxuICAgICAgICAgICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiT3B0aW9uIEdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gT25lPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gVHdvPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5PcHRpb24gVGhyZWU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgPC9vcHRncm91cD5cclxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19jaGVja2JveFwiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+Q2hlY2tib3hlczwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwiY2hlY2tib3gxXCI+PGlucHV0IGlkPVwiY2hlY2tib3gxXCIgbmFtZT1cImNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD1cImNoZWNrZWRcIj4gQ2hvaWNlIEE8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cImNoZWNrYm94MlwiPjxpbnB1dCBpZD1cImNoZWNrYm94MlwiIG5hbWU9XCJjaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiPiBDaG9pY2UgQjwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwiY2hlY2tib3gzXCI+PGlucHV0IGlkPVwiY2hlY2tib3gzXCIgbmFtZT1cImNoZWNrYm94XCIgdHlwZT1cImNoZWNrYm94XCI+IENob2ljZSBDPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fcmFkaW9cIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPlJhZGlvIGJ1dHRvbnM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cInJhZGlvMVwiPjxpbnB1dCBpZD1cInJhZGlvMVwiIG5hbWU9XCJyYWRpb1wiIHR5cGU9XCJyYWRpb1wiIGNoZWNrZWQ9XCJjaGVja2VkXCI+IE9wdGlvbiAxPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJyYWRpbzJcIj48aW5wdXQgaWQ9XCJyYWRpbzJcIiBuYW1lPVwicmFkaW9cIiB0eXBlPVwicmFkaW9cIj4gT3B0aW9uIDI8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cInJhZGlvM1wiPjxpbnB1dCBpZD1cInJhZGlvM1wiIG5hbWU9XCJyYWRpb1wiIHR5cGU9XCJyYWRpb1wiPiBPcHRpb24gMzwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX3RleHRhcmVhc1wiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+VGV4dGFyZWFzPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidGV4dGFyZWFcIj5UZXh0YXJlYTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJ0ZXh0YXJlYVwiIHJvd3M9XCI4XCIgY29scz1cIjQ4XCIgcGxhY2Vob2xkZXI9XCJFbnRlciB5b3VyIG1lc3NhZ2UgaGVyZVwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX2h0bWw1XCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5IVE1MNSBpbnB1dHM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpY1wiPkNvbG9yIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY29sb3JcIiBpZD1cImljXCIgdmFsdWU9XCIjMDAwMDAwXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImluXCI+TnVtYmVyIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgaWQ9XCJpblwiIG1pbj1cIjBcIiBtYXg9XCIxMFwiIHZhbHVlPVwiNVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpclwiPlJhbmdlIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBpZD1cImlyXCIgdmFsdWU9XCIxMFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZGRcIj5EYXRlIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIGlkPVwiaWRkXCIgdmFsdWU9XCIxOTcwLTAxLTAxXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkbVwiPk1vbnRoIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwibW9udGhcIiBpZD1cImlkbVwiIHZhbHVlPVwiMTk3MC0wMVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZHdcIj5XZWVrIGlucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwid2Vla1wiIGlkPVwiaWR3XCIgdmFsdWU9XCIxOTcwLVcwMVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZHRcIj5EYXRldGltZSBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGV0aW1lXCIgaWQ9XCJpZHRcIiB2YWx1ZT1cIjE5NzAtMDEtMDFUMDA6MDA6MDBaXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkdGxcIj5EYXRldGltZS1sb2NhbCBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgaWQ9XCJpZHRsXCIgdmFsdWU9XCIxOTcwLTAxLTAxVDAwOjAwXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlkbFwiPkRhdGFsaXN0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiaWRsXCIgbGlzdD1cImV4YW1wbGUtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRhdGFsaXN0IGlkPVwiZXhhbXBsZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFeGFtcGxlICMxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkV4YW1wbGUgIzJcIiAvPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRXhhbXBsZSAjM1wiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2RhdGFsaXN0PlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19hY3Rpb25cIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPkFjdGlvbiBidXR0b25zPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiPGlucHV0IHR5cGU9c3VibWl0PlwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxpbnB1dCB0eXBlPWJ1dHRvbj5cIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmVzZXRcIiB2YWx1ZT1cIjxpbnB1dCB0eXBlPXJlc2V0PlwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIjxpbnB1dCBkaXNhYmxlZD5cIiBkaXNhYmxlZD5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj4mbHQ7YnV0dG9uIHR5cGU9c3VibWl0Jmd0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCI+Jmx0O2J1dHRvbiB0eXBlPWJ1dHRvbiZndDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInJlc2V0XCI+Jmx0O2J1dHRvbiB0eXBlPXJlc2V0Jmd0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGlzYWJsZWQ+Jmx0O2J1dHRvbiBkaXNhYmxlZCZndDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgPC9tYWluPlxyXG4gICAgICA8Zm9vdGVyPlxyXG4gICAgICAgIDxwPk1hZGUgYnkgPGEgaHJlZj1cImh0dHA6Ly90d2l0dGVyLmNvbS9jYnJhY2NvXCI+QGNicmFjY288L2E+LiBDb2RlIG9uIDxhIGhyZWY9XCJodHRwOi8vZ2l0aHViLmNvbS9jYnJhY2NvL2h0bWw1LXRlc3QtcGFnZVwiPkdpdEh1YjwvYT4uPC9wPlxyXG4gICAgICA8L2Zvb3Rlcj5cclxuICAgIDwvZGl2PlxyXG4gIDwvYm9keT5cclxuPC9odG1sPlxyXG5gO1xyXG4iLCJleHBvcnQgY2xhc3MgS2FzcGVyRXJyb3Ige1xyXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG4gICAgdGhpcy5jb2wgPSBjb2w7XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IERlbW9Tb3VyY2UgfSBmcm9tIFwiLi9kZW1vXCI7XHJcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gXCIuL3BhcnNlclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGUoc291cmNlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcclxuICBjb25zdCBub2RlcyA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xyXG4gIGlmIChwYXJzZXIuZXJyb3JzLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBhcnNlci5lcnJvcnMpO1xyXG4gIH1cclxuICBjb25zdCByZXN1bHQgPSBKU09OLnN0cmluZ2lmeShub2Rlcyk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcclxuICBpZiAocGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJzZXIuZXJyb3JzKTtcclxuICB9XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG5vZGVzKTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAod2luZG93IGFzIGFueSkua2FzcGVyID0ge1xyXG4gICAgZGVtb1NvdXJjZUNvZGU6IERlbW9Tb3VyY2UsXHJcbiAgICBleGVjdXRlLFxyXG4gICAgcGFyc2UsXHJcbiAgfTtcclxufSBlbHNlIHtcclxuICBleHBvcnRzLmthc3BlciA9IHtcclxuICAgIGV4ZWN1dGUsXHJcbiAgICBwYXJzZSxcclxuICB9O1xyXG59XHJcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOb2RlIHtcbiAgICBwdWJsaWMgbGluZTogbnVtYmVyO1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGFic3RyYWN0IGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZVZpc2l0b3I8Uj4ge1xuICAgIHZpc2l0RWxlbWVudE5vZGUobm9kZTogRWxlbWVudCk6IFI7XG4gICAgdmlzaXRBdHRyaWJ1dGVOb2RlKG5vZGU6IEF0dHJpYnV0ZSk6IFI7XG4gICAgdmlzaXRUZXh0Tm9kZShub2RlOiBUZXh0KTogUjtcbiAgICB2aXNpdENvbW1lbnROb2RlKG5vZGU6IENvbW1lbnQpOiBSO1xuICAgIHZpc2l0RG9jdHlwZU5vZGUobm9kZTogRG9jdHlwZSk6IFI7XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgYXR0cmlidXRlczogTm9kZVtdO1xuICAgIHB1YmxpYyBjaGlsZHJlbjogTm9kZVtdO1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBhdHRyaWJ1dGVzOiBOb2RlW10sIGNoaWxkcmVuOiBOb2RlW10sIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2VsZW1lbnQnO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnROb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuRWxlbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlIGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnYXR0cmlidXRlJztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGVOb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuQXR0cmlidXRlJztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRUZXh0Tm9kZSh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdOb2RlLlRleHQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1lbnQgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2NvbW1lbnQnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnROb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuQ29tbWVudCc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9jdHlwZSBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAnZG9jdHlwZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZU5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5Eb2N0eXBlJztcbiAgICB9XG59XG5cbiIsImltcG9ydCB7IEthc3BlckVycm9yIH0gZnJvbSBcIi4vZXJyb3JcIjtcclxuaW1wb3J0ICogYXMgTm9kZSBmcm9tIFwiLi9ub2Rlc1wiO1xyXG5pbXBvcnQgeyBTZWxmQ2xvc2luZ1RhZ3MsIFdoaXRlU3BhY2VzIH0gZnJvbSBcIi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xyXG4gIHB1YmxpYyBjdXJyZW50OiBudW1iZXI7XHJcbiAgcHVibGljIGxpbmU6IG51bWJlcjtcclxuICBwdWJsaWMgY29sOiBudW1iZXI7XHJcbiAgcHVibGljIHNvdXJjZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBlcnJvcnM6IHN0cmluZ1tdO1xyXG4gIHB1YmxpYyBub2RlczogTm9kZS5Ob2RlW107XHJcblxyXG4gIHB1YmxpYyBwYXJzZShzb3VyY2U6IHN0cmluZyk6IE5vZGUuTm9kZVtdIHtcclxuICAgIHRoaXMuY3VycmVudCA9IDA7XHJcbiAgICB0aGlzLmxpbmUgPSAxO1xyXG4gICAgdGhpcy5jb2wgPSAxO1xyXG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgdGhpcy5ub2RlcyA9IFtdO1xyXG5cclxuICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGUoKTtcclxuICAgICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgS2FzcGVyRXJyb3IpIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYFBhcnNlIEVycm9yICgke2UubGluZX06JHtlLmNvbH0pID0+ICR7ZS52YWx1ZX1gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChgJHtlfWApO1xyXG4gICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goXCJQYXJzZSBFcnJvciBsaW1pdCBleGNlZWRlZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlcztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWF0Y2goLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnQgKz0gY2hhci5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWR2YW5jZSgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5lb2YoKSkge1xyXG4gICAgICBpZiAodGhpcy5jaGVjayhcIlxcblwiKSkge1xyXG4gICAgICAgIHRoaXMubGluZSArPSAxO1xyXG4gICAgICAgIHRoaXMuY29sID0gMDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNvbCArPSAxO1xyXG4gICAgICB0aGlzLmN1cnJlbnQrKztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGVlayguLi5jaGFyczogc3RyaW5nW10pOiBib29sZWFuIHtcclxuICAgIGZvciAoY29uc3QgY2hhciBvZiBjaGFycykge1xyXG4gICAgICBpZiAodGhpcy5jaGVjayhjaGFyKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrKGNoYXI6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHRoaXMuY3VycmVudCwgdGhpcy5jdXJyZW50ICsgY2hhci5sZW5ndGgpID09PSBjaGFyO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBlb2YoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50ID4gdGhpcy5zb3VyY2UubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBlcnJvcihtZXNzYWdlOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgdGhyb3cgbmV3IEthc3BlckVycm9yKG1lc3NhZ2UsIHRoaXMubGluZSwgdGhpcy5jb2wpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub2RlKCk6IE5vZGUuTm9kZSB7XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIGxldCBub2RlOiBOb2RlLk5vZGU7XHJcblxyXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8L1wiKSkge1xyXG4gICAgICB0aGlzLmVycm9yKFwiVW5leHBlY3RlZCBjbG9zaW5nIHRhZ1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5tYXRjaChcIjwhLS1cIikpIHtcclxuICAgICAgbm9kZSA9IHRoaXMuY29tbWVudCgpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPCFkb2N0eXBlXCIpIHx8IHRoaXMubWF0Y2goXCI8IURPQ1RZUEVcIikpIHtcclxuICAgICAgbm9kZSA9IHRoaXMuZG9jdHlwZSgpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKFwiPFwiKSkge1xyXG4gICAgICBub2RlID0gdGhpcy5lbGVtZW50KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2RlID0gdGhpcy50ZXh0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICByZXR1cm4gbm9kZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29tbWVudCgpOiBOb2RlLk5vZGUge1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XHJcbiAgICBkbyB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYC0tPmApKTtcclxuICAgIGNvbnN0IGNvbW1lbnQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMyk7XHJcbiAgICByZXR1cm4gbmV3IE5vZGUuQ29tbWVudChjb21tZW50LCB0aGlzLmxpbmUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkb2N0eXBlKCk6IE5vZGUuTm9kZSB7XHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgIGRvIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcclxuICAgIGNvbnN0IGRvY3R5cGUgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50IC0gMSkudHJpbSgpO1xyXG4gICAgcmV0dXJuIG5ldyBOb2RlLkRvY3R5cGUoZG9jdHlwZSwgdGhpcy5saW5lKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZWxlbWVudCgpOiBOb2RlLk5vZGUge1xyXG4gICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIi9cIiwgXCI+XCIpO1xyXG4gICAgaWYgKCFuYW1lKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCBhIHRhZyBuYW1lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgIHRoaXMubWF0Y2goXCIvPlwiKSB8fFxyXG4gICAgICAoU2VsZkNsb3NpbmdUYWdzLmluY2x1ZGVzKG5hbWUpICYmIHRoaXMubWF0Y2goXCI+XCIpKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIFtdLCB0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5tYXRjaChcIj5cIikpIHtcclxuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGNsb3NpbmcgdGFnXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjaGlsZHJlbjogTm9kZS5Ob2RlW10gPSBbXTtcclxuXHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuXHJcbiAgICBpZiAoIXRoaXMucGVlayhcIjwvXCIpKSB7XHJcbiAgICAgIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbihuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNsb3NlKG5hbWUpO1xyXG4gICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4sIHRoaXMubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNsb3NlKG5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPC9cIikpIHtcclxuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLm1hdGNoKGAke25hbWV9YCkpIHtcclxuICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke25hbWV9PmApO1xyXG4gICAgfVxyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI+XCIpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hpbGRyZW4ocGFyZW50OiBzdHJpbmcpOiBOb2RlLk5vZGVbXSB7XHJcbiAgICBjb25zdCBjaGlsZHJlbjogTm9kZS5Ob2RlW10gPSBbXTtcclxuICAgIGRvIHtcclxuICAgICAgaWYgKHRoaXMuZW9mKCkpIHtcclxuICAgICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7cGFyZW50fT5gKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XHJcbiAgICAgIGlmIChub2RlID09PSBudWxsKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuICAgICAgY2hpbGRyZW4ucHVzaChub2RlKTtcclxuICAgIH0gd2hpbGUgKCF0aGlzLnBlZWsoYDwvYCkpO1xyXG5cclxuICAgIHJldHVybiBjaGlsZHJlbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXR0cmlidXRlcygpOiBOb2RlLkF0dHJpYnV0ZVtdIHtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE5vZGUuQXR0cmlidXRlW10gPSBbXTtcclxuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPlwiLCBcIi8+XCIpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiPVwiLCBcIj5cIiwgXCIvPlwiKTtcclxuICAgICAgaWYgKCFuYW1lKSB7XHJcbiAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICAgIGxldCB2YWx1ZSA9IFwiXCI7XHJcbiAgICAgIGlmICh0aGlzLm1hdGNoKFwiPVwiKSkge1xyXG4gICAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKFwiJ1wiKSkge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZyhcIidcIik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKCdcIicpKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuc3RyaW5nKCdcIicpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuaWRlbnRpZmllcihcIj5cIiwgXCIvPlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICAgIGF0dHJpYnV0ZXMucHVzaChuZXcgTm9kZS5BdHRyaWJ1dGUobmFtZSwgdmFsdWUsIHRoaXMubGluZSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGF0dHJpYnV0ZXM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRleHQoKTogTm9kZS5Ob2RlIHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoXCI8XCIpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdGV4dCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQpLnRyaW0oKTtcclxuICAgIGlmICghdGV4dCkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgTm9kZS5UZXh0KHRleHQsIHRoaXMubGluZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHdoaXRlc3BhY2UoKTogbnVtYmVyIHtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICB3aGlsZSAodGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzKSAmJiAhdGhpcy5lb2YoKSkge1xyXG4gICAgICBjb3VudCArPSAxO1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb3VudDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaWRlbnRpZmllciguLi5jbG9zaW5nOiBzdHJpbmdbXSk6IHN0cmluZyB7XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgd2hpbGUgKCF0aGlzLnBlZWsoLi4uV2hpdGVTcGFjZXMsIC4uLmNsb3NpbmcpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZW5kID0gdGhpcy5jdXJyZW50O1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIGVuZCkudHJpbSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdHJpbmcoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XHJcbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goLi4uY2xvc2luZykgJiYgIXRoaXMuZW9mKCkpIHtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuY3VycmVudCAtIDEpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gaXNEaWdpdChjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gY2hhciA+PSBcIjBcIiAmJiBjaGFyIDw9IFwiOVwiO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYShjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gKGNoYXIgPj0gXCJhXCIgJiYgY2hhciA8PSBcInpcIikgfHwgKGNoYXIgPj0gXCJBXCIgJiYgY2hhciA8PSBcIlpcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0FscGhhTnVtZXJpYyhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICByZXR1cm4gaXNBbHBoYShjaGFyKSB8fCBpc0RpZ2l0KGNoYXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZSh3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdoaXRlU3BhY2VzID0gW1wiIFwiLCBcIlxcblwiLCBcIlxcdFwiLCBcIlxcclwiXSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBTZWxmQ2xvc2luZ1RhZ3MgPSBbXHJcbiAgXCJhcmVhXCIsXHJcbiAgXCJiYXNlXCIsXHJcbiAgXCJiclwiLFxyXG4gIFwiY29sXCIsXHJcbiAgXCJlbWJlZFwiLFxyXG4gIFwiaHJcIixcclxuICBcImltZ1wiLFxyXG4gIFwiaW5wdXRcIixcclxuICBcImxpbmtcIixcclxuICBcIm1ldGFcIixcclxuICBcInBhcmFtXCIsXHJcbiAgXCJzb3VyY2VcIixcclxuICBcInRyYWNrXCIsXHJcbiAgXCJ3YnJcIixcclxuXTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==