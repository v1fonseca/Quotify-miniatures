import { useState } from "react"

// ── Fonts via Google ──────────────────────────────────────
const fontLink = document.createElement("link")
fontLink.rel = "stylesheet"
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
document.head.appendChild(fontLink)

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080810; }

  @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
  @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(14px) rotate(-4deg)} }
  @keyframes floatC { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-10px) rotate(2deg)} 66%{transform:translateY(8px) rotate(-2deg)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .fade-up { animation: fadeUp .5s ease both; }
  .fade-up-1 { animation: fadeUp .5s .1s ease both; }
  .fade-up-2 { animation: fadeUp .5s .2s ease both; }
  .fade-up-3 { animation: fadeUp .5s .3s ease both; }
  .fade-up-4 { animation: fadeUp .5s .4s ease both; }

  .mt-field { font-family: 'DM Sans', sans-serif; width:100%; padding:13px 16px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; color:#f0f0f8; font-size:14px; outline:none; transition:border-color .2s, background .2s; }
  .mt-field:focus { border-color:rgba(139,92,246,.6); background:rgba(139,92,246,.06); }
  .mt-field::placeholder { color:rgba(240,240,248,.3); }

  .mt-btn-primary { font-family:'Syne',sans-serif; width:100%; padding:14px; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:10px; color:#fff; font-size:14px; font-weight:700; letter-spacing:.04em; cursor:pointer; transition:opacity .2s, transform .15s; position:relative; overflow:hidden; }
  .mt-btn-primary:hover { opacity:.9; transform:translateY(-1px); }
  .mt-btn-primary:active { transform:translateY(0); }
  .mt-btn-primary:disabled { opacity:.4; cursor:default; transform:none; }

  .mt-btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent); background-size:200% 100%; animation:shimmer 2s infinite; }

  .mt-btn-ghost { font-family:'DM Sans',sans-serif; width:100%; padding:13px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; color:rgba(240,240,248,.7); font-size:14px; cursor:pointer; transition:background .2s, color .2s; }
  .mt-btn-ghost:hover { background:rgba(255,255,255,.07); color:#f0f0f8; }

  .tab-btn { font-family:'Syne',sans-serif; flex:1; padding:11px; background:transparent; border:none; border-radius:8px; font-size:13px; font-weight:600; letter-spacing:.03em; cursor:pointer; transition:all .2s; }
  .tab-btn.active { background:rgba(139,92,246,.2); color:#c4b5fd; }
  .tab-btn.inactive { color:rgba(240,240,248,.35); }
  .tab-btn.inactive:hover { color:rgba(240,240,248,.6); }

  .divider { display:flex; align-items:center; gap:14px; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.07); }
  .divider span { font-family:'DM Sans',sans-serif; font-size:11px; color:rgba(240,240,248,.3); letter-spacing:.08em; text-transform:uppercase; }

  .social-btn { font-family:'DM Sans',sans-serif; display:flex; align-items:center; justify-content:center; gap:10px; padding:12px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:10px; color:rgba(240,240,248,.7); font-size:13px; font-weight:500; cursor:pointer; transition:all .2s; text-decoration:none; }
  .social-btn:hover { background:rgba(255,255,255,.07); color:#f0f0f8; border-color:rgba(255,255,255,.14); }

  .error-msg { font-family:'DM Sans',sans-serif; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.25); border-radius:8px; padding:10px 14px; font-size:13px; color:#fca5a5; }

  .spinner { width:18px; height:18px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }

  .field-label { font-family:'Syne',sans-serif; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(240,240,248,.4); margin-bottom:6px; }

  .link-btn { font-family:'DM Sans',sans-serif; background:none; border:none; color:#a78bfa; cursor:pointer; font-size:13px; padding:0; text-decoration:underline; text-underline-offset:3px; }
  .link-btn:hover { color:#c4b5fd; }

  .strength-bar { height:3px; border-radius:2px; transition:all .3s; }

  input[type=password]::-ms-reveal { display:none; }
`

const StyleTag = () => <style>{css}</style>

const HexIcon = ({ size = 28, color = "#a78bfa", opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ opacity }}>
    <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill={color} fillOpacity=".15" stroke={color} strokeWidth="1.5" />
    <polygon points="14,7 20,10.5 20,17.5 14,21 8,17.5 8,10.5" fill={color} fillOpacity=".3" />
  </svg>
)

// Floating background hexagons
const Background = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    {/* gradient blobs */}
    <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,.18) 0%, transparent 70%)" }} />
    <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,.14) 0%, transparent 70%)" }} />
    {/* floating hexagons */}
    {[
      { top: "8%", left: "6%", size: 44, anim: "floatA 7s ease-in-out infinite", op: .18 },
      { top: "20%", right: "8%", size: 32, anim: "floatB 9s ease-in-out infinite", op: .12 },
      { top: "55%", left: "3%", size: 24, anim: "floatC 11s ease-in-out infinite", op: .1 },
      { bottom: "15%", right: "12%", size: 52, anim: "floatA 8s 2s ease-in-out infinite", op: .15 },
      { bottom: "30%", left: "15%", size: 20, anim: "floatB 6s 1s ease-in-out infinite", op: .08 },
      { top: "40%", right: "20%", size: 18, anim: "floatC 13s ease-in-out infinite", op: .07 },
    ].map((h, i) => (
      <div key={i} style={{ position: "absolute", ...h, animation: h.anim }}>
        <HexIcon size={h.size} opacity={h.op} />
      </div>
    ))}
    {/* grid */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(139,92,246,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.04) 1px,transparent 1px)",
      backgroundSize: "48px 48px"
    }} />
  </div>
)

const pwStrength = pw => {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const strengthLabel = s => ["", "Weak", "Fair", "Good", "Strong"][s]
const strengthColor = s => ["", "#ef4444", "#f59e0b", "#10b981", "#6366f1"][s]

export default function MiniTrackAuth({ onAuth }) {
  const [tab, setTab] = useState("login")
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [name, setName] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  const strength = pwStrength(pw)

  const submit = async e => {
    e?.preventDefault()
    setError("")
    if (!email) return setError("Email is required.")
    if (!forgotMode && !pw) return setError("Password is required.")
    if (tab === "signup" && !name.trim()) return setError("Name is required.")
    if (tab === "signup" && strength < 2) return setError("Please choose a stronger password.")

    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)

    // In production: call your auth API here
    if (onAuth) onAuth({ email, name: name || email.split("@")[0], plan: "free" })
  }

  const switchTab = t => { setTab(t); setError(""); setForgotMode(false); setForgotSent(false) }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080810", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <StyleTag />
      <Background />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <HexIcon size={36} opacity={1} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#f0f0f8", letterSpacing: "-.02em" }}>
              Mini<span style={{ color: "#a78bfa" }}>Track</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(240,240,248,.4)", letterSpacing: ".02em" }}>
            Commission tracker for miniature painters
          </p>
        </div>

        {/* Card */}
        <div className="fade-up-1" style={{
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 20,
          padding: 32,
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.06)"
        }}>

          {!forgotMode ? (
            <>
              {/* Tabs */}
              <div className="fade-up-2" style={{ display: "flex", gap: 4, background: "rgba(0,0,0,.3)", padding: 4, borderRadius: 12, marginBottom: 28 }}>
                <button className={`tab-btn ${tab === "login" ? "active" : "inactive"}`} onClick={() => switchTab("login")}>Sign In</button>
                <button className={`tab-btn ${tab === "signup" ? "active" : "inactive"}`} onClick={() => switchTab("signup")}>Create Account</button>
              </div>

              <form onSubmit={submit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {tab === "signup" && (
                    <div className="fade-up-2">
                      <div className="field-label">Your Name</div>
                      <input className="mt-field" placeholder="e.g. João Silva" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
                    </div>
                  )}

                  <div className="fade-up-2">
                    <div className="field-label">Email</div>
                    <input className="mt-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                  </div>

                  <div className="fade-up-3">
                    <div className="field-label">Password</div>
                    <div style={{ position: "relative" }}>
                      <input className="mt-field" type={showPw ? "text" : "password"} placeholder={tab === "signup" ? "Min. 8 characters" : "Your password"} value={pw} onChange={e => setPw(e.target.value)} autoComplete={tab === "login" ? "current-password" : "new-password"} style={{ paddingRight: 48 }} />
                      <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(240,240,248,.4)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2 }}>
                        {showPw ? "🙈" : "👁"}
                      </button>
                    </div>

                    {tab === "signup" && pw && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="strength-bar" style={{ flex: 1, background: i <= strength ? strengthColor(strength) : "rgba(255,255,255,.08)" }} />
                          ))}
                        </div>
                        {strength > 0 && <div style={{ fontSize: 11, color: strengthColor(strength), fontFamily: "'Syne',sans-serif", fontWeight: 600, letterSpacing: ".06em" }}>{strengthLabel(strength)}</div>}
                      </div>
                    )}
                  </div>

                  {error && <div className="error-msg fade-up-2">{error}</div>}

                  <button type="submit" className="mt-btn-primary fade-up-4" disabled={loading}>
                    {loading ? <span className="spinner" /> : tab === "login" ? "Sign In →" : "Create Account →"}
                  </button>

                  {tab === "login" && (
                    <div style={{ textAlign: "center" }}>
                      <button type="button" className="link-btn" onClick={() => { setForgotMode(true); setError("") }}>
                        Forgot password?
                      </button>
                    </div>
                  )}

                </div>
              </form>

              <div className="divider" style={{ margin: "24px 0" }}>
                <span>or continue with</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="social-btn" onClick={() => onAuth && onAuth({ email: "google@user.com", name: "Google User", plan: "free" })}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button className="social-btn" onClick={() => onAuth && onAuth({ email: "discord@user.com", name: "Discord User", plan: "free" })}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865f2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                  Discord
                </button>
              </div>

              {tab === "signup" && (
                <p style={{ marginTop: 20, fontSize: 11, color: "rgba(240,240,248,.25)", textAlign: "center", lineHeight: 1.7 }}>
                  By creating an account you agree to our{" "}
                  <span style={{ color: "#a78bfa", cursor: "pointer" }}>Terms of Service</span>{" "}
                  and{" "}
                  <span style={{ color: "#a78bfa", cursor: "pointer" }}>Privacy Policy</span>.
                </p>
              )}
            </>
          ) : (
            /* Forgot password flow */
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <button className="link-btn" style={{ color: "rgba(240,240,248,.4)", fontSize: 12, textDecoration: "none" }} onClick={() => { setForgotMode(false); setForgotSent(false) }}>
                  ← Back to sign in
                </button>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#f0f0f8", marginTop: 16 }}>Reset Password</h2>
                <p style={{ fontSize: 13, color: "rgba(240,240,248,.4)", marginTop: 6, lineHeight: 1.6 }}>Enter your email and we'll send you a reset link.</p>
              </div>

              {!forgotSent ? (
                <>
                  <div>
                    <div className="field-label">Email</div>
                    <input className="mt-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <button className="mt-btn-primary" onClick={async () => { setLoading(true); await new Promise(r => setTimeout(r, 1000)); setLoading(false); setForgotSent(true) }} disabled={loading || !email}>
                    {loading ? <span className="spinner" /> : "Send Reset Link →"}
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: "#f0f0f8", marginBottom: 8 }}>Check your inbox</h3>
                  <p style={{ fontSize: 13, color: "rgba(240,240,248,.4)", lineHeight: 1.6 }}>
                    We sent a reset link to <strong style={{ color: "#a78bfa" }}>{email}</strong>.<br />
                    Check your spam folder if you don't see it.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="fade-up-4" style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "rgba(240,240,248,.2)" }}>
          © 2025 MiniTrack · Built for painters, by painters
        </div>
      </div>
    </div>
  )
}
