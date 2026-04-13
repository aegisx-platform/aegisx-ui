import { ErrorMessageConfig } from './error-message.model';

export const ERROR_MESSAGES: Record<string | number, ErrorMessageConfig> = {
  400: {
    code: 400,
    severity: 'warning',
    icon: 'ax:err-alert-triangle',
    featuredIcon: 'axf:err-alert-triangle',
    title: 'ข้อมูลไม่ถูกต้อง',
    description:
      'คำขอที่ส่งไปมีข้อผิดพลาด กรุณาตรวจสอบข้อมูลที่กรอกและลองใหม่อีกครั้ง',
    primaryAction: { label: 'ย้อนกลับ', type: 'navigate', route: '..' },
    technicalLabel: 'ERR_400 · Bad Request',
  },
  401: {
    code: 401,
    severity: 'warning',
    icon: 'ax:err-lock',
    featuredIcon: 'axf:err-lock',
    title: 'กรุณาเข้าสู่ระบบ',
    description:
      'เซสชันของคุณหมดอายุหรือยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ',
    primaryAction: { label: 'เข้าสู่ระบบ', type: 'login' },
    technicalLabel: 'ERR_401 · Unauthorized',
  },
  403: {
    code: 403,
    severity: 'error',
    icon: 'ax:err-ban',
    featuredIcon: 'axf:err-ban',
    title: 'ไม่มีสิทธิ์เข้าถึง',
    description:
      'คุณไม่ได้รับอนุญาตให้เข้าถึงหน้านี้ หากคิดว่าเป็นข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ',
    primaryAction: { label: 'กลับหน้าหลัก', type: 'navigate', route: '/' },
    secondaryAction: { label: 'ติดต่อผู้ดูแลระบบ', type: 'external' },
    technicalLabel: 'ERR_403 · Forbidden',
  },
  404: {
    code: 404,
    severity: 'neutral',
    icon: 'ax:err-search',
    featuredIcon: 'axf:err-search',
    title: 'ไม่พบหน้าที่ต้องการ',
    description:
      'หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือไม่เคยมีอยู่ กรุณาตรวจสอบ URL อีกครั้ง',
    primaryAction: { label: 'กลับหน้าหลัก', type: 'navigate', route: '/' },
    secondaryAction: { label: 'ย้อนกลับ', type: 'navigate', route: '..' },
    technicalLabel: 'ERR_404 · Not Found',
  },
  500: {
    code: 500,
    severity: 'error',
    icon: 'ax:err-shield-alert',
    featuredIcon: 'axf:err-shield-alert',
    title: 'เกิดข้อผิดพลาดภายในระบบ',
    description:
      'ระบบพบปัญหาที่ไม่คาดคิด ทีมพัฒนาได้รับแจ้งแล้ว กรุณาลองใหม่อีกครั้งในภายหลัง',
    primaryAction: { label: 'ลองใหม่อีกครั้ง', type: 'retry' },
    secondaryAction: { label: 'กลับหน้าหลัก', type: 'navigate', route: '/' },
    technicalLabel: 'ERR_500 · Internal Server Error',
  },
  502: {
    code: 502,
    severity: 'error',
    icon: 'ax:err-server-crash',
    featuredIcon: 'axf:err-server-crash',
    title: 'เซิร์ฟเวอร์ไม่ตอบสนอง',
    description:
      'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ปลายทางได้ ระบบอาจกำลังปรับปรุงหรือมีปัญหาชั่วคราว',
    primaryAction: { label: 'ลองใหม่อีกครั้ง', type: 'retry' },
    secondaryAction: { label: 'กลับหน้าหลัก', type: 'navigate', route: '/' },
    technicalLabel: 'ERR_502 · Bad Gateway',
  },
  503: {
    code: 503,
    severity: 'info',
    icon: 'ax:err-wrench',
    featuredIcon: 'axf:err-wrench',
    title: 'ระบบกำลังปรับปรุง',
    description:
      'ขณะนี้ระบบกำลังดำเนินการบำรุงรักษาตามกำหนด กรุณากลับมาอีกครั้งในภายหลัง',
    primaryAction: { label: 'กลับหน้าหลัก', type: 'navigate', route: '/' },
    technicalLabel: 'ERR_503 · Service Unavailable',
  },
  504: {
    code: 504,
    severity: 'warning',
    icon: 'ax:err-clock',
    featuredIcon: 'axf:err-clock',
    title: 'เซิร์ฟเวอร์ตอบกลับช้าเกินไป',
    description:
      'การเชื่อมต่อใช้เวลานานเกินกำหนด อาจเกิดจากข้อมูลจำนวนมากหรือเซิร์ฟเวอร์มีภาระงานสูง',
    primaryAction: { label: 'ลองใหม่อีกครั้ง', type: 'retry' },
    secondaryAction: { label: 'กลับหน้าหลัก', type: 'navigate', route: '/' },
    technicalLabel: 'ERR_504 · Gateway Timeout',
  },
  NETWORK: {
    code: 'NETWORK',
    severity: 'neutral',
    icon: 'ax:err-wifi-off',
    featuredIcon: 'axf:err-wifi-off',
    title: 'ไม่พบการเชื่อมต่ออินเทอร์เน็ต',
    description:
      'กรุณาตรวจสอบการเชื่อมต่อเครือข่ายของคุณ ระบบจะลองเชื่อมต่อใหม่โดยอัตโนมัติเมื่อกลับมาออนไลน์',
    primaryAction: { label: 'ลองใหม่อีกครั้ง', type: 'retry' },
    technicalLabel: 'ERR_NETWORK · Connection Failed',
  },
  DEFAULT: {
    code: 'DEFAULT',
    severity: 'error',
    icon: 'ax:err-circle-alert',
    featuredIcon: 'axf:err-circle-alert',
    title: 'เกิดข้อผิดพลาด',
    description:
      'ระบบพบปัญหาที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง หากปัญหายังคงอยู่ โปรดติดต่อทีมสนับสนุน',
    primaryAction: { label: 'ลองใหม่อีกครั้ง', type: 'retry' },
    secondaryAction: { label: 'กลับหน้าหลัก', type: 'navigate', route: '/' },
    technicalLabel: 'ERR_UNKNOWN',
  },
};
