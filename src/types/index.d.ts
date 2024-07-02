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
  take?: number;
  skip?: number;
}

interface TimeLogin {
  maadmin?: string;
  sdt?: string;
  dangnhap?: string;
  maadmin?: string;
  dangxuat?: string;
  tongthoigian: number;
}

interface QueryDataAvailable {
  MATINH?: string;
  MATRUONG?: string;
  MANGANH?: string;
  MANHOM?: string;
}
