import React, { useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";

const Contents = () => {
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(
        "https://api.covid19api.com/total/dayone/country/kr"
      );
      console.log(res);
    };
    fetchEvents();
  }, []);

  return (
    <section className="contents">
      <h2>국내 코로나 현황</h2>
      <div></div>
    </section>
  );
};

export default Contents;
