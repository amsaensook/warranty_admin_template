import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { selectAuth } from "../../contexts/slices/authSlice";

import Template from "../../components/Template";
import ReactDOM from 'react-dom';
// import { Line } from '@ant-design/charts';

// const data = [
//   { year: '1991', value: 3 },
//   { year: '1992', value: 4 },
//   { year: '1993', value: 3.5 },
//   { year: '1994', value: 5 },
//   { year: '1995', value: 4.9 },
//   { year: '1996', value: 6 },
//   { year: '1997', value: 7 },
//   { year: '1998', value: 9 },
//   { year: '1999', value: 13 },
// ];

// const config = {
//   data,
//   width: 800,
//   height: 400,
//   autoFit: false,
//   xField: 'year',
//   yField: 'value',
//   point: {
//     size: 5,
//     shape: 'diamond',
//   },
//   label: {
//     style: {
//       fill: '#aaa',
//     },
//   },
// };

// let chart:any;

// // Export Image
// const downloadImage = () => {
//   chart?.downloadImage();
// };

// // Get chart base64 string
// const toDataURL = () => {
//   console.log(chart?.toDataURL());
// };

const data_Bar = [
    {
      type: '家具家电',
      sales: 38,
    },
    {
      type: '粮油副食',
      sales: 52,
    },
    {
      type: '生鲜水果',
      sales: 61,
    },
    {
      type: '美容洗护',
      sales: 145,
    },
    {
      type: '母婴用品',
      sales: 48,
    },
    {
      type: '进口食品',
      sales: 38,
    },
    {
      type: '食品饮料',
      sales: 38,
    },
    {
      type: '家庭清洁',
      sales: 38,
    },
  ];
  // const config_Bar = {
  //   data,
  //   xField: 'sales',
  //   yField: 'type',
  //   barWidthRatio: 0.8,
  //   meta: {
  //     type: {
  //       alias: '类别',
  //     },
  //     sales: {
  //       alias: '销售额',
  //     },
  //   },
  // };
  const data1 = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
  ]; 

  const data = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
  ];
  const config_Pie = {
    appendPadding: 10,
    data1,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };



const Main: React.FC = () => {

  const { authResult } = useSelector(selectAuth);

  return (
    <>
      <Template listSubMenu={authResult.data.permission}>
  
      {/* <div>
        <button type="button" onClick={downloadImage} style={{ marginRight: 24 }}>
          Export Image
        </button>
        <button type="button" onClick={toDataURL}>
          Get base64
        </button>
        <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
      </div> */}
      {/* <div>
      <Bar {...config_Bar} />;
      </div> */}
      {/* <div>
      <Pie {...config_Pie} />;
      </div> */}

      </Template>;
    </>
    );
    
  
};

export default Main;
