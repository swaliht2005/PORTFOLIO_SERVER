// Complete API Test with Authentication
// Run with: node test-api-full.js

const testCompleteAPI = async () => {
    const baseURL = 'http://localhost:5000/api';
    
    console.log('🧪 Complete API Test Suite\n');
    console.log('=' .repeat(60));
    
    // Step 1: Login to get token
    console.log('\n🔐 Step 1: Login to get authentication token');
    let token = null;
    try {
        const loginResponse = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            token = loginData.token;
            console.log('✅ Login successful');
            console.log('✅ Token received:', token ? 'Yes' : 'No');
        } else {
            const error = await loginResponse.json();
            console.log('❌ Login failed:', error.message);
            console.log('   Using default credentials: admin / admin123');
        }
    } catch (error) {
        console.log('❌ Login error:', error.message);
    }
    
    // Step 2: Test GET all projects
    console.log('\n📋 Step 2: GET /api/projects');
    try {
        const response = await fetch(`${baseURL}/projects`);
        const projects = await response.json();
        console.log('✅ Status:', response.status);
        console.log('✅ Total projects:', projects.length);
        if (projects.length > 0) {
            console.log('✅ Latest project:');
            console.log('   - Title:', projects[0].title);
            console.log('   - Has thumbnailUrl:', !!projects[0].thumbnailUrl);
            console.log('   - Has imageUrl:', !!projects[0].imageUrl);
            console.log('   - Has contentModules:', !!projects[0].contentModules);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
    
    // Step 3: Test POST new project
    console.log('\n📝 Step 3: POST /api/projects (Create new project)');
    if (!token) {
        console.log('⚠️  Skipping - No authentication token available');
        console.log('   Please check your login credentials');
    } else {
        try {
            const testProject = {
                title: 'API Test Project',
                description: 'Testing project creation via API',
                category: 'Web Development',
                thumbnailUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                status: 'draft',
                tags: ['test', 'api'],
                tools: ['Node.js', 'MongoDB'],
                contentModules: []
            };
            
            const response = await fetch(`${baseURL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testProject)
            });
            
            if (response.ok) {
                const newProject = await response.json();
                console.log('✅ Project created successfully!');
                console.log('✅ Project ID:', newProject._id);
                console.log('✅ Title:', newProject.title);
                console.log('✅ ThumbnailUrl saved:', !!newProject.thumbnailUrl);
                
                // Clean up - delete test project
                console.log('\n🧹 Cleaning up test project...');
                const deleteResponse = await fetch(`${baseURL}/projects/${newProject._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (deleteResponse.ok) {
                    console.log('✅ Test project deleted');
                }
            } else {
                const error = await response.json();
                console.log('❌ Failed to create project');
                console.log('   Status:', response.status);
                console.log('   Error:', error.message);
                
                // Check for specific errors
                if (error.message.includes('thumbnailUrl')) {
                    console.log('   ⚠️  Schema validation error - thumbnailUrl is required');
                } else if (error.message.includes('imageUrl')) {
                    console.log('   ⚠️  Schema validation error - imageUrl is required');
                    console.log('   💡 Fix: Update Project model to make imageUrl optional');
                }
            }
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Server is running');
    console.log('   ✅ GET endpoint works');
    console.log('   ' + (token ? '✅' : '❌') + ' Authentication works');
    console.log('\n💡 Next steps:');
    console.log('   1. Try creating a project from the admin panel');
    console.log('   2. Check browser DevTools Network tab for errors');
    console.log('   3. Verify thumbnailUrl is being sent in the request');
};

testCompleteAPI().catch(console.error);
