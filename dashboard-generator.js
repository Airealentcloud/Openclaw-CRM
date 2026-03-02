#!/usr/bin/env node

/**
 * Airealent Analytics Dashboard Generator
 * Creates a comprehensive HTML dashboard for tracking:
 * - Backlink outreach progress
 * - Content calendar & SEO gaps
 * - Lead generation metrics
 * - Competitor gap opportunities
 * 
 * Usage: node dashboard-generator.js [--output <path>]
 */

const fs = require('fs');
const path = require('path');

// Parse CLI arguments
const args = process.argv.slice(2);
let outputPath = path.join(__dirname, 'airealent-dashboard.html');

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' || args[i] === '-o') {
        outputPath = args[++i];
    }
    if (args[i] === '--help' || args[i] === '-h') {
        console.log(`Airealent Dashboard Generator v1.0.0
Usage: node dashboard-generator.js [options]

Options:
  --output, -o <path>  Output HTML file path (default: airealent-dashboard.html)
  --help, -h           Show this help
`);
        process.exit(0);
    }
}

// Backlink outreach data from tracker
const backlinkStats = {
    total: 226,
    outreachSent: 72,
    emailFound: 9,
    formSubmitted: 1,
    pending: 144,
    byCategory: {
        'Guest Post': 95,
        'Directory': 35,
        'Resource': 31,
        'Partnership/Collaboration': 1
    },
    byTarget: {
        'airealent.ng': 168,
        'housesforsaleinabuja.com': 29,
        'landforsaleinabuja.com': 28,
        'mynigeriabusiness.ng': 3,
        '9jadirectory.org': 3
    }
};

// Content gap opportunities from competitor analysis
const contentOpportunities = [
    {
        category: 'Area Guides',
        priority: 'High',
        keywords: ['Maitama', 'Asokoro', 'Katampe', 'Jahi', 'Gwarinpa', 'Jabi', 'Wuse', 'Life Camp', 'Apo', 'Lokogoma'],
        competitorsMissing: ['PrivateProperty', 'PropertyPro', 'NigeriaPropertyCentre'],
        estimatedValue: 'High search volume, low competition'
    },
    {
        category: 'Buying Process Education',
        priority: 'High',
        keywords: ['how to buy property in Abuja', 'property verification Abuja', 'C-of-O verification', 'land titles Abuja'],
        competitorsMissing: ['All major portals lack detailed guides'],
        estimatedValue: 'High intent, establishes authority'
    },
    {
        category: 'Fraud Prevention',
        priority: 'High',
        keywords: ['property scams Abuja', 'fake listings', 'verify property agent'],
        competitorsMissing: ['Villa Afrika limited coverage'],
        estimatedValue: 'Builds trust, differentiator'
    },
    {
        category: 'Investment Analysis',
        priority: 'Medium',
        keywords: ['rental yield Abuja', 'best areas to invest', 'property appreciation'],
        competitorsMissing: ['Estate Intel (paid), others lack'],
        estimatedValue: 'Investor audience, high value'
    },
    {
        category: 'First-Time Buyer',
        priority: 'Medium',
        keywords: ['first home Abuja', 'budget planning', 'hidden costs'],
        competitorsMissing: ['General content only'],
        estimatedValue: 'Large segment, loyalty building'
    }
];

// SEO priorities based on indexing fix plan
const seoPriorities = [
    { task: 'Disable thin Polylang translations', status: 'pending', impact: 'High', effort: 'Low' },
    { task: 'Clean up robots.txt', status: 'pending', impact: 'High', effort: 'Low' },
    { task: 'Regenerate sitemap', status: 'pending', impact: 'Medium', effort: 'Low' },
    { task: 'Reassign Uncategorized posts', status: 'pending', impact: 'Medium', effort: 'Medium' },
    { task: 'Add internal links to top 50 pages', status: 'pending', impact: 'High', effort: 'High' },
    { task: 'Create 10 location guides', status: 'pending', impact: 'High', effort: 'High' },
    { task: 'Create 10 property type guides', status: 'pending', impact: 'Medium', effort: 'High' },
    { task: 'Request indexing for money pages', status: 'pending', impact: 'High', effort: 'Low' }
];

