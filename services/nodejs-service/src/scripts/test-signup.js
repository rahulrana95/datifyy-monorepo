const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/v1';

async function testSignup() {
    console.log('🚀 Testing Signup Endpoint...\n');

    const testCases = [
        {
            name: 'Valid Signup',
            data: {
                email: 'test@example.com',
                password: 'SecurePass123!'
            },
            expectedStatus: 201
        },
        {
            name: 'Invalid Email',
            data: {
                email: 'invalid-email',
                password: 'SecurePass123!'
            },
            expectedStatus: 400
        },
        {
            name: 'Weak Password',
            data: {
                email: 'test2@example.com',
                password: '123'
            },
            expectedStatus: 400
        },
        {
            name: 'Duplicate Email',
            data: {
                email: 'test@example.com', // Same as first test
                password: 'SecurePass123!'
            },
            expectedStatus: 409
        }
    ];

    for (const testCase of testCases) {
        try {
            console.log(`Testing: ${testCase.name}`);

            const response = await axios.post(`${BASE_URL}/auth/signup`, testCase.data);

            if (response.status === testCase.expectedStatus) {
                console.log(`✅ ${testCase.name} - Passed`);
                if (response.data.data?.user) {
                    console.log(`   User created: ${response.data.data.user.email}`);
                }
            } else {
                console.log(`❌ ${testCase.name} - Failed: Expected ${testCase.expectedStatus}, got ${response.status}`);
            }

        } catch (error) {
            if (error.response?.status === testCase.expectedStatus) {
                console.log(`✅ ${testCase.name} - Passed (Expected error)`);
                console.log(`   Error: ${error.response.data.error?.message}`);
            } else {
                console.log(`❌ ${testCase.name} - Failed: ${error.message}`);
            }
        }

        console.log('');
    }
}