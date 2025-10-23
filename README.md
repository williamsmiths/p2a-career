# P2A ASEAN Career Module
Bạn hoàn toàn đúng. Việc xem xét kỹ lại là cực kỳ cần thiết để đảm bảo nền tảng vững chắc. Sau khi rà soát lại toàn bộ thiết kế cho Module Career, tôi nhận thấy một số điểm quan trọng cần được bổ sung và làm rõ để đạt được đẳng cấp của một nền tảng tuyển dụng chuyên nghiệp, giải quyết triệt để các thiếu sót.

Thiết kế trước đó đã đúng về cấu trúc nhưng **chưa đủ sâu** về các chi tiết nghiệp vụ. Dưới đây là phiên bản **hoàn chỉnh và được rà soát kỹ lưỡng nhất**, bổ sung các yếu tố còn thiếu và tối ưu hóa các luồng nghiệp vụ.

---

### **Những Thiếu sót trong Thiết kế Trước và Hướng Khắc phục**

1.  **Chi tiết CV của Ứng viên còn sơ sài:** Thiếu các bảng quan trọng như `cv_experience` (Kinh nghiệm làm việc), `cv_projects` (Dự án), `cv_certifications` (Chứng chỉ). Điều này làm cho CV không đủ thông tin để nhà tuyển dụng đánh giá.
2.  **Hồ sơ Công ty chưa đủ hấp dẫn:** Thiếu các trường để thể hiện "Thương hiệu nhà tuyển dụng" (Employer Branding) như ảnh văn hóa, chính sách phúc lợi rõ ràng.
3.  **Tính năng cho Người tìm việc còn thiếu:** Chưa có chức năng cơ bản nhưng cực kỳ quan trọng là "Lưu việc làm" (Saved Jobs).
4.  **Chi tiết Tin tuyển dụng chưa đầy đủ:** Thiếu các thuộc tính quan trọng để lọc như "Làm việc từ xa" (Remote) hay "Tuyển gấp" (Urgent).

Dưới đây là bản thiết kế cuối cùng để khắc phục tất cả các điểm trên.

---

### **Thiết kế Cơ sở dữ liệu (DB) Hoàn chỉnh cho Module Career**

#### **Phần 1: Các Bảng Master Data (Không đổi - Đã được tối ưu)**
Các bảng `countries`, `cities`, `districts`, `industries`, `skills`, `position_levels`, `experience_levels`, `company_sizes` đã được tối ưu và giữ nguyên.

#### **Phần 2: Các Bảng Chính (Được Bổ sung và Hoàn thiện)**

```sql
-- Enum cho các trạng thái (Bổ sung để rõ ràng hơn)
CREATE TYPE company_type AS ENUM ('enterprise', 'business_household');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE job_status AS ENUM ('pending', 'approved', 'rejected', 'closed');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'internship', 'contract');
CREATE TYPE application_status AS ENUM ('submitted', 'cv_viewed', 'cv_approved', 'interviewing', 'offered', 'hired', 'rejected');

-- Bảng hồ sơ công ty (HOÀN THIỆN)
CREATE TABLE "companies" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID UNIQUE NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "tax_id" VARCHAR(50) UNIQUE,
    "company_type" company_type NOT NULL DEFAULT 'enterprise',
    "verification_status" verification_status NOT NULL DEFAULT 'unverified',
    "company_size_id" INT REFERENCES "company_sizes"("id"),
    "website" TEXT,
    "description" TEXT,
    "contact_email" VARCHAR(255),
    "contact_phone" VARCHAR(50),
    "city_id" INT REFERENCES "cities"("id"),
    "street_address" TEXT,
    "logo_url" TEXT,
    "banner_url" TEXT,
    -- MỚI: Bổ sung các trường về Employer Branding
    "working_days" VARCHAR(255), -- VD: "Thứ 2 - Thứ 6"
    "overtime_policy" TEXT, -- Chính sách OT
    "company_culture_photos" JSONB, -- Mảng các URL ảnh văn phòng, hoạt động
    "why_you_love_working_here" TEXT, -- Lý do nên làm việc tại đây
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Bảng tin tuyển dụng (HOÀN THIỆN)
CREATE TABLE "jobs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "salary_min" INT,
    "salary_max" INT,
    "job_type" job_type NOT NULL,
    "status" job_status NOT NULL DEFAULT 'pending',
    "deadline" TIMESTAMPTZ,
    "city_id" INT REFERENCES "cities"("id"),
    "position_level_id" INT REFERENCES "position_levels"("id"),
    "experience_level_id" INT REFERENCES "experience_levels"("id"),
    -- MỚI: Bổ sung các trường để lọc và hiển thị
    "is_remote" BOOLEAN DEFAULT false, -- Cho phép làm việc từ xa?
    "is_urgent" BOOLEAN DEFAULT false, -- Cờ tuyển gấp
    "view_count" INT DEFAULT 0, -- Đếm lượt xem tin
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Bảng CV và các thành phần chi tiết (HOÀN THIỆN)
CREATE TABLE "cvs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "career_objective" TEXT,
    "is_public" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- MỚI: Bảng Kinh nghiệm làm việc (Cực kỳ quan trọng)
CREATE TABLE "cv_experience" (
    "id" SERIAL PRIMARY KEY,
    "cv_id" UUID NOT NULL REFERENCES "cvs"("id") ON DELETE CASCADE,
    "company_name" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE, -- Nullable nếu đang làm
    "description" TEXT NOT NULL -- Mô tả chi tiết công việc đã làm
);

-- MỚI: Bảng Dự án đã tham gia
CREATE TABLE "cv_projects" (
    "id" SERIAL PRIMARY KEY,
    "cv_id" UUID NOT NULL REFERENCES "cvs"("id") ON DELETE CASCADE,
    "project_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "project_url" TEXT,
    "start_date" DATE,
    "end_date" DATE
);

-- MỚI: Bảng Chứng chỉ/Giải thưởng
CREATE TABLE "cv_certifications" (
    "id" SERIAL PRIMARY KEY,
    "cv_id" UUID NOT NULL REFERENCES "cvs"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "issued_by" VARCHAR(255), -- Tổ chức cấp
    "issue_date" DATE,
    "credential_url" TEXT -- Link chứng chỉ
);

-- Bảng ứng tuyển (Mini-ATS) - Giữ nguyên, đã đủ chi tiết
CREATE TABLE "job_applications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "job_id" UUID NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
    "cv_id" UUID NOT NULL REFERENCES "cvs"("id"),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "status" application_status NOT NULL DEFAULT 'submitted',
    "recruiter_notes" TEXT,
    "applied_at" TIMESTAMPTZ DEFAULT now(),
    UNIQUE ("job_id", "user_id")
);

-- MỚI: Bảng lưu các công việc mà ứng viên đã thích/lưu lại
CREATE TABLE "saved_jobs" (
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "job_id" UUID NOT NULL REFERENCES "jobs"("id") ON DELETE CASCADE,
    "saved_at" TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY ("user_id", "job_id")
);
```

