const validStartingLocations = new DataTable([
    {
        "roomSize": [5, 5], 
        "coords": [1, 2], 
        "patches": [ 
            [1, 0], 
            [2, 2], 
            [2, 3] 
        ], 
        "instructions": "N"
    },
    {
        "roomSize": [5, 5], 
        "coords": [0, 0], 
        "patches": [ 
            [1, 0], 
            [2, 2], 
            [2, 3] 
        ], 
        "instructions": "N"
    }
]);

Feature('Hoover Starting Locations')

    Scenario('Should return post successfully for valid starting location', async ({I}) => {
        const response = await I.sendPostRequest('/v1/cleaning-sessions', {
            "roomSize": [5, 5], 
            "coords": [1, 2], 
            "patches": [ 
                [1, 0], 
                [2, 2], 
                [2, 3] 
            ], 
            "instructions": ""
        });
        
        console.log('response: ', response);
        const expectedOutput = { coords: [ 1, 2 ], patches: 0 };
        
        I.assertEqual(response.statusText, 'OK', 'The response code was not OK')
        I.assertDeepEqual(response.data, expectedOutput);
    });