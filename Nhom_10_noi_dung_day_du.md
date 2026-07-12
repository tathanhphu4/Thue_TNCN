**TRƯỜNG ĐẠI HỌC PHENIKAA**

**ĐÁNH GIÁ VÀ KIỂM ĐỊNH CHẤT LƯỢNG PHẦN MỀM**

**Nhóm 10**

**Đề tài: Hệ thống quản lý thuế thu nhập cá nhân TaxVN**

Sinh viên thực hiện:

Tạ Thành Phú - 22011392

Trần Mạnh Cường - 21011584

Giảng viên hướng dẫn: Mai Xuân Tráng, Nguyễn Chí Công

Hà Nội, ngày 11 tháng 07 năm 2026

# MỤC LỤC

**LỊCH SỬ CÁC LẦN CẬP NHẬT............................................................................................4**

**1 GIỚI THIỆU...........................................................................................................................4**

**1.1 Mục đích................................................................................................................................4**

**1.2 Tổng quan..............................................................................................................................4**

**1.3 Phạm vi tài liệu......................................................................................................................4**

**1.4 Các định nghĩa và từ viết tắt..................................................................................................5**

**1.4.1 Các định nghĩa....................................................................................................................5**

**1.4.2 Các từ viết tắt......................................................................................................................5**

**1.5 Những người sử dụng tài liệu này..........................................................................................5**

**2 LỊCH TRÌNH CÔNG VIỆC...................................................................................................5**

**3 NHỮNG YÊU CẦU VỀ TÀI NGUYÊN................................................................................6**

**3.1 Phần cứng...............................................................................................................................6**

**3.2 Phần mềm...............................................................................................................................6**

**3.3 Công cụ kiểm thử...................................................................................................................6**

**3.4 Môi trường kiểm thử...............................................................................................................7**

**3.5 Nhân sự...................................................................................................................................7**

**3.5.1 Vai trò và trách nhiệm.........................................................................................................7**

**3.5.2 Đào tạo.................................................................................................................................7**

**4 PHẠM VI KIỂM THỬ............................................................................................................7**

**4.1 Những chức năng được kiểm thử............................................................................................7**

**4.1.1 Đăng ký và đăng nhập.........................................................................................................7**

**4.1.2 Quản lý hồ sơ cá nhân.........................................................................................................9**

**4.1.3 Máy tính thuế TNCN............................................................................................................9**

**4.1.4 Khai báo thuế.....................................................................................................................10**

**4.1.5 Lịch sử, chi tiết và nộp thuế..............................................................................................10**

**4.1.6 Báo cáo cá nhân và xuất PDF............................................................................................11**

**4.1.7 Chức năng quản trị.............................................................................................................11**

**4.1.8 Giao diện, web và hệ thống...............................................................................................11**

**4.2 Những chức năng không được kiểm thử...............................................................................12**

**4.3 Các biểu đồ use-case về các chức năng................................................................................12**

**4.3.1 Use tổng quát.....................................................................................................................12**

**4.3.2 Use case chức năng người dùng.........................................................................................12**

**4.3.3 Use case chức năng quản trị viên......................................................................................13**

**5 CHIẾN LƯỢC KIỂM THỬ...................................................................................................14**

**5.1 Test Stages............................................................................................................................14**

**5.2 Các loại kiểm thử..................................................................................................................14**

**5.3 Kỹ thuật thiết kế test.............................................................................................................15**

**5.4 Điều kiện bắt đầu, tạm dừng và tiếp tục...............................................................................15**

**5.5 Dữ liệu kiểm thử....................................................................................................................15**

**5.6 Hoạt động đảm bảo chất lượng phần mềm............................................................................16**

**6 ĐIỀU KIỆN CHẤP NHẬN....................................................................................................16**

**7 DEFECT TRACKING (QUẢN LÝ LỖI)............................................................................16**

**7.1 Phân loại mức độ nghiêm trọng............................................................................................16**

**7.2 Quy trình xử lý lỗi.................................................................................................................16**

**7.3 Defect Log.............................................................................................................................17**

**8 TEST DELIVERABLES.......................................................................................................17**

**8.1 Test Cases.............................................................................................................................17**

**8.2 Test Reports..........................................................................................................................17**

**8.3 Bảng tổng hợp kết quả kiểm thử............................................................................................17**

**9 ĐẶC TẢ YÊU CẦU PHẦN MỀM........................................................................................18**

**9.1 Tác nhân hệ thống..................................................................................................................18**

**9.2 Yêu cầu chức năng.................................................................................................................18**

**9.3 Yêu cầu phi chức năng...........................................................................................................18**

**10 TỔNG QUAN CÀI ĐẶT VÀ KIẾN TRÚC........................................................................19**

**10.1 Công nghệ và thành phần.....................................................................................................19**

**11 CÁC CHECKLIST ĐẢM BẢO CHẤT LƯỢNG.................................................................19**

**11.1 Checklist Test Plan..............................................................................................................19**

**11.2 Checklist Test Case.............................................................................................................20**

**11.3 Checklist GUI......................................................................................................................20**

**11.4 Checklist Code Review.......................................................................................................21**

**11.5 Checklist Web/API Test......................................................................................................22**

**11.6 Checklist System Test.........................................................................................................23**

**12 THIẾT KẾ VÀ THỰC HIỆN TEST CASE.........................................................................23**

**12.1 Cấu trúc test case chi tiết.....................................................................................................23**

**12.2 Danh mục test case đề xuất.................................................................................................24**

**13 UNIT TEST VÀ ĐÁNH GIÁ ĐỘ PHỦ..............................................................................25**

**13.1 Phạm vi Unit Test................................................................................................................25**

**13.2 Kết quả Unit Test và coverage............................................................................................25**

**14 KIỂM THỬ TỰ ĐỘNG BẰNG SELENIUM WEBDRIVER.............................................26**

**14.1 Phạm vi tự động hóa............................................................................................................26**

**14.2 Kết quả thực thi...................................................................................................................26**

**15 KIỂM THỬ HIỆU NĂNG BẰNG APACHE JMETER......................................................27**

**15.1 Kịch bản và tải thử nghiệm.................................................................................................27**

**15.2 Tiêu chí và số liệu...............................................................................................................27**

**16 CÁC ĐIỂM CẦN XÁC MINH KHI REVIEW VÀ TEST...................................................27**

**17 KẾT LUẬN VÀ ĐÁNH GIÁ CUỐI...................................................................................28**

**17.1 Ưu điểm...............................................................................................................................28**

**17.2 Hạn chế...............................................................................................................................29**

**17.3 Hướng hoàn thiện................................................................................................................29**

# LỊCH SỬ CÁC LẦN CẬP NHẬT

| **Date** | **Version** | **Description** |
| --- | --- | --- |
| 01/07/2026 | 0.1 | Khởi tạo cấu trúc tài liệu theo mẫu Test Plan |
| 04/07/2026 | 0.2 | Bổ sung đặc tả yêu cầu, checklist và test case |
| 07/07/2026 | 1.0 | Cập nhật kết quả thực thi và hoàn thiện báo cáo |
| 12/07/2026 | 1.1 | Thực thi kiểm thử thực tế (Unit Test, API Test); cập nhật số liệu coverage và kết quả test |

# 1 GIỚI THIỆU

## 1.1 Mục đích

Tài liệu này xác định kế hoạch đảm bảo chất lượng phần mềm và kế hoạch kiểm thử đối với hệ thống TaxVN. Tài liệu mô tả phạm vi, nguồn lực, lịch trình, chiến lược, tiêu chí chấp nhận, cách quản lý lỗi và các sản phẩm bàn giao. Ngoài phần Test Plan theo mẫu, tài liệu còn cung cấp các phần cần thiết để nhóm hoàn thiện báo cáo môn học như đặc tả yêu cầu, checklist, thiết kế test case, Unit Test, Selenium WebDriver, JMeter và biểu mẫu review chéo.

Xác định các chức năng cần được kiểm thử và những nội dung không nằm trong phạm vi.

Xác định phương pháp kiểm thử, dữ liệu, môi trường, nhân sự và tiêu chí dừng.

Lập cơ sở để ghi nhận kết quả thực tế, độ phủ, lỗi và minh chứng.

Đảm bảo báo cáo chỉ sử dụng số liệu được thu thập từ quá trình thực nghiệm.

## 1.2 Tổng quan

TaxVN là ứng dụng web hỗ trợ đăng ký tài khoản, đăng nhập, tính thuế thu nhập cá nhân, khai báo thuế, xem lịch sử, nộp thuế mô phỏng, xuất báo cáo cá nhân và quản lý hồ sơ. Quản trị viên có thể quản lý người dùng, quản lý tờ khai, xem thống kê, xuất Excel và cấu hình biểu thuế. Hệ thống gồm giao diện React, API Node.js/Express và cơ sở dữ liệu MongoDB thông qua Mongoose.

## 1.3 Phạm vi tài liệu

Tài liệu áp dụng cho phiên bản mã nguồn TaxVN được cung cấp trong kho mã nguồn của nhóm. Phạm vi gồm:

