import React from 'react';
import styles from './styles.module.css';
import { useColorMode } from '@docusaurus/theme-common';


function Hero({ heading, subheading, showGraphic = false, customStyles = {} }) {
  const { isDarkTheme } = useColorMode();
  return (
    <header className={` ${styles.Hero} container-fluid`} style={customStyles && customStyles}>
      {showGraphic && (
        <div className={styles.showGraphic}></div>
      )}
      <div className={`container`}>
        <div className="row justify-content-center">
          <div className="col col--7">
            <h1>{heading}</h1>
            <p>{subheading}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;

