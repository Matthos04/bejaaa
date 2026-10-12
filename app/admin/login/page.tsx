export const dynamic = "force-dynamic";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="container empty" style={{ maxWidth: 520, minHeight: "70vh", paddingBlock: 90 }}>
    <h1>ورود مدیر به‌جا</h1>
    <p>برای ورود به پنل مدیریت، رمز عبور مدیر را وارد کن.</p>
    {error && <p role="alert" className="notice error">رمز درست نیست. دوباره تلاش کن.</p>}
    <form action="/api/admin/login" method="post" style={{ display: "grid", gap: 16, marginTop: 28 }}>
      <label className="field">رمز عبور مدیر<input name="password" type="password" autoComplete="current-password" required /></label>
      <button className="button" type="submit">ورود</button>
    </form>
  </main>;
}