---

### **Bảng Tóm tắt Các Cải tiến và Lý do**

| Hạng mục | Cải tiến / Bổ sung | Tại sao nó quan trọng? |
| :--- | :--- | :--- |
| **Hồ sơ Ứng viên (CV)** | Thêm các bảng `cv_experience`, `cv_projects`, `cv_certifications`. | **Tăng chiều sâu cho hồ sơ.** Giúp nhà tuyển dụng có đầy đủ thông tin để đánh giá năng lực thực tế của ứng viên, không chỉ qua danh sách kỹ năng. |
| **Thương hiệu Nhà tuyển dụng** | Thêm các trường `working_days`, `overtime_policy`, `company_culture_photos` vào bảng `companies`. | **Tăng sức hấp dẫn.** Giúp công ty không chỉ đăng tin mà còn "quảng bá" văn hóa, môi trường làm việc để thu hút các ứng viên tài năng và phù hợp. |
| **Trải nghiệm Người tìm việc** | Thêm bảng `saved_jobs`. | **Cải thiện trải nghiệm người dùng.** Đây là tính năng cơ bản cho phép ứng viên lưu lại các công việc thú vị để xem xét hoặc nộp hồ sơ sau. |
| **Chi tiết Tin tuyển dụng** | Thêm các trường `is_remote`, `is_urgent`, `view_count` vào bảng `jobs`. | **Tăng hiệu quả tìm kiếm và quản lý.** Cho phép ứng viên lọc các công việc remote. Giúp NTD biết tin đăng nào đang "hot" và gắn cờ "tuyển gấp" để ưu tiên. |

### **Luồng nghiệp vụ được hoàn thiện như thế nào?**

1.  **Hành trình của Ứng viên:**
    *   **Tạo CV:** Giờ đây, ứng viên có thể xây dựng một hồ sơ năng lực **toàn diện**, thêm vào các kinh nghiệm làm việc chi tiết, các dự án đã hoàn thành và chứng chỉ đạt được.
    *   **Tìm việc:** Ứng viên có thể tìm kiếm việc làm, sử dụng các bộ lọc mới như "Làm việc từ xa". Khi thấy một công việc ưng ý nhưng chưa muốn nộp đơn, họ có thể nhấn **"Lưu"** (tạo bản ghi trong `saved_jobs`).
    *   **Quản lý:** Ứng viên có một trang cá nhân để quản lý các CV đã tạo, các công việc đã lưu, và theo dõi trạng thái các công việc đã ứng tuyển.

2.  **Hành trình của Nhà tuyển dụng:**
    *   **Xây dựng Thương hiệu:** NTD đầu tư thời gian để làm phong phú hồ sơ công ty bằng cách thêm ảnh văn phòng, mô tả chính sách làm việc. Hồ sơ này sẽ hiển thị trên mỗi tin đăng của họ.
    *   **Đăng tin:** Khi đăng tin, họ có thể chỉ định rõ đây là vị trí "Tuyển gấp" để thu hút sự chú ý.
    *   **Quản lý Ứng viên (ATS):** Quy trình vẫn như cũ nhưng giờ đây khi click vào một ứng viên, họ sẽ thấy một hồ sơ **đầy đủ thông tin hơn rất nhiều**, giúp việc ra quyết định trở nên dễ dàng và chính xác hơn.

Bản thiết kế này đã được rà soát kỹ lưỡng, đảm bảo tính toàn vẹn, chi tiết và bám sát vào các nghiệp vụ thực tế của một nền tảng tuyển dụng hiện đại.