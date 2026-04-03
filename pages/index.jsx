import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LineChart, Line } from 'recharts';
import Head from 'next/head';

const INITIAL_VENUES = [
  { id:'v01', groupName:'CLAW RESTAURANT L.L.C', venueName:'Claw BBQ', region:'UAE', ltmRevenue:44350000, financial:83, redemption:84, mezza:83, lendingCeiling:4, lendingAmt:1770000, votesReqd:1, pilot:150000, p1:200000, p2:800000, analyst:'Pranit', commercialPOC:'Justin', date:'2026-03-25', location:'Marsa Dubai', analysisSheetUrl:'', strengths:['Strongest overall profile — near-zero debt, lean cost structure, premium spend'], weaknesses:['Single location concentration; minor H2 revenue softening'], groupDecision:'Approved', groupRationale:'Strong Profile' },
  { id:'v02', groupName:'FAB FOOD CO', venueName:'Ellas Eatery', region:'UAE', ltmRevenue:5770000, financial:63, redemption:67, mezza:64, lendingCeiling:2, lendingAmt:115400, votesReqd:2, pilot:40000, p1:150000, p2:600000, analyst:'Pranit', commercialPOC:'Justin', date:'2026-03-25', location:'Palm Jumeirah', analysisSheetUrl:'', strengths:['7.0 years established history; zero debt; good salary/revenue ratio of 28%'], weaknesses:['Trade License EXPIRED 27-Feb-2026 — hard lending hold; rent/revenue at 31.19%; H1/H2 revenue declining -10.2%'], groupDecision:'Approved', groupRationale:'' },
  { id:'v03', groupName:'Gates Hospitality', venueName:'Reform Social Bar', region:'UAE', ltmRevenue:20400000, financial:72, redemption:67, mezza:70, lendingCeiling:3, lendingAmt:612000, votesReqd:2, pilot:100000, p1:500000, p2:1000000, analyst:'Pranit', commercialPOC:'Justin', date:'2026-03-25', location:'The Lakes', analysisSheetUrl:'', strengths:['12.7 years operating history, zero debt, strong card revenue traceability'], weaknesses:['Void order rate at 10.8% exceeds threshold — POS controls require attention'], groupDecision:'Approved', groupRationale:'' },
];

const BANDS = [
  { min:90, max:100, ceiling:5, votes:1, grade:'A+', label:'Auto-Approve', color:'#00ff88' },
  { min:80, max:89.99, ceiling:4, votes:1, grade:'A', label:'Preferred', color:'#00cc66' },
  { min:70, max:79.99, ceiling:3, votes:2, grade:'B+', label:'Standard', color:'#ffaa00' },
  { min:60, max:69.99, ceiling:2, votes:2, grade:'B', label:'Standard', color:'#ff8800' },
  { min:55, max:59.99, ceiling:1, votes:3, grade:'C+', label:'Conditional', color:'#ff6644' },
  { min:0, max:54.99, ceiling:0, votes:0, grade:'D', label:'Decline', color:'#ff3333' },
];

