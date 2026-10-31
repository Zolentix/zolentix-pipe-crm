import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.task.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.company.deleteMany()
  await prisma.user.deleteMany()

  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Sofia Reyes', email: 'sofia@zolentix.com', role: 'manager', avatar: 'SR' } }),
    prisma.user.create({ data: { name: 'Marcus Chen', email: 'marcus@zolentix.com', role: 'rep', avatar: 'MC' } }),
    prisma.user.create({ data: { name: 'Aisha Patel', email: 'aisha@zolentix.com', role: 'rep', avatar: 'AP' } }),
  ])

  const companies = await Promise.all([
    prisma.company.create({ data: { name: 'NovaTech Solutions', domain: 'novatech.io', industry: 'SaaS', size: '50-200', revenue: '$5M-$20M' } }),
    prisma.company.create({ data: { name: 'Meridian Health', domain: 'meridianhealth.com', industry: 'Healthcare', size: '200-500', revenue: '$20M-$50M' } }),
    prisma.company.create({ data: { name: 'Atlas Logistics', domain: 'atlaslogistics.co', industry: 'Logistics', size: '500-1000', revenue: '$50M-$100M' } }),
    prisma.company.create({ data: { name: 'Vertex Design Co', domain: 'vertexdesign.studio', industry: 'Design', size: '10-50', revenue: '$1M-$5M' } }),
    prisma.company.create({ data: { name: 'Pinnacle Finance', domain: 'pinnaclefin.com', industry: 'Fintech', size: '100-200', revenue: '$10M-$20M' } }),
    prisma.company.create({ data: { name: 'Cascade Energy', domain: 'cascadeenergy.eu', industry: 'Energy', size: '200-500', revenue: '$50M-$100M' } }),
    prisma.company.create({ data: { name: 'Bloom Retail', domain: 'bloomretail.com', industry: 'Retail', size: '50-200', revenue: '$5M-$20M' } }),
    prisma.company.create({ data: { name: 'Stratos Aerospace', domain: 'stratosaero.com', industry: 'Aerospace', size: '1000+', revenue: '$100M+' } }),
    prisma.company.create({ data: { name: 'Tidal Media Group', domain: 'tidalmedia.co', industry: 'Media', size: '10-50', revenue: '$1M-$5M' } }),
    prisma.company.create({ data: { name: 'Nexus Pharma', domain: 'nexuspharma.com', industry: 'Pharmaceuticals', size: '500-1000', revenue: '$50M-$100M' } }),
    prisma.company.create({ data: { name: 'Forge Manufacturing', domain: 'forgemfg.com', industry: 'Manufacturing', size: '200-500', revenue: '$20M-$50M' } }),
    prisma.company.create({ data: { name: 'Lumen AI Labs', domain: 'lumenai.dev', industry: 'AI/ML', size: '10-50', revenue: '$2M-$5M' } }),
    prisma.company.create({ data: { name: 'Ember Consulting', domain: 'emberconsulting.io', industry: 'Consulting', size: '50-200', revenue: '$5M-$10M' } }),
    prisma.company.create({ data: { name: 'Quantum Securities', domain: 'quantumsec.com', industry: 'Cybersecurity', size: '100-200', revenue: '$10M-$20M' } }),
    prisma.company.create({ data: { name: 'Solis Education', domain: 'solisedu.org', industry: 'EdTech', size: '50-200', revenue: '$3M-$10M' } }),
  ])

  const contacts = await Promise.all([
    prisma.contact.create({ data: { name: 'James Walker', email: 'james@novatech.io', title: 'CTO', phone: '+1-555-0101', companyId: companies[0].id } }),
    prisma.contact.create({ data: { name: 'Linda Torres', email: 'linda@novatech.io', title: 'VP Engineering', companyId: companies[0].id } }),
    prisma.contact.create({ data: { name: 'Dr. Sarah Kim', email: 'skim@meridianhealth.com', title: 'CEO', phone: '+1-555-0201', companyId: companies[1].id } }),
    prisma.contact.create({ data: { name: 'Robert Haines', email: 'rhaines@meridianhealth.com', title: 'CIO', companyId: companies[1].id } }),
    prisma.contact.create({ data: { name: 'Elena Vasquez', email: 'elena@atlaslogistics.co', title: 'COO', phone: '+1-555-0301', companyId: companies[2].id } }),
    prisma.contact.create({ data: { name: 'David Park', email: 'dpark@atlaslogistics.co', title: 'Head of IT', companyId: companies[2].id } }),
    prisma.contact.create({ data: { name: 'Mia Johnson', email: 'mia@vertexdesign.studio', title: 'Founder', phone: '+1-555-0401', companyId: companies[3].id } }),
    prisma.contact.create({ data: { name: 'Thomas Wright', email: 'twright@pinnaclefin.com', title: 'CFO', phone: '+1-555-0501', companyId: companies[4].id } }),
    prisma.contact.create({ data: { name: 'Amara Osei', email: 'amara@pinnaclefin.com', title: 'Head of Product', companyId: companies[4].id } }),
    prisma.contact.create({ data: { name: 'Klaus Weber', email: 'kweber@cascadeenergy.eu', title: 'VP Operations', phone: '+49-555-0601', companyId: companies[5].id } }),
    prisma.contact.create({ data: { name: 'Sophie Laurent', email: 'sophie@cascadeenergy.eu', title: 'Procurement Lead', companyId: companies[5].id } }),
    prisma.contact.create({ data: { name: 'Rachel Green', email: 'rachel@bloomretail.com', title: 'CMO', phone: '+1-555-0701', companyId: companies[6].id } }),
    prisma.contact.create({ data: { name: 'Nathan Brooks', email: 'nbrooks@stratosaero.com', title: 'Dir. Engineering', phone: '+1-555-0801', companyId: companies[7].id } }),
    prisma.contact.create({ data: { name: 'Yuki Tanaka', email: 'ytanaka@stratosaero.com', title: 'Program Manager', companyId: companies[7].id } }),
    prisma.contact.create({ data: { name: 'Alex Rivera', email: 'alex@tidalmedia.co', title: 'CEO', phone: '+1-555-0901', companyId: companies[8].id } }),
    prisma.contact.create({ data: { name: 'Dr. Fatima Hassan', email: 'fhassan@nexuspharma.com', title: 'VP R&D', phone: '+44-555-1001', companyId: companies[9].id } }),
    prisma.contact.create({ data: { name: 'Paul Mitchell', email: 'pmitchell@nexuspharma.com', title: 'Head of Compliance', companyId: companies[9].id } }),
    prisma.contact.create({ data: { name: 'Carlos Diaz', email: 'carlos@forgemfg.com', title: 'Plant Manager', phone: '+1-555-1101', companyId: companies[10].id } }),
    prisma.contact.create({ data: { name: 'Zara Ahmed', email: 'zara@lumenai.dev', title: 'CTO', phone: '+1-555-1201', companyId: companies[11].id } }),
    prisma.contact.create({ data: { name: 'Oliver Stone', email: 'oliver@lumenai.dev', title: 'CEO', companyId: companies[11].id } }),
    prisma.contact.create({ data: { name: 'Hannah Cole', email: 'hcole@emberconsulting.io', title: 'Partner', phone: '+1-555-1301', companyId: companies[12].id } }),
    prisma.contact.create({ data: { name: 'Derek Nguyen', email: 'derek@emberconsulting.io', title: 'Senior Consultant', companyId: companies[12].id } }),
    prisma.contact.create({ data: { name: 'Lisa Bergmann', email: 'lisa@quantumsec.com', title: 'CEO', phone: '+49-555-1401', companyId: companies[13].id } }),
    prisma.contact.create({ data: { name: 'Ahmed El-Sayed', email: 'ahmed@quantumsec.com', title: 'Lead Architect', companyId: companies[13].id } }),
    prisma.contact.create({ data: { name: 'Patricia Lane', email: 'patricia@solisedu.org', title: 'Director', phone: '+1-555-1501', companyId: companies[14].id } }),
    prisma.contact.create({ data: { name: 'Michael Owens', email: 'mowens@novatech.io', title: 'Product Manager', companyId: companies[0].id } }),
    prisma.contact.create({ data: { name: 'Anna Kowalski', email: 'anna@meridianhealth.com', title: 'Nurse Manager', companyId: companies[1].id } }),
    prisma.contact.create({ data: { name: 'Benjamin Frost', email: 'bfrost@pinnaclefin.com', title: 'Risk Analyst', companyId: companies[4].id } }),
    prisma.contact.create({ data: { name: 'Chloe Martin', email: 'chloe@bloomretail.com', title: 'E-commerce Director', companyId: companies[6].id } }),
    prisma.contact.create({ data: { name: 'Leo Chang', email: 'leo@tidalmedia.co', title: 'Creative Director', companyId: companies[8].id } }),
    prisma.contact.create({ data: { name: 'Nina Petrova', email: 'nina@cascadeenergy.eu', title: 'Sustainability Lead', companyId: companies[5].id } }),
    prisma.contact.create({ data: { name: 'Ryan Murphy', email: 'ryan@forgemfg.com', title: 'Quality Engineer', companyId: companies[10].id } }),
    prisma.contact.create({ data: { name: 'Isabella Rossi', email: 'isabella@stratosaero.com', title: 'Business Dev', companyId: companies[7].id } }),
    prisma.contact.create({ data: { name: 'Jordan Blake', email: 'jordan@solisedu.org', title: 'CTO', companyId: companies[14].id } }),
    prisma.contact.create({ data: { name: 'Emma Wilson', email: 'emma@vertexdesign.studio', title: 'Design Lead', companyId: companies[3].id } }),
    prisma.contact.create({ data: { name: 'Sam Kapoor', email: 'sam@lumenai.dev', title: 'ML Engineer', companyId: companies[11].id } }),
    prisma.contact.create({ data: { name: 'Diana Voss', email: 'diana@quantumsec.com', title: 'Sales Dir.', companyId: companies[13].id } }),
    prisma.contact.create({ data: { name: 'Oscar Fernandez', email: 'oscar@nexuspharma.com', title: 'Clinical Lead', companyId: companies[9].id } }),
    prisma.contact.create({ data: { name: 'Grace Thompson', email: 'grace@atlaslogistics.co', title: 'Fleet Manager', companyId: companies[2].id } }),
    prisma.contact.create({ data: { name: 'Kevin Dubois', email: 'kevin@emberconsulting.io', title: 'Analyst', companyId: companies[12].id } }),
  ])

  const stages = ['lead', 'contacted', 'qualified', 'proposal', 'won', 'lost']
  const stageProbs: Record<string, number> = { lead: 10, contacted: 25, qualified: 50, proposal: 75, won: 100, lost: 0 }

  const dealData = [
    { name: 'NovaTech Platform Migration', value: 85000, stage: 'proposal', contactIdx: 0, companyIdx: 0, ownerIdx: 0, closeDate: '2026-11-15' },
    { name: 'Meridian EHR Integration', value: 120000, stage: 'qualified', contactIdx: 2, companyIdx: 1, ownerIdx: 1, closeDate: '2026-12-01' },
    { name: 'Atlas Fleet Dashboard', value: 65000, stage: 'won', contactIdx: 4, companyIdx: 2, ownerIdx: 2, closeDate: '2026-10-10' },
    { name: 'Vertex Brand Refresh', value: 22000, stage: 'won', contactIdx: 6, companyIdx: 3, ownerIdx: 0, closeDate: '2026-10-05' },
    { name: 'Pinnacle Risk Engine', value: 150000, stage: 'proposal', contactIdx: 7, companyIdx: 4, ownerIdx: 1, closeDate: '2026-11-30' },
    { name: 'Cascade Monitoring Suite', value: 95000, stage: 'contacted', contactIdx: 9, companyIdx: 5, ownerIdx: 2, closeDate: '2026-12-15' },
    { name: 'Bloom E-commerce Relaunch', value: 48000, stage: 'qualified', contactIdx: 11, companyIdx: 6, ownerIdx: 0, closeDate: '2026-11-20' },
    { name: 'Stratos Telemetry Platform', value: 250000, stage: 'lead', contactIdx: 12, companyIdx: 7, ownerIdx: 1, closeDate: '2027-02-01' },
    { name: 'Tidal CMS Migration', value: 35000, stage: 'won', contactIdx: 14, companyIdx: 8, ownerIdx: 2, closeDate: '2026-09-28' },
    { name: 'Nexus Compliance Tracker', value: 180000, stage: 'qualified', contactIdx: 15, companyIdx: 9, ownerIdx: 0, closeDate: '2026-12-20' },
    { name: 'Forge MES Upgrade', value: 72000, stage: 'contacted', contactIdx: 17, companyIdx: 10, ownerIdx: 1, closeDate: '2027-01-10' },
    { name: 'Lumen ML Pipeline', value: 55000, stage: 'proposal', contactIdx: 18, companyIdx: 11, ownerIdx: 2, closeDate: '2026-11-25' },
    { name: 'Ember Data Strategy', value: 42000, stage: 'won', contactIdx: 20, companyIdx: 12, ownerIdx: 0, closeDate: '2026-10-15' },
    { name: 'Quantum SOC Dashboard', value: 110000, stage: 'lead', contactIdx: 22, companyIdx: 13, ownerIdx: 1, closeDate: '2027-01-15' },
    { name: 'Solis LMS Platform', value: 68000, stage: 'contacted', contactIdx: 24, companyIdx: 14, ownerIdx: 2, closeDate: '2026-12-01' },
    { name: 'NovaTech API Gateway', value: 45000, stage: 'lead', contactIdx: 1, companyIdx: 0, ownerIdx: 0, closeDate: '2027-01-20' },
    { name: 'Meridian Patient Portal', value: 90000, stage: 'proposal', contactIdx: 3, companyIdx: 1, ownerIdx: 1, closeDate: '2026-11-10' },
    { name: 'Pinnacle Mobile App', value: 75000, stage: 'qualified', contactIdx: 8, companyIdx: 4, ownerIdx: 2, closeDate: '2026-12-15' },
    { name: 'Cascade IoT Platform', value: 130000, stage: 'lead', contactIdx: 10, companyIdx: 5, ownerIdx: 0, closeDate: '2027-03-01' },
    { name: 'Bloom POS Integration', value: 38000, stage: 'lost', contactIdx: 28, companyIdx: 6, ownerIdx: 1, closeDate: '2026-10-01' },
    { name: 'Stratos Parts Catalog', value: 60000, stage: 'contacted', contactIdx: 13, companyIdx: 7, ownerIdx: 2, closeDate: '2026-12-20' },
    { name: 'Nexus Trial Management', value: 200000, stage: 'lead', contactIdx: 37, companyIdx: 9, ownerIdx: 0, closeDate: '2027-02-15' },
    { name: 'Lumen Inference API', value: 30000, stage: 'won', contactIdx: 35, companyIdx: 11, ownerIdx: 1, closeDate: '2026-10-20' },
    { name: 'Quantum Pen-Test Suite', value: 85000, stage: 'lost', contactIdx: 23, companyIdx: 13, ownerIdx: 2, closeDate: '2026-09-15' },
    { name: 'Solis Student Analytics', value: 52000, stage: 'qualified', contactIdx: 33, companyIdx: 14, ownerIdx: 0, closeDate: '2026-12-10' },
  ]

  const deals = await Promise.all(
    dealData.map(d =>
      prisma.deal.create({
        data: {
          name: d.name, value: d.value, stage: d.stage,
          probability: stageProbs[d.stage],
          closeDate: d.closeDate,
          ownerId: users[d.ownerIdx].id,
          contactId: contacts[d.contactIdx].id,
          companyId: companies[d.companyIdx].id,
        },
      })
    )
  )

  const actTypes = ['call', 'email', 'meeting', 'note']
  const actNotes = [
    'Discussed project scope and timeline',
    'Sent proposal with pricing breakdown',
    'Follow-up call — positive signals',
    'Demo of platform to leadership team',
    'Negotiating contract terms',
    'Initial discovery call completed',
    'Sent case study and references',
    'Budget approved on their side',
    'Technical review session with CTO',
    'Decision expected by end of month',
    'Competitor comparison requested',
    'Procurement review in progress',
    'Revised proposal sent with volume discount',
    'Kickoff meeting scheduled',
    'Contract signed — moving to onboarding',
    'Lost — went with in-house solution',
    'Follow-up on open questions',
    'Shared product roadmap preview',
    'Referenced by existing customer',
    'Meeting postponed to next week',
  ]

  for (let i = 0; i < 60; i++) {
    const deal = deals[i % deals.length]
    const user = users[i % users.length]
    await prisma.activity.create({
      data: {
        type: actTypes[i % actTypes.length],
        note: actNotes[i % actNotes.length],
        dealId: deal.id,
        contactId: contacts[i % contacts.length].id,
        userId: user.id,
        createdAt: new Date(Date.now() - (60 - i) * 3600000 * 8),
      },
    })
  }

  const taskTitles = [
    'Send revised proposal', 'Schedule demo call', 'Follow up on pricing',
    'Prepare case study', 'Update CRM notes', 'Send contract for review',
    'Book kickoff meeting', 'Share product roadmap', 'Check procurement status',
    'Send thank-you note', 'Review competitor analysis', 'Update forecast',
    'Prepare quarterly report', 'Schedule lunch meeting', 'Draft SOW',
  ]

  for (let i = 0; i < 15; i++) {
    const daysFromNow = Math.floor(Math.random() * 14) - 3
    const due = new Date()
    due.setDate(due.getDate() + daysFromNow)
    await prisma.task.create({
      data: {
        title: taskTitles[i],
        dueDate: due.toISOString().split('T')[0],
        completed: i > 10,
        priority: i < 5 ? 'high' : i < 10 ? 'medium' : 'low',
        dealId: deals[i % deals.length].id,
        userId: users[i % users.length].id,
      },
    })
  }

  console.log(`Seeded: ${users.length} users, ${companies.length} companies, ${contacts.length} contacts, ${deals.length} deals, 60 activities, 15 tasks`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
