# Visual Analytics for Baseball Pitching Strategy

## Install & Run
* Docker
## Project Structure
只列出較重要的檔案
```
root
+--- view
     +--- components
          +--- BarChart.jsx
          +--- BarChartWithoutAxis.jsx
          +--- Bases.jsx
          +--- Filter.jsx
          +--- PitcherFilter.jsx
          +--- StateFilter.jsx
          +--- Scatter.jsx
          +--- Timeline.jsx
          +--- PitcherList.jsx
          +--- GameList.jsx
          +--- PitchSeqCardBoard.jsx
          +--- PitchSeqCard.jsx
          +--- LinearLegend.jsx
          +--- PitchTypeMatrix.jsx
          +--- SpeedMatrix.jsx
          +--- LocationMatrix.jsx
          +--- xAxis.jsx
          +--- yAxis.jsx
     +--- utils
          +--- ActionMaker.js
          +--- getTypeSet.js
          +--- GlobalStateInit.js
          +--- transitionMatrix.js
     +--- reducer
          +--- GlobalReducer.js
     +--- index.js
     +--- zone.js
+--- server.js

```

### TODO
* Clear magic number
* [BUG] GameList multi-select Bug
* [BUG] Timeline brush color-missing Bug(sometimes)
* [BUG] StateFilter some bases state not work
* [BUG] StateFilter batter field not work
### Contact

* hsfo3o@gmail.com
