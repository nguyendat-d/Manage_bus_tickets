// Test đăng ký nhà xe
const axios = require('axios');

async function testBusCompanyRegistration() {
  try {
    console.log('🚌 Testing Bus Company Registration...\n');

    // Test 1: Đăng ký nhà xe KHÔNG có mã số thuế
    console.log('📝 Test 1: Đăng ký nhà xe không có mã số thuế');
    const randomEmail = `buscompany_${Date.now()}@test.com`;
    
    try {
      const response1 = await axios.post('http://localhost:5000/api/auth/register', {
        email: randomEmail,
        password: 'BusCompany123!',
        full_name: 'Nguyễn Văn Test',
        phone: '0900000001',
        role: 'bus_company',
        company_name: 'Công ty Test Transport',
        address: '123 Test Street, District 1, HCMC',
        tax_code: '' // Để trống
      });

      console.log('✅ Đăng ký thành công!');
      console.log('Response:', JSON.stringify(response1.data, null, 2));
      console.log('requiresApproval:', response1.data.data?.requiresApproval);
    } catch (error) {
      console.error('❌ Lỗi:', error.response?.data?.message || error.message);
    }

    console.log('\n---\n');

    // Test 2: Đăng ký nhà xe CÓ mã số thuế
    console.log('📝 Test 2: Đăng ký nhà xe có mã số thuế');
    const randomEmail2 = `buscompany_${Date.now() + 1}@test.com`;
    const randomTaxCode = `TAX${Date.now()}`;
    
    try {
      const response2 = await axios.post('http://localhost:5000/api/auth/register', {
        email: randomEmail2,
        password: 'BusCompany123!',
        full_name: 'Trần Thị Test',
        phone: '0900000002',
        role: 'bus_company',
        company_name: 'Công ty Test Express',
        address: '456 Test Avenue, District 2, HCMC',
        tax_code: randomTaxCode
      });

      console.log('✅ Đăng ký thành công!');
      console.log('Response:', JSON.stringify(response2.data, null, 2));
    } catch (error) {
      console.error('❌ Lỗi:', error.response?.data?.message || error.message);
    }

    console.log('\n---\n');

    // Test 3: Thử đăng nhập với tài khoản chưa duyệt
    console.log('📝 Test 3: Thử đăng nhập với tài khoản chưa duyệt');
    
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: randomEmail,
        password: 'BusCompany123!'
      });

      console.log('❌ KHÔNG NÊN đăng nhập được!');
      console.log('Response:', loginResponse.data);
    } catch (error) {
      console.log('✅ Đúng rồi! Không thể đăng nhập khi chưa được duyệt');
      console.log('Lỗi:', error.response?.data?.message);
    }

    console.log('\n---\n');

    // Test 4: Login Admin và lấy danh sách nhà xe chờ duyệt
    console.log('📝 Test 4: Admin kiểm tra danh sách nhà xe chờ duyệt');
    
    try {
      // Login as admin
      const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@busticket.com',
        password: 'Password123!'
      });

      const adminToken = adminLogin.data.data.token;
      console.log('✅ Admin đăng nhập thành công');

      // Get pending companies
      const companiesResponse = await axios.get('http://localhost:5000/api/admin/bus-companies', {
        params: { status: 'pending' },
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      console.log('✅ Danh sách nhà xe chờ duyệt:');
      console.log(`Tổng số: ${companiesResponse.data.data.companies.length}`);
      
      companiesResponse.data.data.companies.forEach((company, index) => {
        console.log(`\n${index + 1}. ${company.company_name}`);
        console.log(`   - Email: ${company.email}`);
        console.log(`   - Status: ${company.status}`);
        console.log(`   - Tax Code: ${company.tax_code || 'N/A'}`);
      });

    } catch (error) {
      console.error('❌ Lỗi:', error.response?.data?.message || error.message);
    }

    console.log('\n\n✅ Test hoàn tất!');

  } catch (error) {
    console.error('❌ Test thất bại:', error.message);
  }
}

testBusCompanyRegistration();
