
// uppercase NESW
// lowercase nesw
// numbers
// symbols
// empty
// non-string value

const mockRoomSize = [5, 5];
const mockCoords = [3, 3];
const mockOrigin = [0, 0];
const mockPatches = [];
const mockPostRequestBody = {
    roomSize: mockRoomSize, 
    coords: mockCoords, 
    patches: mockPatches, 
    instructions: undefined
};

const northEastDirections = 'NENENE';
const southWestDirections = 'SWSWSW';

const validInstructions = [
    'N', 'E', 'S', 'W',
    'n', 'e', 's', 'w',
    'NESW',
    'nesw'
];
const invalidInstructions = [
    [], {},
    '1234',
    '!@#$',
    'ABCD'
];

Feature('Driving Directions')

    Data(validInstructions).Scenario('Should return success for valid instructions', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody, 
            instructions: current
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
    });

    Data(invalidInstructions).Scenario('Should return bad request for invalid instructions', async ({I, current}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody, 
            instructions: current
        });
        I.assertEqual(response.statusText, 'Bad Request', 
            `The response code was not 400 Bad Request, it was ${response.statusText}`);
    });