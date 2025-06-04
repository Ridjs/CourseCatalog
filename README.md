Title:
- SBHS Course Catalog Prototype

Description: 
- It is a modern and interactive course catalog prototype for South Brunswick High School. Involves filtering so users can easily search for courses based on their criterias and interests. It is built using React.js, HeroUI, SQL, and Node.js.

Features:
- 3D models for choosing departments and engagement
- Filter courses by grade, department, weighting, credits, and special interests
- Search for courses based on user-typed words
- Dark mode integration
- Responsive design (tested on laptop and phone)
- Wishlist: Add/remove favorite courses to keep track of courses that interest you
    - Lets you see your favorite courses in a concise manner
- Footer that includes links to various courses and scheduling documents

How to use:
- Select a department by clicking the arrow on the card
- Use dropdowns to set your filters (Can use multiple/all filters at the same time)
- Use search to filter based on user words
- Clear all filters button clears every filter
- Click the heart icon on last column of the table to favorite that course (all favorite courses will be displayed by clicking heart on the header)
- Clicking the heart icon again will unfavorite the course.
- Go back on the bottom right corner of screen will take user back to models screen
- Switch in the header is used to toggle between light and dark mode
- Clicking last button on the header will take you to the footer which has more resources and citations


Making the app:
- React (Frontend) side of project was created with create-react-app.
- Server (Backend) was created with SQL and Node.js.

Needed:
- Node.js
- npm
- SQLite (used to edit the database)

Using the app:
- Clone the repository
- Install the frontend dependencies
    - cd frontend
    - npm install
- Install server dependencies
    - cd ../server
    - npm install

Updating the app:
- Updating course data, replace the csv file with new one and import the new csv file into sql database and delete the old one (might have to change the sql command slighty in the server/index.js depending on the name of the file)
- Updating UI, edit the frontend/src/App.js file
- If new department added, 3D Model with the same as Department would be needed in the frontend/public/model file. (PolyPizza for 3D Models-I used it for all 3D Models (make sure to check citation and add attribution if needed))

Running the app:
- Start the server first: cd server then npm start
    - Starts the backend on localhost:8080
    - If you want to start the server, so it allows requests from devices (mobile or laptop) on your network, change:
            app.listen(8080, () => {
                console.log('server listening on http://localhost:8080')
            })
        to:
            app.listen(8080,'0.0.0.0', () => {
                console.log('server listening on http://0.0.0.0:8080')
            })
- Start the frontend: Open a new terminal, cd frontend then npm start
    - Starts the React webpage on localhost:3000 (development build)
    - If trying to use another device connected on the same network use the link for "On Your Network" on that device
        - Must have server running on the http://0.0.0.0:8080 and change the fetch urls in frontend by changing localhost:3000 to your ip_address:3000

Production/Deployment of the app:
- cd frontend then npm run build
    - Generates a production-ready build

More Info:
- 3D Models: In the frontend/public/models folder
    - Models attributed in the footer
- Images: In the frontend/public folder
- Database and csv file: In the server folder