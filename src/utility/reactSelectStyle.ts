const customSelectStyles = {
  /// sets the z-index of the dropdown to 9999 to make it appear on top of everything else
  menuPortal: (provided: any) => ({ ...provided, zIndex: 9999 }),
  menu: (provided: any) => ({ ...provided, zIndex: 9999 }),
  control: (base: any) => ({
    ...base,
    border: '2px solid red',
    '&:hover': { border: '2px solid blue' },
    cursor: 'pointer',
    '& > *': {
      pointerEvents: 'none',
    },
  }),
};

export default customSelectStyles;