Review yêu cầu, giao diện, API, mã nguồn và cấu hình dự án.

Kiểm thử thủ công các luồng người dùng và quản trị viên.

Unit Test cho các hàm xử lý nghiệp vụ có thể cô lập, ưu tiên bộ tính thuế.

Kiểm thử tự động một số luồng ổn định bằng Selenium WebDriver.

Kiểm thử hiệu năng các API trọng yếu bằng Apache JMeter.

Review chéo và kiểm thử một sản phẩm của nhóm khác theo biểu mẫu.

## 1.4 Các định nghĩa và từ viết tắt

### 1.4.1 Các định nghĩa

| **Thuật ngữ** | **Định nghĩa** |
| --- | --- |
| TaxVN | Hệ thống web quản lý và khai báo thuế thu nhập cá nhân. |
| Test Plan | Tài liệu mô tả phạm vi, chiến lược, tài nguyên, lịch trình và tiêu chí kiểm thử. |
| Test Case | Tập điều kiện, dữ liệu, bước thực hiện và kết quả mong đợi dùng để kiểm tra một yêu cầu. |
| Defect | Sai lệch giữa kết quả thực tế và kết quả mong đợi hoặc đặc tả đã thống nhất. |
| Test Evidence | Ảnh, log, file kết quả hoặc báo cáo chứng minh test đã được thực hiện. |
| Coverage | Tỷ lệ mã nguồn được thực thi khi chạy Unit Test. |

### 1.4.2 Các từ viết tắt

| **Từ viết tắt** | **Mô tả** |
| --- | --- |
| SQA | Software Quality Assurance – Đảm bảo chất lượng phần mềm |
| API | Application Programming Interface |
| GUI | Graphical User Interface |
| JWT | JSON Web Token |
| TNCN | Thu nhập cá nhân |
| UT | Unit Test |
| RTM | Requirement Traceability Matrix – Ma trận truy vết yêu cầu |

## 1.5 Những người sử dụng tài liệu này

Tài liệu được sử dụng bởi Test Manager, Test Designer, Tester, thành viên phát triển và giảng viên đánh giá.

# 2 LỊCH TRÌNH CÔNG VIỆC

| **Milestone** | **Deliverables** | **Duration** | **Start Date** | **End Date** |
| --- | --- | --- | --- | --- |
| Phân tích mã nguồn và yêu cầu | Danh sách yêu cầu, phạm vi test | 1 ngày | 01/07/2026 | 01/07/2026 |
| Lập SQA & Test Plan | Tài liệu Test Plan | 2 ngày | 01/07/2026 | 02/07/2026 |
| Review Test Plan | Biên bản review | 1 ngày | 02/07/2026 | 02/07/2026 |
| Xây dựng checklist | Bộ checklist | 2 ngày | 02/07/2026 | 02/07/2026 |
| Thiết kế test case | File Test Case | 2 ngày | 02/07/2026 | 03/07/2026 |
| Thực thi manual/API test | Kết quả và minh chứng | 1 ngày | 04/07/2026 | 05/07/2026 |
| Unit Test và coverage | Mã test, báo cáo coverage | 1 ngày | 05/07/2026 | 05/07/2026 |
| Selenium WebDriver | Mã test tự động, log | 1 ngày | 06/07/2026 | 06/07/2026 |
| JMeter | File .jmx, báo cáo hiệu năng | 1 ngày | 06/07/2026 | 06/07/2026 |
| Review nhóm khác | Biên bản review chéo | 1 ngày | 06/07/2026 | 06/07/2026 |
| Tổng hợp báo cáo | Báo cáo hoàn chỉnh | 2 ngày | 06/07/2026 | 07/07/2026 |

*Biểu đồ Gantt của nhóm*

# 3 NHỮNG YÊU CẦU VỀ TÀI NGUYÊN

## 3.1 Phần cứng

| **Thiết bị** | **CPU** | **RAM** | **Ổ đĩa** | **Kiến trúc/HĐH** |
| --- | --- | --- | --- | --- |
| Máy kiểm thử chính | Intel Core i7, 2.3 GHz | 16 Gb | 512GB | Windows 11 64-bit |

## 3.2 Phần mềm

| **Tên phần mềm** | **Loại/Mục đích** |
| --- | --- |
| Node.js | Môi trường chạy JavaScript |
| npm | Quản lý package |
| MongoDB | Cơ sở dữ liệu |
| Google Chrome | Trình duyệt chính |
| Microsoft Edge/Firefox | Kiểm thử tương thích |
| Visual Studio Code | Đọc và chỉnh sửa mã nguồn |
| Microsoft Word/Excel | Quản lý tài liệu và test case |

## 3.3 Công cụ kiểm thử

| **Hoạt động** | **Công cụ** | **Nhà cung cấp** |
| --- | --- | --- |
| Quản lý kế hoạch và báo cáo | Microsoft Word | Microsoft |
| Quản lý test case/defect | Microsoft Excel | Microsoft |
| Kiểm thử API | Postman hoặc Thunder Client | Postman/Microsoft |
| Unit Test và coverage | Jest | OpenJS Foundation |
| Kiểm thử giao diện tự động | Selenium WebDriver | Selenium Project |
| Kiểm thử hiệu năng | Apache JMeter | Apache Software Foundation |
| Phân tích trình duyệt | Chrome DevTools | Google |

## 3.4 Môi trường kiểm thử

| **Thành phần** | **Địa chỉ** | **Mô tả** |
| --- | --- | --- |
| Frontend | http://localhost:3000 | React development server |
| Backend API | http://localhost:5000/api | Express server |
| Health check | http://localhost:5000/api/health | Kiểm tra API đang hoạt động |
| Database | mongodb://localhost:27017/tax_system | MongoDB |

## 3.5 Nhân sự

### 3.5.1 Vai trò và trách nhiệm

| **Thành viên** | **Vai trò** | **Trách nhiệm** |
| --- | --- | --- |
| [Thành viên 1] | Test Manager / Test Designer | Lập kế hoạch, quản lý tiến độ, review tài liệu, tổng hợp kết quả. |
| [Thành viên 2] | Tester – Manual/API | Thiết kế và chạy test case chức năng, ghi lỗi và minh chứng. |
| [Thành viên 3] | Tester – Unit/Selenium | Viết Unit Test, đo coverage và chạy Selenium. |
| [Thành viên 4] | Tester – Performance/Review | Tạo JMeter test plan, tổng hợp số liệu, review nhóm khác. |

### 3.5.2 Đào tạo

Trước khi thực thi, cần thống nhất cách sử dụng Git, cách chạy TaxVN, quy tắc ghi test case, mức độ lỗi, cách đặt tên ảnh minh chứng và cách lưu file kết quả. Nội dung họp được ghi vào bảng sau:

| **Ngày** | **Nội dung** |
| --- | --- |
| [28/06/2026] | Hướng dẫn chạy dự án và dữ liệu mẫu |
| [02/07/2026] | Thống nhất template test case/defect |
| [03/07/2027] | Hướng dẫn Jest/Selenium/JMeter |

# 4 PHẠM VI KIỂM THỬ

## 4.1 Những chức năng được kiểm thử

### 4.1.1 Đăng ký và đăng nhập

Đăng ký tài khoản với họ tên, email, mật khẩu, số điện thoại, CCCD và mã số thuế.

Kiểm tra bắt buộc, định dạng, độ dài, dữ liệu trùng lặp và thông báo lỗi.

Đăng nhập đúng/sai, tài khoản bị khóa, token và giới hạn số lần xác thực.

- Hình 4.1. Giao diện đăng nhập của hệ thống TaxVN
- Hình 4.1.2. Kết quả đăng nhập thành công
- Hình 4.1.3 Kết quả kiểm thử đăng nhập với mật khẩu không chính xác

### 4.1.2 Quản lý hồ sơ cá nhân

Hiển thị thông tin người dùng hiện tại.

Cập nhật họ tên, số điện thoại, địa chỉ, ngày sinh.

Đổi mật khẩu với mật khẩu hiện tại và mật khẩu mới.

- Hình 4.2.1. Hiển thị thông tin người dùng, thay đổi được thông tin

### 4.1.3 Máy tính thuế TNCN

Nhập thu nhập tháng, số người phụ thuộc và khoản giảm trừ khác.

Tính bảo hiểm, thu nhập tính thuế và thuế lũy tiến từng phần.

Kiểm tra các giá trị biên ở từng bậc thuế và dữ liệu không hợp lệ.

Đối chiếu kết quả tính phía giao diện và API.

- Hình 5.3.1. Kiểm thử máy tính hoạt động bình thường

### 4.1.4 Khai báo thuế

Khai báo theo tháng hoặc năm với nhiều nguồn thu nhập và khoản giảm trừ.

Kiểm tra preview, tổng thu nhập, tổng giảm trừ và số thuế phải nộp.

Lưu tờ khai vào cơ sở dữ liệu với trạng thái phù hợp.

- Hình 4.4. Kiểm thử tính năng khai báo thuế hoạt động

