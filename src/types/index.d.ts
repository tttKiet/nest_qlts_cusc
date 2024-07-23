interface FilterUser {
  skip?: number;
  take?: number;
  loginName?: string;
  phone?: string;
  userMangerName?: string;
  adminName?: string;
  gender?: string;
  email?: string;
  status?: number;
  name?: string;
}

interface IFThematic {
  MACHUYENDE?: number;
  TENCHUYENDE?: string;
  THOIGIANTHONGBAO?: Date;
  THOIGIANTOCHUCCHUYENDE?: Date;
  NOIDUNG?: string;
  MATRUONG?: string;
  SDT?: string;
  page?: number;
  pageSize?: number;
  TRANGTHAI?: number;
}

interface TimeLogin {
  sdt?: string;
  dangnhap?: string;
  maadmin?: string;
  dangxuat?: string;
  tongthoigian: number;
}

interface QueryDataAvailable {
  MATINH?: string;
  MATRUONG?: string;
  YEAR?: string;
  MANGANH?: string;
  MANHOM?: string;
  DAUSO?: 'viettel' | 'vinaphone' | 'mobifone' | 'other' | undefined;
}
