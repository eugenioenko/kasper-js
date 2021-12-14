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
        if (this.match("<!doctype") || this.match("<!DOCTYPE")) {
            const start = this.current;
            do {
                this.advance();
            } while (!this.match(`>`));
            const doctype = this.source.slice(start, this.current - 1).trim();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Vycm9yLnRzIiwid2VicGFjazovLy8uL3NyYy9rYXNwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25vZGVzLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQU8sTUFBTSxXQUFXLEdBQUc7Ozs7Ozs7Q0FPMUIsQ0FBQztBQUNLLE1BQU0sVUFBVSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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R0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFVLENBQUM7QUFFckQsTUFBTSxlQUFlLEdBQUc7SUFDN0IsTUFBTTtJQUNOLE1BQU07SUFDTixJQUFJO0lBQ0osS0FBSztJQUNMLE9BQU87SUFDUCxJQUFJO0lBQ0osS0FBSztJQUNMLE9BQU87SUFDUCxNQUFNO0lBQ04sTUFBTTtJQUNOLE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztJQUNQLEtBQUs7Q0FDTixDQUFDIiwiZmlsZSI6Imthc3Blci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2thc3Blci50c1wiKTtcbiIsImV4cG9ydCBjb25zdCBEZW1vU291cmNlMSA9IGBcclxuPGJvZHkgICAgPlxyXG48ZGl2ICAgICAgICAgY2xhc3M9XCJibG9jayB3LWZ1bGwgZmxleFwiIGlkPVwiYmxvY2tcIj48L2Rpdj5cclxuPGltZyAgICAgICBzcmM9XCJodHRwOi8vdXJsLmltYWdlLmNvbVwiIGJvcmRlciAgPSAgMCAvPlxyXG48ZGl2IGNsYXNzPSdiLW5hbmEnPjwvZGl2PlxyXG48aW5wdXQgdHlwZT1jaGVja2JveCB2YWx1ZSA9ICAgIHNvbWV0aGluZyAvPlxyXG48L2JvZHk+XHJcbmA7XHJcbmV4cG9ydCBjb25zdCBEZW1vU291cmNlID0gYDwhRE9DVFlQRSBodG1sPlxcblxyXG48aHRtbCBsYW5nPVwiZW5cIj5cclxuICA8aGVhZD5cclxuICAgIDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiPlxyXG4gICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjBcIj5cclxuICAgIDx0aXRsZT5IVE1MNSBUZXN0IFBhZ2U8L3RpdGxlPlxyXG4gIDwvaGVhZD5cclxuICA8Ym9keT5cclxuICAgIDxkaXYgaWQ9XCJ0b3BcIiByb2xlPVwiZG9jdW1lbnRcIj5cclxuICAgICAgPGhlYWRlcj5cclxuICAgICAgICA8aDE+SFRNTDUgVGVzdCBQYWdlPC9oMT5cclxuICAgICAgICA8cD5UaGlzIGlzIGEgdGVzdCBwYWdlIGZpbGxlZCB3aXRoIGNvbW1vbiBIVE1MIGVsZW1lbnRzIHRvIGJlIHVzZWQgdG8gcHJvdmlkZSB2aXN1YWwgZmVlZGJhY2sgd2hpbHN0IGJ1aWxkaW5nIENTUyBzeXN0ZW1zIGFuZCBmcmFtZXdvcmtzLjwvcD5cclxuICAgICAgPC9oZWFkZXI+XHJcbiAgICAgIDxuYXY+XHJcbiAgICAgICAgPHVsPlxyXG4gICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI3RleHRcIj5UZXh0PC9hPlxyXG4gICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9faGVhZGluZ3NcIj5IZWFkaW5nczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX3BhcmFncmFwaHNcIj5QYXJhZ3JhcGhzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fbGlzdHNcIj5MaXN0czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2Jsb2NrcXVvdGVzXCI+QmxvY2txdW90ZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19kZXRhaWxzXCI+RGV0YWlscyAvIFN1bW1hcnk8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiN0ZXh0X19hZGRyZXNzXCI+QWRkcmVzczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2hyXCI+SG9yaXpvbnRhbCBydWxlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX3RhYmxlc1wiPlRhYnVsYXIgZGF0YTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI3RleHRfX2NvZGVcIj5Db2RlPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9faW5saW5lXCI+SW5saW5lIGVsZW1lbnRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjdGV4dF9fY29tbWVudHNcIj5IVE1MIENvbW1lbnRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI2VtYmVkZGVkXCI+RW1iZWRkZWQgY29udGVudDwvYT5cclxuICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19pbWFnZXNcIj5JbWFnZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fYmdpbWFnZXNcIj5CYWNrZ3JvdW5kIGltYWdlczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19hdWRpb1wiPkF1ZGlvPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX3ZpZGVvXCI+VmlkZW88L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fY2FudmFzXCI+Q2FudmFzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX21ldGVyXCI+TWV0ZXI8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fcHJvZ3Jlc3NcIj5Qcm9ncmVzczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19zdmdcIj5JbmxpbmUgU1ZHPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZW1iZWRkZWRfX2lmcmFtZVwiPklGcmFtZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNlbWJlZGRlZF9fZW1iZWRcIj5FbWJlZDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2VtYmVkZGVkX19vYmplY3RcIj5PYmplY3Q8L2E+PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjZm9ybXNcIj5Gb3JtIGVsZW1lbnRzPC9hPlxyXG4gICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX2lucHV0XCI+SW5wdXQgZmllbGRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX3NlbGVjdFwiPlNlbGVjdCBtZW51czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19jaGVja2JveFwiPkNoZWNrYm94ZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNmb3Jtc19fcmFkaW9cIj5SYWRpbyBidXR0b25zPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjZm9ybXNfX3RleHRhcmVhc1wiPlRleHRhcmVhczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19odG1sNVwiPkhUTUw1IGlucHV0czwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2Zvcm1zX19hY3Rpb25cIj5BY3Rpb24gYnV0dG9uczwvYT48L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICA8L25hdj5cclxuICAgICAgPG1haW4+XHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJ0ZXh0XCI+XHJcbiAgICAgICAgICA8aGVhZGVyPjxoMT5UZXh0PC9oMT48L2hlYWRlcj5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9faGVhZGluZ3NcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj5cclxuICAgICAgICAgICAgICA8aDI+SGVhZGluZ3M8L2gyPlxyXG4gICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDE+SGVhZGluZyAxPC9oMT5cclxuICAgICAgICAgICAgICA8aDI+SGVhZGluZyAyPC9oMj5cclxuICAgICAgICAgICAgICA8aDM+SGVhZGluZyAzPC9oMz5cclxuICAgICAgICAgICAgICA8aDQ+SGVhZGluZyA0PC9oND5cclxuICAgICAgICAgICAgICA8aDU+SGVhZGluZyA1PC9oNT5cclxuICAgICAgICAgICAgICA8aDY+SGVhZGluZyA2PC9oNj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX3BhcmFncmFwaHNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+UGFyYWdyYXBoczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPHA+QSBwYXJhZ3JhcGggKGZyb20gdGhlIEdyZWVrIHBhcmFncmFwaG9zLCDigJx0byB3cml0ZSBiZXNpZGXigJ0gb3Ig4oCcd3JpdHRlbiBiZXNpZGXigJ0pIGlzIGEgc2VsZi1jb250YWluZWQgdW5pdCBvZiBhIGRpc2NvdXJzZSBpbiB3cml0aW5nIGRlYWxpbmcgd2l0aCBhIHBhcnRpY3VsYXIgcG9pbnQgb3IgaWRlYS4gQSBwYXJhZ3JhcGggY29uc2lzdHMgb2Ygb25lIG9yIG1vcmUgc2VudGVuY2VzLiBUaG91Z2ggbm90IHJlcXVpcmVkIGJ5IHRoZSBzeW50YXggb2YgYW55IGxhbmd1YWdlLCBwYXJhZ3JhcGhzIGFyZSB1c3VhbGx5IGFuIGV4cGVjdGVkIHBhcnQgb2YgZm9ybWFsIHdyaXRpbmcsIHVzZWQgdG8gb3JnYW5pemUgbG9uZ2VyIHByb3NlLjwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2Jsb2NrcXVvdGVzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkJsb2NrcXVvdGVzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8YmxvY2txdW90ZT5cclxuICAgICAgICAgICAgICAgIDxwPkEgYmxvY2sgcXVvdGF0aW9uIChhbHNvIGtub3duIGFzIGEgbG9uZyBxdW90YXRpb24gb3IgZXh0cmFjdCkgaXMgYSBxdW90YXRpb24gaW4gYSB3cml0dGVuIGRvY3VtZW50LCB0aGF0IGlzIHNldCBvZmYgZnJvbSB0aGUgbWFpbiB0ZXh0IGFzIGEgcGFyYWdyYXBoLCBvciBibG9jayBvZiB0ZXh0LjwvcD5cclxuICAgICAgICAgICAgICAgIDxwPkl0IGlzIHR5cGljYWxseSBkaXN0aW5ndWlzaGVkIHZpc3VhbGx5IHVzaW5nIGluZGVudGF0aW9uIGFuZCBhIGRpZmZlcmVudCB0eXBlZmFjZSBvciBzbWFsbGVyIHNpemUgcXVvdGF0aW9uLiBJdCBtYXkgb3IgbWF5IG5vdCBpbmNsdWRlIGEgY2l0YXRpb24sIHVzdWFsbHkgcGxhY2VkIGF0IHRoZSBib3R0b20uPC9wPlxyXG4gICAgICAgICAgICAgICAgPGNpdGU+PGEgaHJlZj1cIiMhXCI+U2FpZCBubyBvbmUsIGV2ZXIuPC9hPjwvY2l0ZT5cclxuICAgICAgICAgICAgICA8L2Jsb2NrcXVvdGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJ0ZXh0X19saXN0c1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5MaXN0czwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGgzPkRlZmluaXRpb24gbGlzdDwvaDM+XHJcbiAgICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgPGR0PkRlZmluaXRpb24gTGlzdCBUaXRsZTwvZHQ+XHJcbiAgICAgICAgICAgICAgICA8ZGQ+VGhpcyBpcyBhIGRlZmluaXRpb24gbGlzdCBkaXZpc2lvbi48L2RkPlxyXG4gICAgICAgICAgICAgIDwvZGw+XHJcbiAgICAgICAgICAgICAgPGgzPk9yZGVyZWQgTGlzdDwvaDM+XHJcbiAgICAgICAgICAgICAgPG9sIHR5cGU9XCIxXCI+XHJcbiAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICA8b2wgdHlwZT1cIkFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICA8b2wgdHlwZT1cImFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIExpc3QgSXRlbSAyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPG9sIHR5cGU9XCJJXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b2wgdHlwZT1cImlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgIDwvb2w+XHJcbiAgICAgICAgICAgICAgPGgzPlVub3JkZXJlZCBMaXN0PC9oMz5cclxuICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgTGlzdCBJdGVtIDJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDE8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMaXN0IEl0ZW0gMlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAxPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDI8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+TGlzdCBJdGVtIDM8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5MaXN0IEl0ZW0gMzwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPkxpc3QgSXRlbSAzPC9saT5cclxuICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fYmxvY2txdW90ZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDE+QmxvY2txdW90ZXM8L2gxPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxibG9ja3F1b3RlPlxyXG4gICAgICAgICAgICAgICAgPHA+QSBibG9jayBxdW90YXRpb24gKGFsc28ga25vd24gYXMgYSBsb25nIHF1b3RhdGlvbiBvciBleHRyYWN0KSBpcyBhIHF1b3RhdGlvbiBpbiBhIHdyaXR0ZW4gZG9jdW1lbnQsIHRoYXQgaXMgc2V0IG9mZiBmcm9tIHRoZSBtYWluIHRleHQgYXMgYSBwYXJhZ3JhcGgsIG9yIGJsb2NrIG9mIHRleHQuPC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+SXQgaXMgdHlwaWNhbGx5IGRpc3Rpbmd1aXNoZWQgdmlzdWFsbHkgdXNpbmcgaW5kZW50YXRpb24gYW5kIGEgZGlmZmVyZW50IHR5cGVmYWNlIG9yIHNtYWxsZXIgc2l6ZSBxdW90YXRpb24uIEl0IG1heSBvciBtYXkgbm90IGluY2x1ZGUgYSBjaXRhdGlvbiwgdXN1YWxseSBwbGFjZWQgYXQgdGhlIGJvdHRvbS48L3A+XHJcbiAgICAgICAgICAgICAgICA8Y2l0ZT48YSBocmVmPVwiIyFcIj5TYWlkIG5vIG9uZSwgZXZlci48L2E+PC9jaXRlPlxyXG4gICAgICAgICAgICAgIDwvYmxvY2txdW90ZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2RldGFpbHNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDE+RGV0YWlscyAvIFN1bW1hcnk8L2gxPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGV0YWlscz5cclxuICAgICAgICAgICAgICA8c3VtbWFyeT5FeHBhbmQgZm9yIGRldGFpbHM8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgICAgPHA+TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gQ3VtLCBvZGlvISBPZGlvIG5hdHVzIHVsbGFtIGFkIHF1YWVyYXQsIGVhcXVlIG5lY2Vzc2l0YXRpYnVzLCBhbGlxdWlkIGRpc3RpbmN0aW8gc2ltaWxpcXVlIHZvbHVwdGF0aWJ1cyBkaWN0YSBjb25zZXF1dW50dXIgYW5pbWkuIFF1YWVyYXQgZmFjaWxpcyBxdWlkZW0gdW5kZSBlb3MhIElwc2EuPC9wPlxyXG4gICAgICAgICAgICA8L2RldGFpbHM+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cInRleHRfX2FkZHJlc3NcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDE+QWRkcmVzczwvaDE+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxhZGRyZXNzPlxyXG4gICAgICAgICAgICAgIFdyaXR0ZW4gYnkgPGEgaHJlZj1cIm1haWx0bzp3ZWJtYXN0ZXJAZXhhbXBsZS5jb21cIj5Kb24gRG9lPC9hPi48YnI+XHJcbiAgICAgICAgICAgICAgVmlzaXQgdXMgYXQ6PGJyPlxyXG4gICAgICAgICAgICAgIEV4YW1wbGUuY29tPGJyPlxyXG4gICAgICAgICAgICAgIEJveCA1NjQsIERpc25leWxhbmQ8YnI+XHJcbiAgICAgICAgICAgICAgVVNBXHJcbiAgICAgICAgICAgIDwvYWRkcmVzcz5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9faHJcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SG9yaXpvbnRhbCBydWxlczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGhyPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fdGFibGVzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPlRhYnVsYXIgZGF0YTwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDx0YWJsZT5cclxuICAgICAgICAgICAgICA8Y2FwdGlvbj5UYWJsZSBDYXB0aW9uPC9jYXB0aW9uPlxyXG4gICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgMTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBIZWFkaW5nIDI8L3RoPlxyXG4gICAgICAgICAgICAgICAgICA8dGg+VGFibGUgSGVhZGluZyAzPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEhlYWRpbmcgNDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgIDx0aD5UYWJsZSBIZWFkaW5nIDU8L3RoPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgIDx0Zm9vdD5cclxuICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciAxPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciAyPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciAzPC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciA0PC90aD5cclxuICAgICAgICAgICAgICAgICAgPHRoPlRhYmxlIEZvb3RlciA1PC90aD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgPC90Zm9vdD5cclxuICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDE8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAyPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDQ8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA1PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDE8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAyPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDQ8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA1PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDE8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAyPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDQ8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA1PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDE8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCAyPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPHRkPlRhYmxlIENlbGwgMzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDx0ZD5UYWJsZSBDZWxsIDQ8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8dGQ+VGFibGUgQ2VsbCA1PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fY29kZVwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5Db2RlPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8cD48c3Ryb25nPktleWJvYXJkIGlucHV0Ojwvc3Ryb25nPiA8a2JkPkNtZDwva2JkPjwvcD5cclxuICAgICAgICAgICAgICA8cD48c3Ryb25nPklubGluZSBjb2RlOjwvc3Ryb25nPiA8Y29kZT4mbHQ7ZGl2Jmd0O2NvZGUmbHQ7L2RpdiZndDs8L2NvZGU+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+U2FtcGxlIG91dHB1dDo8L3N0cm9uZz4gPHNhbXA+VGhpcyBpcyBzYW1wbGUgb3V0cHV0IGZyb20gYSBjb21wdXRlciBwcm9ncmFtLjwvc2FtcD48L3A+XHJcbiAgICAgICAgICAgICAgPGgyPlByZS1mb3JtYXR0ZWQgdGV4dDwvaDI+XHJcbiAgICAgICAgICAgICAgPHByZT5QIFIgRSBGIE8gUiBNIEEgVCBUIEUgRCBUIEUgWCBUXHJcbiAgISBcIiAjICQgJSAmYW1wOyAnICggKSAqICsgLCAtIC4gL1xyXG4gIDAgMSAyIDMgNCA1IDYgNyA4IDkgOiA7ICZsdDsgPSAmZ3Q7ID9cclxuICBAIEEgQiBDIEQgRSBGIEcgSCBJIEogSyBMIE0gTiBPXHJcbiAgUCBRIFIgUyBUIFUgViBXIFggWSBaIFsgXFxcXCBdIF4gX1xyXG4gIFxcYCBhIGIgYyBkIGUgZiBnIGggaSBqIGsgbCBtIG4gb1xyXG4gIHAgcSByIHMgdCB1IHYgdyB4IHkgeiB7IHwgfSB+IDwvcHJlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9faW5saW5lXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPklubGluZSBlbGVtZW50czwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiMhXCI+VGhpcyBpcyBhIHRleHQgbGluazwvYT4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+U3Ryb25nIGlzIHVzZWQgdG8gaW5kaWNhdGUgc3Ryb25nIGltcG9ydGFuY2UuPC9zdHJvbmc+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxlbT5UaGlzIHRleHQgaGFzIGFkZGVkIGVtcGhhc2lzLjwvZW0+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZSA8Yj5iIGVsZW1lbnQ8L2I+IGlzIHN0eWxpc3RpY2FsbHkgZGlmZmVyZW50IHRleHQgZnJvbSBub3JtYWwgdGV4dCwgd2l0aG91dCBhbnkgc3BlY2lhbCBpbXBvcnRhbmNlLjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPGk+aSBlbGVtZW50PC9pPiBpcyB0ZXh0IHRoYXQgaXMgb2Zmc2V0IGZyb20gdGhlIG5vcm1hbCB0ZXh0LjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPHU+dSBlbGVtZW50PC91PiBpcyB0ZXh0IHdpdGggYW4gdW5hcnRpY3VsYXRlZCwgdGhvdWdoIGV4cGxpY2l0bHkgcmVuZGVyZWQsIG5vbi10ZXh0dWFsIGFubm90YXRpb24uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxkZWw+VGhpcyB0ZXh0IGlzIGRlbGV0ZWQ8L2RlbD4gYW5kIDxpbnM+VGhpcyB0ZXh0IGlzIGluc2VydGVkPC9pbnM+LjwvcD5cclxuICAgICAgICAgICAgICA8cD48cz5UaGlzIHRleHQgaGFzIGEgc3RyaWtldGhyb3VnaDwvcz4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlN1cGVyc2NyaXB0PHN1cD7Crjwvc3VwPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+U3Vic2NyaXB0IGZvciB0aGluZ3MgbGlrZSBIPHN1Yj4yPC9zdWI+Ty48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHNtYWxsPlRoaXMgc21hbGwgdGV4dCBpcyBzbWFsbCBmb3IgZmluZSBwcmludCwgZXRjLjwvc21hbGw+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPkFiYnJldmlhdGlvbjogPGFiYnIgdGl0bGU9XCJIeXBlclRleHQgTWFya3VwIExhbmd1YWdlXCI+SFRNTDwvYWJicj48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHEgY2l0ZT1cImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvSFRNTC9FbGVtZW50L3FcIj5UaGlzIHRleHQgaXMgYSBzaG9ydCBpbmxpbmUgcXVvdGF0aW9uLjwvcT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+PGNpdGU+VGhpcyBpcyBhIGNpdGF0aW9uLjwvY2l0ZT48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDxkZm4+ZGZuIGVsZW1lbnQ8L2Rmbj4gaW5kaWNhdGVzIGEgZGVmaW5pdGlvbi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIDxtYXJrPm1hcmsgZWxlbWVudDwvbWFyaz4gaW5kaWNhdGVzIGEgaGlnaGxpZ2h0LjwvcD5cclxuICAgICAgICAgICAgICA8cD5UaGUgPHZhcj52YXJpYWJsZSBlbGVtZW50PC92YXI+LCBzdWNoIGFzIDx2YXI+eDwvdmFyPiA9IDx2YXI+eTwvdmFyPi48L3A+XHJcbiAgICAgICAgICAgICAgPHA+VGhlIHRpbWUgZWxlbWVudDogPHRpbWUgZGF0ZXRpbWU9XCIyMDEzLTA0LTA2VDEyOjMyKzAwOjAwXCI+MiB3ZWVrcyBhZ288L3RpbWU+PC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwidGV4dF9fY29tbWVudHNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SFRNTCBDb21tZW50czwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPHA+VGhlcmUgaXMgY29tbWVudCBoZXJlOiA8IS0tVGhpcyBjb21tZW50IHNob3VsZCBub3QgYmUgZGlzcGxheWVkLS0+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPlRoZXJlIGlzIGEgY29tbWVudCBzcGFubmluZyBtdWx0aXBsZSB0YWdzIGFuZCBsaW5lcyBiZWxvdyBoZXJlLjwvcD5cclxuICAgICAgICAgICAgICA8IS0tPHA+PGEgaHJlZj1cIiMhXCI+VGhpcyBpcyBhIHRleHQgbGluay4gQnV0IGl0IHNob3VsZCBub3QgYmUgZGlzcGxheWVkIGluIGEgY29tbWVudDwvYT4uPC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxzdHJvbmc+U3Ryb25nIGlzIHVzZWQgdG8gaW5kaWNhdGUgc3Ryb25nIGltcG9ydGFuY2UuIEJ1dCwgaXQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQgaW4gYSBjb21tZW50PC9zdHJvbmc+PC9wPlxyXG4gICAgICAgICAgICAgIDxwPjxlbT5UaGlzIHRleHQgaGFzIGFkZGVkIGVtcGhhc2lzLiBCdXQsIGl0IHNob3VsZCBub3QgYmUgZGlzcGxheWVkIGluIGEgY29tbWVudDwvZW0+PC9wPi0tPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJlbWJlZGRlZFwiPlxyXG4gICAgICAgICAgPGhlYWRlcj48aDI+RW1iZWRkZWQgY29udGVudDwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19pbWFnZXNcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SW1hZ2VzPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDM+UGxhaW4gPGNvZGU+Jmx0O2ltZyZndDs8L2NvZGU+IGVsZW1lbnQ8L2gzPlxyXG4gICAgICAgICAgICAgIDxwPjxpbWcgc3JjPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNDgwLzQ4MFwiIGFsdD1cIlBob3RvIG9mIGEga2l0dGVuXCI+PC9wPlxyXG4gICAgICAgICAgICAgIDxoMz48Y29kZT4mbHQ7ZmlndXJlJmd0OzwvY29kZT4gZWxlbWVudCB3aXRoIDxjb2RlPiZsdDtpbWcmZ3Q7PC9jb2RlPiBlbGVtZW50PC9oMz5cclxuICAgICAgICAgICAgICA8ZmlndXJlPjxpbWcgc3JjPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNDIwLzQyMFwiIGFsdD1cIlBob3RvIG9mIGEga2l0dGVuXCI+PC9maWd1cmU+XHJcbiAgICAgICAgICAgICAgPGgzPjxjb2RlPiZsdDtmaWd1cmUmZ3Q7PC9jb2RlPiBlbGVtZW50IHdpdGggPGNvZGU+Jmx0O2ltZyZndDs8L2NvZGU+IGFuZCA8Y29kZT4mbHQ7ZmlnY2FwdGlvbiZndDs8L2NvZGU+IGVsZW1lbnRzPC9oMz5cclxuICAgICAgICAgICAgICA8ZmlndXJlPlxyXG4gICAgICAgICAgICAgICAgPGltZyBzcmM9XCJodHRwczovL3BsYWNla2l0dGVuLmNvbS80MjAvNDIwXCIgYWx0PVwiUGhvdG8gb2YgYSBraXR0ZW5cIj5cclxuICAgICAgICAgICAgICAgIDxmaWdjYXB0aW9uPkhlcmUgaXMgYSBjYXB0aW9uIGZvciB0aGlzIGltYWdlLjwvZmlnY2FwdGlvbj5cclxuICAgICAgICAgICAgICA8L2ZpZ3VyZT5cclxuICAgICAgICAgICAgICA8aDM+PGNvZGU+Jmx0O2ZpZ3VyZSZndDs8L2NvZGU+IGVsZW1lbnQgd2l0aCBhIDxjb2RlPiZsdDtwaWN0dXJlJmd0OzwvY29kZT4gZWxlbWVudDwvaDM+XHJcbiAgICAgICAgICAgICAgPGZpZ3VyZT5cclxuICAgICAgICAgICAgICAgIDxwaWN0dXJlPlxyXG4gICAgICAgICAgICAgICAgICA8c291cmNlIHNyY3NldD1cImh0dHBzOi8vcGxhY2VraXR0ZW4uY29tLzgwMC84MDBcIlxyXG4gICAgICAgICAgICAgICAgICAgIG1lZGlhPVwiKG1pbi13aWR0aDogODAwcHgpXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vNDIwLzQyMFwiIGFsdD1cIlBob3RvIG9mIGEga2l0dGVuXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvcGljdHVyZT5cclxuICAgICAgICAgICAgICA8L2ZpZ3VyZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19iZ2ltYWdlc1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5CYWNrZ3JvdW5kIGltYWdlczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOnVybCgnaHR0cHM6Ly9wbGFjZWtpdHRlbi5jb20vMzAwLzMwMCcpOyB3aWR0aDozMDBweDsgaGVpZ2h0OiAzMDBweDtcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2F1ZGlvXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkF1ZGlvPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48YXVkaW8gY29udHJvbHM9XCJcIj5hdWRpbzwvYXVkaW8+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX192aWRlb1wiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5WaWRlbzwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PHZpZGVvIGNvbnRyb2xzPVwiXCI+dmlkZW88L3ZpZGVvPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fY2FudmFzXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPkNhbnZhczwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PGNhbnZhcz5jYW52YXM8L2NhbnZhcz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX21ldGVyXCI+XHJcbiAgICAgICAgICAgIDxoZWFkZXI+PGgyPk1ldGVyPC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48bWV0ZXIgdmFsdWU9XCIyXCIgbWluPVwiMFwiIG1heD1cIjEwXCI+MiBvdXQgb2YgMTA8L21ldGVyPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fcHJvZ3Jlc3NcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+UHJvZ3Jlc3M8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2Pjxwcm9ncmVzcz5wcm9ncmVzczwvcHJvZ3Jlc3M+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19zdmdcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+SW5saW5lIFNWRzwvaDI+PC9oZWFkZXI+XHJcbiAgICAgICAgICAgIDxkaXY+PHN2ZyB3aWR0aD1cIjEwMHB4XCIgaGVpZ2h0PVwiMTAwcHhcIj48Y2lyY2xlIGN4PVwiMTAwXCIgY3k9XCIxMDBcIiByPVwiMTAwXCIgZmlsbD1cIiMxZmEzZWNcIj48L2NpcmNsZT48L3N2Zz48L2Rpdj5cclxuICAgICAgICAgICAgPGZvb3Rlcj48cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD48L2Zvb3Rlcj5cclxuICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGlkPVwiZW1iZWRkZWRfX2lmcmFtZVwiPlxyXG4gICAgICAgICAgICA8aGVhZGVyPjxoMj5JRnJhbWU8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxpZnJhbWUgc3JjPVwiaW5kZXguaHRtbFwiIGhlaWdodD1cIjMwMFwiPjwvaWZyYW1lPjwvZGl2PlxyXG4gICAgICAgICAgICA8Zm9vdGVyPjxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPjwvZm9vdGVyPlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgaWQ9XCJlbWJlZGRlZF9fZW1iZWRcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+RW1iZWQ8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgICA8ZGl2PjxlbWJlZCBzcmM9XCJpbmRleC5odG1sXCIgaGVpZ2h0PVwiMzAwXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBpZD1cImVtYmVkZGVkX19vYmplY3RcIj5cclxuICAgICAgICAgICAgPGhlYWRlcj48aDI+T2JqZWN0PC9oMj48L2hlYWRlcj5cclxuICAgICAgICAgICAgPGRpdj48b2JqZWN0IGRhdGE9XCJpbmRleC5odG1sXCIgaGVpZ2h0PVwiMzAwXCI+PC9vYmplY3Q+PC9kaXY+XHJcbiAgICAgICAgICAgIDxmb290ZXI+PHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+PC9mb290ZXI+XHJcbiAgICAgICAgICA8L2FydGljbGU+XHJcbiAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgIDxzZWN0aW9uIGlkPVwiZm9ybXNcIj5cclxuICAgICAgICAgIDxoZWFkZXI+PGgyPkZvcm0gZWxlbWVudHM8L2gyPjwvaGVhZGVyPlxyXG4gICAgICAgICAgPGZvcm0+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19pbnB1dFwiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+SW5wdXQgZmllbGRzPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3RleHRcIj5UZXh0IElucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X190ZXh0XCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIlRleHQgSW5wdXRcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3Bhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3Bhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJUeXBlIHlvdXIgUGFzc3dvcmRcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX3dlYmFkZHJlc3NcIj5XZWIgQWRkcmVzczwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fd2ViYWRkcmVzc1wiIHR5cGU9XCJ1cmxcIiBwbGFjZWhvbGRlcj1cImh0dHBzOi8veW91cnNpdGUuY29tXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X19lbWFpbGFkZHJlc3NcIj5FbWFpbCBBZGRyZXNzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19lbWFpbGFkZHJlc3NcIiB0eXBlPVwiZW1haWxcIiBwbGFjZWhvbGRlcj1cIm5hbWVAZW1haWwuY29tXCI+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImlucHV0X19waG9uZVwiPlBob25lIE51bWJlcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJpbnB1dF9fcGhvbmVcIiB0eXBlPVwidGVsXCIgcGxhY2Vob2xkZXI9XCIoOTk5KSA5OTktOTk5OVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fc2VhcmNoXCI+U2VhcmNoPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19zZWFyY2hcIiB0eXBlPVwic2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBTZWFyY2ggVGVybVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpbnB1dF9fdGV4dDJcIj5OdW1iZXIgSW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiaW5wdXRfX3RleHQyXCIgdHlwZT1cIm51bWJlclwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgYSBOdW1iZXJcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5wdXRfX2ZpbGVcIj5GaWxlIElucHV0PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImlucHV0X19maWxlXCIgdHlwZT1cImZpbGVcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fc2VsZWN0XCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5TZWxlY3QgbWVudXM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJzZWxlY3RcIj5TZWxlY3Q8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInNlbGVjdFwiPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJPcHRpb24gR3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBPbmU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBUd288L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPk9wdGlvbiBUaHJlZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICA8L29wdGdyb3VwPlxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInNlbGVjdF9tdWx0aXBsZVwiPlNlbGVjdCAobXVsdGlwbGUpPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJzZWxlY3RfbXVsdGlwbGVcIiBtdWx0aXBsZT1cIm11bHRpcGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRncm91cCBsYWJlbD1cIk9wdGlvbiBHcm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIE9uZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIFR3bzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+T3B0aW9uIFRocmVlPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDwvb3B0Z3JvdXA+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fY2hlY2tib3hcIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPkNoZWNrYm94ZXM8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cImNoZWNrYm94MVwiPjxpbnB1dCBpZD1cImNoZWNrYm94MVwiIG5hbWU9XCJjaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9XCJjaGVja2VkXCI+IENob2ljZSBBPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJjaGVja2JveDJcIj48aW5wdXQgaWQ9XCJjaGVja2JveDJcIiBuYW1lPVwiY2hlY2tib3hcIiB0eXBlPVwiY2hlY2tib3hcIj4gQ2hvaWNlIEI8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8bGk+PGxhYmVsIGZvcj1cImNoZWNrYm94M1wiPjxpbnB1dCBpZD1cImNoZWNrYm94M1wiIG5hbWU9XCJjaGVja2JveFwiIHR5cGU9XCJjaGVja2JveFwiPiBDaG9pY2UgQzwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGlkPVwiZm9ybXNfX3JhZGlvXCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5SYWRpbyBidXR0b25zPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJyYWRpbzFcIj48aW5wdXQgaWQ9XCJyYWRpbzFcIiBuYW1lPVwicmFkaW9cIiB0eXBlPVwicmFkaW9cIiBjaGVja2VkPVwiY2hlY2tlZFwiPiBPcHRpb24gMTwvbGFiZWw+PC9saT5cclxuICAgICAgICAgICAgICAgIDxsaT48bGFiZWwgZm9yPVwicmFkaW8yXCI+PGlucHV0IGlkPVwicmFkaW8yXCIgbmFtZT1cInJhZGlvXCIgdHlwZT1cInJhZGlvXCI+IE9wdGlvbiAyPC9sYWJlbD48L2xpPlxyXG4gICAgICAgICAgICAgICAgPGxpPjxsYWJlbCBmb3I9XCJyYWRpbzNcIj48aW5wdXQgaWQ9XCJyYWRpbzNcIiBuYW1lPVwicmFkaW9cIiB0eXBlPVwicmFkaW9cIj4gT3B0aW9uIDM8L2xhYmVsPjwvbGk+XHJcbiAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX190ZXh0YXJlYXNcIj5cclxuICAgICAgICAgICAgICA8bGVnZW5kPlRleHRhcmVhczwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInRleHRhcmVhXCI+VGV4dGFyZWE8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwidGV4dGFyZWFcIiByb3dzPVwiOFwiIGNvbHM9XCI0OFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgeW91ciBtZXNzYWdlIGhlcmVcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiN0b3BcIj5bVG9wXTwvYT48L3A+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBpZD1cImZvcm1zX19odG1sNVwiPlxyXG4gICAgICAgICAgICAgIDxsZWdlbmQ+SFRNTDUgaW5wdXRzPC9sZWdlbmQ+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWNcIj5Db2xvciBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNvbG9yXCIgaWQ9XCJpY1wiIHZhbHVlPVwiIzAwMDAwMFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpblwiPk51bWJlciBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGlkPVwiaW5cIiBtaW49XCIwXCIgbWF4PVwiMTBcIiB2YWx1ZT1cIjVcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaXJcIj5SYW5nZSBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgaWQ9XCJpclwiIHZhbHVlPVwiMTBcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWRkXCI+RGF0ZSBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBpZD1cImlkZFwiIHZhbHVlPVwiMTk3MC0wMS0wMVwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZG1cIj5Nb250aCBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIm1vbnRoXCIgaWQ9XCJpZG1cIiB2YWx1ZT1cIjE5NzAtMDFcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWR3XCI+V2VlayBpbnB1dDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cIndlZWtcIiBpZD1cImlkd1wiIHZhbHVlPVwiMTk3MC1XMDFcIj5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiaWR0XCI+RGF0ZXRpbWUgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRldGltZVwiIGlkPVwiaWR0XCIgdmFsdWU9XCIxOTcwLTAxLTAxVDAwOjAwOjAwWlwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZHRsXCI+RGF0ZXRpbWUtbG9jYWwgaW5wdXQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIGlkPVwiaWR0bFwiIHZhbHVlPVwiMTk3MC0wMS0wMVQwMDowMFwiPlxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJpZGxcIj5EYXRhbGlzdDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImlkbFwiIGxpc3Q9XCJleGFtcGxlLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgIDxkYXRhbGlzdCBpZD1cImV4YW1wbGUtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRXhhbXBsZSAjMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJFeGFtcGxlICMyXCIgLz5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkV4YW1wbGUgIzNcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kYXRhbGlzdD5cclxuICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjdG9wXCI+W1RvcF08L2E+PC9wPlxyXG4gICAgICAgICAgICA8ZmllbGRzZXQgaWQ9XCJmb3Jtc19fYWN0aW9uXCI+XHJcbiAgICAgICAgICAgICAgPGxlZ2VuZD5BY3Rpb24gYnV0dG9uczwvbGVnZW5kPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIjxpbnB1dCB0eXBlPXN1Ym1pdD5cIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI8aW5wdXQgdHlwZT1idXR0b24+XCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJlc2V0XCIgdmFsdWU9XCI8aW5wdXQgdHlwZT1yZXNldD5cIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCI8aW5wdXQgZGlzYWJsZWQ+XCIgZGlzYWJsZWQ+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+Jmx0O2J1dHRvbiB0eXBlPXN1Ym1pdCZndDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPiZsdDtidXR0b24gdHlwZT1idXR0b24mZ3Q7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJyZXNldFwiPiZsdDtidXR0b24gdHlwZT1yZXNldCZndDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPiZsdDtidXR0b24gZGlzYWJsZWQmZ3Q7PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8cD48YSBocmVmPVwiI3RvcFwiPltUb3BdPC9hPjwvcD5cclxuICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgIDwvbWFpbj5cclxuICAgICAgPGZvb3Rlcj5cclxuICAgICAgICA8cD5NYWRlIGJ5IDxhIGhyZWY9XCJodHRwOi8vdHdpdHRlci5jb20vY2JyYWNjb1wiPkBjYnJhY2NvPC9hPi4gQ29kZSBvbiA8YSBocmVmPVwiaHR0cDovL2dpdGh1Yi5jb20vY2JyYWNjby9odG1sNS10ZXN0LXBhZ2VcIj5HaXRIdWI8L2E+LjwvcD5cclxuICAgICAgPC9mb290ZXI+XHJcbiAgICA8L2Rpdj5cclxuICA8L2JvZHk+XHJcbjwvaHRtbD5cclxuYDtcclxuIiwiZXhwb3J0IGNsYXNzIEthc3BlckVycm9yIHtcclxuICBwdWJsaWMgdmFsdWU6IHN0cmluZztcclxuICBwdWJsaWMgbGluZTogbnVtYmVyO1xyXG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2w6IG51bWJlcikge1xyXG4gICAgdGhpcy5saW5lID0gbGluZTtcclxuICAgIHRoaXMuY29sID0gY29sO1xyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBEZW1vU291cmNlIH0gZnJvbSBcIi4vZGVtb1wiO1xyXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9wYXJzZXJcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKHNvdXJjZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgY29uc3Qgbm9kZXMgPSBwYXJzZXIucGFyc2Uoc291cmNlKTtcclxuICBpZiAocGFyc2VyLmVycm9ycy5sZW5ndGgpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJzZXIuZXJyb3JzKTtcclxuICB9XHJcbiAgY29uc3QgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkobm9kZXMpO1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShzb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xyXG4gIGNvbnN0IG5vZGVzID0gcGFyc2VyLnBhcnNlKHNvdXJjZSk7XHJcbiAgaWYgKHBhcnNlci5lcnJvcnMubGVuZ3RoKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGFyc2VyLmVycm9ycyk7XHJcbiAgfVxyXG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShub2Rlcyk7XHJcbn1cclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgKHdpbmRvdyBhcyBhbnkpLmthc3BlciA9IHtcclxuICAgIGRlbW9Tb3VyY2VDb2RlOiBEZW1vU291cmNlLFxyXG4gICAgZXhlY3V0ZSxcclxuICAgIHBhcnNlLFxyXG4gIH07XHJcbn0gZWxzZSB7XHJcbiAgZXhwb3J0cy5rYXNwZXIgPSB7XHJcbiAgICBleGVjdXRlLFxyXG4gICAgcGFyc2UsXHJcbiAgfTtcclxufVxyXG4iLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgTm9kZSB7XG4gICAgcHVibGljIGxpbmU6IG51bWJlcjtcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBhYnN0cmFjdCBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVWaXNpdG9yPFI+IHtcbiAgICB2aXNpdEVsZW1lbnROb2RlKG5vZGU6IEVsZW1lbnQpOiBSO1xuICAgIHZpc2l0QXR0cmlidXRlTm9kZShub2RlOiBBdHRyaWJ1dGUpOiBSO1xuICAgIHZpc2l0VGV4dE5vZGUobm9kZTogVGV4dCk6IFI7XG4gICAgdmlzaXRDb21tZW50Tm9kZShub2RlOiBDb21tZW50KTogUjtcbiAgICB2aXNpdERvY3R5cGVOb2RlKG5vZGU6IERvY3R5cGUpOiBSO1xufVxuXG5leHBvcnQgY2xhc3MgRWxlbWVudCBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGF0dHJpYnV0ZXM6IE5vZGVbXTtcbiAgICBwdWJsaWMgY2hpbGRyZW46IE5vZGVbXTtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgYXR0cmlidXRlczogTm9kZVtdLCBjaGlsZHJlbjogTm9kZVtdLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdlbGVtZW50JztcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50Tm9kZSh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdOb2RlLkVsZW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2F0dHJpYnV0ZSc7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlTm9kZSh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdOb2RlLkF0dHJpYnV0ZSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIE5vZGUge1xuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZywgbGluZTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGUgPSAndGV4dCc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWNjZXB0PFI+KHZpc2l0b3I6IE5vZGVWaXNpdG9yPFI+KTogUiB7XG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dE5vZGUodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAnTm9kZS5UZXh0JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGV4dGVuZHMgTm9kZSB7XG4gICAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nLCBsaW5lOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZSA9ICdjb21tZW50JztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQ8Uj4odmlzaXRvcjogTm9kZVZpc2l0b3I8Uj4pOiBSIHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDb21tZW50Tm9kZSh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdOb2RlLkNvbW1lbnQnO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERvY3R5cGUgZXh0ZW5kcyBOb2RlIHtcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcsIGxpbmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlID0gJ2RvY3R5cGUnO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgfVxuXG4gICAgcHVibGljIGFjY2VwdDxSPih2aXNpdG9yOiBOb2RlVmlzaXRvcjxSPik6IFIge1xuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdERvY3R5cGVOb2RlKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ05vZGUuRG9jdHlwZSc7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBLYXNwZXJFcnJvciB9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCAqIGFzIE5vZGUgZnJvbSBcIi4vbm9kZXNcIjtcclxuaW1wb3J0IHsgU2VsZkNsb3NpbmdUYWdzLCBXaGl0ZVNwYWNlcyB9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcclxuICBwdWJsaWMgY3VycmVudDogbnVtYmVyO1xyXG4gIHB1YmxpYyBsaW5lOiBudW1iZXI7XHJcbiAgcHVibGljIGNvbDogbnVtYmVyO1xyXG4gIHB1YmxpYyBzb3VyY2U6IHN0cmluZztcclxuICBwdWJsaWMgZXJyb3JzOiBzdHJpbmdbXTtcclxuICBwdWJsaWMgbm9kZXM6IE5vZGUuTm9kZVtdO1xyXG5cclxuICBwdWJsaWMgcGFyc2Uoc291cmNlOiBzdHJpbmcpOiBOb2RlLk5vZGVbXSB7XHJcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xyXG4gICAgdGhpcy5saW5lID0gMTtcclxuICAgIHRoaXMuY29sID0gMTtcclxuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgIHRoaXMubm9kZXMgPSBbXTtcclxuXHJcbiAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlKCk7XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEthc3BlckVycm9yKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGBQYXJzZSBFcnJvciAoJHtlLmxpbmV9OiR7ZS5jb2x9KSA9PiAke2UudmFsdWV9YCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goYCR7ZX1gKTtcclxuICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAxMCkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKFwiUGFyc2UgRXJyb3IgbGltaXQgZXhjZWVkZWRcIik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5zb3VyY2UgPSBcIlwiO1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZXM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1hdGNoKC4uLmNoYXJzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xyXG4gICAgZm9yIChjb25zdCBjaGFyIG9mIGNoYXJzKSB7XHJcbiAgICAgIGlmICh0aGlzLmNoZWNrKGNoYXIpKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ICs9IGNoYXIubGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkdmFuY2UoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZW9mKCkpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2soXCJcXG5cIikpIHtcclxuICAgICAgICB0aGlzLmxpbmUgKz0gMTtcclxuICAgICAgICB0aGlzLmNvbCA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb2wgKz0gMTtcclxuICAgICAgdGhpcy5jdXJyZW50Kys7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBlZWsoLi4uY2hhcnM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XHJcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgY2hhcnMpIHtcclxuICAgICAgaWYgKHRoaXMuY2hlY2soY2hhcikpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVjayhjaGFyOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZSh0aGlzLmN1cnJlbnQsIHRoaXMuY3VycmVudCArIGNoYXIubGVuZ3RoKSA9PT0gY2hhcjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZW9mKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudCA+IHRoaXMuc291cmNlLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXJyb3IobWVzc2FnZTogc3RyaW5nKTogYW55IHtcclxuICAgIHRocm93IG5ldyBLYXNwZXJFcnJvcihtZXNzYWdlLCB0aGlzLmxpbmUsIHRoaXMuY29sKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbm9kZSgpOiBOb2RlLk5vZGUge1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5jb21tZW50KCk7XHJcbiAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgIHJldHVybiBub2RlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb21tZW50KCk6IE5vZGUuTm9kZSB7XHJcbiAgICBpZiAodGhpcy5tYXRjaChcIjwhLS1cIikpIHtcclxuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmN1cnJlbnQ7XHJcbiAgICAgIGRvIHtcclxuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgICAgfSB3aGlsZSAoIXRoaXMubWF0Y2goYC0tPmApKTtcclxuICAgICAgY29uc3QgY29tbWVudCA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAzKTtcclxuICAgICAgcmV0dXJuIG5ldyBOb2RlLkNvbW1lbnQoY29tbWVudCwgdGhpcy5saW5lKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmRvY3R5cGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZG9jdHlwZSgpOiBOb2RlLk5vZGUge1xyXG4gICAgaWYgKHRoaXMubWF0Y2goXCI8IWRvY3R5cGVcIikgfHwgdGhpcy5tYXRjaChcIjwhRE9DVFlQRVwiKSkge1xyXG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgICAgZG8ge1xyXG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICB9IHdoaWxlICghdGhpcy5tYXRjaChgPmApKTtcclxuICAgICAgY29uc3QgZG9jdHlwZSA9IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKS50cmltKCk7XHJcbiAgICAgIHJldHVybiBuZXcgTm9kZS5Eb2N0eXBlKGRvY3R5cGUsIHRoaXMubGluZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGVsZW1lbnQoKTogTm9kZS5Ob2RlIHtcclxuICAgIGlmICh0aGlzLm1hdGNoKFwiPC9cIikpIHtcclxuICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgY2xvc2luZyB0YWdcIik7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMubWF0Y2goXCI8XCIpKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuYW1lID0gdGhpcy5pZGVudGlmaWVyKFwiL1wiLCBcIj5cIik7XHJcbiAgICBpZiAoIW5hbWUpIHtcclxuICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkIGEgdGFnIG5hbWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcygpO1xyXG5cclxuICAgIGlmIChcclxuICAgICAgdGhpcy5tYXRjaChcIi8+XCIpIHx8XHJcbiAgICAgIChTZWxmQ2xvc2luZ1RhZ3MuaW5jbHVkZXMobmFtZSkgJiYgdGhpcy5tYXRjaChcIj5cIikpXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIG5ldyBOb2RlLkVsZW1lbnQobmFtZSwgYXR0cmlidXRlcywgW10sIHRoaXMubGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xyXG4gICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgY2xvc2luZyB0YWdcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNoaWxkcmVuOiBOb2RlLk5vZGVbXSA9IFtdO1xyXG4gICAgaWYgKCF0aGlzLnBlZWsoXCI8L1wiKSkge1xyXG4gICAgICBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4obmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jbG9zZShuYW1lKTtcclxuICAgIHJldHVybiBuZXcgTm9kZS5FbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuLCB0aGlzLmxpbmUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbG9zZShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5tYXRjaChcIjwvXCIpKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5tYXRjaChgJHtuYW1lfWApKSB7XHJcbiAgICAgIHRoaXMuZXJyb3IoYEV4cGVjdGVkIDwvJHtuYW1lfT5gKTtcclxuICAgIH1cclxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgaWYgKCF0aGlzLm1hdGNoKFwiPlwiKSkge1xyXG4gICAgICB0aGlzLmVycm9yKGBFeHBlY3RlZCA8LyR7bmFtZX0+YCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoaWxkcmVuKHBhcmVudDogc3RyaW5nKTogTm9kZS5Ob2RlW10ge1xyXG4gICAgY29uc3QgY2hpbGRyZW46IE5vZGUuTm9kZVtdID0gW107XHJcbiAgICBkbyB7XHJcbiAgICAgIGlmICh0aGlzLmVvZigpKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvcihgRXhwZWN0ZWQgPC8ke3BhcmVudH0+YCk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZSgpO1xyXG4gICAgICBpZiAobm9kZSA9PT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XHJcbiAgICB9IHdoaWxlICghdGhpcy5wZWVrKGA8L2ApKTtcclxuXHJcbiAgICByZXR1cm4gY2hpbGRyZW47XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGF0dHJpYnV0ZXMoKTogTm9kZS5BdHRyaWJ1dGVbXSB7XHJcbiAgICBjb25zdCBhdHRyaWJ1dGVzOiBOb2RlLkF0dHJpYnV0ZVtdID0gW107XHJcbiAgICB3aGlsZSAoIXRoaXMucGVlayhcIj5cIiwgXCIvPlwiKSAmJiAhdGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgICAgY29uc3QgbmFtZSA9IHRoaXMuaWRlbnRpZmllcihcIj1cIiwgXCI+XCIsIFwiLz5cIik7XHJcbiAgICAgIGlmICghbmFtZSkge1xyXG4gICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICBsZXQgdmFsdWUgPSBcIlwiO1xyXG4gICAgICBpZiAodGhpcy5tYXRjaChcIj1cIikpIHtcclxuICAgICAgICB0aGlzLndoaXRlc3BhY2UoKTtcclxuICAgICAgICBpZiAodGhpcy5tYXRjaChcIidcIikpIHtcclxuICAgICAgICAgIHZhbHVlID0gdGhpcy5zdHJpbmcoXCInXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCgnXCInKSkge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnN0cmluZygnXCInKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmlkZW50aWZpZXIoXCI+XCIsIFwiLz5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgICBhdHRyaWJ1dGVzLnB1c2gobmV3IE5vZGUuQXR0cmlidXRlKG5hbWUsIHZhbHVlLCB0aGlzLmxpbmUpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0ZXh0KCk6IE5vZGUuTm9kZSB7XHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgIHdoaWxlICghdGhpcy5wZWVrKFwiPFwiKSAmJiAhdGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRleHQgPSB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5jdXJyZW50KS50cmltKCk7XHJcbiAgICBpZiAoIXRleHQpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IE5vZGUuVGV4dCh0ZXh0LCB0aGlzLmxpbmUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB3aGl0ZXNwYWNlKCk6IG51bWJlciB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgd2hpbGUgKHRoaXMucGVlayguLi5XaGl0ZVNwYWNlcykgJiYgIXRoaXMuZW9mKCkpIHtcclxuICAgICAgY291bnQgKz0gMTtcclxuICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY291bnQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlkZW50aWZpZXIoLi4uY2xvc2luZzogc3RyaW5nW10pOiBzdHJpbmcge1xyXG4gICAgdGhpcy53aGl0ZXNwYWNlKCk7XHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuY3VycmVudDtcclxuICAgIHdoaWxlICghdGhpcy5wZWVrKC4uLldoaXRlU3BhY2VzLCAuLi5jbG9zaW5nKSAmJiAhdGhpcy5lb2YoKSkge1xyXG4gICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGVuZCA9IHRoaXMuY3VycmVudDtcclxuICAgIHRoaXMud2hpdGVzcGFjZSgpO1xyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpLnRyaW0oKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RyaW5nKC4uLmNsb3Npbmc6IHN0cmluZ1tdKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKC4uLmNsb3NpbmcpICYmICF0aGlzLmVvZigpKSB7XHJcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmN1cnJlbnQgLSAxKTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzRGlnaXQoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIGNoYXIgPj0gXCIwXCIgJiYgY2hhciA8PSBcIjlcIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzQWxwaGEoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChjaGFyID49IFwiYVwiICYmIGNoYXIgPD0gXCJ6XCIpIHx8IChjaGFyID49IFwiQVwiICYmIGNoYXIgPD0gXCJaXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNBbHBoYU51bWVyaWMoY2hhcjogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIGlzQWxwaGEoY2hhcikgfHwgaXNEaWdpdChjaGFyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUod29yZDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBXaGl0ZVNwYWNlcyA9IFtcIiBcIiwgXCJcXG5cIiwgXCJcXHRcIiwgXCJcXHJcIl0gYXMgY29uc3Q7XHJcblxyXG5leHBvcnQgY29uc3QgU2VsZkNsb3NpbmdUYWdzID0gW1xyXG4gIFwiYXJlYVwiLFxyXG4gIFwiYmFzZVwiLFxyXG4gIFwiYnJcIixcclxuICBcImNvbFwiLFxyXG4gIFwiZW1iZWRcIixcclxuICBcImhyXCIsXHJcbiAgXCJpbWdcIixcclxuICBcImlucHV0XCIsXHJcbiAgXCJsaW5rXCIsXHJcbiAgXCJtZXRhXCIsXHJcbiAgXCJwYXJhbVwiLFxyXG4gIFwic291cmNlXCIsXHJcbiAgXCJ0cmFja1wiLFxyXG4gIFwid2JyXCIsXHJcbl07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=