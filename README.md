# Pathfinder

This is a career map for students who is looking for degree and specialization to study after high school (+2). You can either browse the career map (flowchart) or take a short quiz, with very special personalized pathfinder AI.

## what it does

Career map's boxes are joined by row and vertical lines where the tree branches to open degrees, degrees branches to specialization and so on. It also features a search with degree or career name with stream filter. Each degrees has their details fetched from careers.json file which includex duration, entrance exams, universities, about, etc. I also have setup toast error to make notifications cool.

The main highlight would be Quiz. Inspired somewhat by DJI website for drone selection, I thought why not build something similar. In the quiz, there are 4 questions and optional "about you" field to describe outself. The AI chooses 3 degrees from career.json based on how well we described ourself. If the Ai fails, possibly due to rate limit, the hardcoded answer from 4 question quiz is displayed. 

## built with

- HTML, CSS and JS
- Nodejs with express server
- Nvidia NIM API 
- Toastify

## Limitations / Challenges

The major limitation as always is rate limit for free services where rate limit can be excedeed when multiple user tries this project simultaneously. AI answers may be wrong or outdated especially things related to university and cources. 

The main challenge in this project was finding correct and reliable career map. I initially used AI to prepare json file containing faculties and degrees of Nepal but it was very inaccurate and I had to manually update the file. The entrance info was also very wrong and more influenced by Indian university and indian education system where finding information was extremely difficult. I tried my best to obtain as accurate degree information for Nepal as possible and will be updating it with time. 

# Possible future ideas

- database to store chat memory
- authentication with clerk 
- Improved quiz
- More better UI

# Use of AI

I mostly used AI to fix error, debug and to make lines of career map. I initially used AI for degree information which did not go as intended. I also used AI in some UI components to bring out uniformity design.