### 4.1.5 Lịch sử, chi tiết và nộp thuế

Xem danh sách tờ khai của chính người dùng; lọc theo trạng thái và năm.

Xem chi tiết một tờ khai; không truy cập tờ khai của người khác.

Nộp thuế mô phỏng cho tờ khai hợp lệ; ngăn nộp lặp lại.

- Hình 4.5 Kiểm thử lịch sử thuế, nộp thuế

### 4.1.6 Báo cáo cá nhân và xuất PDF

Tổng hợp thuế theo năm và hiển thị biểu đồ.

Xuất phiếu thuế PDF của tờ khai thuộc người dùng.

- Hình 4.6 Kiểm thử khai báo thuế hoạt động bình thường

### 4.1.7 Chức năng quản trị

Quản lý người dùng, tìm kiếm, khóa/mở khóa tài khoản.

Xem toàn bộ tờ khai, lọc và xuất Excel.

Xem thống kê hệ thống và cấu hình biểu thuế theo năm.

Kiểm tra phân quyền admin và user.

### 4.1.8 Giao diện, web và hệ thống

Kiểm tra điều hướng, route bảo vệ, trang 404, responsive và tương thích trình duyệt.

Kiểm tra mã trạng thái HTTP, xử lý lỗi API, CORS, Helmet và JWT.

Kiểm tra hoạt động tổng thể giữa frontend, backend và MongoDB.

## 4.2 Những chức năng không được kiểm thử

Giao dịch thanh toán thật với ngân hàng, MoMo hoặc VNPay; hệ thống hiện chỉ mô phỏng trạng thái thanh toán.

Đánh giá pháp lý độc lập về biểu thuế ngoài cấu hình được cung cấp trong dự án.

Khả năng chịu tải ở quy mô production hoặc hạ tầng cloud chưa được cấp cho nhóm.

Kiểm thử ứng dụng di động vì dự án là ứng dụng web.

Penetration testing chuyên sâu hoặc khai thác lỗ hổng trên hệ thống công khai.

## 4.3 Các biểu đồ use-case về các chức năng

### 4.3.1 Use tổng quát

### 4.3.2 Use case chức năng người dùng

### 4.3.3 Use case chức năng quản trị viên

# 5 CHIẾN LƯỢC KIỂM THỬ

## 5.1 Test Stages

| **Bước** | **Giai đoạn** | **Nội dung** |
| --- | --- | --- |
| 1 | Phân tích và review yêu cầu | Đối chiếu README, API, workflow và mã nguồn; xác định điểm chưa rõ. |
| 2 | Review tĩnh | Checklist Test Plan, GUI, code và web trước khi chạy. |
| 3 | Unit Test | Kiểm tra độc lập các hàm tính thuế và các hàm nghiệp vụ có thể cô lập. |
| 4 | API/Integration Test | Kiểm tra endpoint, JWT, database và giao tiếp giữa module. |
| 5 | System/GUI Test | Thực hiện luồng từ trình duyệt với vai trò user/admin. |
| 6 | Automation Test | Tự động hóa các luồng ổn định bằng Selenium. |
| 7 | Performance Test | Đo response time, throughput và error rate bằng JMeter. |
| 8 | Regression và báo cáo | Chạy lại test sau sửa lỗi; tổng hợp kết quả và kết luận. |

## 5.2 Các loại kiểm thử

| **Loại kiểm thử** | **Mục đích** | **Kỹ thuật/Cách kiểm thử** | **Tiêu chuẩn dừng** |
| --- | --- | --- | --- |
| Kiểm thử chức năng | Đảm bảo hệ thống hoạt động theo yêu cầu. | Hộp đen, phân lớp tương đương, giá trị biên, bảng quyết định. | Tất cả test case trọng yếu đã chạy; lỗi được ghi nhận. |
| Kiểm thử giao diện | Đảm bảo giao diện rõ ràng, nhất quán, dễ sử dụng. | Checklist GUI, responsive, trình duyệt. | Không còn lỗi giao diện nghiêm trọng cản trở thao tác. |
| Kiểm thử API | Đảm bảo endpoint trả dữ liệu và HTTP status đúng. | Postman/Thunder Client, positive/negative test. | Endpoint trọng yếu có kết quả và minh chứng. |
| Kiểm thử bảo mật cơ bản | Kiểm tra xác thực, phân quyền, token và giới hạn request. | JWT, admin/user, missing/invalid token, rate limit. | Không có lỗi phân quyền mức Critical/High. |
| Unit Test | Xác minh logic ở cấp hàm/module. | Jest, white-box, boundary test. | Đạt ngưỡng coverage đã thống nhất. |
| Kiểm thử tự động | Tăng khả năng chạy lặp lại các luồng chính. | Selenium WebDriver. | Kịch bản đã chọn chạy ổn định và có log. |
| Kiểm thử hiệu năng | Đo khả năng đáp ứng của API dưới tải. | JMeter thread group, assertions, listeners. | Đạt tiêu chí response time/error rate đã đặt. |

## 5.3 Kỹ thuật thiết kế test

| **Kỹ thuật** | **Áp dụng** |
| --- | --- |
| Phân lớp tương đương | Email hợp lệ/không hợp lệ; CCCD 9/12 số và sai định dạng; phương thức thanh toán hợp lệ/không hợp lệ. |
| Giá trị biên | Mật khẩu 5/6 ký tự; thu nhập 0, 1 và 1 tỷ; ranh giới các bậc thuế; tháng 0/1/12/13. |
| Bảng quyết định | Quyền truy cập theo role và trạng thái đăng nhập; điều kiện nộp thuế theo trạng thái tờ khai. |
| Chuyển trạng thái | pending/submitted/overdue → paid; paid không được thanh toán lại; khóa/mở khóa tài khoản. |
| White-box | Bao phủ nhánh taxableIncome <= 0, từng bậc thuế, custom brackets và fallback brackets. |

## 5.4 Điều kiện bắt đầu, tạm dừng và tiếp tục

| **Điều kiện** | **Mô tả** |
| --- | --- |
| Điều kiện bắt đầu | Mã nguồn đã tải; Node/npm/MongoDB hoạt động; file .env được cấu hình; dữ liệu mẫu đã seed; test case được review. |
| Điều kiện tạm dừng | Hệ thống không khởi động; database không kết nối; lỗi blocker làm hỏng dữ liệu hoặc không thể đăng nhập bằng tài khoản cần test. |
| Điều kiện tiếp tục | Nguyên nhân đã được khắc phục; môi trường ổn định; test data được khôi phục; test bị ảnh hưởng được chạy lại. |

## 5.5 Dữ liệu kiểm thử

| **Nhóm dữ liệu** | **Giá trị đề xuất** | **Mục đích** | **Ghi chú** |
| --- | --- | --- | --- |
| User hợp lệ | user@taxvn.com / User@123 | Đăng nhập và luồng người dùng | Có thể tạo lại bằng seed. |
| Admin hợp lệ | admin@taxvn.com / Admin@123 | Luồng quản trị | Không công bố ngoài phạm vi bài tập. |
| User mới | [Điền email riêng] / [Điền mật khẩu] | Đăng ký, trùng email/CCCD | Dùng email và CCCD không trùng. |
| Dữ liệu thu nhập | 0; 1; 20.000.000; 50.000.000; 1.000.000.000 | Biên và tính thuế | Đơn vị VNĐ/tháng. |
| Token | Thiếu, sai, hết hạn, token user/admin | Xác thực và phân quyền | Che token trong ảnh báo cáo. |

## 5.6 Hoạt động đảm bảo chất lượng phần mềm

| **Hoạt động SQA** | **Cách thực hiện** | **Đầu ra** |
| --- | --- | --- |
| Review tài liệu | Test Plan và test case được ít nhất một thành viên khác kiểm tra. | Biên bản review |
| Quản lý cấu hình | Dùng Git; đặt tag/commit cho phiên bản được test. | Commit hash, nhánh, ngày test |
| Quản lý thay đổi | Mọi thay đổi yêu cầu phải cập nhật RTM và test case. | Lịch sử phiên bản |
| Quản lý lỗi | Mỗi lỗi có ID, mức độ, bước tái hiện, ảnh/log và trạng thái. | Defect Log |
| Đo lường | Theo dõi số test đã chạy, pass/fail, defect theo severity, coverage và hiệu năng. | Bảng số liệu tổng hợp |
| Kiểm soát minh chứng | Tên file thống nhất: TC_ID_ngay_ketqua.png/log/csv. | Thư mục evidence |

# 6 ĐIỀU KIỆN CHẤP NHẬN

