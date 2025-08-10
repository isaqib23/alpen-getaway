import React from "react";
import { strings } from "../lang/vision-mission";

const visionMissionData = [
  {
    id: "vision",
    title: strings.VISION_TITLE,
    subtitle: strings.SUBTITLE,
    content: strings.INNOVATE,
    listItems: [strings.PRIORITY, strings.QUALITY, strings.BEST],
    imageSrc: "/img/about_us/2.png",
    active: true,
  },
  {
    id: "mission",
    title: "our mission",
    subtitle: strings.SUBTITLE_MISSION,
    content: strings.INNOVATE_MISSION,
    listItems: [
      strings.PRIORITY_MISSION,
      strings.QUALITY_MISSION,
      strings.BEST_MISSION,
    ],
    imageSrc: "/img/about_us/2.png",
    active: false,
  },
  {
    id: "approach",
    title: "our approach",
    subtitle: strings.SUBTITLE_Approach,
    content: strings.INNOVATE_APPROACH,
    listItems: [
      strings.PRIORITY_APPROACH,
      strings.QUALITY_APPROACH,
      strings.BEST_APPROACH,
    ],
    imageSrc: "/img/about_us/2.png",
    active: false,
  },
];

const VisionMission: React.FC = () => {
  return (
    <div className="vision-mission">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-12">
            <div className="section-title" style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '28px', fontWeight: '700' }}>{strings.HEADING}</h3>
              <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333', margin: '0 auto', maxWidth: '800px' }}>{strings.DESCRIPTION}</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="our-projects-nav">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                {visionMissionData.map((item, index) => (
                  <li className="nav-item" role="presentation" key={index}>
                    <button
                      className={`nav-link ${item.active ? "active" : ""}`}
                      id={`${item.id}-tab`}
                      data-bs-toggle="tab"
                      data-bs-target={`#${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={item.active}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="vision-mission-box tab-content" id="myTabContent">
              {visionMissionData.map((item, index) => (
                <div
                  className={`tab-pane fade ${
                    item.active ? "show active" : ""
                  }`}
                  id={item.id}
                  role="tabpanel"
                  key={index}
                >
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <div className="vision-mission-content">
                        <div className="section-title">
                          <h3>{item.title}</h3>
                          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333', margin: '10px 0', fontWeight: '500' }}>{item.subtitle}</p>
                          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', margin: '10px 0', fontWeight: '400' }}>{item.content}</p>
                        </div>

                        <div className="vision-mission-list">
                          <ul>
                            {item.listItems.map((listItem, i) => (
                              <li key={i}>{listItem}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="vision-image">
                        <img
                          className="image-anime custom-figure"
                          src={item.imageSrc}
                          alt={item.title}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
