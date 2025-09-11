import React from 'react'
import { Link } from 'react-router-dom'

function CourseCard({ title, description, icon, link, topics }) {
  return (
    <div className="col-md-6 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <div className="text-center mb-3">
            <i className={`${icon} display-4 text-primary`}></i>
          </div>
          <h5 className="card-title text-center">{title}</h5>
          <p className="card-text flex-grow-1">{description}</p>
          
          {topics && (
            <div className="mb-3">
              <small className="text-muted">Temas principales:</small>
              <ul className="list-unstyled mt-1">
                {topics.slice(0, 2).map((topic, index) => (
                  <li key={index} className="small">
                    <i className="bi bi-check-circle-fill text-success me-1"></i>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Link to={link} className="btn btn-primary mt-auto">
            Ver Detalles
            <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard