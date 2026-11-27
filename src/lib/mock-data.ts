// Simple ID generator (replaces uuid dependency)
let _idCounter = 0;
const uuidv4 = () => `id_${Date.now()}_${++_idCounter}_${Math.random().toString(36).slice(2, 8)}`;

// Helper function to generate massive arrays
const generateArray = <T,>(length: number, generator: (index: number) => T): T[] => Array.from({ length }, (_, i) => generator(i));

// --- SKILLS (200+) ---
const categories = ['hard_skill', 'soft_skill', 'tool', 'technology', 'certification'];
const baseSkills = [
  "Python", "JavaScript", "React", "Node.js", "Java", "SQL", "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "FastAPI", "Django", "TensorFlow", "PyTorch", "Generative AI", "LLMs", "Prompt Engineering", "RAG", "Vector Databases", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Analytics", "Power BI", "Tableau", "Excel", "Hadoop", "Spark", "Kafka", "Git", "Jenkins", "CI/CD", "Agile", "Scrum", "Communication", "Leadership", "Problem Solving", "Critical Thinking", "Teamwork", "CNC Programming", "PLC Programming", "AutoCAD", "SolidWorks", "IoT", "Embedded Systems", "5G", "Cybersecurity", "Ethical Hacking", "Blockchain", "Cloud Computing", "DevOps", "Microservices", "REST APIs", "GraphQL", "HTML", "CSS", "Tailwind CSS", "TypeScript", "Angular", "Vue.js", "Flutter", "React Native", "Swift", "Kotlin", "C++", "C#", ".NET", "Ruby", "Go", "Rust", "Scala", "R", "MATLAB", "SAP", "Salesforce", "ServiceNow", "Tally", "GST", "Financial Analysis", "Digital Marketing", "SEO", "Content Marketing", "Social Media Marketing", "Graphic Design", "UI/UX Design", "Figma", "Adobe Creative Suite", "Video Editing", "Animation", "3D Modeling", "EV Technology", "Solar Energy", "Wind Energy", "Battery Technology", "Welding", "Plumbing", "Electrical Wiring", "HVAC", "Carpentry", "Nursing", "Pharmacy", "Medical Lab Technology", "Radiology", "Physiotherapy", "Agriculture Technology", "Drone Technology", "Precision Farming", "Food Processing", "Supply Chain Management", "Warehouse Management", "Logistics Planning"
];

// Fill up to 200 skills by appending variations
export const skills = generateArray(200, (i) => {
  const name = i < baseSkills.length ? baseSkills[i] : `${baseSkills[i % baseSkills.length]} Advanced ${Math.floor(i / baseSkills.length)}`;
  return {
    id: `skill-${i+1}`,
    name,
    category: categories[i % categories.length],
    description: `Expertise in ${name} and related methodologies.`,
    demandScore: Math.floor(Math.random() * 40) + 60, // 60-100
    growthRate: Math.floor(Math.random() * 30) - 5, // -5 to +25
    demandLevel: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low',
    relatedOccupations: [`occ-${(i % 40) + 1}`, `occ-${((i + 5) % 40) + 1}`],
    relatedCourses: [`course-${(i % 20) + 1}`]
  };
});

// --- EMPLOYERS (25+) ---
const employerNames = ["TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", "Cognizant", "Accenture India", "IBM India", "Google India", "Microsoft India", "Amazon India", "Flipkart", "Reliance Industries", "Tata Motors", "Mahindra & Mahindra", "Larsen & Toubro", "Bajaj Auto", "Maruti Suzuki", "HDFC Bank", "ICICI Bank", "SBI", "Jio", "Ola", "Swiggy", "Zomato"];
const sectorsList = ["IT Services", "Technology", "E-commerce", "Manufacturing", "Automotive", "Banking", "Telecommunications", "Food Delivery"];

