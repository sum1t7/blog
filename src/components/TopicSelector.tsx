'use client';

import Select from 'react-select';

const topicOptions = [
  { value: 'Tech', label: 'Tech', color: '#1E3A8A', bg: '#DBEAFE' },         // Blue
  { value: 'Life', label: 'Life', color: '#166534', bg: '#DCFCE7' },         // Green
  { value: 'Philosophy', label: 'Philosophy', color: '#92400E', bg: '#FEF3C7' }, // Yellow-Brown
  { value: 'Gaming', label: 'Gaming', color: '#7C3AED', bg: '#EDE9FE' },     // Purple
  { value: 'Music', label: 'Music', color: '#B91C1C', bg: '#FEE2E2' },        // Red
];

export default function TopicSelector({
  onChange,
  value = [],
}: {
  onChange: (topics: string[]) => void;
  value?: string[];
}) {
  const selectedOptions = topicOptions.filter(opt => value.includes(opt.value));

  const customStyles = {
    multiValue: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: data.bg,
      color: data.color,
      borderRadius: '6px',
      padding: '2px 4px',
    }),
    multiValueLabel: (styles: any, { data }: any) => ({
      ...styles,
      color: data.color,
      fontWeight: 600,
    }),
    multiValueRemove: (styles: any) => ({
      ...styles,
      ':hover': {
        backgroundColor: 'transparent',
        color: 'black',
      },
    }),
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Select Topics</label>
      <Select
        isMulti
        options={topicOptions}
        value={selectedOptions}
        onChange={(selected) => onChange(selected.map((s: any) => s.value))}
        className="text-black"
        styles={customStyles}
      />
    </div>
  );
}
