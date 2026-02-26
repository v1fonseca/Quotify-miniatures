import { useState, useMemo } from "react"

/* ═══════════════════════════════════════════════════════════
   MINI TRACK — Full flow: Auth → Plan selection → App
   Files to split for production:
   • minitrack-login.jsx     → Auth page
   • minitrack-plans.jsx     → Plans & upgrade page
   • minitrack-preview.tsx   → Main app (already built)
═══════════════════════════════════════════════════════════ */

// ── Google Fonts ──────────────────────────────────────────
if (typeof document !== "undefined") {
  const l = document.createElement("link")
  l.rel = "stylesheet"
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
  document.head.appendChild(l)
}

// ── CSS ───────────────────────────────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#080810; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(139,92,246,.2)} 50%{box-shadow:0 0 44px rgba(139,92,246,.4)} }
  @keyframes floatA   { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-16px) rotate(3deg)} }
  @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(12px) rotate(-4deg)} }
  @keyframes checkIn  { from{transform:scale(0) rotate(-30deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse    { 0%,100%{opacity:.5} 50%{opacity:1} }

  .fu  { animation:fadeUp .45s ease both }
  .fu1 { animation:fadeUp .45s .08s ease both }
  .fu2 { animation:fadeUp .45s .16s ease both }
  .fu3 { animation:fadeUp .45s .24s ease both }
  .fu4 { animation:fadeUp .45s .32s ease both }

  /* fields */
  .f { font-family:'DM Sans',sans-serif; width:100%; padding:13px 16px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; color:#f0f0f8; font-size:14px; outline:none; transition:border-color .2s,background .2s; }
  .f:focus { border-color:rgba(139,92,246,.6); background:rgba(139,92,246,.06); }
  .f::placeholder { color:rgba(240,240,248,.28); }

  /* buttons */
  .btn-p { font-family:'Syne',sans-serif; width:100%; padding:14px; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:10px; color:#fff; font-size:14px; font-weight:700; letter-spacing:.04em; cursor:pointer; transition:opacity .2s,transform .15s; position:relative; overflow:hidden; }
  .btn-p:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); }
  .btn-p:disabled { opacity:.4; cursor:default; }
  .btn-p::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent); background-size:200% 100%; animation:shimmer 2.5s infinite; }
  .btn-g { font-family:'DM Sans',sans-serif; width:100%; padding:13px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; color:rgba(240,240,248,.7); font-size:14px; cursor:pointer; transition:background .2s,color .2s; }
  .btn-g:hover { background:rgba(255,255,255,.07); color:#f0f0f8; }

  .tab { font-family:'Syne',sans-serif; flex:1; padding:11px; background:transparent; border:none; border-radius:8px; font-size:13px; font-weight:600; letter-spacing:.03em; cursor:pointer; transition:all .2s; }
  .tab.on  { background:rgba(139,92,246,.2); color:#c4b5fd; }
  .tab.off { color:rgba(240,240,248,.35); }

  .soc { font-family:'DM Sans',sans-serif; display:flex; align-items:center; justify-content:center; gap:10px; padding:12px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; color:rgba(240,240,248,.7); font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; }
  .soc:hover { background:rgba(255,255,255,.08); color:#f0f0f8; }

  .err { font-family:'DM Sans',sans-serif; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.25); border-radius:8px; padding:10px 14px; font-size:13px; color:#fca5a5; }

  .lbl { font-family:'Syne',sans-serif; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(240,240,248,.38); margin-bottom:6px; }
  .lnk { font-family:'DM Sans',sans-serif; background:none; border:none; color:#a78bfa; cursor:pointer; font-size:13px; padding:0; text-underline-offset:3px; text-decoration:underline; }
  .lnk:hover { color:#c4b5fd; }
  .div { display:flex; align-items:center; gap:14px; }
  .div::before,.div::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.07); }

  /* plan cards */
  .pc { border-radius:20px; padding:26px; transition:transform .25s,box-shadow .25s; position:relative; overflow:hidden; }
  .pc:hover { transform:translateY(-4px); }
  .pc-f { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); }
  .pc-f:hover { box-shadow:0 20px 60px rgba(0,0,0,.4); border-color:rgba(255,255,255,.14); }
  .pc-p { background:linear-gradient(160deg,rgba(109,40,217,.25),rgba(79,70,229,.2)); border:1.5px solid rgba(139,92,246,.4); animation:glow 3s ease-in-out infinite; }
  .pc-p:hover { transform:translateY(-6px); box-shadow:0 32px 80px rgba(109,40,217,.35); }

  .chk { display:flex; align-items:flex-start; gap:10px; font-family:'DM Sans',sans-serif; font-size:13px; color:rgba(240,240,248,.7); line-height:1.5; }
  .chk-y { width:17px; height:17px; border-radius:50%; background:rgba(139,92,246,.25); color:#a78bfa; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:9px; margin-top:1px; }
  .chk-n { width:17px; height:17px; border-radius:50%; background:rgba(255,255,255,.05); color:rgba(255,255,255,.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:9px; margin-top:1px; }
  .chk.dim { color:rgba(240,240,248,.28); }

  .sp { width:17px; height:17px; border:2px solid rgba(255,255,255,.25); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }

  .strength { height:3px; border-radius:2px; transition:all .3s; }

  /* App sidebar (inner app) */
  .app-nav-btn { display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:8px; border:none; cursor:pointer; font-size:13px; font-weight:400; text-align:left; transition:all .2s; font-family:'DM Sans',sans-serif; width:100%; }

  /* Limit bar */
  .lbar { height:5px; border-radius:3px; background:rgba(255,255,255,.07); overflow:hidden; margin-top:4px; }
  .lfill { height:100%; border-radius:3px; transition:width .6s ease; }
`

// ── Helpers ───────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9)
const pwStr = pw => {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++; if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const strLabel = s => ["", "Weak", "Fair", "Good", "Strong"][s]
const strColor = s => ["", "#ef4444", "#f59e0b", "#10b981", "#6366f1"][s]

// ── Shared visual atoms ───────────────────────────────────
const Hex = ({ size = 28, color = "#a78bfa", opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ opacity }}>
    <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill={color} fillOpacity=".15" stroke={color} strokeWidth="1.5" />
    <polygon points="14,7 20,10.5 20,17.5 14,21 8,17.5 8,10.5" fill={color} fillOpacity=".3" />
  </svg>
)

const Bg = ({ soft = false }) => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle,rgba(109,40,217,${soft ? ".08" : ".18"}) 0%,transparent 70%)` }} />
    <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,rgba(79,70,229,${soft ? ".06" : ".14"}) 0%,transparent 70%)` }} />
    {!soft && [
      { top: "8%", left: "6%", size: 44, anim: "floatA 7s ease-in-out infinite", op: .16 },
      { top: "55%", left: "3%", size: 24, anim: "floatB 11s ease-in-out infinite", op: .09 },
      { bottom: "15%", right: "10%", size: 52, anim: "floatA 8s 2s ease-in-out infinite", op: .12 },
      { top: "35%", right: "18%", size: 18, anim: "floatB 13s ease-in-out infinite", op: .07 },
    ].map((h, i) => (
      <div key={i} style={{ position: "absolute", ...h, animation: h.anim }}>
        <Hex size={h.size} opacity={h.op} />
      </div>
    ))}
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(139,92,246,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.035) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
  </div>
)

// ══════════════════════════════════════════════════════════
// AUTH PAGE
// ══════════════════════════════════════════════════════════
function AuthPage({ onAuth }) {
  const [tab, setTab] = useState("login")
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [name, setName] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")
  const [forgot, setForgot] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const str = pwStr(pw)

  const submit = async e => {
    e?.preventDefault(); setErr("")
    if (!email) return setErr("Email is required.")
    if (!forgot && !pw) return setErr("Password is required.")
    if (tab === "signup" && !name.trim()) return setErr("Name is required.")
    if (tab === "signup" && str < 2) return setErr("Please choose a stronger password.")
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    if (forgot) { setForgotSent(true); return }
    onAuth({ email, name: name || email.split("@")[0], plan: "free", minis: 14, clients: 4, quotes: 7, isNew: tab === "signup" })
  }

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#080810", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <Bg />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div className="fu" style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Hex size={36} /><span style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "#f0f0f8", letterSpacing: "-.02em" }}>Mini<span style={{ color: "#a78bfa" }}>Track</span></span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(240,240,248,.38)", letterSpacing: ".02em" }}>Commission tracker for miniature painters</p>
        </div>

        {/* Card */}
        <div className="fu1" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 32, backdropFilter: "blur(20px)", boxShadow: "0 32px 80px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.06)" }}>

          {!forgot ? (<>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,.3)", padding: 4, borderRadius: 12, marginBottom: 28 }}>
              <button className={`tab ${tab === "login" ? "on" : "off"}`} onClick={() => { setTab("login"); setErr("") }}>Sign In</button>
              <button className={`tab ${tab === "signup" ? "on" : "off"}`} onClick={() => { setTab("signup"); setErr("") }}>Create Account</button>
            </div>

            <form onSubmit={submit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                {tab === "signup" && (
                  <div><div className="lbl">Your Name</div><input className="f" placeholder="e.g. João Silva" value={name} onChange={e => setName(e.target.value)} /></div>
                )}
                <div><div className="lbl">Email</div><input className="f" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div>
                  <div className="lbl">Password</div>
                  <div style={{ position: "relative" }}>
                    <input className="f" type={showPw ? "text" : "password"} placeholder={tab === "signup" ? "Min. 8 characters" : "Your password"} value={pw} onChange={e => setPw(e.target.value)} style={{ paddingRight: 46 }} />
                    <button type="button" onClick={() => setShowPw(x => !x)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(240,240,248,.35)", cursor: "pointer", fontSize: 15 }}>{showPw ? "🙈" : "👁"}</button>
                  </div>
                  {tab === "signup" && pw && (
                    <div style={{ marginTop: 7 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>{[1, 2, 3, 4].map(i => <div key={i} className="strength" style={{ flex: 1, background: i <= str ? strColor(str) : "rgba(255,255,255,.07)" }} />)}</div>
                      {str > 0 && <div style={{ fontSize: 11, color: strColor(str), fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: ".06em" }}>{strLabel(str)}</div>}
                    </div>
                  )}
                </div>
                {err && <div className="err">{err}</div>}
                <button type="submit" className="btn-p" disabled={loading}>
                  {loading ? <span className="sp" /> : tab === "login" ? "Sign In →" : "Create Account →"}
                </button>
                {tab === "login" && <div style={{ textAlign: "center" }}><button type="button" className="lnk" onClick={() => { setForgot(true); setErr("") }}>Forgot password?</button></div>}
              </div>
            </form>

            <div className="div" style={{ margin: "22px 0" }}><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(240,240,248,.28)", letterSpacing: ".08em", textTransform: "uppercase" }}>or continue with</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button className="soc" onClick={() => onAuth({ email: "google@user.com", name: "Google User", plan: "free", minis: 0, clients: 0, quotes: 0, isNew: true })}>
                <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button className="soc" onClick={() => onAuth({ email: "discord@user.com", name: "Discord User", plan: "free", minis: 0, clients: 0, quotes: 0, isNew: true })}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#5865f2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                Discord
              </button>
            </div>

            {tab === "signup" && <p style={{ marginTop: 18, fontSize: 11, color: "rgba(240,240,248,.22)", textAlign: "center", lineHeight: 1.7 }}>By creating an account you agree to our <span style={{ color: "#a78bfa", cursor: "pointer" }}>Terms</span> and <span style={{ color: "#a78bfa", cursor: "pointer" }}>Privacy Policy</span>.</p>}
          </>) : (
            /* Forgot */
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <button className="lnk" style={{ color: "rgba(240,240,248,.35)", fontSize: 12, textDecoration: "none" }} onClick={() => { setForgot(false); setForgotSent(false) }}>← Back to sign in</button>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#f0f0f8", marginTop: 16 }}>Reset Password</h2>
                <p style={{ fontSize: 13, color: "rgba(240,240,248,.4)", marginTop: 6, lineHeight: 1.6 }}>Enter your email and we'll send you a reset link.</p>
              </div>
              {!forgotSent ? (
                <>
                  <div><div className="lbl">Email</div><input className="f" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                  <button className="btn-p" onClick={submit} disabled={loading || !email}>{loading ? <span className="sp" /> : "Send Reset Link →"}</button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 14, animation: "float 2s ease-in-out infinite" }}>📬</div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: "#f0f0f8", marginBottom: 8 }}>Check your inbox</h3>
                  <p style={{ fontSize: 13, color: "rgba(240,240,248,.4)", lineHeight: 1.6 }}>Sent a reset link to <strong style={{ color: "#a78bfa" }}>{email}</strong>.</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="fu4" style={{ textAlign: "center", marginTop: 22, fontSize: 12, color: "rgba(240,240,248,.18)" }}>© 2025 MiniTrack · Built for painters, by painters</div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// PLAN SELECTION PAGE (post-signup onboarding)
// ══════════════════════════════════════════════════════════
const PRO_FEATS = [
  { label: "Miniatures", free: "Up to 20", pro: "Unlimited" },
  { label: "Clients", free: "Up to 5", pro: "Unlimited" },
  { label: "Quotes", free: "Up to 10", pro: "Unlimited" },
  { label: "Image uploads", free: "—", pro: "✓" },
  { label: "PDF & CSV export", free: "—", pro: "✓" },
  { label: "Cloud sync & backup", free: "—", pro: "✓" },
  { label: "Priority support", free: "—", pro: "✓" },
]

function ChkItem({ yes, dim, children }) {
  return (
    <div className={`chk${dim ? " dim" : ""}`}>
      <div className={yes ? "chk-y" : "chk-n"}>{yes ? "✓" : "—"}</div>
      <span>{children}</span>
    </div>
  )
}

function PlanSelectPage({ user, onSelect }) {
  const [billing, setBill] = useState("monthly")
  const [loading, setLoading] = useState(null)

  const price = billing === "annual" ? 8 : 10

  const choose = async plan => {
    setLoading(plan)
    await new Promise(r => setTimeout(r, plan === "pro" ? 1800 : 900))
    setLoading(null)
    onSelect(plan)
  }

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#080810", minHeight: "100vh", position: "relative" }}>
      <Bg soft />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "44px 24px" }}>

        {/* Header */}
        <div className="fu" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <Hex size={26} />
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 19, fontWeight: 800, color: "#f0f0f8" }}>Mini<span style={{ color: "#a78bfa" }}>Track</span></span>
        </div>

        <div className="fu1" style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 10 }}>Welcome, {user.name.split(" ")[0]}! 👋</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "#f0f0f8", letterSpacing: "-.03em", marginBottom: 8 }}>Choose your plan</h1>
          <p style={{ fontSize: 14, color: "rgba(240,240,248,.42)", lineHeight: 1.6 }}>Start free and upgrade anytime. No commitments.</p>
        </div>

        {/* Billing toggle */}
        <div className="fu2" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,.3)", padding: 4, borderRadius: 10 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBill(b)} style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: ".04em", padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer", transition: "all .2s", background: billing === b ? "rgba(139,92,246,.22)" : "transparent", color: billing === b ? "#c4b5fd" : "rgba(240,240,248,.35)" }}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === "annual" && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700, background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", padding: "2px 7px", borderRadius: 20, letterSpacing: ".06em" }}>SAVE 20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="fu2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 36 }}>

          {/* Free */}
          <div className="pc pc-f">
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(240,240,248,.38)", marginBottom: 10 }}>Free</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 44, fontWeight: 800, color: "#f0f0f8", letterSpacing: "-.04em", lineHeight: 1 }}>€0</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(240,240,248,.38)", marginBottom: 6 }}>/ forever</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(240,240,248,.38)", lineHeight: 1.6, marginBottom: 20 }}>Perfect to get started and try everything out.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
              <ChkItem yes>Up to 20 miniatures</ChkItem>
              <ChkItem yes>Up to 5 clients</ChkItem>
              <ChkItem yes>Up to 10 quotes</ChkItem>
              <ChkItem yes>Full paint catalog</ChkItem>
              <ChkItem yes={false} dim>No image uploads</ChkItem>
              <ChkItem yes={false} dim>No data export</ChkItem>
            </div>
            <button className="btn-g" onClick={() => choose("free")} disabled={!!loading}>
              {loading === "free" ? <span className="sp" style={{ borderTopColor: "#a1a1aa" }} /> : "Start for Free →"}
            </button>
          </div>

          {/* Pro */}
          <div className="pc pc-p">
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#a78bfa,transparent)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#a78bfa" }}>Pro</div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", padding: "3px 9px", borderRadius: 20 }}>RECOMMENDED</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, marginBottom: billing === "annual" ? 2 : 6 }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "#f0f0f8", alignSelf: "flex-start", marginTop: 7 }}>€</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 44, fontWeight: 800, color: "#f0f0f8", letterSpacing: "-.04em", lineHeight: 1 }}>{price}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(240,240,248,.38)", marginBottom: 6 }}>/ mo</span>
            </div>
            {billing === "annual" && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(240,240,248,.3)", marginBottom: 6 }}>€{price * 12}/year · saves €{(10 - price) * 12}/year</div>}
            <p style={{ fontSize: 13, color: "rgba(240,240,248,.52)", lineHeight: 1.6, marginBottom: 20 }}>For serious commission painters. No limits, full power.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
              <ChkItem yes>Unlimited miniatures</ChkItem>
              <ChkItem yes>Unlimited clients & quotes</ChkItem>
              <ChkItem yes>Image uploads for each mini</ChkItem>
              <ChkItem yes>PDF & CSV export</ChkItem>
              <ChkItem yes>Cloud sync & backup</ChkItem>
              <ChkItem yes>Priority support</ChkItem>
            </div>
            <button className="btn-p" onClick={() => choose("pro")} disabled={!!loading}>
              {loading === "pro" ? <span className="sp" /> : `Upgrade to Pro — €${price}/mo →`}
            </button>
            <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "rgba(240,240,248,.22)" }}>Cancel anytime · No hidden fees</p>
          </div>
        </div>

        {/* Comparison table */}
        <div className="fu3" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.2)" }}>
            {["Feature", "Free", "Pro"].map((h, i) => <div key={h} style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".09em", color: i === 2 ? "#a78bfa" : "rgba(240,240,248,.35)", textAlign: i > 0 ? "center" : "left", minWidth: i > 0 ? 72 : "auto" }}>{h}</div>)}
          </div>
          {PRO_FEATS.map((f, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, padding: "11px 16px", borderBottom: i < PRO_FEATS.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(240,240,248,.6)" }}>{f.label}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(240,240,248,.38)", textAlign: "center", minWidth: 72 }}>{f.free}</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: "#a78bfa", textAlign: "center", minWidth: 72 }}>{f.pro}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[{ icon: "🔒", t: "Secure payments", d: "Stripe handles everything." }, { icon: "🔄", t: "Cancel anytime", d: "No lock-in or hidden fees." }, { icon: "💾", t: "Your data", d: "Export & delete whenever." }].map(f => (
            <div key={f.t} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: "#f0f0f8", marginBottom: 3 }}>{f.t}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(240,240,248,.35)", lineHeight: 1.5 }}>{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// UPGRADE MODAL (inside the app)
// ══════════════════════════════════════════════════════════
function UpgradeModal({ feature, onClose, onUpgrade }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const go = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setDone(true)
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,8,16,.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#12121c", border: "1px solid rgba(139,92,246,.35)", borderRadius: 22, padding: 36, maxWidth: 400, width: "100%", boxShadow: "0 40px 100px rgba(0,0,0,.7), 0 0 60px rgba(109,40,217,.15)", animation: "fadeUp .35s ease" }}>

        {!done ? (<>
         <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, borderRadius: "22px 22px 0 0", background: "linear-gradient(90deg,transparent,#a78bfa,transparent)" }} />

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 44, marginBottom: 14, animation: "float 2s ease-in-out infinite" }}>⬡</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "#f0f0f8", marginBottom: 8, letterSpacing: "-.02em" }}>
              Unlock <span style={{ color: "#a78bfa" }}>Pro</span>
            </h2>
            {feature && <div style={{ display: "inline-block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(240,240,248,.5)", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 8, padding: "5px 12px", marginBottom: 10 }}>🔒 {feature} requires Pro</div>}
            <p style={{ fontSize: 13, color: "rgba(240,240,248,.45)", lineHeight: 1.7 }}>
              Upgrade for just <strong style={{ color: "#a78bfa" }}>€10/month</strong> and get unlimited everything — no restrictions.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {["Unlimited minis, clients & quotes", "Image uploads", "PDF & CSV export", "Cloud backup"].map(f => (
              <div key={f} className="chk"><div className="chk-y">✓</div><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(240,240,248,.7)" }}>{f}</span></div>
            ))}
          </div>

          <button className="btn-p" onClick={go} disabled={loading}>
            {loading ? <span className="sp" /> : "Upgrade to Pro — €10/mo →"}
          </button>
          <button className="btn-g" onClick={onClose} style={{ marginTop: 8, fontSize: 13 }}>Not now</button>
          <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(240,240,248,.2)" }}>Cancel anytime · Secure via Stripe</p>
        </>) : (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16, animation: "float 2s ease-in-out infinite" }}>⬡</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "#f0f0f8", marginBottom: 10 }}>Welcome to <span style={{ color: "#a78bfa" }}>Pro</span>!</h2>
            <p style={{ fontSize: 13, color: "rgba(240,240,248,.45)", lineHeight: 1.7, marginBottom: 24 }}>All features are now unlocked. Keep painting!</p>
            <button className="btn-p" onClick={() => { onUpgrade(); onClose() }}>Go to Dashboard →</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// MINI APP (simplified inner dashboard)
// ══════════════════════════════════════════════════════════
const STATUS_CFG = {
  Planned: { bg: "rgba(113,113,122,.2)", fg: "#d4d4d8", dot: "#71717a" },
  Printed: { bg: "rgba(59,130,246,.2)", fg: "#93c5fd", dot: "#3b82f6" },
  Painting: { bg: "rgba(234,179,8,.2)", fg: "#fde047", dot: "#eab308" },
  Completed: { bg: "rgba(16,185,129,.2)", fg: "#6ee7b7", dot: "#10b981" },
  Sold: { bg: "rgba(139,92,246,.2)", fg: "#c4b5fd", dot: "#8b5cf6" },
}
const MBadge = ({ status }) => {
  const c = STATUS_CFG[status] || STATUS_CFG.Planned
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: c.bg, color: c.fg }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, display: "inline-block" }} />{status}</span>
}

const SEED_MINIS = [
  { id: uid(), name: "Primaris Intercessor", status: "Completed", army: "Space Marines", cost: 8, sale: 22 },
  { id: uid(), name: "Nurgle Daemon Prince", status: "Painting", army: "Death Guard", cost: 20, sale: 0 },
  { id: uid(), name: "Necron Warrior", status: "Planned", army: "Necrons", cost: 0, sale: 0 },
  { id: uid(), name: "Stormcast Paladin", status: "Sold", army: "Stormcast", cost: 10, sale: 35 },
]

function InnerApp({ user, plan, onUpgrade, onSignOut, onViewPlans }) {
  const [page, setPage] = useState("dashboard")
  const [upgradeFeature, setUpgradeFeature] = useState(null)
  const isPro = plan === "pro"

  const limitHit = feature => {
    if (isPro) return false
    return true
  }

  const tryFeature = feature => {
    if (isPro) return true
    setUpgradeFeature(feature)
    return false
  }

  const sold = SEED_MINIS.filter(m => m.status === "Sold")
  const totalProfit = sold.reduce((a, m) => a + m.sale - m.cost, 0)

  const fmt = v => `€${(parseFloat(v) || 0).toFixed(2)}`

  const ProBadge = ({ feature }) => (
    <button onClick={() => tryFeature(feature)} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", background: "rgba(139,92,246,.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,.3)", padding: "2px 8px", borderRadius: 20, cursor: "pointer" }}>
      ⬡ PRO
    </button>
  )

  const LimitBar = ({ label, used, max }) => {
    const pct = Math.min((used / max) * 100, 100)
    const warn = pct > 75
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(240,240,248,.4)", marginBottom: 3, fontFamily: "'DM Sans',sans-serif" }}>
          <span>{label}</span><span style={{ color: warn ? "#f59e0b" : undefined }}>{used}/{max}</span>
        </div>
        <div className="lbar"><div className="lfill" style={{ width: `${pct}%`, background: warn ? "linear-gradient(90deg,#f59e0b,#ef4444)" : "linear-gradient(90deg,#7c3aed,#4f46e5)" }} /></div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#09090b", color: "#f4f4f5", minHeight: "100vh", display: "flex", fontSize: 14 }}>

      {upgradeFeature !== null && (
        <UpgradeModal feature={upgradeFeature} onClose={() => setUpgradeFeature(null)} onUpgrade={() => { onUpgrade("pro"); setUpgradeFeature(null) }} />
      )}

      {/* Sidebar */}
      <aside style={{ width: 210, background: "#18181b", borderRight: "1px solid #27272a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid #27272a", fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800 }}>
          Mini<span style={{ color: "#a78bfa" }}>Track</span>
        </div>

        {/* Plan pill */}
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #27272a" }}>
          <button onClick={onViewPlans} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 10, border: isPro ? "1px solid rgba(139,92,246,.4)" : "1px solid rgba(255,255,255,.08)", background: isPro ? "rgba(139,92,246,.1)" : "rgba(255,255,255,.03)", cursor: "pointer" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: isPro ? "#a78bfa" : "rgba(240,240,248,.35)", textTransform: "uppercase" }}>
                {isPro ? "⬡ Pro Plan" : "Free Plan"}
              </div>
              {!isPro && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "rgba(240,240,248,.3)", marginTop: 1 }}>Upgrade for more</div>}
            </div>
            {!isPro && <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: ".08em", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", padding: "3px 8px", borderRadius: 20 }}>UPGRADE</span>}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {[{ id: "dashboard", icon: "▦", label: "Dashboard" }, { id: "miniatures", icon: "⬡", label: "Miniatures" }, { id: "clients", icon: "👥", label: "Clients" }, { id: "quotes", icon: "📋", label: "Quotes" }, { id: "settings", icon: "⚙", label: "Settings" }].map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} className="app-nav-btn" style={{ background: page === n.id ? "rgba(139,92,246,.2)" : "transparent", color: page === n.id ? "#c4b5fd" : "#a1a1aa", fontWeight: page === n.id ? 600 : 400 }}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        {!isPro && (
          <div style={{ padding: "10px 12px", borderTop: "1px solid #27272a" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px", background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.15)", borderRadius: 10 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 700, color: "#fbbf24", letterSpacing: ".08em" }}>USAGE</div>
              <LimitBar label="Minis" used={14} max={20} />
              <LimitBar label="Clients" used={4} max={5} />
              <LimitBar label="Quotes" used={7} max={10} />
              <button className="btn-p" onClick={onViewPlans} style={{ padding: "8px", fontSize: 11 }}>Upgrade to Pro</button>
            </div>
          </div>
        )}

        <div style={{ padding: "10px 8px", borderTop: "1px solid #27272a" }}>
          <div style={{ padding: "5px 12px", fontSize: 11, color: "#52525b", fontFamily: "'DM Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
          <button className="app-nav-btn" style={{ color: "#71717a", background: "transparent" }} onClick={onSignOut}>↩ Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px", height: 52, borderBottom: "1px solid #27272a", background: "#18181b" }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16 }}>Mini<span style={{ color: "#a78bfa" }}>Track</span></span>
          <div style={{ flex: 1 }} />
          {isPro && <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: ".1em", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff", padding: "3px 10px", borderRadius: 20 }}>⬡ PRO</span>}
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        </header>

        <main style={{ padding: "24px 24px", maxWidth: 760 }}>

          {/* Dashboard */}
          {page === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800 }}>Dashboard</h1>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                  { label: "Total Minis", val: 4, color: "#a78bfa" },
                  { label: "In Progress", val: 1, color: "#fbbf24" },
                  { label: "Completed", val: 1, color: "#34d399" },
                  { label: "Sold", val: 1, color: "#60a5fa" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 14, padding: "16px 18px" }}>
                    <div style={{ fontSize: 11, color: "#71717a", fontFamily: "'Syne',sans-serif", fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "linear-gradient(135deg,rgba(109,40,217,.2),rgba(109,40,217,.05))", border: "1px solid rgba(139,92,246,.25)", borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ fontSize: 11, color: "#a1a1aa", fontFamily: "'Syne',sans-serif", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 6 }}>Total Profit</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#4ade80", fontFamily: "'Syne',sans-serif" }}>{fmt(totalProfit)}</div>
                </div>
                <div onClick={() => !isPro && tryFeature("Advanced analytics")} style={{ background: "#18181b", border: isPro ? "1px solid #27272a" : "1px solid rgba(245,158,11,.15)", borderRadius: 14, padding: "18px 20px", cursor: isPro ? "default" : "pointer", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: "#a1a1aa", fontFamily: "'Syne',sans-serif", letterSpacing: ".07em", textTransform: "uppercase" }}>Advanced Analytics</div>
                    {!isPro && <ProBadge feature="Advanced analytics" />}
                  </div>
                  {isPro ? (
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#a78bfa", fontFamily: "'Syne',sans-serif" }}>€{(totalProfit * 0.72).toFixed(2)}</div>
                  ) : (
                    <div style={{ fontSize: 13, color: "rgba(240,240,248,.3)", fontFamily: "'DM Sans',sans-serif" }}>Unlock to see margin trends, best sellers & more.</div>
                  )}
                </div>
              </div>

              {/* Miniatures grid */}
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(240,240,248,.38)", marginBottom: 12 }}>Recent Miniatures</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                  {SEED_MINIS.map(m => (
                    <div key={m.id} style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, overflow: "hidden" }}>
                      <div style={{ height: 80, background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, position: "relative" }}>
                        ⬡
                        <span style={{ position: "absolute", top: 6, right: 6 }}><MBadge status={m.status} /></span>
                      </div>
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>{m.army}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro locked features */}
              {!isPro && (
                <div style={{ background: "rgba(139,92,246,.06)", border: "1px solid rgba(139,92,246,.2)", borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "#f0f0f8" }}>Unlock Pro Features</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(240,240,248,.42)", marginTop: 3 }}>Image uploads · PDF export · Cloud backup · Advanced analytics</div>
                    </div>
                    <button className="btn-p" onClick={onViewPlans} style={{ padding: "10px 20px", width: "auto", fontSize: 13 }}>Upgrade — €10/mo</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Miniatures page with limit */}
          {page === "miniatures" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800 }}>Miniatures</h1>
                <button onClick={() => !isPro && tryFeature("New miniature (limit reached)")} className="btn-p" style={{ width: "auto", padding: "9px 18px", fontSize: 13 }}>+ New Miniature</button>
              </div>
              {!isPro && (
                <div style={{ background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.18)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#fbbf24" }}>14 / 20 miniatures used</span>
                  <button onClick={onViewPlans} className="lnk" style={{ fontSize: 12 }}>Upgrade for unlimited</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                {SEED_MINIS.map(m => (
                  <div key={m.id} style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ height: 90, background: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, position: "relative" }}>
                      ⬡
                      <span style={{ position: "absolute", top: 7, right: 7 }}><MBadge status={m.status} /></span>
                      {!isPro && (
                        <button onClick={() => tryFeature("Image upload")} style={{ position: "absolute", bottom: 7, right: 7, background: "rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, padding: "3px 8px", color: "rgba(255,255,255,.5)", fontSize: 10, cursor: "pointer", fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: ".06em" }}>+ IMG ⬡</button>
                      )}
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>{m.army} · Cost: {fmt(m.cost)} · Sale: {fmt(m.sale)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked pages */}
          {(page === "clients" || page === "quotes") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800 }}>{page === "clients" ? "Clients" : "Quotes"}</h1>
                <button onClick={() => tryFeature(`New ${page.slice(0, -1)}`)} className="btn-p" style={{ width: "auto", padding: "9px 18px", fontSize: 13 }}>
                  + New {page.slice(0, -1).charAt(0).toUpperCase() + page.slice(1, -1)}
                </button>
              </div>
              {!isPro && (
                <div style={{ background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.18)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#fbbf24" }}>
                    {page === "clients" ? "4 / 5 clients" : "7 / 10 quotes"} used
                  </span>
                  <button onClick={onViewPlans} className="lnk" style={{ fontSize: 12 }}>Upgrade for unlimited</button>
                </div>
              )}
              <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", color: "rgba(240,240,248,.5)", fontSize: 13, textAlign: "center", padding: "24px 0" }}>
                  Connect to Supabase to see your {page} here.
                </div>
              </div>
            </div>
          )}

          {page === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800 }}>Settings</h1>

              <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 14, padding: "20px 22px" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(240,240,248,.38)", marginBottom: 14 }}>Account</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "rgba(240,240,248,.55)" }}>Name</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "rgba(240,240,248,.55)" }}>Email</span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{user.email}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "rgba(240,240,248,.55)" }}>Plan</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: isPro ? "#a78bfa" : "rgba(240,240,248,.38)", letterSpacing: ".08em" }}>{isPro ? "⬡ PRO" : "FREE"}</span>
                      {!isPro && <button onClick={onViewPlans} className="btn-p" style={{ padding: "6px 14px", width: "auto", fontSize: 12 }}>Upgrade</button>}
                    </div>
                  </div>
                </div>
              </div>

              {!isPro && (
                <div style={{ background: "rgba(139,92,246,.07)", border: "1px solid rgba(139,92,246,.2)", borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#f0f0f8", marginBottom: 6 }}>Export your data <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, color: "#a78bfa", border: "1px solid rgba(139,92,246,.4)", padding: "2px 8px", borderRadius: 20, marginLeft: 6 }}>PRO</span></div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(240,240,248,.42)", marginBottom: 14, lineHeight: 1.6 }}>Download all your miniatures, clients and quotes as PDF or CSV.</div>
                  <button onClick={() => tryFeature("Data export")} className="btn-p" style={{ width: "auto", padding: "9px 18px", fontSize: 13 }}>Export Data</button>
                </div>
              )}

              {isPro && (
                <div style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.15)", borderRadius: 14, padding: "18px 22px" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 4 }}>Cancel subscription</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(240,240,248,.38)", marginBottom: 12 }}>You'll keep Pro until the end of your billing period.</div>
                  <button style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#f87171", padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>Cancel Plan</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// ROOT — orchestrates the full flow
// ══════════════════════════════════════════════════════════
export default function MiniTrackFull() {
  // flow: "auth" → "plan-select" → "app"
  const [flow, setFlow] = useState("auth")
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState("free")

  const handleAuth = userData => {
    setUser(userData)
    // New users go to plan selection; returning users go straight to app
    setFlow(userData.isNew ? "plan-select" : "app")
    if (!userData.isNew) setPlan(userData.plan || "free")
  }

  const handlePlanSelect = selected => {
    setPlan(selected)
    setFlow("app")
  }

  const handleUpgrade = newPlan => {
    setPlan(newPlan)
  }

  const handleSignOut = () => {
    setUser(null)
    setPlan("free")
    setFlow("auth")
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" />

      {flow === "auth" && <AuthPage onAuth={handleAuth} />}
      {flow === "plan-select" && user && <PlanSelectPage user={user} onSelect={handlePlanSelect} />}
      {flow === "app" && user && (
        <InnerApp
          user={user}
          plan={plan}
          onUpgrade={handleUpgrade}
          onSignOut={handleSignOut}
          onViewPlans={() => setFlow("plan-select")}
        />
      )}
    </>
  )
}
