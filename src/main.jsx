import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Briefcase,
  Bookmark,
  Check,
  Eye,
  FileText,
  FilePenLine,
  GraduationCap,
  Info,
  Link2,
  ListChecks,
  Maximize2,
  MessageSquareText,
  Palette,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  X,
} from 'lucide-react'
import './styles.css'

const initialResume = {
  photo: '',
  fullName: '',
  age: '',
  status: '',
  role: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
  location: '',
  website: '',
  summary: '',
  skills: [],
  experience: [],
  education: [],
}

const initialResignation = {
  fullName: '',
  role: '',
  company: '',
  manager: '',
  date: '',
  lastDay: '',
  notice: '',
  reason: '',
}

const initialOfferLetter = {
  fullName: '',
  role: '',
  company: '',
  manager: '',
  email: '',
  phone: '',
  address: '',
  date: '',
  subject: '',
  intro: '',
  body: '',
  closing: '',
}

const exampleResume = {
  ...initialResume,
  fullName: 'Nama Penuh Anda',
  age: '28',
  status: 'Bujang',
  role: 'Jawatan Profesional',
  email: 'nama@email.com',
  phone: '+60 12 345 6789',
  location: 'Kuala Lumpur, Malaysia',
  summary: 'Profesional berdedikasi dengan pengalaman dalam bidang yang berkaitan. Berkemahiran mengurus tugasan, bekerjasama dalam pasukan dan mencapai sasaran kerja.',
  skills: ['Komunikasi', 'Pengurusan masa', 'Microsoft Office'],
  experience: [{ company: 'Nama Syarikat', role: 'Jawatan Anda', period: '2022 — Kini', description: 'Terangkan tanggungjawab dan pencapaian utama anda di sini.' }],
  education: [{ school: 'Nama Institusi', degree: 'Nama kelayakan', period: '2016 — 2020' }],
}

const exampleResignation = {
  ...initialResignation,
  fullName: 'Nama Penuh Anda',
  role: 'Jawatan Anda',
  company: 'Nama Syarikat',
  manager: 'Nama Manager',
  date: '11 September 2026',
  lastDay: '11 Oktober 2026',
  notice: '30 hari',
  reason: 'Saya ingin meneruskan peluang baharu yang lebih selari dengan perkembangan kerjaya saya.',
}

const exampleOfferLetter = {
  ...initialOfferLetter,
  fullName: 'Nama Penuh Penerima',
  role: 'Jawatan Yang Ditawarkan',
  company: 'Nama Syarikat',
  manager: 'Nama Pengurus',
  email: 'nama@email.com',
  phone: '+60 12 345 6789',
  address: 'Alamat penerima',
  date: '11 September 2026',
  subject: 'Penawaran jawatan baharu',
  intro: 'Dengan hormatnya, kami ingin mengesahkan tawaran jawatan ini di syarikat kami.',
  body: 'Berdasarkan pengalaman dan kebolehan anda, kami yakin anda dapat menyumbang kepada kejayaan organisasi ini.',
  closing: 'Kami berharap anda dapat menyertai pasukan kami. Terima kasih.',
}

const templates = [
  { id: 'editorial', label: 'Editorial', description: 'Tipografi ekspresif' },
  { id: 'classic', label: 'Classic', description: 'Kemas & profesional' },
  { id: 'minimal', label: 'Minimal', description: 'Ringkas & moden' },
  { id: 'modern', label: 'Modern', description: 'Tegas & kontemporari' },
  { id: 'creative', label: 'Creative', description: 'Berani dengan aksen warna' },
  { id: 'professional', label: 'Professional', description: 'Formal & tersusun' },
]

const colors = [
  { name: 'Terracotta', value: '#c45d43' },
  { name: 'Forest', value: '#286052' },
  { name: 'Ink', value: '#263238' },
  { name: 'Cobalt', value: '#365db8' },
  { name: 'Ochre', value: '#b37c24' },
]

const resignationTemplates = [
  { id: 'formal', label: 'Formal', description: 'Klasik & rasmi' },
  { id: 'modern', label: 'Modern', description: 'Kemas dengan aksen' },
  { id: 'minimal', label: 'Minimal', description: 'Bersih & ringkas' },
  { id: 'accent', label: 'Accent', description: 'Header lebih menonjol' },
]

function loadResume() {
  try {
    const hash = window.location.hash
    if (hash.startsWith('#resume=')) return JSON.parse(decodeURIComponent(atob(hash.slice(8))))
    const saved = localStorage.getItem('form-studio-resume-data')
    return saved ? { ...initialResume, ...JSON.parse(saved) } : initialResume
  } catch {
    return initialResume
  }
}

function loadResignation() {
  try {
    const hash = window.location.hash
    if (hash.startsWith('#resignation=')) return { ...initialResignation, ...JSON.parse(decodeURIComponent(atob(hash.slice(13)))) }
    const saved = localStorage.getItem('form-studio-resignation-data')
    return saved ? { ...initialResignation, ...JSON.parse(saved) } : initialResignation
  } catch {
    return initialResignation
  }
}

function loadOfferLetter() {
  try {
    const hash = window.location.hash
    if (hash.startsWith('#offerletter=')) return { ...initialOfferLetter, ...JSON.parse(decodeURIComponent(atob(hash.slice(13)))) }
    const saved = localStorage.getItem('form-studio-offer-letter-data')
    return saved ? { ...initialOfferLetter, ...JSON.parse(saved) } : initialOfferLetter
  } catch {
    return initialOfferLetter
  }
}

async function requestDocuments(path = '', options) {
  const response = await fetch(`/api/documents${path}`, options)
  if (!response.ok) throw new Error('Database request failed')
  return response.status === 204 ? null : response.json()
}