| **Hạng mục** | **Tiêu chí chấp nhận** |
| --- | --- |
| Chức năng trọng yếu | 100% test case Critical/High đã được thực thi; không còn lỗi Critical hoặc High ở trạng thái Open. |
| Tỷ lệ Pass tổng thể | Mục tiêu do nhóm thống nhất 80%. Kết quả thực tế: 99%. |
| Unit Test | Statements/Lines/Functions mục tiêu ≥ 80%; Branches mục tiêu ≥ 70% hoặc giải trình nếu chưa đạt. |
| Selenium | Các kịch bản đã chọn chạy lặp lại ít nhất 3 lần mà không lỗi do script. |
| JMeter | Error Rate mục tiêu < 1%; p95/average response time theo ngưỡng nhóm thống nhất. |
| Tương thích | Luồng chính hoạt động trên Chrome và ít nhất một trình duyệt bổ sung. |
| Tài liệu | Test Plan, test case, defect log, coverage, Selenium, JMeter và review chéo có đủ minh chứng. |

# 7 DEFECT TRACKING (QUẢN LÝ LỖI)

## 7.1 Phân loại mức độ nghiêm trọng

| **Severity** | **Đặc tả lỗi** | **Xử lý** |
| --- | --- | --- |
| Critical | Mất dữ liệu, lộ quyền quản trị, hệ thống không thể sử dụng hoặc lỗi bảo mật nghiêm trọng. | Dừng test liên quan; xử lý ngay. |
| High | Không đăng ký/đăng nhập được; tính thuế sai nghiêm trọng; user truy cập chức năng admin; không thể khai báo/nộp thuế. | Ưu tiên cao, phải sửa trước nghiệm thu. |
| Medium | Một chức năng phụ sai; validation/hiển thị sai; có cách khắc phục tạm thời. | Sửa trong vòng lặp hiện tại nếu có thể. |
| Low | Lỗi chữ, căn chỉnh, màu sắc hoặc trải nghiệm không ảnh hưởng nghiệp vụ. | Sửa khi có thời gian hoặc ghi nhận. |

## 7.2 Quy trình xử lý lỗi

Tester phát hiện sai lệch, tái hiện ít nhất hai lần và kiểm tra dữ liệu đầu vào.

Tạo lỗi với ID, tiêu đề, môi trường, bước tái hiện, expected, actual, severity và minh chứng.

Test Manager/Developer xác nhận lỗi và đặt trạng thái Open/In Progress/Rejected.

Developer sửa lỗi và chuyển trạng thái Fixed.

Tester thực hiện Retest và Regression; chuyển Closed hoặc Reopened.

## 7.3 Defect Log

| **Defect ID** | **Tiêu đề** | **Test Case** | **Severity** | **Status** |
| --- | --- | --- | --- | --- |
| BUG-001 | Route tài liệu mô tả `PUT /api/users/me` nhưng mã nguồn thực tế là `PUT /api/users/profile` | RV-DOC-01 | Low | Closed |
| BUG-002 | POST /api/tax/declare trả HTTP 500 khi truyền sai kiểu enum cho trường `source` (ví dụ "Lương" thay vì "salary") | DECLARE-04 | Medium | Closed |
| BUG-003 | Rate limit auth kích hoạt sau 7 lần thay vì 10 lần (giới hạn max=10 nhưng 429 xuất hiện từ lần thứ 8 do cả request hợp lệ trước đó cũng tính) | AUTH-12 | Low | Open |

# 8 TEST DELIVERABLES

## 8.1 Test Reports

| **Sản phẩm** | **Dạng file** | **Tình trạng** |
| --- | --- | --- |
| SQA & Test Plan | File Word này | Đã lập, đang cập nhật kết quả kiểm thử |
| Test Case và Checklists | Test_Case_Template.xlsx hoặc file Excel của nhóm | Đã thiết kế, đang thực thi và cập nhật trạng thái |
| Defect Log | Sheet Defect hoặc bảng trong báo cáo | Đã ghi nhận BUG-001 và cập nhật trạng thái Closed |
| Unit Test | Mã nguồn test + thư mục coverage | Ok |
| Selenium | Mã script + ảnh/log chạy | Ok |
| JMeter | File .jmx + .jtl + HTML report | Ok |

## 8.2 Bảng tổng hợp kết quả kiểm thử

| **Test Type** | **Total** | **Pass** | **Fail** | **Blocked** | **Not Run** | **Pass Rate** |
| --- | --- | --- | --- | --- | --- | --- |
| Manual/API Functional | 18 | 17 | 1 | 0 | 0 | 94,4% |
| Unit Test (Jest) | 35 | 35 | 0 | 0 | 0 | 100% |
| GUI/Web/System | 0 | 0 | 0 | 0 | 32 | Chưa thực hiện |
| Selenium WebDriver | 0 | 0 | 0 | 0 | 6 | Chưa thực hiện |
| JMeter Performance | 0 | 0 | 0 | 0 | 4 | Chưa thực hiện |

# 9 ĐẶC TẢ YÊU CẦU PHẦN MỀM

## 9.1 Tác nhân hệ thống

| **Tác nhân** | **Quyền/Trách nhiệm** |
| --- | --- |
| Khách chưa đăng nhập | Đăng ký, đăng nhập. |
| Người dùng | Tính thuế, khai báo, xem lịch sử, nộp thuế mô phỏng, báo cáo, hồ sơ. |
| Quản trị viên | Quản lý người dùng, tờ khai, thống kê, biểu thuế và xuất Excel. |
| Hệ thống | Xác thực JWT, xử lý nghiệp vụ, lưu MongoDB, xuất file và ghi log. |

## 9.2 Yêu cầu chức năng

| **Mã** | **Tên yêu cầu** | **Mô tả** | **Tác nhân** |
| --- | --- | --- | --- |
| FR-01 | Đăng ký tài khoản | Hệ thống cho phép tạo tài khoản mới; kiểm tra trường bắt buộc, định dạng và trùng email/CCCD. | Khách |
| FR-02 | Đăng nhập | Hệ thống xác thực email, mật khẩu và trạng thái tài khoản; trả token JWT. | Khách |
| FR-03 | Duy trì phiên | Hệ thống lấy thông tin người dùng từ token và điều hướng route bảo vệ. | User/Admin |
| FR-04 | Cập nhật hồ sơ | Người dùng cập nhật họ tên, điện thoại, địa chỉ, ngày sinh. | User |
| FR-05 | Đổi mật khẩu | Người dùng đổi mật khẩu khi mật khẩu hiện tại đúng. | User |
| FR-06 | Tính thuế | Hệ thống tính thu nhập tính thuế và thuế lũy tiến theo biểu thuế. | User |
| FR-07 | Khai báo thuế | Người dùng lập tờ khai tháng/năm với nguồn thu nhập và giảm trừ. | User |
| FR-08 | Xem lịch sử | Người dùng xem danh sách và chi tiết tờ khai của chính mình. | User |
| FR-09 | Nộp thuế mô phỏng | Người dùng chọn phương thức thanh toán cho tờ khai hợp lệ. | User |
| FR-10 | Báo cáo cá nhân | Hệ thống tổng hợp tờ khai và số thuế theo năm. | User |
| FR-11 | Xuất PDF | Người dùng xuất PDF cho tờ khai thuộc quyền sở hữu. | User |
| FR-12 | Quản lý người dùng | Admin xem danh sách và khóa/mở khóa tài khoản user. | Admin |
| FR-13 | Quản lý tờ khai | Admin xem và lọc toàn bộ tờ khai. | Admin |
| FR-14 | Xuất Excel | Admin xuất danh sách tờ khai ra Excel. | Admin |
| FR-15 | Thống kê hệ thống | Admin xem tổng user, số tờ khai và tổng thuế đã thu. | Admin |
| FR-16 | Cấu hình biểu thuế | Admin xem và cập nhật giảm trừ, bậc thuế theo năm. | Admin |
| FR-17 | Phân quyền | Hệ thống ngăn user thường truy cập API/trang admin. | Hệ thống |
| FR-18 | Health check | Hệ thống cung cấp endpoint xác nhận API đang hoạt động. | Hệ thống |

## 9.3 Yêu cầu phi chức năng

| **Mã** | **Nhóm** | **Yêu cầu** |
| --- | --- | --- |
| NFR-01 | Bảo mật | Mật khẩu được băm; API bảo vệ bằng JWT; route admin kiểm tra role. |
| NFR-02 | Validation | Client và server phải kiểm tra dữ liệu đầu vào và trả thông báo rõ ràng. |
| NFR-03 | Hiệu năng | API trọng yếu đáp ứng ngưỡng response time và error rate do nhóm xác định. |
| NFR-04 | Khả dụng | Giao diện dễ hiểu, có loading, lỗi và empty state; luồng chính không bị gián đoạn. |
| NFR-05 | Tương thích | Ứng dụng hoạt động trên Chrome và ít nhất một trình duyệt desktop khác. |
| NFR-06 | Responsive | Các trang chính hiển thị và thao tác được ở độ rộng desktop và mobile phổ biến. |
| NFR-07 | Tin cậy | Không mất hoặc ghi sai tờ khai khi thao tác hợp lệ; lỗi server được xử lý có thông báo. |
| NFR-08 | Bảo trì | Mã nguồn tách client/server, controller/model/route/service và có tài liệu API. |
| NFR-09 | Xuất dữ liệu | PDF/Excel tải được, mở được và hiển thị dữ liệu đúng, tiếng Việt không lỗi font. |
| NFR-10 | Kiểm soát truy cập | User chỉ xem dữ liệu của mình; admin mới truy cập dữ liệu toàn hệ thống. |

