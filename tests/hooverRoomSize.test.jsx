/* 
    This test suite assumes valid mock values for the values: starting coordinates, patch coordinates, 
    and movement instruction set so that it can validate the API responds properly to room size input.
*/

// mock constants
const mockCoords = [0,0];
const mockDirtPatches = [];
const mockInstructions = '';

const mockPostRequestBody = {
    roomSize: undefined, 
    coords: mockCoords, 
    patches: mockDirtPatches, 
    instructions: mockInstructions
};

// test inputs
const validRoomSizes = [
    [1, 1],
    [2, 2],
    [2, 4],
    [3, 2],
    [5, 5]
];

const invalidRoomSizes = [
    [0, 0],
    [-1, -1], 
    [-5, -5], 
    [-1, 2], 
    [2, -1],
];

Feature('Hoover Room Sizes')

    Data(validRoomSizes).Scenario('Should return success for valid starting room sizes', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody, 
            roomSize: current
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
    });

    Data(invalidRoomSizes).Scenario('Should return bad request for invalid starting room sizes', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody, 
            roomSize: current
        });
        I.assertEqual(response.statusText, 'Bad Request', 
            `The response code was not 400 Bad Request, it was ${response.statusText}`);
    });