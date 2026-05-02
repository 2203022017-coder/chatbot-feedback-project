/**
 * Prisma client singleton (graceful).
 *
 * - npm install + npx prisma generate çalıştırılmadıysa @prisma/client require
 *   edilirken hata atar; bunu yakalayıp prisma=null döndürüyoruz.
 * - Migration yapılmadıysa (dev.db yok) ilk DB sorgusunda hata atar; bu da
 *   index.ts içinde try/catch ile yakalanıyor ve in-memory fallback'e düşülüyor.
 *
 * Yani bu modül şunu garanti eder: "Prisma kurulu olsun ya da olmasın, server
 * her halükârda ayağa kalkar." Mevcut sistem bozulmaz.
 */

let prismaClient: any = null;

try {
  // Dinamik require — eğer paket yoksa bu satır exception atar, biz de yutarız.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client');
  prismaClient = new PrismaClient();
  console.log("✅ Prisma client başlatıldı.");
} catch (err: any) {
  console.warn(
    "⚠️  Prisma client başlatılamadı (in-memory moda düşüldü):",
    err?.message || err
  );
  console.warn(
    "    Persistence için: 'cd backend && npm install && npm run db:setup'"
  );
  prismaClient = null;
}

export default prismaClient;
