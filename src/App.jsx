import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, CalendarDays,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Crown, Flame, Gamepad2,
  Globe2, Home, LogOut, Menu, Search, Settings, Shield, ShieldAlert, Swords, Trophy,
  UserRound, Users, X, Zap, Target, BookOpen, Star, Eye, EyeOff, LockKeyhole, Mail
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const heroes = [
  {name:'Granger',role:'Marksman',pick:18.6,win:53.2,ban:8.4,tier:'S',color:'#d94d4d',desc:'Burst damage and strong late-game scaling.'},
  {name:'Hayabusa',role:'Assassin',pick:16.2,win:52.8,ban:21.1,tier:'S',color:'#7157c8',desc:'Excellent side-lane pressure and backline access.'},
  {name:'Tigreal',role:'Tank',pick:14.8,win:51.9,ban:12.3,tier:'A',color:'#5588b7',desc:'Reliable crowd control and teamfight initiation.'},
  {name:'Vexana',role:'Mage',pick:13.9,win:54.1,ban:17.6,tier:'S',color:'#8e67b8',desc:'Strong zoning, wave clear and teamfight control.'},
  {name:'Terizla',role:'Fighter',pick:12.7,win:51.4,ban:6.2,tier:'A',color:'#b36d50',desc:'Durable frontline with powerful area control.'},
  {name:'Angela',role:'Support',pick:11.4,win:52.1,ban:9.8,tier:'A',color:'#d778a4',desc:'Protects carries and turns fights with her ultimate.'},
]
const globalPlayers = [
  ['K I N G','Global','MY','12,842','91.4%'],['RAVENツ','Global','PH','12,610','89.8%'],
  ['NOVA・X','Global','ID','12,405','88.9%'],['S P Y','Global','IN','12,188','87.6%'],
  ['ZENITH','Global','SG','11,940','86.2%']
]
const indiaPlayers = [
  ['S P Y','India','IN','12,188','87.6%'],['DARK々','India','IN','11,940','86.2%'],
  ['A R J U N','India','IN','11,704','85.9%'],['NEXUS','India','IN','11,388','84.7%'],
  ['RUSHツ','India','IN','11,102','83.1%']
]
const trend = [{d:'Mon',v:42},{d:'Tue',v:55},{d:'Wed',v:48},{d:'Thu',v:67},{d:'Fri',v:61},{d:'Sat',v:82},{d:'Sun',v:74}]
const nav = [
  ['Overview',Home],['Hero Meta',Flame],['Leaderboards',Trophy],['Dark System',ShieldAlert],
  ['Playtime',Clock3],['Events',CalendarDays],['Hero Guides',BookOpen]
]

