import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIRST_NAMES = [
    'Aaliyah', 'Aaron', 'Abigail', 'Adam', 'Adrian', 'Aiden', 'Alex', 'Alexander', 'Alexis', 'Alice',
    'Alina', 'Amara', 'Amber', 'Amelia', 'Andrew', 'Angel', 'Anna', 'Anthony', 'Aria', 'Ariana',
    'Asher', 'Ashley', 'Austin', 'Ava', 'Benjamin', 'Blake', 'Bradley', 'Brandon', 'Brianna', 'Brooke',
    'Caleb', 'Cameron', 'Carlos', 'Caroline', 'Carter', 'Chloe', 'Christian', 'Claire', 'Colin', 'Connor',
    'Daniel', 'David', 'Derek', 'Dominic', 'Dylan', 'Elena', 'Eli', 'Elijah', 'Elizabeth', 'Ella',
    'Emily', 'Emma', 'Ethan', 'Eva', 'Evan', 'Evelyn', 'Felix', 'Gabriel', 'Grace', 'Hailey',
    'Hannah', 'Harper', 'Henry', 'Hunter', 'Ian', 'Isaac', 'Isabella', 'Isaiah', 'Jack', 'Jackson',
    'Jacob', 'James', 'Jasmine', 'Jason', 'Jayden', 'Jordan', 'Joseph', 'Joshua', 'Julia', 'Justin',
    'Kai', 'Kayla', 'Kendra', 'Kevin', 'Kira', 'Landon', 'Laura', 'Layla', 'Leo', 'Liam',
    'Lily', 'Logan', 'Lucas', 'Lucy', 'Luke', 'Madeline', 'Marcus', 'Mason', 'Maya', 'Mia',
    'Michael', 'Mila', 'Miles', 'Naomi', 'Nathan', 'Nicholas', 'Noah', 'Nolan', 'Nora', 'Oliver',
    'Olivia', 'Owen', 'Paige', 'Penelope', 'Quinn', 'Rachel', 'Riley', 'Ryan', 'Samantha', 'Samuel',
    'Sarah', 'Sebastian', 'Sienna', 'Sophia', 'Thomas', 'Tyler', 'Victoria', 'Wyatt', 'Xavier', 'Zoe'
];
const LAST_NAMES = [
    'Adams', 'Alexander', 'Allen', 'Anderson', 'Armstrong', 'Bailey', 'Baker', 'Barnes', 'Bell', 'Bennett',
    'Black', 'Bowen', 'Boyd', 'Brooks', 'Brown', 'Burns', 'Butler', 'Campbell', 'Carter', 'Chapman',
    'Clark', 'Cole', 'Coleman', 'Collins', 'Cook', 'Cooper', 'Cox', 'Crawford', 'Cruz', 'Cunningham',
    'Daniels', 'Davies', 'Davis', 'Diaz', 'Dixon', 'Edwards', 'Ellis', 'Evans', 'Ferguson', 'Fisher',
    'Flores', 'Ford', 'Foster', 'Fox', 'Garcia', 'Gibson', 'Gomez', 'Gonzales', 'Gordon', 'Graham',
    'Grant', 'Gray', 'Green', 'Griffin', 'Hall', 'Hamilton', 'Harris', 'Harrison', 'Hayes', 'Henderson',
    'Hernandez', 'Hill', 'Holmes', 'Howard', 'Hughes', 'Hunt', 'Hunter', 'Jackson', 'James', 'Jenkins',
    'Johnson', 'Jones', 'Jordan', 'Kelly', 'Kennedy', 'King', 'Knight', 'Lambert', 'Lane', 'Lawrence',
    'Lee', 'Lewis', 'Long', 'Lopez', 'Marshall', 'Martin', 'Mason', 'Matthews', 'Miller', 'Mitchell',
    'Moore', 'Morgan', 'Morris', 'Murphy', 'Myers', 'Nelson', 'Nguyen', 'Nichols', 'Oliver', 'Palmer',
    'Parker', 'Patterson', 'Perez', 'Perry', 'Peterson', 'Phillips', 'Powell', 'Price', 'Ramirez', 'Reed',
    'Reynolds', 'Richardson', 'Rivera', 'Roberts', 'Robertson', 'Robinson', 'Rodriguez', 'Rogers', 'Ross', 'Russell',
    'Sanchez', 'Sanders', 'Scott', 'Shaw', 'Simmons', 'Simpson', 'Smith', 'Snyder', 'Stephens', 'Stewart',
    'Sullivan', 'Taylor', 'Thomas', 'Thompson', 'Torres', 'Tucker', 'Turner', 'Walker', 'Wallace', 'Ward',
    'Washington', 'Watson', 'Webb', 'Wells', 'West', 'White', 'Williams', 'Wilson', 'Wood', 'Wright', 'Young'
];
const CITIES = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
    'Denver, CO', 'Chicago, IL', 'Toronto, ON', 'Vancouver, BC', 'London, UK',
    'Berlin, DE', 'Amsterdam, NL', 'Sydney, AU', 'Atlanta, GA', 'Portland, OR',
    'San Diego, CA', 'Los Angeles, CA', 'Miami, FL', 'Salt Lake City, UT', 'Raleigh, NC',
    'Dallas, TX', 'Phoenix, AZ', 'Minneapolis, MN', 'Boulder, CO', 'Pittsburgh, PA'
];
const SKILLS_POOL = [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS', 'Docker',
    'Kubernetes', 'Go', 'Python', 'AWS', 'Rust', 'Redis', 'Kafka', 'GCP', 'Linux',
    'MongoDB', 'Elasticsearch', 'CI/CD', 'Jest', 'Playwright', 'Terraform', 'WebSockets', 'gRPC',
    'Microservices', 'FastAPI', 'Vite', 'TanStack Query', 'Express', 'Prisma', 'Drizzle',
    'Remix', 'Supabase', 'Cypress', 'RabbitMQ', 'Snowflake', 'DynamoDB', 'OAuth2', 'WebAssembly'
];
function generateUsers(count) {
    console.log(`Generating ${count} user records with pre-joined skillsLabel...`);
    const users = new Array(count);
    // Deterministic PRNG for reproducibility
    let seed = 42;
    function random() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    }
    const startDate = new Date(2023, 0, 1).getTime();
    const endDate = new Date(2026, 10, 1).getTime();
    for (let i = 0; i < count; i++) {
        const fn = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
        const ln = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
        const name = `${fn} ${ln}`;
        const age = Math.floor(random() * 48) + 20; // 20 - 68
        const location = CITIES[Math.floor(random() * CITIES.length)];
        // Select 3 to 5 random unique skills
        const numSkills = Math.floor(random() * 3) + 3;
        const skillsSet = new Set();
        while (skillsSet.size < numSkills) {
            skillsSet.add(SKILLS_POOL[Math.floor(random() * SKILLS_POOL.length)]);
        }
        // Pre-join into single flat label for zero runtime allocation
        const skillsLabel = Array.from(skillsSet).join(' • ');
        const randomTimestamp = startDate + random() * (endDate - startDate);
        const createdAt = new Date(randomTimestamp).toISOString().split('T')[0];
        const padId = String(i + 1).padStart(5, '0');
        users[i] = {
            id: `usr-${padId}`,
            name,
            age,
            location,
            skillsLabel,
            avatarSeed: `${fn.toLowerCase()}-${ln.toLowerCase()}`,
            createdAt
        };
    }
    return users;
}
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
const outputPath = path.resolve(dataDir, 'users.json');
const users = generateUsers(50000);
console.log(`Writing dataset to ${outputPath}...`);
fs.writeFileSync(outputPath, JSON.stringify(users), 'utf-8');
const fileSizeMB = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);
console.log(`Successfully generated 50,000 records (${fileSizeMB} MB) at ${outputPath}`);
