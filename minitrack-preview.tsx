import { useState, useMemo } from "react"

const STATUS_CFG = {
  Planned:  { bg:"rgba(113,113,122,.2)", fg:"#d4d4d8", dot:"#71717a" },
  Printed:  { bg:"rgba(59,130,246,.2)",  fg:"#93c5fd", dot:"#3b82f6" },
  Painting: { bg:"rgba(234,179,8,.2)",   fg:"#fde047", dot:"#eab308" },
  Completed:{ bg:"rgba(16,185,129,.2)",  fg:"#6ee7b7", dot:"#10b981" },
  Sold:     { bg:"rgba(139,92,246,.2)",  fg:"#c4b5fd", dot:"#8b5cf6" },
}
const QSTATUS_CFG = {
  Draft:    { bg:"rgba(113,113,122,.2)", fg:"#d4d4d8", dot:"#71717a", border:"#52525b" },
  Sent:     { bg:"rgba(59,130,246,.2)",  fg:"#93c5fd", dot:"#3b82f6", border:"#3b82f6" },
  Accepted: { bg:"rgba(16,185,129,.2)",  fg:"#6ee7b7", dot:"#10b981", border:"#10b981" },
  Rejected: { bg:"rgba(239,68,68,.2)",   fg:"#fca5a5", dot:"#ef4444", border:"#ef4444" },
  Completed:{ bg:"rgba(139,92,246,.2)",  fg:"#c4b5fd", dot:"#8b5cf6", border:"#8b5cf6" },
}
const Q_TRANSITIONS = {
  Draft:["Sent","Rejected"], Sent:["Accepted","Rejected"],
  Accepted:["Completed","Rejected"], Rejected:["Draft"], Completed:[]
}
const MINI_STATUSES  = ["Planned","Printed","Painting","Completed","Sold"]
const QUOTE_STATUSES = ["Draft","Sent","Accepted","Rejected","Completed"]
const PAINT_TYPES    = ["Base","Layer","Shade","Contrast","Dry","Technical","Air","Other"]
const TYPE_STYLE = {
  Base:     { bg:"rgba(239,68,68,.2)",   fg:"#fca5a5" },
  Shade:    { bg:"rgba(59,130,246,.2)",  fg:"#93c5fd" },
  Layer:    { bg:"rgba(249,115,22,.2)",  fg:"#fdba74" },
  Contrast: { bg:"rgba(168,85,247,.2)",  fg:"#d8b4fe" },
  Technical:{ bg:"rgba(34,197,94,.2)",   fg:"#86efac" },
  Dry:      { bg:"rgba(234,179,8,.2)",   fg:"#fde047" },
  Air:      { bg:"rgba(6,182,212,.2)",   fg:"#67e8f9" },
  Other:    { bg:"rgba(113,113,122,.2)", fg:"#d4d4d8" },
}

const uid = () => Math.random().toString(36).slice(2,9)
const today = () => new Date().toISOString().slice(0,10)

const SEED_CATS = ["Warhammer 40k","Age of Sigmar","Horus Heresy","The Old World","Kill Team","Warcry","Other"].map(n=>({id:uid(),name:n}))
const SEED_ARMIES = [
  {id:uid(),name:"Space Marines",    system:"Warhammer 40k",global:true},
  {id:uid(),name:"Black Templars",   system:"Warhammer 40k",global:true},
  {id:uid(),name:"Death Guard",      system:"Warhammer 40k",global:true},
  {id:uid(),name:"Necrons",          system:"Warhammer 40k",global:true},
  {id:uid(),name:"Stormcast Eternals",system:"Age of Sigmar",global:true},
  {id:uid(),name:"Nighthaunt",       system:"Age of Sigmar",global:true},
]
const SEED_PAINTS = [
  {id:uid(),brand:"Citadel",code:"CITA-BASE-001", name:"Abaddon Black",    type:"Base",    global:true},
  {id:uid(),brand:"Citadel",code:"CITA-BASE-002", name:"Corax White",      type:"Base",    global:true},
  {id:uid(),brand:"Citadel",code:"CITA-SHADE-001",name:"Nuln Oil",         type:"Shade",   global:true},
  {id:uid(),brand:"Citadel",code:"CITA-SHADE-002",name:"Agrax Earthshade", type:"Shade",   global:true},
  {id:uid(),brand:"Citadel",code:"CITA-LAYER-001",name:"Evil Sunz Scarlet",type:"Layer",   global:true},
  {id:uid(),brand:"Citadel",code:"CITA-CON-001",  name:"Black Templar",    type:"Contrast",global:true},
  {id:uid(),brand:"Vallejo", code:"70.950",        name:"Black",            type:"Base",    global:false},
]

const cat40k = SEED_CATS[0].id
const armySM = SEED_ARMIES[0].id
const armyDG = SEED_ARMIES[2].id
const pBlack = SEED_PAINTS[0].id
const pNuln  = SEED_PAINTS[2].id

const SEED_MINIS = [
  {id:uid(),name:"Primaris Intercessor",status:"Completed",categoryId:cat40k,armyId:armySM,materialCost:8, hoursSpent:6, salePrice:22,notes:"Tabletop quality.",paintIds:[pBlack,pNuln],images:[]},
  {id:uid(),name:"Nurgle Daemon Prince", status:"Painting", categoryId:cat40k,armyId:armyDG,materialCost:20,hoursSpent:12,salePrice:0, notes:"Display project.", paintIds:[pNuln],images:[]},
  {id:uid(),name:"Necron Warrior",       status:"Planned",  categoryId:cat40k,armyId:SEED_ARMIES[3].id,materialCost:0,hoursSpent:0,salePrice:0,notes:"",paintIds:[],images:[]},
  {id:uid(),name:"Stormcast Paladin",    status:"Sold",     categoryId:SEED_CATS[1].id,armyId:SEED_ARMIES[4].id,materialCost:10,hoursSpent:8,salePrice:35,notes:"",paintIds:[],images:[]},
]

const cJoao = uid(), cAna = uid()
const SEED_CLIENTS = [
  {id:cJoao,name:"João Silva",contact:"joao@email.com",phone:"+351 912 345 678",notes:"Fast turnaround preferred.",projects:["Space Marines 2000pts"]},
  {id:cAna, name:"Ana Costa", contact:"ana@gmail.com", phone:"+351 965 432 100",notes:"Display quality collector.",projects:["Necron Dynasty"]},
]
const SEED_QUOTES = [
  {id:uid(),clientId:cJoao,title:"Space Marines Strike Force",status:"Accepted",createdAt:"2025-01-10",sentAt:"2025-01-12",acceptedAt:"2025-01-14",rejectedAt:null,completedAt:null,notes:"Tabletop standard.",
   lines:[{id:uid(),name:"Primaris Intercessor",qty:10,unitCost:8,pvp:22},{id:uid(),name:"Redemptor Dreadnought",qty:1,unitCost:25,pvp:65}]},
  {id:uid(),clientId:cAna,title:"Necron Dynasty",status:"Sent",createdAt:"2025-02-20",sentAt:"2025-02-21",acceptedAt:null,rejectedAt:null,completedAt:null,notes:"OSL effects.",
   lines:[{id:uid(),name:"Necron Warrior",qty:20,unitCost:6,pvp:18}]},
]

