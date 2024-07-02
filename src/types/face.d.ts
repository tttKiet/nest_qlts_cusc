import 'express-session';
declare module 'express-session' {
  interface SessionData {
    timeIn?: string;
    timeOut?: string;
    loginId: string;
  }
}
