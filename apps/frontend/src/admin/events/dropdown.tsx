import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";

type DropdownOption = {
  id: string;
  value: string;
};

interface DropdownType<T extends DropdownOption> {
  labelId: string;
  name: string;
  label: string;
  options: T[];
  onChange?: (value: string) => void; // Optional callback if needed
  error?: boolean
}

const Dropdown = <T extends DropdownOption>({
  labelId,
  name,
  label,
  options,
  onChange,
  error
}: DropdownType<T>) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleSelectInputChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setSelectedValue(value);
    if (onChange) onChange(value); // Trigger callback if provided
  };

  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        name={name}
        label={label}
        value={selectedValue}
        onChange={handleSelectInputChange}
        fullWidth
        error={error}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
