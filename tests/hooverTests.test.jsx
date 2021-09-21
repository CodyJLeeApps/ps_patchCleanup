const mockRoomSize = [6, 6];
const mockOrigin = [0, 0];
const mockCenter = [3, 3];
const mockPatches = [];

const northDirections = 'NNNNNNN';
const southDirections = 'SSSSSSS';
const northEastDirections = 'NENENENE';
const southWestDirections = 'SWSWSWSW';

const mockPostRequestBody = {
    roomSize: mockRoomSize, 
    coords: mockOrigin, 
    patches: mockPatches, 
    instructions: undefined
};

Feature('Driving Directions and Input Coordinates are properly processed')

    Scenario('Should move the Hoover in the N Direction as instructed until it hits the wall and spins', async ({I}) => {
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

    Scenario('Should move the Hoover in the S Direction as instructed until it hits the wall and spins', async ({I}) => {
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

    Scenario('Should move the Hoover in the NE direction as instructed until it hits a wall and spins', async ({I}) => {
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

    Scenario('Should move the Hoover in the SW direction as instructed until it hits the wall at the origin and spins', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            ...mockPostRequestBody,
            instructions: southWestDirections
        });
        I.assertEqual(response.statusText, 'OK',
            `The response was not 200 OK, it was ${response.statusText}`);
        I.assertDeepEqual(response.data.coords, mockOrigin,
            `The end location of the hoover was not ${mockOrigin}, it was: ${response.data.coords}`)
    });

// Feature('')