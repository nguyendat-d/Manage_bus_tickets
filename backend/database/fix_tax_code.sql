-- Fix tax_code để cho phép nhiều nhà xe không có mã số thuế
USE bus_ticket_management;

-- Xóa constraint UNIQUE cũ
ALTER TABLE bus_companies DROP INDEX tax_code;

-- Cập nhật các giá trị rỗng thành NULL
UPDATE bus_companies SET tax_code = NULL WHERE tax_code = '' OR tax_code IS NULL;

-- Thêm lại UNIQUE constraint nhưng cho phép multiple NULL
-- Trong MySQL, UNIQUE constraint cho phép nhiều NULL values
ALTER TABLE bus_companies ADD UNIQUE KEY unique_tax_code (tax_code);

-- Verify
SELECT id, company_name, tax_code, status FROM bus_companies;
