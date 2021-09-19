/*
    This test suite assumes valid mock values for the values: room size, patch locations, 
    and instruction set so that it can validate the API responds properly to starting location input.
*/

// mock constants
const mockRoomSize = [5, 5];
const mockDirtPatches = [[1, 0], [2, 2], [2, 3]];
const mockInstructions = '';

// test inputs
const validStartingLocations = [
    [0, 0],
    [1, 1],
    [2, 4],
    mockRoomSize
];
const invalidStartingLocations = [
    [-1, -1], 
    [-5, -5], 
    [-1, 1], 
    [1, -1],
    [mockRoomSize[0] + 1, mockRoomSize[1] + 1]
];

Feature('Hoover Starting Locations')

    Data(validStartingLocations).Scenario('Should return success for valid starting location', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            "roomSize": mockRoomSize, 
            "coords": current, 
            "patches": mockDirtPatches, 
            "instructions": mockInstructions
        });
        I.assertEqual(response.statusText, 'OK', 
            `The response code was not 200 OK, it was ${response.statusText}`)
    });

    Data(invalidStartingLocations).Scenario('Should return bad request for invalid starting location:', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            "roomSize": mockRoomSize, 
            "coords": current, 
            "patches": mockDirtPatches, 
            "instructions": mockInstructions
        });
        I.assertEqual(response.statusText, 'Bad Request', 
            `The response code was not 400 Bad Request, it was ${response.statusText}`);
    });