import React from "react";
import axios from 'axios';
import { Slide } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import TaskTable from "./TaskTable.tsx";

const Tasks = () => {
  const hoge: string = "";
  const getNotionDatabaseData = async () => {
    const token = 'secret_xSth6IX9nYQ2hzYIBiJQeaLuksxg0czyANw0q6sfrdf';
    const databaseId = '425af77e016c48da823b452f66035fc6';
    const response = await axios({
      method: 'post',
      url: 'https://api.notion.com/v1/databases/' + databaseId + '/query',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28', // 2022年7月時点 必要に応じて変更してください
      },
      data: {
        filter: {
          and: [ // 配列でand条件を設定可能
            //   {
            //     property: "期日",
            //     date: { // notionの日付型
            //       equals: "2022-07-22", // 期日が2022-07-22のものを抽出
            //     }
            //   },
            //   {
            //     property: "ステータス",
            //     select: { // notionのセレクトボックス型（単数選択）
            //       equals: "未着手", // 未着手のものを抽出
            //     }
            //   },
          ]
        },
      }
    }).catch((error) => {
      //接続に失敗した場合の処理
      console.log('err', error);
    });
    // データ1件以上取得できた場合
    if (response && response.data) {
      for (const data of response.data.results) {
        // 取得したテーブルデータを使った処理を記述
        console.log('**********************');
        console.log(data);
        console.log('**********************');
      }
    }
  };
  // const { Client } = require('@notionhq/client');

  // const getStaticProps = async () => {
  //   // const notion = new Client({ auth: process.env.NOTION_API_KEY });
  //   const token = "secret_xSth6IX9nYQ2hzYIBiJQeaLuksxg0czyANw0q6sfrdf";
  //   const databaseId = "425af77e016c48da823b452f66035fc6";

  //   const notion = new Client({ auth: token });

  //   const data = await notion.databases.query({ database_id: databaseId });

  //   console.log(data)

  // }

  const [isDetail, setIsDetail] = React.useState(false);


  return <div>
    <TaskTable />
  </div>;
};

export default Tasks;
