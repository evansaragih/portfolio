const experiences = [
  {
    logo: 'https://www.figma.com/api/mcp/asset/4ac013f7-2869-4ecb-a116-2dd2bda35c3c',
    company: 'Hyge Pte. Ltd.',
    role: 'Project Manager',
    location: '🇸🇬 Singapore • Remote',
    date: 'Aug 2024 - Mar 2026',
  },
  {
    logo: 'https://www.figma.com/api/mcp/asset/4ac013f7-2869-4ecb-a116-2dd2bda35c3c',
    company: 'Hyge Pte. Ltd.',
    role: 'UI/UX Designer',
    location: '🇸🇬 Singapore • Remote',
    date: 'Jan 2023 - Aug 2024',
  },
  {
    logo: 'https://www.figma.com/api/mcp/asset/47b9fca8-4156-4df1-a707-13d8ef1d6232',
    company: 'PT. Timedoor Indonesia',
    role: 'Educational Video Editor',
    location: '🇮🇩 Indonesia • Hybrid',
    date: 'Apr 2021 - Sep 2022',
  },
  {
    logo: 'https://www.figma.com/api/mcp/asset/7287e37b-c030-42e9-a7c0-c3e3ed5111dd',
    company: 'PT. Tria Binar Meraki',
    role: 'Social Media Designer',
    location: '🇮🇩 Indonesia • Freelance',
    date: 'Jan 2021 - May 2021',
  },
  {
    logo: 'https://www.figma.com/api/mcp/asset/7287e37b-c030-42e9-a7c0-c3e3ed5111dd',
    company: 'PT. Tria Binar Meraki',
    role: 'Web Developer',
    location: '🇮🇩 Indonesia • Freelance',
    date: 'Aug 2020 - Sep 2020',
  },
];

const workPhotos = [
  'https://www.figma.com/api/mcp/asset/a399bd97-7c83-4aad-b43f-2d37fa4ace29',
  'https://www.figma.com/api/mcp/asset/e262823b-00db-4f5d-b68b-461d207ab5a5',
  'https://www.figma.com/api/mcp/asset/af55a8c3-21eb-4fab-b6b4-0269c24e4227',
  'https://www.figma.com/api/mcp/asset/78878edb-8c40-4ecd-a444-2f065669c4a4',
  'https://www.figma.com/api/mcp/asset/71dbb96d-0a4e-4179-906f-55832108f6fd',
  'https://www.figma.com/api/mcp/asset/b18ff8b7-92e2-43cf-901b-49999e50758f',
  'https://www.figma.com/api/mcp/asset/34fd780c-eee2-4179-a614-a5044bb968dd',
  'https://www.figma.com/api/mcp/asset/129a2789-a6cd-42b5-90ce-2c926b13561c',
  'https://www.figma.com/api/mcp/asset/51ff6e04-d2dc-4c2c-b8bd-c072ba14960d',
  'https://www.figma.com/api/mcp/asset/57e89b0a-e8c0-46ef-806d-d739740e77db',
];

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="experience-grid">

          <div className="experience-left" data-reveal>
            {experiences.map((exp, i) => (
              <div className="exp-card" key={i}>
                <div className="exp-card-top">
                  <img src={exp.logo} alt={exp.company} className="exp-logo" />
                  <div className="exp-text">
                    <p className="exp-role">{exp.role}</p>
                    <p className="exp-company">{exp.company}</p>
                  </div>
                </div>
                <div className="exp-card-bottom">
                  <span className="exp-location">{exp.location}</span>
                  <span className="exp-date">{exp.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="experience-right" data-reveal>
            <div className="experience-right-card">
              <h2 className="section-title">Work Experience</h2>
              <p className="section-sub">
                From Designer to Project Manager. From crafting interfaces to leading teams.
                From pixels to people, timelines, and delivery.
              </p>
              <div className="work-photos-grid">
                {workPhotos.map((src, i) => (
                  <img key={i} src={src} alt="Work photo" className="work-photo" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
