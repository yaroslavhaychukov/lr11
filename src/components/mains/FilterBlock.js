import React, { useEffect } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@mui/material';

const FilterBlock = ({
  workshops,
  selectedWorkshops,
  setSelectedWorkshops,
  needsRepair,
  setNeedsRepair,
  manufacturers,
  selectedManufacturers,
  setSelectedManufacturers,
  resetFilters,
  searchTerm,
  setSearchTerm,
  page,
  sortType,
  setSortType,
}) => {
  useEffect(() => {
    resetFilters();
  }, []);

  return (
    <div className="FilterBlock">
      {!searchTerm && (
        <div className='FB'>
          <FormGroup >
            <InputLabel>Цех:</InputLabel>
            {workshops.map((workshop) => (
              <FormControlLabel
                key={workshop}
                control={
                  <Checkbox
                    checked={selectedWorkshops.includes(workshop)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedWorkshops((prev) =>
                        isChecked
                          ? [...prev, workshop]
                          : prev.filter((selectedWorkshop) => selectedWorkshop !== workshop)
                      );
                    }}
                  />
                }
                label={workshop}
              />
            ))}
          </FormGroup>
        </div>
      )}
      {page === 'Equipment' && !searchTerm && (
        <div className='FB'>
          <FormControlLabel
            control={
              <Checkbox
                checked={needsRepair}
                onChange={() => setNeedsRepair(!needsRepair)}
              />
            }
            label="Требует ремонта"
          />
        </div>
      )}
      {!searchTerm && (
        <div className='FB'>
          <FormGroup>
            <InputLabel>Производитель:</InputLabel>
            {manufacturers.map((manufacturer) => (
              <FormControlLabel
                key={manufacturer}
                control={
                  <Checkbox
                    checked={selectedManufacturers.includes(manufacturer)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedManufacturers((prev) =>
                        isChecked
                          ? [...prev, manufacturer]
                          : prev.filter(
                            (selectedManufacturer) => selectedManufacturer !== manufacturer
                          )
                      );
                    }}
                  />
                }
                label={manufacturer}
              />
            ))}
          </FormGroup>
        </div>
      )}

      <TextField
        type="text"
        placeholder="xxxxxx"
        value={searchTerm}
        label="Инвентарный номер"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {page === 'Journal' && (
        <>
          <InputLabel style={{ marginLeft: "20px" }}>Сортировка по дате ремонта:</InputLabel>
          <Select value={sortType} onChange={(e) => setSortType(e.target.value)} style={{ marginLeft: "20px", marginRight: "20px", marginBottom: "20px" }}>
            <MenuItem value="asc">По возрастанию</MenuItem>
            <MenuItem value="desc">По убыванию</MenuItem>
          </Select>
        </>
      )}
      <Button variant="contained" color="primary" onClick={resetFilters}>
        Сбросить фильтры
      </Button>
    </div>
  );
};

export default FilterBlock;
