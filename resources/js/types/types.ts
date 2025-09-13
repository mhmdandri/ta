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
};

export type Pricelist = {
    id: number;
    product_id: number;
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
