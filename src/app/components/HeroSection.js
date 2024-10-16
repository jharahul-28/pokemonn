import React from 'react';
import styles from "./HeroSection.module.css";
import Navbar from './Navbar';

const HeroSection = () => {
  return (
    <div className={styles.heroSection}>
      <Navbar/>
      <div className={styles.hSContent}>
        <div>WELCOME TO <div>Pokémon</div> LAND</div>
        <div></div>
      </div>
    </div>
  )
}

export default HeroSection