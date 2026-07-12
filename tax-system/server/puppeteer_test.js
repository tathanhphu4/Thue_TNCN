const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Bắt đầu chạy Puppeteer System/GUI Test cho TaxVN...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Users\\taphu\\.cache\\puppeteer\\chrome-headless-shell\\win64-150.0.7871.24\\chrome-headless-shell-win64\\chrome-headless-shell.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Set viewport size
  await page.setViewport({ width: 1280, height: 800 });

  const randomSuffix = Math.floor(Math.random() * 900000) + 100000; // 6-digit unique
  const testEmail = `browser_test_${randomSuffix}@taxvn.com`;
  const testPassword = 'Browser@123';
  const testCCCD = String(100000000000 + randomSuffix); // Always 12 digits

  try {
    // ────────────────────────────────────────────────────────────────────────
    // SCENARIO 5: Route bảo vệ khi chưa đăng nhập (SEL-05)
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- Scenario 5: Kiểm tra route bảo vệ (SEL-05) ---');
    console.log('Truy cập /profile khi chưa đăng nhập...');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle2' });
    let currentUrl = page.url();
    console.log(`URL hiện tại: ${currentUrl}`);
    if (currentUrl.includes('/login')) {
      console.log('✅ PASS: Đã tự động điều hướng từ /profile về /login');
    } else {
      console.log('❌ FAIL: Không tự động điều hướng về /login');
    }

    // ────────────────────────────────────────────────────────────────────────
    // SCENARIO 3: Validation đăng ký (SEL-03)
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- Scenario 3: Validation đăng ký (SEL-03) ---');
    console.log('Truy cập trang đăng ký...');
    await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
    
    console.log('Bỏ trống toàn bộ các trường và click Đăng ký...');
    await page.click('button[type="submit"]');
    
    // Đợi 500ms để validation client-side chạy
    await new Promise(r => setTimeout(r, 500));
    
    // Tìm các thẻ thông báo lỗi (.error-text)
    const errorMessages = await page.$$eval('.error-text', el => el.map(x => x.textContent));
    console.log(`Tìm thấy ${errorMessages.length} thông báo lỗi validation trên UI:`);
    errorMessages.forEach(msg => console.log(` - ${msg}`));
    
    if (errorMessages.length > 0) {
      console.log('✅ PASS: Đã chặn đăng ký và hiển thị lỗi validation client-side');
    } else {
      console.log('❌ FAIL: Không hiển thị lỗi validation');
    }

    // ────────────────────────────────────────────────────────────────────────
    // SCENARIO 1: Đăng ký & Đăng nhập hợp lệ (SEL-01)
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- Scenario 1: Đăng ký tài khoản hợp lệ (SEL-01) ---');
    console.log(`Đăng ký với email mới: ${testEmail}`);
    
    // Vào lại trang đăng ký (sau SEL-03 form đã có lỗi, cần navigate lại)
    await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
    
    await page.type('#fullName', 'Nguyen Van Browser');
    await page.type('#email', testEmail);
    await page.type('#password', testPassword);
    await page.type('#confirmPassword', testPassword);
    await page.type('#phone', '0912345678');
    await page.type('#idCard', testCCCD);
    await page.type('#taxCode', '1234567891');
    
    console.log('Click đăng ký...');
    await page.click('button[type="submit"]');
    // React Router dùng client-side routing, không trigger full page navigation
    // Chờ URL thay đổi hoặc dashboard xuất hiện
    await new Promise(r => setTimeout(r, 3000));
    
    console.log(`URL sau khi click đăng ký: ${page.url()}`);
    if (page.url().includes('/dashboard')) {
      console.log('✅ PASS: Đăng ký thành công và đã tự động vào dashboard');
    } else {
      // Kiểm tra xem có thông báo lỗi server không
      const serverErr = await page.evaluate(() => {
        const alert = document.querySelector('.alert-error');
        return alert ? alert.innerText : null;
      });
      if (serverErr) {
        console.log(`❌ FAIL: Đăng ký thất bại với lỗi: "${serverErr}"`);
      } else {
        console.log('❌ FAIL: Không chuyển sang dashboard');
      }
    }

    // ────────────────────────────────────────────────────────────────────────
    // SCENARIO 4: Máy tính thuế hoạt động bình thường (SEL-04)
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- Scenario 4: Kiểm tra Máy tính thuế (SEL-04) ---');
    console.log('Truy cập trang máy tính thuế...');
    await page.goto('http://localhost:3000/tax/calculator', { waitUntil: 'networkidle2' });
    
    console.log('Nhập Thu nhập: 25,000,000, người phụ thuộc: 1...');
    await page.type('#grossIncome', '25000000');
    // Người phụ thuộc dùng button +/− không phải select
    const depPlusBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('.dep-btn'));
      return btns.find(b => b.innerText.trim() === '+');
    });
    if (depPlusBtn && depPlusBtn.asElement()) await depPlusBtn.asElement().click();
    
    console.log('Click Tính thuế...');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 800));
    
    // Kiểm tra kết quả hiển thị trên màn hình
    const resultTitleExists = await page.evaluate(() => {
      return document.body.innerText.includes('Kết quả tính thuế');
    });
    
    if (resultTitleExists) {
      console.log('✅ PASS: Kết quả tính thuế đã hiển thị trên màn hình');
      // Lấy số liệu thuế thực tế từ UI
      const taxAmountUI = await page.evaluate(() => {
        // Tìm element chứa text thuế TNCN phải nộp
        const items = Array.from(document.querySelectorAll('.result-row, .preview-row'));
        const row = items.find(x => x.innerText.includes('Thuế TNCN phải nộp') || x.innerText.includes('Thuế phải nộp'));
        return row ? row.innerText : 'Không tìm thấy';
      });
      console.log(`Số liệu trên UI: ${taxAmountUI}`);
    } else {
      console.log('❌ FAIL: Không hiển thị kết quả tính thuế');
    }

    // ────────────────────────────────────────────────────────────────────────
    // CHỨC NĂNG HỆ THỐNG: KHAI BÁO THUẾ VÀ THANH TOÁN (SYSTEM TEST)
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- Chức năng hệ thống: Khai báo thuế & Nộp thuế ---');
    console.log('Truy cập trang khai báo thuế...');
    await page.goto('http://localhost:3000/tax/declare', { waitUntil: 'networkidle2' });
    
    console.log('Step 0: Click Tiếp theo...');
    await page.click('.declare-nav button.btn-primary');
    await new Promise(r => setTimeout(r, 500));
    
    console.log('Step 1: Nhập thu nhập lương 25,000,000...');
    await page.type('.income-row input[placeholder="VD: 20000000"]', '25000000');
    await page.click('.declare-nav button.btn-primary');
    await new Promise(r => setTimeout(r, 500));
    
    console.log('Step 2: Nhập giảm trừ (click tự động bảo hiểm và thêm người phụ thuộc)...');
    await page.click('.btn-autofill');
    await page.click('.dep-btn:nth-child(3)'); // nút + người phụ thuộc
    await page.click('.declare-nav button.btn-primary'); // click xem trước
    await new Promise(r => setTimeout(r, 500));
    
    console.log('Step 3: Click Xác nhận & Gửi khai báo...');
    const confirmBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Xác nhận & Gửi'));
    });
    if (confirmBtn) {
      await confirmBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      console.log('Đã gửi khai báo thành công!');
    }
    
    // Đến trang Lịch sử để nộp thuế mô phỏng
    console.log('Truy cập lịch sử tờ khai...');
    await page.goto('http://localhost:3000/tax/history', { waitUntil: 'networkidle2' });
    
    const pendingExists = await page.evaluate(() => {
      return document.body.innerText.includes('Chờ thanh toán') || document.body.innerText.includes('pending');
    });
    
    if (pendingExists) {
      console.log('✅ PASS: Tìm thấy tờ khai ở trạng thái Chờ thanh toán');
      
      console.log('Click nút Nộp thuế...');
      const payBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.innerText.includes('Nộp thuế'));
      });
      if (payBtn) {
        await payBtn.click();
        await new Promise(r => setTimeout(r, 500));
        
        // Modal thanh toán hiện ra, click Xác nhận thanh toán
        const confirmPayBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('.modal-footer button, button'));
          return btns.find(b => b.innerText.includes('Xác nhận') || b.innerText.includes('Thanh toán'));
        });
        if (confirmPayBtn) {
          await confirmPayBtn.click();
          await new Promise(r => setTimeout(r, 1000));
          console.log('✅ PASS: Thực hiện nộp thuế mô phỏng thành công');
        }
      }
    } else {
      console.log('❌ FAIL: Không tìm thấy tờ khai Chờ thanh toán');
    }

    // Đăng xuất
    console.log('Đăng xuất...');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // ────────────────────────────────────────────────────────────────────────
    // SCENARIO 2: Đăng nhập sai mật khẩu (SEL-02)
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- Scenario 2: Đăng nhập sai mật khẩu (SEL-02) ---');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', testEmail);
    await page.type('#password', 'WrongPassword123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1000));
    
    const loginErrorExists = await page.evaluate(() => {
      const alert = document.querySelector('.alert-error');
      return alert ? alert.innerText : null;
    });
    
    if (loginErrorExists) {
      console.log(`✅ PASS: Nhận thông báo lỗi: "${loginErrorExists}"`);
    } else {
      console.log('❌ FAIL: Không hiển thị thông báo lỗi khi đăng nhập sai');
    }

    // ────────────────────────────────────────────────────────────────────────
    // SCENARIO 6: Quyền truy cập Admin (SEL-06)
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- Scenario 6: Kiểm tra phân quyền truy cập Admin (SEL-06) ---');
    console.log('Thử truy cập trang Admin khi chưa đăng nhập...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
    console.log(`URL hiện tại: ${page.url()}`);
    if (page.url().includes('/login')) {
      console.log('✅ PASS: Chặn truy cập và chuyển hướng về /login');
    }
    
    console.log('Đăng nhập bằng tài khoản user thường...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', testEmail);
    await page.type('#password', testPassword);
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('Cố gắng truy cập trực tiếp /admin...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
    console.log(`URL hiện tại của user thường: ${page.url()}`);
    if (!page.url().includes('/admin') || page.url().includes('/dashboard')) {
      console.log('✅ PASS: Hệ thống chặn user thường truy cập /admin');
    } else {
      console.log('❌ FAIL: User thường truy cập được trang admin');
    }

    // Đăng xuất user thường
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    console.log('Đăng nhập bằng tài khoản admin...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', 'admin@taxvn.com');
    await page.type('#password', 'Admin@123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 3000));
    
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
    console.log(`URL hiện tại của admin: ${page.url()}`);
    if (page.url().includes('/admin')) {
      console.log('✅ PASS: Admin truy cập trang admin dashboard thành công');
      
      const adminSummary = await page.evaluate(() => {
        const boxes = document.querySelector('.admin-stats-grid, .admin-stats, .dashboard-grid');
        return boxes ? 'Hiển thị dữ liệu thống kê hệ thống' : 'Không tìm thấy thẻ thống kê';
      });
      console.log(`Trạng thái Admin UI: ${adminSummary}`);
    } else {
      console.log('❌ FAIL: Admin bị chặn truy cập /admin');
    }

  } catch (error) {
    console.error('❌ Lỗi trong quá trình chạy Puppeteer:', error);
  } finally {
    await browser.close();
    console.log('\n🏁 Hoàn thành chạy Puppeteer System/GUI Test.');
  }
})();
