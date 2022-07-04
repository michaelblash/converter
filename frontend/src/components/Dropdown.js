export default ({ value, onChange, options }) => {
  return <select
    value={value}
    onChange={e => onChange(options.find(opt => opt.value == e.target.value).value)}>
    {options.map(option => <option value={option.value}>{option.title}</option>)}
  </select>;
};