// ── atoms ──────────────────────────────────────────────────
const s = (base={})=>({...base})
const Card = ({children,style={}})=><div style={{background:"#18181b",border:"1px solid #27272a",borderRadius:12,...style}}>{children}</div>
const SLabel = ({children})=><div style={{fontSize:10,fontWeight:700,color:"#52525b",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>{children}</div>
const Field = ({label,children})=><div><label style={{display:"block",fontSize:12,color:"#71717a",marginBottom:4}}>{label}</label>{children}</div>
const TInput = ({value,onChange,placeholder="",type="text",style={}})=>(
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{padding:"8px 12px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box",...style}}/>
)
const TSelect = ({value,onChange,children,style={}})=>(
  <select value={value} onChange={onChange}
    style={{padding:"8px 12px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#d4d4d8",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box",...style}}>
    {children}
  </select>
)
const Btn = ({children,onClick,v="primary",disabled=false,style={}})=>{
  const vs={
    primary:{background:"#7c3aed",color:"#fff",border:"none"},
    ghost:  {background:"#27272a",color:"#a1a1aa",border:"none"},
    danger: {background:"rgba(239,68,68,.1)",color:"#f87171",border:"1px solid rgba(239,68,68,.25)"},
  }
  return <button onClick={onClick} disabled={disabled} style={{padding:"7px 14px",borderRadius:8,cursor:disabled?"default":"pointer",fontSize:13,fontWeight:600,opacity:disabled?.4:1,...vs[v],...style}}>{children}</button>
}
const MBadge = ({status})=>{
  const c=STATUS_CFG[status]||STATUS_CFG.Planned
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600,background:c.bg,color:c.fg}}><span style={{width:5,height:5,borderRadius:"50%",background:c.dot,display:"inline-block"}}/>{status}</span>
}
const QBadge = ({status,large=false})=>{
  const c=QSTATUS_CFG[status]||QSTATUS_CFG.Draft
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:large?"4px 12px":"2px 8px",borderRadius:4,fontSize:large?12:10,fontWeight:600,background:c.bg,color:c.fg,border:`1px solid ${c.border}33`}}><span style={{width:large?7:5,height:large?7:5,borderRadius:"50%",background:c.dot,display:"inline-block"}}/>{status}</span>
}
const BackBtn = ({onClick})=><button onClick={onClick} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",fontSize:13,textAlign:"left",padding:0,marginBottom:4}}>← Back</button>

const fmt     = v=>`€${(parseFloat(v)||0).toFixed(2)}`
const fmtD    = d=>d?new Date(d).toLocaleDateString("pt-PT",{day:"2-digit",month:"short",year:"numeric"}):"—"
const daysSince = d=>d?Math.floor((Date.now()-new Date(d))/(864e5)):null
const lineGross  = l=>l.qty*l.pvp
const lineCost   = l=>l.qty*l.unitCost
const lineProfit = l=>lineGross(l)-lineCost(l)
const qGross  = q=>q.lines.reduce((a,l)=>a+lineGross(l),0)
const qCost   = q=>q.lines.reduce((a,l)=>a+lineCost(l),0)
const qProfit = q=>qGross(q)-qCost(q)
const qMargin = q=>qGross(q)>0?(qProfit(q)/qGross(q)*100):0
const rh = {onMouseEnter:e=>e.currentTarget.style.background="#1c1c1f",onMouseLeave:e=>e.currentTarget.style.background="transparent"}

const NAV   = [{id:"dashboard",label:"Dashboard",icon:"▦"},{id:"miniatures",label:"Miniatures",icon:"⬡"},{id:"clients",label:"Clients",icon:"👥"},{id:"quotes",label:"Quotes",icon:"📋"},{id:"settings",label:"Settings",icon:"⚙"}]
const STABS = [{id:"paints",label:"Paints"},{id:"categories",label:"Categories"},{id:"armies",label:"Armies"},{id:"general",label:"General"}]

