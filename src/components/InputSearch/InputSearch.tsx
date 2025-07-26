import React, { useEffect, useState } from 'react'
import styles from './InputSearch.module.css'
import iconSearchDark from '../../assets/icons/searchDark.svg'
import iconSearch from '../../assets/icons/search.svg'

interface InputSearchProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputSearch = ({ onChange }: InputSearchProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains('dark');
    setIsDark(checkDark());
    const observer = new MutationObserver(() => setIsDark(checkDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.containerInputSearch}>
      <input className={styles.inputSearch} type="text" placeholder="Buscar productos..." onChange={onChange} />
      <img className={styles.icon} src={isDark ? iconSearch : iconSearchDark} alt="Search" />
    </div>
  )
}

export default InputSearch