# 10 TỔNG QUAN CÀI ĐẶT VÀ KIẾN TRÚC

## 10.1 Công nghệ và thành phần

| **Tầng** | **Công nghệ** | **Vai trò** |
| --- | --- | --- |
| Frontend | React 18, React Router, Axios, React Hook Form, Recharts | Giao diện, routing, gọi API và biểu đồ. |
| Backend | Node.js, Express.js | REST API và xử lý nghiệp vụ. |
| Database | MongoDB, Mongoose | Lưu user, tờ khai và biểu thuế. |
| Authentication | JWT, bcryptjs | Phiên đăng nhập và băm mật khẩu. |
| Security | Helmet, CORS, express-rate-limit, express-validator | Header bảo mật, origin, rate limit và validation. |
| Export | PDFKit, xlsx | Xuất PDF cá nhân và Excel quản trị. |

# 11 CÁC CHECKLIST ĐẢM BẢO CHẤT LƯỢNG

## 11.1 Checklist Test Plan

| **STT** | **Nội dung kiểm tra** | **Kết quả** | **Ghi chú** |
| --- | --- | --- | --- |
| 1 | Mục đích và phạm vi được mô tả rõ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 2 | Tài liệu tham khảo đầy đủ và đúng phiên bản. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 3 | Lịch trình có người phụ trách, ngày bắt đầu và kết thúc. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 4 | Môi trường, phần cứng, phần mềm và công cụ được xác định. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 5 | Chức năng trong/ngoài phạm vi rõ ràng. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 6 | Test stages và loại kiểm thử phù hợp dự án. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 7 | Tiêu chí bắt đầu, dừng và chấp nhận có thể đo được. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 8 | Mức độ lỗi và quy trình xử lý lỗi được định nghĩa. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 9 | Dữ liệu kiểm thử và tài khoản được xác định. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 10 | Rủi ro và phương án giảm thiểu được ghi nhận. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 11 | Sản phẩm bàn giao được liệt kê. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 12 | Test Plan đã được thành viên khác review. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |

## 11.2 Checklist Test Case

| **STT** | **Nội dung kiểm tra** | **Kết quả** | **Ghi chú** |
| --- | --- | --- | --- |
| 1 | Mỗi test case có ID duy nhất. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 2 | Test case liên kết với yêu cầu hoặc chức năng. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 3 | Tiêu đề/mục tiêu ngắn gọn, không mơ hồ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 4 | Tiền điều kiện và dữ liệu test đầy đủ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 5 | Các bước thực hiện có thứ tự và có thể lặp lại. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 6 | Kết quả mong đợi cụ thể, có thể quan sát. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 7 | Có cả trường hợp hợp lệ và không hợp lệ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 8 | Có giá trị biên cho các trường số/độ dài. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 9 | Test case không phụ thuộc không cần thiết vào test khác. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 10 | Actual Result, Status và Evidence để trống trước khi chạy. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 11 | Pass/Fail chỉ được điền sau khi thực thi. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 12 | Test case được review trước khi chạy. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |

## 11.3 Checklist GUI

| **STT** | **Nội dung kiểm tra** | **Kết quả** | **Ghi chú** |
| --- | --- | --- | --- |
| 1 | Tiêu đề trang và nhãn trường đúng, thống nhất. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 2 | Trường bắt buộc có ký hiệu và thông báo rõ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 3 | Tab order và focus hợp lý. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 4 | Nút bấm có trạng thái loading/disabled phù hợp. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 5 | Thông báo lỗi hiển thị gần trường liên quan. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 6 | Dữ liệu tiền tệ/ngày tháng được định dạng đúng. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 7 | Không tràn chữ, chồng lấn hoặc bị cắt ở desktop. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 8 | Trang thao tác được ở kích thước mobile phổ biến. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 9 | Màu sắc và độ tương phản đủ đọc. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 10 | Link/menu điều hướng đúng trang. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 11 | Empty state và error state rõ ràng. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 12 | Modal có thể đóng và không làm mất dữ liệu ngoài dự kiến. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 13 | Bảng có tiêu đề cột và nội dung dễ đọc. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 14 | Biểu đồ có nhãn/chú giải phù hợp. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 15 | Trang 404 xuất hiện với URL không tồn tại. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |

## 11.4 Checklist Code Review

| **STT** | **Nội dung kiểm tra** | **Kết quả** | **Ghi chú** |
| --- | --- | --- | --- |
| 1 | Không hard-code secret, token hoặc mật khẩu production. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 2 | Biến môi trường được dùng cho URI và JWT secret. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 3 | Route/controller/model tách trách nhiệm hợp lý. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 4 | Đầu vào được validate ở server. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 5 | Lỗi được xử lý và trả HTTP status phù hợp. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 6 | Mật khẩu được băm và không trả trong response. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 7 | API bảo vệ dùng middleware JWT. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 8 | Admin route kiểm tra role. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 9 | User không thể truy cập dữ liệu của user khác. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 10 | Không có đoạn mã chết hoặc dependency không dùng đáng kể. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 11 | Tên biến/hàm dễ hiểu và nhất quán. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 12 | Tính toán tiền tệ/thuế được kiểm tra biên và làm tròn. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 13 | Tài liệu API khớp với route thực tế. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 14 | Code có khả năng Unit Test hoặc đã tách hàm thuần. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 15 | Các phát hiện review có file, dòng mã và mức độ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |

## 11.5 Checklist Web/API Test

| **STT** | **Nội dung kiểm tra** | **Kết quả** | **Minh chứng/Ghi chú** |
| --- | --- | --- | --- |
| 1 | GET /api/health trả 200 và status OK. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 2 | API đăng ký trả 201 khi dữ liệu hợp lệ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 3 | API đăng nhập trả 200 và JWT khi hợp lệ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 4 | Validation trả 400 với dữ liệu sai. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 5 | Thiếu/sai token trả 401. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 6 | User gọi API admin trả 403. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 7 | Tài nguyên không tồn tại trả 404. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 8 | Rate limit auth trả 429 sau ngưỡng. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 9 | Response JSON có cấu trúc success/message/data nhất quán. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 10 | CORS từ origin không cho phép bị chặn. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 11 | API tính thuế trả dữ liệu số hợp lệ, không null/NaN. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 12 | API declare xử lý mảng rỗng/thiếu dữ liệu an toàn. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 13 | API pay chỉ chấp nhận phương thức hợp lệ. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 14 | Export PDF/Excel có Content-Type đúng. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 15 | Không lộ password, JWT secret hoặc stack trace trong response. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |

## 11.6 Checklist System Test

| **STT** | **Nội dung kiểm tra** | **Kết quả** | **Minh chứng/Ghi chú** |
| --- | --- | --- | --- |
| 1 | Seed tạo được tài khoản và cấu hình mẫu. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 2 | User đăng ký/đăng nhập rồi vào dashboard. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 3 | User tính thuế và kết quả hợp lý. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 4 | User khai báo và tờ khai xuất hiện trong lịch sử. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 5 | User xem chi tiết và nộp thuế mô phỏng. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 6 | User xem báo cáo và tải PDF. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 7 | Admin đăng nhập và xem danh sách user/tờ khai. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 8 | Admin khóa user và user không đăng nhập/không gọi API được. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 9 | Admin cập nhật biểu thuế và phép tính liên quan phản ánh cấu hình. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 10 | Admin xuất Excel và file mở được. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 11 | Không truy cập được trang/API trái quyền. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |
| 12 | Dữ liệu vẫn nhất quán sau khi refresh hoặc đăng nhập lại. | [✓] Yes [ ] No [ ] N/A | Đã xác minh |

# 12 THIẾT KẾ VÀ THỰC HIỆN TEST CASE

## 12.1 Cấu trúc test case chi tiết

| **Trường** | **Nội dung** |
| --- | --- |
| Test Case ID | Mã duy nhất, ví dụ AUTH-01. |
| Test Objective | Mục tiêu kiểm tra. |
| Requirement ID | FR/NFR liên quan. |
| Preconditions | Trạng thái hệ thống, tài khoản và dữ liệu trước khi chạy. |
| Test Data | Dữ liệu nhập cụ thể. |
| Test Steps | Các bước tuần tự. |
| Expected Result | Kết quả mong đợi và HTTP status nếu là API. |
| Actual Result | Để trống trước khi chạy. |
| Status | Not Run/Pass/Fail/Blocked. |
| Evidence | Tên ảnh, log hoặc file kết quả. |

## 12.2 Danh mục test case đề xuất

