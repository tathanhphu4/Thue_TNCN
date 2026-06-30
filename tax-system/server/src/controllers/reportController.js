const mongoose = require('mongoose');
const TaxDeclaration = require('../models/TaxDeclaration');
const User = require('../models/User');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/reports/summary  (admin: tổng quan hệ thống)
exports.getSystemSummary = async (req, res) => {
  try {
    const totalUsers  = await User.countDocuments({ role: 'user' });
    const totalDeclarations = await TaxDeclaration.countDocuments();
    const totalTaxCollected = await TaxDeclaration.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$taxAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDeclarations,
        totalTaxCollected: totalTaxCollected[0]?.total || 0,
      }
    });
  } catch (err) {
    console.error('getSystemSummary error:', err);
    res.status(500).json({ success: false, message: 'Lỗi lấy thống kê hệ thống.' });
  }
};

// GET /api/reports/user  (user: báo cáo cá nhân)
exports.getUserReport = async (req, res) => {
  try {
    const { year } = req.query;
    const query = { user: req.user._id };
    if (year) query.year = parseInt(year);

    const declarations = await TaxDeclaration.find(query).sort({ year: -1, month: -1 });
    const totalTax = declarations.reduce((s, d) => s + d.taxAmount, 0);

    res.json({ success: true, data: { declarations, totalTax } });
  } catch (err) {
    console.error('getUserReport error:', err);
    res.status(500).json({ success: false, message: 'Lỗi lấy báo cáo cá nhân.' });
  }
};

