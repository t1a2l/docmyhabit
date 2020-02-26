import React, {useState, useRef, useMemo, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import throttle from 'lodash/throttle';

function getLocation() {
    const autocompleteService = { current: null };
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const loaded = useRef(false);
  

    function loadScript(src, position, id) {
        if (!position) {
          return;
        }
        const script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('id', id);
        script.src = src;
        position.appendChild(script);
    }

    function a() {
        if (typeof window !== 'undefined' && !loaded.current) {
            if (!document.querySelector('#google-maps')) {
              loadScript(
                'https://maps.googleapis.com/maps/api/js?key=AIzaSyBwRp1e12ec1vOTtGiA4fcCt2sCUS78UYc&libraries=places',
                document.querySelector('head'),
                'google-maps',
              );
            }
            loaded.current = true;
          }
    }
    
  
    function handleChange(event) {
      setInputValue(event.target.value);
    };
  
    const fetch = useMemo(
      () =>
        throttle((input, callback) => {
          autocompleteService.current.getPlacePredictions(input, callback);
        }, 200),
      [],
    );
  
    useEffect(() => {
      let active = true;
  
      if (!autocompleteService.current && window.google) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
      if (!autocompleteService.current) {
        return undefined;
      }
  
      if (inputValue === '') {
        setOptions([]);
        return undefined;
      }
  
      fetch({ input: inputValue }, results => {
        if (active) {
          setOptions(results || []);
        }
      });
  
      return () => {
        active = false;
      };
    }, [inputValue, fetch]);
  
    return (
      <Autocomplete
        id="google-map-demo"
        style={{ width: 300 }}
        getOptionLabel={option => (typeof option === 'string' ? option : option.description)}
        filterOptions={x => x}
        options={options}
        autoComplete
        includeInputInList
        freeSolo
        disableOpenOnFocus
        renderInput={params => (
          <TextField
            {...params}
            label="Add a location"
            variant="outlined"
            fullWidth
            onChange={handleChange}
          />
        )}
        renderOption={option => {
          const matches = option.structured_formatting.main_text_matched_substrings;
          const parts = parse(
            option.structured_formatting.main_text,
            matches.map(match => [match.offset, match.offset + match.length]),
          );
  
          return (
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon/>
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}
  
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
    );
  }


export default getLocation;