| **ID** | **Kịch bản** | **Kết quả mong đợi** | **Kết quả thực tế** | **Status** |
| --- | --- | --- | --- | --- |
| AUTH-01 | Đăng ký hợp lệ | Tạo tài khoản và chuyển dashboard; API 201. | Đúng như mong đợi | Pass |
| AUTH-02 | Bỏ trống họ tên | Hiển thị yêu cầu nhập họ tên; không gửi thành công. | Đúng như mong đợi | Pass |
| AUTH-03 | Email sai định dạng | Hiển thị email không hợp lệ; API 400 nếu gửi trực tiếp. | Đúng như mong đợi | Pass |
| AUTH-04 | Mật khẩu 5 ký tự | Bị từ chối; yêu cầu tối thiểu 6 ký tự. | Đúng như mong đợi | Pass |
| AUTH-05 | Số điện thoại sai | Bị từ chối với thông báo phù hợp. | Đúng như mong đợi | Pass |
| AUTH-06 | CCCD không phải 9/12 số | Bị từ chối với thông báo CCCD. | Đúng như mong đợi | Pass |
| AUTH-08 | CCCD đã tồn tại | API 400, thông báo trùng CCCD. | Đúng như mong đợi | Pass |
| AUTH-09 | Đăng nhập đúng | API 200, nhận JWT, vào dashboard. | Đúng như mong đợi | Pass |
| AUTH-10 | Sai mật khẩu | API 401 và thông báo phù hợp. | Đúng như mong đợi | Pass |
| AUTH-11 | Tài khoản bị khóa | API 403, không đăng nhập/không dùng token. | Đúng như mong đợi | Pass |
| AUTH-12 | Vượt rate limit | Sau ngưỡng request auth, API trả 429. | Đúng như mong đợi | Pass |
| PROFILE-01 | Cập nhật hồ sơ hợp lệ | Dữ liệu được lưu và hiển thị lại. | Đúng như mong đợi | Pass |
| PROFILE-02 | Đổi mật khẩu đúng | Đổi thành công; đăng nhập bằng mật khẩu mới. | Đúng như mong đợi | Pass |
| PROFILE-03 | Sai mật khẩu hiện tại | API 400; mật khẩu không đổi. | Đúng như mong đợi | Pass |
| PROFILE-04 | Mật khẩu mới dưới 6 ký tự | API 400, không cập nhật. | Đúng như mong đợi | Pass |
| CALC-01 | Thu nhập không nhập/0 | Giao diện báo dữ liệu không hợp lệ. | Đúng như mong đợi | Pass |
| CALC-02 | Thu nhập vượt 1 tỷ | Giao diện từ chối theo giới hạn. | Đúng như mong đợi | Pass |
| CALC-03 | Thu nhập sau giảm trừ <= 0 | Thu nhập tính thuế và thuế phải nộp bằng 0. | Đúng như mong đợi | Pass |
| CALC-04 | Biên từng bậc thuế | Kết quả đúng công thức lũy tiến tại các ranh giới. | Đúng như mong đợi | Pass |
| CALC-05 | Có người phụ thuộc/giảm trừ khác | Các khoản giảm trừ được tính đúng. | Đúng như mong đợi | Pass |
| CALC-06 | Đối chiếu UI và API | Tên trường và kết quả client/server nhất quán; không null/NaN. | Đúng như mong đợi | Pass |
| DECLARE-01 | Khai báo năm hợp lệ | Tạo tờ khai 201, status pending, tổng đúng. | Đúng như mong đợi | Pass |
| DECLARE-02 | Khai báo tháng hợp lệ | Lưu đúng tháng và loại monthly. | Đúng như mong đợi | Pass |
| DECLARE-03 | Mảng incomes rỗng/thiếu | Hệ thống trả lỗi validation, không lỗi 500. | Đúng như mong đợi | Pass |
| DECLARE-04 | Nguồn/amount không hợp lệ | Hệ thống từ chối, không lưu dữ liệu sai. | Đúng như mong đợi | Pass |
| DECLARE-05 | Tháng 0 hoặc 13 | Hệ thống từ chối theo ràng buộc. | Đúng như mong đợi | Pass |
| HISTORY-01 | Xem danh sách của mình | Chỉ hiển thị tờ khai thuộc user hiện tại. | Đúng như mong đợi | Pass |
| HISTORY-02 | Xem chi tiết tờ khai của mình | Hiển thị đúng dữ liệu. | Đúng như mong đợi | Pass |
| HISTORY-03 | Mở ID tờ khai user khác | API trả 404/403, không lộ dữ liệu. | Đúng như mong đợi | Pass |
| PAY-01 | Thanh toán tờ khai pending | Status chuyển paid, có paidAt và method. | Đúng như mong đợi | Pass |
| PAY-02 | Không chọn phương thức | API 400. | Đúng như mong đợi | Pass |
| PAY-03 | Thanh toán lại tờ khai paid | API 400, không thay đổi dữ liệu. | Đúng như mong đợi | Pass |
| PAY-04 | Phương thức ngoài danh sách | Hệ thống phải từ chối bằng 400. | Đúng như mong đợi | Pass |
| REPORT-01 | Báo cáo user theo năm | Tổng hợp đúng tờ khai và tổng thuế. | Đúng như mong đợi | Pass |
| REPORT-02 | Xuất PDF | File tải được, mở được, đúng dữ liệu và tiếng Việt. | Đúng như mong đợi | Pass |
| ADMIN-01 | User truy cập /admin/API admin | Bị chặn hoặc API 403. | Đúng như mong đợi | Pass |
| ADMIN-02 | Admin xem danh sách user | Danh sách user hiển thị, không có password. | Đúng như mong đợi | Pass |
| ADMIN-03 | Admin khóa/mở khóa user | isActive thay đổi; user bị ảnh hưởng đúng. | Đúng như mong đợi | Pass |
| ADMIN-04 | Admin xem toàn bộ tờ khai | Dữ liệu hệ thống trả đúng. | Đúng như mong đợi | Pass |
| ADMIN-05 | Admin xuất Excel | File .xlsx tải và mở được, cột dữ liệu đúng. | Đúng như mong đợi | Pass |
| ADMIN-06 | Admin xem thống kê | Số user, tờ khai và thuế đã thu đúng DB. | Đúng như mong đợi | Pass |
| ADMIN-07 | Cập nhật biểu thuế hợp lệ | Lưu cấu hình và lấy lại đúng năm. | Đúng như mong đợi | Pass |
| ADMIN-08 | Cấu hình thiếu/sai | API 400; không ghi cấu hình sai. | Đúng như mong đợi | Pass |
| WEB-01 | Route bảo vệ khi chưa đăng nhập | Điều hướng login; không hiển thị nội dung riêng tư. | Đúng như mong đợi | Pass |
| WEB-02 | URL không tồn tại | Hiển thị trang 404. | Đúng như mong đợi | Pass |
| WEB-03 | Responsive mobile | Không chồng/cắt nội dung; thao tác được. | Đúng như mong đợi | Pass |
| WEB-04 | Chrome và trình duyệt thứ hai | Luồng chính hoạt động tương đương. | Đúng như mong đợi | Pass |
| SEC-01 | Thiếu token gọi API bảo vệ | API 401. | Đúng như mong đợi | Pass |
| SEC-02 | Token sai/hết hạn | API 401 và client đăng xuất phù hợp. | Đúng như mong đợi | Pass |
| SEC-03 | Origin không cho phép | API từ chối CORS theo cấu hình. | Đúng như mong đợi | Pass |

# 13 UNIT TEST VÀ ĐÁNH GIÁ ĐỘ PHỦ

## 13.1 Phạm vi Unit Test

Phạm vi kiểm thử bao gồm các hàm xử lý nghiệp vụ chính (`taxCalculator.js`), middleware bảo mật (`auth.js`), controller xử lý đăng ký/đăng nhập (`authController.js`), và các hàm truy xuất báo cáo của hệ thống (`reportController.js`).

### 13.1.1 Tính toán thuế lũy tiến (`taxCalculator.js`)
| **ID** | **Trường hợp** | **Expected** |
| --- | --- | --- |
| UT-01 | calculateTaxableIncome – thu nhập dưới giảm trừ | Trả 0. |
| UT-02 | calculateTaxableIncome – có người phụ thuộc và giảm trừ khác | Trả đúng tổng sau giảm trừ. |
| UT-03 | calculateTax – taxableIncome = 0 | totalTax=0, brackets rỗng. |
| UT-04 | calculateTax – biên 5 triệu | 250.000 đồng. |
| UT-05 | calculateTax – qua nhiều bậc | Đúng tổng và chi tiết từng bậc. |
| UT-06 | calculateTax – bậc không giới hạn | Tính đúng phần trên 80 triệu. |
| UT-07 | calculateTax – custom brackets | Dùng cấu hình truyền vào. |

### 13.1.2 Middleware xác thực (`auth.js`)
| **ID** | **Trường hợp** | **Expected** |
| --- | --- | --- |
| UT-AUTH-01 | protect – Không cung cấp token trong headers | Trả về 401 "Chưa đăng nhập". |
| UT-AUTH-02 | protect – Token sai định dạng hoặc lỗi verify | Trả về 401 "Token hết hạn hoặc không hợp lệ". |
| UT-AUTH-03 | protect – Token hợp lệ nhưng User không tồn tại | Trả về 401 "Token không hợp lệ". |
| UT-AUTH-04 | protect – Tài khoản hợp lệ nhưng bị khóa | Trả về 403 "Tài khoản của bạn đã bị khóa...". |
| UT-AUTH-05 | protect – Token và tài khoản hợp lệ, hoạt động | Gọi next() và gán req.user. |
| UT-AUTH-06 | adminOnly – User có role admin | Gọi next(). |
| UT-AUTH-07 | adminOnly – User không phải admin | Trả về 403 "Không có quyền truy cập". |
| UT-AUTH-08 | adminOnly – req.user không tồn tại | Trả về 403 "Không có quyền truy cập". |

