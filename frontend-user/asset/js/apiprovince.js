// Đợi DOM load xong
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các select element
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');

    // Kiểm tra xem các element có tồn tại không
    if (!provinceSelect || !districtSelect || !wardSelect) {
        console.error('Không tìm thấy các select element');
        return;
    }

    // Base URL
    const API_BASE = 'https://provinces.open-api.vn/api';

    // Lấy danh sách Tỉnh/Thành
    axios.get(`${API_BASE}/p/`)
        .then(res => {
            console.log('Đã load danh sách tỉnh thành:', res.data.length, 'tỉnh');
            // Xóa option mặc định trước khi thêm dữ liệu mới
            provinceSelect.innerHTML = '<option value="">Tỉnh/Thành phố</option>';
            res.data.forEach(province => {
                const option = document.createElement('option');
                option.value = province.code;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Lỗi khi load danh sách tỉnh thành:', err);
        });

    // Khi chọn Tỉnh/Thành → load Quận/Huyện
    provinceSelect.addEventListener('change', () => {
        const provinceCode = provinceSelect.value;
        districtSelect.innerHTML = '<option value="">Quận/Huyện</option>';
        wardSelect.innerHTML = '<option value="">Phường/Xã</option>';

        if (provinceCode) {
            axios.get(`${API_BASE}/p/${provinceCode}?depth=2`)
                .then(res => {
                    console.log('Đã load danh sách quận huyện:', res.data.districts.length, 'quận/huyện');
                    res.data.districts.forEach(district => {
                        const option = document.createElement('option');
                        option.value = district.code;
                        option.textContent = district.name;
                        districtSelect.appendChild(option);
                    });
                })
                .catch(err => {
                    console.error('Lỗi khi load danh sách quận huyện:', err);
                });
        }
    });

    // Khi chọn Quận/Huyện → load Phường/Xã
    districtSelect.addEventListener('change', () => {
        const districtCode = districtSelect.value;
        wardSelect.innerHTML = '<option value="">Phường/Xã</option>';

        if (districtCode) {
            axios.get(`${API_BASE}/d/${districtCode}?depth=2`)
                .then(res => {
                    console.log('Đã load danh sách phường xã:', res.data.wards.length, 'phường/xã');
                    res.data.wards.forEach(ward => {
                        const option = document.createElement('option');
                        option.value = ward.code;
                        option.textContent = ward.name;
                        wardSelect.appendChild(option);
                    });
                })
                .catch(err => {
                    console.error('Lỗi khi load danh sách phường xã:', err);
                });
        }
    });
});