// ── sub-page components ────────────────────────────────────
function MiniDetail({m,paints,getArmy,getCat,hourlyRate,currency,onBack,onEdit,onDelete}) {
  const profit = m.salePrice - m.materialCost
  return (
    <div style={{maxWidth:560,display:"flex",flexDirection:"column",gap:14}}>
      <BackBtn onClick={onBack}/>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
        <div>
          <h1 style={{fontSize:21,fontWeight:700,margin:"0 0 6px"}}>{m.name}</h1>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <MBadge status={m.status}/>
            <span style={{fontSize:12,color:"#71717a"}}>{getArmy(m.armyId)?.name} · {getCat(m.categoryId)?.name}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexShrink:0}}>
          <Btn v="ghost" style={{fontSize:12}} onClick={onEdit}>✎ Edit</Btn>
          <Btn v="danger" style={{fontSize:12}} onClick={onDelete}>🗑</Btn>
        </div>
      </div>
      <div style={{height:150,background:"#27272a",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:72,border:"1px solid #3f3f46"}}>⬡</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {[{label:"Material Cost",val:fmt(m.materialCost),green:null},{label:"Sale Price",val:fmt(m.salePrice),green:null},{label:"Profit",val:fmt(profit),green:profit>=0}].map(s=>(
          <Card key={s.label} style={{padding:"12px 14px"}}>
            <div style={{fontSize:11,color:"#71717a",marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:18,fontWeight:700,color:s.green!=null?(s.green?"#4ade80":"#f87171"):"#f4f4f5"}}>{s.val}</div>
          </Card>
        ))}
      </div>
      {m.hoursSpent>0&&<Card style={{padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:"#a1a1aa"}}>⏱ <strong style={{color:"#f4f4f5"}}>{m.hoursSpent}h</strong> spent</span><span style={{fontSize:13,color:"#a78bfa",fontWeight:600}}>{currency}{(m.hoursSpent*parseFloat(hourlyRate||0)).toFixed(2)} labour</span></Card>}
      {m.paintIds.length>0&&<div><SLabel>Paints Used</SLabel><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{m.paintIds.map(id=>{const p=paints.find(x=>x.id===id);return p?<span key={id} style={{padding:"4px 10px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:20,fontSize:12,color:"#d4d4d8"}}>{p.brand} — {p.code} — {p.name}</span>:null})}</div></div>}
      {m.notes&&<Card style={{padding:"12px 14px"}}><p style={{margin:0,fontSize:13,color:"#d4d4d8",lineHeight:1.6}}>{m.notes}</p></Card>}
      <Card style={{padding:"12px 14px"}}><SLabel>Images</SLabel><div style={{textAlign:"center",padding:"16px",color:"#52525b",fontSize:13,borderRadius:8,border:"1px dashed #3f3f46"}}>Upload images after creating the project.</div></Card>
    </div>
  )
}

function QuoteDetail({q,getClient,advanceQ,onBack,onDelete}) {
  const tl = [
    {label:"Created",  date:q.createdAt,  done:true},
    {label:"Sent",     date:q.sentAt,     done:!!q.sentAt,     active:q.status==="Sent"},
    {label:"Accepted", date:q.acceptedAt, done:!!q.acceptedAt, active:q.status==="Accepted"},
    {label:"Completed",date:q.completedAt,done:!!q.completedAt,active:q.status==="Completed"},
    ...(q.rejectedAt?[{label:"Rejected",date:q.rejectedAt,done:true}]:[]),
  ]
  return (
    <div style={{maxWidth:660,display:"flex",flexDirection:"column",gap:14}}>
      <BackBtn onClick={onBack}/>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
        <div>
          <h1 style={{fontSize:21,fontWeight:700,margin:"0 0 6px"}}>{q.title}</h1>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <QBadge status={q.status} large/>
            <span style={{fontSize:12,color:"#71717a"}}>👤 {getClient(q.clientId)?.name}</span>
          </div>
        </div>
        <Btn v="danger" style={{fontSize:12,flexShrink:0}} onClick={onDelete}>🗑 Delete</Btn>
      </div>
      <Card style={{padding:"14px 16px"}}>
        <SLabel>Timeline</SLabel>
        <div style={{display:"flex",flexDirection:"column",gap:10,position:"relative",paddingLeft:4}}>
          <div style={{position:"absolute",left:7,top:8,bottom:8,width:1,background:"#27272a"}}/>
          {tl.map(step=>(
            <div key={step.label} style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:step.done?"#10b981":step.active?"#a78bfa":"#3f3f46",flexShrink:0,boxShadow:step.done?"0 0 0 3px rgba(16,185,129,.2)":step.active?"0 0 0 3px rgba(167,139,250,.2)":"none"}}/>
              <span style={{fontSize:11,color:step.done||step.active?"#d4d4d8":"#52525b",fontWeight:step.done||step.active?500:400}}>{step.label}</span>
              {step.date&&<span style={{fontSize:10,color:"#71717a",marginLeft:4}}>{fmtD(step.date)}</span>}
            </div>
          ))}
        </div>
        {Q_TRANSITIONS[q.status]?.length>0&&(
          <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid #27272a",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:12,color:"#71717a"}}>Move to:</span>
            {Q_TRANSITIONS[q.status].map(ns=>(
              <button key={ns} onClick={()=>advanceQ(q.id,ns)} style={{padding:"5px 14px",borderRadius:8,border:`1px solid ${QSTATUS_CFG[ns].dot}44`,background:QSTATUS_CFG[ns].bg,color:QSTATUS_CFG[ns].fg,cursor:"pointer",fontSize:12,fontWeight:600}}>{ns} →</button>
            ))}
          </div>
        )}
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[{label:"Total Cost",val:fmt(qCost(q)),color:"#f87171"},{label:"Total PVP",val:fmt(qGross(q)),color:"#f4f4f5"},{label:"Gross Profit",val:fmt(qProfit(q)),color:qProfit(q)>=0?"#34d399":"#f87171",sub:`${qMargin(q).toFixed(1)}% margin`}].map(st=>(
          <Card key={st.label} style={{padding:"12px 14px"}}>
            <div style={{fontSize:11,color:"#71717a",marginBottom:4}}>{st.label}</div>
            <div style={{fontSize:18,fontWeight:700,color:st.color}}>{st.val}</div>
            {st.sub&&<div style={{fontSize:10,color:"#71717a",marginTop:2}}>{st.sub}</div>}
          </Card>
        ))}
      </div>
      <Card style={{overflow:"hidden"}}>
        <div style={{padding:"10px 16px",borderBottom:"1px solid #27272a"}}><SLabel>Line Items</SLabel></div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
            <thead><tr style={{borderBottom:"1px solid #27272a"}}>
              {["Figure","Qty","Unit Cost","PVP","Subtotal","Profit"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:h==="Figure"?"left":"right",fontSize:10,color:"#71717a",fontWeight:500}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {q.lines.map((l,i)=>(
                <tr key={l.id} style={{borderBottom:i<q.lines.length-1?"1px solid #27272a":"none"}}>
                  <td style={{padding:"10px 12px",fontSize:13,fontWeight:500}}>{l.name}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",color:"#a1a1aa",fontSize:13}}>{l.qty}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",color:"#f87171",fontSize:13}}>{fmt(l.unitCost)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",color:"#a1a1aa",fontSize:13}}>{fmt(l.pvp)}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:600,fontSize:13}}>{fmt(lineGross(l))}</td>
                  <td style={{padding:"10px 12px",textAlign:"right",fontWeight:600,fontSize:13,color:lineProfit(l)>=0?"#34d399":"#f87171"}}>{fmt(lineProfit(l))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #27272a",display:"flex",justifyContent:"flex-end",gap:28}}>
          <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#71717a",marginBottom:2}}>Total PVP</div><div style={{fontSize:20,fontWeight:700,color:"#a78bfa"}}>{fmt(qGross(q))}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#71717a",marginBottom:2}}>Gross Profit</div><div style={{fontSize:20,fontWeight:700,color:qProfit(q)>=0?"#34d399":"#f87171"}}>{fmt(qProfit(q))}</div></div>
        </div>
      </Card>
      {q.notes&&<Card style={{padding:"13px 16px"}}><SLabel>Notes</SLabel><p style={{margin:0,fontSize:13,color:"#d4d4d8",lineHeight:1.6}}>{q.notes}</p></Card>}
    </div>
  )
}

// ── main ──────────────────────────────────────────────────
export default function App() {
  const [page,  setPage]   = useState("dashboard")
  const [stab,  setStab]   = useState("paints")
  const [sidebarOpen, setSO] = useState(false)
  const [cats,   setCats]  = useState(SEED_CATS)
  const [armies, setArmies]= useState(SEED_ARMIES)
  const [paints, setPaints]= useState(SEED_PAINTS)
  const [minis,  setMinis] = useState(SEED_MINIS)
  const [clients,setClients]=useState(SEED_CLIENTS)
  const [quotes, setQuotes]= useState(SEED_QUOTES)
  const [hourlyRate,setHR] = useState("15")
  const [currency,  setCur]= useState("€")

  const [selMini,   setSM] = useState(null)
  const [selClient, setSC] = useState(null)
  const [selQuote,  setSQ] = useState(null)
  const [subView,   setSV] = useState(null)

  const nav = id => { setPage(id); setSO(false); setSM(null); setSC(null); setSQ(null); setSV(null) }

  const sold = minis.filter(m=>m.status==="Sold")
  const totalProfit  = sold.reduce((a,m)=>a+m.salePrice-m.materialCost,0)
  const totalHours   = minis.reduce((a,m)=>a+m.hoursSpent,0)
  const labourValue  = totalHours*parseFloat(hourlyRate||0)
  const clientQuotes = cid=>quotes.filter(q=>q.clientId===cid)
  const clientBilled = cid=>clientQuotes(cid).filter(q=>["Accepted","Completed"].includes(q.status)).reduce((a,q)=>a+qGross(q),0)
  const clientLast   = cid=>{ const ds=clientQuotes(cid).flatMap(q=>[q.createdAt,q.sentAt,q.acceptedAt,q.completedAt].filter(Boolean)); return ds.sort().reverse()[0]||null }
  const getClient = id=>clients.find(c=>c.id===id)
  const getCat    = id=>cats.find(c=>c.id===id)
  const getArmy   = id=>armies.find(a=>a.id===id)

  const advanceQ = (qid,ns) => {
    const now=today()
    const stamp=q=>({...q,status:ns,sentAt:ns==="Sent"?now:q.sentAt,acceptedAt:ns==="Accepted"?now:q.acceptedAt,rejectedAt:ns==="Rejected"?now:q.rejectedAt,completedAt:ns==="Completed"?now:q.completedAt})
    setQuotes(qs=>qs.map(q=>q.id===qid?stamp(q):q))
    setSQ(sq=>sq?.id===qid?stamp(sq):sq)
  }

  // mini form
  const emptyMini = ()=>({name:"",status:"Planned",categoryId:cats[0]?.id||"",armyId:armies[0]?.id||"",materialCost:0,hoursSpent:0,salePrice:0,notes:"",paintIds:[],images:[]})
  const [mf,setMF]=useState(emptyMini())
  const [paintQ,setPQ]=useState("")
  const paintResults=useMemo(()=>paints.filter(p=>{const q=paintQ.toLowerCase();return q&&(p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.code.toLowerCase().includes(q))&&!mf.paintIds.includes(p.id)}),[paintQ,paints,mf.paintIds])

  const openNewMini  = ()=>{ setMF(emptyMini()); setPQ(""); setSV("new"); setSM(null); setPage("miniatures") }
  const openEditMini = m=>{ setMF({...m}); setPQ(""); setSV("edit"); setSM(null) }
  const saveMini = ()=>{ if(!mf.name.trim())return; if(subView==="new")setMinis(ms=>[{...mf,id:uid()},...ms]); else setMinis(ms=>ms.map(m=>m.id===mf.id?{...mf}:m)); setSV(null) }
  const deleteMini   = id=>{ setMinis(ms=>ms.filter(m=>m.id!==id)); setSM(null) }
  const addPaint2Mini = p=>{ setMF(f=>({...f,paintIds:[...f.paintIds,p.id]})); setPQ("") }
  const rmPaint2Mini  = id=>{ setMF(f=>({...f,paintIds:f.paintIds.filter(x=>x!==id)})) }

  // client form
  const emptyClient=()=>({name:"",contact:"",phone:"",notes:"",projects:[]})
  const [cf,setCF]=useState(emptyClient())
  const openNewClient  = ()=>{ setCF(emptyClient()); setSV("new"); setSC(null); setPage("clients") }
  const openEditClient = c=>{ setCF({...c}); setSV("edit"); setSC(null) }
  const saveClient = ()=>{ if(!cf.name.trim())return; if(subView==="new")setClients(cs=>[{...cf,id:uid()},...cs]); else setClients(cs=>cs.map(c=>c.id===cf.id?{...cf}:c)); setSV(null) }
  const deleteClient   = id=>{ setClients(cs=>cs.filter(c=>c.id!==id)); setQuotes(qs=>qs.filter(q=>q.clientId!==id)); setSC(null) }

  // quote form
  const emptyQuote=()=>({clientId:clients[0]?.id||"",title:"",status:"Draft",notes:"",lines:[],createdAt:today(),sentAt:null,acceptedAt:null,rejectedAt:null,completedAt:null})
  const [qf,setQF]=useState(emptyQuote())
  const [addingLine,setAL]=useState(false)
  const [nl,setNL]=useState({name:"",qty:1,unitCost:0,pvp:0})
  const [qSearch,setQSearch]=useState("")
  const [qSF,setQSF]=useState("")
  const openNewQuote=(clientId=null)=>{ setQF({...emptyQuote(),clientId:clientId||clients[0]?.id||""}); setAL(false); setSV("new"); setSQ(null); setPage("quotes") }
  const addLine=()=>{ if(!nl.name.trim())return; setQF(q=>({...q,lines:[...q.lines,{id:uid(),...nl,qty:parseInt(nl.qty)||1,unitCost:parseFloat(nl.unitCost)||0,pvp:parseFloat(nl.pvp)||0}]})); setNL({name:"",qty:1,unitCost:0,pvp:0}); setAL(false) }
  const saveQuote=()=>{ if(!qf.clientId||!qf.title.trim())return; setQuotes(qs=>[{...qf,id:uid()},...qs]); setSV(null) }
  const deleteQuote=id=>{ setQuotes(qs=>qs.filter(q=>q.id!==id)); setSQ(null) }

  // settings
  const [newCat,setNewCat]=useState("")
  const [newArmy,setNewArmy]=useState({name:"",system:""})
  const [newPaint,setNewPaint]=useState({brand:"",code:"",name:"",type:""})
  const [pSearch,setPSearch]=useState("")
  const [pScope,setPScope]=useState("all")
  const [eCat,setECat]=useState(null)
  const [eArmy,setEArmy]=useState(null)

  const filtPaints=paints.filter(p=>{ const q=pSearch.toLowerCase(); const m=!q||(p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.code.toLowerCase().includes(q)); const sc=pScope==="all"||(pScope==="global"&&p.global)||(pScope==="personal"&&!p.global); return m&&sc })
  const armyGroups=useMemo(()=>armies.reduce((acc,a)=>{ const g=a.system||"Custom"; if(!acc[g])acc[g]=[]; acc[g].push(a); return acc },{}), [armies])

  const [mSearch,setMSearch]=useState("")
  const [mSF,setMSF]=useState("")
  const [mCF,setMCF]=useState("")
  const filtMinis=minis.filter(m=>(!mSearch||m.name.toLowerCase().includes(mSearch.toLowerCase()))&&(!mSF||m.status===mSF)&&(!mCF||m.categoryId===mCF))
  const filtQuotes=quotes.filter(q=>{ const c=getClient(q.clientId); return (!qSearch||(q.title.toLowerCase().includes(qSearch.toLowerCase())||(c?.name||"").toLowerCase().includes(qSearch.toLowerCase())))&&(!qSF||q.status===qSF) })
  const [cSearch,setCSearch]=useState("")
  const filtClients=clients.filter(c=>!cSearch||c.name.toLowerCase().includes(cSearch.toLowerCase())||c.contact.toLowerCase().includes(cSearch.toLowerCase()))

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#09090b",color:"#f4f4f5",minHeight:"100vh",display:"flex",fontSize:14}}>
      {sidebarOpen&&<div onClick={()=>setSO(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:20}}/>}

      {/* SIDEBAR */}
      <aside style={{position:"fixed",top:0,left:0,bottom:0,width:212,background:"#18181b",borderRight:"1px solid #27272a",display:"flex",flexDirection:"column",zIndex:30,transform:sidebarOpen?"translateX(0)":"translateX(-100%)",transition:"transform .2s"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #27272a",fontSize:18,fontWeight:700}}>Mini<span style={{color:"#a78bfa"}}>Track</span></div>
        <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>nav(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:"none",background:page===n.id?"rgba(139,92,246,.2)":"transparent",color:page===n.id?"#c4b5fd":"#a1a1aa",cursor:"pointer",fontSize:13,fontWeight:page===n.id?600:400,textAlign:"left"}}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"12px 8px",borderTop:"1px solid #27272a"}}>
          <div style={{padding:"5px 12px",fontSize:11,color:"#52525b"}}>demo@minitrack.app</div>
          <button style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:8,border:"none",background:"transparent",color:"#a1a1aa",cursor:"pointer",fontSize:13,width:"100%"}}>↩ Sign out</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <header style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px",height:52,borderBottom:"1px solid #27272a",background:"#18181b",flexShrink:0}}>
          <button onClick={()=>setSO(true)} style={{background:"none",border:"none",color:"#a1a1aa",cursor:"pointer",fontSize:18}}>☰</button>
          <span style={{fontWeight:700}}>Mini<span style={{color:"#a78bfa"}}>Track</span></span>
          <div style={{flex:1}}/>
          {page==="miniatures"&&!subView&&!selMini  &&<Btn onClick={openNewMini}>+ New Miniature</Btn>}
          {page==="clients"  &&!subView&&!selClient &&<Btn onClick={openNewClient}>+ New Client</Btn>}
          {page==="quotes"   &&!subView&&!selQuote  &&<Btn onClick={()=>openNewQuote()}>+ New Quote</Btn>}
        </header>

        <main style={{flex:1,padding:16,overflow:"auto"}}>

          {/* ── DASHBOARD ── */}
          {page==="dashboard" && (
            <div style={{maxWidth:700,display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h1 style={{fontSize:22,fontWeight:700,margin:0}}>Dashboard</h1>
                <Btn onClick={openNewMini}>+ New Miniature</Btn>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                {[{label:"Total Miniatures",val:minis.length,color:"#a78bfa"},{label:"In Progress",val:minis.filter(m=>["Printed","Painting"].includes(m.status)).length,color:"#fbbf24"},{label:"Completed",val:minis.filter(m=>m.status==="Completed").length,color:"#34d399"},{label:"Sold",val:sold.length,color:"#60a5fa"}].map(st=>(
                  <Card key={st.label} style={{padding:"16px 20px"}}><div style={{fontSize:12,color:"#71717a",marginBottom:8}}>{st.label}</div><div style={{fontSize:28,fontWeight:700,color:st.color}}>{st.val}</div></Card>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{background:"linear-gradient(135deg,rgba(109,40,217,.25),rgba(109,40,217,.05))",border:"1px solid rgba(139,92,246,.3)",borderRadius:12,padding:"16px 20px"}}>
                  <div style={{fontSize:12,color:"#a1a1aa",marginBottom:6}}>Total Profit (Sold)</div>
                  <div style={{fontSize:28,fontWeight:700,color:totalProfit>=0?"#4ade80":"#f87171"}}>{fmt(totalProfit)}</div>
                </div>
                <div style={{background:"rgba(139,92,246,.07)",border:"1px solid rgba(139,92,246,.2)",borderRadius:12,padding:"16px 20px"}}>
                  <div style={{fontSize:12,color:"#a1a1aa",marginBottom:6}}>Labour Value</div>
                  <div style={{fontSize:28,fontWeight:700,color:"#a78bfa"}}>{fmt(labourValue)}</div>
                  <div style={{fontSize:11,color:"#52525b",marginTop:4}}>{currency}{hourlyRate}/h · {totalHours}h total</div>
                </div>
              </div>
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><SLabel>Recent Miniatures</SLabel><button onClick={()=>nav("miniatures")} style={{background:"none",border:"none",color:"#a78bfa",cursor:"pointer",fontSize:13}}>View all →</button></div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                  {minis.slice(0,4).map(m=>(
                    <button key={m.id} onClick={()=>{setSM(m);setPage("miniatures")}} style={{background:"#18181b",border:"1px solid #27272a",borderRadius:12,overflow:"hidden",cursor:"pointer",textAlign:"left",padding:0}}>
                      <div style={{height:72,background:"#27272a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,position:"relative"}}>⬡<span style={{position:"absolute",top:6,right:6}}><MBadge status={m.status}/></span></div>
                      <div style={{padding:"8px 10px"}}><div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div><div style={{fontSize:11,color:"#71717a",marginTop:2}}>{getArmy(m.armyId)?.name}</div></div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><SLabel>Recent Quotes</SLabel><button onClick={()=>nav("quotes")} style={{background:"none",border:"none",color:"#a78bfa",cursor:"pointer",fontSize:13}}>View all →</button></div>
                <Card>
                  {quotes.slice(0,3).map((q,i,arr)=>(
                    <div key={q.id} onClick={()=>{setSQ(q);setPage("quotes")}} {...rh} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:i<arr.length-1?"1px solid #27272a":"none",cursor:"pointer"}}>
                      <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{q.title}</div><div style={{fontSize:11,color:"#71717a",marginTop:2}}>{getClient(q.clientId)?.name} · {fmtD(q.createdAt)}</div></div>
                      <QBadge status={q.status}/><div style={{fontSize:13,fontWeight:700}}>{fmt(qGross(q))}</div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {/* ── MINIATURES LIST ── */}
          {page==="miniatures" && !selMini && !subView && (
            <div style={{maxWidth:700,display:"flex",flexDirection:"column",gap:14}}>
              <h1 style={{fontSize:22,fontWeight:700,margin:0}}>Miniatures</h1>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <div style={{position:"relative",flex:1,minWidth:130}}>
                  <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#71717a"}}>⌕</span>
                  <input value={mSearch} onChange={e=>setMSearch(e.target.value)} placeholder="Search..." style={{width:"100%",paddingLeft:28,paddingRight:10,paddingTop:8,paddingBottom:8,background:"#18181b",border:"1px solid #27272a",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                </div>
                <TSelect value={mSF} onChange={e=>setMSF(e.target.value)} style={{width:140}}><option value="">All statuses</option>{MINI_STATUSES.map(s=><option key={s}>{s}</option>)}</TSelect>
                <TSelect value={mCF} onChange={e=>setMCF(e.target.value)} style={{width:150}}><option value="">All categories</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</TSelect>
              </div>
              {filtMinis.length===0 ? <div style={{textAlign:"center",padding:"48px",color:"#52525b"}}>No miniatures found.</div>
              : <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                  {filtMinis.map(m=>(
                    <button key={m.id} onClick={()=>setSM(m)} style={{background:"#18181b",border:"1px solid #27272a",borderRadius:12,overflow:"hidden",cursor:"pointer",textAlign:"left",padding:0}}>
                      <div style={{height:88,background:"#27272a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,position:"relative"}}>⬡<span style={{position:"absolute",top:6,right:6}}><MBadge status={m.status}/></span></div>
                      <div style={{padding:"8px 10px"}}><div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div><div style={{fontSize:11,color:"#71717a",marginTop:2}}>{getArmy(m.armyId)?.name} · {getCat(m.categoryId)?.name}</div></div>
                    </button>
                  ))}
                </div>}
            </div>
          )}

          {/* ── MINI DETAIL ── */}
          {page==="miniatures" && selMini && !subView && (
            <MiniDetail m={selMini} paints={paints} getArmy={getArmy} getCat={getCat} hourlyRate={hourlyRate} currency={currency}
              onBack={()=>setSM(null)} onEdit={()=>openEditMini(selMini)} onDelete={()=>deleteMini(selMini.id)}/>
          )}

          {/* ── MINI FORM ── */}
          {page==="miniatures" && subView && (
            <div style={{maxWidth:560,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button onClick={()=>setSV(null)} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",fontSize:18}}>←</button>
                <h1 style={{fontSize:20,fontWeight:700,margin:0}}>{subView==="new"?"New Miniature":"Edit Miniature"}</h1>
              </div>
              <Card style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
                <Field label="Name *"><TInput value={mf.name} onChange={e=>setMF(f=>({...f,name:e.target.value}))} placeholder="e.g. Primaris Intercessor"/></Field>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <Field label="Status *"><TSelect value={mf.status} onChange={e=>setMF(f=>({...f,status:e.target.value}))}>{MINI_STATUSES.map(s=><option key={s}>{s}</option>)}</TSelect></Field>
                  <Field label="Category *"><TSelect value={mf.categoryId} onChange={e=>setMF(f=>({...f,categoryId:e.target.value}))}>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</TSelect></Field>
                </div>
                <Field label="Army *"><TSelect value={mf.armyId} onChange={e=>setMF(f=>({...f,armyId:e.target.value}))}>{Object.entries(armyGroups).map(([sys,arms])=><optgroup key={sys} label={sys}>{arms.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</optgroup>)}</TSelect></Field>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {[{label:"Material Cost (€)",f:"materialCost"},{label:"Hours Spent",f:"hoursSpent"},{label:"Sale Price (€)",f:"salePrice"}].map(({label,f})=>(
                    <Field key={f} label={label}><TInput type="number" value={mf[f]} onChange={e=>setMF(fm=>({...fm,[f]:parseFloat(e.target.value)||0}))}/></Field>
                  ))}
                </div>
                <Field label="Notes"><textarea value={mf.notes} onChange={e=>setMF(f=>({...f,notes:e.target.value}))} rows={2} placeholder="Painting recipe..." style={{padding:"8px 12px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",resize:"none",width:"100%",boxSizing:"border-box"}}/></Field>
              </Card>
              <Card style={{padding:14}}>
                <SLabel>Paints Used</SLabel>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                  {mf.paintIds.map(id=>{ const p=paints.find(x=>x.id===id); return p?(<span key={id} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:20,fontSize:12,color:"#d4d4d8"}}>{p.brand} — {p.name}<button onClick={()=>rmPaint2Mini(id)} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",fontSize:12,padding:0}}>✕</button></span>):null })}
                </div>
                <div style={{position:"relative"}}>
                  <input value={paintQ} onChange={e=>setPQ(e.target.value)} placeholder="Search paints to add..." style={{width:"100%",padding:"8px 12px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                  {paintResults.length>0&&(
                    <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,zIndex:10,maxHeight:160,overflowY:"auto",marginTop:2}}>
                      {paintResults.map(p=>(
                        <button key={p.id} onClick={()=>addPaint2Mini(p)} style={{width:"100%",padding:"9px 12px",textAlign:"left",background:"none",border:"none",color:"#d4d4d8",cursor:"pointer",fontSize:13,borderBottom:"1px solid #3f3f46"}} onMouseEnter={e=>e.currentTarget.style.background="#3f3f46"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                          <strong>{p.brand}</strong> — {p.code} — {p.name}
                          {p.type&&<span style={{marginLeft:6,padding:"1px 6px",borderRadius:3,fontSize:10,background:TYPE_STYLE[p.type]?.bg,color:TYPE_STYLE[p.type]?.fg}}>{p.type}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <Btn v="ghost" onClick={()=>setSV(null)}>Cancel</Btn>
                <Btn onClick={saveMini} disabled={!mf.name.trim()}>{subView==="new"?"Create Miniature":"Save Changes"}</Btn>
              </div>
            </div>
          )}

          {/* ── CLIENTS LIST ── */}
          {page==="clients" && !selClient && !subView && (
            <div style={{maxWidth:680,display:"flex",flexDirection:"column",gap:14}}>
              <h1 style={{fontSize:22,fontWeight:700,margin:0}}>Clients</h1>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[{label:"Total Clients",val:clients.length,color:"#a78bfa"},{label:"Active Quotes",val:quotes.filter(q=>["Sent","Accepted"].includes(q.status)).length,color:"#34d399"},{label:"Total Billed",val:fmt(quotes.filter(q=>["Completed","Accepted"].includes(q.status)).reduce((a,q)=>a+qGross(q),0)),color:"#fbbf24"}].map(st=>(
                  <Card key={st.label} style={{padding:"14px 18px"}}><div style={{fontSize:11,color:"#71717a",marginBottom:6}}>{st.label}</div><div style={{fontSize:22,fontWeight:700,color:st.color}}>{st.val}</div></Card>
                ))}
              </div>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#71717a"}}>⌕</span>
                <input value={cSearch} onChange={e=>setCSearch(e.target.value)} placeholder="Search clients..." style={{width:"100%",paddingLeft:28,paddingRight:10,paddingTop:8,paddingBottom:8,background:"#18181b",border:"1px solid #27272a",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <Card>
                {filtClients.map((c,i)=>{ const last=clientLast(c.id); const days=daysSince(last); return (
                  <div key={c.id} onClick={()=>setSC(c)} {...rh} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<filtClients.length-1?"1px solid #27272a":"none",cursor:"pointer"}}>
                    <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:17,flexShrink:0}}>{c.name.charAt(0)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:14}}>{c.name}</div>
                      <div style={{fontSize:12,color:"#71717a",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.contact||"—"}{c.phone?" · "+c.phone:""}</div>
                      {last&&<div style={{fontSize:11,color:"#52525b",marginTop:3}}>Last: <span style={{color:days>60?"#f87171":days>30?"#fbbf24":"#71717a"}}>{days===0?"Today":days===1?"Yesterday":`${days}d ago`}</span></div>}
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#a78bfa"}}>{fmt(clientBilled(c.id))}</div>
                      <div style={{fontSize:11,color:"#52525b",marginTop:2}}>{clientQuotes(c.id).length} quotes</div>
                      {c.projects.slice(0,1).map(p=><div key={p} style={{marginTop:4,padding:"1px 7px",background:"rgba(139,92,246,.1)",borderRadius:10,fontSize:10,color:"#a78bfa",display:"inline-block",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p}</div>)}
                    </div>
                    <span style={{color:"#3f3f46",fontSize:16}}>›</span>
                  </div>
                )})}
                {filtClients.length===0&&<div style={{padding:"40px",textAlign:"center",color:"#52525b"}}>No clients found.</div>}
              </Card>
            </div>
          )}

          {/* ── CLIENT DETAIL ── */}
          {page==="clients" && selClient && !subView && (
            <div style={{maxWidth:620,display:"flex",flexDirection:"column",gap:14}}>
              <BackBtn onClick={()=>setSC(null)}/>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:22}}>{selClient.name.charAt(0)}</div>
                <div style={{flex:1}}><h1 style={{fontSize:21,fontWeight:700,margin:"0 0 3px"}}>{selClient.name}</h1><div style={{fontSize:12,color:"#71717a"}}>{selClient.contact}{selClient.phone?" · "+selClient.phone:""}</div>{clientLast(selClient.id)&&<div style={{fontSize:11,color:"#52525b",marginTop:3}}>Last: {fmtD(clientLast(selClient.id))}</div>}</div>
                <div style={{display:"flex",gap:6}}><Btn v="ghost" style={{fontSize:12}} onClick={()=>openEditClient(selClient)}>✎ Edit</Btn><Btn v="danger" style={{fontSize:12}} onClick={()=>deleteClient(selClient.id)}>🗑</Btn></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[{label:"Total Quotes",val:clientQuotes(selClient.id).length,color:"#a78bfa"},{label:"Accepted/Done",val:clientQuotes(selClient.id).filter(q=>["Accepted","Completed"].includes(q.status)).length,color:"#34d399"},{label:"Total Billed",val:fmt(clientBilled(selClient.id)),color:"#fbbf24"}].map(st=>(
                  <Card key={st.label} style={{padding:"12px 14px"}}><div style={{fontSize:11,color:"#71717a",marginBottom:5}}>{st.label}</div><div style={{fontSize:20,fontWeight:700,color:st.color}}>{st.val}</div></Card>
                ))}
              </div>
              {selClient.projects.length>0&&<Card style={{padding:"13px 16px"}}><SLabel>Project History</SLabel><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{selClient.projects.map(p=><span key={p} style={{padding:"4px 12px",background:"rgba(139,92,246,.1)",border:"1px solid rgba(139,92,246,.2)",borderRadius:20,fontSize:12,color:"#c4b5fd"}}>{p}</span>)}</div></Card>}
              {selClient.notes&&<Card style={{padding:"13px 16px"}}><SLabel>Notes</SLabel><p style={{margin:0,fontSize:13,color:"#d4d4d8",lineHeight:1.6}}>{selClient.notes}</p></Card>}
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><SLabel>Quotes</SLabel><Btn style={{fontSize:12,padding:"4px 12px"}} onClick={()=>openNewQuote(selClient.id)}>+ New Quote</Btn></div>
                <Card>
                  {clientQuotes(selClient.id).length===0?<div style={{padding:"24px",textAlign:"center",color:"#52525b",fontSize:13}}>No quotes yet.</div>
                  :clientQuotes(selClient.id).map((q,i,arr)=>(
                    <div key={q.id} onClick={()=>{setSQ(q);setPage("quotes")}} {...rh} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<arr.length-1?"1px solid #27272a":"none",cursor:"pointer"}}>
                      <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{q.title}</div><div style={{fontSize:11,color:"#71717a",marginTop:2}}>{fmtD(q.createdAt)} · {q.lines.length} items</div></div>
                      <QBadge status={q.status}/><div style={{fontSize:14,fontWeight:700}}>{fmt(qGross(q))}</div><span style={{color:"#3f3f46"}}>›</span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {/* ── CLIENT FORM ── */}
          {page==="clients" && subView && (
            <div style={{maxWidth:460,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setSV(null)} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",fontSize:18}}>←</button><h1 style={{fontSize:20,fontWeight:700,margin:0}}>{subView==="new"?"New Client":"Edit Client"}</h1></div>
              <Card style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
                {[{label:"Name *",f:"name",ph:"e.g. João Silva"},{label:"Email",f:"contact",ph:"email@example.com"},{label:"Phone",f:"phone",ph:"+351 912..."}].map(({label,f,ph})=>(
                  <Field key={f} label={label}><TInput value={cf[f]||""} onChange={e=>setCF(c=>({...c,[f]:e.target.value}))} placeholder={ph}/></Field>
                ))}
                <Field label="Notes"><textarea value={cf.notes||""} onChange={e=>setCF(c=>({...c,notes:e.target.value}))} rows={3} placeholder="Preferences, payment terms..." style={{padding:"8px 12px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",resize:"none",width:"100%",boxSizing:"border-box"}}/></Field>
              </Card>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setSV(null)}>Cancel</Btn><Btn onClick={saveClient} disabled={!cf.name?.trim()}>{subView==="new"?"Save Client":"Save Changes"}</Btn></div>
            </div>
          )}

          {/* ── QUOTES LIST ── */}
          {page==="quotes" && !selQuote && !subView && (
            <div style={{maxWidth:700,display:"flex",flexDirection:"column",gap:14}}>
              <h1 style={{fontSize:22,fontWeight:700,margin:0}}>Quotes</h1>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["",...QUOTE_STATUSES].map(st=>(
                  <button key={st} onClick={()=>setQSF(st)} style={{padding:"5px 13px",borderRadius:20,border:`1px solid ${qSF===st?"#7c3aed":"#3f3f46"}`,background:qSF===st?"rgba(124,58,237,.2)":"transparent",color:qSF===st?"#c4b5fd":"#71717a",cursor:"pointer",fontSize:12,fontWeight:qSF===st?600:400}}>
                    {st||"All"}{st&&<span style={{opacity:.6}}> ({quotes.filter(q=>q.status===st).length})</span>}
                  </button>
                ))}
              </div>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#71717a"}}>⌕</span>
                <input value={qSearch} onChange={e=>setQSearch(e.target.value)} placeholder="Search by title or client..." style={{width:"100%",paddingLeft:28,paddingRight:10,paddingTop:8,paddingBottom:8,background:"#18181b",border:"1px solid #27272a",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <Card>
                {filtQuotes.length===0?<div style={{padding:"40px",textAlign:"center",color:"#52525b"}}>No quotes found.</div>
                :filtQuotes.map((q,i,arr)=>{ const c=getClient(q.clientId); const margin=qMargin(q); return (
                  <div key={q.id} onClick={()=>setSQ(q)} {...rh} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<arr.length-1?"1px solid #27272a":"none",cursor:"pointer"}}>
                    <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.title}</div><div style={{fontSize:12,color:"#71717a",marginTop:2}}>{c?.name||"Unknown"} · {fmtD(q.createdAt)} · {q.lines.length} items</div></div>
                    <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:700}}>{fmt(qGross(q))}</div><div style={{fontSize:11,marginTop:2,color:margin>=30?"#34d399":margin>=10?"#fbbf24":"#f87171"}}>{margin.toFixed(0)}% margin</div></div>
                    <QBadge status={q.status}/><span style={{color:"#3f3f46"}}>›</span>
                  </div>
                )})}
              </Card>
            </div>
          )}

          {/* ── QUOTE DETAIL ── */}
          {page==="quotes" && selQuote && !subView && (
            <QuoteDetail q={selQuote} getClient={getClient} advanceQ={advanceQ} onBack={()=>setSQ(null)} onDelete={()=>deleteQuote(selQuote.id)}/>
          )}

          {/* ── QUOTE FORM ── */}
          {page==="quotes" && subView && (
            <div style={{maxWidth:660,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>setSV(null)} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",fontSize:18}}>←</button><h1 style={{fontSize:20,fontWeight:700,margin:0}}>New Quote</h1></div>
              <Card style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
                <Field label="Client *"><TSelect value={qf.clientId} onChange={e=>setQF(q=>({...q,clientId:e.target.value}))}><option value="">Select client...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</TSelect></Field>
                <Field label="Quote Title *"><TInput value={qf.title} onChange={e=>setQF(q=>({...q,title:e.target.value}))} placeholder="e.g. Space Marines Strike Force"/></Field>
                <Field label="Notes"><textarea value={qf.notes} onChange={e=>setQF(q=>({...q,notes:e.target.value}))} rows={2} placeholder="Quality level, deadline..." style={{padding:"8px 12px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",resize:"none",width:"100%",boxSizing:"border-box"}}/></Field>
              </Card>
              <Card style={{overflow:"hidden"}}>
                <div style={{padding:"10px 16px",borderBottom:"1px solid #27272a",display:"flex",alignItems:"center",justifyContent:"space-between"}}><SLabel>Line Items</SLabel><Btn style={{fontSize:12,padding:"4px 12px"}} onClick={()=>setAL(true)}>+ Add Figure</Btn></div>
                {qf.lines.length===0&&!addingLine&&<div style={{padding:"28px",textAlign:"center",color:"#52525b",fontSize:13}}>Click <strong style={{color:"#a78bfa"}}>+ Add Figure</strong> to start.</div>}
                {qf.lines.length>0&&(
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",minWidth:440}}>
                      <thead><tr style={{borderBottom:"1px solid #27272a"}}>{["Figure","Qty","Unit Cost","PVP","Subtotal","Profit",""].map(h=><th key={h} style={{padding:"8px 10px",textAlign:h==="Figure"?"left":"right",fontSize:10,color:"#71717a",fontWeight:500}}>{h}</th>)}</tr></thead>
                      <tbody>
                        {qf.lines.map((l,i)=>(
                          <tr key={l.id} style={{borderBottom:i<qf.lines.length-1?"1px solid #27272a":"none"}}>
                            <td style={{padding:"9px 10px",fontSize:13,fontWeight:500}}>{l.name}</td>
                            <td style={{padding:"9px 10px",textAlign:"right",color:"#a1a1aa",fontSize:13}}>{l.qty}</td>
                            <td style={{padding:"9px 10px",textAlign:"right",color:"#f87171",fontSize:13}}>{fmt(l.unitCost)}</td>
                            <td style={{padding:"9px 10px",textAlign:"right",color:"#a1a1aa",fontSize:13}}>{fmt(l.pvp)}</td>
                            <td style={{padding:"9px 10px",textAlign:"right",fontWeight:600,fontSize:13}}>{fmt(lineGross(l))}</td>
                            <td style={{padding:"9px 10px",textAlign:"right",fontWeight:600,fontSize:13,color:lineProfit(l)>=0?"#34d399":"#f87171"}}>{fmt(lineProfit(l))}</td>
                            <td style={{padding:"9px 10px",textAlign:"right"}}><button onClick={()=>setQF(q=>({...q,lines:q.lines.filter(x=>x.id!==l.id)}))} style={{background:"none",border:"none",color:"#52525b",cursor:"pointer",fontSize:14}}>✕</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {addingLine&&(
                  <div style={{padding:"14px 16px",borderTop:qf.lines.length>0?"1px solid #27272a":"none",background:"rgba(139,92,246,.04)"}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#a78bfa",marginBottom:10}}>New Line</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <Field label="Pick from miniatures catalog (optional)">
                        <TSelect value="" onChange={e=>{ const m=minis.find(x=>x.id===e.target.value); if(m)setNL(l=>({...l,name:m.name})) }}>
                          <option value="">— or type a name below —</option>
                          {minis.map(m=><option key={m.id} value={m.id}>{m.name} ({getArmy(m.armyId)?.name||""})</option>)}
                        </TSelect>
                      </Field>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 60px 100px 100px",gap:8}}>
                        <Field label="Figure name *"><TInput value={nl.name} onChange={e=>setNL(l=>({...l,name:e.target.value}))} placeholder="e.g. Intercessor"/></Field>
                        <Field label="Qty"><TInput type="number" value={nl.qty} onChange={e=>setNL(l=>({...l,qty:e.target.value}))}/></Field>
                        <Field label="Unit Cost (€)"><TInput type="number" value={nl.unitCost} onChange={e=>setNL(l=>({...l,unitCost:e.target.value}))}/></Field>
                        <Field label="PVP / unit (€)"><TInput type="number" value={nl.pvp} onChange={e=>setNL(l=>({...l,pvp:e.target.value}))}/></Field>
                      </div>
                      {nl.name&&<div style={{padding:"8px 12px",background:"rgba(0,0,0,.3)",borderRadius:8,fontSize:12,display:"flex",gap:20}}><span style={{color:"#71717a"}}>Subtotal: <strong style={{color:"#f4f4f5"}}>{fmt((parseFloat(nl.qty)||0)*(parseFloat(nl.pvp)||0))}</strong></span><span style={{color:"#71717a"}}>Profit: <strong style={{color:(parseFloat(nl.pvp)||0)>=(parseFloat(nl.unitCost)||0)?"#34d399":"#f87171"}}>{fmt(((parseFloat(nl.pvp)||0)-(parseFloat(nl.unitCost)||0))*(parseFloat(nl.qty)||0))}</strong></span></div>}
                      <div style={{display:"flex",gap:8}}><Btn onClick={addLine} disabled={!nl.name.trim()}>Add Line</Btn><Btn v="ghost" onClick={()=>{setAL(false);setNL({name:"",qty:1,unitCost:0,pvp:0})}}>Cancel</Btn></div>
                    </div>
                  </div>
                )}
                {qf.lines.length>0&&<div style={{padding:"12px 16px",borderTop:"1px solid #27272a",display:"flex",justifyContent:"flex-end",gap:28}}><div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#71717a",marginBottom:2}}>Total PVP</div><div style={{fontSize:20,fontWeight:700,color:"#a78bfa"}}>{fmt(qf.lines.reduce((a,l)=>a+lineGross(l),0))}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#71717a",marginBottom:2}}>Gross Profit</div><div style={{fontSize:20,fontWeight:700,color:"#34d399"}}>{fmt(qf.lines.reduce((a,l)=>a+lineProfit(l),0))}</div></div></div>}
              </Card>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setSV(null)}>Cancel</Btn><Btn onClick={saveQuote} disabled={!qf.clientId||!qf.title.trim()}>Save Quote</Btn></div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {page==="settings" && (
            <div style={{maxWidth:680,display:"flex",flexDirection:"column",gap:0}}>
              <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 16px"}}>Settings</h1>
              <div style={{display:"flex",gap:0,borderBottom:"1px solid #27272a",marginBottom:20}}>
                {STABS.map(t=><button key={t.id} onClick={()=>setStab(t.id)} style={{padding:"8px 18px",background:"none",border:"none",borderBottom:stab===t.id?"2px solid #a78bfa":"2px solid transparent",color:stab===t.id?"#a78bfa":"#71717a",cursor:"pointer",fontSize:13,fontWeight:stab===t.id?600:400,marginBottom:-1}}>{t.label}</button>)}
              </div>

              {stab==="paints" && (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Card style={{padding:14}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#71717a",marginBottom:10}}>Add Personal Paint</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                      {[{f:"brand",ph:"Brand *"},{f:"code",ph:"Code *"},{f:"name",ph:"Name *"}].map(({f,ph})=>(
                        <input key={f} value={newPaint[f]} onChange={e=>setNewPaint(p=>({...p,[f]:e.target.value}))} placeholder={ph} style={{padding:"7px 10px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",gridColumn:f==="name"?"span 2":""}}/>
                      ))}
                      <select value={newPaint.type} onChange={e=>setNewPaint(p=>({...p,type:e.target.value}))} style={{padding:"7px 10px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#d4d4d8",fontSize:13,outline:"none"}}><option value="">Type (optional)</option>{PAINT_TYPES.map(t=><option key={t}>{t}</option>)}</select>
                    </div>
                    <Btn onClick={()=>{ if(!newPaint.brand||!newPaint.code||!newPaint.name)return; setPaints(ps=>[...ps,{...newPaint,id:uid(),global:false}]); setNewPaint({brand:"",code:"",name:"",type:""}) }} style={{fontSize:12}}>Save Paint</Btn>
                  </Card>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{position:"relative",flex:1}}><span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#71717a",fontSize:13}}>⌕</span><input value={pSearch} onChange={e=>setPSearch(e.target.value)} placeholder="Search paints..." style={{width:"100%",paddingLeft:27,paddingRight:10,paddingTop:7,paddingBottom:7,background:"#18181b",border:"1px solid #27272a",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none",boxSizing:"border-box"}}/></div>
                    {["all","global","personal"].map(sc=><button key={sc} onClick={()=>setPScope(sc)} style={{padding:"6px 12px",background:pScope===sc?"#7c3aed":"#18181b",border:`1px solid ${pScope===sc?"#7c3aed":"#27272a"}`,borderRadius:8,color:pScope===sc?"#fff":"#a1a1aa",cursor:"pointer",fontSize:12,textTransform:"capitalize"}}>{sc}</button>)}
                  </div>
                  <Card style={{overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr style={{borderBottom:"1px solid #27272a"}}>{["Brand","Code","Name","Type",""].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11,color:"#71717a",fontWeight:500}}>{h}</th>)}</tr></thead>
                      <tbody>
                        {filtPaints.map(p=>(
                          <tr key={p.id} style={{borderBottom:"1px solid #27272a"}}>
                            <td style={{padding:"9px 12px",fontSize:13,color:"#d4d4d8"}}><span style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:10,color:p.global?"#52525b":"#a78bfa"}}>{p.global?"🌐":"👤"}</span>{p.brand}</span></td>
                            <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:11,color:"#71717a"}}>{p.code}</td>
                            <td style={{padding:"9px 12px",fontSize:13}}>{p.name}</td>
                            <td style={{padding:"9px 12px"}}>{p.type&&<span style={{padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:600,background:TYPE_STYLE[p.type]?.bg,color:TYPE_STYLE[p.type]?.fg}}>{p.type}</span>}</td>
                            <td style={{padding:"9px 12px"}}>{!p.global&&<button onClick={()=>setPaints(ps=>ps.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",color:"#52525b",cursor:"pointer",fontSize:13}}>🗑</button>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>
              )}

              {stab==="categories" && (
                <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:420}}>
                  <div style={{display:"flex",gap:8}}>
                    <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newCat.trim()){setCats(cs=>[...cs,{id:uid(),name:newCat.trim()}]);setNewCat("")}}} placeholder="New category name..." style={{flex:1,padding:"8px 12px",background:"#18181b",border:"1px solid #27272a",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none"}}/>
                    <Btn onClick={()=>{if(newCat.trim()){setCats(cs=>[...cs,{id:uid(),name:newCat.trim()}]);setNewCat("")}}}>+ Add</Btn>
                  </div>
                  <Card>
                    {cats.map((c,i)=>(
                      <div key={c.id} style={{display:"flex",alignItems:"center",padding:"11px 14px",borderBottom:i<cats.length-1?"1px solid #27272a":"none",gap:8}}>
                        {eCat===c.id
                          ? <><input defaultValue={c.name} id={`cat-${c.id}`} style={{flex:1,padding:"5px 10px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:6,color:"#f4f4f5",fontSize:13,outline:"none"}}/><button onClick={()=>{const v=document.getElementById(`cat-${c.id}`).value.trim();if(v)setCats(cs=>cs.map(x=>x.id===c.id?{...x,name:v}:x));setECat(null)}} style={{background:"#166534",border:"none",color:"#4ade80",borderRadius:6,cursor:"pointer",padding:"4px 8px",fontSize:13}}>✓</button><button onClick={()=>setECat(null)} style={{background:"#27272a",border:"none",color:"#a1a1aa",borderRadius:6,cursor:"pointer",padding:"4px 8px",fontSize:13}}>✕</button></>
                          : <><span style={{flex:1,fontSize:13}}>{c.name}</span><button onClick={()=>setECat(c.id)} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",padding:"3px 6px",fontSize:13}}>✎</button><button onClick={()=>setCats(cs=>cs.filter(x=>x.id!==c.id))} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",padding:"3px 6px",fontSize:13}}>🗑</button></>
                        }
                      </div>
                    ))}
                  </Card>
                </div>
              )}

              {stab==="armies" && (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <Card style={{padding:14}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#71717a",marginBottom:10}}>Add Custom Army</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      <input value={newArmy.name} onChange={e=>setNewArmy(a=>({...a,name:e.target.value}))} placeholder="Army name *" style={{flex:1,minWidth:120,padding:"7px 10px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none"}}/>
                      <input value={newArmy.system} onChange={e=>setNewArmy(a=>({...a,system:e.target.value}))} placeholder="System (optional)" style={{flex:1,minWidth:120,padding:"7px 10px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:13,outline:"none"}}/>
                      <Btn onClick={()=>{if(!newArmy.name.trim())return;setArmies(as=>[...as,{id:uid(),name:newArmy.name.trim(),system:newArmy.system.trim(),global:false}]);setNewArmy({name:"",system:""})}}>+ Add</Btn>
                    </div>
                  </Card>
                  {Object.entries(armyGroups).map(([sys,arms])=>(
                    <Card key={sys} style={{overflow:"hidden"}}>
                      <div style={{padding:"8px 14px",background:"rgba(39,39,42,.5)",borderBottom:"1px solid #27272a",fontSize:11,fontWeight:600,color:"#71717a"}}>{sys}</div>
                      {arms.map((a,i)=>(
                        <div key={a.id} style={{display:"flex",alignItems:"center",padding:"10px 14px",borderBottom:i<arms.length-1?"1px solid #27272a":"none",gap:8}}>
                          <span style={{fontSize:11,color:a.global?"#52525b":"#a78bfa"}}>{a.global?"🌐":"👤"}</span>
                          {eArmy===a.id
                            ? <><input defaultValue={a.name} id={`arm-${a.id}`} style={{flex:1,padding:"4px 8px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:6,color:"#f4f4f5",fontSize:13,outline:"none"}}/><button onClick={()=>{const v=document.getElementById(`arm-${a.id}`).value.trim();if(v)setArmies(as=>as.map(x=>x.id===a.id?{...x,name:v}:x));setEArmy(null)}} style={{background:"#166534",border:"none",color:"#4ade80",borderRadius:6,cursor:"pointer",padding:"4px 8px",fontSize:13}}>✓</button><button onClick={()=>setEArmy(null)} style={{background:"#27272a",border:"none",color:"#a1a1aa",borderRadius:6,cursor:"pointer",padding:"4px 8px",fontSize:13}}>✕</button></>
                            : <><span style={{flex:1,fontSize:13}}>{a.name}</span>{!a.global&&<><button onClick={()=>setEArmy(a.id)} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",padding:"3px 6px",fontSize:13}}>✎</button><button onClick={()=>setArmies(as=>as.filter(x=>x.id!==a.id))} style={{background:"none",border:"none",color:"#71717a",cursor:"pointer",padding:"3px 6px",fontSize:13}}>🗑</button></>}</>
                          }
                        </div>
                      ))}
                    </Card>
                  ))}
                </div>
              )}

              {stab==="general" && (
                <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:420}}>
                  <Card style={{padding:16}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Hourly Rate</div>
                    <div style={{fontSize:12,color:"#71717a",marginBottom:12}}>Used to calculate labour value across all miniatures.</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <select value={currency} onChange={e=>setCur(e.target.value)} style={{padding:"8px 10px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#d4d4d8",fontSize:14,outline:"none",width:72}}>{["€","£","$","CHF"].map(c=><option key={c}>{c}</option>)}</select>
                      <input type="number" value={hourlyRate} onChange={e=>setHR(e.target.value)} min="0" step="0.5" style={{flex:1,padding:"8px 12px",background:"#27272a",border:"1px solid #3f3f46",borderRadius:8,color:"#f4f4f5",fontSize:14,outline:"none"}}/>
                      <span style={{fontSize:13,color:"#71717a",whiteSpace:"nowrap"}}>/hour</span>
                    </div>
                    <div style={{marginTop:10,padding:"10px 12px",background:"rgba(139,92,246,.1)",border:"1px solid rgba(139,92,246,.2)",borderRadius:8,fontSize:12,color:"#c4b5fd"}}>
                      💡 {totalHours}h logged → labour worth <strong>{currency}{labourValue.toFixed(2)}</strong>
                    </div>
                  </Card>
                  <Card style={{padding:16}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Currency</div>
                    <div style={{display:"flex",gap:6}}>
                      {["€","£","$","CHF"].map(c=><button key={c} onClick={()=>setCur(c)} style={{padding:"7px 16px",border:`1px solid ${currency===c?"#a78bfa":"#3f3f46"}`,background:currency===c?"rgba(139,92,246,.15)":"#27272a",borderRadius:8,color:currency===c?"#c4b5fd":"#a1a1aa",cursor:"pointer",fontSize:14,fontWeight:currency===c?700:400}}>{c}</button>)}
                    </div>
                  </Card>
                  <Card style={{padding:16}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Account</div>
                    <div style={{fontSize:13,color:"#71717a",marginBottom:10}}>demo@minitrack.app</div>
                    <Btn v="ghost" style={{fontSize:13}}>Change password</Btn>
                  </Card>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
