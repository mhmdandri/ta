// types.ts
export type Product = {
    id: number;
    code: string;
    name: string;
    description?: string;
    type: 'jual' | 'sewa' | 'jasa';
    price: number;
    stock: number;
    kode_gudang: string;
    price_list?: Pricelist;
};

export type Pricelist = {
    id: number;
    product_id: number;
    price_1_day: number;
    price_3_days: number;
    price_5_days: number;
    price_7_days: number;
    price_10_days: number;
    price_30_days: number;
};

export type User = {
    id: number;
    name: string;
};

export type Customer = {
    id: number;
    name: string;
};

export type TransactionItem = {
    id: number;
    transaction_id: number;
    product_id: number;
    qty: number;
    discount: number;
    discount_percent: number;
    net_net: number;
    price_deal: number;
    price_pricelist: number;
    price: number;
    product: Product;
};
export type Transaction = {
    id: number;
    customer_id: number;
    sales_id: number;
    no_penawaran: string;
    no_po: string;
    kode_gudang: string;
    termin_of_payment: string;
    payment: string;
    operate_fee: number;
    total_pricelist: number;
    price_deal: number;
    total_discount: number;
    total_net: number;
    extra_discount: number;
    total_net_net: number;
    is_ppn: boolean;
    ppn_value: number;
    total_final: number;
    transaction_type: 'sales' | 'rental';
    rental_start?: string;
    rental_end?: string;
    install_date?: string;
    uninstall_date?: string;
    jenis_instalasi?: 'indoor' | 'outdoor' | null;
    location?: string | null;
    delivery?: 'internal' | 'vendor' | null;
    description: string | null;
    rental_duration?: number;
    pic: string;
    created_at: string;
    updated_at: string;
    items: TransactionItem[];
    customer?: Customer;
    sales?: User;
    total_qty: number;
};

export type Link = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginationProps = {
    links: Link[];
    className?: string;
};

export type Item = {
    product: Product | null;
    qty: number;
    price: number;
    discount: number;
    discount_percent: number;
    netPrice: number;
    netNet: number;
    pricelist: number;
};

export type Summary = {
    total_transactions: number;
    total_customers: number;
    total_value: number;
    total_qty: number;
};
export type LinkType = { url: string | null; label: string; active: boolean };
export type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links?: LinkType[];
    meta?: { links?: LinkType[] };
};

export type FormDataProduk = {
    name: string;
    code: string;
    description: string;
    type: string;
    kode_gudang: string;
    stock: number;
    price_1_day: number;
    price_3_days: number;
    price_5_days: number;
    price_10_days: number;
    price_7_days: number;
    price_30_days: number;
};