// GET /api/reports/export/pdf/:id  (user: xuất PDF phiếu thuế)
exports.exportPDF = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
    }

    const fs = require('fs');
    const PDFDocument = require('pdfkit');
    
    const declaration = await TaxDeclaration.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user');

    if (!declaration) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tờ khai hoặc bạn không có quyền truy cập.' });
    }

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=to_khai_thue_${req.params.id.slice(-6).toUpperCase()}.pdf`);
    
    doc.pipe(res);

    // Font selection for Vietnamese support
    if (fs.existsSync('C:/Windows/Fonts/arial.ttf')) {
      doc.font('C:/Windows/Fonts/arial.ttf');
    }

    const primaryColor = '#1a3c5e';
    const secondaryColor = '#2c3e50';
    const accentColor = '#27ae60';

    // Header Title
    doc.fillColor(primaryColor).fontSize(16).text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', { align: 'center' });
    doc.fontSize(11).text('Độc lập - Tự do - Hạnh phúc', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(15).text('CHỨNG NHẬN KHAI BÁO & NỘP THUẾ THU NHẬP CÁ NHÂN', { align: 'center', underline: true });
    doc.moveDown(1.5);

    // Declaration Meta
    doc.fillColor(secondaryColor).fontSize(11);
    doc.text(`Mã tờ khai: #${declaration._id.toString().toUpperCase()}`);
    doc.text(`Kỳ tính thuế: ${declaration.declarationType === 'annual' ? `Năm ${declaration.year}` : `Tháng ${declaration.month}/${declaration.year}`}`);
    doc.text(`Ngày khai báo: ${new Date(declaration.createdAt).toLocaleDateString('vi-VN')}`);
    doc.text(`Trạng thái: ${declaration.status === 'paid' ? 'ĐÃ NỘP THUẾ' : 'CHƯA NỘP THUẾ'}`);
    doc.moveDown(1);

    // Divider line
    doc.strokeColor(primaryColor).lineWidth(1.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Section 1: User Info
    doc.fillColor(primaryColor).fontSize(13).text('I. THÔNG TIN NGƯỜI NỘP THUẾ');
    doc.moveDown(0.5);
    doc.fillColor(secondaryColor).fontSize(11);
    
    const user = declaration.user || req.user;
    doc.text(`Họ và tên: ${user.fullName}`);
    doc.text(`Mã số thuế: ${user.taxCode || 'Chưa cập nhật'}`);
    doc.text(`Số CCCD: ${user.idNumber || user.idCard || 'Chưa cập nhật'}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Số điện thoại: ${user.phone || 'Chưa cập nhật'}`);
    doc.moveDown(1);

    // Section 2: Income Details
    doc.fillColor(primaryColor).fontSize(13).text('II. CHI TIẾT THU NHẬP');
    doc.moveDown(0.5);
    doc.fillColor(secondaryColor).fontSize(11);

    if (declaration.incomes && declaration.incomes.length > 0) {
      declaration.incomes.forEach((inc, idx) => {
        const sourceMap = { salary: 'Tiền lương/tiền công', business: 'Kinh doanh', investment: 'Đầu tư', other: 'Khác' };
        const sourceStr = sourceMap[inc.source] || inc.source;
        doc.text(`${idx + 1}. Nguồn: ${sourceStr} ${inc.description ? `(${inc.description})` : ''} - Số tiền: ${inc.amount.toLocaleString('vi-VN')} VND`);
      });
    } else {
      doc.text('Không có thông tin nguồn thu nhập.');
    }
    doc.text(`-> Tổng thu nhập chịu thuế trước giảm trừ: ${declaration.totalIncome.toLocaleString('vi-VN')} VND`);
    doc.moveDown(1);

    // Section 3: Deductions
    doc.fillColor(primaryColor).fontSize(13).text('III. CÁC KHOẢN GIẢM TRỪ');
    doc.moveDown(0.5);
    doc.fillColor(secondaryColor).fontSize(11);

    if (declaration.deductions && declaration.deductions.length > 0) {
      declaration.deductions.forEach((dec) => {
        const typeMap = { personal: 'Bản thân', dependent: 'Người phụ thuộc', insurance: 'Bảo hiểm', charity: 'Từ thiện/Nhân đạo', other: 'Khác' };
        const typeStr = typeMap[dec.type] || dec.type;
        doc.text(`- Giảm trừ ${typeStr}: ${dec.amount.toLocaleString('vi-VN')} VND ${dec.dependents ? `(${dec.dependents} người phụ thuộc)` : ''}`);
      });
    } else {
      const personal = declaration.deductions?.personal || 11000000;
      doc.text(`- Giảm trừ bản thân: ${personal.toLocaleString('vi-VN')} VND`);
      if (declaration.deductions?.dependents > 0) {
        doc.text(`- Giảm trừ người phụ thuộc: ${declaration.deductions.dependents.toLocaleString('vi-VN')} VND`);
      }
      if (declaration.deductions?.insurance > 0) {
        doc.text(`- Giảm trừ bảo hiểm: ${declaration.deductions.insurance.toLocaleString('vi-VN')} VND`);
      }
    }
    doc.text(`-> Tổng các khoản giảm trừ gia cảnh: ${declaration.totalDeduction.toLocaleString('vi-VN')} VND`);
    doc.moveDown(1);

    // Section 4: Tax Calculation Result
    doc.fillColor(primaryColor).fontSize(13).text('IV. KẾT QUẢ TÍNH THUẾ & NỘP THUẾ');
    doc.moveDown(0.5);
    doc.fillColor(secondaryColor).fontSize(11);
    doc.text(`Thu nhập tính thuế: ${declaration.taxableIncome.toLocaleString('vi-VN')} VND`);
    doc.text(`Tổng số thuế TNCN phải nộp: ${declaration.taxAmount.toLocaleString('vi-VN')} VND`);
    
    if (declaration.status === 'paid') {
      doc.fillColor(accentColor).fontSize(12);
      doc.text(`Trạng thái thanh toán: ĐÃ NỘP ĐỦ THUẾ (PAID)`);
      doc.fontSize(11).fillColor(secondaryColor);
      doc.text(`Ngày thanh toán: ${new Date(declaration.paidAt).toLocaleDateString('vi-VN')}`);
      doc.text(`Phương thức thanh toán: ${declaration.paymentMethod}`);
    } else {
      doc.fillColor(primaryColor);
      doc.text(`Trạng thái thanh toán: CHƯA THANH TOÁN (PENDING)`);
    }
    doc.moveDown(2);

    // Footer signature
    doc.fillColor(secondaryColor).fontSize(10);
    const dateNow = new Date();
    doc.text(`Ngày lập chứng nhận: ngày ${dateNow.getDate()} tháng ${dateNow.getMonth() + 1} năm ${dateNow.getFullYear()}`, { align: 'right' });
    doc.moveDown(0.5);
    doc.text('Cơ quan Thuế xác nhận điện tử', { align: 'right' });
    
    doc.end();
  } catch (err) {
    console.error('exportPDF error:', err);
    res.status(500).json({ success: false, message: 'Lỗi xuất PDF.' });
  }
};