export const employers = employerNames.map((name, i) => ({
  id: `emp-${i+1}`,
  name,
  sector: sectorsList[i % sectorsList.length],
  location: i % 2 === 0 ? "Bengaluru" : i % 3 === 0 ? "Mumbai" : "Delhi",
  size: "10000+",
  hiringDemand: "High",
  satisfactionScore: (Math.random() * 2 + 3).toFixed(1) // 3.0 to 5.0
}));

// --- OCCUPATIONS (40+) ---
const occupationTitles = ["Software Developer", "Data Analyst", "Cloud Engineer", "AI/ML Engineer", "Full Stack Developer", "DevOps Engineer", "Cybersecurity Analyst", "UI/UX Designer", "Data Scientist", "Mobile App Developer", "Database Administrator", "Network Engineer", "EV Technician", "Solar Panel Installer", "CNC Operator", "Welding Technician", "Electrician", "Plumber", "Nurse", "Lab Technician", "Pharmacist", "Digital Marketing Executive", "Financial Analyst", "Supply Chain Manager", "Warehouse Supervisor", "Quality Control Inspector", "Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Automotive Technician", "HVAC Technician", "Graphic Designer", "Content Writer", "HR Executive", "Project Manager", "Business Analyst", "Product Manager", "Scrum Master", "Test Engineer", "Embedded Systems Engineer"];

export const occupations = occupationTitles.map((title, i) => ({
  id: `occ-${i+1}`,
  title,
  sector: sectorsList[i % sectorsList.length],
  averageSalary: `${Math.floor(Math.random() * 10) + 3} LPA`
}));

