# Graduatree 

Team Twice


### Setting up the database

To run the app, the db must be populated first(make sure db c09 exists in mongodb), to do so, run `node ./scraper/scrapperv2.js` and `node ./scraper/prog_scrap.js`. Once finished you can now run the server with npm start.

### Members
- Mark Viola
- ZiXian Chen
- Hyeong Ook Yu


### Description

Graduatree allows students to more easily determine which courses they need to take in order to graduate from UTSC as a specialist, major, or minor in any specific program. Team Twice has determined that the Degree Explorer found on ROSI is obsolete and doesn’t easily show how a student must take courses in order to graduate. Specifically, since some courses are only available in either the Fall or Winter semester it may be important that a student enroll in a specific course instead of having to wait additional semesters to fulfill a prerequisite. This is especially important for co-op students that have employment during the Fall and Winter semesters. 

Additionally, the app will allow students to review courses & professors based on quality of material, quality of teaching, and easiness. Since the professor teaching a particular course may vary from year to year, there will be a generalized score based on the course + professor, as well as an individual course and professor score. Furthermore, a student may create an account on the site so that they can create reviews for courses and/or professors as well as keep track of which courses they have already taken. 

Another feature of the site is that it will be able to plan out which courses the student will need to take in all semesters that they will have for the entirety of their university career. Since students also need to take breadth requirements in order to graduate, the planner will take into account which breadth requirement courses have been rated the highest and suggest the student take them.


### Beta Version Features

For the beta, Team Twice aim to complete the core features of the site. This includes:

-	Allow a user to sign up and login to an account on the site
-	Allow a user to select which courses they have taken already
-	Pull data the UTSC website that has information about all courses
-	Determine which courses a student will need to take to graduate with as a specialist/major/minor, as specified on their account
-	Determine the database schema that will be used to hold user information, and reviews for courses and professors


### Final Version Features

For the final version, Team Twice will complete any special features that haven’t been implemented already. This includes:

-	Allow the user to review courses and professors
-	Implement planner that will suggest elective courses that a user may want to take based on reviews. 
-	Improve web security 
-	Better aesthetic design, where courses are shown as an easy to read flow chart 


### Technologies Used

- ReactJS
- MongoDB


### Technical Challenges

- Creating an interative UI that is also functional
- Retrieving course data
- Creating algorithms to generate suggestions
- Learning and using new technologies (ReactJS and MongoDB)