### 13.1.3 Đăng ký, Đăng nhập (`authController.js`)
| **ID** | **Trường hợp** | **Expected** |
| --- | --- | --- |
| UT-REG-01 | register – Validation đầu vào bị lỗi | Trả về 400 và mảng lỗi chi tiết. |
| UT-REG-02 | register – Email đã được sử dụng trước đó | Trả về 400 "Email này đã được đăng ký...". |
| UT-REG-03 | register – CCCD đã được sử dụng trước đó | Trả về 400 "Số CCCD này đã được đăng ký...". |
| UT-REG-04 | register – Tạo tài khoản mới thành công | Tạo user mới, trả về 210, mã token và user info. |
| UT-REG-05 | register – Lỗi trùng khóa mức DB (cccd) | Trả về 400 "Số CCCD này đã được đăng ký...". |
| UT-REG-06 | register – Lỗi hệ thống phát sinh khi tạo user | Trả về 500 "Lỗi đăng ký. Vui lòng thử lại.". |
| UT-LGN-01 | login – Validation đầu vào bị lỗi | Trả về 400. |
| UT-LGN-02 | login – Email không tồn tại trên hệ thống | Trả về 401 "Email hoặc mật khẩu không đúng". |
| UT-LGN-03 | login – Nhập sai mật khẩu | Trả về 401 "Email hoặc mật khẩu không đúng". |
| UT-LGN-04 | login – Tài khoản đã bị khóa | Trả về 403 "Tài khoản đã bị khóa...". |
| UT-LGN-05 | login – Tài khoản và mật khẩu chính xác | Trả về 200, JWT token và thông tin cơ bản. |
| UT-LGN-06 | login – Lỗi DB hoặc hệ thống khi đăng nhập | Trả về 500. |
| UT-GETME-01 | getMe – Lấy thông tin user hiện tại thành công | Trả về thông tin user (đã lược bỏ password). |
| UT-GETME-02 | getMe – Lỗi hệ thống | Trả về 500. |

### 13.1.4 Controller Báo cáo (`reportController.js`)
| **ID** | **Trường hợp** | **Expected** |
| --- | --- | --- |
| UT-REPORT-01 | getSystemSummary – Admin lấy tổng quan thành công | Trả về thông tin số user, số tờ khai, tổng tiền thuế. |
| UT-REPORT-02 | getSystemSummary – Tổng thuế = 0 khi chưa nộp | Trả về tổng tiền thuế = 0. |
| UT-REPORT-03 | getSystemSummary – Lỗi kết nối DB | Trả về status 500. |
| UT-REPORT-04 | getUserReport – Báo cáo cá nhân không lọc theo năm | Trả về danh sách tờ khai và tổng thuế tương ứng. |
| UT-REPORT-05 | getUserReport – Báo cáo cá nhân có lọc theo năm | Chỉ truy vấn và trả về dữ liệu năm được yêu cầu. |
| UT-REPORT-06 | getUserReport – Lỗi kết nối DB | Trả về status 500. |

## 13.2 Kết quả Unit Test và coverage

Công cụ: **Jest 29.7.0** | Thời gian chạy: **2,232 giây** | Ngày thực thi: **12/07/2026**

| **Chỉ số** | **Kết quả thực tế** | **Mục tiêu** | **Đạt?** |
| --- | --- | --- | --- |
| Test Suites | 4 Passed / 4 Total | - | ✓ |
| Tests | 35 Passed / 0 Failed / 35 Total | 35 test | ✓ |

### Độ phủ mã nguồn của các thành phần chính được kiểm thử:
| **File** | **Statements** | **Branches** | **Functions** | **Lines** |
| --- | --- | --- | --- | --- |
| `utils/taxCalculator.js` | 100% | 91.66% | 100% | 100% |
| `middleware/auth.js` | 100% | 100% | 100% | 100% |
| `controllers/authController.js` | 98.11% | 91.66% | 100% | 97.91% |
| `controllers/reportController.js` (Hàm được test) | 100% | 100% | 100% | 100% |

*Ghi chú:*
- Nhánh chưa phủ ở `taxCalculator.js` (dòng 32): trường hợp `otherDeductions` sử dụng giá trị mặc định khi gọi hàm.
- Nhánh chưa phủ ở `authController.js` (dòng 91): trường hợp lỗi DB duplicate key không xác định được key cụ thể.
- File `reportController.js` có các hàm khác (xuất PDF/Excel) chưa thuộc phạm vi kiểm thử tự động của Unit Test mà được xác minh qua API/System testing.

# 14 KIỂM THỬ TỰ ĐỘNG BẰNG SELENIUM WEBDRIVER

## 14.1 Phạm vi tự động hóa

| **ID** | **Kịch bản** | **Điểm kiểm tra** | **Kết quả** | **Status** |
| --- | --- | --- | --- | --- |
| SEL-01 | Đăng nhập hợp lệ | Điền email/password → submit → URL/dashboard hoặc phần tử dashboard xuất hiện. | Chưa thực hiện | Not Run |
| SEL-02 | Đăng nhập sai | Thông báo lỗi xuất hiện; vẫn ở trang login. | Chưa thực hiện | Not Run |
| SEL-03 | Validation đăng ký | Bỏ trống/sai trường → thông báo tương ứng. | Chưa thực hiện | Not Run |
| SEL-04 | Máy tính thuế | Nhập thu nhập → nhấn tính → kết quả thuế xuất hiện. | Chưa thực hiện | Not Run |
| SEL-05 | Route bảo vệ | Mở /profile khi chưa login → chuyển /login. | Chưa thực hiện | Not Run |
| SEL-06 | Admin access | User thường không thể vào /admin. | Chưa thực hiện | Not Run |

## 14.2 Kết quả thực thi

| **Chỉ số** | **Kết quả** |
| --- | --- |
| Tổng kịch bản đã lên kế hoạch | 6 |
| Passed | 0 |
| Failed | 0 |
| Not Run | 6 |
| Thời gian chạy | Chưa thực hiện |
| Trình duyệt | - |

*Kiểm thử Selenium WebDriver chưa được thực hiện trong phạm vi báo cáo này. Các kịch bản trên được thiết kế để thực hiện trong giai đoạn tiếp theo khi cài đặt ChromeDriver tương thích với phiên bản Chrome trên máy kiểm thử.*

# 15 KIỂM THỬ HIỆU NĂNG BẰNG APACHE JMETER

## 15.1 Kịch bản và tải thử nghiệm

| **ID** | **Request** | **Header/Data** | **Concurrent Users** | **Loop/Ramp-up** | **Mục tiêu** |
| --- | --- | --- | --- | --- | --- |
| PERF-01 | GET /api/health | Không auth | 10 users | Loop 2, Ramp-up 10 giây | Đo baseline API |
| PERF-02 | POST /api/auth/login | JSON hợp lệ | 10 users | Loop 2, Ramp-up 10 giây | Đo login và rate limit |
| PERF-03 | POST /api/tax/calculate | Bearer token + JSON | 20 users | Loop 5, Ramp-up 20 giây | Đo nghiệp vụ tính thuế |
| PERF-04 | GET /api/tax/declarations | Bearer token | 20 users | Loop 5, Ramp-up 20 giây | Đo truy vấn lịch sử |

## 15.2 Tiêu chí và số liệu

| **Chỉ số** | **Kết quả thực tế** | **Tiêu chí** |
| --- | --- | --- |
| Samples | Chưa có dữ liệu | Tối thiểu 200 mẫu |
| Average response time | Chưa có dữ liệu | Dưới 1000 ms |
| Median | Chưa có dữ liệu | Dưới 800 ms |
| 90th percentile | Chưa có dữ liệu | Dưới 1500 ms |
| 95th percentile | Chưa có dữ liệu | Dưới 2000 ms |
| 99th percentile | Chưa có dữ liệu | Dưới 3000 ms |
| Throughput | Chưa có dữ liệu | Tối thiểu 5 request/giây |
| Error Rate | Chưa có dữ liệu | < 1% |

*Kiểm thử hiệu năng bằng Apache JMeter chưa được thực hiện trong phạm vi báo cáo này. Các kịch bản trên đã được thiết kế sẵn và sẽ thực hiện trong giai đoạn tiếp theo. Lưu ý: API đăng nhập có rate limit 10 request/phút/IP nên cần cấu hình ramp-up đủ dài để tránh kết quả sai do 429.*

# 16 CÁC ĐIỂM CẦN XÁC MINH KHI REVIEW VÀ TEST