// --- JOBS (120+) ---
const locations = ["Bengaluru Urban", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
export const jobs = generateArray(125, (i) => {
  const emp = employers[i % employers.length];
  const occ = occupations[i % occupations.length];
  return {
    id: `job-${i+1}`,
    employerId: emp.id,
    employerName: emp.name,
    occupationId: occ.id,
    title: occ.title,
    description: `We are looking for a skilled ${occ.title} to join our team.`,
    location: locations[i % locations.length],
    district: locations[i % locations.length],
    state: "Various",
    salaryBand: occ.averageSalary,
    skills: [skills[i % skills.length].name, skills[(i+1) % skills.length].name],
    postedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    source: i % 2 === 0 ? "NCS Jobs" : "Direct",
    sector: occ.sector
  };
});

// --- INSTITUTES (12+) ---
const instituteNames = ["National Skill Training Institute Bengaluru", "ITI Pusa Delhi", "NIFT Mumbai", "NIELIT Calicut", "IIT Madras Skill Development", "Tata STRIVE Pune", "L&T Construction Skills Academy", "NSDC Partner Institute Hyderabad", "Don Bosco Tech Guwahati", "IL&FS Skills Lucknow", "National Institute of Technology Bengaluru", "Skill India Centre Chennai"];
export const institutes = instituteNames.map((name, i) => ({
  id: `inst-${i+1}`,
  name,
  location: locations[i % locations.length],
  rating: (Math.random() * 1.5 + 3.5).toFixed(1)
}));

// --- COURSES (20+) ---
const courseNames = ["Full Stack Web Development", "Data Analytics", "Cloud Computing Fundamentals", "AI & Machine Learning", "Cybersecurity", "Digital Marketing", "Mobile App Development", "DevOps Engineering", "EV Technology", "Solar Energy Technology", "CNC Machine Operation", "Welding Technology", "Electrical Installation", "Plumbing Technology", "Nursing Assistant", "Medical Lab Technology", "Hospitality Management", "Retail Management", "Banking & Financial Services", "Automotive Technology"];
export const courses = courseNames.map((name, i) => {
  const inst = institutes[i % institutes.length];
  return {
    id: `course-${i+1}`,
    instituteId: inst.id,
    instituteName: inst.name,
    name,
    description: `Learn comprehensive skills in ${name} and prepare for a successful career.`,
    sector: sectorsList[i % sectorsList.length],
    duration: `${(i % 6) * 2 + 2} weeks`,
    healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
    healthLevel: i % 4 === 0 ? "Excellent" : i % 4 === 1 ? "Good" : "Average",
    healthBreakdown: { completion: 85, placement: 70, satisfaction: 90, relevance: 88, attendance: 92, trainerQuality: 85 },
    enrolledCount: Math.floor(Math.random() * 500) + 100,
    completedCount: Math.floor(Math.random() * 400) + 50,
    placedCount: Math.floor(Math.random() * 300) + 20
  };
});

// --- DISTRICTS (30+) ---
const districtNames = ["Bengaluru Urban", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi", "Coimbatore", "Vizag (Visakhapatnam)", "Indore", "Bhopal", "Nagpur", "Vadodara", "Gurgaon", "Noida", "Thiruvananthapuram", "Mysuru", "Surat", "Rajkot", "Bhubaneswar", "Guwahati", "Patna", "Ranchi", "Dehradun", "Raipur"];
export const districts = districtNames.map((name, i) => ({
  id: `dist-${i+1}`,
  name,
  latitude: 20 + (i * 0.1),
  longitude: 78 + (i * 0.1),
  topSkills: [skills[i % skills.length].name, skills[(i+2) % skills.length].name],
  topOccupations: [occupations[i % occupations.length].title],
  emergingSkills: [skills[(i+5) % skills.length].name],
  decliningSkills: [skills[(i+10) % skills.length].name],
  placementRate: Math.floor(Math.random() * 40) + 50, // 50-90%
  trainingSupply: Math.floor(Math.random() * 5000) + 1000,
  labourDemand: Math.floor(Math.random() * 6000) + 2000,
  skillGaps: ["Cloud Computing", "AI/ML"]
}));

// --- CANDIDATES (100+) ---
const statuses = ['employed', 'self_employed', 'apprenticeship', 'seeking', 'placed', 'unknown'];
export const candidates = generateArray(100, (i) => {
  const statusDist = Math.random();
  let status = 'unknown';
  if (statusDist < 0.55) status = 'employed';
  else if (statusDist < 0.65) status = 'self_employed';
  else if (statusDist < 0.70) status = 'apprenticeship';
  else if (statusDist < 0.85) status = 'seeking';
  else if (statusDist < 0.95) status = 'placed';

  return {
    id: `cand-${i+1}`,
    name: `Candidate ${i+1}`, // Will be anonymized in API
    age: Math.floor(Math.random() * 20) + 18,
    gender: i % 2 === 0 ? "Male" : "Female",
    district: districtNames[i % districtNames.length],
    skills: [skills[i % skills.length].name, skills[(i+3) % skills.length].name],
    courses: [courses[i % courses.length].id],
    certifications: [skills[(i+1) % skills.length].name + " Certified"],
    employmentStatus: status
  };
});

// --- EMPLOYMENT OUTCOMES (80+) ---
export const employmentOutcomes = generateArray(85, (i) => ({
  id: `outcome-${i+1}`,
  candidateId: candidates[i].id,
  employerId: employers[i % employers.length].id,
  jobId: jobs[i].id,
  wageBand: `${Math.floor(Math.random() * 5) + 3} - ${Math.floor(Math.random() * 5) + 8} LPA`,
  retentionMonths: Math.floor(Math.random() * 24),
  trainingRelevanceScore: Math.floor(Math.random() * 5) + 1
}));

// --- PLACEMENTS (70+) ---
export const placements = generateArray(75, (i) => ({
  id: `placement-${i+1}`,
  candidateId: candidates[i].id,
  jobId: jobs[i % jobs.length].id,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  salary: `${Math.floor(Math.random() * 5) + 3} LPA`
}));

// --- FOLLOW-UPS (50+) ---
export const followUps = generateArray(55, (i) => ({
  id: `followup-${i+1}`,
  candidateId: candidates[i].id,
  status: i % 2 === 0 ? "Contacted" : "Unreachable",
  notes: "Follow up regarding recent placement.",
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));

// --- EMPLOYER FEEDBACK (40+) ---
export const employerFeedback = generateArray(45, (i) => ({
  id: `feedback-${i+1}`,
  employerId: employers[i % employers.length].id,
  rating: Math.floor(Math.random() * 5) + 1,
  comments: "Candidates possess good foundational knowledge but need more practical experience.",
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));

// --- TRAINERS (15+) ---
export const trainers = generateArray(18, (i) => ({
  id: `trainer-${i+1}`,
  name: `Trainer ${i+1}`,
  instituteId: institutes[i % institutes.length].id,
  skillProfile: [skills[i % skills.length].name, skills[(i+2) % skills.length].name],
  skillGaps: [skills[(i+5) % skills.length].name],
  rating: (Math.random() * 1.5 + 3.5).toFixed(1)
}));

// --- EQUIPMENT (30+) ---
export const equipment = generateArray(35, (i) => ({
  id: `eq-${i+1}`,
  name: `Equipment Item ${i+1}`,
  instituteId: institutes[i % institutes.length].id,
  availability: i % 4 === 0 ? "In Use" : i % 5 === 0 ? "Maintenance" : "Available",
  condition: i % 5 === 0 ? "Needs Repair" : "Good"
}));

// --- RECOMMENDATIONS (25+) ---
const recommendationCategories = ["curriculum", "trainer", "equipment", "district", "candidate"];
export const recommendations = generateArray(28, (i) => ({
  id: `rec-${i+1}`,
  category: recommendationCategories[i % recommendationCategories.length],
  title: `Improvement needed for ${recommendationCategories[i % recommendationCategories.length]}`,
  description: `Data indicates a need to update the ${recommendationCategories[i % recommendationCategories.length]} based on recent industry feedback.`,
  evidence: "Based on 30+ employer feedback records.",
  confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
  priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
  validationStatus: i % 2 === 0 ? "Validated" : "Pending"
}));

// --- KAIZEN CYCLES (3+) ---
export const kaizenCycles = [
  { id: "kz-1", cycle: "Q1 2026", improvements: "Updated curriculum for AI/ML", actions: "Trained 5 instructors", outcomes: "Placement rate increased by 15%" },
  { id: "kz-2", cycle: "Q2 2026", improvements: "Procured new CNC machines", actions: "Installed at 3 institutes", outcomes: "Practical test scores improved by 20%" },
  { id: "kz-3", cycle: "Q3 2026", improvements: "Launched soft skills bootcamp", actions: "Mandatory for all IT courses", outcomes: "Employer satisfaction score increased by 0.5" }
];

// --- DATA SOURCES (8+) ---
export const dataSources = ["NCS Jobs", "Employer Surveys", "Institute Records", "Placement Data", "NSDC Database", "Industry Reports", "Candidate Records", "Follow-Up System"];

export const analyticsData = {
  totalJobs: 12500,
  activeCandidates: 45000,
  placements: 8500,
  placementRate: 68,
  placementFunnel: [
    { stage: 'Enrolled', count: 10000 },
    { stage: 'Completed', count: 8500 },
    { stage: 'Interviewed', count: 7000 },
    { stage: 'Placed', count: 6800 }
  ],
  wageProgression: [
    { year: 2023, average: 3.5 },
    { year: 2024, average: 4.2 },
    { year: 2025, average: 5.0 },
    { year: 2026, average: 5.8 }
  ],
  nonPlacementReasons: [
    { reason: "Higher Education", percentage: 35 },
    { reason: "Self Employed", percentage: 25 },
    { reason: "Personal Reasons", percentage: 20 },
    { reason: "Seeking Better Offers", percentage: 15 },
    { reason: "Other", percentage: 5 }
  ]
};
