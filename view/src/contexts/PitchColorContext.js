import React from 'react';
import {scaleOrdinal, schemeCategory10} from 'd3';

const pitchTypeOrder = ["FF", "CH", "CU", "SL", "FT", "FC", "KC", "SI", "FS", "Others"];
const pitchColor = scaleOrdinal(schemeCategory10).domain(pitchTypeOrder);

export default React.createContext(pitchColor)