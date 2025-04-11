import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../CSS/first.css";
import { Element, scroller } from "react-scroll"; 
import {motion} from 'motion/react';

function First() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSecondSection, setShowSecondSection] = useState(false);
  const [step, setStep] = useState(0);
  const secondSectionRef = useRef(null);
 

  const words = ["INSTANT", "SECURE", "GLOBALLY"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setShowSecondSection(true);
    setTimeout(() => {
      scroller.scrollTo("secondSection", {
        duration: 800,
        smooth: "easeInOutQuart",
      });

      let delay = 500;
      [1, 2, 3, 4].forEach((i) => {
        setTimeout(() => setStep(i), i * delay);
      });
    }, 500);
  };
  
  return (
    <div>
      <div className="scene">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face left"></div>
          <div className="face right"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>

      <div className="hero">
        <nav className="navbar">
          <div className="logo">NextGen Certificate Verification System</div>
          <div className="nav-links">
            <Link to="/Login" className="nav-btn">Login</Link>
            <Link to="/verify" className="nav-btn">Verify</Link>
          </div>
        </nav>

        <div className="glass-container">
          <h1 className="logo">A Secure & Tamper-Proof Way to Verify Academic Records</h1>
          <p>
            Leveraging blockchain technology, our platform ensures{" "}
            <span className="changing-word">{words[currentWordIndex]}</span>, verifiable academic certificates.
          </p>
          <button className="cta-button" onClick={handleClick}>
            Learn More &darr;
          </button>
        </div>

        <div className="mouse-light" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />
      </div>
      <Element name="secondSection">
      <div ref={secondSectionRef} className={`second-section ${showSecondSection ? "show" : ""}`}>
        {step >= 1 && <h2 className="fade-in" id='work'>How it Works<span className="stroke-text">?</span></h2>}
        <div className="info-grid">
          {step >= 2 && (
            <div className="info-box fade-in">
              <h3>1. Upload</h3>
              <p>Institutions upload student records, encrypting data securely.</p>
            </div>
          )}
          {step >= 3 && (
            <div className="info-box fade-in">
              <h3>2. Blockchain Storage</h3>
              <p>Records are hashed and stored on an immutable blockchain.</p>
            </div>
          )}
          {step >= 4 && (
            <div className="info-box fade-in">
              <h3>3. Instant Verification</h3>
              <p>Employers & universities can verify records with a simple hash match.</p>
            </div>
          )}
        </div>
        {step >= 4 && (
          <>
            <h2 className="fade-in" >Why Choose Us<span className="stroke-text">?</span></h2>
            <p className="fade-in">Eliminate fraud, simplify verification, and provide record authenticity.</p>
          </>
        )}
      </div>
      </Element>
    </div>
  );
}

export default First;
