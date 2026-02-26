import { useState } from "react"

const css2 = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(139,92,246,.25)} 50%{box-shadow:0 0 40px rgba(139,92,246,.45)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes checkIn { from{transform:scale(0) rotate(-30deg);opacity:0} to{transform:scale(1) rotate(0deg);opacity:1} }

  .plan-fade { animation: fadeUp .5s ease both; }
  .plan-fade-1 { animation: fadeUp .5s .08s ease both; }
  .plan-fade-2 { animation: fadeUp .5s .16s ease both; }
  .plan-fade-3 { animation: fadeUp .5s .24s ease both; }

  .plan-card { border-radius:20px; padding:28px; transition:transform .25s, box-shadow .25s; cursor:pointer; position:relative; overflow:hidden; }
  .plan-card:hover { transform:translateY(-4px); }
  .plan-card.free { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); }
  .plan-card.free:hover { box-shadow:0 20px 60px rgba(0,0,0,.4); border-color:rgba(255,255,255,.14); }
  .plan-card.pro { background:linear-gradient(160deg,rgba(109,40,217,.25),rgba(79,70,229,.2)); border:1.5px solid rgba(139,92,246,.4); animation:glow 3s ease-in-out infinite; }
  .plan-card.pro:hover { transform:translateY(-6px); box-shadow:0 32px 80px rgba(109,40,217,.35); }
  .plan-card.selected.free { border-color:rgba(255,255,255,.3); background:rgba(255,255,255,.06); }
  .plan-card.selected.pro { border-color:rgba(167,139,250,.8); }

  .plan-badge { font-family:'Syne',sans-serif; font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; padding:3px 10px; border-radius:20px; }
  .plan-badge.popular { background:linear-gradient(135deg,#7c3aed,#4f46e5); color:#fff; }
  .plan-badge.current { background:rgba(255,255,255,.08); color:rgba(240,240,248,.5); border:1px solid rgba(255,255,255,.1); }

  .check-item { display:flex; align-items:flex-start; gap:10px; font-family:'DM Sans',sans-serif; font-size:13.5px; color:rgba(240,240,248,.75); line-height:1.5; }
  .check-icon { width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; font-size:10px; animation:checkIn .3s ease both; }
  .check-icon.yes { background:rgba(139,92,246,.25); color:#a78bfa; }
  .check-icon.no { background:rgba(255,255,255,.05); color:rgba(255,255,255,.2); }
  .check-item.disabled { color:rgba(240,240,248,.3); }

  .price-num { font-family:'Syne',sans-serif; font-size:48px; font-weight:800; color:#f0f0f8; letter-spacing:-.04em; line-height:1; }
  .price-cur { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#f0f0f8; align-self:flex-start; margin-top:8px; }
  .price-per { font-family:'DM Sans',sans-serif; font-size:13px; color:rgba(240,240,248,.4); align-self:flex-end; margin-bottom:6px; }

  .cta-free { font-family:'Syne',sans-serif; width:100%; padding:13px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:10px; color:rgba(240,240,248,.8); font-size:13px; font-weight:700; letter-spacing:.04em; cursor:pointer; transition:all .2s; }
  .cta-free:hover { background:rgba(255,255,255,.1); color:#f0f0f8; }

  .cta-pro { font-family:'Syne',sans-serif; width:100%; padding:14px; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:none; border-radius:10px; color:#fff; font-size:14px; font-weight:700; letter-spacing:.04em; cursor:pointer; transition:all .2s; position:relative; overflow:hidden; }
  .cta-pro:hover { opacity:.9; transform:translateY(-1px); box-shadow:0 12px 30px rgba(109,40,217,.4); }
  .cta-pro::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent); background-size:200% 100%; animation:shimmer 2.5s infinite; }
  .cta-pro:disabled { opacity:.4; cursor:default; transform:none; }

  .feature-table-row { display:grid; grid-template-columns:1fr auto auto; gap:8px; align-items:center; padding:12px 16px; border-bottom:1px solid rgba(255,255,255,.05); font-family:'DM Sans',sans-serif; font-size:13px; }
  .feature-table-row:last-child { border-bottom:none; }
  .feature-table-row:hover { background:rgba(255,255,255,.02); }
  .col-label { color:rgba(240,240,248,.65); }
  .col-free { color:rgba(240,240,248,.45); text-align:center; min-width:80px; font-size:12px; }
  .col-pro { color:#a78bfa; text-align:center; min-width:80px; font-size:12px; font-weight:600; }

  .billing-toggle { display:flex; align-items:center; gap:10px; background:rgba(0,0,0,.3); padding:5px; border-radius:10px; }
  .billing-opt { font-family:'Syne',sans-serif; font-size:12px; font-weight:600; letter-spacing:.04em; padding:7px 16px; border-radius:7px; border:none; cursor:pointer; transition:all .2s; }
  .billing-opt.active { background:rgba(139,92,246,.25); color:#c4b5fd; }
  .billing-opt.inactive { background:transparent; color:rgba(240,240,248,.4); }

  .save-badge { font-family:'Syne',sans-serif; font-size:10px; font-weight:700; background:linear-gradient(135deg,#10b981,#059669); color:#fff; padding:2px 8px; border-radius:20px; letter-spacing:.06em; }

  .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }

  .success-overlay { position:fixed; inset:0; background:rgba(8,8,16,.95); display:flex; align-items:center; justify-content:center; z-index:100; }
  .success-card { background:rgba(255,255,255,.04); border:1px solid rgba(139,92,246,.3); border-radius:24px; padding:48px; text-align:center; max-width:380px; animation:fadeUp .5s ease; }

  .limit-bar { height:6px; border-radius:3px; background:rgba(255,255,255,.08); overflow:hidden; }
  .limit-fill { height:100%; border-radius:3px; transition:width .6s ease; }
`

const HexIcon = ({ size = 24, color = "#a78bfa", opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" style={{ opacity }}>
    <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill={color} fillOpacity=".15" stroke={color} strokeWidth="1.5" />
    <polygon points="14,7 20,10.5 20,17.5 14,21 8,17.5 8,10.5" fill={color} fillOpacity=".3" />
  </svg>
)

const Background = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,.12) 0%, transparent 70%)" }} />
    <div style={{ position: "absolute", bottom: "0%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,.1) 0%, transparent 70%)" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(139,92,246,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.03) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
  </div>
)

const FREE_FEATURES = [
  { label: "Miniatures", free: "Up to 20", pro: "Unlimited", yes: true },
  { label: "Clients", free: "Up to 5", pro: "Unlimited", yes: true },
  { label: "Quotes & proposals", free: "Up to 10", pro: "Unlimited", yes: true },
  { label: "Paint catalog", free: "✓", pro: "✓", yes: true },
  { label: "Categories & armies", free: "✓", pro: "✓", yes: true },
  { label: "Dashboard analytics", free: "Basic", pro: "Advanced", yes: true },
  { label: "Image uploads", free: "—", pro: "✓", yes: false },
  { label: "PDF export", free: "—", pro: "✓", yes: false },
  { label: "CSV / data export", free: "—", pro: "✓", yes: false },
  { label: "Cloud sync & backup", free: "—", pro: "✓", yes: false },
  { label: "Priority support", free: "—", pro: "✓", yes: false },
]

function CheckItem({ children, yes, disabled }) {
  return (
    <div className={`check-item${disabled ? " disabled" : ""}`}>
      <div className={`check-icon ${yes ? "yes" : "no"}`}>
        {yes ? "✓" : "—"}
      </div>
      <span>{children}</span>
    </div>
  )
}

function UsageBar({ label, used, max, color = "#a78bfa" }) {
  const pct = Math.min((used / max) * 100, 100)
  const warn = pct > 75
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(240,240,248,.5)" }}>{label}</span>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, color: warn ? "#f59e0b" : "rgba(240,240,248,.4)" }}>{used} / {max}</span>
      </div>
      <div className="limit-bar">
        <div className="limit-fill" style={{ width: `${pct}%`, background: warn ? "linear-gradient(90deg,#f59e0b,#ef4444)" : `linear-gradient(90deg,${color},#6366f1)` }} />
      </div>
    </div>
  )
}

export default function MiniTrackPlans({ user = { name: "João", email: "joao@email.com", plan: "free" }, minis = 14, clients = 4, quotes = 7, onUpgrade, onBack }) {
  const [billing, setBilling] = useState("monthly")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(user.plan || "free")

  const monthlyPrice = 10
  const annualPrice = 8
  const price = billing === "annual" ? annualPrice : monthlyPrice
  const saving = Math.round(((monthlyPrice - annualPrice) / monthlyPrice) * 100)

  const handleUpgrade = async () => {
    setLoading(true)
    // Simulate Stripe checkout
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setSuccess(true)
    setCurrentPlan("pro")
    if (onUpgrade) onUpgrade("pro")
  }

  const handleDowngrade = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setCurrentPlan("free")
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080810", minHeight: "100vh", position: "relative" }}>
      <style>{css2}</style>
      {/* Google Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" />
      <Background />

      {/* Success overlay */}
      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <div style={{ fontSize: 64, marginBottom: 20, animation: "float 2s ease-in-out infinite" }}>⬡</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "#f0f0f8", marginBottom: 10 }}>
              Welcome to <span style={{ color: "#a78bfa" }}>Pro</span>!
            </h2>
            <p style={{ fontSize: 14, color: "rgba(240,240,248,.5)", lineHeight: 1.7, marginBottom: 28 }}>
              Your account has been upgraded. All Pro features are now unlocked.
            </p>
            <button className="cta-pro" onClick={() => { setSuccess(false); if (onBack) onBack() }}>
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div className="plan-fade" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <HexIcon size={28} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "#f0f0f8" }}>
              Mini<span style={{ color: "#a78bfa" }}>Track</span>
            </span>
          </div>
          {onBack && (
            <button onClick={onBack} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "8px 16px", color: "rgba(240,240,248,.5)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer" }}>
              ← Back to app
            </button>
          )}
        </div>

        {/* Usage indicator (for free users) */}
        {currentPlan === "free" && (
          <div className="plan-fade-1" style={{ background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.2)", borderRadius: 14, padding: "18px 22px", marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>📊</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>Your Free Plan Usage</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              <UsageBar label="Miniatures" used={minis} max={20} color="#a78bfa" />
              <UsageBar label="Clients" used={clients} max={5} color="#34d399" />
              <UsageBar label="Quotes" used={quotes} max={10} color="#60a5fa" />
            </div>
            {(minis >= 16 || clients >= 4 || quotes >= 8) && (
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(245,158,11,.8)", marginTop: 10 }}>
                ⚠ You're approaching your limits. Upgrade to Pro to continue without restrictions.
              </p>
            )}
          </div>
        )}

        {/* Title */}
        <div className="plan-fade-1" style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, color: "#f0f0f8", letterSpacing: "-.03em", marginBottom: 10 }}>
            Simple, honest pricing
          </h1>
          <p style={{ fontSize: 15, color: "rgba(240,240,248,.45)", lineHeight: 1.6 }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="plan-fade-2" style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <div className="billing-toggle">
            <button className={`billing-opt ${billing === "monthly" ? "active" : "inactive"}`} onClick={() => setBilling("monthly")}>Monthly</button>
            <button className={`billing-opt ${billing === "annual" ? "active" : "inactive"}`} onClick={() => setBilling("annual")}>
              Annual <span className="save-badge" style={{ marginLeft: 6 }}>Save {saving}%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="plan-fade-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>

          {/* FREE */}
          <div className={`plan-card free ${currentPlan === "free" ? "selected" : ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(240,240,248,.4)", marginBottom: 6 }}>Free</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                  <span className="price-num">€0</span>
                  <span className="price-per">/ forever</span>
                </div>
              </div>
              {currentPlan === "free" && <span className="plan-badge current">Current plan</span>}
            </div>
            <p style={{ fontSize: 13, color: "rgba(240,240,248,.4)", lineHeight: 1.6, marginBottom: 22 }}>
              Everything you need to get started tracking your painting projects.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
              <CheckItem yes>Up to 20 miniatures</CheckItem>
              <CheckItem yes>Up to 5 clients</CheckItem>
              <CheckItem yes>Up to 10 quotes</CheckItem>
              <CheckItem yes>Paint catalog</CheckItem>
              <CheckItem yes>Basic analytics</CheckItem>
              <CheckItem yes={false} disabled>No image uploads</CheckItem>
              <CheckItem yes={false} disabled>No exports</CheckItem>
            </div>
            {currentPlan === "free" ? (
              <div className="cta-free" style={{ textAlign: "center", padding: "12px", fontSize: 12, color: "rgba(240,240,248,.3)", cursor: "default" }}>
                ✓ Your current plan
              </div>
            ) : (
              <button className="cta-free" onClick={handleDowngrade} disabled={loading}>
                Downgrade to Free
              </button>
            )}
          </div>

          {/* PRO */}
          <div className={`plan-card pro ${currentPlan === "pro" ? "selected" : ""}`}>
            {/* Glow top strip */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#a78bfa,transparent)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 6 }}>Pro</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                  <span className="price-cur">€</span>
                  <span className="price-num">{price}</span>
                  <span className="price-per">/ {billing === "annual" ? "mo, billed annually" : "month"}</span>
                </div>
                {billing === "annual" && (
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(240,240,248,.3)", marginTop: 3 }}>
                    €{annualPrice * 12}/year · saves €{(monthlyPrice - annualPrice) * 12}/year
                  </div>
                )}
              </div>
              {currentPlan === "pro" ? (
                <span className="plan-badge current">Current plan</span>
              ) : (
                <span className="plan-badge popular">Most popular</span>
              )}
            </div>

            <p style={{ fontSize: 13, color: "rgba(240,240,248,.55)", lineHeight: 1.6, marginBottom: 22 }}>
              For serious commission painters who need unlimited power and full data control.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
              <CheckItem yes>Unlimited miniatures</CheckItem>
              <CheckItem yes>Unlimited clients</CheckItem>
              <CheckItem yes>Unlimited quotes</CheckItem>
              <CheckItem yes>Paint catalog</CheckItem>
              <CheckItem yes>Advanced analytics</CheckItem>
              <CheckItem yes>Image uploads</CheckItem>
              <CheckItem yes>PDF & CSV export</CheckItem>
              <CheckItem yes>Cloud sync & backup</CheckItem>
              <CheckItem yes>Priority support</CheckItem>
            </div>

            {currentPlan === "pro" ? (
              <div className="cta-pro" style={{ textAlign: "center", padding: "13px", fontSize: 13, opacity: .6, cursor: "default" }}>
                ✓ Your current plan
              </div>
            ) : (
              <button className="cta-pro" onClick={handleUpgrade} disabled={loading}>
                {loading ? <span className="spinner" /> : `Upgrade to Pro →`}
              </button>
            )}

            {currentPlan !== "pro" && (
              <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(240,240,248,.25)" }}>
                No commitments · Cancel anytime
              </p>
            )}
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="plan-fade-3">
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "rgba(240,240,248,.5)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 16 }}>
            Full Feature Comparison
          </h3>
          <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", background: "rgba(0,0,0,.2)" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "rgba(240,240,248,.4)" }}>FEATURE</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "rgba(240,240,248,.4)", textAlign: "center", minWidth: 80 }}>FREE</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", color: "#a78bfa", textAlign: "center", minWidth: 80 }}>PRO</div>
            </div>
            {FREE_FEATURES.map((f, i) => (
              <div key={i} className="feature-table-row">
                <span className="col-label">{f.label}</span>
                <span className="col-free">{f.free}</span>
                <span className="col-pro">{f.pro}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ / Trust */}
        <div className="plan-fade-3" style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { icon: "🔒", title: "Secure payments", text: "Stripe handles all payments with bank-grade encryption." },
            { icon: "🔄", title: "Cancel anytime", text: "No lock-in. Cancel your subscription whenever you want." },
            { icon: "💾", title: "Your data is yours", text: "Export everything at any time. We never sell your data." },
          ].map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#f0f0f8", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(240,240,248,.4)", lineHeight: 1.6 }}>{f.text}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40, fontSize: 12, color: "rgba(240,240,248,.2)", fontFamily: "'DM Sans',sans-serif" }}>
          © 2025 MiniTrack · Questions? <span style={{ color: "#a78bfa", cursor: "pointer" }}>support@minitrack.app</span>
        </div>
      </div>
    </div>
  )
}
