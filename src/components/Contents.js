import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";

const Contents = () => {
  const graphList = [
    "누적 확진자 추이",
    "월별 격리자 현황",
    `누적 확진, 해제, 사망(${new Date().getMonth() + 1}월)`,
  ];
  const [confirmedData, setConfirmedData] = useState({
    labels: [],
    datasets: [],
  });
  const [quarantinedData, setQuarantinedData] = useState({
    labels: [],
    datasets: [],
  });
  const [comparedData, setComparedData] = useState({
    labels: [],
    datasets: [],
  });
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get(
        "https://api.covid19api.com/total/dayone/country/kr"
      );
      makeData(res.data);
    };
    const makeData = (items) => {
      const arr = items.reduce((acc, cur) => {
        const currentDate = new Date(cur.Date);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        const confirmed = cur.Confirmed;
        const active = cur.Active;
        const death = cur.Deaths;
        const recovered = cur.Recovered;

        const findItem = acc.find(
          (data) => data.year === year && data.month === month
        );

        if (!findItem) {
          acc.push({ year, month, date, confirmed, active, death, recovered });
        }
        if (findItem && findItem.date < date && findItem.year === year) {
          findItem.year = year;
          findItem.month = month;
          findItem.date = date;
          findItem.confirmed = confirmed;
          findItem.active = active;
          findItem.death = death;
          findItem.recovered = recovered;
        }
        return acc;
      }, []);

      const labels = arr.map((data) => `${data.month + 1}월`);
      setConfirmedData({
        labels,
        datasets: [
          {
            label: graphList[0],
            backgroundColor: "salmon",
            fill: true,
            data: arr.map((data) => data.confirmed),
          },
        ],
      });
      setQuarantinedData({
        labels,
        datasets: [
          {
            label: graphList[1],
            borderColor: "green",
            fill: false,
            data: arr.map((data) => data.active),
          },
        ],
      });
      const last = arr[arr.length - 1];
      setComparedData({
        labels: ["확진자", "격리해제", "사망"],
        datasets: [
          {
            label: graphList[2],
            backgroundColor: ["tomato", "gray", "yellow"],
            borderColor: ["tomato", "gray", "yellow"],
            fill: false,
            data: [last.confirmed, last.recovered, last.death],
          },
        ],
      });
    };
    fetchEvents();
  }, []);

  return (
    <section className="contents">
      <h2>국내 코로나 현황</h2>
      <div>
        <Bar
          data={confirmedData}
          options={
            ({
              title: { display: true, text: graphList[0], fontsize: 16 },
            },
            { legend: { display: true, position: "bottom" } })
          }
        />
        <Line
          data={quarantinedData}
          options={
            ({
              title: { display: true, text: graphList[1], fontsize: 16 },
            },
            { legend: { display: true, position: "bottom" } })
          }
        />
        <Doughnut
          data={comparedData}
          options={
            ({
              title: { display: true, text: graphList[2], fontsize: 16 },
            },
            { legend: { display: true, position: "bottom" } })
          }
        />
      </div>
    </section>
  );
};

export default Contents;
