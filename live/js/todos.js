const TODOS = {
  todos: {
    pending: [
      {
        id: 1,
        tags: ["red", "blue", "green"],
        task: "Finish writing the report",
      },
      {
        id: 2,
        tags: ["red"],
        task: "Buy groceries for the week, including fresh vegetables, fruits, dairy products, and pantry essentials.",
      },
      {
        id: 3,
        tags: [],
        task: "Call a licensed plumber to fix the leaky faucet in the kitchen and ensure there are no underlying plumbing issues.",
      },
      {
        id: 4,
        tags: [],
        task: "Schedule a dental appointment for a routine check-up and cleaning to maintain good oral hygiene.",
      },
      {
        id: 5,
        tags: [],
        task: "Renew gym membership",
      },
      {
        id: 6,
        tags: ["green"],
        task: "Research potential vacation destinations for an upcoming holiday, considering factors like budget, activities, and travel restrictions.",
      },
      {
        id: 7,
        tags: [],
        task: "Pay the electricity bill",
      },
      {
        id: 8,
        tags: [],
        task: "Attend the parent-teacher conference.",
      },
      {
        id: 9,
        tags: ["yellow"],
        task: "Organize the closet by sorting clothes, shoes, and accessories, and donating or discarding items no longer needed.",
      },
      {
        id: 31,
        tags: ["yellow", "blue"],
        task: "Prepare an engaging presentation with visual aids and interactive content to effectively communicate key messages and insights.",
      },
      {
        id: 32,
        tags: [],
        task: "Write a comprehensive research paper exploring a relevant topic or problem, conducting literature reviews and data analysis to support arguments and conclusions.",
      },
    ],
    inProgress: [
      {
        id: 33,
        tags: [],
        task: "Build a functional prototype of a product or solution, incorporating user feedback and iterative design to enhance usability and functionality.",
      },
      {
        id: 34,
        tags: [],
        task: "Review and refine the project proposal.",
      },
      {
        id: 35,
        tags: [],
        task: "Create an innovative marketing campaign to promote products or services, leveraging various channels and strategies to reach target audiences effectively.",
      },
      {
        id: 36,
        tags: [],
        task: "Develop a new software feature or functionality",
      },
      {
        id: 37,
        tags: ["blue", "green"],
        task: "Plan and coordinate a company event such as a team-building retreat.",
      },
      {
        id: 38,
        tags: ["blue", "red"],
        task: "Conduct user testing sessions to gather feedback on product usability and performance, identifying areas for improvement and optimization.",
      },
      {
        id: 39,
        tags: [],
        task: "Draft a comprehensive business plan outlining goals, strategies, and financial projections for a new venture or existing business expansion.",
      },
      {
        id: 40,
        tags: [],
        task: "Design the layout and user interface of a website, focusing on aesthetics, functionality, and user experience to create an engaging online presence.",
      },
    ],
    completed: [
      {
        id: 61,
        tags: ["yellow"],
        task: "Submit assignment before the deadline, ensuring quality and accuracy in content and adherence to formatting guidelines.",
      },
      {
        id: 62,
        tags: ["yellow", "green", "blue"],
        task: "Finish reading a book from start to finish, reflecting on key themes, characters, and messages conveyed by the author.",
      },
      {
        id: 63,
        tags: [],
        task: "Complete an online course or certification program.",
      },
      {
        id: 64,
        tags: ["blue"],
        task: "Renew passport ahead of expiration date",
      },
      {
        id: 65,
        tags: [],
        task: "Clean out email inbox by organizing messages into folders.",
      },
    ],
    canceled: [
      {
        id: 71,
        tags: ["blue", "gray"],
        task: "Attend a networking event to expand professional connections, share insights, and explore potential collaboration opportunities.",
      },
      {
        id: 72,
        tags: ["red"],
        task: "Finish a DIY project started previously, dedicating time and resources to bring the vision to fruition and achieve desired outcomes.",
      },
      {
        id: 73,
        tags: ["gray"],
        task: "Prepare for an exam by reviewing course materials, practicing sample questions, and seeking clarification on challenging topics.",
      },
    ],
  },
  categories: [
    { name: "pending", title: "Pending" },
    { name: "inProgress", title: "In Progress" },
    { name: "completed", title: "Completed" },
    { name: "canceled", title: "Canceled" },
  ],
};
