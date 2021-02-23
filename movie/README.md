# Movie Fronted

### Page

include 4 pages:
* Boxes (Frontend Test)
* Cheapest Movie (Backend Test)
* All Movies (different approch for backend test with frontend filter)
* Export Bulk Movie (Backend Test)

## Framework/Library

Using standard `create-react-app` to build the web application

## Styling

Using `Styled Component` as the default styling method which also support SASS/SCSS

The reason of using Style Component is because this is a rather small project and css-in-js style make a lot sense which save the time to deal with the classnames

## State Management

Using the simple `Redux Toolkit` to store the movies in `all movies` page when the page first loaded. It saves the time to keep calling the API for the movies and also reduce the chances of hitting flaky API.



