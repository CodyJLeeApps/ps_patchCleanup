/**
    This test suite assumes valid mock values for: starting coordinates, movement instructions, and room size so that it can validate the API responds properly to patch location input values.
    Valid patch locations would include positive coordinate values who reside inside of the 
    size of the room.
 */

// Mock Constants
const mockRoomSize = [5, 5];
const mockCoords = [0,0];
const mockInstructions = '';

const mockPostRequestBody = {
    roomSize: mockRoomSize, 
    coords: mockCoords, 
    patches: undefined, 
    instructions: mockInstructions
};

// Test Inputs
const validPatchCoordinates = [
    [[1, 0]],
    [[5, 5]],
    [[2, 3], [3, 4]],
    [[3, 2], [1, 2], [2, 2]]
];

const invalidPatchCoordinates = [
    [[-1, -1]],
    [[-5, -5]],
    [[-1, 1]],
    [[1, -1]]
];

Feature('Hoover Patch Location Coordinates')

    Data(validPatchCoordinates).Scenario('Should return success for valid patch coordinates', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody, 
            patches: current
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
    });

    Data(invalidPatchCoordinates).Scenario('Should return bad request for invalid patch coordinates', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody, 
            roomSize: current
        });
        I.assertEqual(response.statusText, 'Bad Request', 
            `The response code was not 400 Bad Request, it was ${response.statusText}`);
    });