# Image-Processing-API
This application resizes an image to a requested size which is taken as an input. 
Resized images are cached and returned if image of same size is requested again.

### To run application on local
* Download or clone the project.
* Run npm install.
* Run npm start to build project from typescript to javascript, test and run application.
* Run npm ts-start to run the application with typescript.

### Testing
* Run npm test to build and test application alone.

### Request URL
The app will run on local host and listen on port 5000.

Sample url is http://localhost:5000/api/images?filename=fjord&width=200&height=200

### Input parameters
The input parameters for this project are:
* filename: Valid input is a name of an image in the assets folder without the extension.
* width: A numeric value above 0.
* height: A numeric value above 0.

### Error Handling
The app would return an error when user inputs wrong or unexpected values and when there's a problem with the app.
* 404 (Not Found) is returned when a user enters an image name not in the images folder.
* 400 (Bad Request) is returned if the user enters a non integer value for height and width.
* 500 (Something went wrong internally is returned when there's a problem with the app or when an unexpected error is encountered)
