/*
    This test suite assumes valid mock values for the values: room size, patch coordinates, 
    and instruction set so that it can validate the API responds properly to starting coordinate input.
*/

// mock constants
const mockRoomSize = [5, 5];
const mockDirtPatches = [[1, 0], [2, 2], [2, 3]];
const mockInstructions = '';

const mockPostRequestBody = {
    roomSize: mockRoomSize, 
    coords: undefined, 
    patches: mockDirtPatches, 
    instructions: mockInstructions
};

/* Test Inputs */
// Valid starting coordinates would be any coordinates
// that would be inside the bounds of the room;
// i.e. inside of [0, 0] -> [roomSizeX, roomSizeY]
const validStartingCoordinates = [
    [1, 1],
    [2, 4],
    [mockRoomSize[0], 1],
    [1, mockRoomSize[1]],
    mockRoomSize
];

// Invalid starting coordinates would be any coordinates
// that would be outside the bounds of the room; 
// i.e. outside of [0, 0] -> [roomSizeX, roomSizeY]
const invalidStartingCoordinates = [
    [0, 0],
    [-1, -1], 
    [-5, -5], 
    [-1, 1], 
    [1, -1],
    [mockRoomSize[0] + 1, mockRoomSize[1] + 1],
    ['banana', 'pear']
];

Feature('Hoover Starting Coordinates')

    Data(validStartingCoordinates).Scenario('Should return success for valid starting coordinates', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody,
            coords: current
        });
        I.assertEqual(response.statusText, 'OK', 
            `The response code was not 200 OK, it was ${response.statusText}`)
    });

    Data(invalidStartingCoordinates).Scenario('Should return bad request for invalid starting coordinates:', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody,
            coords: current
        });
        I.assertEqual(response.statusText, 'Bad Request', 
            `The response code was not 400 Bad Request, it was ${response.statusText}`);
    });