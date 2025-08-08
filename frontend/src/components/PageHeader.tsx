import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/page-header.css";

interface PageHeaderProps {
  title: string;
  breadcrumb?: string[];
  image?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumb = [],
  image,
}) => {
  return (
    <div 
      className="page-header bg-section"
      style={{
        backgroundImage: `url(${image ? `cdn/cars/${image}` : "/img/about_us/about.jpg"})`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-header-box">
              <h1>{title}</h1>
              {breadcrumb.length > 0 && (
                <nav>
                  <ol className="breadcrumb">
                    {breadcrumb.map((item, index) => (
                      <li
                        key={index}
                        className={`breadcrumb-item ${
                          index === breadcrumb.length - 1 ? "active" : ""
                        }`}
                        aria-current={
                          index === breadcrumb.length - 1 ? "page" : undefined
                        }
                      >
                        {index !== breadcrumb.length - 1 ? (
                          <Link
                            to={
                              index === 0
                                ? "/"
                                : `./${item.toLowerCase().replace(" ", "-")}`
                            }
                          >
                            {item}
                          </Link>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
