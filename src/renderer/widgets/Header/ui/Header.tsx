import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header id="header">
      <nav>
        <ul className="header__list">
          <li>
            <Link to="/service">Обслуживание</Link>
          </li>
          <li>
            <Link to="/equipment">Учет технических средств</Link>
          </li>
          <li>
            <Link to="/spare-parts">Запасные инструменты и принадлежности</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export { Header };
