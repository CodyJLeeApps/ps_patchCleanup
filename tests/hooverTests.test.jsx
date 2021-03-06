/*
    This test suite assumes valid input values for:
    Room Size, Hoover Starting Coordinates, Dirt Patch Coordinates, and Instructions
    Once the request is sent these tests validate that the output values are correct for the input values.
*/
const mockRoomSize = [6, 6];
const mockOrigin = [0, 0];
const mockCenter = [3, 3];
const mockEmptyPatches = [];
const mockStartingLoc = [1, 1];
const mockPatches = [[1, 4], [2, 5], [3, 3], [4, 3], [5, 1], [5, 5]];

const northDirections = 'NNNNNNN';
const southDirections = 'SSSSSSS';
const northEastDirections = 'NENENENE';
const southWestDirections = 'SWSWSWSW';
const mockDirections = '';

const mockPostRequestBody = {
    roomSize: mockRoomSize, 
    coords: mockStartingLoc, 
    patches: mockEmptyPatches, 
    instructions: ''
};

Feature('Driving Directions and Input Coordinates are properly processed')

    Scenario('when the instructions move the Hoover in the N Direction until it hits the wall and spins', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody,
            coords: mockCenter,
            instructions: northDirections
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertDeepEqual(response.data.coords, [3, 6],
            `The end location was not [3, 6] as expected, it was: ${response.data.coords}`) // Needed to use DeepEqual to compare the objects
    });

    Scenario('when the instructions move the Hoover in the S Direction until it hits the wall and spins', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody,
            coords: mockCenter,
            instructions: southDirections
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertDeepEqual(response.data.coords, [3, 0], 
            `The end location was not [3, 0] as expected, it was: ${response.data.coords}`)
    });

    Scenario('when the instructions move the Hoover in the NE direction until it hits a wall and spins', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody,
            coords: mockCenter,
            instructions: northEastDirections
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertDeepEqual(response.data.coords, mockRoomSize,
            `The end location of the hoover was not ${mockRoomSize}, it was: ${response.data.coords}`)
    });

    Scenario('when the instructions move the Hoover in the SW direction until it hits the wall at the origin and spins', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody,
            instructions: southWestDirections
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertDeepEqual(response.data.coords, mockOrigin,
            `The end location of the hoover was not ${mockOrigin}, it was: ${response.data.coords}`)
    });

Feature('Patch cleanup and final Hoover location is properly processed')

    /******************************
     * Example room for the scenario below
    _______________________________
    3 |   |   |   |
    2 |   | X |   |
    1 | S |   |   |
    0 | 1 | 2 | 3 |
    *******************************/
    Scenario('when the Hoover moves through one patch of dirt', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            roomSize: [3, 3],
            coords: mockStartingLoc,
            patches: [[2, 2]],
            instructions: 'EN'
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertEqual(response.data.patches, 1);
        I.assertDeepEqual(response.data.coords, [2, 2]);
    });

    /******************************
     * Example room for the scenario below
     * with `mockPatches` array & `mockStartingLoc`
    _______________________________
    6 |   |   |   |   |   |   |
    5 |   | X |   |   | X |   |
    4 | X |   |   |   |   |   |
    3 |   |   | X | X |   |   |
    2 |   |   |   |   |   |   |
    1 | S |   |   |   | X |   |
    0 | 1 | 2 | 3 | 4 | 5 | 6 |
    *******************************/
    Scenario('when the Hoover moves through two patches of dirt', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            roomSize: mockRoomSize,
            coords: mockStartingLoc,
            patches: mockPatches,
            instructions: 'EENNNNEE'
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertEqual(response.data.patches, 2);
        I.assertDeepEqual(response.data.coords, [5, 5]);
    });

    /******************************
     * Example room for the scenario below
     * with patch locations [[1, 4]] & `mockStartingLoc`
    _______________________________
    6 |   |   |   |
    5 |   |   |   |
    4 | X |   |   |
    3 |   |   |   |
    2 |   |   |   |
    1 | S |   |   |
    0 | 1 | 2 | 3 |
    *******************************/
    Scenario('when the Hoover moves through the room without hitting a dirt patch but hits a wall in a large room', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            roomSize: [3, 6],
            coords: mockStartingLoc,
            patches: [[1, 4]],
            instructions: 'EENNNNN'
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertEqual(response.data.patches, 0);
        I.assertDeepEqual(response.data.coords, [3, 6]);
    });

    /******************************
     * Example room for the scenario below
     * with patch locations [[1, 2]] & `mockStartingLoc`
    _______________________________
    4 |   |   |   |
    3 | X |   |   |
    2 |   |   |   |
    1 | S |   |   |
    0 | 1 | 2 | 3 |
    *******************************/
    Scenario('when the Hoover moves through the room without hitting a dirt patch or wall in a small room', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            roomSize: [3, 4],
            coords: mockStartingLoc,
            patches: [[1, 3]],
            instructions: 'EN'
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertEqual(response.data.patches, 0);
        I.assertDeepEqual(response.data.coords, [2, 2]);
    });

    /******************************
     * Example room for the scenario below
     * with patch locations [[1, 2]] & `mockStartingLoc`
    _______________________________
    4 |   |   |   |
    3 | X |   |   |
    2 |   |   |   |
    1 | S |   |   |
    0 | 1 | 2 | 3 |
    *******************************/
    Scenario('when the Hoover stays stationary in a small room', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            roomSize: [3, 4],
            coords: mockStartingLoc,
            patches: [[1, 3]],
            instructions: ''
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertEqual(response.data.patches, 0);
        I.assertDeepEqual(response.data.coords, [1, 1]);
    });