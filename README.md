## star_chicken

Đây là một ứng dụng web cho phép người dùng tìm kiếm thông tin từ các sao kê ngân hàng được trích xuất từ file PDF trong đợt đóng góp vào mặt trận tổ quốc đợt bão Yagi.
# Tổng quan

Ứng dụng này xử lý các sao kê ngân hàng từ Vietcombank, Vietinbank và BIDV trong khoảng thời gian từ ngày 1 đến 13 tháng 9. Dữ liệu được trích xuất từ các file PDF, xử lý bằng Python và lưu trữ trong MongoDB. Người dùng có thể tìm kiếm thông tin sao kê thông qua giao diện web.

# Tính năng chính
<ul>
<li>Trích xuất dữ liệu từ file PDF sao kê ngân hàng</li>
<li>Lưu trữ dữ liệu trong MongoDB</li>
<li>Giao diện web cho phép tìm kiếm sao kê</li>
<li>Hiển thị các kết quả phù hợp với từ khóa tìm kiếm</li>
</ul>

# Cấu trúc dự án
```
checkVar/
├── server/
│   ├── server.js
│   └── ...
├── client/
│   ├── srclient/
│   │   ├── assets/
│   │   └── App.jsx
│   └── ...
├── data_processing/
│   ├── pdf/
│   ├── cleanData.py
│   ├── getData-VietinBank.py
│   └── ...
├── .gitignore
└── README.md
```

# Yêu cầu hệ thống

<ol>
<li><strong>Node.js</strong></li>
<li><strong>Python</strong></li>
<li><strong>MongoDB</strong></li>
</ol>   