import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { DataTable } from 'renderer/widgets/DataTable';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Техника',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Организации',
    children: <DataTable />,
  },
  {
    key: '3',
    label: 'Помещения',
    children: 'Content of Tab Pane 3',
  },
];

function TableTabs() {
  const onChange = (key: string) => {
    console.log(key);
  };
  return <Tabs onChange={onChange} type="card" items={items} />;
}

export { TableTabs };