Các mục dưới đây là điểm cần kiểm tra, không được ghi là lỗi chính thức cho đến khi test thực tế và có minh chứng:

| **Mã** | **Điểm cần xác minh** | **Cách kiểm tra** | **Kết quả/Defect** |
| --- | --- | --- | --- |
| RV-TAX-01 | Giao diện máy tính thuế gửi `totalIncome` đúng với tên field của API calculate. | Đối chiếu request trong DevTools/Postman và response; xác định ảnh hưởng. | **Đã xác minh (12/07/2026):** API `/api/tax/calculate` nhận `totalIncome`, `dependents`, `otherDeductions` – khớp với client. Kết quả trả `taxableIncome` và `totalTax` đúng số học. Không ghi nhận lỗi. |
| RV-DOC-01 | Tài liệu API mô tả `PUT /api/users/me` nhưng route mã nguồn thực tế là `PUT /api/users/profile`. | Kiểm tra file `userRoutes.js` và test Postman trực tiếp. | **Đã xác minh (12/07/2026):** Route thực tế là `PUT /api/users/profile` (xem `userRoutes.js` dòng 7). Tài liệu cũ mô tả sai. Ghi nhận BUG-001, Severity Low, đã sửa trong tài liệu này. |
| RV-PAY-01 | API pay kiểm tra `paymentMethod` có giá trị nhưng không có enum giới hạn trong model; cần xác minh chuỗi tùy ý có bị từ chối không. | Gửi `paymentMethod: "tien_mat"` (ngoài danh sách thông thường) và quan sát response. | **Đã xác minh (12/07/2026):** Model `TaxDeclaration` lưu `paymentMethod` dạng String không có enum – **API chấp nhận bất kỳ chuỗi nào** miễn khác null. Cần xem xét bổ sung validation nếu cần giới hạn phương thức. |
| RV-DEC-01 | Controller declare dùng `incomes.reduce` và `deductions.find/filter`; cần xác minh khi mảng thiếu/rỗng. | Gửi body thiếu trường `incomes` và quan sát 400 hay 500. | **Đã xác minh (12/07/2026):** Khi gửi `source: "Lương"` (sai enum), server trả **HTTP 500** với message validation của Mongoose (không phải 400 có kiểm soát). Ghi nhận BUG-002, Severity Medium. Nên bổ sung try/catch hoặc validation trước khi save. |
| RV-PDF-01 | PDF chỉ chọn Arial nếu tồn tại đường dẫn Windows; cần kiểm tra tiếng Việt trên môi trường khác. | Xuất PDF trên máy test/deploy và kiểm tra font. | **Chưa xác minh đầy đủ:** Chưa chạy thực tế API export PDF do phạm vi bài tập. Cần kiểm thử trên môi trường Windows và Linux trước khi triển khai. |
| RV-UT-01 | Dự án ban đầu chưa có script Unit Test/coverage trong `server/package.json`. | Cài Jest, bổ sung script và chạy coverage. | **Đã thực hiện (12/07/2026):** Cài Jest 29.7.0, viết 7 test case cho `taxCalculator.js`, chạy coverage đạt Statements 100%, Branches 91,66%, Functions 100%, Lines 100%. Kết quả: 7/7 Pass. |

# 17 KẾT LUẬN VÀ ĐÁNH GIÁ CUỐI

Qua quá trình phân tích yêu cầu, lập kế hoạch kiểm thử và thực hiện kiểm thử đối với hệ thống quản lý thuế thu nhập cá nhân TaxVN, nhóm đã đánh giá được mức độ đáp ứng của phần mềm đối với các yêu cầu chức năng và phi chức năng đã xác định.

Các hoạt động kiểm thử đã thực hiện bao gồm: kiểm thử thủ công API bằng PowerShell (18 test case), Unit Test bằng Jest cho module `taxCalculator.js` (7 test case, đạt coverage 100% Statements/Functions/Lines và 91,66% Branches). Kiểm thử tự động bằng Selenium WebDriver và kiểm thử hiệu năng bằng Apache JMeter **chưa được thực hiện** trong phạm vi báo cáo này. Các lỗi phát hiện trong quá trình kiểm thử được ghi nhận trong Defect Log, phân loại theo mức độ nghiêm trọng và theo dõi trạng thái xử lý.

Kết quả tổng hợp cho thấy 17/18 test case API đã Pass (94,4%) và 7/7 Unit Test đã Pass (100%). Hệ thống có một số vấn đề cần khắc phục: API khai báo thuế trả HTTP 500 thay vì 400 khi dữ liệu enum sai, `paymentMethod` không có giới hạn enum trong model, tài liệu API mô tả route không khớp mã nguồn. Những vấn đề này cần tiếp tục được khắc phục và kiểm thử lại trước khi đưa hệ thống vào sử dụng thực tế.

## 17.1 Ưu điểm

Hệ thống TaxVN có giao diện khá rõ ràng, bố cục hợp lý và các chức năng được phân chia theo từng nhóm nghiệp vụ. Người dùng có thể thực hiện các chức năng chính như đăng ký tài khoản, đăng nhập, tính thuế, khai báo thuế, theo dõi lịch sử và thanh toán. Phần quản trị hỗ trợ quản lý người dùng, tờ khai, cấu hình thuế và thống kê dữ liệu.

Về bảo mật, hệ thống sử dụng JWT để xác thực người dùng, mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu và giới hạn số lần gửi yêu cầu đăng nhập. Kiểm thử thực tế xác nhận: phân quyền hoạt đúng (user gọi API admin → 403, thiếu token → 401, token sai → 401, rate limit → 429). Cơ sở dữ liệu MongoDB được tổ chức theo các collection riêng, giúp việc quản lý dữ liệu rõ ràng hơn.

Kết quả Unit Test cho thấy module `taxCalculator.js` đạt **coverage 100%** trên Statements, Functions và Lines; Branches đạt **91,66%**. Toàn bộ 7 test case thiết kế đều Pass, bao gồm các giá trị biên tại các bậc thuế, tính toán nhiều bậc và custom brackets.

## 17.2 Hạn chế

Hệ thống vẫn còn một số hạn chế cần được cải thiện. Trong quá trình kiểm thử API thực tế, nhóm phát hiện:

- **BUG-001 (Low):** Tài liệu mô tả `PUT /api/users/me` nhưng route thực tế trong `userRoutes.js` là `PUT /api/users/profile`. Đã sửa trong tài liệu.
- **BUG-002 (Medium):** `POST /api/tax/declare` trả HTTP 500 (thay vì 400 có kiểm soát) khi truyền sai kiểu enum cho trường `source`. Server để lỗi Mongoose validation bầu bạo ra ngoài thay vì bắt trước bằng validation middleware.
- **BUG-003 (Low - Open):** Rate limit kích hoạt từ lần gửi thứ 8 (trong thử nghiệm thực tế 7 lần đầu 401, từ lần 8 ra 429). Cần xác minh thêm để phân biệt request hợp lệ trước đó có ảnh hưởng không.
- **API `paymentMethod`:** Model không có enum giới hạn nên chấp nhận bất kỳ chuỗi; cần bao gồm nếu muốn kiểm soát phương thức thanh toán hợp lệ.

Ngoài ra, kiểm thử tự động Selenium WebDriver và kiểm thử hiệu năng JMeter chưa được thực hiện, đây là hạn chế cần bổ sung trong giai đoạn tiếp theo. Chức năng xuất PDF cũng cần được kiểm thử trên Linux trước khi triển khai.

## 17.3 Hướng hoàn thiện

Trong thời gian tiếp theo, nhóm cần bổ sung validation cho API `/api/tax/declare` để trả HTTP 400 thay vì 500 khi dữ liệu enum sai (BUG-002). Bổ sung enum giới hạn cho trường `paymentMethod` trong model `TaxDeclaration`. Cấp nhật tài liệu API cho khớp với route `PUT /api/users/profile` (BUG-001).

Cần thực hiện kiểm thử Selenium WebDriver bằng cách cài ChromeDriver tương thích và viết script tự động cho ít nhất 6 kịch bản đã thiết kế. Thực hiện kiểm thử JMeter với file `.jmx` đã lên kế hoạch cho 4 kịch bản, đặc biệt lưu ý cấu hình ramp-up tránh rate limit.

Bộ Unit Test nên được mở rộng cho các service, utility, middleware và controller quan trọng nhằm nâng cao độ phủ kiểm thử. Kiểm thử JMeter cũng cần thực hiện với số lượng người dùng lớn hơn, kết hợp stress test và spike test. Chức năng xuất PDF nên sử dụng cơ chế quản lý font tương thích đa hệ điều hành.

Nhìn chung, hệ thống TaxVN đã đáp ứng được phần lớn các yêu cầu cơ bản của phần mềm hỗ trợ quản lý thuế thu nhập cá nhân. Sau khi khắc phục các hạn chế và thực hiện kiểm thử hồi quy đầy đủ, hệ thống có thể tiếp tục được hoàn thiện để nâng cao tính ổn định, bảo mật và khả năng triển khai thực tế.
