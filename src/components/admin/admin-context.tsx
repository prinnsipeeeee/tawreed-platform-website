"use client";
import { createContext, useContext, useState, useEffect } from "react";
const messages = {
  en: {
    admin: "Administration",
    suppliers: "Suppliers",
    catalog: "Catalog",
    navbar: "Navigation",
    hero: "Hero",
    acts: "Divisions",
    crew: "Suppliers & clients",
    scenes: "Workflow",
    demo: "Quotation demo",
    model: "Revenue model",
    closing: "Closing",
    footer: "Footer",
    dashboard: "Dashboard",
    landing: "Landing page",
    signIn: "Sign in",
    email: "Email",
    password: "Password",
    logout: "Sign out",
    save: "Save changes",
    cancel: "Cancel",
    create: "Add record",
    edit: "Edit",
    remove: "Delete",
    search: "Search records",
    actions: "Actions",
    visible: "Visible",
    hidden: "Hidden",
    missing: "Missing Arabic",
    all: "All records",
    empty: "No records yet.",
    saved: "Changes saved.",
    confirmDelete: "Delete this record? This cannot be undone.",
    loading: "Loading…",
    imports: "Excel imports",
    documents: "Documents",
    account: "Account",
    template: "Download template",
    preview: "Upload & preview",
    commit: "Confirm import",
    createCount: "Creates",
    updateCount: "Updates",
    errors: "Errors",
    status: "Status",
    filename: "Filename",
    supplier: "Supplier",
    choose: "Choose a supplier",
    upload: "Upload file",
    download: "Download",
    fileHelp: "Excel: .xlsx, 5 MB, 2,000 rows. PDF: 20 MB. Files are private.",
    importHelp:
      "Use the provided template and review all changes before confirming. Any invalid row blocks the complete import.",
    oldPassword: "Current password",
    newPassword: "New password (12+ characters)",
    changePassword: "Change password",
    published: "Saved changes appear on the landing page immediately.",
    records: "Records",
    sections: "Sections",
    translations: "Translations",
    ready: "Ready",
    pending: "Pending",
    failed: "Failed",
    invalid: "Invalid",
    committed: "Imported",
    before: "Before",
    after: "After",
    line: "Row",
    validation: "Check the highlighted fields.",
    unauthorized: "Your session expired. Sign in again.",
    forbidden: "This request is not allowed.",
    invalidCredentials: "Email or password is incorrect.",
    tooManyAttempts: "Too many attempts. Try again in 15 minutes.",
    passwordLength: "Use at least 12 characters and at most 72 UTF-8 bytes.",
    serverError: "The operation failed. Please try again.",
    referencedRecord:
      "This record is referenced. Reassign or remove its catalog/documents first, or hide the record.",
    duplicateKey: "This key already exists.",
    unknownReference: "A supplier, category, or city key was not found.",
    immutableKey: "Stable keys cannot be changed.",
    fixedRecord: "This fixed record can only be edited.",
    baseTierRequired: "The fee tier starting at zero must be retained.",
    invalidFile: "The file contents are invalid.",
    fileLimit: "The file exceeds the permitted size or row limit.",
    invalidTemplate: "Use an unchanged template header and a single worksheet.",
    formulaOrObject: "Formula and rich-object cells are not supported.",
    emptyImport: "The workbook contains no data rows.",
    invalidImport: "Resolve workbook errors and upload again.",
    importChanged:
      "Records changed after this preview. Upload again to review the latest changes.",
    storageConfig: "File storage is not configured for this environment.",
    notFound: "The record was not found.",
    details: "Review details",
    order: "Order",
    filter: "Section",
    welcome: "Manage your platform content",
    intro:
      "Edit your bilingual landing page, suppliers, and price catalog in one place.",
    privacy: "Private administration · Tawreed",
    profile: "Profile",
  },
  ar: {
    admin: "الإدارة",
    suppliers: "الموردون",
    catalog: "الكتالوج",
    navbar: "التنقل",
    hero: "المقدمة",
    acts: "التخصصات",
    crew: "الموردون والعملاء",
    scenes: "خطوات العمل",
    demo: "عرض الأسعار التجريبي",
    model: "نموذج الإيرادات",
    closing: "الخاتمة",
    footer: "التذييل",
    dashboard: "لوحة التحكم",
    landing: "الصفحة الرئيسية",
    signIn: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    logout: "تسجيل الخروج",
    save: "حفظ التغييرات",
    cancel: "إلغاء",
    create: "إضافة سجل",
    edit: "تعديل",
    remove: "حذف",
    search: "البحث في السجلات",
    actions: "الإجراءات",
    visible: "ظاهر",
    hidden: "مخفي",
    missing: "الترجمة العربية ناقصة",
    all: "جميع السجلات",
    empty: "لا توجد سجلات.",
    saved: "تم حفظ التغييرات.",
    confirmDelete: "حذف هذا السجل؟ لا يمكن التراجع عن الحذف.",
    loading: "جارٍ التحميل…",
    imports: "استيراد إكسل",
    documents: "المستندات",
    account: "الحساب",
    template: "تنزيل القالب",
    preview: "رفع ومعاينة",
    commit: "تأكيد الاستيراد",
    createCount: "سجلات جديدة",
    updateCount: "تحديثات",
    errors: "أخطاء",
    status: "الحالة",
    filename: "اسم الملف",
    supplier: "المورد",
    choose: "اختر المورد",
    upload: "رفع الملف",
    download: "تنزيل",
    fileHelp:
      "إكسل: xlsx حتى ٥ ميغابايت و٢٠٠٠ صف. PDF حتى ٢٠ ميغابايت. الملفات خاصة.",
    importHelp:
      "استخدم القالب المرفق وراجع جميع التغييرات قبل التأكيد. وجود صف غير صالح يمنع الاستيراد بالكامل.",
    oldPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة (١٢ حرفاً على الأقل)",
    changePassword: "تغيير كلمة المرور",
    published: "تظهر التغييرات المحفوظة فوراً في الصفحة الرئيسية.",
    records: "السجلات",
    sections: "الأقسام",
    translations: "الترجمات",
    ready: "جاهز",
    pending: "قيد الانتظار",
    failed: "فشل",
    invalid: "غير صالح",
    committed: "تم الاستيراد",
    before: "قبل",
    after: "بعد",
    line: "الصف",
    validation: "تحقق من الحقول المحددة.",
    unauthorized: "انتهت الجلسة. سجّل الدخول مجدداً.",
    forbidden: "هذا الطلب غير مسموح.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    tooManyAttempts: "محاولات كثيرة. أعد المحاولة بعد ١٥ دقيقة.",
    passwordLength: "استخدم ١٢ حرفاً على الأقل وبحد أقصى ٧٢ بايت.",
    serverError: "تعذر تنفيذ العملية. أعد المحاولة.",
    referencedRecord:
      "السجل مستخدم. أعد تعيين الكتالوج أو احذف المستندات أولاً، أو أخفِ السجل.",
    duplicateKey: "المعرّف موجود مسبقاً.",
    unknownReference: "معرّف المورد أو الفئة أو المدينة غير موجود.",
    immutableKey: "لا يمكن تغيير المعرّفات الثابتة.",
    fixedRecord: "يمكن تعديل هذا السجل الثابت فقط.",
    baseTierRequired: "يجب الاحتفاظ بشريحة الرسوم التي تبدأ من صفر.",
    invalidFile: "محتوى الملف غير صالح.",
    fileLimit: "يتجاوز الملف الحد المسموح للحجم أو الصفوف.",
    invalidTemplate: "استخدم عناوين القالب دون تغيير وورقة عمل واحدة.",
    formulaOrObject: "لا يتم قبول الصيغ أو الخلايا المركبة.",
    emptyImport: "لا توجد صفوف بيانات في الملف.",
    invalidImport: "صحح أخطاء الملف ثم ارفعه مجدداً.",
    importChanged:
      "تغيرت السجلات بعد المعاينة. ارفع الملف مجدداً لمراجعة أحدث البيانات.",
    storageConfig: "تخزين الملفات غير مهيأ لهذه البيئة.",
    notFound: "السجل غير موجود.",
    details: "مراجعة التفاصيل",
    order: "الترتيب",
    filter: "القسم",
    welcome: "إدارة محتوى المنصة",
    intro: "إدارة الصفحة باللغتين والموردين وكتالوج الأسعار من مكان واحد.",
    privacy: "إدارة خاصة · منصّة توريد",
    profile: "الملف التعريفي",
  },
};
type Locale = "en" | "ar";
const Context = createContext<{
  locale: Locale;
  toggle: () => void;
  msg: (key: string) => string;
} | null>(null);
export function AdminProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState(initialLocale);
  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);
  const toggle = () => {
    const next = locale === "ar" ? "en" : "ar";
    setLocale(next);
    document.cookie = `admin_locale=${next};path=/;max-age=31536000;samesite=lax`;
  };
  return (
    <Context.Provider
      value={{
        locale,
        toggle,
        msg: (key) => messages[locale][key as keyof typeof messages.en] || key,
      }}
    >
      <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </Context.Provider>
  );
}
export function useAdmin() {
  const context = useContext(Context);
  if (!context) throw new Error("AdminProvider is required");
  return context;
}
export async function api(url: string, body?: unknown, method = "POST") {
  const response = await fetch(url, {
    method: body === undefined ? "GET" : method,
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || "serverError") as Error & {
      details?: { path: string }[];
    };
    error.details = data.details;
    throw error;
  }
  return data;
}