// Generate content calendar for March 2026
const generateContentCalendar = () => {
    const now = new Date('2026-03-01');
    const calendar = [];
    
    const topics = [
        // Week 1: Foundation + Trust Building
        { date: '2026-03-02', topic: 'How to Verify Land Titles in Abuja: Complete C-of-O Guide', type: 'Blog', platform: 'Website/SEO', funnel: 'Awareness', keywords: 'C-of-O verification, land titles Abuja' },
        { date: '2026-03-03', topic: 'Top 5 Property Scams in Abuja (And How to Avoid Them)', type: 'Video', platform: 'TikTok/YouTube', funnel: 'Awareness', keywords: 'property scams Abuja' },
        { date: '2026-03-05', topic: 'Living in Maitama: Abuja\'s Premier Residential District', type: 'Blog', platform: 'Website/SEO', funnel: 'Interest', keywords: 'Maitama Abuja, luxury homes Maitama' },
        { date: '2026-03-06', topic: 'Luxury Tour: Maitama Mansion Showcase', type: 'Reel', platform: 'Instagram/TikTok', funnel: 'Interest', keywords: 'luxury homes Abuja' },
        
        // Week 2: Area Guides
        { date: '2026-03-09', topic: 'Asokoro vs Katampe: Which Area is Right for You?', type: 'Blog', platform: 'Website/SEO', funnel: 'Consideration', keywords: 'Asokoro Abuja, Katampe Abuja' },
        { date: '2026-03-10', topic: 'Driving Tour: Best Streets in Asokoro', type: 'Video', platform: 'YouTube', funnel: 'Interest', keywords: 'Asokoro Abuja' },
        { date: '2026-03-12', topic: 'Gwarinpa: Nigeria\'s Largest Estate - Complete Guide', type: 'Blog', platform: 'Website/SEO', funnel: 'Interest', keywords: 'Gwarinpa Abuja, houses Gwarinpa' },
        { date: '2026-03-13', topic: 'Budget Buy: Affordable Homes in Gwarinpa', type: 'Reel', platform: 'Instagram/TikTok', funnel: 'Consideration', keywords: 'affordable homes Abuja' },
        
        // Week 3: Trust + First-Time Buyers
        { date: '2026-03-16', topic: 'First-Time Buyer Checklist: Abuja Edition', type: 'Guide', platform: 'Website/Lead Magnet', funnel: 'Lead Gen', keywords: 'first home Abuja, buying guide' },
        { date: '2026-03-17', topic: 'What N20 Million Gets You in Different Abuja Areas', type: 'Video', platform: 'TikTok/YouTube', funnel: 'Interest', keywords: 'property prices Abuja' },
        { date: '2026-03-19', topic: 'Jahi: The Fast-Growing Family District', type: 'Blog', platform: 'Website/SEO', funnel: 'Interest', keywords: 'Jahi Abuja, family homes Jahi' },
        { date: '2026-03-20', topic: 'Jahi Property Showcase: Modern Family Homes', type: 'Reel', platform: 'Instagram/TikTok', funnel: 'Consideration', keywords: 'family homes Abuja' },
        
        // Week 4: Investment + Conversion
        { date: '2026-03-23', topic: 'Best Areas for Rental Yield in Abuja 2026', type: 'Blog', platform: 'Website/SEO', funnel: 'Consideration', keywords: 'rental yield Abuja, investment' },
        { date: '2026-03-24', topic: 'Investor\'s Guide: Off-Plan vs Completed Properties', type: 'Guide', platform: 'Website/Lead Magnet', funnel: 'Lead Gen', keywords: 'property investment Abuja' },
        { date: '2026-03-26', topic: 'Lokogoma: The Hidden Gem for Smart Investors', type: 'Blog', platform: 'Website/SEO', funnel: 'Consideration', keywords: 'Lokogoma Abuja, invest Abuja' },
        { date: '2026-03-27', topic: 'Client Story: From Search to Keys in 30 Days', type: 'Video', platform: 'YouTube/Instagram', funnel: 'Conversion', keywords: 'Abuja real estate agent' },
        
        // Recurring
        { date: '2026-03-30', topic: 'March Market Update: Abuja Real Estate Trends', type: 'Newsletter', platform: 'Email/LinkedIn', funnel: 'Retention', keywords: 'Abuja property market' }
    ];
    
    return topics;
};

