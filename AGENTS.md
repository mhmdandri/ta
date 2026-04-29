# AGENTS.md

Dokumen ini dibuat untuk membantu AI/agent berikutnya cepat memahami konteks project, area bisnis, dan kondisi implementasi terbaru tanpa harus membaca seluruh codebase dari nol.

## 1. Ringkasan Project

- Nama internal: `cors`
- Stack utama:
  - Backend: Laravel 12, PHP 8.2, Inertia.js
  - Frontend: React 19 + TypeScript + Vite
  - UI: Tailwind CSS 4 + komponen Radix/shadcn-style
- Pola aplikasi:
  - Laravel menangani auth, route, validasi, query, dan business logic
  - React/Inertia menangani page rendering dan interaksi UI
- Domain bisnis:
  - Manajemen pelanggan
  - Manajemen produk
  - Transaksi sales/rental
  - Tracking stok per gudang
  - Return barang rental
  - Dashboard performa
  - Laporan rekap, pendapatan, dan komisi
  - Pengaturan target sales/SPV/manager

## 2. Struktur Modul Utama

- `app/Http/Controllers`
  - `DashboardController.php`: summary dashboard bulanan + chart mingguan + top rental
  - `CustomerController.php`: CRUD pelanggan
  - `ProductController.php`: CRUD produk, listing stok, transfer stok, halaman rental
  - `TransactionController.php`: listing, create, simpan transaksi, confirm transaksi, return barang
  - `TargetController.php`: target manager/SPV/sales berdasarkan role
  - `Report/...`: laporan rekap COR, pendapatan, komisi
- `app/Models`
  - `Product.php`: master produk
  - `ProductStock.php`: stok per gudang
  - `ProductMovement.php`: histori mutasi stok masuk/keluar
  - `Transaction.php`: header transaksi
  - `TransactionItem.php`: item transaksi
  - `Customer.php`, `User.php`, `Pricelist.php`, `SpvTarget.php`, `ManagerTarget.php`, `OfferCounter.php`
- `app/Services`
  - `OfferNumberGenerator.php`: generator nomor penawaran format `0001/COR/K02/MM/YYYY`
- `resources/js/pages`
  - `dashboard.tsx`
  - `customers/*`
  - `product/*`
  - `transactions/*`
  - `targets/index.tsx`
  - `report/*`
- `resources/js/components`
  - komponen shared seperti select customer/product/user, toast, sidebar, PDF transaction
- `routes/web.php`
  - route utama aplikasi
- `database/migrations`
  - skema user, customer, product, transaction, target, offer counter, stok gudang, movement

## 3. Alur Bisnis Inti

### 3.1 Produk

- Produk memiliki `type`:
  - `sewa`
  - `jual`
  - `jasa`
- Harga rental disimpan di tabel pricelist:
  - `price_1_day`, `price_3_days`, `price_5_days`, `price_7_days`, `price_10_days`, `price_30_days`
- Implementasi terbaru mengarah ke stok multi-gudang melalui:
  - `product_stocks`
  - `product_movements`
- Gudang yang tampak dipakai di code saat ini:
  - `01`
  - `02`
  - `04`

### 3.2 Transaksi

- Tipe transaksi di backend:
  - `rental`
  - `sales`
- Saat transaksi dibuat:
  - customer dan sales dipilih
  - detail event/rental diisi
  - item produk dipilih
  - total dihitung di frontend
  - backend tetap melakukan validasi dan menyimpan semua data
- `TransactionController@store` saat ini juga:
  - generate `no_penawaran`
  - lock stok sesuai `product_id + kode_gudang`
  - kurangi stok untuk setiap item
  - catat mutasi `out` ke `product_movements`
  - simpan item transaksi dengan `kode_gudang`
- Status transaksi yang terlihat dipakai sekarang:
  - `submitted`
  - `confirmed`
  - `completed`

### 3.3 Return Rental

- Return dilakukan melalui `POST /transactions/{transaction}/return`
- Backend akan:
  - validasi daftar item return
  - skip produk bertipe `jasa`
  - tambah stok kembali ke gudang terkait
  - catat mutasi `in`
  - ubah status transaksi menjadi `completed`

### 3.4 Dashboard

- Dashboard fokus pada bulan berjalan
- Ringkasan utama:
  - total transaksi
  - total customer
  - total net-net
  - total qty
  - total pricelist
  - total net price
- Role `sales` melihat ringkasan personal
- Role lain cenderung melihat ringkasan global

### 3.5 Laporan

- Rekap COR:
  - daftar transaksi per bulan
  - filter search, sales, status, month
- Pendapatan:
  - membagi pendapatan rental multi-hari menjadi nilai harian
  - ada export CSV
- Komisi:
  - menghitung performa sales, SPV, manager
  - mempertimbangkan target dan rata-rata diskon
  - mendukung SPV yang juga boleh berjualan melalui `is_sales_enabled`

### 3.6 Hirarki User

- Role yang terlihat di code:
  - `admin`
  - `gm`
  - `manager`
  - `spv`
  - `sales`
- Relasi hirarki:
  - sales -> `supervisor_id` -> SPV
  - SPV -> `manager_id` -> manager
  - beberapa SPV/manager bisa juga ikut jualan jika `is_sales_enabled = true`

## 4. Route Penting

- `/dashboard`
- `/customers`
- `/product`
- `/product/rental`
- `/transactions`
- `/targets`
- `/report/rekap/cor`
- `/report/revenue`
- `/report/commisions`

