import React from 'react'
import './Footer.css'

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      <div className="Footer-main">
        <div className="Footer-Container">
          <div className="Footer-Logo">2024 티끌. AII RIGHT RESERVED.</div>
          <div className="Footer-text">
            <div>service.tikkeul@gmail.com</div>
          </div>
        </div>
        <div className="Footer-up" onClick={scrollToTop}>
          <img src="img/up.svg" alt="Up" />
        </div>
      </div>
    </div>
  )
}

export default Footer
