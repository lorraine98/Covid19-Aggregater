import React from "react";

const Header = () => {
  return (
    <header className="header">
      <h1>COVID-19</h1>
      <section>
        <select>
          <option>국내</option>
          <option>해외</option>
        </select>
      </section>
    </header>
  );
};

export default Header;