// GET /api/reports/export/excel  (admin: xuất Excel tất cả tờ khai)
exports.exportExcel = async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const declarations = await TaxDeclaration.find().populate('user').sort({ createdAt: -1 });

    const statusMap = {
      draft: 'Nháp',
      pending: 'Chờ nộp',
      submitted: 'Đã nộp tờ khai',
      paid: 'Đã nộp thuế',
      overdue: 'Quá hạn',
      cancelled: 'Đã hủy'
    };

    const typeMap = {
      monthly: 'Tháng',
      annual: 'Năm'
    };

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DanhSachKhaiBao');

    worksheet.columns = [
      { header: 'STT', key: 'stt', width: 6 },
      { header: 'Mã Khai Báo', key: 'maKhaiBao', width: 28 },
      { header: 'Người Nộp Thuế', key: 'nguoiNopThue', width: 22 },
      { header: 'Email', key: 'email', width: 22 },
      { header: 'Mã Số Thuế', key: 'maSoThue', width: 16 },
      { header: 'Số CCCD', key: 'soCCCD', width: 16 },
      { header: 'Năm Thuế', key: 'namThue', width: 10 },
      { header: 'Kỳ Tính Thuế', key: 'kyTinhThue', width: 14 },
      { header: 'Chi Tiết Kỳ', key: 'chiTietKy', width: 14 },
      { header: 'Tổng Thu Nhập (VND)', key: 'tongThuNhap', width: 20 },
      { header: 'Tổng Giảm Trừ (VND)', key: 'tongGiamTru', width: 20 },
      { header: 'Thu Nhập Chịu Thuế (VND)', key: 'thuNhapChiuThue', width: 22 },
      { header: 'Thuế Phải Nộp (VND)', key: 'thuePhaiNop', width: 20 },
      { header: 'Trạng Thái', key: 'trangThai', width: 18 },
      { header: 'Ngày Khai Báo', key: 'ngayKhaiBao', width: 14 },
      { header: 'Ngày Nộp Tiền', key: 'ngayNopTien', width: 14 },
      { header: 'Phương Thức Thanh Toán', key: 'phuongThuc', width: 22 },
    ];

    declarations.forEach((d, index) => {
      const u = d.user || {};
      worksheet.addRow({
        stt: index + 1,
        maKhaiBao: d._id.toString().toUpperCase(),
        nguoiNopThue: u.fullName || 'N/A',
        email: u.email || 'N/A',
        maSoThue: u.taxCode || 'N/A',
        soCCCD: u.idNumber || u.idCard || 'N/A',
        namThue: d.year,
        kyTinhThue: typeMap[d.declarationType] || d.declarationType,
        chiTietKy: d.declarationType === 'monthly' ? `Tháng ${d.month}` : 'Cả năm',
        tongThuNhap: d.totalIncome,
        tongGiamTru: d.totalDeduction,
        thuNhapChiuThue: d.taxableIncome,
        thuePhaiNop: d.taxAmount,
        trangThai: statusMap[d.status] || d.status,
        ngayKhaiBao: d.createdAt ? new Date(d.createdAt).toLocaleDateString('vi-VN') : '',
        ngayNopTien: d.paidAt ? new Date(d.paidAt).toLocaleDateString('vi-VN') : 'Chưa nộp',
        phuongThuc: d.paymentMethod || '',
      });
    });

    res.setHeader('Content-Disposition', 'attachment; filename=danh_sach_khai_bao_thue.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('exportExcel error:', err);
    res.status(500).json({ success: false, message: 'Lỗi xuất Excel.' });
  }
};

