'use client';

import Select, { MultiValue, StylesConfig } from 'react-select';

interface TopicOption {
  value: string;
  label: string;
  color: string;
  bg: string;
}

const topicOptions: TopicOption[] = [
  { value: 'Tech', label: 'Tech', color: '#1E3A8A', bg: '#DBEAFE' },         
  { value: 'Life', label: 'Life', color: '#166534', bg: '#DCFCE7' },          
  { value: 'Philosophy', label: 'Philosophy', color: '#92400E', bg: '#FEF3C7' },  
  { value: 'Gaming', label: 'Gaming', color: '#7C3AED', bg: '#EDE9FE' },      
  { value: 'Music', label: 'Music', color: '#B91C1C', bg: '#FEE2E2' },         
];

export default function TopicSelector({
  onChange,
  value = [],
}: {
  onChange: (topics: string[]) => void;
  value?: string[];
}) {
  const selectedOptions = topicOptions.filter(opt => value.includes(opt.value));

  const customStyles: StylesConfig<TopicOption, true> = {
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.bg,
      color: data.color,
      borderRadius: '6px',
      padding: '2px 4px',
    }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
      fontWeight: 600,
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      ':hover': {
        backgroundColor: 'transparent',
        color: 'black',
      },
    }),
  };

  const handleChange = (selected: MultiValue<TopicOption>) => {
    onChange(selected.map(s => s.value));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Select Topics</label>
      <Select
        isMulti
        options={topicOptions}
        value={selectedOptions}
        onChange={handleChange}
        className="text-black"
        styles={customStyles}
      />
    </div>
  );
}