export default function App() {
  const [user,setUser] = useState(null)
  const [authReady,setAuthReady] = useState(false)
  const [page,setPage] = useState('Overview')
  const [authMode,setAuthMode] = useState('login')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [showPass,setShowPass] = useState(false)
  const [authError,setAuthError] = useState('')
  const [authBusy,setAuthBusy] = useState(false)
  const [demo,setDemo] = useState(false)
  const [mobileNav,setMobileNav] = useState(false)
  const [region,setRegion] = useState('India')
  const [role,setRole] = useState('All')
  const [heroSearch,setHeroSearch] = useState('')
  const [playerSearch,setPlayerSearch] = useState('')
  const [toast,setToast] = useState('')

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return }
    supabase.auth.getSession().then(({data}) => { setUser(data.session?.user ?? null); setAuthReady(true) })
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  },[])
  useEffect(() => { if(toast){const t=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(t)} },[toast])

  async function authenticate(e) {
    e.preventDefault(); setAuthError('')
    if (!email.trim() || password.length < 6) { setAuthError('Enter a valid email and a password with at least 6 characters.'); return }
    if (!supabase) { setAuthError('Supabase is not configured yet. Use Demo Access or add your Supabase keys to the Vercel environment variables.'); return }
    setAuthBusy(true)
    const result = authMode === 'login'
      ? await supabase.auth.signInWithPassword({email,password})
      : await supabase.auth.signUp({email,password})
    setAuthBusy(false)
    if(result.error) setAuthError(result.error.message)
    else if(authMode === 'signup' && !result.data.session) setAuthError('Account created. Check your email to confirm, then log in.')
  }
  async function logout() {
    if(supabase && user) await supabase.auth.signOut()
    setUser(null);setDemo(false);setPage('Overview')
  }
  function enterDemo(){setDemo(true);setUser({email:'demo@mlbbnexus.gg'});setAuthError('')}
  function notify(msg){setToast(msg)}
  if(!authReady) return <div className="loading-screen"><div className="brand-mark">N</div><b>LOADING NEXUS</b></div>
  if(!user) return <AuthScreen {...{authMode,setAuthMode,email,setEmail,password,setPassword,showPass,setShowPass,authError,authBusy,authenticate,enterDemo}} />

  const displayName = user.email?.split('@')[0] || 'Player'
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'open':''}`}>
      <div className="brand"><div className="brand-mark">N</div><div><b>MLBB NEXUS</b><small>PLAYER INTELLIGENCE</small></div><button className="mobile-close" onClick={()=>setMobileNav(false)}><X/></button></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{nav.map(([name,Icon])=><button key={name} className={`nav-link ${page===name?'active':''}`} onClick={()=>{setPage(name);setMobileNav(false)}}><Icon size={18}/><span>{name}</span>{name==='Events'&&<i className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><b>Need a hand?</b><p>Explore guides and learn the meta.</p><button onClick={()=>setPage('Hero Guides')}>Explore guides <ArrowRight size={14}/></button></div><div className="user-mini"><div className="avatar">{displayName.slice(0,1).toUpperCase()}</div><div className="user-meta"><b>{displayName}</b><small>{demo?'Demo account':'Signed in'}</small></div><button title="Log out" onClick={logout}><LogOut size={17}/></button></div></div>
    </aside>
    {mobileNav&&<div className="scrim" onClick={()=>setMobileNav(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="hamburger" onClick={()=>setMobileNav(true)}><Menu/></button><div className="crumb">NEXUS <span>/</span> {page.toUpperCase()}</div><div className="top-actions"><div className="live-pill"><i/> SYSTEM ONLINE</div><button className="icon-button" onClick={()=>notify('You are all caught up!')}><Bell size={18}/></button><div className="top-avatar">{displayName.slice(0,1).toUpperCase()}</div></div></header>
      <div className="content">
        {demo&&<div className="demo-notice"><span><Zap size={15}/> DEMO MODE — sample statistics, not official live game data.</span><button onClick={()=>notify('Connect a verified MLBB data provider to replace sample statistics.')}>Data integration <ArrowRight size={13}/></button></div>}
        {page==='Overview'&&<Overview {...{displayName,setPage,notify}}/>}
        {page==='Hero Meta'&&<HeroMeta {...{role,setRole,heroSearch,setHeroSearch}}/>}
        {page==='Leaderboards'&&<Leaderboards {...{region,setRegion,playerSearch,setPlayerSearch}}/>}
        {page==='Dark System'&&<DarkSystem/>}
        {page==='Playtime'&&<Playtime/>}
        {page==='Events'&&<Events/>}
        {page==='Hero Guides'&&<HeroGuides/>}
        <footer className="footer"><span>© 2026 MLBB NEXUS</span><span>UNOFFICIAL FAN PROJECT · NOT AFFILIATED WITH MOONTON</span><span>BUILT FOR THE GRIND <Flame size={13}/></span></footer>
      </div>
    </main>
    {toast&&<div className="toast"><Activity size={16}/>{toast}</div>}
  </div>
}

function AuthScreen(p){
  return <div className="auth-wrap"><div className="auth-left"><div className="auth-brand"><div className="brand-mark">N</div><b>MLBB NEXUS</b></div><div className="auth-hero"><span className="eyebrow"><i/> THE NEXT LEVEL STARTS HERE</span><h1>YOUR GAME.<br/><em>YOUR DATA.</em><br/>YOUR LEGACY.</h1><p>One place for your Mobile Legends journey. Track performance, read the meta and climb smarter.</p><div className="auth-stats"><div><b>05</b><small>CORE MODULES</small></div><div><b>24/7</b><small>PLAYER ACCESS</small></div><div><b>∞</b><small>ROOM TO GROW</small></div></div></div><div className="auth-foot">UNOFFICIAL MOBILE LEGENDS FAN PLATFORM</div><div className="decor-orbit orbit-one"/><div className="decor-orbit orbit-two"/></div>
    <div className="auth-right"><div className="auth-card"><div className="mobile-auth-brand"><div className="brand-mark">N</div><b>MLBB NEXUS</b></div><span className="eyebrow dark">PLAYER PORTAL</span><h2>{p.authMode==='login'?'Welcome back.':'Create your account.'}</h2><p className="muted">{p.authMode==='login'?'Sign in to access your personal MLBB command center.':'Join the community and start tracking your journey.'}</p><div className="auth-tabs"><button className={p.authMode==='login'?'selected':''} onClick={()=>p.setAuthMode('login')}>LOG IN</button><button className={p.authMode==='signup'?'selected':''} onClick={()=>p.setAuthMode('signup')}>CREATE ACCOUNT</button></div><form onSubmit={p.authenticate}><label>Email address</label><div className="field"><Mail size={17}/><input type="email" placeholder="you@example.com" value={p.email} onChange={e=>p.setEmail(e.target.value)} required/></div><label>Password</label><div className="field"><LockKeyhole size={17}/><input type={p.showPass?'text':'password'} placeholder="At least 6 characters" value={p.password} onChange={e=>p.setPassword(e.target.value)} required/><button type="button" onClick={()=>p.setShowPass(!p.showPass)}>{p.showPass?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>{p.authError&&<div className="auth-error">{p.authError}</div>}<button className="primary-btn auth-submit" disabled={p.authBusy}>{p.authBusy?'PLEASE WAIT':p.authMode==='login'?'ENTER NEXUS':'CREATE ACCOUNT'} <ArrowRight size={17}/></button></form><div className="or-line"><span/> OR <span/></div><button className="demo-btn" onClick={p.enterDemo}>Explore demo dashboard <ArrowUpRight size={16}/></button><small className="auth-legal">By continuing, you agree to use this unofficial fan platform responsibly.</small></div><div className="auth-copyright">© 2026 MLBB NEXUS <span>·</span> PRIVACY FIRST</div></div></div>
}

function PageHeading({eyebrow,title,sub,action}){return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{sub}</p></div>{action}</div>}
function StatCard({label,value,change,Icon,accent='red'}){return <div className="stat-card"><div className={`stat-icon ${accent}`}><Icon size={19}/></div><span>{label}</span><b>{value}</b><small className="positive"><ArrowUpRight size={13}/>{change}</small></div>}
function Overview({displayName,setPage,notify}){
  return <><PageHeading eyebrow="YOUR COMMAND CENTER" title={<>PLAY SMARTER, <em>CLIMB HIGHER.</em></>} sub={`Welcome back, ${displayName}. Here's your weekly snapshot.`} action={<button className="outline-btn" onClick={()=>notify('Profile sync is available when a player-data provider is connected.')}><Activity size={16}/> SYNC PLAYER</button>}/>
    <div className="welcome-banner"><div><span className="banner-tag"><Zap size={13}/> WEEKLY INTELLIGENCE</span><h2>MAKE EVERY<br/><em>MATCH COUNT.</em></h2><p>Small improvements stack up. Review your trends, refine your picks and play with a plan.</p><button className="dark-btn" onClick={()=>setPage('Dark System')}>VIEW PERFORMANCE TIPS <ArrowRight size={15}/></button></div><div className="banner-art"><div className="orbit-ring"/><div className="rank-emblem"><Crown size={38}/><b>MYTHIC</b><small>YOUR NEXT GOAL</small></div><div className="floating-chip chip-a">+12.8% WR</div><div className="floating-chip chip-b">META UPDATE</div></div></div>
    <div className="section-row"><div><h3>PLAYER OVERVIEW</h3><p>Illustrative sample profile · Season snapshot</p></div><span className="updated"><i/> SAMPLE DATA</span></div>
    <div className="stats-grid"><StatCard label="WIN RATE" value="58.4%" change="4.2% this week" Icon={Target}/><StatCard label="TOTAL MATCHES" value="1,284" change="18 this week" Icon={Swords} accent="blue"/><StatCard label="MVP RATE" value="22.6%" change="2.1% this week" Icon={Crown} accent="gold"/><StatCard label="PLAY TIME" value="386h" change="6.5h this week" Icon={Clock3} accent="green"/></div>
    <div className="two-col"><div className="panel chart-panel"><div className="panel-head"><div><h3>WEEKLY PERFORMANCE</h3><p>Illustrative activity index</p></div><span className="period-pill">LAST 7 DAYS <ChevronDown size={13}/></span></div><div className="chart-value">74<span> / 100</span><small><ArrowUpRight size={14}/> +8.6%</small></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e83c4b" stopOpacity=".25"/><stop offset="100%" stopColor="#e83c4b" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e9e5dc"/><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#888'}}/><Tooltip/><Area type="monotone" dataKey="v" stroke="#e83c4b" strokeWidth={3} fill="url(#fill)"/></AreaChart></ResponsiveContainer></div></div>
    <div className="panel quick-panel"><div className="panel-head"><div><h3>QUICK ACCESS</h3><p>Your next move starts here</p></div><Zap size={18}/></div>{[['Hero meta','Explore top picks','Hero Meta',Flame],['India leaderboard','See regional ranks','Leaderboards',Trophy],['Playtime planner','Build a healthy routine','Playtime',CalendarDays],['Hero academy','Learn matchups & builds','Hero Guides',BookOpen]].map(([a,b,c,I])=><button className="quick-link" key={a} onClick={()=>setPage(c)}><span className="quick-icon"><I size={17}/></span><span><b>{a}</b><small>{b}</small></span><ArrowRight size={16}/></button>)}</div></div>
    <div className="section-row"><div><h3>IN THE META</h3><p>Example hero metrics for the current demo dataset</p></div><button className="text-btn" onClick={()=>setPage('Hero Meta')}>ALL HEROES <ArrowRight size={14}/></button></div><div className="hero-mini-grid">{heroes.slice(0,3).map((h,i)=><div className="hero-mini" key={h.name}><div className="hero-portrait" style={{background:h.color}}>{h.name.slice(0,1)}</div><div><b>{h.name}</b><small>{h.role} · {h.tier} TIER</small></div><strong>{h.win}%<small>WIN RATE</small></strong></div>)}</div>
  </>
}
function HeroMeta({role,setRole,heroSearch,setHeroSearch}){
  const roles=['All','Tank','Fighter','Assassin','Mage','Marksman','Support']
  const list=heroes.filter(h=>(role==='All'||h.role===role)&&h.name.toLowerCase().includes(heroSearch.toLowerCase()))
  return <><PageHeading eyebrow="PICK YOUR ADVANTAGE" title={<>THE <em>HERO META.</em></>} sub="Explore example pick rates, win rates and ban trends. Use filters to find your next main."/><div className="toolbar"><div className="searchbox"><Search size={17}/><input placeholder="Search a hero..." value={heroSearch} onChange={e=>setHeroSearch(e.target.value)}/></div><div className="filter-pills">{roles.map(r=><button className={role===r?'chosen':''} onClick={()=>setRole(r)} key={r}>{r}</button>)}</div></div><div className="notice"><Activity size={16}/> Metrics below are illustrative demo values, not verified live ranked statistics.</div><div className="hero-grid">{list.map(h=><div className="hero-card" key={h.name}><div className="hero-card-top"><div className="hero-portrait big" style={{background:h.color}}>{h.name.slice(0,1)}</div><span className={`tier tier-${h.tier}`}>{h.tier} TIER</span></div><h3>{h.name}</h3><small>{h.role.toUpperCase()}</small><p>{h.desc}</p><div className="hero-metrics"><div><b>{h.pick}%</b><small>PICK RATE</small></div><div><b>{h.win}%</b><small>WIN RATE</small></div><div><b>{h.ban}%</b><small>BAN RATE</small></div></div><div className="meter"><i style={{width:`${h.win}%`}}/></div></div>)}</div></>
}
function Leaderboards({region,setRegion,playerSearch,setPlayerSearch}){
 const rows=(region==='India'?indiaPlayers:globalPlayers).filter(r=>r[0].toLowerCase().includes(playerSearch.toLowerCase()))
 return <><PageHeading eyebrow="THE CLIMB NEVER STOPS" title={<>WALL OF <em>LEGENDS.</em></>} sub="Explore example player rankings by region. Connect verified player data for real rankings."/><div className="leader-hero"><div><span className="banner-tag"><Trophy size={13}/> SEASON RANKINGS</span><h2>THE BEST<br/><em>RISE ABOVE.</em></h2><p>Consistency creates legends. Track the climb and find your next milestone.</p></div><div className="leader-crown"><Crown size={62}/><b>TOP 100</b><small>RANKING BOARD</small></div></div><div className="toolbar leaderboard-tools"><div className="segmented"><button className={region==='India'?'selected':''} onClick={()=>setRegion('India')}>🇮🇳 INDIA</button><button className={region==='Global'?'selected':''} onClick={()=>setRegion('Global')}><Globe2 size={14}/> GLOBAL</button></div><div className="searchbox"><Search size={16}/><input placeholder="Search player..." value={playerSearch} onChange={e=>setPlayerSearch(e.target.value)}/></div></div><div className="notice"><Activity size={16}/> Demo leaderboard. Names, points and win rates are fictional examples.</div><div className="leader-table"><div className="table-head"><span>RANK / PLAYER</span><span>REGION</span><span>POINTS</span><span>WIN RATE</span></div>{rows.map((r,i)=><div className="leader-row" key={r[0]}><div className="rank-player"><span className={`rank-num rank-${i+1}`}>#{i+1}</span><div className="avatar player-avatar">{r[0].slice(0,1)}</div><b>{r[0]}</b>{i===0&&<Crown size={15} className="gold-text"/>}</div><span className="region-cell">{r[2]} · {r[1]}</span><b>{r[3]}</b><span className="win-cell">{r[4]}</span></div>)}</div></>
}
function DarkSystem(){return <><PageHeading eyebrow="MATCHMAKING INTELLIGENCE" title={<>BREAK THE <em>LOSING LOOP.</em></>} sub="A practical guide to handling frustrating matchmaking and improving your own decision-making."/><div className="dark-warning"><ShieldAlert size={28}/><div><b>FIRST, THE REALITY CHECK</b><p>There is no verified public evidence of a personal “dark system” that deliberately assigns losses. Matchmaking outcomes can feel streaky because of rank, role balance, party composition, performance variance and small sample sizes.</p></div></div><div className="guide-grid">{[['01','Track more than wins','Review at least 20–30 matches. Record role, hero, lane outcome and key mistakes before drawing conclusions.',BarChart3],['02','Protect your best role','Master 2–3 heroes in your main role and keep one reliable backup for draft flexibility.',Shield],['03','Stop the tilt queue','After two frustrating losses, take a break. A reset helps you avoid rushed decisions and poor focus.',Clock3],['04','Play around objectives','Prioritise Turtle, Lord, lane pressure and vision instead of chasing every fight.',Target],['05','Review your deaths','Check whether each death came from overextension, missing map information or a bad teamfight.',Eye],['06','Queue with a plan','Set a match limit and a clear goal such as better rotations or fewer avoidable deaths.',Zap]].map(([n,t,d,I])=><div className="guide-card" key={n}><div className="guide-number">{n}</div><I size={21}/><h3>{t}</h3><p>{d}</p></div>)}</div><div className="panel"><h3>POST-MATCH CHECKLIST</h3><p className="muted">Use this after every ranked game to spot patterns you can actually control.</p><Checklist items={['Did I check the minimap before engaging?','Did I rotate for Turtle and Lord?','Did I build against the enemy composition?','Did I avoid fighting while outnumbered?','Did I protect my team’s main damage dealer?']}/></div></>}
function Checklist({items}){const [checked,setChecked]=useState([]);return <div className="checklist">{items.map((it,i)=><label key={it}><input type="checkbox" checked={checked.includes(i)} onChange={()=>setChecked(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i])}/><span>{it}</span></label>)}<small>{checked.length}/{items.length} REVIEWED</small></div>}
function Playtime(){return <><PageHeading eyebrow="BALANCE YOUR GRIND" title={<>TIME TO <em>LEVEL UP.</em></>} sub="A sample weekly playtime planner to help you build a consistent, healthy routine."/><div className="stats-grid"><StatCard label="THIS WEEK" value="6.5h" change="Sample tracked time" Icon={Clock3}/><StatCard label="DAILY AVERAGE" value="55m" change="Across 7 days" Icon={Activity} accent="blue"/><StatCard label="SESSIONS" value="12" change="Sample sessions" Icon={Gamepad2} accent="gold"/><StatCard label="LONGEST DAY" value="1h 40m" change="Saturday" Icon={Flame} accent="green"/></div><div className="panel"><div className="panel-head"><div><h3>WEEKLY PLAYTIME</h3><p>Illustrative hours by day</p></div><span className="period-pill">THIS WEEK</span></div><div className="play-bars">{[['MON',.7],['TUE',1.0],['WED',.8],['THU',1.1],['FRI',1.2],['SAT',1.7],['SUN',1.4]].map(([d,v])=><div className="bar-day" key={d}><div className="bar-track"><i style={{height:`${v/1.8*100}%`}}/></div><b>{v.toFixed(1)}h</b><small>{d}</small></div>)}</div></div><div className="panel"><h3>WEEKLY ROUTINE TEMPLATE</h3><p className="muted">Suggested schedule — edit the times to fit your day. Keep breaks between sessions.</p><div className="schedule">{[['MON','7:00–8:00 PM','Ranked practice'],['TUE','7:00–8:00 PM','Hero mechanics'],['WED','REST DAY','Review replays'],['THU','7:00–8:00 PM','Ranked practice'],['FRI','7:30–8:30 PM','Squad / classic'],['SAT','Flexible','Events & ranked'],['SUN','Flexible','Weekly review']].map(r=><div className="schedule-row" key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><small>{r[2]}</small></div>)}</div></div></>}
function Events(){return <><PageHeading eyebrow="NEVER MISS A DROP" title={<>EVENT <em>INTEL.</em></>} sub="Event planning cards and reward checklists. Confirm dates in the official in-game event centre."/><div className="notice"><CalendarDays size={16}/> Event dates and rewards are examples only. This page does not fetch the live MLBB event calendar.</div><div className="event-grid">{[['DAILY','Daily activity rewards','Complete daily tasks and claim login rewards before reset.','Claim checklist','#e6b94c'],['WEEKLY','Weekly challenge route','Prioritise limited-time missions and higher-value milestone rewards.','Mission planner','#69a8c9'],['LIMITED','Limited-time event watch','Check official announcements for token exchange deadlines and event rules.','Event tracker','#df6573']].map(([tag,title,desc,cta,color])=><div className="event-card" key={title}><div className="event-art" style={{background:color}}><CalendarDays size={36}/><span>{tag} DROP</span></div><div className="event-copy"><h3>{title}</h3><p>{desc}</p><button className="text-btn" onClick={e=>e.currentTarget.parentElement.querySelector('.event-check').classList.toggle('show')}>{cta} <ArrowRight size={14}/></button><div className="event-check"><Checklist items={['Check the in-game event page','Review mission requirements','Claim rewards before the deadline']}/></div></div></div>)}</div><div className="panel"><h3>EVENT SAFETY</h3><p className="muted">Use official Mobile Legends channels and the in-game event page for confirmed dates, rewards, eligibility and regional availability. Never share your account password or verification codes to claim a reward.</p></div></>}
function HeroGuides(){return <><PageHeading eyebrow="THE NEXUS ACADEMY" title={<>MASTER YOUR <em>MAIN.</em></>} sub="Practical hero notes, role fundamentals and matchup reminders. Builds are starting points, not universal answers."/><div className="guide-grid">{[['MARKSMAN','Granger — Burst & spacing','Keep safe distance, manage skill cooldowns and save your ultimate for clean finishing angles.','Granger'],['ASSASSIN','Hayabusa — Side-lane pressure','Track enemy crowd control, isolate targets and use shadows to plan safe exits.','Hayabusa'],['TANK','Tigreal — Engage timing','Hide your approach, coordinate your ultimate and avoid starting fights without follow-up.','Tigreal'],['MAGE','Vexana — Zone control','Clear waves safely, control choke points and use your summon to pressure objectives.','Vexana'],['FIGHTER','Terizla — Frontline control','Choose fights around your team and use your ultimate to limit enemy movement.','Terizla'],['SUPPORT','Angela — Save your carry','Watch ally health and map position; use your ultimate before a teammate is fully trapped.','Angela']].map(([role,title,desc,name])=><div className="guide-card hero-guide" key={name}><span className="eyebrow">{role}</span><div className="guide-portrait">{name[0]}</div><h3>{title}</h3><p>{desc}</p><div className="guide-tags"><span>POSITIONING</span><span>TEAMPLAY</span></div></div>)}</div><div className="notice"><BookOpen size={16}/> For current item builds, emblems and patch-specific counters, verify against the latest in-game patch and trusted competitive sources.</div></>}
