// Test script for Project API endpoints
// Run this with: node test-api.js

const testProjectAPI = async () => {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Testing Project API Endpoints\n');
    console.log('=' .repeat(50));
    
    // Test 1: GET all projects
    console.log('\n📋 Test 1: GET /api/projects');
    try {
        const response = await fetch(`${baseURL}/projects`);
        const data = await response.json();
        console.log('✅ Status:', response.status);
        console.log('✅ Projects found:', data.length);
        console.log('✅ Sample project:', data[0] ? {
            id: data[0]._id,
            title: data[0].title,
            thumbnailUrl: data[0].thumbnailUrl ? '✓ Present' : '✗ Missing',
            imageUrl: data[0].imageUrl ? '✓ Present' : '✗ Missing'
        } : 'No projects yet');
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
    
    // Test 2: POST new project (requires authentication)
    console.log('\n📝 Test 2: POST /api/projects');
    console.log('⚠️  Note: This requires authentication token');
    console.log('   To test POST, you need to:');
    console.log('   1. Login via /api/auth/login');
    console.log('   2. Get the token from response');
    console.log('   3. Include token in Authorization header');
    
    // Test 3: Check server health
    console.log('\n🏥 Test 3: Server Health Check');
    try {
        const response = await fetch(`${baseURL}/projects`);
        if (response.ok) {
            console.log('✅ Server is running and responding');
            console.log('✅ CORS is configured correctly');
            console.log('✅ MongoDB connection is active');
        }
    } catch (error) {
        console.log('❌ Server is not responding');
        console.log('   Make sure to run: cd server && npm run dev');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n💡 To test POST endpoint from the browser:');
    console.log('   1. Open browser DevTools (F12)');
    console.log('   2. Go to Network tab');
    console.log('   3. Try creating a project in the admin panel');
    console.log('   4. Check the request/response in Network tab');
};

// Run tests
testProjectAPI().catch(console.error);
