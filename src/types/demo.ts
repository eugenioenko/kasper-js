export const DemoSource = `<!-- accessing scope elements -->
<h3>{{person.name}}</h3>
<h4>{{person.profession}}</h4>

<!-- conditional element creation -->
<p @if="person.age > 21">Age is greater than 21</p>
<p @elseif="person.age == 21">Age is equal to 21</p>
<p @elseif="person.age < 21">Age is less than 21</p>
<p @else>Age is impossible</p>

<!-- iterating over arrays -->
<h4>Hobbies ({{person.hobbies.length}}):</h4>
<ul class="list-disc">
  <li @each="const hobby with index of person.hobbies" class="text-red">
    {{index + 1}}: {{hobby}}
  </li>
</ul>

<!-- event binding -->
<div class="my-4">
  <button
    class="bg-blue-500 rounded px-4 py-2 text-white hover:bg-blue-700"
    @on:click="alert('Hello World'); console.log(100 / 2.5 + 15)"
  >
    CLICK ME
  </button>
</div>

<!-- evaluating code on element creation -->
<div @init="student = {name: person.name, degree: 'Masters'}; console.log(student.name)">
    {{student.name}}
</div>

<!-- foreach loop with objects -->
<span @each="const item of Object.entries({a: 1, b: 2, c: 3 })">
  {{item[0]}}:{{item[1]}},
</span>

<!-- while loop -->
<span @init="index = 0">
   <span @while="index < 3">
     {{index = index + 1}},
   </span>
</span>

<!-- void elements -->
<div>
  <kvoid @init="index = 0">
    <kvoid @while="index < 3">
      {{index = index + 1}}
    </kvoid>
  </kvoid>
</div>

<!-- complex expressions -->
{{Math.floor(Math.sqrt(100 + 20 / (10 * (Math.abs(10 -20)) + 4)))}}

<!-- void expression -->
{{void "this won't be shown"}}

<!-- logging / debugging  -->
{{debug "expression"}}
{{void console.log("same as previous just less wordy")}}

`;

export const DemoJson = `{
  "person": {
    "name": "John Doe",
    "profession": "Software Developer",
    "age": 20,
    "hobbies": ["reading", "music", "golf"]
  }
}
`;
