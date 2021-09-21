# Description
The following is a report of the bugs that were found within the pltsci-sdet-assignment API.
Below is a summary of the testing suite, as well as a summary of the open bugs that were discovered in the API.

## Getting Started
To get started running tests there are really just three steps needed:

1. Start up the Docker container for the PLTSI-SDET-Asignment as described in it's README
2. Navigate to the root directory of this repository and run `npm install`
3. Execute the tests by running `npm run test`, which is the npm script set up in the package.json file for the actual command: `codeceptjs run`

After step three the user will see the test results in the terminal. The test suite as well as the results of the tests are discussed below.

## Test Suite
### Testing Framework Decision
The testing framework that was chosen for this project was the CodeceptJs test framework. This was chosen for a couple simple reasons: A - I had not used this testing framework before and I wanted to get experience with it, and B - This testing framework is used at Platform Science so it would make sense to go ahead and get familiar with it.

In addition to CodeceptJS I chose to install CodeceptJS-Chai, another NPM package that focuses on asserts within the test framework. This package allows assertions to be added as steps in the output, as well as having access to the Chai assertion functions.

### Suite Structure
The test suite was broken up into two main test types:

The first test type is what I called "initial value tests". These tests focus on validating that the API responds with the proper response code to a given input. The API was tested for each input separately to keep a nice narrow focus for each suite. 

The second test type is what I would consider a full workflow test for this API. These tests focus on validating the API's output JSON based on the input parameters.

## Open Bugs

### Initial Room Size Input
Given that the room dimensions are based on the X, Y coordinate system we know that the only valid room dimensions are two dimensional, non-zero, and non-negative dimensions. Upon testing room dimensions the following bugs were identified:

- The API returns a success response when the room dimension(s) are a single value, i.e. [1] rather than [1, 1].
- The API returns a success response for various invalid room sizes that include negative numbers, i.e. [-1, -1], [-1, 1], [1, -1], etc.

### Hoover Starting Coordinate Input
Given that the room dimensions should be non-zero and non-negative, it would follow that the starting coordinates of the hoover would be as well so that the Hoover starts inside of the room. Upon testing the position of the Hoover the following bugs were identified:

- The Hoover is unable to start at the maximum coordinate for the X dimension, this can be observed with the two failing tests that utilize the mockRoom size in the starting coordinates of the Hoover.
- The starting coordinates do not trigger a bad request for negative Y dimension values
- The starting coordinates do not trigger a bad request for a starting location that is larger than the dimensions of the room

### Hoover Patch Location Coordinate Entry
Given that the room dimensions should be non-zero and non-negative it follows that the coordinates of the dirt patches have to be contained within these dimensions. Upon testing the potential positions of dirt patches, the following bug(s) were identified:

- The maximum dimension (top right corner) of the room would not be used for a dirt patch location. i.e. if the room dimensions were [5, 5] the dirt patch could not be located in the [5, 5] location

### Driving Direction Entry
Given that the coordinate system of the room uses Cardinal Directions it is assumed that N, E, S, and W directions will be used as the inputs to the API. Also due to the fact that the input data type of the instructions is a string I also assume that combined directions like NW (Northwest) will not be valid. Upon testing the driving directions the following bugs were identified:

- Lowercase directions such as "nesw" caused the API to throw "bad request", the API should be able to process uppercase as well as lowercase instructions.

### Full Workflow Processing Issues
Full workflow tests were written to verify that given a valid input, the API will process and output the correct values for final Hoover coordinates, as well as the number of dirt patches cleaned during the session. Upon testing these workflows the following bugs were identified:

- This is a similar bug to the starting Hoover location coordinate issue where the Hoover can't start at the maximum dimensions... In this case however the Hoover is unable to move to the maximum Y location, i.e. with room dimensions [5, 5] the Hoover is unable to move into the [5, 5] location.
-