// Lead tracking metrics
const leadMetrics = {
    sources: {
        'Organic Search': { leads: 12, conversion: '3.2%', status: 'active' },
        'Social Media': { leads: 8, conversion: '1.8%', status: 'active' },
        'Referrals': { leads: 5, conversion: '12%', status: 'active' },
        'Directories': { leads: 2, conversion: '2%', status: 'growing' }
    },
    stages: {
        'Inquiry': 27,
        'Qualified': 18,
        'Viewing Scheduled': 12,
        'Offer Made': 5,
        'Closed': 2
    }
};

// Calculate completion stats
const calculateProgress = () => {
    const total = seoPriorities.length;
    const completed = seoPriorities.filter(p => p.status === 'done').length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
};

// Generate HTML dashboard
const generateDashboard = () => {
    const contentCalendar = generateContentCalendar();
    const progress = calculateProgress();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Airealent Analytics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            line-height: 1.6;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        header {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        h1 { font-size: 2rem; margin-bottom: 10px; }
        .subtitle { opacity: 0.9; font-size: 1.1rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card {
            background: #1e293b;
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #334155;
        }
        .card h2 {
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            margin-bottom: 12px;
        }
        .metric { font-size: 2.5rem; font-weight: 700; color: #3b82f6; }
        .metric-success { color: #22c55e; }
        .metric-warning { color: #f59e0b; }
        .metric-danger { color: #ef4444; }
        .trend { font-size: 0.875rem; margin-top: 8px; }
        .trend-up { color: #22c55e; }
        .trend-down { color: #ef4444; }
        .chart-container {
            background: #1e293b;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 30px;
            border: 1px solid #334155;
        }
        .chart-container h2 {
            margin-bottom: 20px;
            font-size: 1.25rem;
        }
        .chart-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
        }
        .table-container {
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #334155;
        }
        th { color: #94a3b8; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; }
        tr:hover { background: #334155; }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .badge-high { background: #dc2626; color: white; }
        .badge-medium { background: #f59e0b; color: black; }
        .badge-low { background: #16a34a; color: white; }
        .badge-pending { background: #475569; color: white; }
        .badge-done { background: #16a34a; color: white; }
        .progress-bar {
            background: #334155;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 12px;
        }
        .progress-fill {
            background: linear-gradient(90deg, #3b82f6, #22c55e);
            height: 100%;
            transition: width 0.3s ease;
        }
        .insight-box {
            background: linear-gradient(135deg, #1e3a5f, #1e40af);
            border-radius: 8px;
            padding: 16px;
            margin-top: 16px;
            font-size: 0.9rem;
        }
        .action-list {
            list-style: none;
        }
        .action-list li {
            padding: 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .action-list li:before {
            content: "→";
            color: #3b82f6;
        }
        .date-badge {
            display: inline-block;
            padding: 4px 8px;
            background: #3b82f6;
            color: white;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 8px;
        }
        .platform-tag {
            display: inline-block;
            padding: 2px 6px;
            background: #475569;
            border-radius: 3px;
            font-size: 0.7rem;
            margin-left: 8px;
        }
        .funnel-tag {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.7rem;
            margin-left: 8px;
        }
        .funnel-awareness { background: #3b82f6; }
        .funnel-interest { background: #06b6d4; }
        .funnel-consideration { background: #f59e0b; }
        .funnel-conversion { background: #22c55e; }
        .funnel-retention { background: #8b5cf6; }
        .funnel-leadgen { background: #ec4899; }
        footer {
            text-align: center;
            padding: 30px;
            color: #64748b;
            font-size: 0.875rem;
        }
        .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        @media (max-width: 768px) {
            .two-col { grid-template-columns: 1fr; }
            .chart-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🏠 Airealent Analytics Dashboard</h1>
            <p class="subtitle">Real-time insights for Abuja's premier real estate agency</p>
            <p style="margin-top: 10px; opacity: 0.8;">Generated: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <!-- Key Metrics -->
        <div class="grid">
            <div class="card">
                <h2>🔗 Backlink Outreach</h2>
                <div class="metric">${backlinkStats.outreachSent}/${backlinkStats.total}</div>
                <div class="trend trend-up">↑ ${Math.round((backlinkStats.outreachSent / backlinkStats.total) * 100)}% completion</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(backlinkStats.outreachSent / backlinkStats.total) * 100}%"></div>
                </div>
            </div>
            <div class="card">
                <h2>📧 Emails Found</h2>
                <div class="metric metric-success">${backlinkStats.emailFound}</div>
                <div class="trend">Ready for outreach</div>
            </div>
            <div class="card">
                <h2>📝 Content Opportunities</h2>
                <div class="metric metric-warning">${contentOpportunities.length} gaps</div>
                <div class="trend">High-priority: ${contentOpportunities.filter(o => o.priority === 'High').length}</div>
            </div>
            <div class="card">
                <h2>⚡ SEO Tasks</h2>
                <div class="metric metric-danger">${progress.total - progress.completed}</div>
                <div class="trend">Pending tasks</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                </div>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="chart-grid">
            <div class="chart-container">
                <h2>Backlink Progress by Category</h2>
                <canvas id="backlinkChart" width="400" height="300"></canvas>
            </div>
            <div class="chart-container">
                <h2>Lead Pipeline Stages</h2>
                <canvas id="leadChart" width="400" height="300"></canvas>
            </div>
        </div>

        <!-- Content Calendar -->
        <div class="chart-container">
            <h2>📅 March 2026 Content Calendar</h2>
            <p style="margin-bottom: 20px; color: #94a3b8;">Auto-generated based on keyword gaps and competitor analysis</p>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Topic</th>
                            <th>Type</th>
                            <th>Platform</th>
                            <th>Funnel Stage</th>
                            <th>Target Keywords</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contentCalendar.map(item => `
                        <tr>
                            <td><span class="date-badge">${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></td>
                            <td><strong>${item.topic}</strong></td>
                            <td>${item.type}</td>
                            <td><span class="platform-tag">${item.platform}</span></td>
                            <td><span class="funnel-tag funnel-${item.funnel.toLowerCase().replace(/\s+/g, '')}">${item.funnel}</span></td>
                            <td><code style="background: #334155; padding: 2px 6px; border-radius: 3px; font-size: 0.75rem;">${item.keywords}</code></td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Two Column Layout -->
        <div class="two-col">
            <!-- SEO Priorities -->
            <div class="chart-container">
                <h2>🎯 SEO Priority Tasks</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Impact</th>
                            <th>Effort</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${seoPriorities.map(task => `
                        <tr>
                            <td>${task.task}</td>
                            <td><span class="badge badge-${task.impact === 'High' ? 'high' : task.impact === 'Medium' ? 'medium' : 'low'}">${task.impact}</span></td>
                            <td>${task.effort}</td>
                            <td><span class="badge badge-${task.status}">${task.status}</span></td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="insight-box">
                    <strong>💡 Quick Wins:</strong> Start with "Disable thin translations" and "Clean robots.txt" - both are high impact, low effort.
                </div>
            </div>

            <!-- Content Opportunities -->
            <div class="chart-container">
                <h2>🎁 Content Gap Opportunities</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Est. Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contentOpportunities.map(opp => `
                        <tr>
                            <td><strong>${opp.category}</strong></td>
                            <td><span class="badge badge-${opp.priority === 'High' ? 'high' : 'medium'}">${opp.priority}</span></td>
                            <td>${opp.estimatedValue}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="insight-box">
                    <strong>🎯 Focus:</strong> Area Guides and Buying Process Education are high-priority gaps that competitors are missing.
                </div>
            </div>
        </div>

        <!-- Backlink Tracker Summary -->
        <div class="chart-container">
            <h2>🔗 Backlink Outreach Tracker Summary</h2>
            <div class="grid" style="margin-top: 20px;">
                <div class="card" style="background: #0f172a;">
                    <h2>By Status</h2>
                    <ul style="list-style: none; margin-top: 12px;">
                        <li style="padding: 8px 0; border-bottom: 1px solid #334155;">
                            <span style="color: #22c55e;">●</span> Outreach Sent: <strong>${backlinkStats.outreachSent}</strong>
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #334155;">
                            <span style="color: #3b82f6;">●</span> Email Found: <strong>${backlinkStats.emailFound}</strong>
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #334155;">
                            <span style="color: #f59e0b;">●</span> Form Submitted: <strong>${backlinkStats.formSubmitted}</strong>
                        </li>
                        <li style="padding: 8px 0;">
                            <span style="color: #64748b;">●</span> Pending: <strong>${backlinkStats.pending}</strong>
                        </li>
                    </ul>
                </div>
                <div class="card" style="background: #0f172a;">
                    <h2>By Category</h2>
                    <ul style="list-style: none; margin-top: 12px;">
                        ${Object.entries(backlinkStats.byCategory).map(([cat, count]) => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #334155;">
                            <span style="color: #3b82f6;">●</span> ${cat}: <strong>${count}</strong>
                        </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="card" style="background: #0f172a;">
                    <h2>By Target Site</h2>
                    <ul style="list-style: none; margin-top: 12px;">
                        ${Object.entries(backlinkStats.byTarget).map(([site, count]) => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #334155;">
                            <span style="color: #22c55e;">●</span> ${site}: <strong>${count}</strong>
                        </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Action Items -->
        <div class="chart-container">
            <h2>✅ Recommended Actions This Week</h2>
            <div class="two-col">
                <div>
                    <h3 style="color: #3b82f6; margin-bottom: 12px;">High Priority</h3>
                    <ul class="action-list">
                        <li>Complete robots.txt cleanup</li>
                        <li>Disable Polylang thin translations</li>
                        <li>Request indexing for top 10 money pages</li>
                        <li>Send batch outreach to 20 pending sites</li>
                    </ul>
                </div>
                <div>
                    <h3 style="color: #22c55e; margin-bottom: 12px;">Content Creation</h3>
                    <ul class="action-list">
                        <li>Write Maitama area guide (1,000 words)</li>
                        <li>Create C-of-O verification checklist</li>
                        <li>Film TikTok: "Property Scams to Avoid"</li>
                        <li>Schedule 2 weeks of social posts</li>
                    </ul>
                </div>
            </div>
            <div class="insight-box" style="margin-top: 20px;">
                <strong>📊 Next Review:</strong> Run this dashboard weekly to track progress. Target: Move email_found sites to outreach_sent, complete all Quick Win SEO tasks by end of week.
            </div>
        </div>

        <footer>
            <p>Airealent.ng Analytics Dashboard | Built for Israel | ${new Date().toLocaleDateString()}</p>
            <p style="margin-top: 8px; opacity: 0.6;">Data sources: Backlink Outreach Tracker, Competitor Analysis, SEO Indexing Plan</p>
        </footer>
    </div>

    <script>
        // Backlink Chart
        const backlinkCtx = document.getElementById('backlinkChart').getContext('2d');
        new Chart(backlinkCtx, {
            type: 'doughnut',
            data: {
                labels: ${JSON.stringify(Object.keys(backlinkStats.byCategory))},
                datasets: [{
                    data: ${JSON.stringify(Object.values(backlinkStats.byCategory))},
                    backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#e2e8f0' } }
                }
            }
        });

        // Lead Pipeline Chart
        const leadCtx = document.getElementById('leadChart').getContext('2d');
        new Chart(leadCtx, {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(Object.keys(leadMetrics.stages))},
                datasets: [{
                    label: 'Leads',
                    data: ${JSON.stringify(Object.values(leadMetrics.stages))},
                    backgroundColor: ['#3b82f6', '#06b6d4', '#f59e0b', '#22c55e', '#10b981']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    </script>
</body>
</html>`;
};

// Generate and save dashboard
try {
    const dashboardHTML = generateDashboard();
    fs.writeFileSync(outputPath, dashboardHTML);
    console.log(`\n✅ Dashboard generated successfully!`);
    console.log(`📊 Output: ${outputPath}`);
    console.log(`\n📈 Dashboard includes:`);
    console.log(`   • Backlink outreach progress (${backlinkStats.outreachSent}/${backlinkStats.total} sites)`);
    console.log(`   • Content calendar (${generateContentCalendar().length} items for March 2026)`);
    console.log(`   • SEO priority tasks (${seoPriorities.length} tasks tracked)`);
    console.log(`   • Content gap opportunities (${contentOpportunities.length} categories)`);
    console.log(`   • Lead pipeline visualization`);
    console.log(`\n🚀 Open the HTML file in your browser to view the dashboard.`);
} catch (error) {
    console.error('Error generating dashboard:', error.message);
    process.exit(1);
}
