const Challenges = [
  {
     "id": "65f8e9b2c4d1a9a7e6f7b0e1",
     "questionId": 101,
     "questionName": "Hello World",
     "questionDescription": "Write a program that takes a string input and prints it.",
     "sampleTestCases": [
        {
           "input": "Hello, World!",
           "expectedOutput": "Hello, World!"
        },
        {
           "input": "Hello, World!",
           "expectedOutput": "Hello, World!"
        },
        
     ],
     "actualTestCaseInput": ["Testing"],
     "actualTestCaseOutput": ["Testing"],
     "topics": ["Basics", "Input/Output"],
     "questionDifficulty": "EASY",
     "questionSource": "Custom"
  },
  {
     "id": "65f8e9b2c4d1a9a7e6f7b0e2",
     "questionId": 102,
     "questionName": "Reverse a String",
     "questionDescription": "Write a function that reverses a string.",
     "sampleTestCases": [
        {
           "input": "hello",
           "expectedOutput": "olleh"
        }
     ],
     "actualTestCaseInput": ["world"],
     "actualTestCaseOutput": ["dlrow"],
     "topics": ["Strings"],
     "questionDifficulty": "EASY",
     "questionSource": "CodeForces"
  },
  {
     "id": "65f8e9b2c4d1a9a7e6f7b0e3",
     "questionId": 103,
     "questionName": "Find the Missing Number",
     "questionDescription": "Given an array containing n distinct numbers in the range [0, n], find the missing number.",
     "sampleTestCases": [
        {
           "input": {"nums": [3,0,1]},
           "expectedOutput": 2
        }
     ],
     "actualTestCaseInput": [{"nums": [9,6,4,2,3,5,7,0,1]}],
     "actualTestCaseOutput": [8],
     "topics": ["Math", "Bit Manipulation"],
     "questionDifficulty": "MEDIUM",
     "questionSource": "LeetCode"
  },
  {
     "id": "65f8e9b2c4d1a9a7e6f7b0e4",
     "questionId": 104,
     "questionName": "Valid Parentheses",
     "questionDescription": "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
     "sampleTestCases": [
        {
           "input": "()[]{}",
           "expectedOutput": true
        }
     ],
     "actualTestCaseInput": ["(]"],
     "actualTestCaseOutput": [false],
     "topics": ["Stack", "Strings"],
     "questionDifficulty": "MEDIUM",
     "questionSource": "LeetCode"
  },
  {
     "id": "65f8e9b2c4d1a9a7e6f7b0e5",
     "questionId": 105,
     "questionName": "Merge Two Sorted Lists",
     "questionDescription": "Merge two sorted linked lists and return it as a sorted list.",
     "sampleTestCases": [
        {
           "input": {"l1": [1,2,4], "l2": [1,3,4]},
           "expectedOutput": [1,1,2,3,4,4]
        }
     ],
     "actualTestCaseInput": [{"l1": [2,5], "l2": [1,3,6]}],
     "actualTestCaseOutput": [[1,2,3,5,6]],
     "topics": ["Linked List", "Recursion"],
     "questionDifficulty": "HARD",
     "questionSource": "LeetCode"
  }
]

export default Challenges;