API/helper route yang penting:

- `/products/search`
- `/customer/search`
- `/api/users/search`
- `/pricelists/{productId}`
- `/stock/transfer`
- `/transactions/{transaction}/confirm`
- `/transactions/{transaction}/return`

## 5. Frontend Notes

- Inertia pages berada di `resources/js/pages`
- Type shared untuk transaksi/produk/customer ada di `resources/js/types/types.ts`
- Sidebar utama ada di `resources/js/components/app-sidebar.tsx`
- Form transaksi paling penting ada di `resources/js/pages/transactions/create.tsx`
- Product picker dan customer picker memakai endpoint pencarian async

Catatan frontend transaksi:

- Frontend menghitung:
  - pricelist berdasarkan durasi rental
  - discount per item
  - extra discount global
  - PPN 11%
  - grand total
- Payload item transaksi saat ini mengirim:
  - `product_id`
  - `kode_gudang`
  - `qty`
  - `price`
  - `discount`
  - `discount_percent`
  - `net_price`
  - `net_net`

## 6. Database dan Data Awal

- Ada dump SQL di root: `db_cor.sql`
- Migrasi terbaru yang relevan:
  - `2026_04_16_134101_create_product_stocks_table.php`
  - `2026_04_16_135724_add_kode_gudang_to_transaction_items.php`
  - `2026_04_18_001404_create_product_movements_table.php`
  - `2026_04_18_003736_update_status_enum_on_transactions.php`

Ini menandakan project sedang bertransisi dari stok lama di tabel produk ke stok baru per gudang.

## 7. Kondisi Implementasi Saat Ini

Worktree saat dokumen ini dibuat sedang dalam kondisi tidak bersih. Ada perubahan aktif pada area berikut:

- transaksi
- produk
- dashboard
- laporan komisi
- laporan rekap
- sidebar
- PDF transaksi
- type TypeScript
- routes
- migrasi/model stok gudang dan movement

Fitur yang terlihat sedang aktif dikembangkan:

- stok multi-gudang
- mutasi stok masuk/keluar
- halaman rental produk
- return barang rental
- filter dan tampilan transaksi yang sudah aware gudang

Jika agent berikutnya melanjutkan pekerjaan, cek `git status` dulu sebelum mengubah file agar tidak menimpa pekerjaan yang masih berjalan.

## 8. Known Caveats

Beberapa hal di code saat ini perlu diperhatikan:

- Ada indikasi refactor parsial dari single stock ke multi-warehouse stock. Jangan berasumsi semua controller/view sudah konsisten.
- Beberapa komentar/teks file menunjukkan encoding campuran; hati-hati saat menyunting file lama.
- Ada beberapa inkonsistensi penamaan yang layak dicek sebelum refactor besar, misalnya:
  - `transaction_type` kadang memakai `sales`, kadang ada kode laporan yang memakai `sale`
  - `Product::getTotalStockAttribute()` memanggil `stockts()` yang tampaknya typo
  - update pricelist di `ProductController@update` memakai key `price_1_days`, bukan `price_1_day`
- Route dan UI menggunakan ejaan `commisions`, sementara nama controller/report dimaksudkan untuk komisi.
- Banyak logika bisnis penting masih berada di controller, belum dipisah ke service layer.

Dokumen ini sengaja menyimpan caveat tersebut agar agent berikutnya tidak menganggap seluruh area sudah final.

## 9. Cara Menjalankan Project

Backend + frontend dev:

```bash
composer install
npm install
php artisan migrate
composer run dev
```

Command lain yang relevan:

```bash
php artisan test
npm run types
npm run build
```

## 10. Rekomendasi Saat Melanjutkan Project

Urutan aman untuk agent berikutnya:

1. Jalankan `git status` dan pahami perubahan yang belum committed.
2. Baca `routes/web.php` untuk peta fitur terkini.
3. Baca controller inti sesuai area kerja:
   - `TransactionController`
   - `ProductController`
   - `DashboardController`
   - controller report terkait
4. Cocokkan dengan page React yang terkait.
5. Jika menyentuh stok, selalu cek:
   - `ProductStock`
   - `ProductMovement`
   - `transaction_items.kode_gudang`
6. Jika menyentuh laporan, verifikasi apakah basis tanggal memakai `created_at` atau `rental_start`.

## 11. File yang Paling Bernilai untuk Dibaca Dulu

- `routes/web.php`
- `app/Http/Controllers/TransactionController.php`
- `app/Http/Controllers/ProductController.php`
- `app/Http/Controllers/DashboardController.php`
- `app/Http/Controllers/Report/Komisi/ComissionController.php`
- `app/Http/Controllers/Report/Rekap/CorRekapController.php`
- `resources/js/pages/transactions/create.tsx`
- `resources/js/pages/transactions/show.tsx`
- `resources/js/pages/product/index.tsx`
- `resources/js/pages/product/rental.tsx`
- `resources/js/types/types.ts`

## 12. Tujuan Dokumen Ini

Dokumen ini bukan source of truth absolut. Gunakan sebagai peta cepat untuk memahami:

- project ini aplikasi operasional rental/sales
- area paling sensitif ada di transaksi, stok, dan laporan
- codebase sedang berada di fase transisi menuju stok multi-gudang
- ada pekerjaan aktif yang belum selesai, jadi selalu validasi konteks terbaru di worktree sebelum refactor atau perbaikan besar