function App() {
  const [resume, setResume] = useState(loadResume)
  const [resignation, setResignation] = useState(loadResignation)
  const [offerLetter, setOfferLetter] = useState(loadOfferLetter)
  const sharedId = window.location.hash.startsWith('#share=') ? window.location.hash.slice(7) : ''
  const [activeView, setActiveView] = useState(() => {
    if (window.location.hash.startsWith('#resignation=')) return 'resignation'
    if (window.location.hash.startsWith('#offerletter=')) return 'offerLetter'
    return 'resume'
  })
  const [savedDocuments, setSavedDocuments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resume-studio-saved-documents')) || []
    } catch {
      return []
    }
  })
  const [savedDocumentId, setSavedDocumentId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [resignationTemplate, setResignationTemplate] = useState('formal')
  const [offerLetterTemplate, setOfferLetterTemplate] = useState('formal')
  const [resignationTab, setResignationTab] = useState('content')
  const [offerLetterTab, setOfferLetterTab] = useState('content')
  const [template, setTemplate] = useState('editorial')
  const [accent, setAccent] = useState(colors[0].value)
  const [resignationAccent, setResignationAccent] = useState(colors[0].value)
  const [activeTab, setActiveTab] = useState('content')
  const [saved, setSaved] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const [toast, setToast] = useState('')
  const isSharedView = Boolean(sharedId) || window.location.hash.startsWith('#resume=') || window.location.hash.startsWith('#resignation=') || window.location.hash.startsWith('#offerletter=')

  useEffect(() => {
    if (!saved) {
      const timer = setTimeout(() => {
        localStorage.setItem('form-studio-resume-data', JSON.stringify(resume))
        setSaved(true)
      }, 650)
      return () => clearTimeout(timer)
    }
  }, [resume, saved])

  useEffect(() => {
    localStorage.setItem('form-studio-resignation-data', JSON.stringify(resignation))
  }, [resignation])

  useEffect(() => {
    localStorage.setItem('form-studio-offer-letter-data', JSON.stringify(offerLetter))
  }, [offerLetter])

  useEffect(() => {
    localStorage.setItem('resume-studio-saved-documents', JSON.stringify(savedDocuments))
  }, [savedDocuments])

  useEffect(() => {
    requestDocuments()
      .then((documents) => setSavedDocuments(documents))
      .catch(() => setToast('Database tidak tersedia. Data lokal masih digunakan.'))
  }, [])

  useEffect(() => {
    if (!sharedId) return
    fetch(`/api/shares/${encodeURIComponent(sharedId)}`)
      .then((response) => {
        if (!response.ok) throw new Error('Share link tidak dijumpai')
        return response.json()
      })
      .then(({ type, data }) => {
        if (type === 'resume') {
          setResume(data)
          setActiveView('resume')
        } else if (type === 'offerletter') {
          setOfferLetter(data)
          setActiveView('offerLetter')
        } else if (type === 'resignation') {
          setResignation(data)
          setActiveView('resignation')
        } else {
          throw new Error('Jenis dokumen tidak sah')
        }
      })
      .catch(() => setToast('Share link tidak dijumpai atau telah tamat.'))
  }, [sharedId])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!lightboxPhoto) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxPhoto('')
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxPhoto])

  const update = (key, value) => {
    setResume((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const updateResignation = (key, value) => setResignation((current) => ({ ...current, [key]: value }))
  const updateOfferLetter = (key, value) => setOfferLetter((current) => ({ ...current, [key]: value }))

      const updateListItem = (list, index, key, value) => {
    update(list, resume[list].map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)))
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setToast('Sila pilih fail gambar')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast('Saiz gambar mestilah kurang daripada 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => update('photo', reader.result)
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const addExperience = () => update('experience', [...resume.experience, { company: 'Nama syarikat', role: 'Jawatan', period: '2020 — 2022', description: 'Terangkan sumbangan dan pencapaian anda.' }])
  const addEducation = () => update('education', [...resume.education, { school: 'Nama institusi', degree: 'Program pengajian', period: '2016 — 2020' }])
  const removeItem = (list, index) => update(list, resume[list].filter((_, itemIndex) => itemIndex !== index))

  const createShareLink = async () => {
    const type = activeView === 'resume' ? 'resume' : activeView === 'offerLetter' ? 'offerletter' : 'resignation'
    const data = activeView === 'resume' ? resume : activeView === 'offerLetter' ? offerLetter : resignation
    const id = crypto.randomUUID().replaceAll('-', '').slice(0, 8)
    const response = await fetch('/api/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type, data }),
    })
    if (!response.ok) throw new Error('Share link gagal dicipta')
    setShareUrl(`${window.location.origin}${window.location.pathname}#share=${id}`)
  }

  useEffect(() => {
    if (!shareOpen || isSharedView) return
    setShareUrl('')
    createShareLink().catch(() => {
      setToast('Server tidak tersedia. Link pendek tidak dapat dicipta.')
    })
  }, [shareOpen, isSharedView])

  const handleShare = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      const docName = activeView === 'resume' ? 'resume' : activeView === 'offerLetter' ? 'offer letter' : 'surat resign'
      setToast(`Link ${docName} disalin ke clipboard`)
    } catch {
      setToast('Link sudah siap. Salin dari kotak share.')
    }
  }

  const resetResume = () => {
    if (window.confirm('Reset resume kepada contoh asal?')) {
      setResume(initialResume)
      setSaved(false)
      setToast('Resume dikembalikan ke contoh asal')
    }
  }

  const resetResignation = () => {
    if (window.confirm('Reset surat resign kepada contoh asal?')) {
      setResignation(initialResignation)
      setResignationTemplate('formal')
      setResignationAccent(colors[0].value)
      setToast('Surat resign dikembalikan ke contoh asal')
    }
  }

  const resetOfferLetter = () => {
    if (window.confirm('Reset offer letter kepada contoh asal?')) {
      setOfferLetter(initialOfferLetter)
      setToast('Offer letter dikembalikan ke contoh asal')
    }
  }

  const loadExample = () => {
    if (activeView === 'resume') {
      setResume(exampleResume)
      setSaved(false)
    } else if (activeView === 'offerLetter') {
      setOfferLetter(exampleOfferLetter)
    } else if (activeView === 'resignation') {
      setResignation(exampleResignation)
    }
    setSavedDocumentId(null)
    setToast('Contoh dimuatkan ke dalam borang')
  }

  const saveCurrentDocument = async () => {
    const type = activeView === 'resume' ? 'resume' : activeView === 'offerLetter' ? 'offerLetter' : 'resignation'
    const data = type === 'resume' ? resume : type === 'offerLetter' ? offerLetter : resignation
    const name = type === 'resume'
      ? (resume.fullName || 'Resume tanpa nama')
      : type === 'offerLetter'
        ? `${offerLetter.company || 'Offer Letter'} · ${offerLetter.fullName || 'Tanpa nama'}`
        : `${resignation.company || 'Surat resign'} · ${resignation.fullName || 'Tanpa nama'}`
    const document = { id: savedDocumentId || `${type}-${Date.now()}`, type, name, data: JSON.parse(JSON.stringify(data)), template: type === 'resume' ? template : type === 'offerLetter' ? 'formal' : resignationTemplate, accent: type === 'resume' ? accent : type === 'offerLetter' ? accent : resignationAccent, savedAt: new Date().toISOString() }
    const isUpdate = Boolean(savedDocumentId)
    setSavedDocuments((current) => isUpdate ? current.map((item) => item.id === savedDocumentId ? document : item) : [document, ...current])
    try {
      const savedDocument = await requestDocuments(isUpdate ? `/${savedDocumentId}` : '', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document),
      })
      setSavedDocuments((current) => isUpdate ? current.map((item) => item.id === savedDocument.id ? savedDocument : item) : [savedDocument, ...current.filter((item) => item.id !== savedDocument.id)])
    } catch {
      setToast('Dokumen disimpan secara lokal. Database tidak tersedia.')
    }
    setResume(initialResume)
    setResignation(initialResignation)
    setOfferLetter(initialOfferLetter)
    setTemplate('editorial')
    setResignationTemplate('formal')
    setResignationAccent(colors[0].value)
    setSaved(false)
    setSavedDocumentId(null)
    setActiveView('saved')
    const docLabel = type === 'resume' ? 'Resume' : type === 'offerLetter' ? 'Offer Letter' : 'Surat resign'
    setToast(savedDocumentId ? 'Perubahan dikemas kini dalam senarai' : `${docLabel} disimpan dalam senarai`)
  }

  const openSavedDocument = (document) => {
    if (document.type === 'resume') {
      setResume({ ...initialResume, ...document.data })
      setTemplate(document.template || 'editorial')
      setAccent(document.accent || colors[0].value)
      setSaved(false)
      setActiveView('resume')
    } else if (document.type === 'offerLetter') {
      setOfferLetter({ ...initialOfferLetter, ...document.data })
      setAccent(document.accent || colors[0].value)
      setActiveView('offerLetter')
    } else {
      setResignation({ ...initialResignation, ...document.data })
      setResignationTemplate(document.template || 'formal')
      setResignationAccent(document.accent || colors[0].value)
      setActiveView('resignation')
    }
    setSavedDocumentId(document.id)
    setSidebarOpen(false)
    setToast('Dokumen dibuka semula')
  }

  const deleteSavedDocument = async (id) => {
    setSavedDocuments((current) => current.filter((document) => document.id !== id))
    if (savedDocumentId === id) setSavedDocumentId(null)
    setToast('Dokumen dibuang dari senarai')
    try {
      await requestDocuments(`/${id}`, { method: 'DELETE' })
    } catch {
      setToast('Dokumen dibuang secara lokal. Database tidak tersedia.')
    }
  }

  const goToSection = (id) => {
    const setTab = activeView === 'resume' ? setActiveTab : activeView === 'offerLetter' ? setOfferLetterTab : setResignationTab
    setSidebarOpen(false)
    if (id === 'design') {
      setTab('design')
      return
    }
    setTab('content')
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const openSettings = () => {
    if (activeView === 'resume') setActiveTab('design')
    if (activeView === 'offerLetter') setOfferLetterTab('design')
    if (activeView === 'resignation') setResignationTab('design')
    requestAnimationFrame(() => document.querySelector('.editor-panel')?.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  const currentTab = activeView === 'resume' ? activeTab : activeView === 'offerLetter' ? offerLetterTab : resignationTab
  const sectionNav = activeView === 'resume'
    ? [
        { id: 'sec-profile', label: 'Profil utama', icon: UserRound },
        { id: 'sec-experience', label: 'Pengalaman', icon: Briefcase },
        { id: 'sec-education', label: 'Pendidikan', icon: GraduationCap },
        { id: 'sec-skills', label: 'Kemahiran', icon: ListChecks },
        { id: 'design', label: 'Gaya & warna', icon: Palette },
      ]
    : activeView === 'offerLetter'
      ? [
          { id: 'sec-offer-letter-info', label: 'Maklumat surat', icon: Info },
          { id: 'sec-offer-letter-content', label: 'Isi kandungan', icon: MessageSquareText },
          { id: 'design', label: 'Gaya surat', icon: Palette },
        ]
      : [
        { id: 'sec-info', label: 'Maklumat surat', icon: Info },
        { id: 'sec-reason', label: 'Alasan ringkas', icon: MessageSquareText },
        { id: 'design', label: 'Gaya surat', icon: Palette },
      ]

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''} ${isSharedView ? 'shared-view' : ''}`} style={{ '--accent': accent }}>
      <header className="page-nav">
        {!isSharedView && activeView !== 'saved' && <button className="button button-ghost page-nav-example" title="Muat contoh borang" onClick={loadExample}><FileText size={15} /> Contoh</button>}
        {!isSharedView && <button className="button button-ghost icon-only-button page-nav-settings" title="Tetapan" onClick={openSettings}><Settings size={16} /></button>}
        <div className="page-nav-brand"><button className="brand-mark nav-sidebar-toggle" title="Buka sidebar" onClick={() => setSidebarOpen(true)}><Sparkles size={15} /></button><strong>Form<span className="brand-muted">Studio</span></strong></div>
        <span className="page-nav-context">{activeView === 'resume' ? 'Resume' : activeView === 'offerLetter' ? 'Offer Letter' : activeView === 'resignation' ? 'Surat Resign' : 'Save List'}</span>
      </header>
      <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span className="brand-text">Form<span className="brand-muted">Studio</span></span>
        </div>

        <div className="sidebar-scroll">
          <p className="nav-label">Dokumen</p>
          <nav className="doc-switch">
            <button className={`sidebar-item ${activeView === 'resume' ? 'active' : ''}`} onClick={() => { setSavedDocumentId(null); setActiveView('resume'); setSidebarOpen(false) }}><FileText size={17} /><span><strong>Resume</strong><small>Edit & bina resume</small></span></button>
            <button className={`sidebar-item ${activeView === 'resignation' ? 'active' : ''}`} onClick={() => { setSavedDocumentId(null); setActiveView('resignation'); setSidebarOpen(false) }}><FilePenLine size={17} /><span><strong>Surat Resign</strong><small>Surat letak jawatan</small></span></button>
            <button className={`sidebar-item ${activeView === 'offerLetter' ? 'active' : ''}`} onClick={() => { setSavedDocumentId(null); setActiveView('offerLetter'); setSidebarOpen(false) }}><FilePenLine size={17} /><span><strong>Offer Letter</strong><small>Surat tawaran kerja</small></span></button>
            <button className={`sidebar-item ${activeView === 'saved' ? 'active' : ''}`} onClick={() => { setActiveView('saved'); setSidebarOpen(false) }}><Bookmark size={17} /><span><strong>Save List</strong><small>{savedDocuments.length} dokumen disimpan</small></span></button>
          </nav>

        </div>

        <div className="sidebar-bottom">
        </div>
      </aside>

      <main className="content-area">
        <aside className={`editor-panel ${activeView === 'saved' ? 'saved-panel' : ''}`}>
          {activeView === 'saved' ? <SavedDocuments documents={savedDocuments} onOpen={openSavedDocument} onDelete={deleteSavedDocument} /> : <>
          {activeView === 'resume' ? <><div className="panel-heading">
            <div><p className="eyebrow">Resume builder</p><h1>Bina cerita kerjaya anda.</h1></div>
            <div className="profile-chip"><UserRound size={16} /></div>
          </div>
          <div className="tabs" role="tablist">
            <button className={activeTab === 'content' ? 'tab active' : 'tab'} onClick={() => setActiveTab('content')}>Kandungan</button>
            <button className={activeTab === 'design' ? 'tab active' : 'tab'} onClick={() => setActiveTab('design')}>Gaya</button>
          </div>

          {activeTab === 'content' ? <div className="form-content">
            <section className="form-section" id="sec-profile">
              <div className="section-label"><span>01</span><h2>Profil utama</h2></div>
              <div className="photo-field">
                <button className={`photo-preview ${resume.photo ? 'photo-preview-clickable' : ''}`} type="button" title={resume.photo ? 'Lihat foto profil' : undefined} onClick={() => resume.photo && setLightboxPhoto(resume.photo)}>{resume.photo ? <img src={resume.photo} alt="Foto profil" /> : <UserRound size={22} />}</button>
                <div><strong>Foto profil</strong><p>JPG atau PNG, maksimum 2MB.</p></div>
                <label className="button button-ghost upload-button"><Upload size={15} /> {resume.photo ? 'Tukar foto' : 'Tambah foto'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoUpload} /></label>
                {resume.photo && <button className="icon-button delete" title="Padam foto" onClick={() => update('photo', '')}><Trash2 size={15} /></button>}
              </div>
              <div className="field-grid">
                <Field label="Nama penuh" value={resume.fullName} onChange={(value) => update('fullName', value)} />
                <Field label="Jawatan / bidang" value={resume.role} onChange={(value) => update('role', value)} />
                <Field label="Umur" value={resume.age} onChange={(value) => update('age', value)} type="number" min="1" max="120" />
                <label className="field"><span>Status</span><select value={resume.status} onChange={(event) => update('status', event.target.value)}><option value="">Pilih status</option><option>Bujang</option><option>Berkahwin</option><option>Duda / Janda</option><option>Lain-lain</option></select></label>
                <Field label="Email" value={resume.email} onChange={(value) => update('email', value)} />
                <Field label="Telefon" value={resume.phone} onChange={(value) => update('phone', value)} />
                <Field label="Alamat" value={resume.address} onChange={(value) => update('address', value)} />
                <Field label="Poskod" value={resume.postcode} onChange={(value) => update('postcode', value)} />
                <Field label="Lokasi" value={resume.location} onChange={(value) => update('location', value)} />
                <Field label="Website" value={resume.website} onChange={(value) => update('website', value)} />
              </div>
              <label className="field full-field"><span>Ringkasan profesional</span><textarea value={resume.summary} onChange={(event) => update('summary', event.target.value)} rows="4" /></label>
            </section>

            <section className="form-section" id="sec-experience">
              <div className="section-label"><span>02</span><h2>Pengalaman</h2><button className="add-item-button" title="Tambah pengalaman" onClick={addExperience}><Plus size={15} /> Tambah pengalaman</button></div>
              {resume.experience.map((item, index) => <div className="repeat-card" key={`experience-${index}`}>
                <div className="repeat-header"><span className="item-number">{String(index + 1).padStart(2, '0')}</span><button className="icon-button delete" title="Padam pengalaman" onClick={() => removeItem('experience', index)}><Trash2 size={15} /></button></div>
                <div className="field-grid"><Field label="Syarikat" value={item.company} onChange={(value) => updateListItem('experience', index, 'company', value)} /><Field label="Jawatan" value={item.role} onChange={(value) => updateListItem('experience', index, 'role', value)} /><Field label="Tempoh" value={item.period} onChange={(value) => updateListItem('experience', index, 'period', value)} /><label className="field full-field"><span>Penerangan & pencapaian</span><textarea value={item.description} onChange={(event) => updateListItem('experience', index, 'description', event.target.value)} rows="3" /></label></div>
              </div>)}
            </section>

            <section className="form-section" id="sec-education">
              <div className="section-label"><span>03</span><h2>Pendidikan</h2><button className="add-item-button" title="Tambah pendidikan" onClick={addEducation}><Plus size={15} /> Tambah pendidikan</button></div>
              {resume.education.map((item, index) => <div className="repeat-card" key={`education-${index}`}><div className="repeat-header"><span className="item-number">{String(index + 1).padStart(2, '0')}</span><button className="icon-button delete" title="Padam pendidikan" onClick={() => removeItem('education', index)}><Trash2 size={15} /></button></div><div className="field-grid"><Field label="Institusi" value={item.school} onChange={(value) => updateListItem('education', index, 'school', value)} /><Field label="Tempoh" value={item.period} onChange={(value) => updateListItem('education', index, 'period', value)} /><label className="field full-field"><span>Program / kelayakan</span><input value={item.degree} onChange={(event) => updateListItem('education', index, 'degree', event.target.value)} /></label></div></div>)}
            </section>

            <section className="form-section" id="sec-skills">
              <div className="section-label"><span>04</span><h2>Kemahiran</h2></div>
              <label className="field full-field"><span>Asingkan dengan koma</span><input value={resume.skills.join(', ')} onChange={(event) => update('skills', event.target.value.split(',').map((skill) => skill.trim()).filter(Boolean))} /></label>
            </section>
          </div> : <DesignPanel template={template} setTemplate={setTemplate} accent={accent} setAccent={setAccent} />}</> : activeView === 'offerLetter' ? <OfferLetterEditor offerLetter={offerLetter} update={updateOfferLetter} template={offerLetterTemplate} setTemplate={setOfferLetterTemplate} accent={accent} setAccent={setAccent} activeTab={offerLetterTab} setActiveTab={setOfferLetterTab} /> : <ResignationEditorTabs resignation={resignation} update={updateResignation} template={resignationTemplate} setTemplate={setResignationTemplate} accent={resignationAccent} setAccent={setResignationAccent} activeTab={resignationTab} setActiveTab={setResignationTab} />}
          </>}
        </aside>

        {activeView !== 'saved' && <section className="preview-panel">
          <div className="preview-toolbar">
            <div className="preview-title"><Eye size={16} /><span>Live preview</span></div>
            <div className="preview-nav-actions">
              <span className="a4-label">A4 · 1 halaman</span>
              <div className="preview-buttons">
                {!isSharedView && (
                  <button className="button button-ghost icon-only-button" title={savedDocumentId ? 'Kemas kini senarai' : 'Simpan ke list'} onClick={saveCurrentDocument}><Bookmark size={16} /></button>
                )}
                {!isSharedView && (activeView === 'resume' ? (
                  <button className="button button-ghost icon-only-button" title="Reset" onClick={resetResume}><RotateCcw size={16} /></button>
                ) : activeView === 'offerLetter' ? (
                  <button className="button button-ghost icon-only-button" title="Reset" onClick={resetOfferLetter}><RotateCcw size={16} /></button>
                ) : (
                  <button className="button button-ghost icon-only-button" title="Reset" onClick={resetResignation}><RotateCcw size={16} /></button>
                ))}
                {!isSharedView && (
                  <button className="button button-share button-icon-no-bg icon-only-button" title="Kongsi" onClick={() => setShareOpen(true)}><Link2 size={16} /></button>
                )}
                <button className="button button-primary button-icon-no-bg icon-only-button" title="PDF / Print" onClick={() => window.print()}><Printer size={16} /></button>
              </div>
            </div>
          </div>
          <div className={activeView === 'resume' ? 'paper-wrap' : 'letter-wrap'}>{activeView === 'resume' ? <ResumePreview resume={resume} template={template} accent={accent} onPhotoClick={setLightboxPhoto} /> : activeView === 'offerLetter' ? <OfferLetterPreview offerLetter={offerLetter} template={offerLetterTemplate} accent={accent} /> : <ResignationPreview resignation={resignation} template={resignationTemplate} accent={resignationAccent} />}</div>
          <p className="preview-note"><Printer size={14} /> Gunakan PDF / Print untuk menyimpan salinan berkualiti tinggi.</p>
        </section>}
      </main>

      {shareOpen && <div className="modal-backdrop" onClick={() => setShareOpen(false)}><div className="share-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={() => setShareOpen(false)}><X size={18} /></button><div className="modal-icon"><Link2 size={21} /></div><p className="eyebrow">Share {activeView === 'resume' ? 'resume' : activeView === 'offerLetter' ? 'offer letter' : 'surat resign'}</p><h2>{activeView === 'resume' ? 'Resume' : activeView === 'offerLetter' ? 'Offer Letter' : 'Surat resign'} anda sedia untuk dikongsi.</h2><p className="modal-copy">Sesiapa yang mempunyai link ini boleh melihat {activeView === 'resume' ? 'resume' : activeView === 'offerLetter' ? 'offer letter' : 'surat resign'} anda. Link pendek ini disimpan di server.</p><div className="share-input"><input value={shareUrl || 'Sedang menyediakan link...'} readOnly /><button className="button button-primary" onClick={handleShare} disabled={!shareUrl}>Salin link</button></div><span className="privacy-note"><Check size={14} /> Link pendek lebih mudah untuk dikongsi</span></div></div>}
      {lightboxPhoto && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Foto profil" onClick={() => setLightboxPhoto('')}><div className="photo-lightbox-content" onClick={(event) => event.stopPropagation()}><button className="photo-lightbox-close icon-button" title="Tutup foto" onClick={() => setLightboxPhoto('')}><X size={22} /></button><img src={lightboxPhoto} alt="Foto profil diperbesar" /><span><Maximize2 size={14} /> Tekan Escape atau klik di luar untuk tutup</span></div></div>}
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', min, max }) {
  return <label className="field"><span>{label}</span><input type={type} min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

function DesignPanel({ template, setTemplate, accent, setAccent }) {
  return <div className="design-content"><section className="form-section"><div className="section-label"><span>01</span><h2>Pilih template</h2></div><div className="template-list">{templates.map((item) => <button key={item.id} className={`template-option ${template === item.id ? 'selected' : ''}`} onClick={() => setTemplate(item.id)}><span className={`template-swatch ${item.id}`}><FileText size={20} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span>{template === item.id && <Check size={16} className="template-check" />}</button>)}</div></section><section className="form-section"><div className="section-label"><span>02</span><h2>Warna aksen</h2></div><div className="color-grid">{colors.map((color) => <button key={color.value} className={`color-option ${accent === color.value ? 'selected' : ''}`} style={{ '--swatch': color.value }} onClick={() => setAccent(color.value)} title={color.name}><span />{accent === color.value && <Check size={14} />}</button>)}</div><p className="design-tip">Warna akan digunakan pada nama, heading dan elemen utama resume.</p></section></div>
}

function ResignationEditorTabs({ resignation, update, template, setTemplate, accent, setAccent, activeTab, setActiveTab }) {
  return <div className="resignation-editor">
    <div className="panel-heading"><div><p className="eyebrow">Letter builder</p><h1>Surat resign yang profesional.</h1></div><div className="profile-chip"><FilePenLine size={16} /></div></div>
    <p className="editor-intro">Lengkapkan maklumat di bawah. Surat anda akan dikemas kini secara live.</p>
    <div className="tabs" role="tablist">
      <button className={activeTab === 'content' ? 'tab active' : 'tab'} onClick={() => setActiveTab('content')}>Kandungan</button>
      <button className={activeTab === 'design' ? 'tab active' : 'tab'} onClick={() => setActiveTab('design')}>Gaya</button>
    </div>
    {activeTab === 'content' ? <>
      <section className="form-section" id="sec-info"><div className="section-label"><span>01</span><h2>Maklumat surat</h2></div><div className="field-grid">
        <Field label="Nama penuh" value={resignation.fullName} onChange={(value) => update('fullName', value)} />
        <Field label="Jawatan" value={resignation.role} onChange={(value) => update('role', value)} />
        <Field label="Nama syarikat" value={resignation.company} onChange={(value) => update('company', value)} />
        <Field label="Kepada / manager" value={resignation.manager} onChange={(value) => update('manager', value)} />
        <Field label="Tarikh surat" value={resignation.date} onChange={(value) => update('date', value)} />
        <Field label="Hari terakhir bekerja" value={resignation.lastDay} onChange={(value) => update('lastDay', value)} />
        <label className="field full-field"><span>Tempoh notis</span><select value={resignation.notice} onChange={(event) => update('notice', event.target.value)}><option value="">Pilih tempoh notis</option><option>24 jam</option><option>7 hari</option><option>14 hari</option><option>30 hari</option><option>60 hari</option><option>Lain-lain</option></select></label>
      </div></section>
      <section className="form-section" id="sec-reason"><div className="section-label"><span>02</span><h2>Alasan ringkas</h2></div><label className="field full-field"><span>Alasan berhenti</span><textarea value={resignation.reason} onChange={(event) => update('reason', event.target.value)} rows="5" /></label></section>
    </> : <><section className="form-section"><div className="section-label"><span>01</span><h2>Pilih gaya surat</h2></div><div className="template-list">{resignationTemplates.map((item) => <button key={item.id} className={`template-option ${template === item.id ? 'selected' : ''}`} onClick={() => setTemplate(item.id)}><span className={`letter-style-swatch ${item.id}`}><FilePenLine size={18} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span>{template === item.id && <Check size={16} className="template-check" />}</button>)}</div></section><section className="form-section"><div className="section-label"><span>02</span><h2>Warna aksen</h2></div><div className="color-grid">{colors.map((color) => <button key={color.value} className={`color-option ${accent === color.value ? 'selected' : ''}`} style={{ '--swatch': color.value }} onClick={() => setAccent(color.value)} title={color.name}><span />{accent === color.value && <Check size={14} />}</button>)}</div><p className="design-tip">Warna digunakan pada garis, tajuk dan aksen utama surat resign.</p></section></>}
  </div>
}

function LegacyResignationEditor({ resignation, update }) {
  return <div className="resignation-editor"><div className="panel-heading"><div><p className="eyebrow">Letter builder</p><h1>Surat resign yang profesional.</h1></div><div className="profile-chip"><FilePenLine size={16} /></div></div><p className="editor-intro">Lengkapkan maklumat di bawah. Surat anda akan dikemas kini secara live.</p><section className="form-section"><div className="section-label"><span>01</span><h2>Maklumat surat</h2></div><div className="field-grid"><Field label="Nama penuh" value={resignation.fullName} onChange={(value) => update('fullName', value)} /><Field label="Jawatan" value={resignation.role} onChange={(value) => update('role', value)} /><Field label="Nama syarikat" value={resignation.company} onChange={(value) => update('company', value)} /><Field label="Kepada / manager" value={resignation.manager} onChange={(value) => update('manager', value)} /><Field label="Tarikh surat" value={resignation.date} onChange={(value) => update('date', value)} /><Field label="Hari terakhir bekerja" value={resignation.lastDay} onChange={(value) => update('lastDay', value)} /><label className="field full-field"><span>Tempoh notis</span><select value={resignation.notice} onChange={(event) => update('notice', event.target.value)}><option>24 jam</option><option>7 hari</option><option>14 hari</option><option>30 hari</option><option>60 hari</option><option>Lain-lain</option></select></label></div></section><section className="form-section"><div className="section-label"><span>02</span><h2>Alasan ringkas</h2></div><label className="field full-field"><span>Alasan berhenti</span><textarea value={resignation.reason} onChange={(event) => update('reason', event.target.value)} rows="5" /></label></section></div>
}

function ResignationEditor({ resignation, update, template, setTemplate }) {
  return <div className="resignation-editor"><div className="panel-heading"><div><p className="eyebrow">Letter builder</p><h1>Surat resign yang profesional.</h1></div><div className="profile-chip"><FilePenLine size={16} /></div></div><p className="editor-intro">Lengkapkan maklumat di bawah. Surat anda akan dikemas kini secara live.</p><section className="form-section"><div className="section-label"><span>01</span><h2>Maklumat surat</h2></div><div className="field-grid"><Field label="Nama penuh" value={resignation.fullName} onChange={(value) => update('fullName', value)} /><Field label="Jawatan" value={resignation.role} onChange={(value) => update('role', value)} /><Field label="Nama syarikat" value={resignation.company} onChange={(value) => update('company', value)} /><Field label="Kepada / manager" value={resignation.manager} onChange={(value) => update('manager', value)} /><Field label="Tarikh surat" value={resignation.date} onChange={(value) => update('date', value)} /><Field label="Hari terakhir bekerja" value={resignation.lastDay} onChange={(value) => update('lastDay', value)} /><label className="field full-field"><span>Tempoh notis</span><select value={resignation.notice} onChange={(event) => update('notice', event.target.value)}><option>24 jam</option><option>7 hari</option><option>14 hari</option><option>30 hari</option><option>60 hari</option><option>Lain-lain</option></select></label></div></section><section className="form-section"><div className="section-label"><span>02</span><h2>Alasan ringkas</h2></div><label className="field full-field"><span>Alasan berhenti</span><textarea value={resignation.reason} onChange={(event) => update('reason', event.target.value)} rows="5" /></label></section><section className="form-section"><div className="section-label"><span>03</span><h2>Pilih gaya surat</h2></div><div className="template-list">{resignationTemplates.map((item) => <button key={item.id} className={`template-option ${template === item.id ? 'selected' : ''}`} onClick={() => setTemplate(item.id)}><span className={`letter-style-swatch ${item.id}`}><FilePenLine size={18} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span>{template === item.id && <Check size={16} className="template-check" />}</button>)}</div></section></div>
}

function ResumePreview({ resume, template, accent, onPhotoClick }) {
  return <article className={`resume-paper template-${template}`} style={{ '--accent': accent }}><header className="resume-header"><div className="resume-identity">{resume.photo && <button className="resume-photo-button" type="button" title="Lihat foto profil" onClick={() => onPhotoClick(resume.photo)}><img className="resume-photo" src={resume.photo} alt="Foto profil" /></button>}<div><h2>{resume.fullName}</h2><p className="resume-role">{resume.role}</p></div></div><div className="contact-list"><span>{resume.email}</span><span>{resume.phone}</span>{resume.address && <span>{resume.address}</span>}{resume.postcode && <span>{resume.postcode}</span>}<span>{resume.location}</span><span>{resume.age} tahun · {resume.status}</span><span>{resume.website}</span></div></header><div className="resume-body"><section className="resume-section intro-section"><h3>Profil</h3><p>{resume.summary}</p></section><section className="resume-section"><h3>Pengalaman</h3>{resume.experience.map((item, index) => <div className="resume-item" key={`${item.company}-${index}`}><div className="item-meta"><strong>{item.company}</strong><span>{item.period}</span></div><div><h4>{item.role}</h4><p>{item.description}</p></div></div>)}</section><section className="resume-section"><h3>Pendidikan</h3>{resume.education.map((item, index) => <div className="resume-item education-item" key={`${item.school}-${index}`}><div className="item-meta"><strong>{item.school}</strong><span>{item.period}</span></div><h4>{item.degree}</h4></div>)}</section><section className="resume-section skills-section"><h3>Kemahiran</h3><div className="skill-list">{resume.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section></div><footer className="resume-footer"><span>{resume.fullName}</span><span>form.studio</span></footer></article>
}

function LegacyResignationPreview({ resignation }) {
  return <article className="resignation-paper"><div className="letter-top"><span>SURAT LETAK JAWATAN</span><span>{resignation.date}</span></div><div className="letter-content"><p>{resignation.manager}</p><p>{resignation.company}</p><p className="letter-subject">Perkara: Notis peletakan jawatan</p><p>Dengan hormatnya saya, <strong>{resignation.fullName}</strong>, yang memegang jawatan sebagai <strong>{resignation.role}</strong> di {resignation.company}, ingin mengemukakan notis peletakan jawatan saya.</p><p>Peletakan jawatan ini berkuat kuasa dengan tempoh notis <strong>{resignation.notice}</strong>. Hari terakhir saya bekerja adalah pada <strong>{resignation.lastDay}</strong>.</p><p>Keputusan ini dibuat setelah pertimbangan yang teliti. Saya menghargai segala peluang, tunjuk ajar dan pengalaman yang telah saya peroleh sepanjang berkhidmat di organisasi ini.</p><p>Saya bersedia membantu proses serah tugas bagi memastikan peralihan tanggungjawab berjalan dengan lancar.</p><p>Terima kasih atas segala kerjasama dan sokongan yang diberikan.</p><p>Yang benar,</p><div className="signature-space" /><p className="signature-name"><strong>{resignation.fullName}</strong><br />{resignation.role}</p></div><footer className="letter-footer"><span>{resignation.fullName}</span><span>{resignation.company}</span></footer></article>
}

function ResignationPreview({ resignation, template, accent }) {
  return <article className={`resignation-paper resignation-${template}`} style={{ '--accent': accent }}><div className="letter-top"><span>SURAT LETAK JAWATAN</span><span>{resignation.date}</span></div><div className="letter-content"><p>{resignation.manager}</p><p>{resignation.company}</p><p className="letter-subject">Perkara: Notis peletakan jawatan</p><p>Dengan hormatnya saya, <strong>{resignation.fullName}</strong>, yang memegang jawatan sebagai <strong>{resignation.role}</strong> di {resignation.company}, ingin mengemukakan notis peletakan jawatan saya.</p><p>Peletakan jawatan ini berkuat kuasa dengan tempoh notis <strong>{resignation.notice}</strong>. Hari terakhir saya bekerja adalah pada <strong>{resignation.lastDay}</strong>.</p><p>{resignation.reason}</p><p>Saya bersedia membantu proses serah tugas bagi memastikan peralihan tanggungjawab berjalan dengan lancar.</p><p>Terima kasih atas segala kerjasama dan sokongan yang diberikan.</p><p>Yang benar,</p><div className="signature-space" /><p className="signature-name"><strong>{resignation.fullName}</strong><br />{resignation.role}</p></div><footer className="letter-footer"><span>{resignation.fullName}</span><span>{resignation.company}</span></footer></article>
}

function OfferLetterEditor({ offerLetter, update, template, setTemplate, accent, setAccent, activeTab, setActiveTab }) {
  return <div className="resignation-editor">
    <div className="panel-heading"><div><p className="eyebrow">Letter builder</p><h1>Offer Letter yang profesional.</h1></div><div className="profile-chip"><FilePenLine size={16} /></div></div>
    <p className="editor-intro">Lengkapkan maklumat tawaran kerja anda di bawah.</p>
    <div className="tabs" role="tablist">
      <button className={activeTab === 'content' ? 'tab active' : 'tab'} onClick={() => setActiveTab('content')}>Kandungan</button>
      <button className={activeTab === 'design' ? 'tab active' : 'tab'} onClick={() => setActiveTab('design')}>Gaya</button>
    </div>
    {activeTab === 'content' ? <>
    <section className="form-section" id="sec-offer-letter-info">
      <div className="section-label"><span>01</span><h2>Maklumat surat</h2></div>
      <div className="field-grid">
        <Field label="Nama penuh" value={offerLetter.fullName} onChange={(value) => update('fullName', value)} />
        <Field label="Jawatan yang ditawarkan" value={offerLetter.role} onChange={(value) => update('role', value)} />
        <Field label="Nama syarikat" value={offerLetter.company} onChange={(value) => update('company', value)} />
        <Field label="Kepada / manager" value={offerLetter.manager} onChange={(value) => update('manager', value)} />
        <Field label="Email" value={offerLetter.email} onChange={(value) => update('email', value)} />
        <Field label="Telefon" value={offerLetter.phone} onChange={(value) => update('phone', value)} />
        <Field label="Alamat" value={offerLetter.address} onChange={(value) => update('address', value)} />
        <Field label="Tarikh surat" value={offerLetter.date} onChange={(value) => update('date', value)} />
        <Field label="Subjek" value={offerLetter.subject} onChange={(value) => update('subject', value)} />
      </div>
    </section>
    <section className="form-section" id="sec-offer-letter-content">
      <div className="section-label"><span>02</span><h2>Isi kandungan</h2></div>
      <label className="field full-field"><span>Pengenalan</span><textarea value={offerLetter.intro} onChange={(event) => update('intro', event.target.value)} rows="3" /></label>
      <label className="field full-field"><span>Perenggan utama</span><textarea value={offerLetter.body} onChange={(event) => update('body', event.target.value)} rows="5" /></label>
      <label className="field full-field"><span>Penutup</span><textarea value={offerLetter.closing} onChange={(event) => update('closing', event.target.value)} rows="3" /></label>
    </section>
    </> : <>
      <section className="form-section"><div className="section-label"><span>01</span><h2>Pilih gaya surat</h2></div><div className="template-list">{resignationTemplates.map((item) => <button key={item.id} className={`template-option ${template === item.id ? 'selected' : ''}`} onClick={() => setTemplate(item.id)}><span className={`letter-style-swatch ${item.id}`}><FilePenLine size={18} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span>{template === item.id && <Check size={16} className="template-check" />}</button>)}</div></section>
      <section className="form-section"><div className="section-label"><span>02</span><h2>Warna aksen</h2></div><div className="color-grid">{colors.map((color) => <button key={color.value} className={`color-option ${accent === color.value ? 'selected' : ''}`} style={{ '--swatch': color.value }} onClick={() => setAccent(color.value)} title={color.name}><span />{accent === color.value && <Check size={14} />}</button>)}</div><p className="design-tip">Warna digunakan pada garis, tajuk dan aksen utama offer letter.</p></section>
    </>}
  </div>
}

function OfferLetterPreview({ offerLetter, template, accent }) {
  return <article className={`resignation-paper resignation-${template}`} style={{ '--accent': accent }}>
    <div className="letter-top"><span>OFFER LETTER</span><span>{offerLetter.date}</span></div>
    <div className="letter-content">
      <p className="letter-recipient">{offerLetter.manager}</p>
      <p>{offerLetter.company}</p>
      <p className="letter-subject">Perkara: {offerLetter.subject}</p>
      <p>Dengan hormatnya,</p>
      <p>{offerLetter.intro}</p>
      <p>{offerLetter.body}</p>
      <p>{offerLetter.closing}</p>
      <p>Yang benar,</p>
      <div className="signature-space" />
      <p className="signature-name"><strong>{offerLetter.fullName}</strong><br />{offerLetter.role}</p>
    </div>
    <footer className="letter-footer"><span>{offerLetter.fullName}</span><span>{offerLetter.company}</span></footer>
  </article>
}

function SavedDocuments({ documents, onOpen, onDelete }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const filteredDocuments = documents.filter((document) => {
    const matchesType = filter === 'all' || document.type === filter
    return matchesType && document.name.toLowerCase().includes(query.toLowerCase())
  })

  return <div className="saved-content">
    <div className="panel-heading"><div><p className="eyebrow">Dokumen anda</p><h1>Save List.</h1></div><div className="profile-chip"><Bookmark size={16} /></div></div>
    <p className="editor-intro">Simpan versi resume, surat resign dan offer letter untuk dibuka semula bila-bila masa.</p>
    <div className="saved-controls"><label className="saved-search"><span className="sr-only">Cari dokumen</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari dokumen..." /></label><label className="saved-filter"><span className="sr-only">Tapis jenis dokumen</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Semua dokumen</option><option value="resume">Resume</option><option value="resignation">Surat resign</option><option value="offerLetter">Offer letter</option></select></label></div>
    {documents.length === 0 ? <div className="saved-empty"><Bookmark size={28} /><h2>Belum ada dokumen disimpan</h2><p>Buka editor resume, surat resign atau offer letter, kemudian tekan “Simpan ke list”.</p></div> : filteredDocuments.length === 0 ? <div className="saved-empty"><h2>Tiada dokumen dijumpai</h2><p>Cuba kata kunci atau filter yang lain.</p></div> : <div className="saved-grid">{filteredDocuments.map((document) => <article className="saved-card" key={document.id}><div className={`saved-card-icon ${document.type}`}><>{document.type === 'resume' ? <FileText size={20} /> : <FilePenLine size={20} />}</></div><div className="saved-card-body"><span className="saved-card-type">{document.type === 'resume' ? 'Resume' : document.type === 'offerLetter' ? 'Offer Letter' : 'Surat resign'}</span><h2>{document.name}</h2><p>Disimpan {new Date(document.savedAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div><div className="saved-card-actions"><button className="button button-primary" onClick={() => onOpen(document)}><Eye size={15} /> Buka</button><button className="icon-button delete" title="Padam dokumen" onClick={() => onDelete(document.id)}><Trash2 size={16} /></button></div></article>)}</div>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
