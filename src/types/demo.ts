export const DemoSource = `
<div id="top" role="document">
  <header>
    <h3>{{person.name}}</h3>
    <h4>{{person.profession}}</h4>
    <p @if="person.age > 21">Age is greater then 21</p>
    <p @if="person.age == 21">Age is equal to 21</p>
    <p @if="person.age < 21">Age is less then 21</p>
  </header>
  <h4>Hobbies ({{person.hobbies.length}}):</h4>
  <ul>
    <li @each="const hobby with index of person.hobbies" class="text-red">
      {{index + 1}}: {{hobby}}
    </li>
  </ul>
  <div>100 + 20 / (10 * (10 -20) + 4) = {{100 + 20 / (10 * (10 -20) + 4)}}</div>
</div>
`;

export const DemoJson = `
{
  "person": {
    "name": "John Doe",
    "profession": "Software Developer",
    "age": 21,
    "hobbies": ["reading", "music", "golf"]
  }
}
`;