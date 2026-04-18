import { StudentProfile, Opportunity } from './types';

export const DEMO_PROFILE: StudentProfile = {
  name: 'Aryan Sharma',
  degree: 'B.Tech Computer Science',
  semester: 6,
  cgpa: 8.4,
  skills: ['Python', 'Machine Learning', 'React', 'Node.js', 'Data Analysis', 'TensorFlow', 'SQL'],
  financial_need: true,
  location_preference: 'Remote / Bangalore',
};

export const DEMO_EMAIL_TEXT = `
---------- Email 1 ----------
From: scholarships@iitbombay.ac.in
Subject: INSPIRE Fellowship 2024 – Applications Now Open

Dear Students,

We are pleased to announce that applications for the DST INSPIRE Fellowship 2024 are now open. This prestigious fellowship is awarded to top science and technology students with exceptional academic records.

Eligibility:
- Minimum CGPA: 8.0
- Fields: Computer Science, Data Science, AI/ML
- Indian nationals only

Stipend: ₹80,000 per year + research contingency of ₹20,000

Skills Required: Python, Machine Learning, Research Methodology, Data Analysis

Deadline: December 15, 2024

Apply at: inspire.dst.gov.in

For queries, contact: inspire@dst.gov.in

---------- Email 2 ----------
From: internships@google.com
Subject: Google STEP Internship – Summer 2025 Applications

Hello,

Google is hiring Software Engineering Trainees (STEP) for Summer 2025. This is a paid internship designed for 2nd and 3rd year undergraduate students.

Requirements:
- Minimum CGPA: 7.5
- Skills: Data Structures, Algorithms, Python or Java, Problem Solving
- Open to: B.Tech/B.E. students in CS or related fields

Compensation: ₹1,50,000/month + accommodation allowance

Location: Bangalore (Hybrid/In-person)
Deadline: November 30, 2024

Apply at: careers.google.com/students

---------- Email 3 ----------
From: noreply@promo-deals.xyz
Subject: Congratulations! You've won $5000 in our lucky draw!

Dear Winner,

You have been selected as a winner of our international lucky draw. Claim your $5000 prize by clicking the link below and providing your bank details.

Click here: www.totally-not-spam.xyz/claim-prize

Hurry! Offer expires in 24 hours!

---------- Email 4 ----------
From: admissions@microsoft.com
Subject: Microsoft Research Fellowship – Applications Invited

Dear Applicant,

Microsoft Research India is inviting applications for the Microsoft Research Fellowship 2024-25 for exceptional graduate and final-year undergraduate students.

Fellowship Details:
- Monthly stipend: ₹60,000
- Duration: 12 months
- Location: Hyderabad/Remote
- Research Areas: Machine Learning, NLP, Systems

Eligibility:
- Minimum CGPA: 8.5
- Skills Required: Python, TensorFlow, PyTorch, Machine Learning, Research
- Financial need-based preference will be given

Deadline: January 10, 2025

Apply at: microsoft.com/research/india/fellowship

---------- Email 5 ----------
From: opportunities@aicte.gov.in
Subject: AICTE Pragati Scholarship for Technical Education

Dear Student,

AICTE is pleased to announce the Pragati Scholarship for Girl Students pursuing technical education. This scholarship supports meritorious and economically disadvantaged students.

Scholarship Amount: ₹50,000 per year (tuition fee + maintenance)
Eligibility:
- Pursuing 1st year of Degree/Diploma programs in AICTE approved institutions
- Family income below ₹8 lakh per annum
- Minimum CGPA: 7.0
- Financial need is required

Skills/Focus: Any technical discipline

Deadline: December 20, 2024

---------- Email 6 ----------
From: hackathon@devfolio.co
Subject: HackIndia 2024 – ₹30 Lakh Prize Pool

Hey Developer!

HackIndia 2024 is back with a massive ₹30 Lakh prize pool! This is India's largest student hackathon.

Track Options:
1. AI/ML Track
2. Web3/Blockchain
3. Sustainability Tech
4. FinTech Innovation

Requirements: Open to all students. No minimum CGPA.
Skills: React, Node.js, Python, Machine Learning, Blockchain, AI

Team Size: 2-4 members
Prize: ₹5,00,000 for winners (per track)

Deadline to Register: November 25, 2024
Event Date: December 1-2, 2024 (Virtual)

Register: hackindia.devfolio.co

---------- Email 7 ----------
From: newsletter@amazon.jobs
Subject: Amazon SDE Internship – Summer 2025

Hi,

Amazon is now accepting applications for our Software Development Engineer (SDE) Internship for Summer 2025.

About the Role:
- 3-month paid internship
- Stipend: ₹1,20,000/month
- Location: Bangalore or Hyderabad

Requirements:
- B.Tech/M.Tech in CS/IT/ECE
- Strong knowledge of Data Structures and Algorithms
- Proficient in Python, Java, or C++
- Minimum CGPA: 7.0

Apply by: December 5, 2024
Link: amazon.jobs/students

---------- Email 8 ----------
From: flash-sale@shopping-mart.com
Subject: SALE ALERT: 80% off everything! Limited time only!

Don't miss our MEGA FLASH SALE! 80% off on all electronics, fashion, and more!

Use code: MEGA80 at checkout.

Hurry, offer valid only for the next 2 hours!

Buy now: shop.totally-real-deals.com

---------- Email 9 ----------
From: research@iisc.ac.in
Subject: Summer Research Fellowship – Indian Academy of Sciences

Dear Student,

The Indian Academy of Sciences invites applications for the Summer Research Fellowship Programme 2025. This prestigious programme enables bright students to work with leading scientists at premier research institutions.

Duration: 2 months (May-June 2025)
Stipend: ₹10,000/month + travel allowance
Host Institutes: IISc, IITs, IISERs

Eligibility:
- Students with exceptional academic record
- Minimum CGPA: 8.0
- Skills Preferred: Python, Data Analysis, SQL, Statistics
- Financial need: preference given to deserving candidates

Deadline: January 31, 2025

Apply at: web-indacad.org/fellowship

---------- Email 10 ----------
From: careers@flipkart.com
Subject: Flipkart GRiD 5.0 – Engineering Challenge

Hello Developer,

Flipkart GRiD 5.0 is here! Compete with the best engineering minds across India and win exciting prizes.

Challenge Focus: AI-powered e-commerce solutions, supply chain optimization

Prize Pool: ₹15,00,000
Eligibility: B.Tech/M.Tech students (any CGPA)
Skills: Python, Machine Learning, React, SQL, Data Analysis

Registration Deadline: November 28, 2024
Competition Round 1: December 15, 2024

Register: unstop.com/flipkart-grid

`;

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'demo-1',
    title: 'DST INSPIRE Fellowship 2024',
    organization: 'Department of Science & Technology',
    type: 'fellowship',
    deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    stipend: '₹80,000/year + ₹20,000 contingency',
    min_cgpa: 8.0,
    keywords: ['Python', 'Machine Learning', 'Research Methodology', 'Data Analysis'],
    requires_financial_need: false,
    location: 'India (Various Institutes)',
    description: 'Prestigious fellowship for top science and technology students with exceptional academic records.',
    source_text: 'Minimum CGPA: 8.0\nStipend: ₹80,000 per year\nDeadline: December 15, 2024\nSkills Required: Python, Machine Learning, Research Methodology, Data Analysis',
    evidence_markers: [
      { field: 'deadline', text: 'December 15, 2024', start: 0, end: 18 },
      { field: 'stipend', text: '₹80,000 per year', start: 19, end: 37 },
      { field: 'min_cgpa', text: 'Minimum CGPA: 8.0', start: 38, end: 56 },
    ],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: true,
    is_spam: false,
    status: 'complete',
  },
  {
    id: 'demo-2',
    title: 'Google STEP Internship Summer 2025',
    organization: 'Google',
    type: 'internship',
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    stipend: '₹1,50,000/month + accommodation',
    min_cgpa: 7.5,
    keywords: ['Data Structures', 'Algorithms', 'Python', 'Problem Solving'],
    requires_financial_need: false,
    location: 'Bangalore (Hybrid)',
    description: 'Paid internship for 2nd and 3rd year undergraduate CS students.',
    source_text: 'Minimum CGPA: 7.5\nCompensation: ₹1,50,000/month\nDeadline: November 30, 2024\nLocation: Bangalore (Hybrid)',
    evidence_markers: [
      { field: 'deadline', text: 'November 30, 2024', start: 0, end: 18 },
      { field: 'stipend', text: '₹1,50,000/month', start: 19, end: 36 },
      { field: 'min_cgpa', text: 'Minimum CGPA: 7.5', start: 37, end: 55 },
    ],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: true,
    is_spam: false,
    status: 'complete',
  },
  {
    id: 'demo-3',
    title: 'Lucky Draw Scam – IGNORE',
    organization: 'Unknown',
    type: 'spam',
    deadline: null,
    stipend: '$5000 (SCAM)',
    min_cgpa: 0,
    keywords: [],
    requires_financial_need: false,
    location: 'Unknown',
    description: 'Spam email claiming prize winnings. Do not engage.',
    source_text: 'You have been selected as a winner of our international lucky draw.',
    evidence_markers: [],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: false,
    is_spam: true,
    status: 'complete',
  },
  {
    id: 'demo-4',
    title: 'Microsoft Research Fellowship 2024-25',
    organization: 'Microsoft Research India',
    type: 'fellowship',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    stipend: '₹60,000/month',
    min_cgpa: 8.5,
    keywords: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Research'],
    requires_financial_need: true,
    location: 'Hyderabad / Remote',
    description: 'Research fellowship for exceptional students in ML, NLP, and Systems.',
    source_text: 'Minimum CGPA: 8.5\nMonthly stipend: ₹60,000\nDeadline: January 10, 2025\nFinancial need-based preference will be given',
    evidence_markers: [
      { field: 'deadline', text: 'January 10, 2025', start: 0, end: 16 },
      { field: 'stipend', text: '₹60,000/month', start: 17, end: 31 },
      { field: 'min_cgpa', text: 'Minimum CGPA: 8.5', start: 32, end: 50 },
    ],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: false,
    is_spam: false,
    status: 'complete',
  },
  {
    id: 'demo-5',
    title: 'AICTE Pragati Scholarship',
    organization: 'AICTE',
    type: 'scholarship',
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    stipend: '₹50,000/year',
    min_cgpa: 7.0,
    keywords: ['Technical Education'],
    requires_financial_need: true,
    location: 'India',
    description: 'Scholarship for meritorious and economically disadvantaged technical students.',
    source_text: 'Scholarship Amount: ₹50,000 per year\nMinimum CGPA: 7.0\nDeadline: December 20, 2024\nFinancial need is required',
    evidence_markers: [
      { field: 'deadline', text: 'December 20, 2024', start: 0, end: 18 },
      { field: 'stipend', text: '₹50,000 per year', start: 19, end: 36 },
      { field: 'min_cgpa', text: 'Minimum CGPA: 7.0', start: 37, end: 55 },
    ],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: true,
    is_spam: false,
    status: 'complete',
  },
  {
    id: 'demo-6',
    title: 'HackIndia 2024 – ₹30 Lakh Prize Pool',
    organization: 'Devfolio',
    type: 'competition',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    stipend: '₹5,00,000 (winner prize)',
    min_cgpa: 0,
    keywords: ['React', 'Node.js', 'Python', 'Machine Learning', 'AI'],
    requires_financial_need: false,
    location: 'Virtual',
    description: "India's largest student hackathon with AI/ML, Web3, and FinTech tracks.",
    source_text: 'Open to all students. No minimum CGPA.\nSkills: React, Node.js, Python, Machine Learning\nDeadline: November 25, 2024\nPrize: ₹5,00,000',
    evidence_markers: [
      { field: 'deadline', text: 'November 25, 2024', start: 0, end: 18 },
      { field: 'stipend', text: '₹5,00,000', start: 19, end: 29 },
      { field: 'min_cgpa', text: 'No minimum CGPA', start: 30, end: 46 },
    ],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: true,
    is_spam: false,
    status: 'complete',
  },
  {
    id: 'demo-7',
    title: 'Amazon SDE Internship Summer 2025',
    organization: 'Amazon',
    type: 'internship',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    stipend: '₹1,20,000/month',
    min_cgpa: 7.0,
    keywords: ['Data Structures', 'Algorithms', 'Python', 'Java'],
    requires_financial_need: false,
    location: 'Bangalore / Hyderabad',
    description: '3-month paid SDE internship at Amazon for CS/IT/ECE students.',
    source_text: 'Minimum CGPA: 7.0\nStipend: ₹1,20,000/month\nDeadline: December 5, 2024\nLocation: Bangalore or Hyderabad',
    evidence_markers: [
      { field: 'deadline', text: 'December 5, 2024', start: 0, end: 16 },
      { field: 'stipend', text: '₹1,20,000/month', start: 17, end: 33 },
      { field: 'min_cgpa', text: 'Minimum CGPA: 7.0', start: 34, end: 52 },
    ],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: true,
    is_spam: false,
    status: 'complete',
  },
  {
    id: 'demo-8',
    title: 'Flash Sale Spam',
    organization: 'Unknown Retailer',
    type: 'spam',
    deadline: null,
    stipend: 'N/A',
    min_cgpa: 0,
    keywords: [],
    requires_financial_need: false,
    location: 'Unknown',
    description: 'Commercial spam email about a flash sale. Filtered out.',
    source_text: 'SALE ALERT: 80% off everything! Limited time only!',
    evidence_markers: [],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: false,
    is_spam: true,
    status: 'complete',
  },
  {
    id: 'demo-9',
    title: 'IAS Summer Research Fellowship 2025',
    organization: 'Indian Academy of Sciences',
    type: 'fellowship',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    stipend: '₹10,000/month + travel',
    min_cgpa: 8.0,
    keywords: ['Python', 'Data Analysis', 'SQL', 'Statistics'],
    requires_financial_need: false,
    location: 'IISc / IITs / IISERs',
    description: 'Prestigious summer research programme with leading scientists at premier institutions.',
    source_text: 'Minimum CGPA: 8.0\nStipend: ₹10,000/month + travel allowance\nDeadline: January 31, 2025\nPreferred: Python, Data Analysis, SQL',
    evidence_markers: [
      { field: 'deadline', text: 'January 31, 2025', start: 0, end: 16 },
      { field: 'stipend', text: '₹10,000/month + travel allowance', start: 17, end: 50 },
      { field: 'min_cgpa', text: 'Minimum CGPA: 8.0', start: 51, end: 69 },
    ],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: true,
    is_spam: false,
    status: 'complete',
  },
  {
    id: 'demo-10',
    title: 'Flipkart GRiD 5.0 Engineering Challenge',
    organization: 'Flipkart',
    type: 'competition',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    stipend: '₹15,00,000 (prize pool)',
    min_cgpa: 0,
    keywords: ['Python', 'Machine Learning', 'React', 'SQL', 'Data Analysis'],
    requires_financial_need: false,
    location: 'Virtual',
    description: 'National engineering competition focused on AI-powered e-commerce solutions.',
    source_text: 'Open to B.Tech/M.Tech students (any CGPA)\nSkills: Python, Machine Learning, React, SQL\nDeadline: November 28, 2024\nPrize Pool: ₹15,00,000',
    evidence_markers: [
      { field: 'deadline', text: 'November 28, 2024', start: 0, end: 18 },
      { field: 'stipend', text: '₹15,00,000 (prize pool)', start: 19, end: 42 },
      { field: 'min_cgpa', text: 'any CGPA', start: 43, end: 51 },
    ],
    score: 0,
    score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
    is_eligible: true,
    is_spam: false,
    status: 'complete',
  },
];