export default function MezzaPlatform() {
  const [venues, setVenues] = useState([]);
  const [decs, setDecs] = useState({});
  const [rats, setRats] = useState({});
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [isLoaded, setIsLoaded] = useState(false);

  const empty = {
    groupName: '', venueName: '', region: 'UAE', ltmRevenue: 0,
    financial: 0, redemption: 0, mezza: null, lendingCeiling: 0,
    lendingAmt: 0, votesReqd: 0, pilot: 0, p1: 0, p2: 0,
    analyst: 'Pranit', commercialPOC: '', date: new Date().toISOString().split('T')[0],
    location: '', analysisSheetUrl: '', strengths: [''], weaknesses: [''],
    groupDecision: 'Pending', groupRationale: ''
  };

  const [form, setForm] = useState(empty);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mezzaData');
      if (saved) {
        try {
          const { venues: v, decs: d, rats: r } = JSON.parse(saved);
          setVenues(v && v.length > 0 ? v : INITIAL_VENUES);
          setDecs(d || {});
          setRats(r || {});
        } catch (e) {
          console.error('Failed to load saved data:', e);
          setVenues(INITIAL_VENUES);
        }
      } else {
        setVenues(INITIAL_VENUES);
      }
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('mezzaData', JSON.stringify({ venues, decs, rats }));
    }
  }, [venues, decs, rats, isLoaded]);

  const getBand = (mezza) => {
    if (mezza === null || mezza === undefined || isNaN(mezza)) return BANDS[5]; // Default to Decline
    const m = +mezza;
    return BANDS.find(b => m >= b.min && m <= b.max) || BANDS[5];
  };

  const save = () => {
    if (!form.groupName?.trim() || !form.venueName?.trim()) {
      alert('Group Name and Venue Name are required');
      return;
    }
    const m = form.mezza !== null && form.mezza !== '' ? +form.mezza : Math.round(form.financial * 0.7 + form.redemption * 0.3);
    const e = {
      ...form,
      mezza: m,
      id: editId || `v${Date.now()}`,
      strengths: (form.strengths || []).filter(s => s?.trim()),
      weaknesses: (form.weaknesses || []).filter(w => w?.trim()),
    };
    const u = editId ? venues.map(v => v.id === editId ? e : v) : [...venues, e];
    setVenues(u);
    setForm(empty);
    setEditId(null);
    setShowForm(false);
  };

  const del = (id) => {
    if (confirm('Delete this venue?')) {
      setVenues(venues.filter(v => v.id !== id));
    }
  };

  const edit = (v) => {
    setForm({
      ...v,
      strengths: v.strengths?.length ? v.strengths : [''],
      weaknesses: v.weaknesses?.length ? v.weaknesses : ['']
    });
    setEditId(v.id);
    setShowForm(true);
    setActiveTab('portfolio');
  };

  const exportJSON = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ venues, decs, rats }, null, 2)], { type: 'application/json' }));
    a.download = `mezza-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const exportCSV = () => {
    const h = ['Group', 'Venue', 'Region', 'Financial', 'Redemption', 'Mezza', 'Grade', 'LTM Revenue (AED)', 'Lending Ceiling', 'Lending Amount (AED)', 'Analyst', 'Date', 'Decision'];
    const rows = venues.map(v => {
      const band = getBand(v.mezza);
      return [v.groupName, v.venueName, v.region, v.financial, v.redemption, v.mezza, band.grade, v.ltmRevenue, v.lendingCeiling, v.lendingAmt, v.analyst, v.date, v.groupDecision];
    });
    const csv = [h, ...rows].map(r => r.map(c => `"${String(c || '')}"`.trim()).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `mezza-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const importJSON = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target?.result || '');
        if (d.venues && Array.isArray(d.venues)) {
          setVenues(d.venues);
          setDecs(d.decs || {});
          setRats(d.rats || {});
          alert('✅ Data imported successfully!');
        } else {
          alert('❌ Invalid JSON format');
        }
      } catch (err) {
        alert('❌ Failed to parse JSON');
      }
    };
    r.readAsText(f);
  };

  // Computed metrics
  const filtered = region === 'ALL' ? venues : venues.filter(v => v.region === region);
  const searched = filtered.filter(v => {
    const t = search.toLowerCase();
    return !t || v.groupName.toLowerCase().includes(t) || v.venueName.toLowerCase().includes(t) || v.location.toLowerCase().includes(t);
  });

  const groups = {};
  searched.forEach(v => {
    if (!groups[v.groupName]) groups[v.groupName] = [];
    groups[v.groupName].push(v);
  });

  const totalRev = filtered.reduce((s, v) => s + (v.ltmRevenue || 0), 0);
  const totalLend = filtered.reduce((s, v) => s + (v.lendingAmt || 0), 0);
  const numGroups = new Set(filtered.map(v => v.groupName)).size;
  const numApproved = filtered.filter(v => v.groupDecision === 'Approved').length;
  const wtdMezza = totalRev > 0 ? filtered.reduce((s, v) => s + (v.mezza || 0) * (v.ltmRevenue || 0), 0) / totalRev : 0;

  // Grade distribution
  const gradeDistribution = {};
  filtered.forEach(v => {
    const g = getBand(v.mezza).grade;
    gradeDistribution[g] = (gradeDistribution[g] || 0) + 1;
  });
  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({ grade, count }));

  // Regional breakdown
  const regionalBreakdown = {};
  filtered.forEach(v => {
    if (!regionalBreakdown[v.region]) regionalBreakdown[v.region] = { region: v.region, venues: 0, revenue: 0, lending: 0 };
    regionalBreakdown[v.region].venues += 1;
    regionalBreakdown[v.region].revenue += v.ltmRevenue || 0;
    regionalBreakdown[v.region].lending += v.lendingAmt || 0;
  });
  const regionalData = Object.values(regionalBreakdown);

  // Styles
  const C = { background: '#161616', border: '1px solid rgba(255,255,255,.09)', borderRadius: 14, padding: '22px 26px' };
  const CL = { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.4, color: '#888078', marginBottom: 8 };
  const I = { width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,.12)', background: '#1e1e1e', color: '#f2ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const BtnGreen = { background: '#00c86e', color: '#000', border: 'none', padding: '10px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 };
  const BtnGray = { background: '#2a2a2a', color: '#f2ede8', border: '1px solid rgba(255,255,255,.09)', padding: '10px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 };

  if (!isLoaded) return <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0a0a0a', color: '#f2ede8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <>
      <Head>
        <title>Mezza | Credit Intelligence Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Credit intelligence platform for F&B business underwriting" />
        <meta name="theme-color" content="#161616" />
      </Head>

      <div style={{ fontFamily: 'system-ui,sans-serif', background: '#0a0a0a', minHeight: '100vh', color: '#f2ede8' }}>
        {/* Header */}
        <div style={{ background: '#161616', borderBottom: '1px solid rgba(255,255,255,.09)', padding: '24px 0', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h1 style={{ color: '#f2ede8', fontSize: 28, margin: 0, fontWeight: 700, letterSpacing: -0.5 }}>MEZZA</h1>
                <p style={{ color: '#888078', fontSize: 11, margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: 1 }}>Credit Intelligence Platform</p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowForm(true)} style={{ ...BtnGreen }}>+ Add Venue</button>
                <button onClick={exportJSON} style={{ ...BtnGray }}>Export JSON</button>
                <button onClick={exportCSV} style={{ ...BtnGray }}>Export CSV</button>
                <label style={{ ...BtnGray, margin: 0, cursor: 'pointer' }}>
                  Import JSON
                  <input type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2 }}>
              {[
                { id: 'portfolio', label: 'Portfolio' },
                { id: 'analytics', label: 'Analytics' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? '#2a2a2a' : 'transparent',
                    color: activeTab === tab.id ? '#f2ede8' : '#888078',
                    border: activeTab === tab.id ? '1px solid rgba(255,255,255,.09)' : 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #00c86e' : '2px solid transparent',
                    padding: '10px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    borderRadius: '6px 6px 0 0',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
          {activeTab === 'portfolio' ? (
            <>
              {/* Toolbar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 12, marginBottom: 24 }}>
                <input
                  type="text"
                  placeholder="🔍 Search by group, venue, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={I}
                />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={I}
                >
                  <option value="ALL">All Regions</option>
                  <option value="UAE">UAE</option>
                  <option value="Miami">Miami/USA</option>
                </select>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
                <div style={C}>
                  <div style={CL}>Total Venues</div>
                  <div style={{ fontSize: 32, color: '#00c86e', fontWeight: 700 }}>{venues.length}</div>
                  <div style={{ fontSize: 11, color: '#888078', marginTop: 8 }}>{numApproved} approved</div>
                </div>
                <div style={C}>
                  <div style={CL}>Groups</div>
                  <div style={{ fontSize: 32, color: '#ffaa00', fontWeight: 700 }}>{numGroups}</div>
                  <div style={{ fontSize: 11, color: '#888078', marginTop: 8 }}>In portfolio</div>
                </div>
                <div style={C}>
                  <div style={CL}>Total Revenue</div>
                  <div style={{ fontSize: 32, color: '#00a8ff', fontWeight: 700 }}>AED {(totalRev / 1000000).toFixed(1)}M</div>
                  <div style={{ fontSize: 11, color: '#888078', marginTop: 8 }}>LTM aggregate</div>
                </div>
                <div style={C}>
                  <div style={CL}>Weighted Score</div>
                  <div style={{ fontSize: 32, color: getBand(wtdMezza).color, fontWeight: 700 }}>{wtdMezza.toFixed(1)}</div>
                  <div style={{ fontSize: 11, color: '#888078', marginTop: 8 }}>{getBand(wtdMezza).grade}</div>
                </div>
              </div>

              {/* Venue Groups */}
              {Object.keys(groups).length > 0 ? (
                Object.keys(groups)
                  .sort()
                  .map(groupName => (
                    <div key={groupName} style={{ ...C, marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f2ede8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {groupName} ({groups[groupName].length})
                      </div>
                      <div style={{ display: 'grid', gap: 12 }}>
                        {groups[groupName]
                          .sort((a, b) => (b.mezza || 0) - (a.mezza || 0))
                          .map(v => {
                            const band = getBand(v.mezza);
                            return (
                              <div key={v.id} style={{ background: '#1e1e1e', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,.09)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ color: '#f2ede8', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{v.venueName}</div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, fontSize: 11, color: '#888078' }}>
                                    <div>📍 {v.location || 'N/A'}</div>
                                    <div>💰 AED {(v.ltmRevenue / 1000000).toFixed(1)}M LTM</div>
                                    <div>📊 F:{v.financial} | R:{v.redemption} | M:{v.mezza}</div>
                                    <div>👤 {v.analyst} | {v.commercialPOC}</div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                  <div style={{ background: band.color, color: '#000', padding: '8px 16px', borderRadius: 6, fontWeight: 700, fontSize: 12, textAlign: 'center', minWidth: 60 }}>
                                    {band.grade}
                                  </div>
                                  <div style={{ fontSize: 10, color: '#888078', textAlign: 'center', textTransform: 'uppercase', fontWeight: 700 }}>{band.label}</div>
                                  <div style={{ background: v.groupDecision === 'Approved' ? 'rgba(0,200,110,.1)' : v.groupDecision === 'Rejected' ? 'rgba(255,51,51,.1)' : 'rgba(255,170,0,.1)', color: v.groupDecision === 'Approved' ? '#00c86e' : v.groupDecision === 'Rejected' ? '#ff3333' : '#ffaa00', padding: '4px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
                                    {v.groupDecision}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <button onClick={() => edit(v)} style={{ background: '#1a4d2e', color: '#00c86e', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✏️ Edit</button>
                                  <button onClick={() => del(v.id)} style={{ background: '#4d1a1a', color: '#ff6644', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>🗑️ Delete</button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))
              ) : (
                <div style={{ ...C, textAlign: 'center', color: '#888078' }}>
                  <p>No venues found. <button onClick={() => setShowForm(true)} style={{ background: 'none', border: 'none', color: '#00c86e', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>Add one now →</button></p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Analytics Tab */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                {gradeData.length > 0 && (
                  <div style={C}>
                    <div style={{ ...CL, marginBottom: 16 }}>Grade Distribution</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={gradeData} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={100} label>
                          {gradeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBand(95).color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {regionalData.length > 0 && (
                  <div style={C}>
                    <div style={{ ...CL, marginBottom: 16 }}>By Region</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={regionalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.09)" />
                        <XAxis dataKey="region" stroke="#888078" />
                        <YAxis stroke="#888078" />
                        <Tooltip />
                        <Bar dataKey="venues" fill="#00c86e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div style={{ ...C, marginTop: 24 }}>
                <div style={CL}>Regional Summary</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,.09)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#888078', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Region</th>
                      <th style={{ textAlign: 'right', padding: '8px', color: '#888078', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Venues</th>
                      <th style={{ textAlign: 'right', padding: '8px', color: '#888078', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Revenue</th>
                      <th style={{ textAlign: 'right', padding: '8px', color: '#888078', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Lending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map(row => (
                      <tr key={row.region} style={{ borderBottom: '1px solid rgba(255,255,255,.09)' }}>
                        <td style={{ padding: '8px', color: '#f2ede8' }}>{row.region}</td>
                        <td style={{ textAlign: 'right', padding: '8px', color: '#f2ede8' }}>{row.venues}</td>
                        <td style={{ textAlign: 'right', padding: '8px', color: '#00c86e' }}>AED {(row.revenue / 1000000).toFixed(1)}M</td>
                        <td style={{ textAlign: 'right', padding: '8px', color: '#ffaa00' }}>AED {(row.lending / 1000).toFixed(0)}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
            <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,.09)', borderRadius: 14, padding: 26, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: '#f2ede8', margin: 0, fontSize: 18, fontWeight: 700 }}>{editId ? 'Edit Venue' : 'Add Venue'}</h2>
                <button onClick={() => { setShowForm(false); setEditId(null); setForm(empty); }} style={{ background: 'none', border: 'none', color: '#888078', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={CL}>Group Name *</label>
                  <input type="text" value={form.groupName} onChange={(e) => setForm({ ...form, groupName: e.target.value })} style={I} />
                </div>
                <div>
                  <label style={CL}>Venue Name *</label>
                  <input type="text" value={form.venueName} onChange={(e) => setForm({ ...form, venueName: e.target.value })} style={I} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={CL}>Region</label>
                    <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} style={I}>
                      <option value="UAE">UAE</option>
                      <option value="Miami">Miami/USA</option>
                    </select>
                  </div>
                  <div>
                    <label style={CL}>Location</label>
                    <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={I} />
                  </div>
                </div>
                <div>
                  <label style={CL}>LTM Revenue (AED)</label>
                  <input type="number" value={form.ltmRevenue} onChange={(e) => setForm({ ...form, ltmRevenue: +e.target.value })} style={I} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={CL}>Financial Score</label>
                    <input type="number" min="0" max="100" value={form.financial} onChange={(e) => setForm({ ...form, financial: +e.target.value })} style={I} />
                  </div>
                  <div>
                    <label style={CL}>Redemption Score</label>
                    <input type="number" min="0" max="100" value={form.redemption} onChange={(e) => setForm({ ...form, redemption: +e.target.value })} style={I} />
                  </div>
                  <div>
                    <label style={CL}>Mezza Score (auto)</label>
                    <input type="number" min="0" max="100" value={form.mezza || Math.round(form.financial * 0.7 + form.redemption * 0.3)} onChange={(e) => setForm({ ...form, mezza: e.target.value ? +e.target.value : null })} style={I} placeholder="Auto-computed" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={CL}>Analyst</label>
                    <input type="text" value={form.analyst} onChange={(e) => setForm({ ...form, analyst: e.target.value })} style={I} />
                  </div>
                  <div>
                    <label style={CL}>Commercial POC</label>
                    <input type="text" value={form.commercialPOC} onChange={(e) => setForm({ ...form, commercialPOC: e.target.value })} style={I} />
                  </div>
                </div>
                <div>
                  <label style={CL}>Decision</label>
                  <select value={form.groupDecision} onChange={(e) => setForm({ ...form, groupDecision: e.target.value })} style={I}>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label style={CL}>Strengths</label>
                  {(form.strengths || []).map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        value={s}
                        onChange={(e) => {
                          const updated = [...form.strengths];
                          updated[i] = e.target.value;
                          setForm({ ...form, strengths: updated });
                        }}
                        style={I}
                      />
                      <button onClick={() => setForm({ ...form, strengths: form.strengths.filter((_, idx) => idx !== i) })} style={{ background: '#4d1a1a', color: '#ff6644', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => setForm({ ...form, strengths: [...(form.strengths || []), ''] })} style={{ fontSize: 11, color: '#00c86e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Add strength</button>
                </div>
                <div>
                  <label style={CL}>Weaknesses</label>
                  {(form.weaknesses || []).map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input
                        type="text"
                        value={w}
                        onChange={(e) => {
                          const updated = [...form.weaknesses];
                          updated[i] = e.target.value;
                          setForm({ ...form, weaknesses: updated });
                        }}
                        style={I}
                      />
                      <button onClick={() => setForm({ ...form, weaknesses: form.weaknesses.filter((_, idx) => idx !== i) })} style={{ background: '#4d1a1a', color: '#ff6644', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                  <button onClick={() => setForm({ ...form, weaknesses: [...(form.weaknesses || []), ''] })} style={{ fontSize: 11, color: '#00c86e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Add weakness</button>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={save} style={{ ...BtnGreen, flex: 1 }}>Save Venue</button>
                  <button onClick={() => { setShowForm(false); setEditId(null); setForm(empty); }} style={{ ...BtnGray, flex: 1 }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
