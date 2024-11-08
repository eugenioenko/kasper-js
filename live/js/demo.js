const DemoSourceCode = String.raw`
<!------------------------------------------------------------------------------

.-. .-')   ('-.     .-')    _ (.-.   ('-. _  .-')                  .-')
\  ( OO ) ( OO ).-.( OO ). ( (OO  )_(  OO( \( -O )                ( OO ).
,--. ,--. / . --. (_)---\__..     (,------,------.            ,--(_)---\_)
|  .'   / | \-.  \/    _ (__...--''|  .---|   /.. '       .-')| ,/    _ |
|      /.-'-'  |  \  :. ..|  /  | ||  |   |  /  | |      ( OO |(_\  :. ..
|     ' _\| |_.'  |'...''.|  |_.' (|  '--.|  |_.' |      | .-'|  |'...''.)
|  .   \  |  .-.  .-._)   |  .___.'|  .--'|  .  '.'      ,--. |  .-._)   \
|  |\   \ |  | |  \       |  |     |  .---|  |\  \       |  '-'  \       /
.--' '--' .--' .--'.-----'.--'     .------.--' '--'       .-----' .-----'


Kasper-JS is a work-in-progress of a JavaScript HTML template parser and renderer
designed to help create and learn core mechanics of modern JavaScript frameworks.

This is a small playground to try available features

More info: https://github.com/eugenioenko/kasper-js
------------------------------------------------------------------------------->


<!-- accessing scope elements -->
<h3>{{person.name}}</h3>
<h4>{{person.profession}}</h4>

<!-- conditional element creation -->
<p @if="person.age > 21">21+ years old</p>
<p @elseif="person.age == 21">21 years old</p>
<p @elseif="person.age < 21">Age is less than 21</p>
<p @else>Age is impossible</p>

<!-- iterating over arrays -->
<h4>Hobbies ({{person.hobbies.length}})</h4>
<ul class="hobbies">
  <li
    @each="hobby of person.hobbies"
    @on:click="alert(person.name + ' ' + 'likes ' + hobby)"
  >
    {{hobby}}
  </li>
</ul>

<!-- event binding -->
<div class="my-4">
  <button
    class="bg-blue-500 rounded px-4 py-2 text-white hover:bg-blue-700"
    @on:click="onClick()"
  >
    CLICK ME
  </button>
</div>

<!-- evaluating code on element creation -->
<div @let="student = {name: person.name, degree: 'Masters'}">
    {{student.name}}
</div>

<!-- foreach loop with objects -->
<span @each="item of Object.entries({a: 1, b: 2, c: 3 })">
  {{item[0]}}:{{item[1]}},
</span>

<!-- while loop -->
<span @let="index = 0">
   <span @while="index < 3">
     {{index = index + 1}},
   </span>
</span>

<!-- void elements -->
<div>
  <void @let="index = 0">
    <void @while="index < 3">
      {{index = index + 1}}
    </void>
  </void>
</div>

<!-- complex expressions -->
{{Math.floor(Math.sqrt(100 + 20 / (10 * (Math.abs(10 -20)) + 4)))}}

<!-- void expression -->
{{void "this won't be shown"}}

<!-- logging / debugging  -->
{{debug "expression"}}
{{void console.log("same as previous just less wordy")}}
`;

const DemoScript = `
var person = {
  name: "John Doe",
  profession: "Composer and Photographer",
  age: 28,
  hobbies: ["Reading", "Music", "Golf"]
}

function onClick() {
  alert("Hello World");
}
`;

const DemoStyle = `
h3 {
  font-size: 72px;
  line-height: 1;
}

h4 {
  font-size: 21px;
  margin-bottom: 8px;
  margin-top: 8px;
}

.hobbies {
  display: flex;
  gap: 10px;
}

.hobbies > li {
  flex: auto;
  text-align: center;
  padding: 5px 10px;
  background-color: #ddd;
  color: #111;
  font-size: 21px;
  border-radius: 5px;
  cursor: pointer;
}
`;
